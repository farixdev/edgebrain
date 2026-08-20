import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt =
  "EdgeBrain Studios — software studio in Lahore building web apps, mobile apps, and AI automation";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Software studio",
    title: "We design & build software with an edge.",
  });
}
