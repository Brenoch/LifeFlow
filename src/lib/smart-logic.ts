import { addDays, fromDateKey, toDateKey } from "@/lib/date";
import type {
  ActivityLog,
  Badge,
  DailySummary,
  Difficulty,
  LifeFlowData,
  RoutineItem,
  StudyTopic,
} from "@/lib/types";

const difficultyWeight: Record<Difficulty, number> = {
  easy: 1,
  medium: 1.25,
  hard: 1.55,
};

export function getActivityXp(type: RoutineItem["type"]) {
  return type === "study" || type === "reading" ? 15 : 10;
}

export function getLevelInfo(xp: number) {
  return {
    level: Math.floor(xp / 100) + 1,
    xpInLevel: xp % 100,
    xpToNextLevel: 100 - (xp % 100),
    progress: xp % 100,
  };
}

export function getScheduledItemsForDate(data: LifeFlowData, dateKey: string) {
  const weekday = fromDateKey(dateKey).getDay();

  return data.routineItems.filter(
    (item) => item.active && item.weekdays.includes(weekday),
  );
}

export function getActivityForRoutine(
  activities: ActivityLog[],
  routineItemId: string,
  dateKey: string,
) {
  return activities.find(
    (activity) => activity.routineItemId === routineItemId && activity.date === dateKey,
  );
}

export function getDailySummary(data: LifeFlowData, dateKey: string): DailySummary {
  const scheduledItems = getScheduledItemsForDate(data, dateKey);
  const completed = scheduledItems.filter((item) => {
    const activity = getActivityForRoutine(data.activities, item.id, dateKey);
    return activity?.completed;
  }).length;
  const percentage =
    scheduledItems.length === 0 ? 0 : Math.round((completed / scheduledItems.length) * 100);

  let status: DailySummary["status"] = "rest";

  if (scheduledItems.length > 0 && completed === scheduledItems.length) {
    status = "complete";
  } else if (scheduledItems.length > 0 && completed > 0) {
    status = "partial";
  } else if (scheduledItems.length > 0) {
    status = "missed";
  }

  return {
    date: dateKey,
    scheduled: scheduledItems.length,
    completed,
    percentage,
    status,
  };
}

export function calculateCurrentStreak(data: LifeFlowData, fromDate = new Date()) {
  let streak = 0;

  for (let index = 0; index < 120; index += 1) {
    const date = addDays(fromDate, -index);
    const dateKey = toDateKey(date);
    const summary = getDailySummary(data, dateKey);

    if (summary.status === "rest") {
      continue;
    }

    if (summary.status === "complete") {
      streak += 1;
      continue;
    }

    if (dateKey === toDateKey(fromDate)) {
      continue;
    }

    break;
  }

  return streak;
}

export function getWeeklyProgress(data: LifeFlowData, fromDate = new Date()) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(fromDate, index - 6);
    return getDailySummary(data, toDateKey(date));
  });
}

export function getThirtyDayProgress(data: LifeFlowData, fromDate = new Date()) {
  return Array.from({ length: 30 }, (_, index) => {
    const date = addDays(fromDate, index - 29);
    return getDailySummary(data, toDateKey(date));
  });
}

export function suggestStudyTopic(data: LifeFlowData) {
  if (data.studyTopics.length === 0) {
    return undefined;
  }

  const now = Date.now();
  const weekAgo = now - 1000 * 60 * 60 * 24 * 7;
  const recentStudySessions = data.pomodoroSessions.filter(
    (session) => new Date(session.completedAt).getTime() >= weekAgo,
  );
  const lighterDay = recentStudySessions.length < 3;

  return [...data.studyTopics].sort((first, second) => {
    return topicScore(second, now, lighterDay) - topicScore(first, now, lighterDay);
  })[0];
}

function topicScore(topic: StudyTopic, now: number, lighterDay: boolean) {
  const daysSinceStudy = topic.lastStudiedAt
    ? Math.max(1, (now - new Date(topic.lastStudiedAt).getTime()) / (1000 * 60 * 60 * 24))
    : 12;
  const lighterBonus =
    lighterDay && topic.estimatedMinutes <= 35 && topic.difficulty !== "hard" ? 4 : 0;
  const hardDormantBonus = topic.difficulty === "hard" && daysSinceStudy >= 5 ? 3 : 0;
  const longSessionPenalty = topic.estimatedMinutes / 90;

  return (
    daysSinceStudy * difficultyWeight[topic.difficulty] +
    lighterBonus +
    hardDormantBonus -
    longSessionPenalty
  );
}

export function getBadges(data: LifeFlowData): Badge[] {
  const streak = calculateCurrentStreak(data);
  const weeklyProgress = getWeeklyProgress(data);
  const completedWorkouts = data.activities.filter(
    (activity) => activity.completed && activity.type !== "study" && activity.type !== "reading",
  );
  const completedStudy = data.pomodoroSessions.length > 0 || data.activities.some(
    (activity) => activity.completed && (activity.type === "study" || activity.type === "reading"),
  );
  const scheduledWeek = weeklyProgress.filter((day) => day.scheduled > 0);
  const perfectWeek =
    scheduledWeek.length > 0 && scheduledWeek.every((day) => day.status === "complete");
  const totalFocusMinutes = data.pomodoroSessions.reduce(
    (total, session) => total + session.durationMinutes,
    0,
  );

  return [
    {
      id: "first-workout",
      title: "Primeiro treino",
      description: "Conclua qualquer atividade de treino.",
      earned: completedWorkouts.length > 0,
    },
    {
      id: "first-study",
      title: "Primeiro estudo",
      description: "Finalize um Pomodoro ou uma tarefa de estudo.",
      earned: completedStudy,
    },
    {
      id: "first-pomodoro",
      title: "Primeiro Pomodoro",
      description: "Conclua uma sessão de foco.",
      earned: data.pomodoroSessions.length > 0,
    },
    {
      id: "streak-7",
      title: "Sequência de 7 dias",
      description: "Conclua todos os dias agendados por uma semana.",
      earned: streak >= 7,
    },
    {
      id: "streak-30",
      title: "Sequência de 30 dias",
      description: "Conclua todos os dias agendados por um mês.",
      earned: streak >= 30,
    },
    {
      id: "perfect-week",
      title: "Semana perfeita",
      description: "Feche todos os dias planejados.",
      earned: perfectWeek,
    },
    {
      id: "deep-focus",
      title: "Foco total",
      description: "Acumule 300 minutos de estudo.",
      earned: totalFocusMinutes >= 300,
    },
  ];
}

export function getWeeklyStudyMinutes(data: LifeFlowData) {
  const weekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;

  return data.pomodoroSessions
    .filter((session) => new Date(session.completedAt).getTime() >= weekAgo)
    .reduce((total, session) => total + session.durationMinutes, 0);
}

export function getWeeklyWorkoutCount(data: LifeFlowData) {
  const weekAgo = toDateKey(addDays(new Date(), -6));

  return data.activities.filter(
    (activity) =>
      activity.completed &&
      activity.type !== "study" &&
      activity.type !== "reading" &&
      activity.date >= weekAgo,
  ).length;
}
