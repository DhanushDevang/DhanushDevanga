export type SkillCategory = {
  id: string;
  label: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "programming",
    label: "Programming",
    skills: ["Java", "Python", "SQL", "C"],
  },
  {
    id: "backend",
    label: "Backend",
    skills: ["Spring Boot", "REST APIs", "JWT Authentication", "Maven", "Node.js", "Express"],
  },
  {
    id: "databases",
    label: "Databases",
    skills: ["PostgreSQL", "MySQL", "SQL", "Database Design", "Normalization"],
  },
  {
    id: "cloud",
    label: "Cloud",
    skills: ["AWS", "Elastic Beanstalk", "EC2", "S3", "IAM"],
  },
  {
    id: "frontend",
    label: "Frontend",
    skills: ["React", "HTML", "CSS", "JavaScript", "TypeScript"],
  },
  {
    id: "ai",
    label: "AI / ML",
    skills: ["Scikit-Learn", "CNN", "NLP", "MATLAB", "OpenAI APIs", "LLM Integration"],
  },
  {
    id: "tools",
    label: "Dev Tools",
    skills: ["Git", "GitHub", "Docker", "GitHub Actions", "Postman"],
  },
  {
    id: "core-cs",
    label: "Core CS",
    skills: ["Data Structures & Algorithms", "DBMS", "Operating Systems", "OOP", "Computer Networks"],
  },
  {
    id: "soft",
    label: "Soft Skills",
    skills: ["Problem Solving", "System Design", "Leadership", "Communication", "Critical Thinking"],
  },
];
