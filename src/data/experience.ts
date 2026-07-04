export type Experience = {
  id: string;
  title: string;
  organization: string;
  period?: string;
  highlights: string[];
};

export const experiences: Experience[] = [
  {
    id: "aws-apac",
    title: "AWS APAC Solutions Architecture Virtual Experience",
    organization: "Forage",
    highlights: ["Cloud Architecture", "Elastic Beanstalk"],
  },
  {
    id: "tata-data-analytics",
    title: "Tata Data Analytics Job Simulation",
    organization: "Forage",
    highlights: ["EDA", "Predictive Insights", "AI Analysis"],
  },
];
