import type { Metadata } from "next";
import { ORGANIZATION_ID, WEBSITE_ID } from "@/lib/constants";
import { AboutPageContent } from "./content";

/**
 * This page used to be titled "About Our Software House in Lahore", which put
 * it in a straight fight with /software-development-lahore for the same query
 * while being a worse answer to it. The location page owns the city; this one
 * owns how the studio works, who it suits, and what it declines. Keep the
 * Lahore keyword out of the title, the H1 and the OG title here.
 *
 * 35 chars; the root layout appends " | EdgeBrain Studios" for 55 rendered.
 */
export const metadata: Metadata = {
  title: "How We Build, and What We Turn Down",
  description:
    "How EdgeBrain Studios works: the way we scope and price, the risky part built first, what makes a project a good fit, and the work we turn down and why.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "How We Build, and What We Turn Down | EdgeBrain Studios",
    description:
      "How the studio runs: fixed scope quoted before kickoff, a staging URL in week one, the risky part built first, and an honest list of the work we decline.",
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
        "How EdgeBrain Studios works: fixed-scope pricing quoted before kickoff, weekly builds against a staging URL from week one, the riskiest part of a system built first, and delivery in 4 to 8 weeks. Includes the kinds of work the studio declines and the reasons for each.",
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
