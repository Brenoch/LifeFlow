"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateFirebaseProfile,
  type User,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { fromDateKey, toDateKey } from "@/lib/date";
import { createDefaultData, createProfile, makeActivityId, makeId } from "@/lib/default-data";
import { firebaseAuth, firebaseDb, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import {
  clearLocalSession,
  loadLocalData,
  loadLocalSession,
  saveLocalData,
  saveLocalSession,
} from "@/lib/local-store";
import {
  calculateCurrentStreak,
  getActivityForRoutine,
  getActivityXp,
  getBadges,
  getDailySummary,
  getLevelInfo,
  suggestStudyTopic,
} from "@/lib/smart-logic";
import type {
  ActivityLog,
  ActivityType,
  Difficulty,
  LifeFlowData,
  RoutineItem,
  StudyTopic,
} from "@/lib/types";

type StorageMode = "local" | "firebase";

interface RoutineInput {
  title: string;
  type: ActivityType;
  weekdays: number[];
  time?: string;
}

interface StudyTopicInput {
  title: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
}

interface LifeFlowContextValue {
  data: LifeFlowData | null;
  isReady: boolean;
  isFirebaseEnabled: boolean;
  storageMode: StorageMode;
  syncError: string | null;
  levelInfo: ReturnType<typeof getLevelInfo>;
  streak: number;
  todaySummary: ReturnType<typeof getDailySummary> | null;
  suggestedTopic?: StudyTopic;
  badges: ReturnType<typeof getBadges>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
  addRoutineItem: (input: RoutineInput) => void;
  removeRoutineItem: (id: string) => void;
  setActivityStatus: (routineItemId: string, completed: boolean, dateKey?: string) => void;
  addStudyTopic: (input: StudyTopicInput) => void;
  updateStudyTopic: (id: string, input: StudyTopicInput) => void;
  removeStudyTopic: (id: string) => void;
  completeStudySession: (topicId: string, durationMinutes: number) => void;
}

export const LifeFlowContext = createContext<LifeFlowContextValue | undefined>(undefined);

export function LifeFlowProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LifeFlowData | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [storageMode, setStorageMode] = useState<StorageMode>(
    isFirebaseConfigured ? "firebase" : "local",
  );
  const [syncError, setSyncError] = useState<string | null>(null);

  const dataRef = useRef<LifeFlowData | null>(null);
  const storageModeRef = useRef<StorageMode>(storageMode);
  const authActionInProgressRef = useRef(false);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    storageModeRef.current = storageMode;
  }, [storageMode]);

  const applyRemoteUserData = useCallback(async (user: User, preferredName?: string) => {
    const cachedData = loadLocalData(user.uid);

    if (cachedData) {
      dataRef.current = cachedData;
      storageModeRef.current = "firebase";
      setStorageMode("firebase");
      setData(cachedData);
      setIsReady(true);
      setSyncError(null);

      void loadRemoteData(user, preferredName)
        .then((loadedData) => {
          dataRef.current = loadedData;
          setData(loadedData);
          saveLocalSession(loadedData.profile);
          saveLocalData(loadedData);
          setSyncError(null);
        })
        .catch((error) => {
          console.error("Erro ao atualizar cache com dados do Firebase", error);
          setSyncError(getFirebaseDataErrorMessage(error));
        });

      return cachedData;
    }

    setIsReady(false);
    setSyncError(null);

    try {
      const loadedData = await loadRemoteData(user, preferredName);
      dataRef.current = loadedData;
      storageModeRef.current = "firebase";
      setStorageMode("firebase");
      setData(loadedData);
      saveLocalSession(loadedData.profile);
      saveLocalData(loadedData);
      return loadedData;
    } catch (error) {
      console.error("Erro ao carregar dados do Firebase", error);
      const profile = createRemoteProfile(user, preferredName);
      const fallbackData = createDefaultData(profile);

      dataRef.current = fallbackData;
      storageModeRef.current = "firebase";
      setStorageMode("firebase");
      setData(fallbackData);
      setSyncError(getFirebaseDataErrorMessage(error));
      return fallbackData;
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (firebaseAuth && firebaseDb) {
      return onAuthStateChanged(firebaseAuth, async (user) => {
        if (authActionInProgressRef.current) {
          return;
        }

        setSyncError(null);

        if (!user) {
          dataRef.current = null;
          setData(null);
          setIsReady(true);
          return;
        }

        await applyRemoteUserData(user);
      });
    }

    const session = loadLocalSession();

    if (session) {
      const profile = createProfile(session.name, session.email, session.id);
      const loadedData = loadLocalData(session.id) ?? createDefaultData(profile);
      dataRef.current = loadedData;
      setData(loadedData);
      saveLocalData(loadedData);
    }

    setStorageMode("local");
    setIsReady(true);
  }, [applyRemoteUserData]);

  const persistData = useCallback(async (nextData: LifeFlowData) => {
    if (storageModeRef.current === "firebase") {
      saveLocalSession(nextData.profile);
      saveLocalData(nextData);

      try {
        await saveRemoteData(nextData);
        setSyncError(null);
      } catch (error) {
        console.error("Erro ao salvar dados no Firebase", error);
        setSyncError("Não foi possível salvar no Firebase. Verifique sua conexão e permissões.");
      }
      return;
    }

    saveLocalSession(nextData.profile);
    saveLocalData(nextData);
  }, []);

  const commit = useCallback(
    (updater: (current: LifeFlowData) => LifeFlowData) => {
      const current = dataRef.current;

      if (!current) {
        return;
      }

      const nextData = withProfileStats(updater(current));
      dataRef.current = nextData;
      setData(nextData);
      void persistData(nextData);
    },
    [persistData],
  );

  const login = useCallback(async (email: string, password: string) => {
    if (firebaseAuth) {
      authActionInProgressRef.current = true;
      try {
        const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        await applyRemoteUserData(credential.user);
      } finally {
        authActionInProgressRef.current = false;
      }
      return;
    }

    const profile = createProfile(email.split("@")[0] || "Usuário LifeFlow", email, localUserId(email));
    const nextData = loadLocalData(profile.id) ?? createDefaultData(profile);
    dataRef.current = nextData;
    storageModeRef.current = "local";
    setStorageMode("local");
    setSyncError(null);
    setData(nextData);
    saveLocalSession(nextData.profile);
    saveLocalData(nextData);
  }, [applyRemoteUserData]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    if (firebaseAuth) {
      authActionInProgressRef.current = true;
      try {
        const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        await updateFirebaseProfile(credential.user, { displayName: name });
        const nextData = createDefaultData(createRemoteProfile(credential.user, name));

        dataRef.current = nextData;
        storageModeRef.current = "firebase";
        setStorageMode("firebase");
        setSyncError(null);
        setData(nextData);
        setIsReady(true);
        saveLocalSession(nextData.profile);
        saveLocalData(nextData);

        void saveRemoteData(nextData)
          .then(() => setSyncError(null))
          .catch((error) => {
            console.error("Erro ao criar dados iniciais no Firebase", error);
            setSyncError(getFirebaseDataErrorMessage(error));
          });
      } finally {
        authActionInProgressRef.current = false;
      }
      return;
    }

    const profile = createProfile(name, email, localUserId(email));
    const nextData = createDefaultData(profile);
    dataRef.current = nextData;
    storageModeRef.current = "local";
    setStorageMode("local");
    setSyncError(null);
    setData(nextData);
    saveLocalSession(profile);
    saveLocalData(nextData);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    if (!firebaseAuth || !googleProvider) {
      throw new Error("O login com Google precisa das variáveis de ambiente do Firebase.");
    }

    authActionInProgressRef.current = true;
    try {
      const credential = await signInWithPopup(firebaseAuth, googleProvider);
      await applyRemoteUserData(credential.user);
    } finally {
      authActionInProgressRef.current = false;
    }
  }, [applyRemoteUserData]);

  const logout = useCallback(async () => {
    if (firebaseAuth) {
      await signOut(firebaseAuth);
    }

    clearLocalSession();
    dataRef.current = null;
    setData(null);
  }, []);

  const updateProfileName = useCallback(
    async (name: string) => {
      commit((current) => ({
        ...current,
        profile: {
          ...current.profile,
          name,
        },
      }));

      if (firebaseAuth?.currentUser) {
        await updateFirebaseProfile(firebaseAuth.currentUser, { displayName: name });
      }
    },
    [commit],
  );

  const addRoutineItem = useCallback(
    (input: RoutineInput) => {
      commit((current) => ({
        ...current,
        routineItems: [
          ...current.routineItems,
          {
            id: makeId("routine"),
            userId: current.profile.id,
            title: input.title,
            type: input.type,
            weekdays: input.weekdays.length > 0 ? input.weekdays : [new Date().getDay()],
            time: input.time,
            active: true,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [commit],
  );

  const removeRoutineItem = useCallback(
    (id: string) => {
      commit((current) => ({
        ...current,
        routineItems: current.routineItems.filter((item) => item.id !== id),
        activities: current.activities.filter((activity) => activity.routineItemId !== id),
      }));
      void deleteRemoteDocument("routine_items", id);
    },
    [commit],
  );

  const setActivityStatus = useCallback(
    (routineItemId: string, completed: boolean, dateKey = toDateKey()) => {
      commit((current) => {
        const item = current.routineItems.find((routine) => routine.id === routineItemId);

        if (!item) {
          return current;
        }

        const existingActivity = getActivityForRoutine(
          current.activities,
          routineItemId,
          dateKey,
        );
        const xpAwarded = completed ? getActivityXp(item.type) : 0;
        const xpDelta = xpAwarded - (existingActivity?.xpAwarded ?? 0);
        const weekday = fromDateKey(dateKey).getDay();
        const nextActivity: ActivityLog = {
          id: existingActivity?.id ?? makeActivityId(routineItemId, dateKey),
          userId: current.profile.id,
          routineItemId,
          type: item.type,
          title: item.title,
          date: dateKey,
          weekday,
          completed,
          xpValue: getActivityXp(item.type),
          xpAwarded,
          ...(completed ? { completedAt: new Date().toISOString() } : {}),
        };
        const nextActivities = existingActivity
          ? current.activities.map((activity) =>
              activity.id === existingActivity.id ? nextActivity : activity,
            )
          : [...current.activities, nextActivity];

        return {
          ...current,
          profile: {
            ...current.profile,
            xp: Math.max(0, current.profile.xp + xpDelta),
          },
          activities: nextActivities,
        };
      });
    },
    [commit],
  );

  const addStudyTopic = useCallback(
    (input: StudyTopicInput) => {
      commit((current) => ({
        ...current,
        studyTopics: [
          ...current.studyTopics,
          {
            id: makeId("topic"),
            userId: current.profile.id,
            title: input.title,
            difficulty: input.difficulty,
            estimatedMinutes: input.estimatedMinutes,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [commit],
  );

  const updateStudyTopic = useCallback(
    (id: string, input: StudyTopicInput) => {
      commit((current) => ({
        ...current,
        studyTopics: current.studyTopics.map((topic) =>
          topic.id === id ? { ...topic, ...input } : topic,
        ),
      }));
    },
    [commit],
  );

  const removeStudyTopic = useCallback(
    (id: string) => {
      commit((current) => ({
        ...current,
        studyTopics: current.studyTopics.filter((topic) => topic.id !== id),
        pomodoroSessions: current.pomodoroSessions.filter((session) => session.topicId !== id),
      }));
      void deleteRemoteDocument("study_topics", id);
    },
    [commit],
  );

  const completeStudySession = useCallback(
    (topicId: string, durationMinutes: number) => {
      commit((current) => {
        const topic = current.studyTopics.find((item) => item.id === topicId);

        if (!topic) {
          return current;
        }

        const completedAt = new Date().toISOString();

        return {
          ...current,
          profile: {
            ...current.profile,
            xp: current.profile.xp + 15,
          },
          studyTopics: current.studyTopics.map((item) =>
            item.id === topicId ? { ...item, lastStudiedAt: completedAt } : item,
          ),
          pomodoroSessions: [
            ...current.pomodoroSessions,
            {
              id: makeId("pomodoro"),
              userId: current.profile.id,
              topicId,
              topicTitle: topic.title,
              durationMinutes,
              completedAt,
              xpEarned: 15,
            },
          ],
        };
      });
    },
    [commit],
  );

  const value = useMemo<LifeFlowContextValue>(() => {
    const levelInfo = getLevelInfo(data?.profile.xp ?? 0);

    return {
      data,
      isReady,
      isFirebaseEnabled: isFirebaseConfigured,
      storageMode,
      syncError,
      levelInfo,
      streak: data ? calculateCurrentStreak(data) : 0,
      todaySummary: data ? getDailySummary(data, toDateKey()) : null,
      suggestedTopic: data ? suggestStudyTopic(data) : undefined,
      badges: data ? getBadges(data) : [],
      login,
      register,
      loginWithGoogle,
      logout,
      updateProfileName,
      addRoutineItem,
      removeRoutineItem,
      setActivityStatus,
      addStudyTopic,
      updateStudyTopic,
      removeStudyTopic,
      completeStudySession,
    };
  }, [
    addRoutineItem,
    addStudyTopic,
    completeStudySession,
    data,
    isReady,
    login,
    loginWithGoogle,
    logout,
    register,
    removeRoutineItem,
    removeStudyTopic,
    setActivityStatus,
    storageMode,
    syncError,
    updateProfileName,
    updateStudyTopic,
  ]);

  return <LifeFlowContext.Provider value={value}>{children}</LifeFlowContext.Provider>;
}

function localUserId(email: string) {
  return `local-${email.trim().toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
}

function withProfileStats(data: LifeFlowData): LifeFlowData {
  const levelInfo = getLevelInfo(data.profile.xp);

  return {
    ...data,
    profile: {
      ...data.profile,
      level: levelInfo.level,
      streak: calculateCurrentStreak(data),
      updatedAt: new Date().toISOString(),
    },
  };
}

function createRemoteProfile(user: User, preferredName?: string) {
  return createProfile(
    preferredName ?? user.displayName ?? user.email?.split("@")[0] ?? "Usuário LifeFlow",
    user.email ?? "",
    user.uid,
  );
}

function getFirebaseDataErrorMessage(error: unknown) {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

  if (code.includes("permission-denied")) {
    return "Login feito, mas o Firestore bloqueou seus dados. Confira se as regras foram publicadas e se o banco é Firestore.";
  }

  if (code.includes("unavailable")) {
    return "Login feito, mas o Firestore está indisponível agora. Seus dados ficam na tela e serão salvos quando a conexão permitir.";
  }

  return "Login feito, mas não foi possível sincronizar com o Firestore. Confira as regras, o projeto Firebase e o console do navegador.";
}

async function loadRemoteData(user: User, preferredName?: string): Promise<LifeFlowData> {
  const db = firebaseDb;

  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const profileSnapshot = await getDoc(doc(db, "users", user.uid));
  const profile = profileSnapshot.exists()
    ? (profileSnapshot.data() as LifeFlowData["profile"])
    : createRemoteProfile(user, preferredName);

  const [routineItems, activities, studyTopics, pomodoroSessions] = await Promise.all([
    loadRemoteCollection<RoutineItem>("routine_items", user.uid),
    loadRemoteCollection<ActivityLog>("activities", user.uid),
    loadRemoteCollection<StudyTopic>("study_topics", user.uid),
    loadRemoteCollection<LifeFlowData["pomodoroSessions"][number]>("pomodoro_sessions", user.uid),
  ]);

  const loadedData: LifeFlowData = {
    profile,
    routineItems,
    activities,
    studyTopics,
    pomodoroSessions,
  };

  if (routineItems.length === 0 && studyTopics.length === 0) {
    const seededData = createDefaultData(profile);
    void saveRemoteData(seededData).catch((error) => {
      console.error("Erro ao salvar dados iniciais no Firebase", error);
    });
    return seededData;
  }

  await setDoc(doc(db, "users", profile.id), profile, { merge: true });
  return loadedData;
}

async function loadRemoteCollection<T>(collectionName: string, userId: string) {
  const db = firebaseDb;

  if (!db) {
    return [];
  }

  const snapshot = await getDocs(
    query(collection(db, collectionName), where("userId", "==", userId)),
  );

  return snapshot.docs.map((item) => item.data() as T);
}

async function saveRemoteData(data: LifeFlowData) {
  const db = firebaseDb;

  if (!db) {
    return;
  }

  const writes = [
    setDoc(doc(db, "users", data.profile.id), data.profile, { merge: true }),
    ...data.routineItems.map((item) =>
      setDoc(doc(db, "routine_items", item.id), item, { merge: true }),
    ),
    ...data.activities.map((item) =>
      setDoc(doc(db, "activities", item.id), item, { merge: true }),
    ),
    ...data.studyTopics.map((item) =>
      setDoc(doc(db, "study_topics", item.id), item, { merge: true }),
    ),
    ...data.pomodoroSessions.map((item) =>
      setDoc(doc(db, "pomodoro_sessions", item.id), item, { merge: true }),
    ),
  ];

  await Promise.all(writes);
}

async function deleteRemoteDocument(collectionName: string, id: string) {
  const db = firebaseDb;

  if (!db || storageUnavailableInClient()) {
    return;
  }

  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    console.error("Erro ao remover documento remoto", error);
  }
}

function storageUnavailableInClient() {
  return typeof window === "undefined";
}
