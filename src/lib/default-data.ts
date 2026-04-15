import { toDateKey } from "@/lib/date";
import type { LifeFlowData, RoutineItem, StudyTopic, UserProfile } from "@/lib/types";

function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function createProfile(name: string, email: string, idOverride?: string): UserProfile {
  const now = new Date().toISOString();

  return {
    id: idOverride ?? id("user"),
    name,
    email,
    xp: 0,
    level: 1,
    streak: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function createDefaultData(profile: UserProfile): LifeFlowData {
  const createdAt = new Date().toISOString();

  const routineItems: RoutineItem[] = [
    {
      id: id("routine"),
      userId: profile.id,
      title: "Treino de força",
      type: "gym",
      weekdays: [1, 3, 5],
      time: "07:00",
      active: true,
      createdAt,
    },
    {
      id: id("routine"),
      userId: profile.id,
      title: "Aula de artes marciais",
      type: "martial_arts",
      weekdays: [2, 4],
      time: "19:30",
      active: true,
      createdAt,
    },
    {
      id: id("routine"),
      userId: profile.id,
      title: "Corrida leve",
      type: "running",
      weekdays: [6],
      time: "08:00",
      active: true,
      createdAt,
    },
    {
      id: id("routine"),
      userId: profile.id,
      title: "Bloco de estudo focado",
      type: "study",
      weekdays: [1, 2, 3, 4, 5],
      time: "20:00",
      active: true,
      createdAt,
    },
    {
      id: id("routine"),
      userId: profile.id,
      title: "Leitura curta",
      type: "reading",
      weekdays: [0, 2, 4],
      time: "22:00",
      active: true,
      createdAt,
    },
    {
      id: id("routine"),
      userId: profile.id,
      title: "Água e sono",
      type: "water",
      weekdays: [0, 1, 2, 3, 4, 5, 6],
      active: true,
      createdAt,
    },
  ];

  const studyTopics: StudyTopic[] = [
    {
      id: id("topic"),
      userId: profile.id,
      title: "Estruturas de dados",
      difficulty: "hard",
      estimatedMinutes: 50,
      createdAt,
    },
    {
      id: id("topic"),
      userId: profile.id,
      title: "Sistemas operacionais",
      difficulty: "medium",
      estimatedMinutes: 40,
      createdAt,
    },
    {
      id: id("topic"),
      userId: profile.id,
      title: "Modelagem de banco de dados",
      difficulty: "medium",
      estimatedMinutes: 35,
      lastStudiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
      createdAt,
    },
    {
      id: id("topic"),
      userId: profile.id,
      title: "Anotações de código limpo",
      difficulty: "easy",
      estimatedMinutes: 25,
      lastStudiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      createdAt,
    },
  ];

  return {
    profile,
    routineItems,
    activities: [],
    studyTopics,
    pomodoroSessions: [],
  };
}

export function makeActivityId(routineItemId: string, date = toDateKey()) {
  return `activity-${routineItemId}-${date}`;
}

export function makeId(prefix: string) {
  return id(prefix);
}
