import type { Metadata } from "next";
import { ORGANIZATION_ID, SITE } from "@/lib/constants";
import { FintechPaymentsPageContent } from "./content";

const PAGE_URL = `${SITE.url}/industries/fintech-payments-software-development`;

export const metadata: Metadata = {
  title: "Fintech & PCI Compliant App Development",
  description:
    "PCI scope is set by your checkout architecture. The SAQ A, A-EP and D fork, double-entry ledger design, PSD2 SCA and 3D Secure 2, explained by engineers.",
  alternates: {
    canonical: "/industries/fintech-payments-software-development",
  },
  openGraph: {
    title:
      "Fintech & Payments Software Development | EdgeBrain Studios",
    description:
      "How checkout architecture decides your PCI SAQ, why a double-entry ledger is the only defensible balance model, and what PSD2 demands of an EU payments build.",
    url: "/industries/fintech-payments-software-development",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Fintech and Payments Software Development",
      serviceType: "Fintech and payments platform engineering",
      description:
        "Engineering for payments and fintech products: PCI DSS scope reduction and SAQ selection driven by checkout architecture, double-entry ledger design, idempotent write paths, webhook and settlement reconciliation, PSD2 Strong Customer Authentication, 3D Secure 2 integration, and KYC, AML and dispute workflows.",
      url: PAGE_URL,
      // References the single ProfessionalService node declared in
      // src/app/layout.tsx rather than declaring a competing organisation.
      provider: { "@id": ORGANIZATION_ID },
      areaServed: {
        "@type": "Place",
        name: "Worldwide",
      },
      audience: {
        "@type": "Audience",
        audienceType:
          "Payments startups, fintech founders, and product teams building money-movement software",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Fintech and payments engineering",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "PCI scope and checkout architecture review",
              description:
                "Choosing between a hosted payment page, processor-hosted fields and server-side capture, and the SAQ A, SAQ A-EP or SAQ D consequences of each, before checkout code is written.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Payment ledger architecture",
              description:
                "Double-entry, append-only ledger design with compensating reversals, derived balances, minor-unit integer amounts, multi-currency and FX capture, and idempotency keys on every write path.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Settlement and webhook reconciliation",
              description:
                "At-least-once webhook ingestion with event deduplication and out-of-order handling, plus scheduled three-way reconciliation between the ledger, processor settlement files and bank statements.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "PSD2 SCA and 3D Secure 2 implementation",
              description:
                "Strong Customer Authentication with independent factors and dynamic linking, exemption handling, EMV 3-D Secure 2 frictionless and challenge flows, and the eIDAS QWAC and QSealC certificate stack for EU open banking interfaces.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "KYC, AML and dispute workflow engineering",
              description:
                "Asynchronous onboarding state machines against identity and screening vendors, scheduled sanctions rescreening, chargeback evidence workflows, and audit logging built to PCI and anti-money-laundering retention periods.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Explainable transaction monitoring",
              description:
                "Anomaly detection and transaction monitoring pipelines that record reason codes, feature attributions, model version and input snapshots so every automated decision can be reviewed by a human.",
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
          name: "Fintech & Payments Software Development",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

export default function FintechPaymentsIndustryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <FintechPaymentsPageContent />
    </>
  );
}
