import { socials } from "@/data/socials";
import { FaGithub, FaLinkedin, FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";

const iconMap = { github: FaGithub, linkedin: FaLinkedin, whatsapp: FaWhatsapp, email: FaEnvelope, instagram: FaInstagram };

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-[var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
            Designed &amp; Developed by Dhanush R Devang
          </p>
          <p className="mt-1 font-[var(--font-mono)] text-xs text-[var(--color-text-faint)]">
            Software Engineer · AI Automation Engineer
          </p>
        </div>

        <div className="flex items-center gap-3">
          {socials.map((s) => {
            const Icon = iconMap[s.icon];
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-dim)] transition-colors hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]"
              >
                <Icon size={14} />
              </a>
            );
          })}
        </div>
      </div>
      <p className="mt-8 text-center font-[var(--font-mono)] text-[11px] text-[var(--color-text-faint)]">
        © 2026 All Rights Reserved
      </p>
    </footer>
  );
}
