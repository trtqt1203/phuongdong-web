import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const modelPath = path.join(process.cwd(), "public", "models", "suit.glb");
  const exists = fs.existsSync(modelPath);

  return NextResponse.json({
    exists,
    path: exists ? "/models/suit.glb" : null,
  });
}
