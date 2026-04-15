"use client";

import { Flame } from "lucide-react";
import { motion } from "framer-motion";

interface StreakCardProps {
  streak: number;
}

export function StreakCard({ streak }: StreakCardProps) {
  return (
    <motion.article
      className="card p-4 transition duration-200 hover:-translate-y-0.5"
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25, delay: 0.03 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-[var(--muted)]">Sequência</p>
          <p className="mt-2 text-4xl font-black">{streak}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--warning-soft)] text-[var(--warning)]">
          <Flame className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-[var(--quiet)]">Dias agendados completos, sem quebrar o ritmo.</p>
    </motion.article>
  );
}
