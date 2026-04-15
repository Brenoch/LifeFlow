"use client";

import { BarChart3, BookOpenCheck, Plus, Target, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { FormEvent, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { BadgeCard } from "@/components/dashboard/badge-card";
import { DailyProgressCard } from "@/components/dashboard/daily-progress-card";
import { RoutineCard } from "@/components/dashboard/routine-card";
import { StreakCard } from "@/components/dashboard/streak-card";
import { StudySuggestionCard } from "@/components/dashboard/study-suggestion-card";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { XpLevelCard } from "@/components/dashboard/xp-level-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs } from "@/components/ui/tabs";
import { useLifeFlow } from "@/hooks/use-lifeflow";
import { cn } from "@/lib/cn";
import { toDateKey, weekdayShortLabels } from "@/lib/date";
import { activityLabels, difficultyLabels } from "@/lib/labels";
import {
  getScheduledItemsForDate,
  getWeeklyProgress,
  getWeeklyStudyMinutes,
  getWeeklyWorkoutCount,
} from "@/lib/smart-logic";
import type { ActivityType } from "@/lib/types";

const activityTypes: ActivityType[] = [
  "gym",
  "martial_arts",
  "running",
  "sports",
  "study",
  "reading",
  "sleep",
  "water",
  "custom",
];

type DashboardTab = "routine" | "studies" | "analytics" | "profile";

const dashboardTabs = [
  { value: "routine" as const, label: "Rotina", icon: <Target className="h-4 w-4" /> },
  { value: "studies" as const, label: "Estudos", icon: <BookOpenCheck className="h-4 w-4" /> },
  { value: "analytics" as const, label: "Análise", icon: <BarChart3 className="h-4 w-4" /> },
  { value: "profile" as const, label: "Perfil", icon: <UserRound className="h-4 w-4" /> },
];

export function LifeFlowDashboard() {
  const {
    data,
    levelInfo,
    streak,
    todaySummary,
    suggestedTopic,
    badges,
    storageMode,
    syncError,
    addRoutineItem,
    setActivityStatus,
    completeStudySession,
  } = useLifeFlow();
  const [activeTab, setActiveTab] = useState<DashboardTab>("routine");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ActivityType>("gym");
  const [time, setTime] = useState("");
  const [weekdays, setWeekdays] = useState<number[]>([new Date().getDay()]);

  const todayKey = toDateKey();

  const weeklyProgress = useMemo(() => {
    if (!data) {
      return [];
    }

    return getWeeklyProgress(data).map((day) => {
      const date = new Date(`${day.date}T00:00:00`);

      return {
        name: weekdayShortLabels[date.getDay()],
        percentual: day.percentage,
        completas: day.completed,
        planejadas: day.scheduled,
      };
    });
  }, [data]);

  if (!data || !todaySummary) {
    return null;
  }

  const scheduledItems = getScheduledItemsForDate(data, todayKey);
  const weeklyStudyMinutes = getWeeklyStudyMinutes(data);
  const weeklyWorkoutCount = getWeeklyWorkoutCount(data);
  const earnedBadges = badges.filter((badge) => badge.earned).length;
  const sessionChartData = data.pomodoroSessions.slice(-7).map((session, index) => ({
    name: `${index + 1}`,
    minutos: session.durationMinutes,
  }));

  function handleAddRoutine(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    addRoutineItem({
      title: title.trim(),
      type,
      weekdays,
      time: time.trim() || undefined,
    });
    setTitle("");
    setType("gym");
    setTime("");
  }

  function toggleWeekday(day: number) {
    setWeekdays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day],
    );
  }

  return (
    <div className="min-w-0 space-y-6 overflow-hidden">
      <PageHeader
        action={
          <Badge tone={syncError ? "error" : storageMode === "firebase" ? "success" : "warning"}>
            {syncError ? "Sincronização pendente" : storageMode === "firebase" ? "Firebase ativo" : "Modo local"}
          </Badge>
        }
        description="Rotina, estudo, foco e progresso em uma tela limpa para decidir a próxima ação."
        eyebrow="Painel"
        title={`Bom te ver, ${data.profile.name}`}
      />

      <section className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <motion.article
          className="panel min-w-0 overflow-hidden"
          initial={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid min-w-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.58fr)]">
            <div className="min-w-0 p-5 sm:p-6">
              <div className="habit-thread mb-5 border border-white/10">
                <div className="absolute bottom-5 left-5">
                  <p className="text-sm font-black text-[var(--quiet)]">track</p>
                  <p className="text-3xl font-black text-[var(--text)]">seu ritmo.</p>
                </div>
                <span className="absolute left-10 top-12 h-2 w-2 rounded-full bg-[var(--paper)]" />
                <span className="absolute right-16 top-20 h-2 w-2 rounded-full border border-[var(--paper)]" />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="warning">Hoje</Badge>
                <Badge tone={todaySummary.percentage === 100 ? "success" : "default"}>
                  {todaySummary.completed}/{todaySummary.scheduled || 0} concluídas
                </Badge>
              </div>

              <div className="mt-5 max-w-2xl space-y-2">
                <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
                  Uma rotina bonita o bastante para você querer abrir todo dia.
                </h2>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  Seus hábitos, sessões de estudo e treinos aparecem como um sistema simples:
                  cumprir, medir, repetir.
                </p>
              </div>
            </div>

            <div className="m-4 rounded-lg bg-[var(--paper)] p-4 text-[var(--text-inverse)]">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-xs font-black uppercase text-[#626977]">Semana</p>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#17191d] text-sm text-[var(--paper)]">
                  +
                </span>
              </div>
              <div className="space-y-5">
                {[
                  ["sono 8h", todaySummary.percentage >= 30],
                  ["estudo", todaySummary.percentage >= 60],
                  ["treino", todaySummary.percentage === 100],
                ].map(([label, active]) => (
                  <div key={String(label)}>
                    <p className="mb-2 text-xl font-black">{label}</p>
                    <div className="flex gap-2 overflow-hidden">
                      {[10, 11, 12, 13, 14, 15].map((day, index) => (
                        <span
                          className={cn(
                            "timeline-dot grid place-items-center text-xs font-black",
                            (active || index < todaySummary.completed) && "is-active",
                          )}
                          key={day}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.article>

        <div className="grid min-w-0 gap-3 sm:grid-cols-2 2xl:grid-cols-1">
          <DailyProgressCard summary={todaySummary} />
          <StreakCard streak={streak} />
          <XpLevelCard
            level={levelInfo.level}
            progress={levelInfo.progress}
            xp={data.profile.xp}
            xpToNextLevel={levelInfo.xpToNextLevel}
          />
          <StatCard helper="Conquistas liberadas" label="Badges" tone="green" value={`${earnedBadges}/${badges.length}`} />
        </div>
      </section>

      <Tabs
        className="w-full lg:max-w-3xl"
        onValueChange={setActiveTab}
        options={dashboardTabs}
        value={activeTab}
      />

      {activeTab === "routine" ? (
        <section className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(330px,0.6fr)]">
          <Card className="p-4 sm:p-5">
            <CardHeader className="mb-4 flex flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle>Tarefas de hoje</CardTitle>
                <CardDescription>Marque feito ou não feito. O plano fica honesto.</CardDescription>
              </div>
              <Badge tone="warning">{todaySummary.percentage}%</Badge>
            </CardHeader>

            <div className="grid gap-3">
              {scheduledItems.length > 0 ? (
                scheduledItems.map((item) => (
                  <RoutineCard
                    activities={data.activities}
                    dateKey={todayKey}
                    item={item}
                    key={item.id}
                    onStatusChange={setActivityStatus}
                  />
                ))
              ) : (
                <p className="rounded-lg border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
                  Nenhuma tarefa agendada para hoje.
                </p>
              )}
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <CardHeader>
              <CardTitle>Adicionar rotina</CardTitle>
              <CardDescription>Escolha tipo, horário e dias da semana.</CardDescription>
            </CardHeader>
            <form className="mt-5 space-y-3" onSubmit={handleAddRoutine}>
              <input
                className="input"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Corrida matinal, leitura..."
                value={title}
              />
              <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
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
                <input
                  className="input"
                  onChange={(event) => setTime(event.target.value)}
                  type="time"
                  value={time}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {weekdayShortLabels.map((label, index) => (
                  <button
                    className={cn(
                      "chip premium-focus transition hover:border-[color-mix(in_srgb,var(--primary)_35%,transparent)] hover:text-white",
                      weekdays.includes(index) &&
                        "border-[color-mix(in_srgb,var(--primary)_42%,transparent)] bg-[var(--primary-soft)] text-[var(--primary)]",
                    )}
                    key={label}
                    onClick={() => toggleWeekday(index)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Button className="w-full" type="submit">
                <Plus className="h-4 w-4" />
                Adicionar atividade
              </Button>
            </form>
          </Card>
        </section>
      ) : null}

      {activeTab === "studies" ? (
        <section className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <StudySuggestionCard onComplete={completeStudySession} topic={suggestedTopic} />
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <StatCard helper="Últimos 7 dias" icon={<BookOpenCheck className="h-5 w-5" />} label="Minutos" tone="cyan" value={weeklyStudyMinutes} />
            <StatCard helper="Pomodoros finalizados" label="Sessões" tone="gold" value={data.pomodoroSessions.length} />
            <StatCard helper="Fila ativa" label="Tópicos" tone="violet" value={data.studyTopics.length} />
            <StatCard helper={suggestedTopic ? difficultyLabels[suggestedTopic.difficulty] : "Sem tópico"} label="Prioridade" tone="green" value={suggestedTopic ? suggestedTopic.estimatedMinutes : 0} />
          </div>
        </section>
      ) : null}

      {activeTab === "analytics" ? (
        <section className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Card className="p-4 sm:p-5">
            <CardHeader>
              <CardTitle>Performance semanal</CardTitle>
              <CardDescription>Conclusão diária das tarefas planejadas.</CardDescription>
            </CardHeader>
            <div className="mt-4">
              <WeeklyChart data={weeklyProgress} height={300} />
            </div>
          </Card>

          <div className="grid min-w-0 gap-4">
            <Card className="overflow-hidden p-4 sm:p-5">
              <CardHeader>
                <CardTitle>Foco recente</CardTitle>
                <CardDescription>Minutos por sessão concluída.</CardDescription>
              </CardHeader>
              <div className="mt-4 h-52">
                <ResponsiveContainer height="100%" width="100%">
                  <BarChart data={sessionChartData.length ? sessionChartData : [{ name: "0", minutos: 0 }]}>
                    <CartesianGrid stroke="rgba(174,180,192,0.13)" vertical={false} />
                    <XAxis axisLine={false} dataKey="name" tick={{ fill: "#aeb4c0", fontSize: 12 }} tickLine={false} />
                    <YAxis axisLine={false} tick={{ fill: "#aeb4c0", fontSize: 12 }} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#17191d",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 8,
                        color: "#f7f7f2",
                      }}
                    />
                    <Bar dataKey="minutos" fill="#43dce7" radius={[8, 8, 4, 4]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard helper="Últimos 7 dias" label="Treinos" tone="green" value={weeklyWorkoutCount} />
              <StatCard helper="Últimos 7 dias" label="Estudo" tone="cyan" value={`${weeklyStudyMinutes}m`} />
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "profile" ? (
        <section className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Card className="p-5">
            <CardHeader>
              <CardTitle>{data.profile.name}</CardTitle>
              <CardDescription>Nível, XP e conquistas atuais.</CardDescription>
            </CardHeader>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <StatCard helper="Total acumulado" label="XP" tone="gold" value={data.profile.xp} />
              <StatCard helper="Para o próximo nível" label="Faltam" tone="gold" value={levelInfo.xpToNextLevel} />
            </div>
          </Card>

          <Card className="p-5">
            <CardHeader>
              <CardTitle>Conquistas</CardTitle>
              <CardDescription>Marcos que reforçam consistência.</CardDescription>
            </CardHeader>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {badges.map((badge) => (
                <BadgeCard badge={badge} key={badge.id} />
              ))}
            </div>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
