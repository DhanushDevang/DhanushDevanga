import { motion } from "framer-motion";
import { stats } from "@/data/stats";
import { useGithub } from "@/hooks/useGithub";
import { useCountUp } from "@/hooks/useCountUp";
import { staggerContainer, fadeUp } from "@/animations/variants";

function StatCard({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  const { ref, value: animated } = useCountUp(value);

  return (
    <motion.div
      variants={fadeUp}
      ref={ref as React.RefObject<HTMLDivElement>}
      className="glass rounded-2xl px-4 py-5 text-center"
    >
      <div className="font-[var(--font-mono)] text-2xl font-semibold text-[var(--color-text)] sm:text-3xl">
        {animated}
        {suffix ?? ""}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-[var(--color-text-faint)]">
        {label}
      </div>
    </motion.div>
  );
}

export function HeroStats() {
  const { user, loading } = useGithub();

  const resolved = stats.map((stat) => {
    if (stat.source === "github-repos") {
      return { ...stat, value: !loading && user ? user.public_repos : stat.value };
    }
    return stat;
  });

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7"
    >
      {resolved.map((stat) => (
        <StatCard key={stat.id} label={stat.label} value={stat.value} suffix={stat.suffix} />
      ))}
    </motion.div>
  );
}
