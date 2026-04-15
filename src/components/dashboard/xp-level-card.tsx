"use client";

import { Zap } from "lucide-react";
import { motion } from "framer-motion";

import { ProgressBar } from "@/components/ui/progress-bar";

interface XpLevelCardProps {
  xp: number;
  level: number;
  progress: number;
  xpToNextLevel: number;
}

export function XpLevelCard({ xp, level, progress, xpToNextLevel }: XpLevelCardProps) {
  return (
    <motion.article
      className="card p-4 transition duration-200 hover:-translate-y-0.5"
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25, delay: 0.06 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-[var(--muted)]">Nível {level}</p>
          <p className="mt-2 text-3xl font-black">{xp} XP</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--info-soft)] text-[var(--info)]">
          <Zap className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-4">
        <ProgressBar label={`Faltam ${xpToNextLevel} XP`} tone="cyan" value={progress} />
      </div>
    </motion.article>
  );
}
