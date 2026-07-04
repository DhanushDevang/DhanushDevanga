import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "@/constants/nav";
import { useActiveSection } from "@/hooks/useActiveSection";
import { portfolio } from "@/data/portfolio";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(navLinks.map((l) => l.id));

  function handleNavClick(id: string) {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="glass mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3 sm:mx-4 lg:mx-auto">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("hero");
          }}
          className="font-[var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-text)]"
        >
          DR<span className="text-[var(--color-accent)]">.</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={cn(
                "relative px-4 py-2 font-[var(--font-mono)] text-xs uppercase tracking-wide text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-text)]",
                active === link.id && "text-[var(--color-text)]"
              )}
              aria-current={active === link.id ? "true" : undefined}
            >
              {link.label}
              {active === link.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-[var(--color-accent)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            as="a"
            href={portfolio.resumeUrl}
            download
            variant="secondary"
            className="px-4 py-2 text-xs"
          >
            Resume
          </Button>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="relative flex h-3 w-4 flex-col justify-between">
            <span
              className={cn(
                "h-[1.5px] w-full bg-current transition-transform",
                open && "translate-y-[5.5px] rotate-45"
              )}
            />
            <span className={cn("h-[1.5px] w-full bg-current transition-opacity", open && "opacity-0")} />
            <span
              className={cn(
                "h-[1.5px] w-full bg-current transition-transform",
                open && "-translate-y-[5.5px] -rotate-45"
              )}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="glass mx-4 mt-2 flex flex-col rounded-2xl p-3 md:hidden"
            aria-label="Mobile"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={cn(
                  "rounded-xl px-4 py-3 text-left font-[var(--font-mono)] text-sm text-[var(--color-text-dim)]",
                  active === link.id && "bg-[var(--color-surface-2)] text-[var(--color-text)]"
                )}
              >
                {link.label}
              </button>
            ))}
            <a
              href={portfolio.resumeUrl}
              download
              className="mt-2 rounded-xl bg-[var(--color-accent)] px-4 py-3 text-center text-sm font-medium text-[#05070c]"
            >
              Download Resume
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
