import { Hero } from "@/components/sections/hero";
import { TechStrip } from "@/components/sections/tech-strip";
import { ServicesHome } from "@/components/sections/services-home";
import { WorkHome } from "@/components/sections/work-home";
import { ProcessHome } from "@/components/sections/process-home";
import { StatsHome } from "@/components/sections/stats-home";
import { PhilosophyHome } from "@/components/sections/philosophy-home";
import { TestimonialsHome } from "@/components/sections/testimonials-home";
import { CTAHome } from "@/components/sections/cta-home";

export default function Home() {
  return (
    <>
      <Hero />
      <TechStrip />
      <ServicesHome />
      <WorkHome />
      <ProcessHome />
      <StatsHome />
      <PhilosophyHome />
      <TestimonialsHome />
      <CTAHome />
    </>
  );
}
