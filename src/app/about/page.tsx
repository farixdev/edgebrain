import type { Metadata } from "next";
import { AboutPageContent } from "./content";

export const metadata: Metadata = {
  title: "About",
  description:
    "EdgeBrain Studios is a software studio based in Lahore, Pakistan. We build web apps, mobile experiences, and AI systems for clients worldwide.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
