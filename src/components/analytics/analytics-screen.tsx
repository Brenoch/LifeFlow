"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useLifeFlow } from "@/hooks/use-lifeflow";
import { weekdayShortLabels } from "@/lib/date";
import {
  getThirtyDayProgress,
  getWeeklyProgress,
  getWeeklyStudyMinutes,
  getWeeklyWorkoutCount,
} from "@/lib/smart-logic";

export function AnalyticsScreen() {
  const { data, badges } = useLifeFlow();

  if (!data) {
    return null;
  }

  const weekly = getWeeklyProgress(data).map((day) => {
    const date = new Date(`${day.date}T00:00:00`);

    return {
      name: weekdayShortLabels[date.getDay()],
      percentual: day.percentage,
      completas: day.completed,
      planejadas: day.scheduled,
    };
  });
  const thirtyDays = getThirtyDayProgress(data);
  const activeDays = thirtyDays.filter((day) => day.scheduled > 0);
  const average =
    activeDays.length === 0
      ? 0
      : Math.round(activeDays.reduce((total, day) => total + day.percentage, 0) / activeDays.length);
  const focusData = data.pomodoroSessions.slice(-10).map((session, index) => ({
    name: `${index + 1}`,
    minutos: session.durationMinutes,
  }));
  const earnedBadges = badges.filter((badge) => badge.earned).length;

  return (
    <div className="space-y-6">
      <PageHeader
        description="Leia seu ritmo semanal, volume de foco e consistência recente."
        eyebrow="Analytics"
        title="Painel de performance"
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard helper="Últimos 30 dias" label="Média" tone="cyan" value={`${average}%`} />
        <StatCard helper="Últimos 7 dias" label="Estudo" tone="gold" value={`${getWeeklyStudyMinutes(data)}m`} />
        <StatCard helper="Últimos 7 dias" label="Treinos" tone="green" value={getWeeklyWorkoutCount(data)} />
        <StatCard helper="Conquistas" label="Badges" tone="violet" value={`${earnedBadges}/${badges.length}`} />
      </section>

      <section className="grid gap-4 2xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="p-4 sm:p-5">
          <CardHeader>
            <CardTitle>Conclusão semanal</CardTitle>
            <CardDescription>Percentual diário das tarefas planejadas.</CardDescription>
          </CardHeader>
          <div className="mt-4">
            <WeeklyChart data={weekly} height={330} />
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <CardHeader>
            <CardTitle>Blocos de foco</CardTitle>
            <CardDescription>Minutos nas sessões mais recentes.</CardDescription>
          </CardHeader>
          <div className="mt-4 h-[330px]">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={focusData.length ? focusData : [{ name: "0", minutos: 0 }]}>
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
                <Bar dataKey="minutos" fill="#f4ef5f" radius={[8, 8, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
    </div>
  );
}
