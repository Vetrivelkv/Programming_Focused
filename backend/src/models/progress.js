import { r } from "../config/rethinkdb.js";

async function rows(table, userId, courseId) {
  return r.table(table).getAll([userId, courseId], { index: "user_course" }).run();
}

export const getLearningProgress = (userId, courseId) =>
  rows("learning_progress", userId, courseId);
export const getChallengeProgress = (userId, courseId) =>
  rows("challenge_progress", userId, courseId);

async function save(table, index, key, record, score, passed) {
  const existing = await r.table(table).getAll(key, { index }).nth(0).default(null).run();
  if (existing) {
    const result = await r.table(table).get(existing.id).update({
      attempts: existing.attempts + 1,
      high_score: Math.max(existing.high_score, score),
      passed: existing.passed || passed,
      last_attempted_at: new Date(),
    }, { returnChanges: true }).run();
    return result.changes[0].new_val;
  }
  const result = await r.table(table).insert({
    ...record,
    attempts: 1,
    high_score: score,
    passed,
    last_attempted_at: new Date(),
  }, { returnChanges: true }).run();
  return result.changes[0].new_val;
}

export function saveLearningProgress(userId, courseId, topicName, subtopicId, score, passed) {
  return save("learning_progress", "unique_module",
    [userId, courseId, topicName, subtopicId],
    { user_id: userId, course_id: courseId, topic_name: topicName, subtopic_id: subtopicId },
    score, passed);
}

export function saveChallengeProgress(userId, courseId, topicName, roundNumber, score, passed) {
  return save("challenge_progress", "unique_round",
    [userId, courseId, topicName, Number(roundNumber)],
    { user_id: userId, course_id: courseId, topic_name: topicName, round_number: Number(roundNumber) },
    score, passed);
}
