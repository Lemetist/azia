"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import {
  type RegistrationPayload,
  loginWithCredentials,
  registerWithCredentials,
} from "../../lib/session";
import styles from "./auth-card.module.css";

export type AuthMode = "login" | "register";

export type Credentials = {
  fullName?: string;
  email: string;
  password: string;
};

type AuthCardProps = {
  mode: AuthMode;
  onLogin?(credentials: Credentials): void | Promise<void>;
  onRegister?(credentials: RegistrationPayload): void | Promise<void>;
};

type AuthFieldErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  form?: string;
};

type ApiLikeError = Error & {
  status?: number;
  payload?: unknown;
};

const DASHBOARD_PATH = "/overview";
const ASSESSMENT_PATH = "/assessment";

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M3.75 6.75h16.5a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75v-9a.75.75 0 0 1 .75-.75Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m4.5 7.5 7.03 5.27a.8.8 0 0 0 .94 0L19.5 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M12 12.25a3.75 3.75 0 1 0 0-7.5a3.75 3.75 0 0 0 0 7.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5 19.25a7 7 0 0 1 14 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect
        x="4.75"
        y="10.25"
        width="14.5"
        height="10"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8.5 10.25V8a3.5 3.5 0 1 1 7 0v2.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M21.8 12.23c0-.73-.06-1.26-.2-1.82H12v3.43h5.64c-.11.85-.68 2.14-1.94 3l-.02.11 2.8 2.13.2.02c1.8-1.63 2.82-4.03 2.82-6.87Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.08-.89 6.78-2.41l-3-2.26c-.8.55-1.88.93-3.78.93a6.13 6.13 0 0 1-5.78-4.13l-.11.01-2.91 2.21-.04.1C4.86 19.78 8.15 22 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.22 14.13A6.06 6.06 0 0 1 5.88 12c0-.74.13-1.46.33-2.13l-.01-.14-2.95-2.25-.1.04A9.72 9.72 0 0 0 2 12c0 1.56.38 3.04 1.05 4.31l3.17-2.18Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.74c2.4 0 4.01 1.01 4.94 1.86l3.6-3.43C18.32 2.12 15.5 1 12 1C8.15 1 4.86 3.22 3.15 6.55l3.06 2.35A6.16 6.16 0 0 1 12 5.74Z"
        fill="#EA4335"
      />
    </svg>
  );
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

function validateFields(payload: Credentials, mode: AuthMode): AuthFieldErrors {
  const nextErrors: AuthFieldErrors = {};

  if (mode === "register" && (!payload.fullName || payload.fullName.trim().length < 2)) {
    nextErrors.fullName = "Введите имя не короче 2 символов.";
  }

  if (!payload.email) {
    nextErrors.email = "Введите email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    nextErrors.email = "Введите корректный email.";
  }

  if (!payload.password) {
    nextErrors.password = "Введите пароль.";
  } else if (payload.password.length < 8) {
    nextErrors.password = "Пароль должен быть не короче 8 символов.";
  }

  return nextErrors;
}

function getAuthFieldErrors(error: unknown, mode: AuthMode): AuthFieldErrors {
  const nextErrors: AuthFieldErrors = {};
  const apiError = error as ApiLikeError;
  const payload = apiError?.payload;

  if (apiError?.status === 0) {
    nextErrors.form =
      "Нет соединения с сервером. Проверьте, что backend запущен на локальной машине.";
    return nextErrors;
  }

  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const record = payload as Record<string, unknown>;

    if ("email" in record) {
      nextErrors.email = getErrorMessage(record.email, "Проверьте email.");
    }

    if ("password" in record) {
      nextErrors.password = getErrorMessage(record.password, "Проверьте пароль.");
    }

    if ("full_name" in record) {
      nextErrors.fullName = getErrorMessage(record.full_name, "Проверьте имя.");
    }

    if ("username" in record && mode === "login") {
      nextErrors.email = getErrorMessage(record.username, "Проверьте email.");
    }

    if ("non_field_errors" in record || "detail" in record || "message" in record) {
      nextErrors.form = getErrorMessage(payload, "Не удалось выполнить операцию.");
    }
  }

  if (!nextErrors.form && error instanceof Error) {
    nextErrors.form = error.message;
  }

  if (
    !nextErrors.form &&
    !nextErrors.email &&
    !nextErrors.password &&
    !nextErrors.fullName
  ) {
    nextErrors.form = "Не удалось выполнить операцию. Попробуйте еще раз.";
  }

  return nextErrors;
}

