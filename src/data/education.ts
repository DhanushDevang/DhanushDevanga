export type EducationItem = {
  id: string;
  institution: string;
  degree?: string;
  period?: string;
};

export const education: EducationItem[] = [
  {
    id: "ds-pu-college",
    institution: "Dayananda Sagar PU College",
  },
  {
    id: "ds-university",
    institution: "Dayananda Sagar University",
    degree: "B.Tech, Computer Science Engineering",
    period: "Graduating 2026",
  },
];
