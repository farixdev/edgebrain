import type { Metadata } from "next";
import { ORGANIZATION_ID, SITE, WEBSITE_ID } from "@/lib/constants";
import { ToolsPageContent, type Tool } from "./content";

/**
 * The tools registry.
 *
 * Lives here, in the server component, because it feeds the CollectionPage
 * ItemList as well as the cards, and a value exported from a "use client"
 * module cannot be read during prerender. Adding a tool is one entry plus the
 * route at /tools/<slug>.
 *
 * Only entries with status "live" go into the ItemList. Structured data that
 * names a URL the site does not serve is a 404 in a search engine's index.
 */
const TOOLS: Tool[] = [
  {
    slug: "mvp-cost-estimator",
    name: "MVP cost estimator",
    summary:
      "Pick a platform and the feature areas you need, and watch a costed line-item breakdown build itself as you type.",
    detail:
      "Discovery, design, build broken out by feature, integrations, QA, environment setup and deployment, each as an hour band you can edit. Then the three costs that fall outside almost every build quote: third-party running costs, store fees, and first-year maintenance. The output is a range, and the page explains what widens it.",
    pledge: "No email. No signup. Nothing leaves your browser.",
    status: "live",
  },
];

// 30 chars. The root layout template appends " | EdgeBrain Studios" (20) for
// 50 total.
const TITLE = "Free Tools for Software Buyers";

// 156 chars.
const DESCRIPTION =
  "Free calculators for people commissioning software. No email gate, no signup, and the arithmetic behind every number is visible on the page and editable.";

const URL = `${SITE.url}/tools`;

const liveTools = TOOLS.filter((tool) => tool.status === "live");

/**
 * CollectionPage + BreadcrumbList. The ItemList is generated from the registry
 * above rather than typed out, so a tool added there appears in the schema and
 * in the cards in one edit.
 *
 * Keep the BreadcrumbList in the same order as the visible `Breadcrumbs` trail
 * in content.tsx.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${URL}#collectionpage`,
      url: URL,
      name: "Free Tools for Software Buyers",
      description:
        "Free, ungated calculators and reference tools for people commissioning software. Every number is shown with the line items and assumptions that produced it.",
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: "en",
      mainEntity: {
        "@type": "ItemList",
        "@id": `${URL}#itemlist`,
        name: "EdgeBrain Studios free tools",
        numberOfItems: liveTools.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: liveTools.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${URL}/${tool.slug}`,
          name: tool.name,
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${URL}#breadcrumb`,
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
          name: "Tools",
          item: URL,
        },
      ],
    },
  ],
};

export const metadata: Metadata = {
  // Brand-free; the root layout's template appends " | EdgeBrain Studios".
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: `Free Tools for Software Buyers | ${SITE.name}`,
    description:
      "Ungated calculators for people commissioning software. Every number arrives with the line items and assumptions behind it, and you can change both.",
    url: "/tools",
    type: "website",
  },
};

export default function ToolsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ToolsPageContent tools={TOOLS} />
    </>
  );
}
