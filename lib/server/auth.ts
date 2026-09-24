import "server-only";

import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "pd_admin_session";
export const SESSION_SECONDS = 8 * 60 * 60;
const encode = (value: string) => Buffer.from(value).toString("base64url");

export function hashPassword(password: string, salt: string) {
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString("base64url")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [method, salt, expected] = stored.split("$");
  if (method !== "scrypt" || !salt || !expected) return false;
  const actual = scryptSync(password, salt, 64);
  const target = Buffer.from(expected, "base64url");
  return actual.length === target.length && timingSafeEqual(actual, target);
}

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET phải có ít nhất 32 ký tự.");
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSession(username: string) {
  const payload = encode(JSON.stringify({ username, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS }));
  return `${payload}.${sign(payload)}`;
}

export function readSession(token?: string) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString()) as { username: string; exp: number };
    return value.exp > Date.now() / 1000 && value.username === process.env.ADMIN_USERNAME ? value : null;
  } catch {
    return null;
  }
}

export function currentAdmin() {
  return readSession(cookies().get(ADMIN_COOKIE)?.value);
}

export function validAdminCredentials(username: string, password: string) {
  const configuredUser = process.env.ADMIN_USERNAME;
  const configuredHash = process.env.ADMIN_PASSWORD_HASH;
  return Boolean(configuredUser && configuredHash && username === configuredUser && verifyPassword(password, configuredHash));
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const allowed = (process.env.APP_ORIGINS || new URL(request.url).origin)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return allowed.includes(origin);
}
