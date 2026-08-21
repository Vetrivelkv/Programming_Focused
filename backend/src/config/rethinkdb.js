import rethinkdbdash from "rethinkdbdash";

export const databaseName = process.env.RETHINKDB_DB || "programming_focused";
export const databaseServers = (process.env.RETHINKDB_SERVERS || "127.0.0.1:39015")
  .split(",")
  .map((entry) => {
    const [host, port = "28015"] = entry.trim().split(":");
    return { host, port: Number(port) };
  });

const options = {
  servers: databaseServers,
  db: databaseName,
  silent: true,
  timeout: Number(process.env.RETHINKDB_TIMEOUT) || 20,
};

if (process.env.RETHINKDB_USER) options.user = process.env.RETHINKDB_USER;
if (process.env.RETHINKDB_PASSWORD) options.password = process.env.RETHINKDB_PASSWORD;

export const r = rethinkdbdash(options);
