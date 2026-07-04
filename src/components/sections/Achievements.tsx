import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { achievements } from "@/data/achievements";
import { certifications } from "@/data/certifications";
import { fadeUp, staggerContainer } from "@/animations/variants";
import { FaAward, FaCertificate } from "react-icons/fa";

export function Achievements() {
  return (
    <section id="achievements" className="mx-auto max-w-6xl px-6 py-28" aria-label="Achievements and certifications">
      <SectionHeading index="05 — ACHIEVEMENTS" title="Recognition & Credentials" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-4">PATENT</p>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-15% 0px" }}
            className="space-y-4"
          >
            {achievements.map((a, i) => (
              <motion.div key={a.id} custom={i} variants={fadeUp} whileHover={{ y: -4 }}>
                <GlassCard className="flex items-start gap-4">
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    <FaAward size={16} />
                  </span>
                  <p className="text-sm font-medium text-[var(--color-text)]">{a.title}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div>
          <p className="eyebrow mb-4">CERTIFICATIONS</p>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-15% 0px" }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {certifications.map((cert, i) => (
              <motion.div key={cert.id} custom={i} variants={fadeUp} whileHover={{ y: -4 }}>
                <GlassCard className="flex items-center gap-3 py-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-accent-2)]">
                    <FaCertificate size={14} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">{cert.issuer}</p>
                    <p className="text-xs text-[var(--color-text-faint)]">{cert.title}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
