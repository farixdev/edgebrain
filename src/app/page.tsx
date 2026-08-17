import { Hero } from "@/components/sections/hero";
import { ServicesHome } from "@/components/sections/services-home";
import { WorkHome } from "@/components/sections/work-home";
import { ProcessHome } from "@/components/sections/process-home";
import { WhyEdgeBrainHome } from "@/components/sections/why-edgebrain-home";
import { StatsHome } from "@/components/sections/stats-home";
import { ReviewsHome } from "@/components/sections/reviews-home";
import { FAQHome } from "@/components/sections/faq-home";
import { CTAHome } from "@/components/sections/cta-home";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What services does EdgeBrain Studios offer?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We specialize in four core areas: custom web development using modern frameworks like Next.js and React, cross-platform mobile app development, AI automation and workflow optimization, and AI integration consulting.",
                },
              },
              {
                "@type": "Question",
                name: "How long does a typical project take?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Most projects ship within 4–8 weeks from kickoff to launch. MVPs and marketing sites can go live in as little as 2–3 weeks.",
                },
              },
              {
                "@type": "Question",
                name: "Do you work with startups or enterprises?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Both. We’ve helped early-stage startups launch their first product and supported enterprise teams building internal tools and customer-facing platforms.",
                },
              },
              {
                "@type": "Question",
                name: "What does your tech stack look like?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Our core stack includes Next.js, React, TypeScript, Node.js, and Python. For mobile, we use React Native and Flutter. On the AI side, we work with OpenAI, custom ML pipelines, and vector databases.",
                },
              },
              {
                "@type": "Question",
                name: "How do you handle AI integration?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We start by identifying where AI creates the most value in your workflow. Then we build proof-of-concepts to validate the approach before committing to a full build.",
                },
              },
              {
                "@type": "Question",
                name: "What’s your pricing model?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We work on a project basis with fixed-scope pricing, so you know the cost upfront. For ongoing partnerships, we offer monthly retainers.",
                },
              },
            ],
          }),
        }}
      />
      <Hero />
      <ServicesHome />
      <WorkHome />
      <ProcessHome />
      <WhyEdgeBrainHome />
      <StatsHome />
      <ReviewsHome />
      <FAQHome />
      <CTAHome />
    </>
  );
}
