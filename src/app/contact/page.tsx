import type { Metadata } from "next";
import { ContactPageContent } from "./content";

const TITLE = "Contact EdgeBrain Studios | Get a Project Quote";
const DESCRIPTION =
  "Tell us what you are building. A senior engineer replies within 24 hours and a fixed quote follows within two business days. Software studio in Lahore, clients worldwide.";
const URL = "https://edgebrainstudios.com/contact";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  /**
   * Transactional intent only.
   *
   * This list used to copy five commercial head terms verbatim from /services
   * ("hire developers in Pakistan", "software development company in
   * Pakistan", "web development company in Lahore", "app development company
   * in Lahore", "AI automation company in Pakistan"), so /contact competed with
   * the hub and, on the web-development term, with the spoke as well. Those
   * terms belong to the pages that answer them; this page exists to convert.
   * "software house in Lahore" is owned by /about.
   */
  keywords: [
    "contact software house in Lahore",
    "get a software project quote",
    "outsource software development to Pakistan",
  ],
  alternates: {
    canonical: URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: "EdgeBrain Studios",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${URL}#contactpage`,
      url: URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "en",
      isPartOf: {
        "@type": "WebSite",
        "@id": "https://edgebrainstudios.com/#website",
        name: "EdgeBrain Studios",
        url: "https://edgebrainstudios.com",
      },
      about: {
        "@type": "Organization",
        "@id": "https://edgebrainstudios.com/#organization",
        name: "EdgeBrain Studios",
        url: "https://edgebrainstudios.com",
        email: "edgebrainstudios@gmail.com",
        telephone: "+92-327-0944766",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lahore",
          addressRegion: "Punjab",
          addressCountry: "PK",
        },
        areaServed: {
          "@type": "Place",
          name: "Worldwide",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: "+92-327-0944766",
            email: "edgebrainstudios@gmail.com",
            url: URL,
            areaServed: "Worldwide",
            availableLanguage: ["English", "Urdu"],
            hoursAvailable: {
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
          },
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            telephone: "+92-327-0944766",
            email: "edgebrainstudios@gmail.com",
            areaServed: "Worldwide",
            availableLanguage: ["English", "Urdu"],
          },
        ],
      },
      potentialAction: {
        "@type": "CommunicateAction",
        name: "Send a project enquiry",
        target: URL,
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
          item: "https://edgebrainstudios.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact",
          item: URL,
        },
      ],
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <ContactPageContent />
    </>
  );
}
