import type { LifeFlowData, UserProfile } from "@/lib/types";

const sessionKey = "lifeflow.session";
const dataPrefix = "lifeflow.data.";

export interface LocalSession {
  id: string;
  name: string;
  email: string;
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function loadLocalSession(): LocalSession | null {
  if (!canUseStorage()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(sessionKey);
  return rawSession ? (JSON.parse(rawSession) as LocalSession) : null;
}

export function saveLocalSession(profile: UserProfile) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    sessionKey,
    JSON.stringify({
      id: profile.id,
      name: profile.name,
      email: profile.email,
    }),
  );
}

export function clearLocalSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(sessionKey);
}

export function loadLocalData(userId: string): LifeFlowData | null {
  if (!canUseStorage()) {
    return null;
  }

  const rawData = window.localStorage.getItem(`${dataPrefix}${userId}`);
  return rawData ? (JSON.parse(rawData) as LifeFlowData) : null;
}

export function saveLocalData(data: LifeFlowData) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(`${dataPrefix}${data.profile.id}`, JSON.stringify(data));
}
