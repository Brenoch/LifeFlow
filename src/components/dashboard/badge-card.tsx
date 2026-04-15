"use client";

import { Award } from "lucide-react";

import { cn } from "@/lib/cn";
import type { Badge as BadgeType } from "@/lib/types";

interface BadgeCardProps {
  badge: BadgeType;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition duration-200",
        badge.earned
          ? "border-[color-mix(in_srgb,var(--primary)_36%,transparent)] bg-[var(--primary-soft)] text-[var(--text)]"
          : "border-[var(--border)] bg-white/[0.025] text-[var(--muted)]",
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <Award className={cn("h-4 w-4", badge.earned ? "text-[var(--primary)]" : "text-[var(--quiet)]")} />
        <p className="font-bold">{badge.title}</p>
      </div>
      <p className="text-xs leading-5">{badge.description}</p>
    </div>
  );
}
