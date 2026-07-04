import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { portfolio } from "@/data/portfolio";
import { socials } from "@/data/socials";
import { Button } from "@/components/ui/Button";
import { StatusTag } from "@/components/ui/StatusTag";
import { FaGithub, FaLinkedin, FaWhatsapp, FaEnvelope, FaInstagram } from "react-icons/fa";
import { HeroStats } from "@/components/sections/HeroStats";

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
      {/* Ambient background */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[var(--color-bg)]" />
        <div
          className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full opacity-25 blur-[100px] animate-drift"
          style={{ background: "var(--color-accent)" }}
        />
        <div
          className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full opacity-20 blur-[100px] animate-drift-slow"
          style={{ background: "var(--color-accent-2)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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

        {/* Right: dashboard-style visual panel (portrait placeholder) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="glass relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/10 via-transparent to-[var(--color-accent-2)]/10" />
          <div className="absolute inset-x-6 top-6 flex items-center justify-between font-[var(--font-mono)] text-[10px] text-[var(--color-text-faint)]">
            <span>SYSTEM://dhanush-status</span>
            <span className="text-[var(--color-online)]">● ONLINE</span>
          </div>

          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-accent)]/30" />
          <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-accent)]/50 animate-pulse-ring" />
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] shadow-[0_0_20px_4px_var(--color-accent)]" />

          <div className="absolute inset-x-6 bottom-6 space-y-2 font-[var(--font-mono)] text-[10px] text-[var(--color-text-faint)]">
            <div className="flex justify-between">
              <span>uptime</span>
              <span className="text-[var(--color-text-dim)]">3+ yrs building</span>
            </div>
            <div className="flex justify-between">
              <span>focus</span>
              <span className="text-[var(--color-text-dim)]">backend / AI systems</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]" />
            </div>
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
