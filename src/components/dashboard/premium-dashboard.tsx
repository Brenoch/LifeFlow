"use client";

import {
  Award,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Flame,
  Plus,
  Target,
  TimerReset,
  Trophy,
  UserRound,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs } from "@/components/ui/tabs";
import { useLifeFlow } from "@/hooks/use-lifeflow";
import { toDateKey, weekdayShortLabels } from "@/lib/date";
import { activityLabels, difficultyLabels } from "@/lib/labels";
import { cn } from "@/lib/cn";
import {
  getActivityForRoutine,
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
  "custom",
];

type DashboardTab = "routine" | "studies" | "analytics" | "profile";

const dashboardTabs = [
  { value: "routine" as const, label: "Rotina", icon: <Target className="h-4 w-4" /> },
  { value: "studies" as const, label: "Estudos", icon: <BookOpenCheck className="h-4 w-4" /> },
  { value: "analytics" as const, label: "Análise", icon: <BarChart3 className="h-4 w-4" /> },
  { value: "profile" as const, label: "Perfil", icon: <UserRound className="h-4 w-4" /> },
];

export function PremiumDashboard() {
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
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ActivityType>("gym");
  const [weekdays, setWeekdays] = useState<number[]>([new Date().getDay()]);
  const [activeTab, setActiveTab] = useState<DashboardTab>("routine");

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
        status: day.status,
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
        action={
          <Badge tone={syncError ? "error" : storageMode === "firebase" ? "success" : "violet"}>
            {syncError ? "Sincronização pendente" : storageMode === "firebase" ? "Firestore ativo" : "Modo local"}
          </Badge>
        }
        description="Rotina, foco e estudo em uma visão calma para decidir a próxima ação sem ruído."
        eyebrow="Painel"
        title={`Bom te ver, ${data.profile.name}`}
      />

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <motion.article
          className="relative min-h-[360px] overflow-hidden rounded-lg border border-[var(--border)]"
          initial={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <Image
            alt="Mesa organizada para uma sessão de estudo focada"
            className="object-cover"
            fill
            priority
            sizes="(min-width: 1280px) 58vw, 100vw"
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0f1117_0%,rgba(15,17,23,0.88)_42%,rgba(15,17,23,0.22)_100%)]" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
            <Badge className="mb-4 w-fit" tone="violet">
              Próxima ação
            </Badge>
            <div className="max-w-xl space-y-3">
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
                Um dia disciplinado começa por uma decisão pequena.
              </h2>
              <p className="text-sm leading-6 text-slate-200 sm:text-base">
                {todaySummary.completed} de {todaySummary.scheduled} tarefas concluídas hoje.
                Mantenha o plano leve, visível e possível.
              </p>
            </div>
          </div>
        </motion.article>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <StatCard
            helper="Conclusão planejada para hoje"
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Progresso"
            tone="violet"
            value={`${todaySummary.percentage}%`}
          />
          <StatCard
            helper="Dias completos seguidos"
            icon={<Flame className="h-5 w-5" />}
            label="Sequência"
            tone="gold"
            value={streak}
          />
          <StatCard
            helper={`Faltam ${levelInfo.xpToNextLevel} XP`}
            icon={<Zap className="h-5 w-5" />}
            label={`Nível ${levelInfo.level}`}
            tone="cyan"
            value={`${data.profile.xp} XP`}
          />
          <StatCard
            helper="Conquistas liberadas"
            icon={<Trophy className="h-5 w-5" />}
            label="Badges"
            tone="green"
            value={`${earnedBadges}/${badges.length}`}
          />
        </div>
      </section>

      <Tabs
        className="lg:max-w-3xl"
        onValueChange={setActiveTab}
        options={dashboardTabs}
        value={activeTab}
      />

      {activeTab === "routine" ? (
        <RoutinePanel
          data={data}
          handleAddRoutine={handleAddRoutine}
          scheduledItems={scheduledItems}
          setActivityStatus={setActivityStatus}
          setTitle={setTitle}
          setType={setType}
          title={title}
          todayKey={todayKey}
          todaySummary={todaySummary}
          toggleWeekday={toggleWeekday}
          type={type}
          weekdays={weekdays}
        />
      ) : null}

      {activeTab === "studies" ? (
        <StudiesPanel
          completeStudySession={completeStudySession}
          sessions={data.pomodoroSessions.length}
          suggestedTopic={suggestedTopic}
          weeklyStudyMinutes={weeklyStudyMinutes}
        />
      ) : null}

      {activeTab === "analytics" ? (
        <AnalyticsPanel
          sessionChartData={sessionChartData}
          weeklyProgress={weeklyProgress}
          weeklyStudyMinutes={weeklyStudyMinutes}
          weeklyWorkoutCount={weeklyWorkoutCount}
        />
      ) : null}

      {activeTab === "profile" ? (
        <ProfilePanel
          badges={badges}
          levelInfo={levelInfo}
          name={data.profile.name}
          xp={data.profile.xp}
        />
      ) : null}
    </div>
  );
}

