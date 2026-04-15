"use client";

import { Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";

interface PomodoroTimerProps {
  secondsLeft: number;
  durationMinutes: number;
  isRunning: boolean;
  topicTitle?: string;
  disabled?: boolean;
  onToggle: () => void;
  onReset: () => void;
  onFinish: () => void;
}

export function PomodoroTimer({
  secondsLeft,
  durationMinutes,
  isRunning,
  topicTitle,
  disabled,
  onToggle,
  onReset,
  onFinish,
}: PomodoroTimerProps) {
  const totalSeconds = durationMinutes * 60;
  const progress = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);

  return (
    <article className="card p-5 sm:p-6">
      <div className="mx-auto flex max-w-sm flex-col items-center text-center">
        <div className="grid aspect-square w-full max-w-[300px] place-items-center rounded-lg border border-[color-mix(in_srgb,var(--primary)_32%,transparent)] bg-[var(--primary-soft)]">
          <div>
            <p className="text-6xl font-black tabular-nums sm:text-7xl">{formatSeconds(secondsLeft)}</p>
            <p className="mt-2 px-4 text-sm text-[var(--muted)]">
              {topicTitle ?? "Selecione um tópico"}
            </p>
          </div>
        </div>

        <div className="mt-5 w-full">
          <ProgressBar label="Progresso da sessão" tone="cyan" value={progress} />
        </div>

        <div className="mt-5 grid w-full grid-cols-2 gap-2">
          <Button disabled={disabled} onClick={onToggle}>
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? "Pausar" : "Iniciar"}
          </Button>
          <Button onClick={onReset} variant="secondary">
            <RotateCcw className="h-4 w-4" />
            Reiniciar
          </Button>
          <Button className="col-span-2" disabled={disabled} onClick={onFinish} variant="secondary">
            Concluir agora
          </Button>
        </div>
      </div>
    </article>
  );
}

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
