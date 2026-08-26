import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { r, runQuery } from "../config/rethinkdb.js";

const ACCESS_COOKIE = "programming_focused_access";
const REFRESH_COOKIE = "programming_focused_refresh";
const ACCESS_SECONDS = 15 * 60;
const SESSION_SECONDS = (Number(process.env.SESSION_HOURS) || 2) * 60 * 60;
const accessSecret = process.env.JWT_ACCESS_SECRET || "development-access-secret-change-me";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "development-refresh-secret-change-me";
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

if (process.env.NODE_ENV === "production"
  && (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET)) {
  throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are required in production.");
}

const publicUser = (user) => user && ({
  id: user.id,
  username: user.username,
  theme: user.theme === "dark" ? "dark" : "default",
});

async function findByUsername(username) {
  return runQuery(r.table("users")
    .getAll(username, { index: "username" })
    .nth(0)
    .default(null), { retryRead: true });
}

async function findById(id) {
  return runQuery(r.table("users").get(id), { retryRead: true });
}

function setCookies(response, user, sessionExpiresAt) {
  const remainingSeconds = Math.max(1, Math.floor((sessionExpiresAt - Date.now()) / 1000));
  const claims = { username: user.username, sessionExpiresAt };
  response.cookie(ACCESS_COOKIE, jwt.sign(claims, accessSecret, {
    subject: user.id,
    expiresIn: Math.min(ACCESS_SECONDS, remainingSeconds),
  }), { ...cookieOptions, maxAge: remainingSeconds * 1000 });
  response.cookie(REFRESH_COOKIE, jwt.sign(claims, refreshSecret, {
    subject: user.id,
    expiresIn: remainingSeconds,
  }), { ...cookieOptions, maxAge: remainingSeconds * 1000 });
}

export async function register(username, password) {
  const normalized = username?.trim();
  if (!normalized || normalized.length < 3 || normalized.length > 40) {
    throw Object.assign(new Error("Username must contain 3 to 40 characters."), { status: 400 });
  }
  if (!password || password.length < 6) {
    throw Object.assign(new Error("Password must contain at least 6 characters."), { status: 400 });
  }
  if (await findByUsername(normalized)) {
    throw Object.assign(new Error("Username already exists."), { status: 409 });
  }
  const result = await runQuery(r.table("users").insert({
    username: normalized,
    password_hash: await bcrypt.hash(password, 12),
    theme: "default",
    created_at: new Date(),
    updated_at: new Date(),
  }, { returnChanges: true }));
  return publicUser(result.changes[0].new_val);
}

export async function verifyCredentials(username, password) {
  const user = await findByUsername(username?.trim());
  if (!user || !password || !await bcrypt.compare(password, user.password_hash)) return null;
  return publicUser(user);
}

export function createSession(response, user) {
  const expiresAt = Date.now() + SESSION_SECONDS * 1000;
  setCookies(response, user, expiresAt);
  return { user, expiresAt };
}

export function clearSession(response) {
  response.clearCookie(ACCESS_COOKIE, cookieOptions);
  response.clearCookie(REFRESH_COOKIE, cookieOptions);
}

function readToken(request, response) {
  const access = request.cookies?.[ACCESS_COOKIE];
  if (access) {
    try {
      const payload = jwt.verify(access, accessSecret);
      return { user: { id: payload.sub, username: payload.username }, expiresAt: payload.sessionExpiresAt };
    } catch (error) {
      if (error.name !== "TokenExpiredError") return null;
    }
  }
  const refresh = request.cookies?.[REFRESH_COOKIE];
  if (!refresh) return null;
  try {
    const payload = jwt.verify(refresh, refreshSecret);
    if (Number(payload.sessionExpiresAt) <= Date.now()) return null;
    const user = { id: payload.sub, username: payload.username };
    setCookies(response, user, payload.sessionExpiresAt);
    return { user, expiresAt: payload.sessionExpiresAt };
  } catch {
    return null;
  }
}

export async function requireSession(request, response, next) {
  try {
    const session = readToken(request, response);
    const storedUser = session ? await findById(session.user.id) : null;
    if (!session || !storedUser) {
      clearSession(response);
      return response.status(401).json({ code: "SESSION_EXPIRED", detail: "Your session has expired." });
    }
    request.user = publicUser(storedUser);
    request.sessionExpiresAt = session.expiresAt;
    next();
  } catch (error) {
    next(error);
  }
}
