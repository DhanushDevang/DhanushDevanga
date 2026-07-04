import { AnimatePresence, motion } from "framer-motion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { FaArrowUp } from "react-icons/fa";

export function ScrollToTop() {
  const progress = useScrollProgress();
  const visible = progress > 8;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll back to top"
          className="glass fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-text-dim)] hover:text-[var(--color-accent)]"
        >
          <FaArrowUp size={14} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
