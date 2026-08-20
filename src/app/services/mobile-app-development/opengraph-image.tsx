import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt =
  "React Native mobile app development from EdgeBrain Studios";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Mobile Apps",
    title: "One codebase. Two stores. Sixty frames a second.",
  });
}