function RoutinePanel({
  data,
  handleAddRoutine,
  scheduledItems,
  setActivityStatus,
  setTitle,
  setType,
  title,
  todayKey,
  todaySummary,
  toggleWeekday,
  type,
  weekdays,
}: {
  data: NonNullable<ReturnType<typeof useLifeFlow>["data"]>;
  handleAddRoutine: (event: FormEvent<HTMLFormElement>) => void;
  scheduledItems: ReturnType<typeof getScheduledItemsForDate>;
  setActivityStatus: ReturnType<typeof useLifeFlow>["setActivityStatus"];
  setTitle: (value: string) => void;
  setType: (value: ActivityType) => void;
  title: string;
  todayKey: string;
  todaySummary: NonNullable<ReturnType<typeof useLifeFlow>["todaySummary"]>;
  toggleWeekday: (day: number) => void;
  type: ActivityType;
  weekdays: number[];
}) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4 xl:grid-cols-[1fr_0.82fr]"
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="p-4 sm:p-5">
        <CardHeader className="mb-4 flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle>Tarefas de hoje</CardTitle>
            <CardDescription>Feito ou não feito. O plano fica honesto e fácil de ler.</CardDescription>
          </div>
          <Badge tone="violet">{todaySummary.percentage}%</Badge>
        </CardHeader>

        <ProgressBar label="Conclusão diária" tone="violet" value={todaySummary.percentage} />

        <div className="mt-5 grid gap-3">
          {scheduledItems.length > 0 ? (
            scheduledItems.map((item) => {
              const activity = getActivityForRoutine(data.activities, item.id, todayKey);
              const isDone = activity?.completed ?? false;

              return (
                <motion.div
                  className="rounded-lg border border-[var(--border)] bg-[#111520] p-3"
                  key={item.id}
                  layout
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">{activityLabels[item.type]}</p>
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
                </motion.div>
              );
            })
          ) : (
            <p className="rounded-lg border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
              Nenhuma tarefa agendada para hoje. Adicione uma abaixo e faça o dia contar.
            </p>
          )}
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <CardHeader>
          <CardTitle>Adicionar rotina</CardTitle>
          <CardDescription>Escolha os dias em que ela entra no plano semanal.</CardDescription>
        </CardHeader>
        <form className="mt-5 space-y-3" onSubmit={handleAddRoutine}>
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
          <div className="flex flex-wrap gap-2">
            {weekdayShortLabels.map((label, index) => (
              <button
                className={cn(
                  "chip premium-focus transition hover:border-violet-300/35 hover:text-white",
                  weekdays.includes(index) && "border-violet-300/40 bg-violet-400/14 text-violet-100",
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
    </motion.section>
  );
}

function StudiesPanel({
  completeStudySession,
  sessions,
  suggestedTopic,
  weeklyStudyMinutes,
}: {
  completeStudySession: ReturnType<typeof useLifeFlow>["completeStudySession"];
  sessions: number;
  suggestedTopic: ReturnType<typeof useLifeFlow>["suggestedTopic"];
  weeklyStudyMinutes: number;
}) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]"
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="p-5">
        <CardHeader>
          <CardTitle>Sugestão inteligente</CardTitle>
          <CardDescription>Prioridade baseada em espaçamento, dificuldade e carga recente.</CardDescription>
        </CardHeader>
        {suggestedTopic ? (
          <div className="mt-5 rounded-lg border border-violet-300/20 bg-violet-400/10 p-4">
            <Badge tone="violet">{difficultyLabels[suggestedTopic.difficulty]}</Badge>
            <p className="mt-4 text-3xl font-black tracking-tight">{suggestedTopic.title}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{suggestedTopic.estimatedMinutes} minutos</p>
            <Button
              className="mt-5 w-full"
              onClick={() => completeStudySession(suggestedTopic.id, suggestedTopic.estimatedMinutes)}
            >
              Registrar estudo agora
            </Button>
          </div>
        ) : (
          <p className="mt-5 rounded-lg border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
            Adicione um tópico de estudo para liberar sugestões.
          </p>
        )}
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard
          helper="Últimos 7 dias"
          icon={<BookOpenCheck className="h-5 w-5" />}
          label="Minutos"
          tone="cyan"
          value={weeklyStudyMinutes}
        />
        <StatCard
          helper="Pomodoros finalizados"
          icon={<TimerReset className="h-5 w-5" />}
          label="Sessões"
          tone="violet"
          value={sessions}
        />
      </div>
    </motion.section>
  );
}

