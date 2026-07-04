import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  hover?: boolean;
};

export function GlassCard({ children, className, hover = true, ...rest }: Props) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300",
        hover && "hover:border-[var(--color-accent)]/40 hover:shadow-[0_0_40px_-12px_var(--color-accent)]",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
