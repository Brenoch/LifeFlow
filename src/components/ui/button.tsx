import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "premium-focus inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold tracking-normal transition duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-[var(--primary)] text-white shadow-[0_14px_32px_rgba(139,92,246,0.28)] hover:bg-[var(--primary-strong)]",
        secondary:
          "border-[var(--border)] bg-[#1a1e2a] text-[var(--text)] hover:border-[var(--border-strong)] hover:bg-[#202638]",
        ghost:
          "border-transparent bg-transparent text-[var(--muted)] hover:bg-white/[0.06] hover:text-[var(--text)]",
        danger:
          "border-rose-400/20 bg-rose-500/12 text-rose-200 hover:bg-rose-500/18",
        success:
          "border-emerald-300/20 bg-emerald-400/14 text-emerald-100 hover:bg-emerald-400/20",
        outline:
          "border-[var(--border)] bg-transparent text-[var(--text)] hover:border-violet-300/35 hover:bg-violet-400/10",
      },
      size: {
        default: "min-h-11 px-4 py-2.5",
        sm: "min-h-9 px-3 py-2 text-xs",
        lg: "min-h-12 px-5 py-3",
        icon: "h-11 min-h-11 w-11 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  asChild,
  className,
  variant = "primary",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  );
}
