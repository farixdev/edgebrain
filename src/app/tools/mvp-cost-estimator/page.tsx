import type { Metadata } from "next";
import { ORGANIZATION_ID, SITE, WEBSITE_ID } from "@/lib/constants";
import { MvpCostEstimatorContent } from "./content";

// 38 chars. The root layout template appends " | EdgeBrain Studios" (20) for
// 58 total, inside the ~60-character SERP cut. The differentiator is in the
// title on purpose: every competing result on this query is a gated form.
const TITLE = "MVP Cost Calculator, No Email Required";

// 157 chars.
const DESCRIPTION =
  "A free MVP cost calculator that shows its arithmetic. Every line item, every hour band, every assumption editable. No email gate, no signup, no data sent.";

const URL = `${SITE.url}/tools/mvp-cost-estimator`;

/**
 * WebApplication + BreadcrumbList.
 *
 * WebApplication rather than SoftwareApplication because it runs in the browser
 * and is not installed. The `offers` node with price "0" is the honest claim
 * here and the one the competing gated calculators cannot make: there is no
 * account, no email, and no server round trip, so there is nothing to charge
 * for and nothing to collect.
 *
 * No HowTo node. HowTo is deprecated, and FAQ rich results were retired in May
 * 2026, so neither would earn a result — and a HowTo describing "fill in the
 * form" would be markup for the sake of markup.
 *
 * Keep the BreadcrumbList in the same order as the visible `Breadcrumbs` trail
 * in content.tsx: Home, Tools, MVP cost estimator.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${URL}#webapp`,
      name: "MVP Cost Estimator",
      alternateName: "MVP Cost Calculator",
      url: URL,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Cost estimation calculator",
      operatingSystem: "Any modern web browser",
      browserRequirements: "Requires JavaScript.",
      description:
        "A free, no-signup MVP cost calculator. Choose platform, feature areas and design complexity, then read the full line-item breakdown — discovery, design, build by feature, integrations, QA, environment setup, deployment — plus first-year running costs and maintenance. Every hour band and assumption is published and editable, and the result is a range rather than a single number.",
      inLanguage: "en",
      isAccessibleForFree: true,
      isPartOf: { "@id": WEBSITE_ID },
      creator: { "@id": ORGANIZATION_ID },
      publisher: { "@id": ORGANIZATION_ID },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      featureList: [
        "Live estimate that updates as you type, with no email gate or signup",
        "Full line-item breakdown: discovery, design, build by feature area, integrations, QA, environment setup, deployment",
        "Editable assumptions: blended hourly rate, hours per feature area, QA share, contingency, maintenance percentage",
        "Low-to-high range rather than a single point estimate",
        "First-year cost of ownership including third-party running costs, app store fees and maintenance",
        "Runs entirely in the browser — no data is sent anywhere",
      ],
      about: {
        "@type": "Thing",
        name: "MVP software development cost estimation",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": URL,
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
          name: "Tools",
          item: `${SITE.url}/tools`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "MVP cost estimator",
          item: URL,
        },
      ],
    },
  ],
};

export const metadata: Metadata = {
  // Brand-free; the root layout's template appends " | EdgeBrain Studios".
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "MVP cost calculator",
    "MVP cost estimator",
    "software development cost calculator",
    "app development cost calculator",
    "how much does an MVP cost",
    "MVP development cost breakdown",
    "free software cost estimator no email",
  ],
  alternates: {
    canonical: "/tools/mvp-cost-estimator",
  },
  openGraph: {
    title: `MVP Cost Estimator | ${SITE.name}`,
    description:
      "Pick your platform and features, watch the number move. Every line item, every hour band and every assumption is visible and editable. No email gate.",
    url: "/tools/mvp-cost-estimator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `MVP Cost Estimator | ${SITE.name}`,
    description:
      "A free MVP cost calculator that shows its arithmetic and asks for nothing in return.",
  },
};

export default function MvpCostEstimatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <MvpCostEstimatorContent />
    </>
  );
}
