export type Certification = {
  id: string;
  issuer: string;
  title: string;
  url?: string;
};

export const certifications: Certification[] = [
  { id: "cert-aws", issuer: "AWS", title: "AWS Certification" },
  { id: "cert-tata", issuer: "Tata", title: "Tata Job Simulation Certificate" },
  { id: "cert-deloitte", issuer: "Deloitte", title: "Deloitte Job Simulation Certificate" },
  { id: "cert-hp", issuer: "HP", title: "HP Certification" },
  { id: "cert-linux", issuer: "Linux", title: "Linux Certification" },
];
