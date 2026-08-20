import type { Metadata } from "next";
import { ORGANIZATION_ID, SITE } from "@/lib/constants";
import { LogisticsIndustryContent } from "./content";

const PAGE_PATH = "/industries/logistics-supply-chain-software-development";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

export const metadata: Metadata = {
  title: "Custom Logistics Software Development",
  description:
    "Custom logistics and supply chain software development: EDI X12 and carrier API integration, WMS and TMS boundaries, offline-first driver apps, and route optimisation.",
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    title: `Custom Logistics Software Development | ${SITE.name}`,
    description:
      "Logistics software is an integration problem wearing a UI. EDI X12, carrier APIs, WMS and TMS boundaries, offline-first driver apps, and honest route optimisation.",
    url: PAGE_PATH,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Logistics & Supply Chain Software Development",
      serviceType: "Custom logistics and supply chain software development",
      description:
        "Custom software development for logistics, freight and supply chain operations: EDI X12 and EDIFACT translation at the boundary of an API-first core, carrier rate, label and tracking integration, WMS, TMS and ERP boundaries, offline-first driver and warehouse mobile apps, vehicle routing with time windows, and AI extraction from freight documents.",
      url: PAGE_URL,
      // References the single ProfessionalService node declared in the root
      // layout. This page must never declare a second company entity.
      provider: { "@id": ORGANIZATION_ID },
      areaServed: {
        "@type": "Place",
        name: "Worldwide",
      },
      audience: {
        "@type": "Audience",
        audienceType:
          "Freight brokers, carriers, 3PLs, shippers, and supply chain software teams",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Logistics software capabilities",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "EDI integration development",
              description:
                "ANSI X12 and UN/EDIFACT integration at the edge of an API-first core, covering the 204, 990, 214, 856, 810 and 997 transaction sets, ISA/GS/ST envelope control numbers, and VAN or AS2 transport with acknowledgement reconciliation.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Carrier API integration",
              description:
                "Rate, label and tracking integration with parcel and freight carrier APIs, including address validation and normalisation, dimensional weight, accessorial reconciliation, idempotent label generation and void handling.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "WMS and TMS integration development",
              description:
                "Integration across warehouse management, transport management and ERP systems with explicit ownership boundaries, allocation and reservation semantics, and cycle-count reconciliation instead of direct database writes.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Freight tracking and driver app development",
              description:
                "Offline-first mobile applications for drivers and warehouse staff with local write queues, per-field conflict resolution, background location under platform battery restrictions, geofenced status transitions and proof-of-delivery capture.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Route optimisation software development",
              description:
                "Vehicle routing with time windows and capacity constraints using savings, insertion, local search and metaheuristic approaches, with travel-time matrix caching and objective functions tuned against historical operating days.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Freight document automation",
              description:
                "Extraction pipelines for bills of lading, proofs of delivery, rate confirmations, customs paperwork and carrier invoices arriving as scans and photographs, with per-field confidence thresholds and a human review queue.",
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
          name: "Logistics & Supply Chain Software Development",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

export default function LogisticsIndustryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <LogisticsIndustryContent />
    </>
  );
}
