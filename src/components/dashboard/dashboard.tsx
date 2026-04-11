"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatCard } from "@/components/ui/stat-card";
import { toDateKey, weekdayShortLabels } from "@/lib/date";
import { activityLabels, difficultyLabels } from "@/lib/labels";
import {
  getActivityForRoutine,
  getScheduledItemsForDate,
  getWeeklyProgress,
  getWeeklyStudyMinutes,
  getWeeklyWorkoutCount,
} from "@/lib/smart-logic";
import type { ActivityType } from "@/lib/types";
import { useLifeFlow } from "@/hooks/use-lifeflow";

const activityTypes: ActivityType[] = [
  "gym",
  "martial_arts",
  "running",
  "sports",
  "study",
  "custom",
];

export function Dashboard() {
  const {
    data,
    levelInfo,
    streak,
    todaySummary,
    suggestedTopic,
    addRoutineItem,
    setActivityStatus,
  } = useLifeFlow();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ActivityType>("gym");
  const [weekdays, setWeekdays] = useState<number[]>([new Date().getDay()]);

  if (!data || !todaySummary) {
    return null;
  }

  const todayKey = toDateKey();
  const scheduledItems = getScheduledItemsForDate(data, todayKey);
  const weeklyProgress = getWeeklyProgress(data);
  const weeklyStudyMinutes = getWeeklyStudyMinutes(data);
  const weeklyWorkoutCount = getWeeklyWorkoutCount(data);

  function handleAddRoutine(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    addRoutineItem({ title: title.trim(), type, weekdays });
    setTitle("");
    setType("gym");
  }

  function toggleWeekday(day: number) {
    setWeekdays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day],
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Pequenas conclusões, sequência honesta e XP constante."
        eyebrow="Painel"
        title={`Bom te ver, ${data.profile.name}`}
      />

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-60 overflow-hidden rounded-md border border-[#2b2f36]">
          <Image
            alt="Mesa preparada para uma sessão de estudo focada"
            className="object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101113] via-[#101113]/72 to-transparent" />
          <div className="absolute inset-0 flex max-w-md flex-col justify-end p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-normal text-[#39d98a]">
              Hoje
            </p>
            <h2 className="mt-2 text-3xl font-bold">Complete a próxima repetição bem feita.</h2>
            <p className="mt-2 text-sm leading-6 text-[#d7dde5]">
              {todaySummary.completed} de {todaySummary.scheduled} tarefas planejadas concluídas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard helper="Nível atual" label="Nível" tone="green" value={levelInfo.level} />
          <StatCard helper={`Faltam ${levelInfo.xpToNextLevel} XP`} label="XP" tone="cyan" value={data.profile.xp} />
          <StatCard helper="Dias completos seguidos" label="Sequência" tone="gold" value={streak} />
          <StatCard helper="Últimos 7 dias" label="Min. estudo" tone="coral" value={weeklyStudyMinutes} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <article className="card p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Tarefas de hoje</h2>
              <p className="text-sm text-[#aeb7c2]">Feito ou não feito. Sem meio termo nebuloso.</p>
            </div>
            <span className="chip">{todaySummary.percentage}%</span>
          </div>

          <ProgressBar label="Conclusão diária" tone="green" value={todaySummary.percentage} />

          <div className="mt-5 space-y-3">
            {scheduledItems.length > 0 ? (
              scheduledItems.map((item) => {
                const activity = getActivityForRoutine(data.activities, item.id, todayKey);
                const isDone = activity?.completed ?? false;

                return (
                  <div
                    className="rounded-md border border-[#2b2f36] bg-[#111317] p-3"
                    key={item.id}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-[#aeb7c2]">{activityLabels[item.type]}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:w-56">
                        <Button
                          onClick={() => setActivityStatus(item.id, true)}
                          variant={isDone ? "primary" : "secondary"}
                        >
                          Feito
                        </Button>
                        <Button
                          onClick={() => setActivityStatus(item.id, false)}
                          variant={!isDone && activity ? "danger" : "ghost"}
                        >
                          Não feito
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="rounded-md border border-dashed border-[#2b2f36] p-4 text-sm text-[#aeb7c2]">
                Nenhuma tarefa agendada para hoje. Adicione uma abaixo e faça o dia contar.
              </p>
            )}
          </div>
        </article>

        <aside className="space-y-4">
          <article className="card p-4 sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Sugestão inteligente</h2>
                <p className="text-sm text-[#aeb7c2]">Baseada em espaçamento, dificuldade e carga recente.</p>
              </div>
              <Link className="text-sm font-semibold text-[#39d98a]" href="/estudos">
                Planejador
              </Link>
            </div>

            {suggestedTopic ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xl font-bold">{suggestedTopic.title}</p>
                  <p className="text-sm capitalize text-[#aeb7c2]">
                    {difficultyLabels[suggestedTopic.difficulty]} · {suggestedTopic.estimatedMinutes} min
                  </p>
                </div>
                <Link href="/pomodoro">
                  <Button className="w-full">Iniciar timer de foco</Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-[#aeb7c2]">Adicione um tópico de estudo para liberar sugestões.</p>
            )}
          </article>

          <article className="card p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Progresso semanal</h2>
              <span className="chip">{weeklyWorkoutCount} treinos</span>
            </div>
            <div className="grid grid-cols-7 items-end gap-2">
              {weeklyProgress.map((day) => {
                const date = new Date(`${day.date}T00:00:00`);
                const height = Math.max(8, day.percentage);

                return (
                  <div className="space-y-2 text-center" key={day.date}>
                    <div className="flex h-28 items-end rounded-md bg-[#111317] p-1">
                      <div
                        className="w-full rounded-md bg-[#38c7ff]"
                        style={{ height: `${height}%`, opacity: day.status === "rest" ? 0.25 : 1 }}
                      />
                    </div>
                    <span className="block text-[11px] text-[#aeb7c2]">
                      {weekdayShortLabels[date.getDay()]}
                    </span>
                  </div>
                );
              })}
            </div>
          </article>
        </aside>
      </section>

      <section className="card p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold">Adicionar atividade da rotina</h2>
          <p className="text-sm text-[#aeb7c2]">Escolha os dias em que ela entra no plano.</p>
        </div>
        <form className="grid gap-3 lg:grid-cols-[1fr_180px_auto]" onSubmit={handleAddRoutine}>
          <input
            className="input"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Corrida matinal, revisão de algoritmos..."
            value={title}
          />
          <select
            className="input"
            onChange={(event) => setType(event.target.value as ActivityType)}
            value={type}
          >
            {activityTypes.map((item) => (
              <option key={item} value={item}>
                {activityLabels[item]}
              </option>
            ))}
          </select>
          <Button type="submit">Adicionar atividade</Button>
          <div className="flex flex-wrap gap-2 lg:col-span-3">
            {weekdayShortLabels.map((label, index) => (
              <button
                className={`chip ${weekdays.includes(index) ? "border-[#39d98a] bg-[#163021] text-[#dfffee]" : ""}`}
                key={label}
                onClick={() => toggleWeekday(index)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </form>
      </section>
    </div>
  );
}