export default function AuthCard({
  mode,
  onLogin,
  onRegister,
}: AuthCardProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setFieldErrors({});
    setLoading(true);

    const payload: Credentials = {
      fullName: mode === "register" ? fullName.trim() : undefined,
      email: email.trim(),
      password,
    };

    const validationErrors = validateFields(payload, mode);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setStatus("Проверьте заполнение формы.");
      setLoading(false);
      return;
    }

    try {
      let nextUser;

      if (mode === "login") {
        if (onLogin) {
          await onLogin(payload);
        } else {
          nextUser = await loginWithCredentials(payload.email, payload.password);
        }
        setStatus("Успешный вход. Перенаправляем...");
      } else {
        const registrationPayload: RegistrationPayload = {
          fullName: payload.fullName || "",
          email: payload.email,
          password: payload.password,
        };

        if (onRegister) {
          await onRegister(registrationPayload);
        } else {
          nextUser = await registerWithCredentials(registrationPayload);
        }
        setStatus("Аккаунт создан. Перенаправляем...");
      }

      router.push(nextUser?.profile ? DASHBOARD_PATH : ASSESSMENT_PATH);
      router.refresh();
    } catch (error) {
      const nextErrors = getAuthFieldErrors(error, mode);
      setFieldErrors(nextErrors);
      setStatus(nextErrors.form ?? "Не удалось выполнить операцию. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className={styles.card} aria-live="polite">
      <form className={styles.form} onSubmit={handleSubmit}>
        {mode === "register" ? (
          <label className={styles.field}>
            <span className={styles.label}>Имя</span>
            <span
              className={`${styles.inputShell} ${fieldErrors.fullName ? styles.inputShellError : ""}`}
            >
              <span className={styles.inputIcon}>
                <UserIcon />
              </span>
              <input
                type="text"
                placeholder="Имя пользователя"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                disabled={loading}
                aria-invalid={fieldErrors.fullName ? "true" : "false"}
              />
            </span>
            {fieldErrors.fullName ? (
              <span className={styles.fieldError}>{fieldErrors.fullName}</span>
            ) : null}
          </label>
        ) : null}

        <label className={styles.field}>
          <span className={styles.label}>E-Mail</span>
          <span
            className={`${styles.inputShell} ${fieldErrors.email ? styles.inputShellError : ""}`}
          >
            <span className={styles.inputIcon}>
              <MailIcon />
            </span>
            <input
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
              autoComplete="email"
              aria-invalid={fieldErrors.email ? "true" : "false"}
            />
          </span>
          {fieldErrors.email ? (
            <span className={styles.fieldError}>{fieldErrors.email}</span>
          ) : null}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Пароль</span>
          <span
            className={`${styles.inputShell} ${fieldErrors.password ? styles.inputShellError : ""}`}
          >
            <span className={styles.inputIcon}>
              <LockIcon />
            </span>
            <input
              type="password"
              placeholder="Минимум 8 символов"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
              disabled={loading}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              aria-invalid={fieldErrors.password ? "true" : "false"}
            />
          </span>
          {fieldErrors.password ? (
            <span className={styles.fieldError}>{fieldErrors.password}</span>
          ) : null}
        </label>

        <button className={styles.primaryButton} type="submit" disabled={loading}>
          {loading
            ? mode === "login"
              ? "Вход..."
              : "Регистрация..."
            : mode === "login"
              ? "Войти"
              : "Зарегистрироваться"}
        </button>

        <div className={styles.divider}>
          <span>Or</span>
        </div>

        <button
          className={styles.googleButton}
          type="button"
          disabled={loading}
          onClick={() => setStatus("Вход через Google пока не подключен.")}
        >
          <span className={styles.googleIcon}>
            <GoogleIcon />
          </span>
          Войти с аккаунтом Google
        </button>
      </form>

      <div className={styles.footerNote}>
        <span>
          {mode === "login" ? "Еще нет аккаунта?" : "Уже зарегистрированы?"}
        </span>
        <Link href={mode === "login" ? "/auth/register" : "/auth/login"}>
          {mode === "login" ? "Создать аккаунт" : "Войти"}
        </Link>
      </div>

      {status ? (
        <p
          className={`${styles.status} ${fieldErrors.form ? styles.statusError : styles.statusSuccess}`}
          role="alert"
        >
          {status}
        </p>
      ) : null}
    </article>
  );
}
