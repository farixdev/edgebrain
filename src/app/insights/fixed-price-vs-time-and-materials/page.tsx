import type { Metadata } from "next";
import { ORGANIZATION_ID, SITE, WEBSITE_ID } from "@/lib/constants";
import { getArticle } from "../articles";
import { FixedPriceVsTimeAndMaterialsContent } from "./content";

/**
 * Everything descriptive on this route is read from the registry entry, never
 * re-typed. `getArticle` throws on a slug typo, so a mismatch between this
 * route and src/app/insights/articles.ts fails the build rather than shipping
 * a page whose <title> disagrees with its H1 and its hub card.
 */
const article = getArticle("fixed-price-vs-time-and-materials");
const ARTICLE_URL = `${SITE.url}/insights/${article.slug}`;

export const metadata: Metadata = {
  // Brand-free; the root layout's template appends " | EdgeBrain Studios".
  title: article.seoTitle,
  description: article.description,
  alternates: {
    canonical: `/insights/${article.slug}`,
  },
  openGraph: {
    title: `${article.title} | ${SITE.name}`,
    description: article.description,
    url: `/insights/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
  },
};

/**
 * BlogPosting + BreadcrumbList.
 *
 * Same convention as the other five article routes: the BlogPosting references
 * the two canonical graph nodes defined once in src/app/layout.tsx
 * (#organization, #website) instead of inlining a second copy of the company,
 * and `mainEntityOfPage` points at the article URL itself.
 *
 * No FAQPage here. FAQ rich results were retired in May 2026, and this piece is
 * an argument rather than a genuine Q&A exchange, so QAPage would be a
 * misdescription of the page.
 *
 * The BreadcrumbList mirrors the trail ArticleLayout renders — Home, Insights,
 * then the article title — in that order. If the visible trail changes, change
 * this too.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": `${ARTICLE_URL}#article`,
      headline: article.title,
      description: article.description,
      url: ARTICLE_URL,
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      inLanguage: "en",
      articleSection: article.category,
      keywords: [
        "fixed price vs time and materials",
        "software development contract types",
        "fixed scope software contract",
        "change order software project",
        "milestone based payment software development",
        "how to avoid scope creep with an agency",
        "retainer vs project software development",
      ],
      author: { "@id": ORGANIZATION_ID },
      publisher: { "@id": ORGANIZATION_ID },
      isPartOf: { "@id": WEBSITE_ID },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": ARTICLE_URL,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${ARTICLE_URL}#breadcrumb`,
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
          item: `${SITE.url}/insights`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: ARTICLE_URL,
        },
      ],
    },
  ],
};

export default function FixedPriceVsTimeAndMaterialsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\u003c"),
        }}
      />
      <FixedPriceVsTimeAndMaterialsContent />
    </>
  );
}
