/**
 * The single source of truth for everything under /industries.
 *
 * The hub cards, the hub's CollectionPage/ItemList JSON-LD, the sitemap and
 * each vertical route all read from this array. Nothing about an industry page
 * — its H1, its SERP title, its meta description — should be typed twice. If a
 * route disagrees with this file, the route is wrong.
 *
 * Field discipline, because these are the things that quietly rot:
 *
 *   title       The page H1 and the hub card heading. Also the anchor text, so
 *               it has to read as a description of the destination on its own.
 *
 *   seoTitle    Brand-free. The root layout's metadata template appends
 *               " | EdgeBrain Studios" (20 characters), so keep this at or
 *               under 40 to stay inside the ~60-character SERP cut.
 *
 *   description The meta description, 150-160 characters. Under 150 wastes the
 *               snippet, over 160 gets truncated mid-sentence.
 *
 *   excerpt     Hub-card copy only. Never rendered on the vertical page itself,
 *               so it can take the description's angle in different words
 *               rather than duplicating it verbatim.
 *
 *   summary     One sentence, plain, no rhetoric. This is what goes into the
 *               ItemList node and anywhere a compact machine-readable line is
 *               needed, so it should say what the page covers rather than sell.
 *
 * A standing constraint on every field here: these pages document regulation,
 * integration formats and architecture. They do not claim clients, sectors
 * served, outcomes or vertical track record, and no copy in this file may
 * imply any. "What HIPAA requires of a telehealth architecture" is honest.
 * "We build HIPAA-compliant telehealth platforms" is not.
 */

export interface Industry {
  slug: string;
  /** The page H1, the hub card heading, and the anchor text. */
  title: string;
  /** Brand-free, <= 40 chars. The layout template appends " | EdgeBrain Studios". */
  seoTitle: string;
  /** Meta description, 150-160 chars. */
  description: string;
  /** 1-2 sentences for the hub card. */
  excerpt: string;
  /** One flat sentence for structured data and compact listings. */
  summary: string;
}

/**
 * Order is the order the hub renders in, and it is deliberate: the two
 * heavily-regulated verticals first, because regulation is the thing that most
 * changes an architecture, then the two where integration surface dominates.
 */
export const INDUSTRIES: Industry[] = [
  {
    slug: "healthcare-software-development",
    title: "Healthcare & Telehealth Software Development",
    seoTitle: "Healthcare Software Development",
    description:
      "What HIPAA and FHIR actually demand of a telehealth build: PHI boundaries, audit logging, a BAA with every vendor, and the integration work nobody scopes.",
    excerpt:
      "Telehealth, patient portals, scheduling and intake. The application code is ordinary; the audit trail, the PHI boundary and the HL7 v2 feed out of a hospital interface engine are not.",
    summary:
      "How HIPAA, HL7 v2 and FHIR shape a telehealth or patient-facing architecture, and what that adds to the cost of a build.",
  },
  {
    slug: "fintech-payments-software-development",
    title: "Fintech & Payments Software Development",
    seoTitle: "Fintech & Payments Development",
    description:
      "Payments, ledgers and onboarding from an engineering angle: double-entry that balances, idempotent webhooks, PCI DSS scope reduction, and reconciliation.",
    excerpt:
      "Card flows, ledgers, payouts and KYC. Money software fails differently from other software, and most of the real cost sits in the parts that make failure survivable.",
    summary:
      "Double-entry ledger design, idempotency, PCI DSS scope reduction, KYC and AML flows, and the reconciliation layer most payment builds discover late.",
  },
  {
    slug: "logistics-supply-chain-software-development",
    title: "Logistics & Supply Chain Software Development",
    seoTitle: "Supply Chain Software Development",
    description:
      "Dispatch, tracking, WMS and TMS integration. What logistics software has to survive: bad GPS, offline scanners, and partners still trading EDI over SFTP.",
    excerpt:
      "Dispatch, freight, warehouse and last-mile systems. The hard parts are EDI, offline-first scanning, and the fact that every partner integration is from a different decade.",
    summary:
      "EDI and API integration, offline-first mobile scanning, route optimisation, and the event model behind a tracking, TMS or WMS build.",
  },
  {
    slug: "saas-product-development",
    title: "B2B SaaS Product Development",
    seoTitle: "B2B SaaS Product Development",
    description:
      "Multi-tenancy, metered billing, RBAC and SSO for B2B SaaS: the architecture calls that are cheap in month one and very expensive to reverse in year three.",
    excerpt:
      "Tenant isolation, usage billing, SAML SSO and audit logs. Most B2B SaaS rewrites trace back to three or four decisions made before the first customer signed.",
    summary:
      "Tenant isolation models, metered billing, enterprise SSO and RBAC, and the SOC 2 groundwork buyers ask for at the first enterprise deal.",
  },
];

/** The canonical route for an industry page. Use this instead of interpolating. */
export function industryHref(slug: string): string {
  return `/industries/${slug}`;
}

/** Lookup for the vertical routes, so a page never re-types its own metadata. */
export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((industry) => industry.slug === slug);
}
