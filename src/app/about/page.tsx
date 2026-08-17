import type { Metadata } from "next";
import { AboutPageContent } from "./content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the team behind EdgeBrain Studios — a web development agency and software studio based in Lahore, Pakistan, building web apps, mobile experiences, and AI systems worldwide.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
