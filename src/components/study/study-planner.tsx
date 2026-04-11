"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { formatRelativeStudyDate } from "@/lib/date";
import { difficultyLabels } from "@/lib/labels";
import type { Difficulty, StudyTopic } from "@/lib/types";
import { useLifeFlow } from "@/hooks/use-lifeflow";

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

export function StudyPlanner() {
  const {
    data,
    suggestedTopic,
    addStudyTopic,
    updateStudyTopic,
    removeStudyTopic,
    completeStudySession,
  } = useLifeFlow();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);

  if (!data) {
    return null;
  }

  const completedSessions = data.pomodoroSessions.length;
  const totalStudyMinutes = data.pomodoroSessions.reduce(
    (total, session) => total + session.durationMinutes,
    0,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    const input = {
      title: title.trim(),
      difficulty,
      estimatedMinutes: Number(estimatedMinutes),
    };

    if (editingId) {
      updateStudyTopic(editingId, input);
    } else {
      addStudyTopic(input);
    }

    resetForm();
  }

  function startEditing(topic: StudyTopic) {
    setEditingId(topic.id);
    setTitle(topic.title);
    setDifficulty(topic.difficulty);
    setEstimatedMinutes(topic.estimatedMinutes);
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDifficulty("medium");
    setEstimatedMinutes(30);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Escolha o que importa, deixe o espaçamento subir o tópico certo e mantenha a próxima sessão leve o bastante para começar."
        eyebrow="Planejador de estudos"
        title="Fila inteligente de tópicos"
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard helper="Fila ativa" label="Tópicos" tone="cyan" value={data.studyTopics.length} />
        <StatCard helper="Total" label="Sessões" tone="green" value={completedSessions} />
        <StatCard helper="Total" label="Minutos" tone="coral" value={totalStudyMinutes} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="card p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold">
              {editingId ? "Editar tópico" : "Adicionar tópico"}
            </h2>
            <p className="text-sm text-[#aeb7c2]">Dificuldade e tempo guiam a sugestão diária.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2 text-sm">
              <span className="text-[#aeb7c2]">Título</span>
              <input
                className="input"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Algoritmos em grafos"
                value={title}
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="text-[#aeb7c2]">Dificuldade</span>
              <select
                className="input capitalize"
                onChange={(event) => setDifficulty(event.target.value as Difficulty)}
                value={difficulty}
              >
                {difficulties.map((item) => (
                  <option key={item} value={item}>
                    {difficultyLabels[item]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2 text-sm">
              <span className="text-[#aeb7c2]">Minutos estimados</span>
              <input
                className="input"
                min={10}
                onChange={(event) => setEstimatedMinutes(Number(event.target.value))}
                type="number"
                value={estimatedMinutes}
              />
            </label>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button type="submit">{editingId ? "Salvar tópico" : "Adicionar tópico"}</Button>
              <Button onClick={resetForm} variant="secondary">
                Limpar
              </Button>
            </div>
          </form>
        </article>

        <article className="card p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Sugestão de hoje</h2>
              <p className="text-sm text-[#aeb7c2]">Tópicos difíceis mais antigos sobem; sessões leves vencem quando o volume está baixo.</p>
            </div>
            {suggestedTopic ? (
              <span className="chip">{difficultyLabels[suggestedTopic.difficulty]}</span>
            ) : null}
          </div>

          {suggestedTopic ? (
            <div className="rounded-md border border-[#2b2f36] bg-[#111317] p-4">
              <p className="text-2xl font-bold">{suggestedTopic.title}</p>
              <p className="mt-2 text-sm text-[#aeb7c2]">
                {suggestedTopic.estimatedMinutes} min ·{" "}
                {formatRelativeStudyDate(suggestedTopic.lastStudiedAt)}
              </p>
              <Button
                className="mt-4 w-full"
                onClick={() =>
                  completeStudySession(suggestedTopic.id, suggestedTopic.estimatedMinutes)
                }
              >
                Registrar sessão de estudo
              </Button>
            </div>
          ) : (
            <p className="rounded-md border border-dashed border-[#2b2f36] p-4 text-sm text-[#aeb7c2]">
              Adicione um tópico para receber uma sugestão de estudo.
            </p>
          )}
        </article>
      </section>

      <section className="card p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold">Lista de tópicos</h2>
          <p className="text-sm text-[#aeb7c2]">Mantenha a lista curta o bastante para cada item voltar ao ciclo.</p>
        </div>

        <div className="grid gap-3">
          {data.studyTopics.length > 0 ? (
            data.studyTopics.map((topic) => (
              <div
                className="rounded-md border border-[#2b2f36] bg-[#111317] p-3"
                key={topic.id}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{topic.title}</p>
                    <p className="text-xs capitalize text-[#aeb7c2]">
                      {difficultyLabels[topic.difficulty]} · {topic.estimatedMinutes} min ·{" "}
                      {formatRelativeStudyDate(topic.lastStudiedAt)}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:w-[330px]">
                    <Button
                      onClick={() => completeStudySession(topic.id, topic.estimatedMinutes)}
                      variant="primary"
                    >
                      Estudei
                    </Button>
                    <Button onClick={() => startEditing(topic)} variant="secondary">
                      Editar
                    </Button>
                    <Button onClick={() => removeStudyTopic(topic.id)} variant="danger">
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-md border border-dashed border-[#2b2f36] p-4 text-sm text-[#aeb7c2]">
              Nenhum tópico ainda.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
