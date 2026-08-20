import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "projects");

export async function POST(request: Request) {
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
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const slug = formData.get("slug") as string | null;

    if (!file || !slug) {
      return NextResponse.json({ error: "File and slug required" }, { status: 400 });
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const allowed = ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"];
    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const filename = `${slug}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/images/projects/${filename}` });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
