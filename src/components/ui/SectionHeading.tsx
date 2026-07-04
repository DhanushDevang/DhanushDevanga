import { motion } from "framer-motion";
import { fadeUp } from "@/animations/variants";

type Props = {
  index: string;
  title: string;
  description?: string;
};

export function SectionHeading({ index, title, description }: Props) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15% 0px" }}
      className="mb-12 max-w-2xl"
    >
      <span className="eyebrow">{`// ${index}`}</span>
      <h2 className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-[var(--color-text)] sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-[var(--color-text-dim)] leading-relaxed">{description}</p>
      ) : null}
    </motion.div>
  );
}
