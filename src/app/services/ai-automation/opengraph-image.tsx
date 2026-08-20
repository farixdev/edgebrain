import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt =
  "AI automation and document processing from EdgeBrain Studios";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "AI Automation",
    title: "Remove the manual step, not just add a chatbot.",
  });
}
