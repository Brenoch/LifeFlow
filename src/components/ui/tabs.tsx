"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/cn";

interface TabOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface TabsProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: TabOption<T>[];
  className?: string;
}

export function Tabs<T extends string>({
  value,
  onValueChange,
  options,
  className,
}: TabsProps<T>) {
  return (
    <div
      className={cn(
        "grid rounded-lg border border-[var(--border)] bg-[#111520] p-1",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            className={cn(
              "premium-focus relative min-h-10 rounded-lg px-3 text-xs font-bold text-[var(--muted)] transition sm:text-sm",
              active && "text-white",
            )}
            key={option.value}
            onClick={() => onValueChange(option.value)}
            type="button"
          >
            {active ? (
              <motion.span
                className="absolute inset-0 rounded-lg bg-[var(--primary)] shadow-[0_10px_28px_rgba(139,92,246,0.24)]"
                layoutId="lifeflow-active-tab"
                transition={{ duration: 0.22, ease: "easeOut" }}
              />
            ) : null}
            <span className="relative z-10 inline-flex items-center justify-center gap-2">
              {option.icon}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
