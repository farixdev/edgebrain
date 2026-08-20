import type { Metadata } from "next";
import { ORGANIZATION_ID, SITE, WEBSITE_ID } from "@/lib/constants";
import { ARTICLES } from "./articles";
import { InsightsPageContent } from "./content";

export const metadata: Metadata = {
  // 32 chars; the root template appends " | EdgeBrain Studios" for 52 total,
  // inside the ~60-char SERP cut.
  title: "Insights on Software Development",
  description:
    "Guides on choosing a build team, what software actually costs, and shipping AI features that hold up. Written by the engineers doing the work, sources linked.",
  alternates: {
    canonical: "/insights",
  },
  openGraph: {
    title: "Insights on Software Development | EdgeBrain Studios",
    description:
      "Six pieces on commissioning software: in-house vs agency vs freelancer, MVP cost, offshore teams, React Native vs native, RAG vs fine-tuning, document automation.",
    url: "/insights",
    type: "website",
  },
};

const INSIGHTS_URL = `${SITE.url}/insights`;

/**
 * CollectionPage + BreadcrumbList.
 *
 * The ItemList is generated from the registry rather than typed out, so an
 * article added to src/app/insights/articles.ts appears here, in the hub's
 * cards, and in the "Keep reading" blocks in one edit. A hand-maintained copy
 * of this list would be stale within a week.
 *
 * Keep the BreadcrumbList in the same order as the `Breadcrumbs` trail rendered
 * in content.tsx. Structured data describing a trail the page does not show is
 * a rich-result eligibility risk.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${INSIGHTS_URL}#collectionpage`,
      url: INSIGHTS_URL,
      name: "Insights on Software Development",
      description:
        "Guides on choosing a build team, what software actually costs, and shipping AI features that hold up.",
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: "en",
      mainEntity: {
        "@type": "ItemList",
        "@id": `${INSIGHTS_URL}#itemlist`,
        name: "EdgeBrain Studios insights",
        numberOfItems: ARTICLES.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: ARTICLES.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE.url}/insights/${article.slug}`,
          name: article.title,
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${INSIGHTS_URL}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Insights",
          item: INSIGHTS_URL,
        },
      ],
    },
  ],
};

export default function InsightsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <InsightsPageContent />
    </>
  );
}
