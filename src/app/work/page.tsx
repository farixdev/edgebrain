import type { Metadata } from "next";
import { ORGANIZATION_ID, WEBSITE_ID } from "@/lib/constants";
import { WorkPageContent } from "./content";

const SITE = "https://edgebrainstudios.com";

export const metadata: Metadata = {
  // The root layout appends " | EdgeBrain Studios" (20 chars), so this string
  // has a 40-char budget to stay inside the ~60-char SERP cut. Rendered title:
  // "Web, Mobile & AI Automation Case Studies | EdgeBrain Studios" — 60 chars.
  title: "Web, Mobile & AI Automation Case Studies",
  description:
    "Case studies from EdgeBrain Studios: Next.js web apps, React Native mobile builds, and an AI automation pipeline. The architecture, tradeoffs, and the numbers.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Web, Mobile & AI Automation Case Studies | EdgeBrain Studios",
    description:
      "Engineering case studies from a software house in Lahore building for founders worldwide. Next.js web apps, React Native mobile, and AI document automation.",
    url: "/work",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE}/work#collection`,
      name: "EdgeBrain Studios Case Studies",
      description:
        "Engineering case studies covering Next.js web development, React Native mobile apps, and AI automation built by EdgeBrain Studios.",
      url: `${SITE}/work`,
      inLanguage: "en",
      // References to the nodes declared in src/app/layout.tsx. Inlining a copy
      // with no @id declares a second, anonymous company on this page.
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORGANIZATION_ID },
      mainEntity: {
        "@type": "ItemList",
        name: "Case studies",
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: 3,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "EdgeBrain Studios: Next.js web development case study",
            url: `${SITE}/work/edgebrain-studios`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Project Atlas: AI automation case study",
            url: `${SITE}/work/project-atlas`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Pulse Mobile: React Native app case study",
            url: `${SITE}/work/pulse-mobile`,
          },
        ],
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE}/work#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Work",
          item: `${SITE}/work`,
        },
      ],
    },
  ],
};

export default function WorkPage() {
  return (
    <>
      {/* `<` is escaped so no schema string can terminate the block early.
          See src/app/layout.tsx. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <WorkPageContent />
    </>
  );
}
