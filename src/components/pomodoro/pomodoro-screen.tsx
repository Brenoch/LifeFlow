"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { formatRelativeStudyDate } from "@/lib/date";
import { difficultyLabels } from "@/lib/labels";
import { useLifeFlow } from "@/hooks/use-lifeflow";

const durationOptions = [15, 25, 45, 60];

export function PomodoroScreen() {
  const { data, suggestedTopic, completeStudySession } = useLifeFlow();
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState("");

  useEffect(() => {
    if (!selectedTopicId && suggestedTopic) {
      setSelectedTopicId(suggestedTopic.id);
    }
  }, [selectedTopicId, suggestedTopic]);

  const selectedTopic = useMemo(() => {
    return data?.studyTopics.find((topic) => topic.id === selectedTopicId);
  }, [data?.studyTopics, selectedTopicId]);

  const finishSession = useCallback(() => {
    if (!selectedTopic) {
      setIsRunning(false);
      return;
    }

    completeStudySession(selectedTopic.id, durationMinutes);
    setIsRunning(false);
    setSecondsLeft(durationMinutes * 60);
  }, [completeStudySession, durationMinutes, selectedTopic]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    if (secondsLeft <= 0) {
      finishSession();
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [finishSession, isRunning, secondsLeft]);

  if (!data) {
    return null;
  }

  const completedSessions = data.pomodoroSessions.length;
  const totalMinutes = data.pomodoroSessions.reduce(
    (total, session) => total + session.durationMinutes,
    0,
  );
  function updateDuration(minutes: number) {
    setDurationMinutes(minutes);

    if (!isRunning) {
      setSecondsLeft(minutes * 60);
    }
  }

  function resetTimer() {
    setIsRunning(false);
    setSecondsLeft(durationMinutes * 60);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Escolha um tópico, inicie o relógio e garanta o XP quando a sessão terminar."
        eyebrow="Pomodoro"
        title="Timer de foco"
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard helper="Concluídas" label="Sessões" tone="green" value={completedSessions} />
        <StatCard helper="Total" label="Min. foco" tone="cyan" value={totalMinutes} />
        <StatCard helper="+15 XP cada" label="XP estudo" tone="gold" value={completedSessions * 15} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <PomodoroTimer
          disabled={!selectedTopic}
          durationMinutes={durationMinutes}
          isRunning={isRunning}
          onFinish={finishSession}
          onReset={resetTimer}
          onToggle={() => setIsRunning((current) => !current)}
          secondsLeft={secondsLeft}
          topicTitle={selectedTopic?.title}
        />

        <aside className="space-y-4">
          <article className="card p-4 sm:p-5">
            <div className="mb-4">
              <h2 className="text-lg font-bold">Tópico</h2>
              <p className="text-sm text-[#aeb7c2]">As sessões são salvas no tópico selecionado.</p>
            </div>

            <select
              className="input"
              onChange={(event) => setSelectedTopicId(event.target.value)}
              value={selectedTopicId}
            >
              <option value="">Escolha um tópico</option>
              {data.studyTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>

            {selectedTopic ? (
              <div className="mt-4 rounded-lg border border-[var(--border)] bg-white/[0.03] p-3">
                <p className="font-semibold">{selectedTopic.title}</p>
                <p className="text-sm capitalize text-[#aeb7c2]">
                  {difficultyLabels[selectedTopic.difficulty]} · {selectedTopic.estimatedMinutes} min ·{" "}
                  {formatRelativeStudyDate(selectedTopic.lastStudiedAt)}
                </p>
              </div>
            ) : null}
          </article>

          <article className="card p-4 sm:p-5">
            <div className="mb-4">
              <h2 className="text-lg font-bold">Duração</h2>
              <p className="text-sm text-[#aeb7c2]">O padrão é 25 minutos.</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {durationOptions.map((minutes) => (
                <button
                  className={`chip ${durationMinutes === minutes ? "border-[color-mix(in_srgb,var(--primary)_40%,transparent)] bg-[var(--primary-soft)] text-[var(--primary)]" : ""}`}
                  disabled={isRunning}
                  key={minutes}
                  onClick={() => updateDuration(minutes)}
                  type="button"
                >
                  {minutes}
                </button>
              ))}
            </div>
          </article>

          <article className="card p-4 sm:p-5">
            <h2 className="mb-3 text-lg font-bold">Sessões recentes</h2>
            <div className="space-y-2">
              {data.pomodoroSessions.slice(-5).reverse().map((session) => (
                <div
                  className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-white/[0.03] p-3 text-sm"
                  key={session.id}
                >
                  <span className="truncate">{session.topicTitle}</span>
                  <span className="shrink-0 text-[#aeb7c2]">{session.durationMinutes} min</span>
                </div>
              ))}
              {data.pomodoroSessions.length === 0 ? (
                <p className="rounded-lg border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
                  Nenhuma sessão de foco ainda.
                </p>
              ) : null}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
