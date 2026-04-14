"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number;
  label?: string;
  tone?: "green" | "cyan" | "coral" | "violet" | "gold";
}

const tones = {
  green: "bg-[var(--success)]",
  cyan: "bg-[var(--info)]",
  coral: "bg-[var(--error)]",
  violet: "bg-[var(--accent)]",
  gold: "bg-[var(--warning)]",
};

export function ProgressBar({ value, label, tone = "green" }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-2">
      {label ? (
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <span>{label}</span>
          <span>{safeValue}%</span>
        </div>
      ) : null}
      <div className="h-2.5 overflow-hidden rounded-lg bg-white/[0.08]">
        <motion.div
          animate={{ width: `${safeValue}%` }}
          className={cn("h-full rounded-lg", tones[tone])}
          initial={false}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
