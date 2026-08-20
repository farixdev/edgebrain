import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "EdgeBrain Studios case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Card copy per case study. Deliberately just the eyebrow and the title — the
 * full record lives in page.tsx and a page file should not be imported for its
 * data, so only the two strings the card renders are repeated here.
 */
const CARDS: Record<string, { eyebrow: string; title: string }> = {
  "edgebrain-studios": {
    eyebrow: "Web development case study",
    title: "EdgeBrain Studios",
  },
  "project-atlas": {
    eyebrow: "AI automation case study",
    title: "Project Atlas",
  },
  "pulse-mobile": {
    eyebrow: "Mobile app case study",
    title: "Pulse Mobile",
  },
};

export function generateStaticParams() {
  return Object.keys(CARDS).map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = CARDS[slug] ?? {
    eyebrow: "Case study",
    title: "EdgeBrain Studios",
  };

  return renderOgImage(card);
}
