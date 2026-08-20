import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt =
  "AI integration and LLM consulting from EdgeBrain Studios";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "AI Consulting",
    title: "Work out what to build before you build it.",
  });
}
