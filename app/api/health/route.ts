import { NextResponse } from "next/server";
import { databaseHealth } from "@/lib/server/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const health = databaseHealth();
  return NextResponse.json({ status: health.ok ? "ok" : "error", database: health.ok }, { status: health.ok ? 200 : 503 });
}
