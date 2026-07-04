import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { skillCategories } from "@/data/skills";
import { fadeUp, staggerContainer } from "@/animations/variants";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-28" aria-label="Skills">
      <SectionHeading
        index="02 — SKILLS"
        title="What I Work With"
        description="A toolkit built around backend systems, automation, and AI-driven applications."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {skillCategories.map((category, i) => (
          <motion.div key={category.id} custom={i} variants={fadeUp}>
            <GlassCard className="h-full">
              <h3 className="font-[var(--font-display)] text-lg font-semibold text-[var(--color-text)]">
                {category.label}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1 font-[var(--font-mono)] text-xs text-[var(--color-text-dim)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
