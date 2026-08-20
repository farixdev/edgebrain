import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt =
  "EdgeBrain Studios insights — straight answers about buying software";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Insights",
    title: "Straight answers about buying software.",
  });
}
