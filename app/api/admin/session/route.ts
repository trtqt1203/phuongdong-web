import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/server/auth";

export function GET() {
  const admin = currentAdmin();
  return NextResponse.json(admin ? { authenticated: true, username: admin.username } : { authenticated: false });
}
