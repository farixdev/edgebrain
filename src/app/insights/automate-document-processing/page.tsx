import type { Metadata } from "next";
import { ORGANIZATION_ID, SITE } from "@/lib/constants";
import { getArticle } from "@/app/insights/articles";
import { AutomateDocumentProcessingContent } from "./content";

/**
 * Every string below is read from the registry rather than typed here, so the
 * hub card, the H1 that ArticleLayout renders, the meta description and the
 * BlogPosting node can never drift apart. If a value looks wrong, fix it in
 * src/app/insights/articles.ts — not here.
 */
const article = getArticle("automate-document-processing");
const url = `${SITE.url}/insights/${article.slug}`;

export const metadata: Metadata = {
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      articleSection: article.category,
      // Author and publisher are the same entity, referenced by @id rather than
      // re-declared, so the graph describes one organisation and not three.
      author: { "@id": ORGANIZATION_ID },
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: "en",
      isAccessibleForFree: true,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      url,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
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
          item: url,
        },
      ],
    },
  ],
};

export default function AutomateDocumentProcessingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\u003c"),
        }}
      />
      <AutomateDocumentProcessingContent />
    </>
  );
}
