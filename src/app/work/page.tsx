import type { Metadata } from "next";
import { WorkPageContent } from "./content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Explore the EdgeBrain Studios portfolio — case studies and web development projects including web apps, mobile experiences, and AI-powered systems.",
};

export default function WorkPage() {
  return <WorkPageContent />;
}
