import type { Metadata } from "next";
import { MobileAppDevelopmentPageContent } from "./content";
import { MOBILE_APP_FAQS } from "./faqs";

export const metadata: Metadata = {
  title: "React Native App Development Agency",
  description:
    "We build cross-platform iOS and Android apps in React Native, Flutter, and Expo. Senior engineers, fixed scope, first build in your hands in 4 to 8 weeks.",
  /**
   * This spoke owns the mobile terms outright. "app development company in
   * Lahore" was previously claimed by /services and /contact as well; it is
   * declared here and nowhere else.
   */
  keywords: [
    "React Native app development agency",
    "hire React Native developers",
    "cross-platform app development company",
    "app development company in Lahore",
    "Flutter app development company",
    "offline-first mobile app development",
  ],
  alternates: {
    canonical: "https://edgebrainstudios.com/services/mobile-app-development",
  },
  openGraph: {
    title: "React Native App Development Agency | EdgeBrain Studios",
    description:
      "Cross-platform mobile app development in React Native, Flutter, and Expo. Offline-first architecture, real-time sync, and app store submission handled.",
    url: "https://edgebrainstudios.com/services/mobile-app-development",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id":
        "https://edgebrainstudios.com/services/mobile-app-development#service",
      name: "Mobile App Development",
      serviceType: "Cross-platform mobile app development",
      url: "https://edgebrainstudios.com/services/mobile-app-development",
      description:
        "Cross-platform iOS and Android app development in React Native, Flutter, and Expo. Offline-first architecture, real-time sync, push notifications, device integrations, and App Store and Google Play submission. Fixed-scope quotes before kickoff, builds shipped weekly.",
      provider: {
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
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+92-327-0944766",
          email: "edgebrainstudios@gmail.com",
          contactType: "sales",
          areaServed: "Worldwide",
          availableLanguage: "English",
        },
      },
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
        },
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Mobile app development deliverables",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Cross-platform app development in React Native and Expo",
              description:
                "One TypeScript codebase shipping to both iOS and Android, sharing types with your web backend.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Offline-first mobile app development",
              description:
                "On-device SQLite, a write queue, and inspectable conflict resolution so the app works without signal.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Real-time sync mobile app development",
              description:
                "Postgres changes streamed over WebSockets so edits appear across devices in under a second.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Push notification infrastructure",
              description:
                "APNs and FCM delivery with per-user routing and deep links that open the correct screen.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Mobile client for an existing SaaS product",
              description:
                "Native screens built against your existing API, not a WebView wrapper around your website.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "App store submission and optimization",
              description:
                "Screenshots, privacy nutrition labels, Play data safety form, TestFlight setup, and review responses.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Device, Bluetooth, and wearable integrations",
              description:
                "BLE peripherals, barcode scanning, HealthKit and Health Connect, and Apple Watch companion apps.",
            },
          },
        ],
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id":
        "https://edgebrainstudios.com/services/mobile-app-development#breadcrumb",
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
          name: "Mobile App Development",
          item: "https://edgebrainstudios.com/services/mobile-app-development",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id":
        "https://edgebrainstudios.com/services/mobile-app-development#faq",
      // Sourced from the same module the page renders, so the declared
      // answers can never drift from the visible ones.
      mainEntity: MOBILE_APP_FAQS.map((faq) => ({
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

export default function MobileAppDevelopmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <MobileAppDevelopmentPageContent />
    </>
  );
}
