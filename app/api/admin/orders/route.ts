import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/server/auth";
import { listOrderRecords } from "@/lib/server/database";

export const runtime = "nodejs";

export function GET() {
  if (!currentAdmin()) return NextResponse.json({ error: "Vui lòng đăng nhập quản trị." }, { status: 401 });
  return NextResponse.json(listOrderRecords());
}
