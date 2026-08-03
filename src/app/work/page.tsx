import type { Metadata } from "next";
import { WorkPageContent } from "./content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "See what EdgeBrain Studios has built — web apps, mobile experiences, and AI-powered systems.",
};

export default function WorkPage() {
  return <WorkPageContent />;
}
