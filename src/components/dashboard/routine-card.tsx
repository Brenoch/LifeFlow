"use client";

import { Clock3 } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { activityLabels } from "@/lib/labels";
import { getActivityForRoutine } from "@/lib/smart-logic";
import type { ActivityLog, RoutineItem } from "@/lib/types";

interface RoutineCardProps {
  item: RoutineItem;
  activities: ActivityLog[];
  dateKey: string;
  onStatusChange: (routineItemId: string, completed: boolean, dateKey?: string) => void;
}

export function RoutineCard({ item, activities, dateKey, onStatusChange }: RoutineCardProps) {
  const activity = getActivityForRoutine(activities, item.id, dateKey);
  const done = activity?.completed ?? false;

  return (
    <motion.div
      className="rounded-lg border border-[var(--border)] bg-[#14171d] p-3 transition duration-200 hover:border-[var(--border-strong)] hover:bg-[#171b22]"
      layout
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate font-bold">{item.title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
            <span>{activityLabels[item.type]}</span>
            {item.time ? (
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {item.time}
              </span>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:w-56">
          <Button onClick={() => onStatusChange(item.id, true, dateKey)} variant={done ? "primary" : "secondary"}>
            Feito
          </Button>
          <Button onClick={() => onStatusChange(item.id, false, dateKey)} variant={!done && activity ? "danger" : "ghost"}>
            Não feito
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
