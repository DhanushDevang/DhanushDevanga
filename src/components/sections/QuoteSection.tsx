import { useMemo } from "react";
import { motion } from "framer-motion";
import { getRandomQuote } from "@/data/quotes";
import { fadeIn } from "@/animations/variants";

export function QuoteSection() {
  const quote = useMemo(() => getRandomQuote(), []);

  return (
    <section className="relative px-6 py-24" aria-label="Quote">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px" }}
        className="glass relative mx-auto max-w-3xl rounded-3xl px-8 py-14 text-center sm:px-16"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-6 top-2 font-[var(--font-display)] text-8xl text-[var(--color-accent)]/15"
        >
          &ldquo;
        </span>
        <blockquote className="relative font-[var(--font-display)] text-2xl font-medium leading-snug text-[var(--color-text)] sm:text-3xl">
          {quote.text}
        </blockquote>
        <figcaption className="mt-6 font-[var(--font-mono)] text-sm text-[var(--color-accent-2)]">
          — {quote.author}
        </figcaption>
      </motion.div>
    </section>
  );
}
