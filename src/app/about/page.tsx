import type { Metadata } from "next";
import { ORGANIZATION_ID, WEBSITE_ID } from "@/lib/constants";
import { AboutPageContent } from "./content";

export const metadata: Metadata = {
  title: "About Our Software House in Lahore",
  description:
    "EdgeBrain Studios is a software house in Lahore building web apps, mobile apps, and AI automation worldwide. Senior engineers, fixed scope, 4 to 8 week builds.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Our Software House in Lahore | EdgeBrain Studios",
    description:
      "A small senior team in Lahore, Pakistan, shipping web apps, mobile apps, and AI automation worldwide. Fixed scope quoted upfront, weekly builds, live in 4 to 8 weeks.",
    url: "/about",
    type: "website",
  },
};

/**
 * Both node references below point at the nodes defined in src/app/layout.tsx
 * via the shared IRI constants.
 *
 * They used to be spelled out here without the trailing slash
 * (`https://edgebrainstudios.com#organization`), which is a different IRI from
 * the layout's `.../#organization`. The result was two Organization nodes on
 * the same page describing the same company with different @type values and
 * different slogans. The layout node is the single source of truth; this page
 * only says "the thing this page is about is that node".
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://edgebrainstudios.com/about#aboutpage",
      url: "https://edgebrainstudios.com/about",
      name: "About EdgeBrain Studios",
      description:
        "EdgeBrain Studios is a software house in Lahore, Pakistan, building web applications, mobile apps, and AI automation for founders and lean product teams worldwide. Fixed-scope pricing quoted before kickoff, weekly builds, and delivery in 4 to 8 weeks.",
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://edgebrainstudios.com/about#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://edgebrainstudios.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: "https://edgebrainstudios.com/about",
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AboutPageContent />
    </>
  );
}
