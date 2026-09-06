import asyncRoute from "../lib/async-route.js";
import {
  findModule, findRound, getCourse, gradeQuestions, listCourses, sanitizeQuestion,
} from "../logic/courses.js";
import {
  getChallengeProgress, getLearningProgress, saveChallengeProgress, saveLearningProgress, deleteProgressRecord
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
    let [learningProgress, challengeProgress] = await Promise.all([
      getLearningProgress(request.user.id, request.params.courseId),
      getChallengeProgress(request.user.id, request.params.courseId),
    ]);

    const validLearningProgress = [];
    for (const record of learningProgress) {
      let isValid = false;
      const topic = curriculum.topics.find((t) => t.name === record.topic_name);
      if (topic) {
        const module = topic.subtopics.find((m) => m.id === record.subtopic_id);
        if (module) {
          const requiredScore = module.questions.length;
          if (record.high_score <= requiredScore && (!record.passed || record.high_score === requiredScore)) {
            isValid = true;
          }
        }
      }
      if (isValid) validLearningProgress.push(record);
      else deleteProgressRecord("learning_progress", record.id); // asynchronously delete
    }
    learningProgress = validLearningProgress;

    const validChallengeProgress = [];
    for (const record of challengeProgress) {
      let isValid = false;
      const topic = challenges.topics.find((t) => t.name === record.topic_name);
      if (topic) {
        const round = topic.rounds.find((r) => r.round_number === record.round_number);
        if (round) {
          const requiredScore = round.questions.length;
          if (record.high_score <= requiredScore && (!record.passed || record.high_score === requiredScore)) {
            isValid = true;
          }
        }
      }
      if (isValid) validChallengeProgress.push(record);
      else deleteProgressRecord("challenge_progress", record.id); // asynchronously delete
    }
    challengeProgress = validChallengeProgress;
    response.json({
      course: {
        id: definition.id,
        title: definition.title,
        description: definition.description,
        createdAt: definition.createdAt,
        updatedAt: definition.updatedAt,
      },
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
    const courseId = request.params.courseId;
    const topicName = decode(request.params.topic);
    const moduleId = request.params.moduleId;
    const { topic, module } = findModule(courseId, topicName, moduleId);
    const progress = await getLearningProgress(request.user.id, courseId);
    assertModuleUnlocked(topic, module.id, progress);

    const course = getCourse(courseId);
    let nextModuleUrl = null;
    const topicIndex = course.curriculum.topics.findIndex((t) => t.name === topic.name);
    if (topicIndex !== -1) {
      const moduleIndex = topic.subtopics.findIndex((m) => m.id === module.id);
      if (moduleIndex !== -1 && moduleIndex < topic.subtopics.length - 1) {
        nextModuleUrl = `/course/${courseId}/learn/${encodeURIComponent(topic.name)}/${topic.subtopics[moduleIndex + 1].id}`;
      } else if (topicIndex < course.curriculum.topics.length - 1) {
        const nextTopic = course.curriculum.topics[topicIndex + 1];
        nextModuleUrl = `/course/${courseId}/learn/${encodeURIComponent(nextTopic.name)}/${nextTopic.subtopics[0].id}`;
      }
    }

    response.json({
      id: module.id,
      title: module.title,
      content: module.content,
      image: module.image || "",
      questions: module.questions.map(sanitizeQuestion),
      requiredScore: module.questions.length,
      nextModuleUrl,
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
    const courseId = request.params.courseId;
    const topicName = decode(request.params.topic);
    const roundNumber = request.params.roundNumber;
    const { topic, round } = findRound(courseId, topicName, roundNumber);
    const progress = await getChallengeProgress(request.user.id, courseId);
    assertRoundUnlocked(topic, round.round_number, progress);

    const course = getCourse(courseId);
    let nextModuleUrl = null;
    const topicIndex = course.challenges.topics.findIndex((t) => t.name === topic.name);
    if (topicIndex !== -1) {
      const roundIndex = topic.rounds.findIndex((r) => r.round_number === round.round_number);
      if (roundIndex !== -1 && roundIndex < topic.rounds.length - 1) {
        nextModuleUrl = `/course/${courseId}/challenges/${encodeURIComponent(topic.name)}/${topic.rounds[roundIndex + 1].round_number}`;
      } else if (topicIndex < course.challenges.topics.length - 1) {
        const nextTopic = course.challenges.topics[topicIndex + 1];
        nextModuleUrl = `/course/${courseId}/challenges/${encodeURIComponent(nextTopic.name)}/${nextTopic.rounds[0].round_number}`;
      }
    }

    response.json({
      roundNumber: round.round_number,
      title: round.title,
      questions: round.questions.map(sanitizeQuestion),
      requiredScore: round.questions.length,
      nextModuleUrl,
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
