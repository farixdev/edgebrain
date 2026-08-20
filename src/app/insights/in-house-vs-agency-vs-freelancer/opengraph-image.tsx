import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { getArticle } from "../articles";

/**
 * Share card for this article. Both strings come from the registry entry, so
 * the card cannot drift from the H1 and the hub card the way a hand-typed
 * copy would. Nothing here is authored twice.
 */
const article = getArticle("in-house-vs-agency-vs-freelancer");

export const alt = `${article.title} — EdgeBrain Studios`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: article.category,
    title: article.title,
  });
}
