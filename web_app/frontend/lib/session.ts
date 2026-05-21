"use client";

export type SessionUser = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  profile: UserProfile | null;
};

type ApiError = Error & {
  status?: number;
  payload?: unknown;
};

export type UserGoal =
  | "fat_loss"
  | "muscle_gain"
  | "endurance"
  | "wellness"
  | "recomposition";

export type UserSex = "male" | "female" | "other";

export type NutritionRecommendation = {
  label: string;
  value: string;
  note: string;
};

export type DailyWorkout = {
  title: string;
  focus: string;
  duration: string;
  intensity: string;
  blocks: string[];
};

export type UserProfile = {
  sex: UserSex;
  sex_label: string;
  age: number;
  height_cm: string;
  weight_kg: string;
  goal: UserGoal;
  goal_label: string;
  nutrition_recommendations: NutritionRecommendation[];
  daily_workout: DailyWorkout;
};

export type RegistrationPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type AssessmentPayload = {
  sex: UserSex;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: UserGoal;
};

type TokenPayload = {
  access?: string;
  refresh?: string;
};

type RefreshPayload = {
  access?: string;
};

type WorkoutCompletionPayload = {
  workout_slug: string;
  completed_count: number;
  last_completed_at: string;
};

type ScheduleBookingPayload = {
  slot_id: number;
  booking_id: number;
  created: boolean;
  is_booked: boolean;
  message: string;
};

const ACCESS_KEY = "access";
const REFRESH_KEY = "refresh";
const USER_KEY = "me";

const RAW_API_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE
    ? process.env.NEXT_PUBLIC_API_BASE.replace(/\/$/, "")
    : "/api";

export class SessionError extends Error {
  code: "AUTH_REQUIRED" | "SESSION_EXPIRED";

  constructor(code: "AUTH_REQUIRED" | "SESSION_EXPIRED", message: string) {
    super(message);
    this.code = code;
  }
}

function hasStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function getApiBase() {
  if (typeof window === "undefined") {
    return RAW_API_BASE;
  }

  if (!/^https?:\/\//.test(RAW_API_BASE)) {
    return RAW_API_BASE;
  }

  try {
    const configuredUrl = new URL(RAW_API_BASE);
    const currentHost = window.location.hostname;
    const localHosts = new Set(["localhost", "127.0.0.1"]);

    if (
      localHosts.has(configuredUrl.hostname) &&
      localHosts.has(currentHost)
    ) {
      return configuredUrl.pathname || "/api";
    }
  } catch {
    return RAW_API_BASE;
  }

  return RAW_API_BASE;
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (Array.isArray(payload)) {
    const [firstItem] = payload;
    return getErrorMessage(firstItem, fallback);
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    for (const key of ["detail", "error", "message", "non_field_errors"]) {
      if (key in record) {
        const message = getErrorMessage(record[key], fallback);
        if (message !== fallback) {
          return message;
        }
      }
    }

    for (const value of Object.values(record)) {
      const message = getErrorMessage(value, fallback);
      if (message !== fallback) {
        return message;
      }
    }
  }

  return fallback;
}

