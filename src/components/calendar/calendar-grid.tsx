"use client";

import { cn } from "@/lib/cn";
import { toDateKey, weekdayShortLabels } from "@/lib/date";
import { getDailySummary } from "@/lib/smart-logic";
import type { LifeFlowData } from "@/lib/types";

const statusClasses = {
  complete: "border-[color-mix(in_srgb,var(--success)_34%,transparent)] bg-[var(--success-soft)] text-emerald-100",
  partial: "border-[color-mix(in_srgb,var(--primary)_34%,transparent)] bg-[var(--primary-soft)] text-[var(--primary)]",
  missed: "border-[color-mix(in_srgb,var(--error)_28%,transparent)] bg-[var(--error-soft)] text-rose-100",
  rest: "border-[var(--border)] bg-white/[0.035] text-[var(--quiet)]",
};

interface CalendarGridProps {
  data: LifeFlowData;
  days: Date[];
  currentMonth: Date;
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
}

export function CalendarGrid({
  data,
  days,
  currentMonth,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-bold text-[var(--muted)]">
        {weekdayShortLabels.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((date) => {
          const dateKey = toDateKey(date);
          const summary = getDailySummary(data, dateKey);
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isSelected = dateKey === selectedDate;

          return (
            <button
              className={cn(
                "calendar-cell premium-focus border p-1 text-left text-xs transition duration-200 hover:-translate-y-0.5",
                statusClasses[summary.status],
                !isCurrentMonth && "opacity-40",
                isSelected && "ring-2 ring-[var(--primary)]",
              )}
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              type="button"
            >
              <span className="block font-black">{date.getDate()}</span>
              <span className="mt-1 block text-[10px]">
                {summary.scheduled === 0 ? "Livre" : `${summary.completed}/${summary.scheduled}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
