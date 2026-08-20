/**
 * Project thumbnail upload.
 *
 * ---------------------------------------------------------------------------
 * Why this no longer touches the filesystem
 * ---------------------------------------------------------------------------
 * This route used to `fs.writeFileSync` into public/images/projects. On Vercel
 * that fails: the runtime filesystem is read-only, so the upload 500'd (or, on
 * platforms with a writable but ephemeral filesystem, "worked" until the next
 * deploy wiped the container and every project card lost its image).
 * /public is a build-time directory; nothing written at runtime can ever end up
 * in it.
 *
 * Of the two honest options — store the bytes somewhere writable, or disable
 * uploads in production and tell the owner why — this takes the first. The file
 * comes back as a base64 `data:` URI which the admin panel drops straight into
 * `projects[].thumbnail`, so it is saved by the same PUT that saves the rest of
 * the content, into the same Postgres row. No bucket, no second set of
 * credentials, no orphaned-file cleanup, and it survives deploys.
 *
 * The trade is payload size: base64 costs ~33% over the raw bytes, and the
 * content document is fetched on every admin load. Hence the hard cap in
 * `MAX_THUMBNAIL_BYTES` (500 KB raw, ~683 KB encoded), enforced here and
 * mirrored in the panel's UI copy. A handful of card-sized thumbnails at that
 * ceiling is a document of a few hundred KB, which is fine. Thirty full-bleed
 * case-study photographs would not be — that is the point at which this should
 * become real object storage, and the cap is what forces that conversation
 * instead of letting the row quietly grow to 40 MB.
 */

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  ALLOWED_THUMBNAIL_TYPES,
  MAX_THUMBNAIL_BYTES,
  MAX_THUMBNAIL_LABEL,
} from "@/lib/constants";

export const dynamic = "force-dynamic";

type AllowedType = (typeof ALLOWED_THUMBNAIL_TYPES)[number];

/**
 * The first bytes of each accepted format.
 *
 * `File.type` is whatever the browser inferred from the extension, so it is a
 * hint, not a fact. Sniffing means a `data:image/png;base64,` URI we hand back
 * really is a PNG — the panel is admin-only, but a URI whose declared type does
 * not match its bytes is the kind of thing that turns into a rendering bug
 * six months later.
 */
function sniffType(bytes: Uint8Array): AllowedType | null {
  const startsWith = (...sig: number[]) =>
    sig.every((b, i) => bytes[i] === b);

  if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (startsWith(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (startsWith(0x47, 0x49, 0x46, 0x38)) return "image/gif";

  // RIFF....WEBP
  if (
    startsWith(0x52, 0x49, 0x46, 0x46) &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  // ISO-BMFF box: ....ftypavif / ....ftypavis
  if (
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70 &&
    bytes[8] === 0x61 &&
    bytes[9] === 0x76 &&
    bytes[10] === 0x69
  ) {
    return "image/avif";
  }

  return null;
}

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Checked before reading the body into memory.
    if (file.size > MAX_THUMBNAIL_BYTES) {
      return NextResponse.json(
        {
          error: `That image is ${formatBytes(
            file.size
          )}. Thumbnails are stored inside the content document, so the limit is ${MAX_THUMBNAIL_LABEL} — resize or re-compress it and try again.`,
        },
        { status: 413 }
      );
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "That file is empty" }, { status: 400 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const type = sniffType(bytes);

    if (!type) {
      return NextResponse.json(
        {
          error: `Unsupported image format. Accepted: ${ALLOWED_THUMBNAIL_TYPES.map(
            (t) => t.replace("image/", "").toUpperCase()
          ).join(", ")}. SVG is not accepted.`,
        },
        { status: 400 }
      );
    }

    const base64 = Buffer.from(bytes).toString("base64");

    return NextResponse.json({
      url: `data:${type};base64,${base64}`,
      type,
      bytes: file.size,
      // The panel shows this so the owner can see what a save now costs.
      encodedBytes: base64.length,
    });
  } catch (error) {
    console.error("[api/admin/upload] failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
