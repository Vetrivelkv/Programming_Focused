import asyncRoute from "../lib/async-route.js";
import {
  clearSession, createSession, register, requireSession, verifyCredentials,
} from "../logic/auth.js";

export default function registerAuthRoutes(app) {
  app.post("/api/auth/register", asyncRoute(async (request, response) => {
    const user = await register(request.body.username, request.body.password);
    response.status(201).json({ message: "Registration successful.", user });
  }));
  app.post("/api/auth/login", asyncRoute(async (request, response) => {
    const user = await verifyCredentials(request.body.username, request.body.password);
    if (!user) return response.status(401).json({ detail: "Invalid username or password." });
    response.json(createSession(response, user));
  }));
  app.post("/api/auth/logout", (_request, response) => {
    clearSession(response);
    response.status(204).end();
  });
  app.get("/api/auth/session", requireSession, (request, response) => {
    response.json({ user: request.user, expiresAt: request.sessionExpiresAt });
  });
}

export { requireSession };
