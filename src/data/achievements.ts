export type Achievement = {
  id: string;
  title: string;
  detail?: string;
  type: "patent" | "award";
};

export const achievements: Achievement[] = [
  {
    id: "patent-vehicle-health",
    title: "Published Patent: AI-Powered Vehicle Health Monitoring & Predictive Maintenance System using IoT Sensors",
    detail: "Patent Application No. 202641048002",
    type: "patent",
  },
];
