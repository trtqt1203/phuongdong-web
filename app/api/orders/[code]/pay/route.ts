import { NextResponse } from "next/server";
import { payOrderRecord } from "@/lib/server/database";
import { clientAddress, rateLimit } from "@/lib/server/rate-limit";
import { smallJson } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: { code: string } }) {
  if (!rateLimit(`payment:${clientAddress(request)}`, 20, 15 * 60_000)) {
    return NextResponse.json({ error: "Vui lòng chờ trước khi thử lại." }, { status: 429 });
  }
  try {
    const input = await smallJson(request) as { phoneNumber?: unknown };
    if (typeof input.phoneNumber !== "string") return NextResponse.json({ error: "Thiếu số điện thoại xác thực." }, { status: 400 });
    return NextResponse.json(payOrderRecord(params.code, input.phoneNumber));
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "NOT_FOUND") return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
    if (message === "NOT_DUE") return NextResponse.json({ error: "Đơn chưa có khoản cần thanh toán." }, { status: 409 });
    return NextResponse.json({ error: "Không thể ghi nhận thanh toán." }, { status: 500 });
  }
}
