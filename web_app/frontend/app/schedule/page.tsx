"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import DashboardShell from "../../components/dashboard/DashboardShell";
import { fetchSessionJson } from "../../lib/session";
import styles from "../../components/dashboard/dashboard-page.module.css";

export const dynamic = "force-dynamic";

type ScheduleSession = {
  time: string;
  title: string;
  meta: string;
  coach: string;
  spots: string;
  status: string;
  workout_slug: string;
};

type ScheduleDay = {
  day_id: string;
  day: string;
  date: string;
  load: string;
  sessions: ScheduleSession[];
};

type ScheduleResponse = {
  days: ScheduleDay[];
};

export default function SchedulePage() {
  const [days, setDays] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSchedule() {
      try {
        const data = (await fetchSessionJson("/schedule")) as ScheduleResponse;

        if (cancelled) {
          return;
        }

        setDays(data.days);
        setError(null);
      } catch (currentError) {
        if (cancelled) {
          return;
        }

        setError(
          currentError instanceof Error
            ? currentError.message
            : "Не удалось загрузить расписание."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSchedule();

    return () => {
      cancelled = true;
    };
  }, []);

  const summary = useMemo(() => {
    const sessions = days.flatMap((day) => day.sessions);
    const strength = sessions.filter((item) => item.workout_slug.includes("strength") || item.workout_slug.includes("leg")).length;
    const cardio = sessions.filter((item) => item.workout_slug.includes("pool") || item.workout_slug.includes("tempo")).length;
    const recovery = sessions.filter((item) => item.workout_slug.includes("mobility")).length;

    return {
      total: sessions.length,
      strength,
      cardio,
      recovery,
    };
  }, [days]);

  return (
    <DashboardShell
      active="schedule"
      title="Расписание"
      subtitle="Недельный вид со слотом, тренером, уровнем загрузки и понятным приоритетом, чтобы запись не превращалась в хаос."
      actions={
        <Link className={styles.primaryAction} href="#week-grid">
          К слотам недели
        </Link>
      }
    >
      <section className={styles.stack}>
        <div className={styles.heroGrid}>
          <article className={styles.heroPanel}>
            <div className={styles.heroCopy}>
              <p className={styles.tag}>Неделя 12</p>
              <h3>
                {loading
                  ? "Подтягиваем актуальное расписание."
                  : "Пиковая нагрузка уже собрана. Осталось удержать ритм и не перегореть."}
              </h3>
              <p>
                {error
                  ? error
                  : "Слоты приходят из backend и отражают реальный каталог тренировок, а не только фронтовый мок."}
              </p>
            </div>
          </article>

          <article className={`${styles.panel} ${styles.panelTall}`}>
            <h3 className={styles.sectionTitle}>Сводка по записям</h3>
            <div className={styles.sessionList}>
              <div className={styles.sessionCard}>
                <div className={styles.sessionHead}>
                  <strong>{summary.total || 0} занятий подтверждены</strong>
                  <span className={styles.tag}>На этой неделе</span>
                </div>
                <p className={styles.sessionMeta}>
                  {summary.strength} силовых, {summary.cardio} кондиционных, {summary.recovery} recovery-сессий
                </p>
              </div>
              <div className={styles.sessionCard}>
                <div className={styles.sessionHead}>
                  <strong>Лучший рабочий слот</strong>
                  <span className={styles.miniTag}>{days[0]?.day ?? "Ожидание"}</span>
                </div>
                <p className={styles.sessionMeta}>
                  {days[0]?.sessions[0]
                    ? `${days[0].sessions[0].time}. ${days[0].sessions[0].title}`
                    : "Подбираем первый доступный слот недели."}
                </p>
              </div>
              <div className={styles.sessionCard}>
                <div className={styles.sessionHead}>
                  <strong>Состояние загрузки</strong>
                  <span className={styles.statusTag}>{error ? "Проблема" : "В норме"}</span>
                </div>
                <p className={styles.sessionMeta}>
                  {error
                    ? "API не вернул расписание. Проверь backend и сессию."
                    : "Расписание синхронизировано с backend и готово к ручному тесту."}
                </p>
              </div>
            </div>
          </article>
        </div>

        <section className={styles.tripleGrid} id="week-grid">
          {days.map((day) => (
            <article className={styles.scheduleDay} key={day.day_id}>
              <div className={styles.dayHeader}>
                <div>
                  <h3>
                    {day.day} · {day.date}
                  </h3>
                  <p className={styles.smallMuted}>{day.load}</p>
                </div>
                <span className={styles.miniTag}>{day.sessions.length} слота</span>
              </div>

              <div className={styles.scheduleSessions}>
                {day.sessions.map((session) => (
                  <div className={styles.sessionCard} key={`${day.day_id}-${session.time}-${session.title}`}>
                    <div className={styles.sessionHead}>
                      <strong>{session.time}</strong>
                      <span className={styles.tag}>{session.spots}</span>
                    </div>
                    <p className={styles.sessionMeta}>{session.title}</p>
                    <p className={styles.smallMuted}>{session.meta}</p>
                    <p className={styles.smallMuted}>Тренер: {session.coach}</p>
                    <p className={styles.listValue}>{session.status}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </section>
    </DashboardShell>
  );
}
