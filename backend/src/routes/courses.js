import asyncRoute from "../lib/async-route.js";
import {
  findModule, findRound, getCourse, gradeQuestions, listCourses, sanitizeQuestion,
} from "../logic/courses.js";
import {
  getChallengeProgress, getLearningProgress, saveChallengeProgress, saveLearningProgress,
} from "../models/progress.js";

const decode = (value) => decodeURIComponent(value);

function assertModuleUnlocked(topic, moduleId, progress) {
  const index = topic.subtopics.findIndex((module) => module.id === moduleId);
  if (index <= 0) return;
  const previousId = topic.subtopics[index - 1].id;
  const previousPassed = progress.some((row) =>
    row.topic_name === topic.name && row.subtopic_id === previousId && row.passed);
  if (!previousPassed) {
    throw Object.assign(new Error("Complete the previous learning module first."), { status: 403 });
  }
}

function assertRoundUnlocked(topic, roundNumber, progress) {
  const index = topic.rounds.findIndex((round) => round.round_number === Number(roundNumber));
  if (index <= 0) return;
  const previousNumber = topic.rounds[index - 1].round_number;
  const previousPassed = progress.some((row) =>
    row.topic_name === topic.name && row.round_number === previousNumber && row.passed);
  if (!previousPassed) {
    throw Object.assign(new Error("Pass the previous challenge round first."), { status: 403 });
  }
}

export default function registerCourseRoutes(app) {
  app.get("/api/courses", (_request, response) => response.json(listCourses()));

  app.get("/api/courses/:courseId/dashboard", asyncRoute(async (request, response) => {
    const { definition, curriculum, challenges } = getCourse(request.params.courseId);
    const [learningProgress, challengeProgress] = await Promise.all([
      getLearningProgress(request.user.id, request.params.courseId),
      getChallengeProgress(request.user.id, request.params.courseId),
    ]);
    response.json({
      course: { id: definition.id, title: definition.title, description: definition.description },
      learningTopics: curriculum.topics.map((topic) => ({
        name: topic.name,
        modules: topic.subtopics.map((module) => ({
          id: module.id, title: module.title, questionCount: module.questions.length,
        })),
      })),
      challengeTopics: challenges.topics.map((topic) => ({
        name: topic.name,
        rounds: topic.rounds.map((round) => ({
          roundNumber: round.round_number, title: round.title, questionCount: round.questions.length,
        })),
      })),
      learningProgress,
      challengeProgress,
    });
  }));

  app.get("/api/courses/:courseId/learn/:topic/:moduleId", asyncRoute(async (request, response) => {
    const { topic, module } = findModule(
      request.params.courseId, decode(request.params.topic), request.params.moduleId,
    );
    const progress = await getLearningProgress(request.user.id, request.params.courseId);
    assertModuleUnlocked(topic, module.id, progress);
    response.json({
      id: module.id,
      title: module.title,
      content: module.content,
      image: module.image || "",
      questions: module.questions.map(sanitizeQuestion),
      requiredScore: module.questions.length,
    });
  }));

  app.post("/api/courses/:courseId/learn/:topic/:moduleId/submit", asyncRoute(async (request, response) => {
    const topicName = decode(request.params.topic);
    const { topic, module } = findModule(request.params.courseId, topicName, request.params.moduleId);
    const progress = await getLearningProgress(request.user.id, request.params.courseId);
    assertModuleUnlocked(topic, module.id, progress);
    const result = gradeQuestions(module.questions, request.body.answers);
    await saveLearningProgress(
      request.user.id, request.params.courseId, topicName, module.id, result.score, result.passed,
    );
    response.json(result);
  }));

  app.get("/api/courses/:courseId/challenges/:topic/:roundNumber", asyncRoute(async (request, response) => {
    const { topic, round } = findRound(
      request.params.courseId, decode(request.params.topic), request.params.roundNumber,
    );
    const progress = await getChallengeProgress(request.user.id, request.params.courseId);
    assertRoundUnlocked(topic, round.round_number, progress);
    response.json({
      roundNumber: round.round_number,
      title: round.title,
      questions: round.questions.map(sanitizeQuestion),
      requiredScore: round.questions.length,
    });
  }));

  app.post("/api/courses/:courseId/challenges/:topic/:roundNumber/submit", asyncRoute(async (request, response) => {
    const topicName = decode(request.params.topic);
    const { topic, round } = findRound(request.params.courseId, topicName, request.params.roundNumber);
    const progress = await getChallengeProgress(request.user.id, request.params.courseId);
    assertRoundUnlocked(topic, round.round_number, progress);
    const result = gradeQuestions(round.questions, request.body.answers);
    await saveChallengeProgress(
      request.user.id, request.params.courseId, topicName, round.round_number,
      result.score, result.passed,
    );
    response.json(result);
  }));
}
