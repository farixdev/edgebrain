import type { Metadata } from "next";
import { ServicesPageContent } from "./content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, mobile apps, AI automation, and consulting. EdgeBrain Studios builds performant software tailored to your business.",
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
