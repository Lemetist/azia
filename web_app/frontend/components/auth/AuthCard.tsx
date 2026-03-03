"use client";

import { FormEvent, useState } from "react";
import styles from "./auth-card.module.css";

export type AuthMode = "login" | "register";

export type Credentials = {
  fullName?: string;
  email: string;
  password: string;
};

type AuthCardProps = {
  title?: string;
  subtitle?: string;
  defaultMode?: AuthMode;
  // Optional callbacks — if provided, they will be used instead of built-in API calls.
  onLogin?(credentials: Credentials): void | Promise<void>;
  onRegister?(credentials: Credentials): void | Promise<void>;
};

const tabs: Array<{ mode: AuthMode; label: string }> = [
  { mode: "login", label: "Войти" },
  { mode: "register", label: "Регистрация" },
];

// Base API path — uses env var if provided, otherwise assumes proxied "/api"
const API_BASE = typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE
  ? process.env.NEXT_PUBLIC_API_BASE.replace(/\/$/, "")
  : "/api";

function saveTokens(access: string, refresh: string) {
  try {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
  } catch (e) {
    // localStorage may be unavailable in some environments — ignore
  }
}

async function fetchJson(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const message =
      (data && (data.detail || data.error || data.message)) || res.statusText;
    const err: any = new Error(message || "Request failed");
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

export default function AuthCard({
  title = "FIT CENTER",
  subtitle = "Персональные тренировки под ваш ритм и цели",
  defaultMode = "login",
  onLogin,
  onRegister,
}: AuthCardProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Helper: login against backend token endpoint and store tokens
  async function loginViaApi(emailValue: string, passwordValue: string) {
    const body = JSON.stringify({ username: emailValue, password: passwordValue });
    const data = await fetchJson(`${API_BASE}/auth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    // expected response: { access: "...", refresh: "..." }
    if (data.access && data.refresh) {
      saveTokens(data.access, data.refresh);
      // optionally fetch profile
      try {
        const me = await fetchJson(`${API_BASE}/auth/me/`, {
          method: "GET",
          headers: { Authorization: `Bearer ${data.access}` },
        });
        try {
          localStorage.setItem("me", JSON.stringify(me));
        } catch {}
      } catch {
        // ignore profile fetch error
      }
      return data;
    } else {
      throw new Error("Не удалось получить токены");
    }
  }

  // Helper: register against backend, then auto-login
  async function registerViaApi(username: string, passwordValue: string, fullNameValue?: string) {
    // django register expects `username` and `password`
    const body = JSON.stringify({ username, password: passwordValue });
    const data = await fetchJson(`${API_BASE}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    // On success (201) auto-login
    await loginViaApi(username, passwordValue);
    return data;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    const payload: Credentials = {
      fullName: mode === "register" ? fullName.trim() : undefined,
      email: email.trim(),
      password,
    };

    setLoading(true);
    try {
      if (mode === "login") {
        if (onLogin) {
          // delegate to provided handler
          await onLogin(payload);
          setStatus("Добро пожаловать обратно!");
        } else {
          // call API directly
          await loginViaApi(payload.email, payload.password);
          setStatus("Успешный вход");
        }
      } else {
        // register
        if (onRegister) {
          await onRegister(payload);
          setStatus("Аккаунт создан. Проверьте почту для подтверждения.");
        } else {
          await registerViaApi(payload.email, payload.password, payload.fullName);
          setStatus("Аккаунт создан и выполнен вход.");
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Не удалось выполнить операцию";
      setStatus(message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setStatus(null);
  };

  return (
    <article className={styles.card} aria-live="polite">
      <header className={styles.cardHeader}>
        <p className={styles.eyebrow}>
          {mode === "login" ? "возвращайтесь" : "начните сейчас"}
        </p>
        <h2>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </header>

      <nav className={styles.helperRow} aria-label="Переключение форм">
        {tabs.map(({ mode: tabMode, label }) => (
          <button
            key={tabMode}
            type="button"
            onClick={() => switchMode(tabMode)}
            className={
              mode === tabMode ? styles.primaryButton : styles.secondaryButton
            }
            style={{
              flex: "1 1 0",
              borderBottom:
                mode === tabMode ? "3px solid #ff6a3d" : "3px solid transparent",
            }}
            disabled={loading}
          >
            {label}
          </button>
        ))}
      </nav>

      <form className={styles.form} onSubmit={handleSubmit}>
        {mode === "register" && (
          <label className={styles.field}>
            <span className={styles.label}>Имя и фамилия</span>
            <span className={styles.inputShell}>
              <span className={styles.inputIcon} aria-hidden="true">
                👤
              </span>
              <input
                type="text"
                placeholder="Например, Алексей Иванов"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                disabled={loading}
              />
            </span>
          </label>
        )}

        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <span className={styles.inputShell}>
            <span className={styles.inputIcon} aria-hidden="true">
              ✉️
            </span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
            />
          </span>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Пароль</span>
          <span className={styles.inputShell}>
            <span className={styles.inputIcon} aria-hidden="true">
              🔒
            </span>
            <input
              type="password"
              placeholder="Минимум 8 символов"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
              disabled={loading}
            />
          </span>
        </label>

        <div className={styles.actions}>
          <button className={styles.primaryButton} type="submit" disabled={loading}>
            {loading ? (mode === "login" ? "Вход..." : "Регистрация...") : (mode === "login" ? "Войти" : "Создать аккаунт")}
          </button>

          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() =>
              setStatus("Интеграция с Google недоступна в демо-версии.")
            }
            disabled={loading}
          >
            <span className={styles.googleMark}>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
              />
            </span>
            Продолжить с Google
          </button>
        </div>
      </form>

      <div className={styles.helperRow}>
        <p className={styles.helperText}>
          {mode === "login"
            ? "Нет аккаунта?"
            : "Уже с нами? Войдите в аккаунт."}
        </p>
        <button
          type="button"
          className={styles.helperLink}
          onClick={() => switchMode(mode === "login" ? "register" : "login")}
          disabled={loading}
        >
          {mode === "login" ? "Зарегистрироваться" : "Войти"}
        </button>
      </div>

      {status && <p className={styles.formNotes}>{status}</p>}
    </article>
  );
}