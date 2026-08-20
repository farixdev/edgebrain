import type { Metadata } from "next";
import { ORGANIZATION_ID, SITE } from "@/lib/constants";
import { articleHref, getArticle } from "@/app/insights/articles";
import { WorkingWithOffshoreDevelopmentTeamContent } from "./content";

/**
 * Every string on this route comes from the registry entry. Nothing here
 * re-types a title or a date, so the page, the hub card and the JSON-LD cannot
 * drift apart. See src/app/insights/articles.ts.
 */
const article = getArticle("working-with-offshore-development-team");
const url = `${SITE.url}${articleHref(article.slug)}`;

export const metadata: Metadata = {
  title: article.seoTitle,
  description: article.description,
  alternates: {
    canonical: articleHref(article.slug),
  },
  openGraph: {
    title: `${article.seoTitle} | ${SITE.name}`,
    description: article.description,
    url,
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
      // Author and publisher are the studio itself. The Organization node is
      // defined once in src/app/layout.tsx and referenced by @id from here.
      author: { "@id": ORGANIZATION_ID },
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: "en",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      // Same order, same labels as the trail ArticleLayout renders.
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

export default function WorkingWithOffshoreDevelopmentTeamPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <WorkingWithOffshoreDevelopmentTeamContent />
    </>
  );
}
