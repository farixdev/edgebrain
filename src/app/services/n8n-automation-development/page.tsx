import type { Metadata } from "next";
import { N8NAutomationPageContent } from "./content";
import { N8N_FAQS } from "./faqs";

const TITLE = "n8n Automation Development Agency | EdgeBrain Studios";
const DESCRIPTION =
  "Hire n8n developers for self-hosted deployment, custom nodes, queue mode, and AI agent workflows built for production. Fixed scope, quoted before kickoff.";
const URL = "https://edgebrainstudios.com/services/n8n-automation-development";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "hire n8n developers",
    "n8n automation agency",
    "n8n development services",
    "custom n8n nodes",
    "n8n workflow consultant",
    "self-hosted n8n deployment",
    "n8n AI agent workflows",
    "n8n vs Zapier for production",
    "n8n integration development",
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
      name: "n8n Automation Development",
      serviceType: "n8n Workflow Automation Development",
      url: URL,
      description:
        "n8n development services for teams that have already chosen the tool: custom node development, self-hosted deployment in queue mode, credential and encryption key handling, error branches and retry policy, AI agent workflows, and migration off Zapier or Make.",
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
      isRelatedTo: {
        "@type": "Service",
        "@id": "https://edgebrainstudios.com/services/ai-automation#service",
        name: "AI Automation",
        url: "https://edgebrainstudios.com/services/ai-automation",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "n8n development deliverables",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Custom n8n node development",
              description:
                "Declarative or programmatic custom nodes for internal and third-party APIs, shipped as a versioned npm package under the n8n-nodes- convention inside your own repository.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Self-hosted n8n deployment",
              description:
                "Queue mode with Redis and independently scaled workers, Postgres rather than the default SQLite, binary data offloaded to S3, execution data pruning configured before launch, and the encryption key managed in your secret manager.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "n8n AI agent workflows",
              description:
                "Agent workflows with a bounded tool list, chat memory persisted in Postgres, retrieval steps that return their sources, and a confidence threshold that routes a run to a human instead of guessing.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "n8n error handling and reliability engineering",
              description:
                "An instance-level error workflow, retry with backoff on network-bound nodes, error output branches, idempotency keys on every write, and a dead-letter queue that keeps the original payload so a failed run can be replayed.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "n8n workflow audit and rescue",
              description:
                "Refactoring oversized single-canvas workflows into sub-workflows, getting workflow JSON under source control, and documenting what each branch was built to do.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Zapier and Make migration to n8n",
              description:
                "Rebuilding per-task-billed automation chains as n8n workflows with real branching, then running them on n8n Cloud or on a self-hosted instance in your own cloud account.",
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
          name: "n8n Automation Development",
          item: URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      mainEntity: N8N_FAQS.map((faq) => ({
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

export default function N8NAutomationDevelopmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <N8NAutomationPageContent />
    </>
  );
}
