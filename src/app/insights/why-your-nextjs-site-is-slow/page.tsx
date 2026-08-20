import type { Metadata } from "next";
import { ORGANIZATION_ID, SITE, WEBSITE_ID } from "@/lib/constants";
import { getArticle } from "../articles";
import { WhyYourNextjsSiteIsSlowContent } from "./content";

/**
 * Everything descriptive on this route is read from the registry entry, never
 * re-typed. `getArticle` throws on a slug typo, so a mismatch between this
 * route and src/app/insights/articles.ts fails the build rather than shipping
 * a page whose <title> disagrees with its H1 and its hub card.
 */
const article = getArticle("why-your-nextjs-site-is-slow");
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
 * No FAQPage here. FAQ rich results were retired in May 2026, and this article
 * is not a genuine Q&A page, so QAPage would be a misdescription. The two nodes
 * below are the ones that still do work: BlogPosting ties the piece to the
 * canonical #organization and #website nodes defined once in src/app/layout.tsx,
 * and BreadcrumbList mirrors the trail ArticleLayout renders — Home, Insights,
 * article title, in that order. If the visible trail changes, change this too.
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
        "Next.js performance optimization",
        "Next.js slow page load",
        "improve INP Next.js",
        "Next.js LCP optimization",
        "reduce Next.js bundle size",
        "server components vs client components performance",
        "Core Web Vitals Next.js App Router",
        "next/dynamic INP",
        "performance budget CI",
        "Next.js hydration cost",
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

export default function WhyYourNextjsSiteIsSlowPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <WhyYourNextjsSiteIsSlowContent />
    </>
  );
}
