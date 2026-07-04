import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 focus-visible:outline-2";

const variants = {
  primary:
    "bg-[var(--color-accent)] text-[#05070c] hover:bg-[var(--color-accent-2)] hover:shadow-[0_0_30px_-6px_var(--color-accent)]",
  secondary:
    "glass text-[var(--color-text)] hover:border-[var(--color-accent)]/50 hover:text-white",
};

type CommonProps = {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };
type LinkProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" };

export function Button(props: ButtonProps | LinkProps) {
  const { children, variant = "primary", className, ...rest } = props;
  const classes = cn(base, variants[variant], className);

  if (props.as === "a") {
    const { as: _as, ...anchorRest } = rest as LinkProps;
    return (
      <a className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const { as: _as, ...buttonRest } = rest as ButtonProps;
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
