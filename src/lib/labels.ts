import type { ActivityType, DayStatus, Difficulty } from "@/lib/types";

export const activityLabels: Record<ActivityType, string> = {
  gym: "Academia",
  martial_arts: "Artes marciais",
  running: "Corrida",
  sports: "Esportes",
  study: "Estudo",
  custom: "Personalizada",
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
