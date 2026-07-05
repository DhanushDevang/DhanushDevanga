import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { portfolio } from "@/data/portfolio";
import { socials } from "@/data/socials";
import { Button } from "@/components/ui/Button";
import { StatusTag } from "@/components/ui/StatusTag";
import { FaGithub, FaLinkedin, FaWhatsapp, FaEnvelope, FaInstagram } from "react-icons/fa";
import { HeroStats } from "@/components/sections/HeroStats";
import portraitUrl from "@/assets/portrait.jpg";

const iconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  whatsapp: FaWhatsapp,
  email: FaEnvelope,
  instagram: FaInstagram,
};

function useTypedRoles(roles: readonly string[]) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[index % roles.length];
    const speed = deleting ? 35 : 65;
    const pause = 1400;

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % roles.length);
      return;
    }

    const t = setTimeout(() => {
      setText(current.slice(0, deleting ? text.length - 1 : text.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, index, roles]);

  return text;
}

export function Hero() {
  const typed = useTypedRoles(portfolio.roles);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-28 pb-16"
      aria-label="Introduction"
    >
      {/* Full-screen portrait wallpaper */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img
          src={portraitUrl}
          alt=""
          className="h-full w-full object-cover object-[center_30%]"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: "rgba(5, 7, 12, 0.62)" }} />
        {/* Subtle blur via backdrop layer */}
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(5,7,12,1) 0%, rgba(5,7,12,0.55) 45%, rgba(5,7,12,0.15) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(5,7,12,0.95) 0%, rgba(5,7,12,0.35) 45%, rgba(5,7,12,0) 75%)",
          }}
        />
        <div
          className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full opacity-20 blur-[100px] animate-drift"
          style={{ background: "var(--color-accent)" }}
        />
        <div
          className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full opacity-15 blur-[100px] animate-drift-slow"
          style={{ background: "var(--color-accent-2)" }}
        />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <StatusTag label="AVAILABLE FOR OPPORTUNITIES" />

          <p className="mt-6 font-[var(--font-mono)] text-sm text-[var(--color-text-dim)]">
            Hello, I&apos;m
          </p>
          <h1 className="mt-2 font-[var(--font-display)] text-4xl font-bold leading-[1.05] text-[var(--color-text)] sm:text-5xl lg:text-6xl">
            {portfolio.name}
          </h1>

          <div className="mt-4 flex h-8 items-center font-[var(--font-mono)] text-lg text-[var(--color-accent-2)] sm:text-xl">
            <span>{typed}</span>
            <span className="ml-1 inline-block h-5 w-[2px] animate-blink bg-[var(--color-accent-2)]" />
          </div>

          <p className="mt-6 max-w-xl text-lg font-medium text-[var(--color-text)]">
            {portfolio.headline}
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-[var(--color-text-dim)]">
            {portfolio.bio}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button as="a" href={portfolio.resumeUrl} download>
              Download Resume
            </Button>
            <Button
              as="a"
              href="#contact"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contact Me
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-4">
            {socials
              .filter((s) => s.icon !== "instagram")
              .map((s) => {
                const Icon = iconMap[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-dim)] transition-colors hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
          </div>
        </motion.div>
      </div>

      <motion.button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--color-text-faint)]"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Scroll to About section"
      >
        <svg width="20" height="32" viewBox="0 0 20 32" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="18" height="30" rx="9" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="9" r="2.5" fill="currentColor" />
        </svg>
      </motion.button>

      <div className="mx-auto mt-20 w-full max-w-6xl px-6">
        <HeroStats />
      </div>
    </section>
  );
}
