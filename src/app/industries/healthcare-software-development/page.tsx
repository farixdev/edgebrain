import type { Metadata } from "next";
import { ORGANIZATION_ID, SITE } from "@/lib/constants";
import { HealthcareIndustryPageContent } from "./content";

const PAGE_URL = `${SITE.url}/industries/healthcare-software-development`;

export const metadata: Metadata = {
  title: "HIPAA Compliant App Development",
  description:
    "What the HIPAA Security Rule and SMART on FHIR actually demand of a telehealth architecture, control by control, and how we would build one. No client claims.",
  alternates: {
    canonical: "/industries/healthcare-software-development",
  },
  openGraph: {
    title: "HIPAA Compliant App Development | EdgeBrain Studios",
    description:
      "The HIPAA technical safeguards at §164.312 read against real architecture decisions, plus HL7 v2, FHIR R4 and SMART on FHIR integration, written by engineers.",
    url: "/industries/healthcare-software-development",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Healthcare and Telehealth Software Development",
      serviceType:
        "Healthcare and telehealth software development, HIPAA-aligned application architecture and FHIR integration",
      description:
        "Custom healthcare and telehealth software development: applications architected against the HIPAA Security Rule technical safeguards at 45 CFR §164.312, HL7 v2 and FHIR R4 integration, SMART on FHIR EHR and standalone launch flows, and audit logging designed into the data layer. EdgeBrain Studios holds no HIPAA, HITRUST or SOC 2 attestation and publishes no healthcare client work.",
      url: PAGE_URL,
      // References the single ProfessionalService node declared in the root
      // layout. Never declare a second company entity here.
      provider: { "@id": ORGANIZATION_ID },
      areaServed: {
        "@type": "Place",
        name: "Worldwide",
      },
      audience: {
        "@type": "Audience",
        audienceType:
          "Digital health founders, telehealth providers, and health technology product teams",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Healthcare and telehealth engineering",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "HIPAA technical safeguards architecture review",
              description:
                "Access control, audit controls, integrity, authentication and transmission security mapped onto a concrete application design, separating required from addressable specifications.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Telehealth platform development",
              description:
                "Patient and clinician web and mobile applications with append-only audit trails, row and column level authorisation, and video delivered through a business-associate-covered vendor.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "FHIR and HL7 integration development",
              description:
                "FHIR R4 resource mapping for Patient, Encounter, Observation and DocumentReference, HL7 v2 ADT and ORU feed handling, and interface engine integration.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SMART on FHIR app development",
              description:
                "EHR launch and standalone launch OAuth2 flows, launch context handling, scope negotiation, and backend services authorisation against major EHR vendor sandboxes.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Clinical data de-identification and AI integration",
              description:
                "Safe Harbor de-identification across the eighteen identifiers at §164.514(b), and language model integration restricted to endpoints covered by a business associate agreement with zero-retention terms.",
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
          name: "Healthcare & Telehealth Software Development",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

export default function HealthcareIndustryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HealthcareIndustryPageContent />
    </>
  );
}
