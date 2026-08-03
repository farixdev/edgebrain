import type { Metadata } from "next";
import { ContactPageContent } from "./content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with EdgeBrain Studios. Tell us about your project and we'll get back to you within 24 hours.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
