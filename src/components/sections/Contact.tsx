import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { contact, socials } from "@/data/socials";
import { portfolio } from "@/data/portfolio";
import { fadeUp } from "@/animations/variants";
import { FaWhatsapp, FaEnvelope, FaLinkedin, FaGithub, FaRegCopy, FaCheck } from "react-icons/fa";

const iconMap = { github: FaGithub, linkedin: FaLinkedin, whatsapp: FaWhatsapp, email: FaEnvelope, instagram: FaEnvelope };

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently ignore.
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    // NOTE: Wire this up to EmailJS or Resend with your API keys.
    // For now this opens a pre-filled mail client as a working fallback.
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setSending(false);
      setToast("Opening your email client…");
      form.reset();
      setTimeout(() => setToast(null), 3000);
    }, 400);
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-28" aria-label="Contact">
      <SectionHeading
        index="08 — CONTACT"
        title="Let's Build Something Meaningful"
        description="Whether you have an exciting opportunity, a challenging engineering problem, or simply want to connect, I'd be happy to hear from you."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          className="space-y-4"
        >
          <GlassCard className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-[var(--color-accent)]" />
              <span className="text-sm text-[var(--color-text-dim)]">{contact.email}</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-accent)]"
              aria-label="Copy email address"
            >
              {copied ? <FaCheck size={12} /> : <FaRegCopy size={12} />}
            </button>
          </GlassCard>

          {socials
            .filter((s) => s.icon === "whatsapp" || s.icon === "linkedin" || s.icon === "github")
            .map((s) => {
              const Icon = iconMap[s.icon];
              return (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                  <GlassCard className="flex items-center gap-3">
                    <Icon className="text-[var(--color-accent)]" />
                    <span className="text-sm text-[var(--color-text-dim)]">{s.label}</span>
                  </GlassCard>
                </a>
              );
            })}

          <Button as="a" href={portfolio.resumeUrl} download variant="secondary" className="w-full">
            Download Resume
          </Button>
        </motion.div>

        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          onSubmit={handleSubmit}
          className="glass space-y-4 rounded-2xl p-6"
        >
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-[var(--color-text-dim)]">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-[var(--color-text-dim)]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-[var(--color-text-dim)]">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          <Button className="w-full" disabled={sending}>
            {sending ? "Sending…" : "Send Message"}
          </Button>
        </motion.form>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm text-[var(--color-text)]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