function AnalyticsPanel({
  sessionChartData,
  weeklyProgress,
  weeklyStudyMinutes,
  weeklyWorkoutCount,
}: {
  sessionChartData: Array<{ name: string; minutos: number }>;
  weeklyProgress: Array<{
    name: string;
    percentual: number;
    completas: number;
    planejadas: number;
    status: string;
  }>;
  weeklyStudyMinutes: number;
  weeklyWorkoutCount: number;
}) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]"
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="p-4 sm:p-5">
        <CardHeader>
          <CardTitle>Performance semanal</CardTitle>
          <CardDescription>Conclusão diária das tarefas planejadas.</CardDescription>
        </CardHeader>
        <div className="mt-4 h-72">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={weeklyProgress}>
              <defs>
                <linearGradient id="progressGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis axisLine={false} dataKey="name" tickLine={false} tick={{ fill: "#a8b0c3", fontSize: 12 }} />
              <YAxis axisLine={false} domain={[0, 100]} tickLine={false} tick={{ fill: "#a8b0c3", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "#151821",
                  border: "1px solid rgba(148,163,184,0.18)",
                  borderRadius: 8,
                  color: "#f7f8ff",
                }}
              />
              <Area
                dataKey="percentual"
                fill="url(#progressGradient)"
                stroke="#8b5cf6"
                strokeWidth={3}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4">
        <Card className="p-4 sm:p-5">
          <CardHeader>
            <CardTitle>Foco recente</CardTitle>
            <CardDescription>Minutos por sessão concluída.</CardDescription>
          </CardHeader>
          <div className="mt-4 h-48">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={sessionChartData.length ? sessionChartData : [{ name: "0", minutos: 0 }]}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis axisLine={false} dataKey="name" tickLine={false} tick={{ fill: "#a8b0c3", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#a8b0c3", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#151821",
                    border: "1px solid rgba(148,163,184,0.18)",
                    borderRadius: 8,
                    color: "#f7f8ff",
                  }}
                />
                <Bar dataKey="minutos" fill="#38bdf8" radius={[8, 8, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <div className="grid gap-3 sm:grid-cols-2">
          <StatCard helper="Últimos 7 dias" label="Treinos" tone="green" value={weeklyWorkoutCount} />
          <StatCard helper="Últimos 7 dias" label="Estudo" tone="cyan" value={`${weeklyStudyMinutes}m`} />
        </div>
      </div>
    </motion.section>
  );
}

function ProfilePanel({
  badges,
  levelInfo,
  name,
  xp,
}: {
  badges: ReturnType<typeof useLifeFlow>["badges"];
  levelInfo: ReturnType<typeof useLifeFlow>["levelInfo"];
  name: string;
  xp: number;
}) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]"
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="p-5">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>Nível, XP e conquistas atuais.</CardDescription>
        </CardHeader>
        <div className="mt-5 space-y-4">
          <ProgressBar label={`Nível ${levelInfo.level}`} tone="violet" value={levelInfo.progress} />
          <div className="grid grid-cols-2 gap-3">
            <StatCard helper="Total acumulado" label="XP" tone="violet" value={xp} />
            <StatCard helper="Para o próximo nível" label="Faltam" tone="gold" value={levelInfo.xpToNextLevel} />
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <CardHeader>
          <CardTitle>Conquistas</CardTitle>
          <CardDescription>Pequenos marcos que reforçam consistência.</CardDescription>
        </CardHeader>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {badges.map((badge) => (
            <div
              className={cn(
                "rounded-lg border p-4 transition",
                badge.earned
                  ? "border-violet-300/28 bg-violet-400/12 text-white"
                  : "border-[var(--border)] bg-white/[0.025] text-[var(--muted)]",
              )}
              key={badge.id}
            >
              <div className="mb-3 flex items-center gap-2">
                <Award className={cn("h-4 w-4", badge.earned ? "text-violet-200" : "text-[var(--quiet)]")} />
                <p className="font-bold">{badge.title}</p>
              </div>
              <p className="text-xs leading-5">{badge.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.section>
  );
}
