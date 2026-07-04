import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg)]"
          aria-hidden="true"
        >
          <div className="flex items-center gap-3 font-[var(--font-mono)] text-sm text-[var(--color-text-dim)]">
            <span className="h-2 w-2 animate-pulse-ring rounded-full bg-[var(--color-accent)]" />
            booting portfolio…
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
