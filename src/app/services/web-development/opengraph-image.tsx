import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt =
  "Next.js and React web development from EdgeBrain Studios";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Web Development",
    title: "Next.js web development that earns its keep.",
  });
}
