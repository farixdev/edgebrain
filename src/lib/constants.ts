import contentData from "@/data/content.json";

export const SITE = {
  name: "EdgeBrain Studios",
  tagline: "We design & build software with an edge.",
  description:
    "EdgeBrain Studios is a software studio specializing in web development, mobile apps, AI automation, and consulting. Based in Lahore, working worldwide.",
  url: "https://edgebrainstudios.com",
} as const;

export const CONTACT = contentData.contact;

export const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const SERVICES = contentData.services;
export const PROCESS_STEPS = contentData.processSteps;
export const STATS = contentData.stats;
export const PROJECTS = contentData.projects;
export const REVIEWS = contentData.reviews;
export const FAQS = contentData.faqs;
export const DIFFERENTIATORS = contentData.differentiators;

export const TECH_LOGOS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "AWS",
  "Tailwind",
  "PostgreSQL",
  "Docker",
  "Figma",
  "OpenAI",
  "Vercel",
] as const;
