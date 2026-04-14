"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  helper?: string;
  tone?: "green" | "cyan" | "coral" | "gold" | "violet";
  icon?: ReactNode;
}

const tones = {
  green: "border-emerald-300/20 bg-emerald-400/[0.055]",
  cyan: "border-sky-300/20 bg-sky-400/[0.06]",
  coral: "border-rose-300/20 bg-rose-400/[0.055]",
  gold: "border-amber-300/25 bg-[var(--primary-soft)]",
  violet: "border-violet-300/24 bg-violet-400/[0.06]",
};

const iconTones = {
  green: "bg-emerald-400/12 text-emerald-200",
  cyan: "bg-sky-400/12 text-sky-200",
  coral: "bg-rose-400/12 text-rose-200",
  gold: "bg-amber-400/12 text-amber-200",
  violet: "bg-violet-400/14 text-violet-100",
};

export function StatCard({ label, value, helper, tone = "green", icon }: StatCardProps) {
  return (
    <motion.article
      className={cn("card min-w-0 overflow-hidden p-4 transition duration-200 hover:-translate-y-0.5", tones[tone])}
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      viewport={{ once: true, margin: "-40px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-[var(--muted)]">{label}</p>
          <p className="mt-2 break-words text-3xl font-black tracking-normal text-[var(--text)]">{value}</p>
        </div>
        {icon ? (
          <span className={cn("grid h-10 w-10 place-items-center rounded-lg", iconTones[tone])}>
            {icon}
          </span>
        ) : null}
      </div>
      {helper ? <p className="mt-2 text-xs leading-5 text-[var(--quiet)]">{helper}</p> : null}
    </motion.article>
  );
}
