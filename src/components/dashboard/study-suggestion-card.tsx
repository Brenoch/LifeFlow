"use client";

import { BookOpenCheck } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { difficultyLabels } from "@/lib/labels";
import type { StudyTopic } from "@/lib/types";

interface StudySuggestionCardProps {
  topic?: StudyTopic;
  onComplete: (topicId: string, minutes: number) => void;
}

export function StudySuggestionCard({ topic, onComplete }: StudySuggestionCardProps) {
  return (
    <motion.article
      className="card p-5"
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-[var(--primary)]">Sugestão inteligente</p>
          <h2 className="mt-2 text-xl font-black">Estudo de hoje</h2>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--info-soft)] text-[var(--info)]">
          <BookOpenCheck className="h-5 w-5" />
        </span>
      </div>

      {topic ? (
        <div className="rounded-lg border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[var(--primary-soft)] p-4">
          <Badge tone="warning">{difficultyLabels[topic.difficulty]}</Badge>
          <p className="mt-4 text-2xl font-black">{topic.title}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{topic.estimatedMinutes} minutos planejados</p>
          <Button className="mt-5 w-full" onClick={() => onComplete(topic.id, topic.estimatedMinutes)}>
            Registrar estudo
          </Button>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
          Adicione tópicos para liberar sugestões.
        </p>
      )}
    </motion.article>
  );
}
