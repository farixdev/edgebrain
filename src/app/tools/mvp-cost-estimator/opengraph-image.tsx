import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt =
  "Free MVP cost estimator from EdgeBrain Studios — no email required";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "MVP Cost Estimator",
    title: "What an MVP costs, line by line. No email.",
  });
}
