export type Certification = {
  id: string;
  issuer: string;
  title: string;
  date?: string;
  url?: string;
};

export const certifications: Certification[] = [
  {
    id: "aws-apac-solutions-architecture",
    issuer: "AWS · Forage",
    title: "AWS APAC Solutions Architecture Virtual Experience Program",
    date: "July 2025",
  },
  {
    id: "tata-genai-data-analytics",
    issuer: "Tata · Forage",
    title: "GenAI Powered Data Analytics Job Simulation",
    date: "July 2025",
  },
  {
    id: "deloitte-cyber",
    issuer: "Deloitte · Forage",
    title: "Cyber Job Simulation",
    date: "July 2025",
  },
  {
    id: "deloitte-technology",
    issuer: "Deloitte · Forage",
    title: "Technology Job Simulation",
    date: "July 2025",
  },
  {
    id: "deloitte-data-analytics",
    issuer: "Deloitte · Forage",
    title: "Data Analytics Job Simulation",
    date: "July 2025",
  },
  {
    id: "hp-ai-for-beginners",
    issuer: "HP LIFE",
    title: "AI for Beginners",
    date: "July 2025",
  },
  {
    id: "hp-data-science-analytics",
    issuer: "HP LIFE",
    title: "Data Science & Analytics",
    date: "July 2025",
  },
  {
    id: "linux-shell-programming",
    issuer: "Infosys Springboard",
    title: "Linux Shell Programming",
    date: "July 2025",
  },
];
