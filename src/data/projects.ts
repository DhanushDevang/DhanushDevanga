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
  period: string;
  githubUrl?: string;
  demoUrl?: string;
  status: "live" | "archived" | "in-progress";
};

export const projects: Project[] = [
  {
    id: "contract-shield",
    order: 1,
    title: "Contract Shield",
    tagline: "Catch breaking API changes before production does.",
    description:
      "An AI-driven automation tool that uses LLM APIs for code generation, debugging, and developer task assistance — combined with an automated API contract-breaking and regression detection engine that identifies silent schema changes and stress-tests APIs using adversarial payloads before deployment.",
    problem:
      "Small API modifications often introduce unnoticed breaking changes that only surface after deployment, impacting downstream services.",
    features: [
      "Schema Snapshotting & Contract Diffing",
      "Chaos Testing with adversarial inputs",
      "Regression Detection",
      "OpenAI-powered agent workflows for debugging assistance",
      "Prompt-engineered evaluation of AI-generated outputs",
      "JSONL Vulnerability Reports, CI/CD Ready",
    ],
    results:
      "Detected four genuine API crash bugs caused by edge-case handling and validated all fixes through automated re-testing.",
    stack: ["Python", "FastAPI", "Pydantic", "Requests", "OpenAI APIs"],
    period: "June 2026 – Present",
    status: "in-progress",
  },
  {
    id: "whatsapp-clone",
    order: 2,
    title: "WhatsApp Clone — Full-Stack Messaging Application",
    tagline: "A production-grade chat app, built for a real friend group.",
    description:
      "A full-stack real-time messaging platform built with React.js, Node.js, Express, and PostgreSQL, supporting text, voice, and image messaging over Socket.io WebSockets plus live voice/video calling via LiveKit (WebRTC). Deployed on Replit with CI/CD through GitHub.",
    problem:
      "Most chat-app clones stop at basic messaging and never survive contact with real users, production payload limits, or real security requirements.",
    features: [
      "RESTful APIs for registration, conversations & message retrieval, with base64 media storage in PostgreSQL",
      "CORS policies, 50MB payload handling, environment-based config for production reliability",
      "Responsive UI: dark/light mode, custom wallpapers, real-time presence, voice recording, image sharing, show/hide password, live validation",
      "reCAPTCHA, account lockout, rate limiting, and JWT session versioning against brute-force & bot attacks",
    ],
    results: "Deployed and actively used day-to-day by a small group of friends.",
    stack: ["React", "Node.js", "Express", "PostgreSQL", "Socket.io", "LiveKit (WebRTC)", "JWT"],
    period: "Jan 2026 – May 2026",
    githubUrl: "https://github.com/DhanushDevang",
    status: "live",
  },
  {
    id: "ai-vehicle-health-monitoring",
    order: 3,
    title: "AI-Powered Vehicle Health Monitoring & Predictive Maintenance System",
    tagline: "Patent-filed predictive diagnostics for vehicles.",
    description:
      "A data-driven system using Python and IoT sensor data to analyze real-time vehicle performance — including engine health and fuel efficiency — through an interactive dashboard, with workflow-based alerting for automated maintenance decisions.",
    problem:
      "Vehicle faults are usually discovered only after they cause a breakdown, leading to expensive repairs and avoidable downtime for drivers and fleets.",
    features: [
      "Real-time IoT sensor data ingestion & validation",
      "Interactive dashboard for engine health & fuel efficiency",
      "Workflow-based automated alert system",
      "Predictive maintenance decision support",
    ],
    results:
      "Formed the basis of a filed patent — \"AI-Powered Vehicle Health Monitoring & Predictive Maintenance System using IoT Sensors\" (Patent Application No. 202641048002).",
    stack: ["Python", "IoT Sensors", "Machine Learning", "ThingSpeak"],
    period: "Feb 2025 – Feb 2026",
    status: "archived",
  },
  {
    id: "plant-disease-detection",
    order: 4,
    title: "Plant Disease Detection using CNN (MATLAB)",
    tagline: "Smart agriculture meets computer vision.",
    description:
      "A CNN-based plant disease detection system built in MATLAB using image processing techniques, paired with a user-friendly application for disease classification and result visualization.",
    problem:
      "Manual plant disease diagnosis is slow and inconsistent, delaying intervention and risking crop yield.",
    features: [
      "CNN-based image classification pipeline",
      "MATLAB application for classification & visualization",
      "ThingSpeak integration for remote monitoring",
      "Smart agriculture data tracking",
    ],
    stack: ["MATLAB", "CNN", "Image Processing", "ThingSpeak"],
    period: "Jan 2025 – Mar 2025",
    status: "archived",
  },
  {
    id: "pet-boarding-business-site",
    order: 5,
    title: "Business Website & Digital Growth System for Pet Boarding Service",
    tagline: "A production website that moved real business metrics.",
    description:
      "A full-stack business website with a Supabase backend for a pet boarding service, covering booking management, structured content handling, and a multi-channel digital growth push across search and social.",
    problem:
      "The business needed a professional online presence and booking system, plus a way to actually drive bookings through search and social — not just a static brochure site.",
    features: [
      "Full-stack site with Supabase backend",
      "Online booking system with data tracking",
      "SEO optimization",
      "12-week Google Ads campaign",
      "Instagram growth via Reels & Meta Ads",
    ],
    results:
      "Increased revenue 120% through data-driven booking workflows and boosted Instagram engagement 73% via Reels and Meta Ads.",
    stack: ["React", "Supabase", "Tailwind CSS", "SEO", "Google Ads", "Meta Ads"],
    period: "Jan 2025 – Mar 2025",
    demoUrl: "#",
    status: "live",
  },
];

export const projectsSorted = [...projects].sort((a, b) => a.order - b.order);
