"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatCard } from "@/components/ui/stat-card";
import { weekdayShortLabels } from "@/lib/date";
import { activityLabels, storageModeLabels } from "@/lib/labels";
import { cn } from "@/lib/cn";
import { useLifeFlow } from "@/hooks/use-lifeflow";

export function ProfileScreen() {
  const {
    data,
    levelInfo,
    streak,
    badges,
    storageMode,
    isFirebaseEnabled,
    updateProfileName,
    removeRoutineItem,
    logout,
  } = useLifeFlow();
  const [name, setName] = useState(data?.profile.name ?? "");

  if (!data) {
    return null;
  }

  async function handleNameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim()) {
      await updateProfileName(name.trim());
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Sua conta, mapa de rotina, conquistas e modo de armazenamento."
        eyebrow="Perfil"
        title={data.profile.name}
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard helper={`Faltam ${levelInfo.xpToNextLevel} XP para o próximo nível`} label="Nível" tone="green" value={levelInfo.level} />
        <StatCard helper="Total ganho" label="XP" tone="cyan" value={data.profile.xp} />
        <StatCard helper="Dias agendados completos" label="Sequência" tone="gold" value={streak} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="card p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Conta</h2>
            <p className="text-sm text-[#aeb7c2]">{data.profile.email}</p>
          </div>

          <form className="space-y-3" onSubmit={handleNameSubmit}>
            <label className="block space-y-2 text-sm">
              <span className="text-[#aeb7c2]">Nome de exibição</span>
              <input
                className="input"
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
            </label>
            <Button className="w-full" type="submit">
              Salvar perfil
            </Button>
          </form>

          <div className="mt-5 space-y-3 rounded-lg border border-[var(--border)] bg-white/[0.03] p-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[#aeb7c2]">Armazenamento</span>
              <span className="font-semibold">{storageModeLabels[storageMode]}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[#aeb7c2]">Configuração do Firebase</span>
              <span className={cn("font-semibold", isFirebaseEnabled ? "text-emerald-200" : "text-amber-200")}>
                {isFirebaseEnabled ? "Ativa" : "Variáveis ausentes"}
              </span>
            </div>
          </div>

          <Button className="mt-5 w-full" onClick={logout} variant="danger">
            Sair
          </Button>
        </article>

        <article className="card p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Progresso de nível</h2>
            <p className="text-sm text-[#aeb7c2]">A cada 100 XP, você sobe de nível.</p>
          </div>
          <ProgressBar label={`Nível ${levelInfo.level}`} tone="green" value={levelInfo.progress} />

          <div className="mt-6">
            <h2 className="mb-3 text-lg font-bold">Conquistas</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {badges.map((badge) => (
                <div
                  className={cn(
                    "rounded-lg border p-3",
                    badge.earned
                      ? "border-violet-300/28 bg-violet-400/12 text-white"
                      : "border-[var(--border)] bg-white/[0.03] text-[var(--muted)]",
                  )}
                  key={badge.id}
                >
                  <p className="font-semibold">{badge.title}</p>
                  <p className="mt-1 text-xs">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="card p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold">Rotina semanal</h2>
          <p className="text-sm text-[#aeb7c2]">Remova hábitos que não pertencem mais ao plano.</p>
        </div>

        <div className="grid gap-3">
          {data.routineItems.map((item) => (
            <div
              className="rounded-lg border border-[var(--border)] bg-white/[0.03] p-3"
              key={item.id}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-[#aeb7c2]">{activityLabels[item.type]}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex flex-wrap gap-1">
                    {weekdayShortLabels.map((label, index) => (
                      <span
                        className={cn(
                          "chip min-w-10",
                          item.weekdays.includes(index)
                            ? "border-violet-300/40 bg-violet-400/14 text-violet-100"
                            : "opacity-45",
                        )}
                        key={label}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  <Button onClick={() => removeRoutineItem(item.id)} variant="danger">
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {data.routineItems.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
              Nenhuma atividade de rotina ainda.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
