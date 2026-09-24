import { NextResponse } from "next/server";
import { currentAdmin, sameOrigin } from "@/lib/server/auth";
import { advanceOrderRecord } from "@/lib/server/database";
import { smallJson } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: { code: string } }) {
  if (!currentAdmin()) return NextResponse.json({ error: "Phiên đăng nhập đã hết hạn." }, { status: 401 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  try {
    const input = await smallJson(request) as { revision?: unknown };
    if (!Number.isInteger(input.revision)) return NextResponse.json({ error: "Phiên bản đơn không hợp lệ." }, { status: 400 });
    return NextResponse.json(advanceOrderRecord(params.code, Number(input.revision)));
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "NOT_FOUND") return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
    if (message === "CONFLICT") return NextResponse.json({ error: "Đơn vừa được thay đổi. Vui lòng tải lại." }, { status: 409 });
    if (message === "INVALID_STATUS") return NextResponse.json({ error: "Không thể chuyển tiếp trạng thái này." }, { status: 409 });
    return NextResponse.json({ error: "Không thể cập nhật tiến độ." }, { status: 500 });
  }
}
