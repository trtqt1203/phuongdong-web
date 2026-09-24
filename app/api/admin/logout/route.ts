import { NextResponse } from "next/server";
import { ADMIN_COOKIE, sameOrigin } from "@/lib/server/auth";

export function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, sameSite: "strict", maxAge: 0, path: "/" });
  return response;
}
