export type Project = {
  id: string;
  order: number;
  title: string;
  tagline: string;
  description: string;
  problem: string;
  features: string[];
  results?: string;
  stack: string[];
  githubUrl?: string;
  demoUrl?: string;
  status: "live" | "archived" | "in-progress";
};

// NOTE: Projects 1, 3, 4, 5 were named only (no detail) in the source brief.
// Fill in problem / features / results / links with the real specifics —
// placeholders below are reasonable drafts based on the project titles.
export const projects: Project[] = [
  {
    id: "ai-vehicle-health-monitoring",
    order: 1,
    title: "AI Vehicle Health Monitoring",
    tagline: "Patent-backed predictive diagnostics for vehicles.",
    description:
      "An AI-powered monitoring system that reads live vehicle sensor data and predicts component failures before they happen, giving drivers and fleet operators early warning instead of reactive repairs.",
    problem:
      "Vehicle faults are usually discovered only after they cause a breakdown, leading to expensive repairs and avoidable downtime for drivers and fleets.",
    features: [
      "Real-time sensor data ingestion",
      "Predictive failure detection model",
      "Anomaly alerting dashboard",
      "Historical health trend tracking",
    ],
    results:
      "Prototype formed the basis of a filed patent for AI-powered vehicle health monitoring.",
    stack: ["Python", "Machine Learning", "IoT Sensors", "ThingSpeak"],
    status: "archived",
  },
  {
    id: "contract-shield",
    order: 2,
    title: "Contract Shield",
    tagline: "Catch breaking API changes before production does.",
    description:
      "An automated API contract-breaking and regression detection platform that identifies silent schema changes and stress-tests APIs using adversarial payloads before production deployment.",
    problem:
      "Small API modifications often introduce unnoticed breaking changes that only surface after deployment, impacting downstream services.",
    features: [
      "Schema Snapshotting",
      "Contract Diffing",
      "Chaos Testing",
      "Regression Detection",
      "JSONL Vulnerability Reports",
      "CI/CD Ready Reports",
    ],
    results:
      "Detected four genuine API crash bugs caused by edge-case handling and validated all fixes through automated re-testing.",
    stack: ["Python", "FastAPI", "Pydantic", "Requests"],
    githubUrl: "https://github.com/DhanushDevang",
    status: "live",
  },
  {
    id: "real-time-messaging-platform",
    order: 3,
    title: "Real-Time Messaging Platform",
    tagline: "A WhatsApp-style app built for a real friend group, not a demo.",
    description:
      "A full-stack real-time messaging platform with live chat, presence, and video/voice calling, built for genuine day-to-day use by a small group of friends rather than as a portfolio-only exercise. Rebuilt into a TypeScript pnpm monorepo with a hardened security layer for production use.",
    problem:
      "Most chat-app clones stop at basic messaging and never survive contact with real users or real security requirements.",
    features: [
      "Real-time messaging via Socket.io",
      "LiveKit-powered voice & video calls",
      "JWT auth with token versioning & forced logout-all",
      "Rate limiting, CORS whitelist, account lockout & login audit logging",
      "TypeScript monorepo (Drizzle ORM, Joi, Pino)",
    ],
    results:
      "Deployed and actively used by a small group of friends, with a full security-hardening pass and an 8-page technical study guide generated from the project's 51-commit git history.",
    stack: ["React", "Node.js", "TypeScript", "Socket.io", "PostgreSQL", "LiveKit", "Redis"],
    githubUrl: "https://github.com/DhanushDevang",
    status: "live",
  },
  {
    id: "weather-monitoring",
    order: 4,
    title: "Weather Monitoring",
    tagline: "Live environmental data, tracked and visualized.",
    description:
      "A weather monitoring system that collects live environmental data and visualizes trends over time, built to explore sensor data pipelines and real-time dashboards.",
    problem:
      "Raw sensor readings are hard to act on without a clear, continuously updated view of trends over time.",
    features: [
      "Live data collection pipeline",
      "Historical trend charts",
      "Threshold-based alerting",
      "Responsive dashboard UI",
    ],
    stack: ["JavaScript", "Node.js", "ThingSpeak", "REST APIs"],
    githubUrl: "https://github.com/DhanushDevang",
    status: "archived",
  },
  {
    id: "pet-boarding-business-site",
    order: 5,
    title: "Business Website for Pet Boarding",
    tagline: "A production website for a real small business.",
    description:
      "A complete business website built for a pet boarding service, covering service listings, booking inquiries, and a clean, trustworthy presentation for prospective customers.",
    problem:
      "The business needed a professional online presence that made it easy for pet owners to learn about services and get in touch, without unnecessary complexity.",
    features: [
      "Service & pricing pages",
      "Booking inquiry form",
      "Mobile-first responsive design",
      "SEO-friendly structure",
    ],
    stack: ["React", "Tailwind CSS", "Vercel"],
    demoUrl: "#",
    status: "live",
  },
];

export const projectsSorted = [...projects].sort((a, b) => a.order - b.order);
