import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/data/projects";
import { GlassCard } from "@/components/ui/GlassCard";
import { FaGithub, FaExternalLinkAlt, FaChevronDown } from "react-icons/fa";
import { fadeUp } from "@/animations/variants";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = `project-panel-${project.id}`;

  return (
    <motion.div custom={index} variants={fadeUp}>
      <GlassCard hover={!expanded} className="overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">{`0${project.order} · ${project.status.toUpperCase()}`}</span>
              <span className="font-[var(--font-mono)] text-[11px] text-[var(--color-text-faint)]">
                {project.period}
              </span>
            </div>
            <h3 className="mt-2 font-[var(--font-display)] text-xl font-semibold text-[var(--color-text)]">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--color-text-dim)]">{project.tagline}</p>
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={panelId}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-dim)] transition-transform hover:text-[var(--color-accent)]"
          >
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <FaChevronDown size={12} />
            </motion.span>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-[var(--color-surface-2)] px-3 py-1 font-[var(--font-mono)] text-[11px] text-[var(--color-text-dim)]"
            >
              {tech}
            </span>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              id={panelId}
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 space-y-4 border-t border-[var(--color-border)] pt-5">
                <p className="text-sm leading-relaxed text-[var(--color-text-dim)]">
                  {project.description}
                </p>

                <div>
                  <p className="eyebrow mb-1">PROBLEM</p>
                  <p className="text-sm text-[var(--color-text-dim)]">{project.problem}</p>
                </div>

                <div>
                  <p className="eyebrow mb-2">FEATURES</p>
                  <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[var(--color-text-dim)]">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {project.results && (
                  <div>
                    <p className="eyebrow mb-1">RESULTS</p>
                    <p className="text-sm text-[var(--color-text-dim)]">{project.results}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-text)] hover:border-[var(--color-accent)]/50"
                    >
                      <FaGithub size={13} /> Code
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-medium text-[#05070c]"
                    >
                      <FaExternalLinkAlt size={11} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}
