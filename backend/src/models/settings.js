import { r } from "../config/rethinkdb.js";

export const THEMES = ["default", "dark"];

const normalizeTheme = (theme) => THEMES.includes(theme) ? theme : "default";

export async function getSettings(userId) {
  const user = await r.table("users").get(userId).run();
  return { theme: normalizeTheme(user?.theme) };
}

export async function updateSettings(userId, theme) {
  if (!THEMES.includes(theme)) {
    throw Object.assign(new Error("Theme must be either default or dark."), { status: 400 });
  }
  await r.table("users").get(userId).update({
    theme,
    updated_at: new Date(),
  }).run();
  return { theme };
}
