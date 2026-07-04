import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { education } from "@/data/education";
import { fadeUp, staggerContainer } from "@/animations/variants";

export function Education() {
  return (
    <section id="education" className="mx-auto max-w-6xl px-6 py-28" aria-label="Education">
      <SectionHeading index="07 — EDUCATION" title="Academic Background" />

      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px" }}
        className="relative space-y-8 border-l border-[var(--color-border)] pl-8"
      >
        {education.map((item, i) => (
          <motion.li key={item.id} custom={i} variants={fadeUp} className="relative">
            <span
              className="absolute -left-[41px] top-1 h-3 w-3 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-accent)]"
              aria-hidden="true"
            />
            <h3 className="font-[var(--font-display)] text-lg font-semibold text-[var(--color-text)]">
              {item.institution}
            </h3>
            {item.degree && <p className="mt-1 text-sm text-[var(--color-text-dim)]">{item.degree}</p>}
            {item.period && (
              <p className="mt-1 font-[var(--font-mono)] text-xs text-[var(--color-text-faint)]">
                {item.period}
              </p>
            )}
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
