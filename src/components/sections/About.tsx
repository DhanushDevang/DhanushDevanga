import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolio, journeyTimeline } from "@/data/portfolio";
import { fadeUp, staggerContainer } from "@/animations/variants";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28" aria-label="About me">
      <SectionHeading index="01 — ABOUT" title="Who I Am" />

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          className="space-y-5"
        >
          {portfolio.aboutSummary.map((para, i) => (
            <motion.p
              key={i}
              custom={i}
              variants={fadeUp}
              className="leading-relaxed text-[var(--color-text-dim)]"
            >
              {para}
            </motion.p>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
        >
          <p className="eyebrow mb-6">JOURNEY LOG</p>
          <ol className="relative border-l border-[var(--color-border)] pl-6">
            {journeyTimeline.map((step, i) => (
              <li key={step} className="relative pb-8 last:pb-0">
                <span
                  className="absolute -left-[29px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--color-bg)]"
                  style={{
                    background:
                      i === journeyTimeline.length - 1 ? "var(--color-online)" : "var(--color-accent)",
                  }}
                  aria-hidden="true"
                />
                <p className="font-medium text-[var(--color-text)]">{step}</p>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
