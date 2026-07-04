import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { useGithub } from "@/hooks/useGithub";
import { fadeUp, staggerContainer } from "@/animations/variants";
import { FaGithub, FaStar, FaCodeBranch } from "react-icons/fa";

function RepoSkeleton() {
  return (
    <div className="glass animate-pulse rounded-2xl p-6">
      <div className="h-4 w-2/3 rounded bg-[var(--color-surface-2)]" />
      <div className="mt-3 h-3 w-full rounded bg-[var(--color-surface-2)]" />
      <div className="mt-2 h-3 w-4/5 rounded bg-[var(--color-surface-2)]" />
    </div>
  );
}

export function GithubSection() {
  const { user, repos, loading, error } = useGithub();

  return (
    <section id="github" className="mx-auto max-w-6xl px-6 py-28" aria-label="GitHub activity">
      <SectionHeading
        index="06 — GITHUB"
        title="Live From GitHub"
        description="Pulled directly from the GitHub REST API — no manual updates needed."
      />

      {user && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          className="glass mb-8 flex flex-wrap items-center gap-6 rounded-2xl p-6"
        >
          <img
            src={user.avatar_url}
            alt={`${user.login} avatar`}
            width={64}
            height={64}
            loading="lazy"
            className="h-16 w-16 rounded-full border border-[var(--color-border)]"
          />
          <div>
            <p className="font-[var(--font-display)] text-lg font-semibold text-[var(--color-text)]">
              @{user.login}
            </p>
            <div className="mt-1 flex gap-4 font-[var(--font-mono)] text-xs text-[var(--color-text-dim)]">
              <span>{user.public_repos} repos</span>
              <span>{user.followers} followers</span>
            </div>
          </div>
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-text)] hover:border-[var(--color-accent)]/50"
          >
            <FaGithub size={14} /> View Profile
          </a>
        </motion.div>
      )}

      {error && (
        <p role="status" className="mb-6 text-sm text-[var(--color-text-faint)]">
          {error} — check back shortly.
        </p>
      )}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <RepoSkeleton key={i} />)}

        {!loading &&
          repos.map((repo, i) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              custom={i}
              variants={fadeUp}
            >
              <GlassCard className="h-full">
                <div className="flex items-center justify-between">
                  <h3 className="truncate font-[var(--font-display)] text-base font-semibold text-[var(--color-text)]">
                    {repo.name}
                  </h3>
                  <FaGithub className="shrink-0 text-[var(--color-text-faint)]" size={14} />
                </div>
                <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm text-[var(--color-text-dim)]">
                  {repo.description ?? "No description provided."}
                </p>
                <div className="mt-4 flex items-center gap-4 font-[var(--font-mono)] text-xs text-[var(--color-text-faint)]">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <FaCodeBranch size={10} /> {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <FaStar size={10} /> {repo.stargazers_count}
                  </span>
                </div>
              </GlassCard>
            </motion.a>
          ))}
      </motion.div>
    </section>
  );
}
