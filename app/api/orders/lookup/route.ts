import { NextResponse } from "next/server";
import { lookupOrderRecord } from "@/lib/server/database";
import { clientAddress, rateLimit } from "@/lib/server/rate-limit";
import { smallJson } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!rateLimit(`lookup:${clientAddress(request)}`, 30, 15 * 60_000)) {
    return NextResponse.json({ error: "Bạn đã tra cứu quá nhiều lần. Vui lòng thử lại sau." }, { status: 429 });
  }
  try {
    const input = await smallJson(request) as { code?: unknown; phoneNumber?: unknown };
    if (typeof input.code !== "string" || !/^PD-[A-Z0-9]{6}$/i.test(input.code.trim()) || typeof input.phoneNumber !== "string") {
      return NextResponse.json({ error: "Mã đơn hoặc số điện thoại chưa hợp lệ." }, { status: 400 });
    }
    const order = lookupOrderRecord(input.code, input.phoneNumber);
    return order
      ? NextResponse.json(order)
      : NextResponse.json({ error: "Không tìm thấy đơn khớp với thông tin đã nhập." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Không thể tra cứu đơn lúc này." }, { status: 500 });
  }
}
