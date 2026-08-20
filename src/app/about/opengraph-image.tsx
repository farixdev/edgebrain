import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt =
  "About EdgeBrain Studios, a software house in Lahore";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "About us",
    title: "A software house in Lahore with a sharp edge.",
  });
}
