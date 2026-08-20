import type { Metadata } from "next";
import { ORGANIZATION_ID, SITE } from "@/lib/constants";
import { SaaSProductDevelopmentContent } from "./content";

const PAGE_URL = `${SITE.url}/industries/saas-product-development`;

export const metadata: Metadata = {
  title: "Multi-Tenant B2B SaaS Development",
  description:
    "Multi-tenant SaaS architecture explained properly: Postgres row level security, SAML SSO and SCIM, usage metering, and SOC 2 controls you cannot bolt on later.",
  alternates: {
    canonical: "/industries/saas-product-development",
  },
  openGraph: {
    title: "Multi-Tenant B2B SaaS Development | EdgeBrain Studios",
    description:
      "The four tenant isolation models compared, Postgres RLS policy design, SAML and SCIM, usage metering, and the SOC 2 controls that have to be architectural.",
    url: "/industries/saas-product-development",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "B2B SaaS Product Development",
      serviceType: "Multi-tenant B2B SaaS product development",
      description:
        "Multi-tenant SaaS engineering: tenant isolation model selection, Postgres row level security policy design, enterprise SSO with SAML 2.0 and OIDC, SCIM 2.0 provisioning, role-based authorisation enforced at the data layer, immutable audit logging, and usage-based billing and metering.",
      url: PAGE_URL,
      // References the single ProfessionalService node declared in the root
      // layout. Never declare a second organisation entity here.
      provider: { "@id": ORGANIZATION_ID },
      areaServed: {
        "@type": "Place",
        name: "Worldwide",
      },
      audience: {
        "@type": "Audience",
        audienceType:
          "B2B SaaS founders, product teams, and engineering leaders",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "B2B SaaS engineering deliverables",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Multi-tenant architecture design",
              description:
                "Selection between shared schema, shared schema with row level security, schema per tenant, and database per tenant, judged on blast radius, noisy-neighbour behaviour, per-tenant restore, and migration cost at scale.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Postgres row level security implementation",
              description:
                "RLS policy design covering USING and WITH CHECK clauses, supporting indexes for policy predicates, tenant context via session variables or JWT claims, and connection pooling interactions.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Enterprise SSO and SCIM provisioning",
              description:
                "SAML 2.0 and OIDC single sign-on including SP-initiated and IdP-initiated flows, just-in-time provisioning, and SCIM 2.0 directory-driven user provisioning and deprovisioning.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Authorisation and audit logging",
              description:
                "Role-based, attribute-based, and relationship-based authorisation enforced at the query layer, immutable audit logs with actor, resource, and timestamp on every state change, and audited cross-tenant admin impersonation.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Usage metering and subscription billing",
              description:
                "Append-only usage event streams with idempotency keys reconciled against a billing provider, seat, usage, and hybrid pricing models, entitlements stored as data, and trial-to-paid conversion mechanics.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SaaS MVP development",
              description:
                "A first multi-tenant release with tenancy, authentication, roles, billing, and one core product loop, built so enterprise readiness is an addition rather than a rewrite.",
            },
          },
        ],
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
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
          name: "Industries",
          item: `${SITE.url}/industries`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "B2B SaaS Product Development",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

export default function SaaSProductDevelopmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SaaSProductDevelopmentContent />
    </>
  );
}
