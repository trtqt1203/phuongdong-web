import "server-only";

import type { AdminOrderUpdate, BookingInput } from "@/lib/orders";

const text = (value: unknown, min: number, max: number) =>
  typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export function parseBooking(value: unknown): BookingInput | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const config = input.config as Record<string, unknown> | undefined;
  const phone = typeof input.phoneNumber === "string" ? input.phoneNumber.trim() : "";
  const validConfig = config && ["fabric", "lapel", "buttons", "pocket", "shirt", "tie", "fit"].every((key) => text(config[key], 1, 60));
  if (
    !text(input.fullName, 2, 100) ||
    !/^(?:\+?84|0)[35789](?:[ .-]?\d){8}$/.test(phone) ||
    (input.email !== "" && !text(input.email, 3, 160)) ||
    (typeof input.email === "string" && input.email && !/^\S+@\S+\.\S+$/.test(input.email)) ||
    typeof input.preferredDate !== "string" ||
    !datePattern.test(input.preferredDate) ||
    typeof input.preferredTime !== "string" ||
    !timePattern.test(input.preferredTime) ||
    new Date(`${input.preferredDate}T${input.preferredTime}:00+07:00`) <= new Date() ||
    typeof input.notes !== "string" ||
    input.notes.length > 1000 ||
    !validConfig
  ) return null;
  return input as unknown as BookingInput;
}

export function parseAdminUpdate(value: unknown): AdminOrderUpdate | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (
    !Number.isInteger(input.revision) ||
    !text(input.owner, 2, 80) ||
    typeof input.preferredDate !== "string" ||
    !datePattern.test(input.preferredDate) ||
    typeof input.preferredTime !== "string" ||
    !timePattern.test(input.preferredTime) ||
    !Number.isSafeInteger(input.quote) ||
    Number(input.quote) < 0 ||
    Number(input.quote) > 10_000_000_000 ||
    !Number.isSafeInteger(input.depositRequired) ||
    Number(input.depositRequired) < 0 ||
    Number(input.depositRequired) > Number(input.quote) ||
    typeof input.internalNote !== "string" ||
    input.internalNote.length > 2000
  ) return null;
  return input as unknown as AdminOrderUpdate;
}

export async function smallJson(request: Request) {
  const size = Number(request.headers.get("content-length") || 0);
  if (size > 25_000) throw new Error("PAYLOAD_TOO_LARGE");
  return request.json();
}
