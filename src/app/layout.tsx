import type { Metadata } from "next";
import { Space_Grotesk, Inter, Poppins } from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SITE } from "@/lib/constants";
import "./globals.css";

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
    default: `${SITE.name} — Software Studio`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${poppins.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "EdgeBrain Studios",
              url: "https://edgebrainstudios.com",
              description:
                "EdgeBrain Studios is a software studio specializing in web development, mobile apps, AI automation, and consulting. Based in Lahore, working worldwide.",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+92-327-0944766",
                contactType: "sales",
                email: "edgebrainstudios@gmail.com",
                areaServed: "Worldwide",
                availableLanguage: "English",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Lahore",
                addressCountry: "PK",
              },
              sameAs: [],
            }),
          }}
        />
        <SmoothScrollProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
