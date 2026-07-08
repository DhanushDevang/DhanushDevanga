export type EducationItem = {
  id: string;
  institution: string;
  degree?: string;
  period?: string;
  note?: string;
};

export const education: EducationItem[] = [
  {
    id: "ds-pu-college",
    institution: "Dayananda Sagar PU College",
    degree: "PCMCs",
    period: "Mar 2020 – Nov 2022",
  },
  {
    id: "ds-university",
    institution: "Dayananda Sagar University",
    degree: "B.Tech, Computer Science Engineering",
    period: "Jan 2022 – May 2026",
    note: "6.6 GPA · 4th Year",
  },
];
