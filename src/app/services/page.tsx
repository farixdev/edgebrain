import type { Metadata } from "next";
import { ORGANIZATION_ID, WEBSITE_ID } from "@/lib/constants";
import { ServicesPageContent } from "./content";

const TITLE = "Custom Software Development Services";
const DESCRIPTION =
  "Web development, mobile apps, AI automation, and AI integration from a senior team in Lahore. Fixed scope, quoted upfront, most projects ship in 4 to 8 weeks.";
const URL = "https://edgebrainstudios.com/services";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  /**
   * Hub-level terms only.
   *
   * "web development company in Lahore" and "app development company in Lahore"
   * were removed: they belong to /services/web-development and
   * /services/mobile-app-development respectively, and having the hub claim
   * them too put three URLs on one term. "software house in Lahore" is owned
   * by /about, which is the page that actually answers it.
   */
  keywords: [
    "custom software development services",
    "product development agency for founders",
    "software development company in Pakistan",
    "AI automation company in Pakistan",
    "hire developers in Pakistan",
  ],
  alternates: {
    canonical: URL,
  },
  openGraph: {
    title: `${TITLE} | EdgeBrain Studios`,
    description: DESCRIPTION,
    url: URL,
    siteName: "EdgeBrain Studios",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | EdgeBrain Studios`,
    description: DESCRIPTION,
  },
};

const SERVICE_ITEMS = [
  {
    name: "Web Development",
    url: "https://edgebrainstudios.com/services/web-development",
    description:
      "Next.js, React, and TypeScript web applications. Marketing sites, SaaS platforms, dashboards, and e-commerce storefronts, from $6,000.",
  },
  {
    name: "Mobile App Development",
    url: "https://edgebrainstudios.com/services/mobile-app-development",
    description:
      "Cross-platform iOS and Android apps in React Native and Flutter, including offline-first architecture and app store submission, from $9,000.",
  },
  {
    name: "AI Automation",
    url: "https://edgebrainstudios.com/services/ai-automation",
    description:
      "Document processing pipelines, data extraction, and workflow agents that remove manual back office work. Pilots from $2,500.",
  },
  {
    name: "AI Integration & Consulting",
    url: "https://edgebrainstudios.com/services/ai-consulting",
    description:
      "AI readiness assessment, use case scoping, RAG and LLM integration into existing products, and proof of concept builds from $3,500.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${URL}#collectionpage`,
      url: URL,
      name: `${TITLE} | EdgeBrain Studios`,
      description: DESCRIPTION,
      // References, not copies: an inline Organization/WebSite with no @id is a
      // second, anonymous entity for a company the layout already declares.
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORGANIZATION_ID },
      mainEntity: {
        "@type": "ItemList",
        "@id": `${URL}#services`,
        name: "Software development services from EdgeBrain Studios",
        numberOfItems: SERVICE_ITEMS.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: SERVICE_ITEMS.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: service.name,
          url: service.url,
          item: {
            "@type": "Service",
            "@id": `${service.url}#service`,
            name: service.name,
            url: service.url,
            description: service.description,
            serviceType: service.name,
            provider: { "@id": ORGANIZATION_ID },
            areaServed: "Worldwide",
          },
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
          item: "https://edgebrainstudios.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: URL,
        },
      ],
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <ServicesPageContent />
    </>
  );
}
