import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type BadgeTone = "default" | "success" | "warning" | "error" | "info" | "violet";

const tones: Record<BadgeTone, string> = {
  default: "border-[var(--border)] bg-white/[0.04] text-[var(--muted)]",
  success: "border-emerald-300/20 bg-emerald-400/12 text-emerald-100",
  warning: "border-amber-300/20 bg-amber-400/12 text-amber-100",
  error: "border-rose-300/20 bg-rose-400/12 text-rose-100",
  info: "border-sky-300/20 bg-sky-400/12 text-sky-100",
  violet: "border-violet-300/24 bg-violet-400/14 text-violet-100",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center justify-center rounded-lg border px-2.5 py-1 text-xs font-bold tracking-normal",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
