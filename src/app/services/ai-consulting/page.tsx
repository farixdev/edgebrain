import type { Metadata } from "next";
import { ORGANIZATION_ID } from "@/lib/constants";
import { AIIntegrationConsultingPageContent } from "./content";
import { AI_CONSULTING_FAQS } from "./faqs";

export const metadata: Metadata = {
  title: "AI Integration Consulting & LLM Services",
  description:
    "AI integration consulting for product teams worldwide. We scope LLM features, RAG, evals, and cost control, then ship a working proof of concept in three weeks.",
  alternates: {
    canonical: "/services/ai-consulting",
  },
  openGraph: {
    title: "AI Integration Consulting & LLM Services | EdgeBrain Studios",
    description:
      "AI integration consulting for product teams worldwide. We scope LLM features, RAG, evals, and cost control, then ship a working proof of concept in three weeks.",
    url: "https://edgebrainstudios.com/services/ai-consulting",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://edgebrainstudios.com/services/ai-consulting#service",
      name: "AI Integration & Consulting",
      serviceType: "AI integration consulting",
      description:
        "AI integration and LLM consulting for founders and product teams. AI readiness assessment, proof of concept development, RAG implementation, LLM integration into existing products, evaluation harnesses and guardrails, cost control, and team enablement.",
      url: "https://edgebrainstudios.com/services/ai-consulting",
      // Reference to the layout's node, matching services/web-development.
      provider: { "@id": ORGANIZATION_ID },
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
        name: "AI integration and consulting deliverables",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "AI readiness assessment",
              description:
                "A two-week audit of your data, systems, and workflows producing 8 to 12 ranked AI use cases with hours-saved estimates and build costs.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "AI proof of concept development",
              description:
                "A single use case built and measured against a slice of your real production data, with published accuracy numbers and projected monthly model spend.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "RAG implementation services",
              description:
                "Chunking strategy, embedding model selection, vector database implementation in pgvector or Qdrant, reranking, and a retrieval evaluation set.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "LLM integration into existing products",
              description:
                "OpenAI, Anthropic, or open-weight models wired into your current codebase behind a provider interface with streaming, retries, and fallback routing.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "LLM evaluation and testing services",
              description:
                "An evaluation harness of 100 to 300 graded examples running in CI, plus output schema enforcement, input validation, and PII redaction.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "AI cost and latency control",
              description:
                "Prompt caching, model routing, per-request token budgets, and per-feature spend reporting to reduce monthly inference cost.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Team enablement and AI advisory",
              description:
                "Workshops against your own codebase, a written engineering playbook, and ongoing architecture and code review for your in-house team.",
            },
          },
        ],
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://edgebrainstudios.com/services/ai-consulting#breadcrumb",
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
          name: "AI Integration & Consulting",
          item: "https://edgebrainstudios.com/services/ai-consulting",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://edgebrainstudios.com/services/ai-consulting#faq",
      // Sourced from the same module the page renders, so the declared
      // answers can never drift from the visible ones.
      mainEntity: AI_CONSULTING_FAQS.map((faq) => ({
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

export default function AIConsultingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AIIntegrationConsultingPageContent />
    </>
  );
}
