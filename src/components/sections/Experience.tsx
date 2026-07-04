import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { experiences } from "@/data/experience";
import { fadeUp, staggerContainer } from "@/animations/variants";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-28" aria-label="Professional experience">
      <SectionHeading
        index="04 — EXPERIENCE"
        title="Professional Experience"
        description="Hands-on job simulations that mirror real enterprise engineering work."
      />

      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="relative space-y-6 border-l border-[var(--color-border)] pl-8"
      >
        {experiences.map((exp, i) => (
          <motion.li key={exp.id} custom={i} variants={fadeUp} className="relative">
            <span
              className="absolute -left-[41px] top-6 h-3 w-3 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-accent)]"
              aria-hidden="true"
            />
            <GlassCard>
              <p className="eyebrow">{exp.organization}</p>
              <h3 className="mt-2 font-[var(--font-display)] text-lg font-semibold text-[var(--color-text)]">
                {exp.title}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {exp.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-full bg-[var(--color-surface-2)] px-3 py-1 font-[var(--font-mono)] text-xs text-[var(--color-text-dim)]"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.li>
        ))}

        <motion.li custom={experiences.length} variants={fadeUp} className="relative">
          <span
            className="absolute -left-[41px] top-6 h-3 w-3 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-text-faint)]"
            aria-hidden="true"
          />
          <div className="rounded-2xl border border-dashed border-[var(--color-border-strong)] px-6 py-5">
            <p className="font-[var(--font-mono)] text-sm text-[var(--color-text-faint)]">
              Future Opportunities —
              <span className="text-[var(--color-text-dim)]"> open to full-time roles &amp; impactful teams.</span>
            </p>
          </div>
        </motion.li>
      </motion.ol>
    </section>
  );
}
