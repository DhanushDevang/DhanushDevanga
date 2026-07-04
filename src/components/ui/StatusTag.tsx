import { cn } from "@/utils/cn";

type Props = {
  label: string;
  tone?: "online" | "neutral";
  className?: string;
};

export function StatusTag({ label, tone = "online", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-1 font-[var(--font-mono)] text-xs tracking-wide text-[var(--color-text-dim)]",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-pulse-ring",
            tone === "online" ? "bg-[var(--color-online)]" : "bg-[var(--color-accent)]"
          )}
        />
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            tone === "online" ? "bg-[var(--color-online)]" : "bg-[var(--color-accent)]"
          )}
        />
      </span>
      {label}
    </span>
  );
}
