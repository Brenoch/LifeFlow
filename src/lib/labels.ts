import type { ActivityType, DayStatus, Difficulty } from "@/lib/types";

export const activityLabels: Record<ActivityType, string> = {
  gym: "Academia",
  martial_arts: "Artes marciais",
  running: "Corrida",
  sports: "Esporte",
  study: "Estudo",
  reading: "Leitura",
  sleep: "Sono",
  water: "Água",
  custom: "Personalizada",
};

export const activityShortLabels: Record<ActivityType, string> = {
  gym: "Treino",
  martial_arts: "Luta",
  running: "Run",
  sports: "Sport",
  study: "Estudo",
  reading: "Livro",
  sleep: "Sono",
  water: "Água",
  custom: "Extra",
};

export const difficultyLabels: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Média",
  hard: "Difícil",
};

export const statusLabels: Record<DayStatus, string> = {
  complete: "Completo",
  partial: "Parcial",
  missed: "Perdido",
  rest: "Descanso",
};

export const storageModeLabels = {
  local: "Local",
  firebase: "Firebase",
};
