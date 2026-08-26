import rethinkdbdash from "rethinkdbdash";
import RethinkConnection from "rethinkdbdash/lib/connection.js";

export const databaseName = process.env.RETHINKDB_DB || "programming_focused";
export const databaseServers = (process.env.RETHINKDB_SERVERS || "127.0.0.1:39015")
  .split(",")
  .map((entry) => {
    const [host, port = "28015"] = entry.trim().split(":");
    return { host, port: Number(port) };
  });

const connectionTimeout = Number(process.env.RETHINKDB_TIMEOUT) || 20;
const idleTimeoutMs = Number(process.env.RETHINKDB_IDLE_TIMEOUT_MS) || 30_000;
const credentials = {};
if (process.env.RETHINKDB_USER) credentials.user = process.env.RETHINKDB_USER;
if (process.env.RETHINKDB_PASSWORD) credentials.password = process.env.RETHINKDB_PASSWORD;

// Pooling is deliberately disabled. One connection can multiplex the small number
// of concurrent queries this application receives without maintaining 50+ sockets.
export const r = rethinkdbdash({
  pool: false,
  silent: true,
  timeout: connectionTimeout,
  pingInterval: -1,
  db: databaseName,
  ...credentials,
});

let connection = null;
let connectionPromise = null;
let idleTimer = null;
let activeQueries = 0;
let nextServerIndex = 0;
let closing = false;

const clearIdleTimer = () => {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = null;
};

function connectionIsOpen(candidate = connection) {
  return Boolean(candidate && candidate.open);
}

async function dispose(candidate) {
  if (!candidate) return;
  try {
    await candidate.close({ noreplyWait: false });
  } catch {
    // A broken socket is already unusable; shutdown must remain best-effort.
  }
}

function invalidateConnection(candidate) {
  if (candidate !== connection) return;
  connection = null;
  clearIdleTimer();
  void dispose(candidate);
}

function scheduleIdleClose() {
  clearIdleTimer();
  if (!connectionIsOpen() || activeQueries > 0 || idleTimeoutMs <= 0) return;
  const candidate = connection;
  idleTimer = setTimeout(() => {
    idleTimer = null;
    if (activeQueries === 0 && candidate === connection) invalidateConnection(candidate);
  }, idleTimeoutMs);
  idleTimer.unref?.();
}

function connectOnce(options) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const candidate = new RethinkConnection(r, options, (opened) => {
      settled = true;
      resolve(opened);
    }, (error) => {
      settled = true;
      reject(error);
    });

    // rethinkdbdash can emit a socket error during its handshake after its
    // connection promise has timed out. Attach immediately so it cannot become
    // an uncaught EventEmitter error while the database is waking.
    candidate.on("error", (error) => {
      invalidateConnection(candidate);
      if (!settled) {
        settled = true;
        reject(error);
      }
    });
    candidate.on("closed", () => invalidateConnection(candidate));
  });
}

async function openConnection() {
  if (closing) throw new Error("Database connections are shutting down.");
  if (connectionIsOpen()) return connection;
  if (connectionPromise) return connectionPromise;

  const server = databaseServers[nextServerIndex % databaseServers.length];
  nextServerIndex += 1;
  connectionPromise = connectOnce({
    ...server,
    db: databaseName,
    timeout: connectionTimeout,
    pingInterval: -1,
    ...credentials,
  }).then((opened) => {
    if (closing) {
      void dispose(opened);
      throw new Error("Database connections are shutting down.");
    }
    connection = opened;
    return opened;
  }).finally(() => {
    connectionPromise = null;
  });
  return connectionPromise;
}

export function isDatabaseConnectionError(error) {
  const text = `${error?.name || ""} ${error?.code || ""} ${error?.message || ""}`.toLowerCase();
  return [
    "econnrefused", "econnreset", "enotfound", "eai_again", "etimedout",
    "socket", "network", "connection was closed", "closed connection",
    "failed to connect", "no connection available", "write after end", "err_stream",
  ].some((fragment) => text.includes(fragment));
}

export async function runQuery(query, { retryRead = false } = {}) {
  clearIdleTimer();
  activeQueries += 1;
  let candidate;
  try {
    candidate = await openConnection();
    try {
      return await query.run(candidate);
    } catch (error) {
      if (!isDatabaseConnectionError(error)) throw error;
      invalidateConnection(candidate);
      if (!retryRead) throw error;
      candidate = await openConnection();
      return await query.run(candidate);
    }
  } catch (error) {
    if (candidate && isDatabaseConnectionError(error)) invalidateConnection(candidate);
    throw error;
  } finally {
    activeQueries -= 1;
    scheduleIdleClose();
  }
}

export function useDatabase(name) {
  if (connectionIsOpen()) connection.use(name);
}

export function getDatabaseConnectionState() {
  return { connected: connectionIsOpen(), activeQueries };
}

export async function closeDatabaseConnection() {
  closing = true;
  clearIdleTimer();
  const pending = connectionPromise;
  if (pending) await pending.catch(() => undefined);
  const candidate = connection;
  connection = null;
  await dispose(candidate);
}