async function fetchJson(input: RequestInfo, init?: RequestInit): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(input, init);
  } catch (error) {
    const networkError = new Error(
      "Не удалось связаться с сервером. Проверьте, что backend запущен, и попробуйте еще раз."
    ) as ApiError;
    networkError.status = 0;
    networkError.payload = error;
    throw networkError;
  }

  const text = await response.text();
  let data: unknown;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message = getErrorMessage(data, response.statusText || "Request failed");
    const error = new Error(message || "Request failed") as ApiError;
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export function getStoredUser(): SessionUser | null {
  if (!hasStorage()) {
    return null;
  }

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function getStoredTokens() {
  if (!hasStorage()) {
    return { access: null, refresh: null };
  }

  return {
    access: localStorage.getItem(ACCESS_KEY),
    refresh: localStorage.getItem(REFRESH_KEY),
  };
}

export function getDisplayName(user: SessionUser | null) {
  if (!user) {
    return "Участник клуба";
  }

  const fullName = user.full_name?.trim();
  return fullName || user.email;
}

function persistTokens(access: string, refresh: string) {
  if (!hasStorage()) {
    return;
  }

  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearSession() {
  if (!hasStorage()) {
    return;
  }

  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

function persistUser(user: SessionUser) {
  if (!hasStorage()) {
    return;
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

async function authorizedFetchJson(access: string, path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${access}`);

  return fetchJson(`${getApiBase()}${path}`, {
    ...init,
    headers,
  });
}

export async function fetchSessionUser(access: string): Promise<SessionUser> {
  return (await fetchJson(`${getApiBase()}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access}`,
    },
  })) as SessionUser;
}

export async function refreshAccessToken(refresh: string): Promise<string> {
  const data = (await fetchJson(`${getApiBase()}/auth/token/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  })) as RefreshPayload;

  if (!data.access) {
    throw new SessionError("SESSION_EXPIRED", "Не удалось обновить доступ к кабинету.");
  }

  if (hasStorage()) {
    localStorage.setItem(ACCESS_KEY, data.access);
  }

  return data.access;
}

export async function ensureAccessToken(): Promise<string> {
  const { access, refresh } = getStoredTokens();

  if (access) {
    return access;
  }

  if (!refresh) {
    throw new SessionError("AUTH_REQUIRED", "Сначала войдите в аккаунт.");
  }

  return refreshAccessToken(refresh);
}

export async function ensureSessionUser(): Promise<SessionUser> {
  const { refresh } = getStoredTokens();
  const nextAccess = await ensureAccessToken();

  try {
    const user = await fetchSessionUser(nextAccess);
    persistUser(user);
    return user;
  } catch (error) {
    if (!refresh) {
      throw error;
    }

    const refreshedAccess = await refreshAccessToken(refresh);
    const user = await fetchSessionUser(refreshedAccess);
    persistUser(user);
    return user;
  }
}

export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<SessionUser> {
  const normalizedEmail = email.trim().toLowerCase();
  const data = (await fetchJson(`${getApiBase()}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: normalizedEmail, password }),
  })) as TokenPayload;

  if (!data.access || !data.refresh) {
    throw new Error("Не удалось получить токены доступа.");
  }

  persistTokens(data.access, data.refresh);
  const user = await fetchSessionUser(data.access);
  persistUser(user);
  return user;
}

export async function loginWithGoogleCredential(idToken: string): Promise<SessionUser> {
  const data = (await fetchJson(`${getApiBase()}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
  })) as TokenPayload;

  if (!data.access || !data.refresh) {
    throw new Error("Не удалось получить токены доступа через Google.");
  }

  persistTokens(data.access, data.refresh);
  const user = await fetchSessionUser(data.access);
  persistUser(user);
  return user;
}

export async function registerWithCredentials(payload: RegistrationPayload): Promise<SessionUser> {
  const normalizedEmail = payload.email.trim().toLowerCase();

  await fetchJson(`${getApiBase()}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: normalizedEmail,
      full_name: payload.fullName.trim(),
      password: payload.password,
    }),
  });

  return loginWithCredentials(normalizedEmail, payload.password);
}

export async function fetchSessionJson(path: string, init?: RequestInit): Promise<unknown> {
  const { refresh } = getStoredTokens();
  let access = await ensureAccessToken();

  try {
    return await authorizedFetchJson(access, path, init);
  } catch (error) {
    const apiError = error as ApiError;

    if (apiError.status !== 401 || !refresh) {
      throw error;
    }

    access = await refreshAccessToken(refresh);
    return authorizedFetchJson(access, path, init);
  }
}

export async function saveAssessment(payload: AssessmentPayload): Promise<SessionUser> {
  await fetchSessionJson("/auth/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sex: payload.sex,
      age: payload.age,
      height_cm: payload.heightCm.toFixed(1),
      weight_kg: payload.weightKg.toFixed(1),
      goal: payload.goal,
    }),
  });

  return ensureSessionUser();
}

export async function completeWorkoutSession(
  workoutSlug: string,
  elapsedSeconds: number,
): Promise<WorkoutCompletionPayload> {
  return (await fetchSessionJson("/workouts/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workout_slug: workoutSlug,
      elapsed_seconds: Math.max(1, Math.floor(elapsedSeconds)),
    }),
  })) as WorkoutCompletionPayload;
}

export async function bookScheduleSlot(slotId: number): Promise<ScheduleBookingPayload> {
  return (await fetchSessionJson("/schedule/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slot_id: slotId }),
  })) as ScheduleBookingPayload;
}
