export type ActivityType =
  | "gym"
  | "martial_arts"
  | "running"
  | "sports"
  | "study"
  | "reading"
  | "sleep"
  | "water"
  | "custom";

export type Difficulty = "easy" | "medium" | "hard";

export type DayStatus = "complete" | "partial" | "missed" | "rest";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineItem {
  id: string;
  userId: string;
  title: string;
  type: ActivityType;
  weekdays: number[];
  time?: string;
  active: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  routineItemId: string;
  type: ActivityType;
  title: string;
  date: string;
  weekday: number;
  completed: boolean;
  completedAt?: string;
  xpValue: number;
  xpAwarded: number;
}

export interface StudyTopic {
  id: string;
  userId: string;
  title: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  lastStudiedAt?: string;
  createdAt: string;
}

export interface PomodoroSession {
  id: string;
  userId: string;
  topicId: string;
  topicTitle: string;
  durationMinutes: number;
  completedAt: string;
  xpEarned: number;
}

export interface LifeFlowData {
  profile: UserProfile;
  routineItems: RoutineItem[];
  activities: ActivityLog[];
  studyTopics: StudyTopic[];
  pomodoroSessions: PomodoroSession[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  earned: boolean;
}

export interface DailySummary {
  date: string;
  scheduled: number;
  completed: number;
  percentage: number;
  status: DayStatus;
}
