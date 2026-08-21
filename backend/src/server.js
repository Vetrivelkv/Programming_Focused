import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { initializeDatabase } from "./init/database.js";
import registerAuthRoutes, { requireSession } from "./routes/auth.js";
import registerCourseRoutes from "./routes/courses.js";
import registerProfileRoutes from "./routes/profile.js";
import registerSettingsRoutes from "./routes/settings.js";

const app = express();
const port = Number(process.env.PORT) || 8000;
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : true;

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.get("/api/health", (_request, response) => response.json({ status: "ok" }));
registerAuthRoutes(app);
app.use("/api", requireSession);
registerCourseRoutes(app);
registerProfileRoutes(app);
registerSettingsRoutes(app);

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const frontendDist = path.join(projectRoot, "frontend", "dist");
app.use(express.static(frontendDist));
app.get("*", (request, response, next) => {
  if (request.path.startsWith("/api/")) return next();
  response.sendFile(path.join(frontendDist, "index.html"));
});
app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(error.status || 500).json({ detail: error.message || "Unexpected server error." });
});

initializeDatabase()
  .then(() => app.listen(port, () => console.log(`Programming Focused is running on http://localhost:${port}`)))
  .catch((error) => {
    console.error("Unable to start Programming Focused:", error);
    process.exitCode = 1;
  });
