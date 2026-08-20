import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt =
  "Contact EdgeBrain Studios for a fixed project quote";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Contact",
    title: "Tell us what you are building.",
  });
}
