"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import DashboardShell from "../../components/dashboard/DashboardShell";
import { overviewActions } from "../../components/dashboard/dashboard-data";
import { fetchSessionJson } from "../../lib/session";
import styles from "../../components/dashboard/dashboard-page.module.css";

export const dynamic = "force-dynamic";

type StatCard = {
  label: string;
  value: string;
  change: string;
  tone: string;
};

type RecoverySignal = {
  label: string;
  value: string;
  status: string;
};

type NextWorkout = {
  title: string;
  coach: string;
  time: string;
  tag: string;
};

type DashboardSummary = {
  stats: StatCard[];
  recovery_signals: RecoverySignal[];
  next_workouts: NextWorkout[];
  cycle_status: {
    week: string;
    focus: string;
    slots_filled: string;
    readiness: string;
  };
};

export default function OverviewPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSummary() {
      try {
        const data = (await fetchSessionJson("/dashboard/summary/")) as DashboardSummary;

        if (cancelled) {
          return;
        }

        setSummary(data);
        setError(null);
      } catch (currentError) {
        if (cancelled) {
          return;
        }

        setError(
          currentError instanceof Error
            ? currentError.message
            : "Не удалось загрузить сводку кабинета."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = summary?.stats ?? [];
  const recoverySignals = summary?.recovery_signals ?? [];
  const nextWorkouts = summary?.next_workouts ?? [];
  const cycleStatus = summary?.cycle_status;

  return (
    <DashboardShell
      active="overview"
      title="Обзор"
      subtitle="Единая точка входа в кабинет: ближайшие тренировки, состояние цикла, восстановление и быстрые переходы к рабочим разделам."
      actions={
        <Link className={styles.primaryAction} href="/schedule">
          Открыть неделю
        </Link>
      }
    >
      <section className={styles.stack}>
        <div className={styles.heroGrid}>
          <article className={styles.heroPanel}>
            <div className={styles.heroCopy}>
              <p className={styles.tag}>Сегодня в фокусе</p>
              <h3>{cycleStatus?.week ?? "Собираем состояние цикла."}</h3>
              <p>
                {cycleStatus?.focus ??
                  "Подтягиваем актуальные тренировки, статус недели и восстановление из backend."}
              </p>
            </div>
          </article>

          <article className={`${styles.panel} ${styles.panelTall}`}>
            <h3 className={styles.sectionTitle}>Сигналы восстановления</h3>
            {loading ? (
              <div className={styles.sessionCard}>
                <p className={styles.sessionMeta}>Загружаем восстановление и ближайшие сигналы.</p>
              </div>
            ) : error ? (
              <div className={styles.sessionCard}>
                <p className={styles.sessionMeta}>{error}</p>
              </div>
            ) : (
              <div className={styles.listStack}>
                {recoverySignals.map((signal) => (
                  <div className={styles.sessionCard} key={signal.label}>
                    <div className={styles.inlineMetric}>
                      <strong>{signal.label}</strong>
                      <span className={styles.statusTag}>{signal.status}</span>
                    </div>
                    <p className={styles.value}>{signal.value}</p>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>

        <div className={styles.statGrid}>
          {(stats.length ? stats : [{ label: "Сводка", value: "0", change: "Ждем API", tone: "neutral" }]).map(
            (item) => (
              <article className={styles.statCard} key={item.label}>
                <div className={styles.statHead}>
                  <span className={styles.listLabel}>{item.label}</span>
                  <span className={item.tone === "accent" ? styles.tag : styles.miniTag}>
                    {item.change}
                  </span>
                </div>
                <strong className={item.tone === "accent" ? styles.accentText : undefined}>
                  {item.value}
                </strong>
              </article>
            )
          )}
        </div>

        <div className={styles.doubleGrid}>
          <article className={`${styles.panel} ${styles.panelMedium}`}>
            <h3 className={styles.sectionTitle}>Ближайшие тренировки</h3>
            {loading ? (
              <div className={styles.sessionCard}>
                <p className={styles.sessionMeta}>Получаем слоты недели из backend.</p>
              </div>
            ) : error ? (
              <div className={styles.sessionCard}>
                <p className={styles.sessionMeta}>{error}</p>
              </div>
            ) : (
              <div className={styles.sessionList}>
                {nextWorkouts.map((workout) => (
                  <div className={styles.sessionCard} key={`${workout.title}-${workout.time}`}>
                    <div className={styles.sessionHead}>
                      <strong>{workout.title}</strong>
                      <span className={styles.tag}>{workout.tag}</span>
                    </div>
                    <p className={styles.sessionMeta}>{workout.time}</p>
                    <p className={styles.smallMuted}>Тренер: {workout.coach}</p>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className={styles.mediaPanel}>
            <div className={styles.mediaContent}>
              <p className={styles.tag}>Недельная логика</p>
              <h3>Сначала нагрузка, затем закрепление и выход в восстановление.</h3>
              <p>
                Данные для обзора уже приходят из backend и больше не живут только в
                статичных массивах фронтенда.
              </p>
            </div>
          </article>
        </div>

        <div className={styles.actionGrid}>
          {overviewActions.map((item) => (
            <article className={styles.actionCard} key={item.title}>
              <h3>{item.title}</h3>
              <p className={styles.listMeta}>{item.description}</p>
              <Link className={styles.inlineLink} href={item.href}>
                Перейти
              </Link>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
