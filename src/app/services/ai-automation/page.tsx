import type { Metadata } from "next";
import { ORGANIZATION_ID } from "@/lib/constants";
import { AIAutomationPageContent } from "./content";
import { AI_AUTOMATION_FAQS } from "./faqs";

export const metadata: Metadata = {
  title: "AI Automation Agency for Startups",
  description:
    "AI automation agency for startups. We automate document processing, data extraction, and back office workflows. Fixed scope, quoted upfront, live in 6 weeks.",
  alternates: {
    canonical: "/services/ai-automation",
  },
  openGraph: {
    title: "AI Automation Agency for Startups | EdgeBrain Studios",
    description:
      "We build document pipelines, extraction systems, and AI agents that remove manual back office work. Fixed scope, quoted upfront, first workflow live in weeks.",
    url: "/services/ai-automation",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://edgebrainstudios.com/services/ai-automation#service",
      name: "AI Automation Services",
      serviceType: "AI workflow automation and document processing",
      description:
        "Custom AI automation for startups and lean product teams: document processing pipelines, invoice and data extraction, RAG systems with vector search, intelligent agents, ticket classification, and integrations with CRM, ERP, and Slack.",
      url: "https://edgebrainstudios.com/services/ai-automation",
      // Reference to the layout's node, matching services/web-development.
      provider: { "@id": ORGANIZATION_ID },
      areaServed: {
        "@type": "Place",
        name: "Worldwide",
      },
      audience: {
        "@type": "Audience",
        audienceType: "Startups, founders, and lean product teams",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "AI automation deliverables",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Document processing pipeline",
              description:
                "Automated ingestion, extraction, and validation of PDFs, scans, and email attachments into structured records with a human review queue.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Invoice and purchase order data extraction",
              description:
                "Line-item extraction from supplier invoices, matched against purchase orders and pushed into accounting or ERP systems.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Support ticket classification and drafting",
              description:
                "Inbound tickets classified by intent and urgency, routed to the right queue, with drafted replies an agent approves.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "RAG system with vector search",
              description:
                "Retrieval augmented generation over internal contracts, SOPs, and historical tickets, with citations back to the source paragraph.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Custom AI agent development",
              description:
                "Agents with a defined tool list that read and write to your systems, log every step, and escalate to a human below a confidence threshold.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Workflow automation and systems integration",
              description:
                "n8n and Temporal workflows connecting CRM, ERP, billing, and Slack with retries, idempotency, and failure alerting.",
            },
          },
        ],
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://edgebrainstudios.com/services/ai-automation#breadcrumb",
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
          name: "AI Automation",
          item: "https://edgebrainstudios.com/services/ai-automation",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://edgebrainstudios.com/services/ai-automation#faq",
      // Sourced from the same module the page renders, so the declared
      // answers can never drift from the visible ones.
      mainEntity: AI_AUTOMATION_FAQS.map((faq) => ({
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

export default function AIAutomationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AIAutomationPageContent />
    </>
  );
}
