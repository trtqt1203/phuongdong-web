import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createSession, sameOrigin, SESSION_SECONDS, validAdminCredentials } from "@/lib/server/auth";
import { clientAddress, rateLimit } from "@/lib/server/rate-limit";
import { smallJson } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  const address = clientAddress(request);
  if (!rateLimit(`login:${address}`, 8, 15 * 60_000)) {
    return NextResponse.json({ error: "Đăng nhập thất bại quá nhiều lần. Vui lòng thử lại sau 15 phút." }, { status: 429 });
  }
  try {
    const input = await smallJson(request) as { username?: unknown; password?: unknown };
    if (typeof input.username !== "string" || typeof input.password !== "string" || !validAdminCredentials(input.username, input.password)) {
      return NextResponse.json({ error: "Tên đăng nhập hoặc mật khẩu không đúng." }, { status: 401 });
    }
    const response = NextResponse.json({ authenticated: true, username: input.username });
    response.cookies.set(ADMIN_COOKIE, createSession(input.username), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.COOKIE_SECURE === "true",
      maxAge: SESSION_SECONDS,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Không thể đăng nhập." }, { status: 500 });
  }
}
