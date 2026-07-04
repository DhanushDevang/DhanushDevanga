export type SkillCategory = {
  id: string;
  label: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "programming",
    label: "Programming",
    skills: ["Java", "Python", "C", "JavaScript", "TypeScript"],
  },
  {
    id: "backend",
    label: "Backend",
    skills: ["Node.js", "Express", "FastAPI", "REST APIs", "Supabase", "PostgreSQL", "Redis"],
  },
  {
    id: "frontend",
    label: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS", "Vite"],
  },
  {
    id: "ai",
    label: "AI",
    skills: ["OpenAI APIs", "LLMs", "Prompt Engineering", "Workflow Automation"],
  },
  {
    id: "tools",
    label: "Tools",
    skills: ["Git", "GitHub", "Docker", "AWS", "Vercel", "Railway", "ThingSpeak"],
  },
  {
    id: "soft",
    label: "Soft Skills",
    skills: ["Problem Solving", "System Design", "Leadership", "Communication", "Critical Thinking"],
  },
];
