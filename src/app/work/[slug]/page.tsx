import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyContent } from "./content";

const PROJECTS: Record<
  string,
  {
    title: string;
    category: string;
    description: string;
    problem: string;
    approach: string;
    build: string;
    result: string;
    tech: string[];
    color: string;
    accent: string;
    placeholder?: boolean;
  }
> = {
  "edgebrain-studios": {
    title: "EdgeBrain Studios",
    category: "Web Development",
    description:
      "Our own portfolio — a showcase of the design and engineering standards we bring to every project.",
    problem:
      "We needed a portfolio site that demonstrated our capabilities at the highest level — performance, design, motion, and responsiveness — without feeling templated or over-designed.",
    approach:
      "We designed from scratch using an editorial-first approach: big type, generous whitespace, and a strict three-color system. Every section was built mobile-first with careful attention to rhythm and hierarchy.",
    build:
      "Next.js App Router with TypeScript, Tailwind CSS for styling, Framer Motion for page transitions and reveals, and GSAP for scroll-driven sequences. Self-hosted fonts, fully responsive, zero CLS.",
    result:
      "A site that communicates competence at first glance. Fast, accessible, and a living example of the quality we deliver to clients.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "Vercel"],
    color: "#1a1a1a",
    accent: "#FFD400",
  },
  "project-atlas": {
    title: "Project Atlas",
    category: "AI Automation",
    description:
      "An intelligent document processing pipeline for enterprise — automating extraction, classification, and routing.",
    problem:
      "The client's team spent 40+ hours per week manually processing, classifying, and routing business documents across departments.",
    approach:
      "We designed an AI pipeline that ingests documents in any format, extracts key data using GPT-4, classifies by type and urgency, and routes to the right team automatically.",
    build:
      "Python-based pipeline with FastAPI, OpenAI for extraction, custom classification models, PostgreSQL for structured storage, and AWS Lambda for serverless processing.",
    result:
      "Reduced manual processing time by 85%. Documents now routed within seconds instead of hours.",
    tech: ["Python", "OpenAI", "FastAPI", "PostgreSQL", "AWS Lambda"],
    color: "#0f1923",
    accent: "#4A9EFF",
    placeholder: true,
  },
  "pulse-mobile": {
    title: "Pulse Mobile",
    category: "Mobile App",
    description:
      "A cross-platform health tracking app with real-time sync, offline support, and wearable integration.",
    problem:
      "Users needed a unified health tracking experience across iOS and Android with reliable offline support and seamless sync when back online.",
    approach:
      "We chose React Native for cross-platform consistency, implemented an offline-first architecture with Supabase realtime, and integrated with Apple HealthKit and Google Fit.",
    build:
      "React Native with Expo, TypeScript, Supabase for backend and real-time sync, custom health data aggregation, push notifications, and smooth native-feeling animations.",
    result:
      "4.8 star rating on both app stores. 20K+ active users within the first quarter of launch.",
    tech: ["React Native", "TypeScript", "Supabase", "Expo"],
    color: "#1a0f23",
    accent: "#9B59B6",
    placeholder: true,
  },
};

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return Object.keys(PROJECTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS[slug];
  if (!project) return { title: "Not Found" };
  return {
    title: `${project.title} — Case Study`,
    description: project.description,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const project = PROJECTS[slug];
  if (!project) notFound();

  const slugs = Object.keys(PROJECTS);
  const currentIndex = slugs.indexOf(slug);
  const nextSlug = slugs[(currentIndex + 1) % slugs.length];
  const nextProject = PROJECTS[nextSlug];

  return (
    <CaseStudyContent
      project={project}
      nextProject={{ slug: nextSlug, title: nextProject.title }}
    />
  );
}
