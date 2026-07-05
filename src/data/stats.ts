export type Stat = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  source: "static" | "github-repos";
};

// LeetCode intentionally removed for now — add back once prepared.
export const stats: Stat[] = [
  { id: "projects", label: "Projects", value: 5, source: "static" },
  { id: "technologies", label: "Technologies", value: 20, suffix: "+", source: "static" },
  { id: "certifications", label: "Certifications", value: 8, source: "static" },
  { id: "github-repos", label: "GitHub Repositories", value: 0, source: "github-repos" },
  { id: "job-simulations", label: "Job Simulations", value: 5, source: "static" },
  { id: "patents", label: "Patent", value: 1, source: "static" },
];
