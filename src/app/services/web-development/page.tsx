import type { Metadata } from "next";
import { WebDevelopmentPageContent } from "./content";
import { WEB_DEV_FAQS } from "./faqs";

const TITLE = "Next.js Web Development Agency | EdgeBrain Studios";
const DESCRIPTION =
  "A Next.js development agency for founders and lean product teams. We ship SaaS platforms, dashboards, and marketing sites in 4 to 8 weeks. Priced upfront.";
const URL = "https://edgebrainstudios.com/services/web-development";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "Next.js development agency",
    "hire Next.js developers",
    "React development company",
    "SaaS MVP development company",
    "custom web application development",
    "web development company in Lahore",
    "headless CMS website development",
    "migrate WordPress to Next.js",
    "TypeScript development team",
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

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${URL}#service`,
      name: "Next.js and React Web Development",
      serviceType: "Web Development",
      url: URL,
      description:
        "Custom web application development in Next.js, React, and TypeScript. EdgeBrain Studios builds SaaS platforms, dashboards, headless CMS marketing sites, e-commerce storefronts, and internal tools, shipped in 4 to 8 weeks on fixed scope.",
      provider: {
        "@type": "Organization",
        "@id": "https://edgebrainstudios.com/#organization",
        name: "EdgeBrain Studios",
        url: "https://edgebrainstudios.com",
        email: "edgebrainstudios@gmail.com",
        telephone: "+92-327-0944766",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lahore",
          addressCountry: "PK",
        },
      },
      areaServed: {
        "@type": "Place",
        name: "Worldwide",
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
        name: "Web development deliverables",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SaaS platform development",
              description:
                "A Next.js SaaS platform with authentication, organisation-level roles, Stripe billing with webhook reconciliation, and a performant dashboard.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Headless CMS website development",
              description:
                "A Next.js front end on Sanity or Payload so marketing teams publish pages without a developer or a deployment.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "WordPress to Next.js migration",
              description:
                "Performance rebuild and migration with a full 301 redirect map, ported metadata and structured data, and Largest Contentful Paint under 1.5 seconds.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Internal tools and admin dashboards",
              description:
                "Role-based internal tools with audit trails, CSV import and export, and a PostgreSQL schema replacing spreadsheet workflows.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Headless e-commerce development",
              description:
                "Next.js storefronts on the Shopify Storefront API, keeping Shopify checkout while removing the theme-engine performance cost.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "API integration development",
              description:
                "Typed API layers between third-party systems with retries, idempotency keys, and readable sync logging.",
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
          name: "Web Development",
          item: URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      mainEntity: WEB_DEV_FAQS.map((faq) => ({
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

export default function WebDevelopmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <WebDevelopmentPageContent />
    </>
  );
}
