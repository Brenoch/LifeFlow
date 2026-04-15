"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import { ProgressBar } from "@/components/ui/progress-bar";
import type { DailySummary } from "@/lib/types";

interface DailyProgressCardProps {
  summary: DailySummary;
}

export function DailyProgressCard({ summary }: DailyProgressCardProps) {
  return (
    <motion.article
      className="card p-4 transition duration-200 hover:-translate-y-0.5"
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-[var(--muted)]">Progresso diário</p>
          <p className="mt-2 text-4xl font-black">{summary.percentage}%</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
          <CheckCircle2 className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-4">
        <ProgressBar label={`${summary.completed}/${summary.scheduled || 0} concluídas`} tone="gold" value={summary.percentage} />
      </div>
    </motion.article>
  );
}
