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
  complete: "border-[#39d98a] bg-[#173021] text-[#dfffee]",
  partial: "border-[#f7c948] bg-[#302914] text-[#fff4bd]",
  missed: "border-[#ff6f61] bg-[#341d1a] text-[#ffd7d2]",
  rest: "border-[#2b2f36] bg-[#111317] text-[#7e8896]",
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
                    "aspect-square rounded-md border p-1 text-left text-xs transition",
                    statusClasses[summary.status],
                    !isCurrentMonth && "opacity-40",
                    isSelected && "ring-2 ring-[#38c7ff]",
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
                  <div className="rounded-md border border-[#2b2f36] bg-[#111317] p-3" key={item.id}>
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
              <p className="rounded-md border border-dashed border-[#2b2f36] p-4 text-sm text-[#aeb7c2]">
                Nenhuma atividade de rotina agendada para este dia.
              </p>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-[#aeb7c2]">
            <span className="chip border-[#39d98a]/40">Completo</span>
            <span className="chip border-[#f7c948]/40">Parcial</span>
            <span className="chip border-[#ff6f61]/40">Perdido</span>
            <span className="chip">Descanso</span>
          </div>
        </aside>
      </section>
    </div>
  );
}
