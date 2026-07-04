export type Stat = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  source: "static" | "github-repos";
};

export const stats: Stat[] = [
  { id: "projects", label: "Projects", value: 5, source: "static" },
  { id: "technologies", label: "Technologies", value: 20, suffix: "+", source: "static" },
  { id: "certifications", label: "Certifications", value: 5, source: "static" },
  { id: "github-repos", label: "GitHub Repositories", value: 0, source: "github-repos" },
  { id: "job-simulations", label: "Job Simulations", value: 2, source: "static" },
  { id: "patents", label: "Patent", value: 1, source: "static" },
  { id: "leetcode", label: "LeetCode Problems", value: 50, suffix: "+", source: "static" },
];
