import { NextResponse } from "next/server";
import { currentAdmin, sameOrigin } from "@/lib/server/auth";
import { updateOrderRecord } from "@/lib/server/database";
import { parseAdminUpdate, smallJson } from "@/lib/server/validation";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: { code: string } }) {
  if (!currentAdmin()) return NextResponse.json({ error: "Phiên đăng nhập đã hết hạn." }, { status: 401 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  try {
    const input = parseAdminUpdate(await smallJson(request));
    if (!input) return NextResponse.json({ error: "Thông tin cập nhật chưa hợp lệ." }, { status: 400 });
    return NextResponse.json(updateOrderRecord(params.code, input));
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "NOT_FOUND") return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
    if (message === "CONFLICT") return NextResponse.json({ error: "Đơn vừa được thay đổi. Vui lòng tải lại." }, { status: 409 });
    return NextResponse.json({ error: "Không thể cập nhật đơn." }, { status: 500 });
  }
}
