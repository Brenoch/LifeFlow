"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { formatMonthTitle, formatShortDate, getMonthGrid, toDateKey, weekdayShortLabels } from "@/lib/date";
import { activityLabels, statusLabels } from "@/lib/labels";
import {
  getActivityForRoutine,
  getDailySummary,
  getScheduledItemsForDate,
} from "@/lib/smart-logic";
import { cn } from "@/lib/cn";
import { useLifeFlow } from "@/hooks/use-lifeflow";

const statusClasses = {
  complete: "border-emerald-300/25 bg-emerald-400/14 text-emerald-100",
  partial: "border-[color-mix(in_srgb,var(--primary)_35%,transparent)] bg-[var(--primary-soft)] text-[var(--primary)]",
  missed: "border-rose-300/25 bg-rose-400/12 text-rose-100",
  rest: "border-[var(--border)] bg-white/[0.04] text-[var(--quiet)]",
};

export function CalendarView() {
  const { data, setActivityStatus, streak } = useLifeFlow();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(toDateKey());

  const days = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);

  if (!data) {
    return null;
  }

  const selectedItems = getScheduledItemsForDate(data, selectedDate);
  const selectedSummary = getDailySummary(data, selectedDate);

  function shiftMonth(amount: number) {
    setCurrentMonth((date) => new Date(date.getFullYear(), date.getMonth() + amount, 1));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Dias completos ficam verdes. Dias agendados perdidos marcam o limite da sequência."
        eyebrow="Calendário"
        title="Histórico da rotina"
      />

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="card p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Button onClick={() => shiftMonth(-1)} variant="secondary">
              Anterior
            </Button>
            <div className="text-center">
              <h2 className="text-lg font-bold">{formatMonthTitle(currentMonth)}</h2>
              <p className="text-xs text-[#aeb7c2]">Sequência atual de {streak} dia(s)</p>
            </div>
            <Button onClick={() => shiftMonth(1)} variant="secondary">
              Próximo
            </Button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#aeb7c2]">
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
                    "aspect-square rounded-lg border p-1 text-left text-xs transition hover:-translate-y-0.5",
                    statusClasses[summary.status],
                    !isCurrentMonth && "opacity-40",
                    isSelected && "ring-2 ring-[var(--primary)]",
                  )}
                  key={dateKey}
                  onClick={() => setSelectedDate(dateKey)}
                  type="button"
                >
                  <span className="block font-bold">{date.getDate()}</span>
                  <span className="mt-1 block text-[10px]">
                    {summary.scheduled === 0
                      ? "Descanso"
                      : `${summary.completed}/${summary.scheduled}`}
                  </span>
                </button>
              );
            })}
          </div>
        </article>

        <aside className="card p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">{formatShortDate(selectedDate)}</h2>
              <p className="text-sm capitalize text-[#aeb7c2]">
                {statusLabels[selectedSummary.status]} · {selectedSummary.percentage}%
              </p>
            </div>
            <Button onClick={() => setSelectedDate(toDateKey())} variant="secondary">
              Hoje
            </Button>
          </div>

          <div className="space-y-3">
            {selectedItems.length > 0 ? (
              selectedItems.map((item) => {
                const activity = getActivityForRoutine(data.activities, item.id, selectedDate);
                const isDone = activity?.completed ?? false;

                return (
                  <div className="rounded-lg border border-[var(--border)] bg-white/[0.03] p-3" key={item.id}>
                    <div className="mb-3">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs capitalize text-[#aeb7c2]">
                        {activityLabels[item.type]}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                    <Button
                        onClick={() => setActivityStatus(item.id, true, selectedDate)}
                        variant={isDone ? "primary" : "secondary"}
                      >
                        Feito
                      </Button>
                      <Button
                        onClick={() => setActivityStatus(item.id, false, selectedDate)}
                        variant={!isDone && activity ? "danger" : "ghost"}
                      >
                        Não feito
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="rounded-lg border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
                Nenhuma atividade de rotina agendada para este dia.
              </p>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-[#aeb7c2]">
            <span className="chip border-emerald-300/30">Completo</span>
            <span className="chip border-amber-300/30">Parcial</span>
            <span className="chip border-rose-300/30">Perdido</span>
            <span className="chip">Descanso</span>
          </div>
        </aside>
      </section>
    </div>
  );
}
