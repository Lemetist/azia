"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import {
  clearSession,
  ensureSessionUser,
  getDisplayName,
  getStoredUser,
  type SessionUser,
} from "../../lib/session";
import { sidebarItems } from "./dashboard-data";
import styles from "./dashboard-shell.module.css";

type DashboardShellProps = {
  active: (typeof sidebarItems)[number]["key"];
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function DashboardShell({
  active,
  title,
  subtitle,
  actions,
  children,
}: DashboardShellProps) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(getStoredUser());
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const currentUser = await ensureSessionUser();
        if (cancelled) {
          return;
        }

        setUser(currentUser);
        setSessionReady(true);
      } catch {
        clearSession();
        if (cancelled) {
          return;
        }

        setSessionReady(true);
        router.replace("/auth/login");
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleLogout() {
    clearSession();
    router.replace("/auth/login");
    router.refresh();
  }

  if (!sessionReady && !user) {
    return (
      <main className={styles.page}>
        <section className={styles.loadingState}>
          <div className={styles.loadingCard}>
            <p className={styles.kicker}>Member workspace</p>
            <h1 className={styles.loadingTitle}>Подключаем кабинет</h1>
            <p className={styles.loadingText}>
              Проверяем сессию пользователя и восстанавливаем доступ к рабочим экранам.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brandBlock}>
          <Link className={styles.brandLink} href="/overview">
            <span className={styles.brandMark}>PT</span>
            <div>
              <p className={styles.kicker}>Member workspace</p>
              <h1 className={styles.brand}>Primal Training Club</h1>
            </div>
          </Link>
          <p className={styles.brandLead}>
            Кабинет, в котором расписание, прогресс и тариф собраны в один рабочий контур.
          </p>
        </div>

        <article className={styles.memberCard}>
          <p className={styles.sidebarEyebrow}>Аккаунт</p>
          <strong className={styles.memberName}>{getDisplayName(user)}</strong>
          <p className={styles.memberEmail}>{user?.email ?? "Сессия пользователя загружается."}</p>
          <button className={styles.memberAction} type="button" onClick={handleLogout}>
            Выйти из кабинета
          </button>
        </article>

        <nav className={styles.nav} aria-label="Навигация кабинета">
          {sidebarItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={item.key === active ? styles.navActive : styles.navLink}
            >
              <span className={styles.navDot} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <article className={styles.sidebarCard}>
          <p className={styles.sidebarEyebrow}>Статус цикла</p>
          <h2>Неделя 12 из 16</h2>
          <p>
            Основной фокус смещен на силу и плотность недели. Сегодня приоритет у
            вечернего силового слота.
          </p>
          <div className={styles.sidebarStats}>
            <div>
              <strong>4/5</strong>
              <span>слотов уже занято</span>
            </div>
            <div>
              <strong>84%</strong>
              <span>готовность к нагрузке</span>
            </div>
          </div>
          <Link className={styles.sidebarAction} href="/">
            На лендинг
          </Link>
        </article>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div className={styles.topbarCopy}>
            <p className={styles.pageEyebrow}>Панель участника клуба</p>
            <h2 className={styles.pageTitle}>{title}</h2>
            <p className={styles.pageSubtitle}>{subtitle}</p>
          </div>

          <div className={styles.topbarActions}>
            <div className={styles.systemBadge}>
              <span className={styles.systemDot} aria-hidden="true" />
              {user ? `${getDisplayName(user)} в системе` : "Обновлено сегодня"}
            </div>
            {actions}
          </div>
        </header>

        {children}
      </section>
    </main>
  );
}
