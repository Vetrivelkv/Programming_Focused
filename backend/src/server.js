import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import {
  closeDatabaseConnection, getDatabaseConnectionState, isDatabaseConnectionError,
} from "./config/rethinkdb.js";
import {
  getDatabaseInitializationState, initializeDatabase, requireDatabase,
} from "./init/database.js";
import registerAuthRoutes, { requireSession } from "./routes/auth.js";
import registerCourseRoutes from "./routes/courses.js";
import registerProfileRoutes from "./routes/profile.js";
import registerSettingsRoutes from "./routes/settings.js";

const port = Number(process.env.PORT) || 8000;
const shutdownTimeoutMs = Number(process.env.SHUTDOWN_TIMEOUT_MS) || 10_000;
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : true;

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const frontendDist = path.join(projectRoot, "frontend", "dist");

export function createApp() {
  const app = express();
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  app.use("/api", (_request, response, next) => {
    response.set("Cache-Control", "no-store");
    next();
  });

  app.get("/api/health", (_request, response) => response.json({ status: "ok" }));
  app.get("/api/ready", (_request, response) => {
    const initialization = getDatabaseInitializationState();
    const database = { ...initialization, ...getDatabaseConnectionState() };
    response.status(initialization.initialized ? 200 : 503).json({
      status: initialization.initialized ? "ready" : "not_ready",
      database,
    });
  });

  app.use("/api", requireDatabase);
  registerAuthRoutes(app);
  app.use("/api", requireSession);
  registerCourseRoutes(app);
  registerProfileRoutes(app);
  registerSettingsRoutes(app);

  app.use(express.static(frontendDist, {
    setHeaders(response, filePath) {
      if (filePath.endsWith("index.html")) {
        response.setHeader("Cache-Control", "no-cache");
      } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else {
        response.setHeader("Cache-Control", "public, max-age=3600");
      }
    },
  }));
  app.get("*", (request, response, next) => {
    if (request.path.startsWith("/api/")) return next();
    response.set("Cache-Control", "no-cache");
    response.sendFile(path.join(frontendDist, "index.html"));
  });
  app.use((error, _request, response, _next) => {
    console.error(error);
    if (isDatabaseConnectionError(error)) {
      return response.status(503).json({
        code: "DATABASE_UNAVAILABLE",
        detail: "The database is waking up. Please try again shortly.",
      });
    }
    response.status(error.status || 500).json({ detail: error.message || "Unexpected server error." });
  });
  return app;
}

export function startServer() {
  const app = createApp();
  const server = app.listen(port, () => {
    console.log(`Programming Focused is running on http://localhost:${port}`);
    void initializeDatabase().catch((error) => {
      console.error("Initial database setup attempt failed; requests can retry:", error.message);
    });
  });

  let shuttingDown = false;
  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`${signal} received; shutting down gracefully.`);
    const forcedShutdown = setTimeout(() => {
      console.error("Graceful shutdown timed out; closing remaining connections.");
      server.closeAllConnections?.();
      process.exit(1);
    }, shutdownTimeoutMs);

    server.close(async (error) => {
      await closeDatabaseConnection();
      clearTimeout(forcedShutdown);
      if (error) console.error("HTTP server shutdown failed:", error);
      process.exit(error ? 1 : 0);
    });
    server.closeIdleConnections?.();
  };

  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));
  return server;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) startServer();
