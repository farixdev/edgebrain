import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "src", "data", "content.json");

export async function GET() {
  try {
    const data = fs.readFileSync(CONTENT_PATH, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: "Content file not found" }, { status: 404 });
  }
}

export async function PUT(request: Request) {
  const email = request.headers.get("x-admin-email");
  const password = request.headers.get("x-admin-password");
  if (
    !email || !password ||
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    fs.writeFileSync(CONTENT_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
