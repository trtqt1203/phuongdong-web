import { NextResponse } from "next/server";
import { createOrderRecord } from "@/lib/server/database";
import { clientAddress, rateLimit } from "@/lib/server/rate-limit";
import { parseBooking, smallJson } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!rateLimit(`booking:${clientAddress(request)}`, 10, 60 * 60_000)) {
    return NextResponse.json({ error: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau." }, { status: 429 });
  }
  try {
    const input = parseBooking(await smallJson(request));
    if (!input) return NextResponse.json({ error: "Thông tin đặt lịch chưa hợp lệ." }, { status: 400 });
    return NextResponse.json(createOrderRecord(input), { status: 201 });
  } catch (error) {
    const status = error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? 413 : 500;
    return NextResponse.json({ error: status === 413 ? "Dữ liệu gửi lên quá lớn." : "Không thể lưu lịch hẹn." }, { status });
  }
}
