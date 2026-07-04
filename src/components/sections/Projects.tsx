import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projectsSorted } from "@/data/projects";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { staggerContainer } from "@/animations/variants";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-28" aria-label="Projects">
      <SectionHeading
        index="03 — PROJECTS"
        title="Things I've Built"
        description="Each one solves a real problem — from predictive diagnostics to production chat infrastructure."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="grid grid-cols-1 gap-5 lg:grid-cols-2"
      >
        {projectsSorted.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
