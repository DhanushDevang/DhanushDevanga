import { useEffect, useState, useRef, Suspense, lazy } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { portfolio } from "@/data/portfolio";
import { socials } from "@/data/socials";
import { Button } from "@/components/ui/Button";
import { StatusTag } from "@/components/ui/StatusTag";
import { FaGithub, FaLinkedin, FaWhatsapp, FaEnvelope, FaInstagram } from "react-icons/fa";
import { HeroStats } from "@/components/sections/HeroStats";

const FluidHero = lazy(() =>
  import("@/components/ui/FluidHero").then((m) => ({ default: m.FluidHero }))
);

const fluidFallback = (
  <div
    aria-hidden="true"
    className="absolute inset-0"
    style={{
      background:
        "radial-gradient(circle at 30% 30%, rgba(61,139,253,0.18), transparent 55%), radial-gradient(circle at 75% 65%, rgba(124,156,255,0.14), transparent 55%)",
    }}
  />
);

const iconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  whatsapp: FaWhatsapp,
  email: FaEnvelope,
  instagram: FaInstagram,
};

function useTextParallax() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mouseX = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 55, damping: 18, mass: 0.6 });
  const contentX = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isCoarsePointer) return;

    function onMove(e: MouseEvent) {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { sectionRef, contentX };
}

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
  const { sectionRef, contentX } = useTextParallax();

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden pt-28 pb-16"
      aria-label="Introduction"
    >
      {/* Interactive fluid background */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[var(--color-bg)]">
        <Suspense fallback={fluidFallback}>
          <FluidHero />
        </Suspense>
        {/* Light scrim so text stays readable regardless of what the fluid is doing underneath */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(5,7,12,0.55) 0%, rgba(5,7,12,0.2) 45%, rgba(5,7,12,0) 72%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(5,7,12,0.6) 0%, rgba(5,7,12,0.08) 42%, rgba(5,7,12,0) 100%)",
          }}
        />
      </div>

      <motion.div style={{ x: contentX }} className="relative z-10 mx-auto w-full max-w-6xl px-6 pointer-events-none">
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
            <Button as="a" href={portfolio.resumeUrl} download className="pointer-events-auto">
              Download Resume
            </Button>
            <Button
              as="a"
              href="#contact"
              variant="secondary"
              className="pointer-events-auto"
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
                    className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-dim)] transition-colors hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
          </div>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--color-text-faint)] pointer-events-auto"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Scroll to About section"
      >
        <svg width="20" height="32" viewBox="0 0 20 32" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="18" height="30" rx="9" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="9" r="2.5" fill="currentColor" />
        </svg>
      </motion.button>

      <div className="pointer-events-none relative z-10 mx-auto mt-20 w-full max-w-6xl px-6">
        <HeroStats />
      </div>
    </section>
  );
}
