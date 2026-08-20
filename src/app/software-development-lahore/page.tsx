import type { Metadata } from "next";
import { ORGANIZATION_ID, SITE } from "@/lib/constants";
import { LahorePageContent } from "./content";

const PAGE_URL = `${SITE.url}/software-development-lahore`;

export const metadata: Metadata = {
  // 38 chars here; the root layout appends " | EdgeBrain Studios", so the
  // rendered title is 58 and survives the ~60-char SERP cut. Do not lengthen
  // without re-measuring against the template in src/app/layout.tsx.
  title: "Software Development Company in Lahore",
  description:
    "Software house in Lahore building web apps, mobile apps, and AI automation. The local engineering market, real overlap hours with London, New York and Dubai.",
  alternates: {
    canonical: "/software-development-lahore",
  },
  openGraph: {
    title: "Software Development Company in Lahore | EdgeBrain Studios",
    description:
      "A small senior software studio in Lahore, Pakistan. The local engineering market, exact time zone overlap from five cities, and how cross-border contracts and IP work.",
    url: "/software-development-lahore",
    type: "website",
  },
};

/**
 * Structured data for the Lahore location page.
 *
 * The ProfessionalService node deliberately reuses ORGANIZATION_ID, the same
 * @id declared once in src/app/layout.tsx. Consumers merge nodes that share an
 * @id, so this describes the SAME company rather than standing up a second,
 * competing local business entity on a second URL — which is the classic way a
 * location page ends up telling Google there are two firms with one phone
 * number.
 *
 * Because the nodes merge, every property restated here must match the layout
 * byte for byte. The one intentional extension is areaServed: the layout
 * declares Pakistan and Worldwide, and this page adds Lahore as an explicit
 * City, which extends the set rather than contradicting it.
 *
 * No FAQPage: FAQ rich results were retired in May 2026 and this page has no
 * genuine Q&A block to describe.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": ORGANIZATION_ID,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      telephone: "+92-327-0944766",
      email: "edgebrainstudios@gmail.com",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lahore",
        addressRegion: "Punjab",
        addressCountry: "PK",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 31.5204,
        longitude: 74.3587,
      },
      areaServed: [
        { "@type": "City", name: "Lahore" },
        { "@type": "Country", name: "Pakistan" },
        { "@type": "Place", name: "Worldwide" },
      ],
      // Mirrors the layout node exactly: 10:00 to 22:00 PKT, Monday to Friday.
      // The overlap table rendered in content.tsx is calculated from these
      // hours, so the two have to move together.
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "10:00",
          closes: "22:00",
        },
      ],
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
          name: "Software Development in Lahore",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

export default function SoftwareDevelopmentLahorePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <LahorePageContent />
    </>
  );
}
