import type { Metadata } from "next";
import { ORGANIZATION_ID, SITE } from "@/lib/constants";
import { SupabaseDevelopmentPageContent } from "./content";
import { SUPABASE_FAQS } from "./faqs";

const TITLE = "Supabase Development & RLS Agency | EdgeBrain Studios";
const DESCRIPTION =
  "We build on Supabase as Postgres, not a Firebase clone: RLS policies that use their indexes, pooler-aware connections, and pgvector search that holds up.";
const URL = `${SITE.url}/services/supabase-development`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "supabase development agency",
    "hire supabase developers",
    "supabase consulting",
    "supabase rls policy design",
    "supabase postgres architecture",
    "supabase auth implementation",
    "supabase pgvector rag",
    "supabase edge functions",
    "supabase connection pooling",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${URL}#service`,
      name: "Supabase Development",
      serviceType:
        "Supabase and Postgres application development, RLS policy design and pgvector retrieval",
      url: URL,
      description:
        "Application development on Supabase treated as Postgres engineering: Row Level Security policies written so they use their supporting indexes, a migration history held in version control, a connection strategy per runtime across Supavisor transaction and session modes, Supabase Auth wired to an authorisation model that lives in the schema, a stated boundary between Edge Functions, route handlers, triggers and queued jobs, storage object policies, and pgvector retrieval with a deliberate index choice.",
      // Reference to the layout's node, matching the other service pages.
      provider: { "@id": ORGANIZATION_ID },
      areaServed: {
        "@type": "Place",
        name: "Worldwide",
      },
      audience: {
        "@type": "Audience",
        audienceType:
          "Product and engineering teams that have already selected Supabase and need Postgres, RLS and vector search built properly",
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
        name: "Supabase development deliverables",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Row Level Security policy design and testing",
              description:
                "RLS enabled on every table holding user data, policies split by command rather than a single catch-all, auth.uid() wrapped in a scalar subquery so it is evaluated once per statement, supporting indexes on every column a policy filters on, and an integration suite that exercises each policy as a real signed-in user.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Postgres schema and migration history in version control",
              description:
                "Every schema change lands as a migration file in the repository rather than as a click in the dashboard, exercised against a branch database before it touches production data.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Connection strategy for serverless runtimes",
              description:
                "A written decision per process about Supavisor transaction mode, session mode or a direct connection, including prepared-statement handling, the session state that transaction mode cannot carry, and where migration tooling connects.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Supabase Auth wired to a schema-level authorisation model",
              description:
                "Roles, organisation membership and plan tier modelled as tables, only what belongs in the token surfaced through a custom access token hook, and the remainder left as joins the policies can index.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Edge Function, route handler, trigger and queue boundary map",
              description:
                "A stated rule for what runs in a Deno Edge Function, what runs in a Next.js route handler, which invariants belong in database triggers, and which work belongs in a queue table drained by pg_cron rather than in Realtime.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Supabase Storage object policies and signed URLs",
              description:
                "Object policies on storage.objects mirroring the table policies, signed URLs with real expiry for private assets, and built-in image transformation used in place of a bespoke resize pipeline.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "pgvector retrieval layer with a measured index choice",
              description:
                "Embeddings stored beside the rows they describe, HNSW or IVFFlat chosen against build time and recall stability, ef_search tuned for the latency budget, and recall measured against a labelled question set.",
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
          name: "Supabase Development",
          item: URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      // Sourced from the same module content.tsx renders, so the declared
      // answers can never drift from the visible ones.
      mainEntity: SUPABASE_FAQS.map((faq) => ({
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

export default function SupabaseDevelopmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SupabaseDevelopmentPageContent />
    </>
  );
}
