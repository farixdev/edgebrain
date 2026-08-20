import type { Metadata } from "next";
import { Space_Grotesk, Inter, Poppins } from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RevealGuard } from "@/components/providers/reveal-guard";
import { ChatMount } from "@/components/providers/chat-mount";
import { ORGANIZATION_ID, SITE, WEBSITE_ID } from "@/lib/constants";
import "./globals.css";

/**
 * Runs while the browser is still parsing <head>, before any content paints.
 *
 * Adding `js-reveal` here is what arms the CSS-only hidden state used by the
 * scroll reveals (see globals.css). Because it is JS, a crawler that does not
 * execute scripts never sees a hidden element — which is the whole point: the
 * previous implementation serialised `opacity:0` into the SSR HTML of every
 * heading on the site.
 *
 * The timer is a failsafe: if the app bundle never loads, nothing would ever
 * un-hide the content, so after 4s the class is dropped and the page is
 * readable regardless. `RevealGuard` cancels it once React is running.
 */
const REVEAL_BOOTSTRAP = `(function(){var d=document.documentElement;d.classList.add("js-reveal");window.__ebRevealFailsafe=setTimeout(function(){d.classList.remove("js-reveal")},4000)})();`;

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    // The homepage is the site's highest-authority URL, so its title leads with
    // what buyers actually type — web development, mobile development, AI
    // automation — and keeps the brand as the suffix. 59 chars, inside the
    // ~60-char SERP cut. Do not lengthen it without re-measuring.
    default: `Web & Mobile Development, AI Automation | ${SITE.name}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  // Resolves every relative canonical/OG URL below and on every child page.
  metadataBase: new URL(SITE.url),
  // "./" resolves to the current route, so each page self-canonicalises unless
  // it exports its own `alternates`.
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Site-wide structured data.
 *
 * One @graph so the nodes can reference each other by @id instead of being
 * three disconnected blobs:
 *   #organization — ProfessionalService (a LocalBusiness subtype, which carries
 *                   address/geo/hours that a bare Organization cannot).
 *   #website      — WebSite, published by #organization.
 *
 * No SearchAction: there is no /search route, and pointing one at a URL that
 * does not exist is a structured-data violation.
 *
 * #organization is declared here and nowhere else. /software-development-lahore
 * emits a ProfessionalService node carrying this same @id on purpose — same
 * @id means consumers merge it into this node rather than reading a second,
 * competing local business at a second URL, which is the standard way a
 * location page ends up claiming two firms share one phone number. Anything
 * that page restates must match this node exactly; the one thing it adds is
 * Lahore to areaServed, which extends the set instead of contradicting it. If
 * you ever need a genuinely separate entity, give it a different @id.
 */
const SITE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": ORGANIZATION_ID,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      slogan: SITE.tagline,
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
        { "@type": "Country", name: "Pakistan" },
        { "@type": "Place", name: "Worldwide" },
      ],
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
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+92-327-0944766",
          email: "edgebrainstudios@gmail.com",
          contactType: "sales",
          areaServed: "Worldwide",
          availableLanguage: ["English", "Urdu"],
        },
      ],
      knowsAbout: [
        "Web development",
        "Next.js",
        "React",
        "TypeScript",
        "Mobile app development",
        "React Native",
        "AI automation",
        "Large language model integration",
        "WordPress to Next.js migration",
        "n8n workflow automation",
      ],
      /**
       * Every entry carries the same @id its own service page declares, so the
       * catalog entry and the page's Service node merge into one node instead
       * of standing up an anonymous second copy of each service. `name` is
       * therefore not free text here — it has to match the page byte for byte,
       * or the merged node ends up with two competing names.
       *
       * Six entries: the four disciplines, then the two technology-specific
       * pages that sit beneath them (a WordPress replatform is web
       * development; an n8n build is AI automation). They are listed last for
       * that reason, not because they matter less.
       */
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Software development and AI services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              "@id": `${SITE.url}/services/web-development#service`,
              name: "Next.js and React Web Development",
              url: `${SITE.url}/services/web-development`,
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              "@id": `${SITE.url}/services/mobile-app-development#service`,
              name: "Mobile App Development",
              url: `${SITE.url}/services/mobile-app-development`,
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              "@id": `${SITE.url}/services/ai-automation#service`,
              name: "AI Automation Services",
              url: `${SITE.url}/services/ai-automation`,
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              "@id": `${SITE.url}/services/ai-consulting#service`,
              name: "AI Integration & Consulting",
              url: `${SITE.url}/services/ai-consulting`,
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              "@id": `${SITE.url}/services/wordpress-to-nextjs-migration#service`,
              name: "WordPress to Next.js Migration",
              url: `${SITE.url}/services/wordpress-to-nextjs-migration`,
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              "@id": `${SITE.url}/services/n8n-automation-development#service`,
              name: "n8n Automation Development",
              url: `${SITE.url}/services/n8n-automation-development`,
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: "en",
      publisher: { "@id": ORGANIZATION_ID },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${poppins.variable}`}
      // REVEAL_BOOTSTRAP runs in <head> and adds `js-reveal` to this element
      // before React hydrates, so the client className legitimately differs
      // from the server one. Scoped to <html>'s own attributes; children are
      // still hydration-checked normally.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOTSTRAP }} />
      </head>
      <body>
        {/* Every `<` is escaped to its < form so that a schema string
            which ever contains a closing script tag cannot terminate this
            block early and inject markup. The same escape is applied at every
            JSON-LD site in the app. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SITE_SCHEMA).replace(/</g, "\\u003c"),
          }}
        />
        <RevealGuard />
        <SmoothScrollProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScrollProvider>
        {/* Last in <body> so the fixed launcher stacks above page content
            without needing a z-index war. ChatMount renders nothing at all on
            /admin — see the component for why. */}
        <ChatMount />
      </body>
    </html>
  );
}
