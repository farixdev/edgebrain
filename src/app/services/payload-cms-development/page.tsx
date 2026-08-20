import type { Metadata } from "next";
import { ORGANIZATION_ID, SITE } from "@/lib/constants";
import { PayloadCMSPageContent } from "./content";
import { PAYLOAD_FAQS } from "./faqs";

const TITLE = "Payload CMS Development Agency | EdgeBrain Studios";
const DESCRIPTION =
  "Payload CMS development for teams already on Payload 3. Content modelling, access control, localisation and self-hosting decisions, argued in the open.";
const URL = `${SITE.url}/services/payload-cms-development`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "payload cms development agency",
    "payload cms developers",
    "hire payload cms developer",
    "payload cms next.js",
    "payload cms migration",
    "payload cms consulting",
    "payload 3 app router",
    "payload cms content modelling",
    "payload cms access control",
  ],
  alternates: {
    canonical: URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: SITE.name,
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
      name: "Payload CMS Development",
      serviceType:
        "Payload CMS development, content modelling and Next.js implementation",
      url: URL,
      description:
        "Design and implementation of Payload CMS projects on Payload 3 inside the Next.js App Router. Covers content modelling decisions across collections, globals and block fields, access control written as query constraints rather than per-document booleans, localisation strategy decided before the schema is written, database choice between the PostgreSQL and MongoDB adapters with committed migrations, media storage through a cloud storage adapter, and a drafts, preview and revalidation workflow for editors.",
      // Reference to the single ProfessionalService node declared in layout.tsx.
      provider: { "@id": ORGANIZATION_ID },
      areaServed: {
        "@type": "Place",
        name: "Worldwide",
      },
      audience: {
        "@type": "Audience",
        audienceType:
          "Product and marketing teams that have selected Payload CMS and need the content model, access control and hosting decided by engineers",
      },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${SITE.url}/contact`,
        servicePhone: {
          "@type": "ContactPoint",
          telephone: "+92-327-0944766",
          contactType: "sales",
        },
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Payload CMS development deliverables",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Payload 3 installation inside the Next.js App Router",
              description:
                "Payload installed into a dedicated route group in an existing Next.js project, the admin panel rendering as React Server Components, and the Local API called in-process from server components with no HTTP hop.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Content model design with a written schema decision log",
              description:
                "Every collection, global and block type defined with the reasoning for choosing it over the alternative, kept in the repository alongside the Payload config so the schema can be understood years later.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Access control implementation and review",
              description:
                "Collection-level read access written to return query constraints so list views remain a single indexed lookup, field-level access kept synchronous, Local API calls audited for overrideAccess, and a test per role.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Localisation strategy and implementation",
              description:
                "Locale list, per-field localisation, fallback behaviour and a decision on localised slugs settled before the first collection is written, with migrations where localisation is retrofitted onto existing content.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Database selection, schema migrations and self-hosting setup",
              description:
                "PostgreSQL or MongoDB adapter chosen against the content shape, generated migrations committed to the repository and run in CI, and a hosting topology that can split the admin panel from the public front end when scaling profiles diverge.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Media pipeline on object storage",
              description:
                "Uploads routed to S3, Cloudflare R2 or Vercel Blob through the cloud storage adapter, image sizes chosen against the layouts that exist, and no dependence on a local static directory that a container restart destroys.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Drafts, preview and revalidation workflow",
              description:
                "Draft mode wired to a preview route so unpublished changes render on the real front end, on-demand revalidation fired from an afterChange hook, and version retention capped so version history does not outgrow the content.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Migration of existing content into Payload",
              description:
                "Content remodelled rather than copied when it arrives from WordPress, Contentful or a page builder, with the import scripted, re-runnable and paired with a redirect map where URLs change.",
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
          item: SITE.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: `${SITE.url}/services`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Payload CMS Development",
          item: URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      // Sourced from the same module content.tsx renders, so the declared
      // answers can never drift from the visible ones.
      mainEntity: PAYLOAD_FAQS.map((faq) => ({
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

export default function PayloadCMSDevelopmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <PayloadCMSPageContent />
    </>
  );
}
