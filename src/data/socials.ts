export type SocialLink = {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "whatsapp" | "email" | "instagram";
};

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/DhanushDevang",
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dhanush-devanga-917677208",
    icon: "linkedin",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/918792035854",
    icon: "whatsapp",
  },
  {
    label: "Email",
    href: "mailto:dhanush26kkrtrd@gmail.com",
    icon: "email",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/_daffy.duck.__/",
    icon: "instagram",
  },
];

export const contact = {
  whatsappNumber: "8792035854",
  whatsappHref: "https://wa.me/918792035854",
  email: "dhanush26kkrtrd@gmail.com",
  githubUsername: "DhanushDevang",
};
