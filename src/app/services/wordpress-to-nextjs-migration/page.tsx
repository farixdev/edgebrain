import type { Metadata } from "next";
import { ORGANIZATION_ID } from "@/lib/constants";
import { WordPressMigrationPageContent } from "./content";
import { WP_MIGRATION_FAQS } from "./faqs";

const TITLE = "WordPress to Next.js Migration Service | EdgeBrain Studios";
const DESCRIPTION =
  "We migrate WordPress to Next.js without wrecking organic traffic. A crawled redirect map, canonical and schema parity checks, and a reversible cutover plan.";
const URL = "https://edgebrainstudios.com/services/wordpress-to-nextjs-migration";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "WordPress to Next.js migration",
    "headless WordPress Next.js",
    "migrate WordPress to React",
    "WordPress to Next.js migration service",
    "headless CMS migration agency",
    "WordPress replatform without losing SEO",
    "WPGraphQL headless frontend",
    "Next.js migration redirect map",
    "move off WordPress",
  ],
  alternates: {
    canonical: URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: "EdgeBrain Studios",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${URL}#service`,
      name: "WordPress to Next.js Migration",
      serviceType: "WordPress to Next.js migration and headless CMS replatform",
      url: URL,
      description:
        "Migration of an existing WordPress site to a Next.js front end without losing organic search traffic. Includes a redirect map generated from the live permalink structure, canonical, metadata and structured-data parity checks against the old site, a headless WordPress front end over WPGraphQL or a content move into a purpose-built CMS, a rebuilt editor preview and revalidation workflow, and a cutover runbook with a rollback path.",
      // Reference to the layout's node, matching services/ai-automation.
      provider: { "@id": ORGANIZATION_ID },
      areaServed: {
        "@type": "Place",
        name: "Worldwide",
      },
      audience: {
        "@type": "Audience",
        audienceType:
          "Site owners, marketing teams, and product teams replatforming an existing WordPress site",
      },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: "https://edgebrainstudios.com/contact",
        servicePhone: {
          "@type": "ContactPoint",
          telephone: "+92-327-0944766",
          contactType: "sales",
        },
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "WordPress to Next.js migration deliverables",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Redirect map generated from the WordPress permalink structure",
              description:
                "Every URL the install can serve — posts, pages, category, tag, author and date archives, attachment pages, feeds and paginated archives — mapped to a destination or a deliberate 410, reconciled against a full crawl and Search Console impressions.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Pre-cutover SEO parity audit",
              description:
                "URL-by-URL diff of status code, canonical, indexability, title, meta description, H1, internal link count and the full JSON-LD graph, run while the old site is still live.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Headless WordPress front end over WPGraphQL",
              description:
                "A Next.js front end reading the existing WordPress install through WPGraphQL with typed ACF fields, cached at the render layer rather than per request, with wp-admin hardened once it stops serving the public site.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Content model migration into a purpose-built CMS",
              description:
                "Content remodelled and exported out of WordPress into Sanity or Payload where the existing structure is a page builder's single rich-text field per page.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Editor preview and revalidation workflow",
              description:
                "Draft mode wired to a preview route so unpublished changes render on the real front end, publish-time revalidation through a signed webhook, and visible build status for editors.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Plugin replacement inventory",
              description:
                "Every active plugin catalogued with its replacement — forms, sitemaps, redirects, caching, analytics — and the ones with no replacement named before the contract rather than during the build.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Cutover runbook and post-launch redirect telemetry",
              description:
                "A written cutover sequence with lowered DNS TTLs, the old stack left running and reachable, a stated rollback condition, and two weeks of logged 404s and redirect hits reviewed daily after launch.",
            },
          },
        ],
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
          item: "https://edgebrainstudios.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: "https://edgebrainstudios.com/services",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "WordPress to Next.js Migration",
          item: URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      // Sourced from the same module content.tsx renders, so the declared
      // answers can never drift from the visible ones.
      mainEntity: WP_MIGRATION_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function WordPressToNextJsMigrationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\u003c"),
        }}
      />
      <WordPressMigrationPageContent />
    </>
  );
}
