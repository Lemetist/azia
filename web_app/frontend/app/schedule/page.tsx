"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import DashboardShell from "../../components/dashboard/DashboardShell";
import { bookScheduleSlot, fetchSessionJson } from "../../lib/session";
import styles from "../../components/dashboard/dashboard-page.module.css";

export const dynamic = "force-dynamic";

type ScheduleSession = {
  id: number;
  time: string;
  title: string;
  meta: string;
  coach: string;
  spots: string;
  status: string;
  workout_slug: string;
  workout_category: "strength" | "cardio" | "mobility";
  is_booked: boolean;
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

function pluralizeRu(value: number, forms: [string, string, string]) {
  const absoluteValue = Math.abs(value);
  const lastTwoDigits = absoluteValue % 100;
  const lastDigit = absoluteValue % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return forms[2];
  }

  if (lastDigit === 1) {
    return forms[0];
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms[1];
  }

  return forms[2];
}

export default function SchedulePage() {
  const [days, setDays] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingSlotId, setBookingSlotId] = useState<number | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

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
    const bookedSessions = sessions.filter((item) => item.is_booked);
    const strength = sessions.filter((item) => item.workout_category === "strength").length;
    const cardio = sessions.filter((item) => item.workout_category === "cardio").length;
    const recovery = sessions.filter((item) => item.workout_category === "mobility").length;
    const firstAvailable =
      sessions.find((item) => !item.is_booked && !/заполнено/i.test(item.status)) ?? sessions[0];

    return {
      total: sessions.length,
      booked: bookedSessions.length,
      strength,
      cardio,
      recovery,
      firstAvailable,
    };
  }, [days]);

  async function handleBookSession(slotId: number) {
    setBookingSlotId(slotId);
    setBookingMessage(null);

    try {
      const booking = await bookScheduleSlot(slotId);

      setDays((currentDays) =>
        currentDays.map((day) => ({
          ...day,
          sessions: day.sessions.map((session) =>
            session.id === booking.slot_id
              ? { ...session, is_booked: true, status: "Вы записаны" }
              : session
          ),
        }))
      );
      setBookingMessage(booking.message);
    } catch (currentError) {
      setBookingMessage(
        currentError instanceof Error
          ? currentError.message
          : "Не удалось записаться на тренировку."
      );
    } finally {
      setBookingSlotId(null);
    }
  }

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
                  <strong>
                    {summary.booked} {pluralizeRu(summary.booked, ["занятие", "занятия", "занятий"])} записано
                  </strong>
                  <span className={styles.tag}>На этой неделе</span>
                </div>
                <p className={styles.sessionMeta}>
                  Всего доступно: {summary.total}. {summary.strength} силовых, {summary.cardio} кардио,{" "}
                  {summary.recovery} recovery
                </p>
              </div>
              <div className={styles.sessionCard}>
                <div className={styles.sessionHead}>
                  <strong>Лучший рабочий слот</strong>
                  <span className={styles.miniTag}>{summary.firstAvailable ? "Доступен" : "Ожидание"}</span>
                </div>
                <p className={styles.sessionMeta}>
                  {summary.firstAvailable
                    ? `${summary.firstAvailable.time}. ${summary.firstAvailable.title}`
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
                    : bookingMessage ?? "Выберите слот и подтвердите запись одним нажатием."}
                </p>
              </div>
            </div>
          </article>
        </div>

        <section className={styles.scheduleGrid} id="week-grid" aria-busy={loading}>
          {loading
            ? Array.from({ length: 4 }, (_, index) => (
                <article className={styles.scheduleDay} key={`loading-${index}`}>
                  <div className={styles.dayHeader}>
                    <div>
                      <h3>Загрузка</h3>
                      <p className={styles.smallMuted}>Получаем слоты недели</p>
                    </div>
                    <span className={styles.miniTag}>...</span>
                  </div>
                  <div className={styles.scheduleSessions}>
                    <div className={styles.sessionCard}>
                      <div className={styles.sessionHead}>
                        <strong>--:--</strong>
                        <span className={styles.tag}>места</span>
                      </div>
                      <p className={styles.sessionMeta}>Синхронизируем расписание</p>
                    </div>
                  </div>
                </article>
              ))
            : null}

          {!loading && error ? (
            <article className={`${styles.scheduleDay} ${styles.scheduleNotice}`}>
              <div className={styles.dayHeader}>
                <div>
                  <h3>Расписание недоступно</h3>
                  <p className={styles.smallMuted}>{error}</p>
                </div>
                <span className={styles.statusTag}>Проблема</span>
              </div>
            </article>
          ) : null}

          {!loading && !error && days.length === 0 ? (
            <article className={`${styles.scheduleDay} ${styles.scheduleNotice}`}>
              <div className={styles.dayHeader}>
                <div>
                  <h3>Слотов пока нет</h3>
                  <p className={styles.smallMuted}>Backend вернул пустую неделю.</p>
                </div>
                <span className={styles.miniTag}>0 слотов</span>
              </div>
            </article>
          ) : null}

          {!loading && !error
            ? days.map((day) => (
                <article className={styles.scheduleDay} key={day.day_id}>
                  <div className={styles.dayHeader}>
                    <div>
                      <h3>
                        {day.day} · {day.date}
                      </h3>
                      <p className={styles.smallMuted}>{day.load}</p>
                    </div>
                    <span className={styles.miniTag}>
                      {day.sessions.length} {pluralizeRu(day.sessions.length, ["слот", "слота", "слотов"])}
                    </span>
                  </div>

                  <div className={styles.scheduleSessions}>
                    {day.sessions.map((session) => {
                      const isFull = /заполнено/i.test(session.status);
                      const isBooking = bookingSlotId === session.id;

                      return (
                        <div className={styles.sessionCard} key={`${day.day_id}-${session.time}-${session.title}`}>
                          <div className={styles.sessionHead}>
                            <strong>{session.time}</strong>
                            <span className={session.is_booked ? styles.statusTag : styles.tag}>
                              {session.is_booked ? "Вы записаны" : session.spots}
                            </span>
                          </div>
                          <p className={styles.sessionMeta}>{session.title}</p>
                          <p className={styles.smallMuted}>{session.meta}</p>
                          <p className={styles.smallMuted}>Тренер: {session.coach}</p>
                          <p className={styles.listValue}>{session.status}</p>
                          <button
                            className={session.is_booked ? styles.secondaryAction : styles.primaryAction}
                            type="button"
                            disabled={session.is_booked || isFull || isBooking}
                            onClick={() => void handleBookSession(session.id)}
                          >
                            {isBooking
                              ? "Записываем..."
                              : session.is_booked
                                ? "Запись подтверждена"
                                : isFull
                                  ? "Мест нет"
                                  : "Записаться"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))
            : null}
        </section>
      </section>
    </DashboardShell>
  );
}
