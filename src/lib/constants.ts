export const SITE = {
  name: "EdgeBrain Studios",
  tagline: "We design & build software with an edge.",
  description:
    "EdgeBrain Studios is a software studio specializing in web development, mobile apps, AI automation, and consulting. Based in Lahore, working worldwide.",
  url: "https://edgebrainstudios.com",
} as const;

export const CONTACT = {
  phone: "+92 327 0944766",
  phoneTel: "tel:+923270944766",
  whatsapp: "https://wa.me/923270944766",
  email: "hello@edgebrainstudios.com",
  location: "Lahore, Pakistan",
  locationDetail: "Based in Lahore, Pakistan — working worldwide.",
} as const;

export const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const SERVICES = [
  {
    number: "01",
    title: "Web Development",
    description: "Performant, responsive web applications built with modern frameworks.",
    detail:
      "From marketing sites to complex platforms — we build fast, accessible, and scalable web experiences using Next.js, React, and TypeScript.",
    href: "/services#web-development",
  },
  {
    number: "02",
    title: "Mobile Apps",
    description: "Cross-platform mobile experiences that feel native.",
    detail:
      "iOS and Android apps built with React Native and Flutter. Smooth animations, offline-first architecture, and seamless backend integration.",
    href: "/services#mobile-apps",
  },
  {
    number: "03",
    title: "AI Automation",
    description: "Intelligent systems that eliminate manual workflows.",
    detail:
      "Custom AI pipelines, workflow automation, and intelligent agents that save time and reduce errors across your operations.",
    href: "/services#ai-automation",
  },
  {
    number: "04",
    title: "AI Integration & Consulting",
    description: "Strategic AI adoption tailored to your business.",
    detail:
      "We help you identify where AI fits, build proof-of-concepts, and integrate large language models and machine learning into your existing stack.",
    href: "/services#ai-consulting",
  },
] as const;

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Discover",
    description:
      "We dig into your goals, users, and constraints. Research the landscape, define scope, and align on what success looks like.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Wireframes, prototypes, and visual design — iterated fast. We design for clarity, not decoration.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Clean, tested, production-grade code. We ship iteratively, so you see progress weekly and can steer the build.",
  },
  {
    number: "04",
    title: "Ship",
    description:
      "Launch, monitor, and refine. We handle deployment, performance tuning, and post-launch support.",
  },
] as const;

export const STATS = [
  { value: 12, suffix: "+", label: "Projects Shipped" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 4, suffix: " weeks", label: "Avg. Delivery" },
  { value: 99.9, suffix: "%", label: "Uptime" },
] as const;

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
