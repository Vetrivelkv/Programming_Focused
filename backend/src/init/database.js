import {
  databaseName, r, runQuery, useDatabase,
} from "../config/rethinkdb.js";
import { withBoundedExponentialRetry } from "../lib/retry.js";

const TABLES = ["users", "learning_progress", "challenge_progress"];

const retryOptions = {
  attempts: Number(process.env.RETHINKDB_INIT_MAX_ATTEMPTS) || 6,
  initialDelayMs: Number(process.env.RETHINKDB_INIT_RETRY_MS) || 500,
  maxDelayMs: Number(process.env.RETHINKDB_INIT_MAX_RETRY_MS) || 5_000,
};

let initialized = false;
let initializationPromise = null;

async function ensureIndex(table, indexName, expression) {
  const indexes = await runQuery(r.table(table).indexList());
  if (!indexes.includes(indexName)) {
    await runQuery(r.table(table).indexCreate(indexName, expression));
    await runQuery(r.table(table).indexWait(indexName));
  }
}

async function migrate() {
  const databases = await runQuery(r.dbList());
  if (!databases.includes(databaseName)) await runQuery(r.dbCreate(databaseName));
  useDatabase(databaseName);

  const tables = await runQuery(r.tableList());
  for (const table of TABLES) {
    if (!tables.includes(table)) await runQuery(r.tableCreate(table));
  }
  await ensureIndex("users", "username", (row) => row("username"));
  await ensureIndex("learning_progress", "user_course", (row) => [
    row("user_id"), row("course_id"),
  ]);
  await ensureIndex("learning_progress", "unique_module", (row) => [
    row("user_id"), row("course_id"), row("topic_name"), row("subtopic_id"),
  ]);
  await ensureIndex("challenge_progress", "user_course", (row) => [
    row("user_id"), row("course_id"),
  ]);
  await ensureIndex("challenge_progress", "unique_round", (row) => [
    row("user_id"), row("course_id"), row("topic_name"), row("round_number"),
  ]);
}

export function initializeDatabase() {
  if (initialized) return Promise.resolve();
  if (initializationPromise) return initializationPromise;

  initializationPromise = withBoundedExponentialRetry(migrate, retryOptions)
    .then(() => {
      initialized = true;
      console.log("RethinkDB is ready.");
    })
    .finally(() => {
      initializationPromise = null;
    });
  return initializationPromise;
}

export function getDatabaseInitializationState() {
  return { initialized, initializing: Boolean(initializationPromise) };
}

export async function requireDatabase(_request, response, next) {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    console.error("Database initialization attempt failed:", error.message);
    response.status(503).json({
      code: "DATABASE_UNAVAILABLE",
      detail: "The database is waking up. Please try again shortly.",
    });
  }
}
