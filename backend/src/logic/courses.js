import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dataDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "data");

export const COURSE_DEFINITIONS = {
  understanding_typescript: {
    id: "understanding_typescript",
    title: "Understanding TypeScript",
    description: "Build a strong TypeScript foundation—from why static types matter to a working local toolchain and project workflow.",
    curriculum: "typescript_curriculum.json",
    questions: "typescript_questions.json",
    accent: "teal",
    createdAt: "2026-08-21",
    updatedAt: "2026-09-01",
  },
};

const cache = new Map();
function loadJson(filename) {
  if (!cache.has(filename)) {
    cache.set(filename, JSON.parse(fs.readFileSync(path.join(dataDirectory, filename), "utf8")));
  }
  return cache.get(filename);
}

export function listCourses() {
  return Object.values(COURSE_DEFINITIONS).map(({ curriculum, questions, ...course }) => ({
    ...course,
    topicCount: loadJson(curriculum).topics.length,
    moduleCount: loadJson(curriculum).topics.reduce((sum, topic) => sum + topic.subtopics.length, 0),
    roundCount: loadJson(questions).topics.reduce((sum, topic) => sum + topic.rounds.length, 0),
  }));
}

export function getCourse(id) {
  const definition = COURSE_DEFINITIONS[id];
  if (!definition) throw Object.assign(new Error("Course not found."), { status: 404 });
  return {
    definition,
    curriculum: loadJson(definition.curriculum),
    challenges: loadJson(definition.questions),
  };
}

export function findModule(courseId, topicName, subtopicId) {
  const course = getCourse(courseId);
  const topic = course.curriculum.topics.find((item) => item.name === topicName);
  const module = topic?.subtopics.find((item) => item.id === subtopicId);
  if (!module) throw Object.assign(new Error("Learning module not found."), { status: 404 });
  return { topic, module };
}

export function findRound(courseId, topicName, roundNumber) {
  const course = getCourse(courseId);
  const topic = course.challenges.topics.find((item) => item.name === topicName);
  const round = topic?.rounds.find((item) => item.round_number === Number(roundNumber));
  if (!round) throw Object.assign(new Error("Challenge round not found."), { status: 404 });
  return { topic, round };
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function sanitizeQuestion(question) {
  const { correct, correct_option_index, answer, explanation, ...safe } = question;
  if (safe.options) {
    safe.options = shuffleArray(safe.options);
  }
  return safe;
}

export function gradeQuestions(questions, answers = []) {
  let score = 0;
  const feedback = questions.map((question, index) => {
    const supplied = answers[index];
    const correctAnswer = question.type === "fib"
      ? question.answer
      : question.options[question.correct ?? question.correct_option_index];
    const correct = question.type === "fib"
      ? Boolean(supplied) && String(supplied).trim().toLowerCase() === String(correctAnswer).toLowerCase()
      : supplied === correctAnswer;
    if (correct) score += 1;
    return { index: index + 1, correct, correctAnswer, explanation: question.explanation };
  });
  return { score, total: questions.length, passed: score === questions.length, feedback };
}
