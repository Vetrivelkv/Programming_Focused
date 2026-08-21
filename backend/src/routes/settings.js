import asyncRoute from "../lib/async-route.js";
import { getSettings, updateSettings } from "../models/settings.js";

export default function registerSettingsRoutes(app) {
  app.get("/api/settings", asyncRoute(async (request, response) => {
    response.json(await getSettings(request.user.id));
  }));

  app.patch("/api/settings", asyncRoute(async (request, response) => {
    response.json(await updateSettings(request.user.id, request.body.theme));
  }));
}
