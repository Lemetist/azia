import Link from "next/link";
import { ReactNode } from "react";
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
  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brandBlock}>
          <p className={styles.kicker}>Веб-кабинет зала</p>
          <h1 className={styles.brand}>ТРУД ДАЕТ РЕЗУЛЬТАТ.</h1>
        </div>

        <nav className={styles.nav} aria-label="Основная навигация">
          {sidebarItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={item.key === active ? styles.navActive : styles.navLink}
            >
              <span className={styles.navDot} aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        <article className={styles.sidebarCard}>
          <p className={styles.sidebarEyebrow}>Текущий фокус</p>
          <h2>Системность важнее интенсивности</h2>
          <p>
            4 структурированные тренировки на этой неделе, 2 окна восстановления, 1
            мобилити-сессия.
          </p>
        </article>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.pageEyebrow}>Панель фитнес-центра</p>
            <h2 className={styles.pageTitle}>{title}</h2>
            <p className={styles.pageSubtitle}>{subtitle}</p>
          </div>
          <div className={styles.topbarActions}>
            <button className={styles.ghostButton} type="button">
              Синхронизировать трекер
            </button>
            {actions}
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
