import { Hero } from "@/components/sections/hero";
import { ServicesHome } from "@/components/sections/services-home";
import { WorkHome } from "@/components/sections/work-home";
import { ProcessHome } from "@/components/sections/process-home";
import { WhyEdgeBrainHome } from "@/components/sections/why-edgebrain-home";
import { StatsHome } from "@/components/sections/stats-home";
import { FAQHome } from "@/components/sections/faq-home";
import { CTAHome } from "@/components/sections/cta-home";
import { HOME_FAQS } from "@/components/sections/faq-home-data";
import { SITE } from "@/lib/constants";

/**
 * FAQPage built from the same array the FAQHome section renders, so the schema
 * and the visible answers cannot drift. Google treats FAQ markup that does not
 * match the on-page content as a structured-data violation, so never hardcode
 * questions here — edit faq-home-data.ts and both sides move together.
 */
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE.url}/#faq`,
  isPartOf: { "@id": `${SITE.url}/#website` },
  mainEntity: HOME_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function Home() {
  return (
    <>
      {/* `<` is escaped so an FAQ answer containing a closing script tag
          cannot break out of this block. See src/app/layout.tsx. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(FAQ_SCHEMA).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <ServicesHome />
      <WorkHome />
      <ProcessHome />
      <WhyEdgeBrainHome />
      <StatsHome />
      {/* The reviews section is deliberately absent. It rendered six invented
          people, employers, and outcome metrics under "Trusted by teams that
          ship", each with a five-star graphic, disclosed only by a half-opacity
          "(placeholder)" note. Restore it when there are real, attributable
          testimonials to publish — content.json's `reviews` array is empty
          until then. */}
      <FAQHome />
      <CTAHome />
    </>
  );
}
