export type Achievement = {
  id: string;
  title: string;
  type: "patent" | "award";
};

export const achievements: Achievement[] = [
  {
    id: "patent-vehicle-health",
    title: "Patent for AI-powered Vehicle Health Monitoring Prototype",
    type: "patent",
  },
];
