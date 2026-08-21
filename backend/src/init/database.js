import rethinkdbdash from "rethinkdbdash";
import { databaseName, databaseServers, r } from "../config/rethinkdb.js";

const TABLES = ["users", "learning_progress", "challenge_progress"];

async function waitForConnection() {
  const attempts = Number(process.env.RETHINKDB_INIT_MAX_ATTEMPTS) || 20;
  const retryMs = Number(process.env.RETHINKDB_INIT_RETRY_MS) || 1000;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const admin = rethinkdbdash({ servers: databaseServers, silent: true });
      const databases = await admin.dbList().run();
      if (!databases.includes(databaseName)) await admin.dbCreate(databaseName).run();
      await admin.getPoolMaster().drain();
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, retryMs));
    }
  }
}

async function ensureIndex(table, indexName, expression) {
  const indexes = await r.table(table).indexList().run();
  if (!indexes.includes(indexName)) {
    await r.table(table).indexCreate(indexName, expression).run();
    await r.table(table).indexWait(indexName).run();
  }
}

export async function initializeDatabase() {
  await waitForConnection();
  const tables = await r.tableList().run();
  for (const table of TABLES) {
    if (!tables.includes(table)) await r.tableCreate(table).run();
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
  console.log("RethinkDB is ready.");
}
