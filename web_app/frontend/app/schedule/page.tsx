import DashboardShell from "../../components/dashboard/DashboardShell";
import { scheduleDays } from "../../components/dashboard/dashboard-data";
import styles from "../../components/dashboard/dashboard-page.module.css";

export const dynamic = "force-dynamic";

export default function SchedulePage() {
  return (
    <DashboardShell
      active="schedule"
      title="Расписание тренировок"
      subtitle="Структурированные занятия, слоты с тренером и все нужное для быстрого бронирования с десктопа."
      actions={
        <button className={styles.primaryAction} type="button">
          Записаться на следующее занятие
        </button>
      }
    >
      <section className={styles.stack}>
        <div className={styles.heroGrid}>
          <article className={styles.heroPanel}>
            <div className={styles.heroCopy}>
              <p className={styles.tag}>Программа недели 12</p>
              <h3>Пиковая нагрузка. Контролируемое восстановление.</h3>
              <p>
                Чередуйте интенсивные сессии с окнами восстановления и держите всю
                неделю перед глазами.
              </p>
            </div>
          </article>

          <article className={`${styles.panel} ${styles.panelTall}`}>
            <h3 className={styles.sectionTitle}>Сводка по записям</h3>
            <div className={styles.sessionList}>
              <div className={styles.sessionCard}>
                <div className={styles.sessionHead}>
                  <strong>Записано 4 занятия</strong>
                  <span className={styles.tag}>На этой неделе</span>
                </div>
                <p className={styles.smallMuted}>2 с тренером, 1 восстановление, 1 кондиционная</p>
              </div>
              <div className={styles.sessionCard}>
                <div className={styles.sessionHead}>
                  <strong>1 место в листе ожидания</strong>
                  <span className={styles.tag}>Бокс</span>
                </div>
                <p className={styles.smallMuted}>Вы первые в очереди на четверг, 19:00</p>
              </div>
            </div>
          </article>
        </div>

        <section className={styles.tripleGrid}>
          {scheduleDays.map((day) => (
            <article className={styles.scheduleDay} key={day.day}>
              <div className={styles.dayHeader}>
                <h3>{day.day}</h3>
                <span className={styles.smallMuted}>
                  {day.sessions.length} занятий
                </span>
              </div>
              <div className={styles.scheduleSessions}>
                {day.sessions.map((session) => (
                  <div className={styles.sessionCard} key={`${day.day}-${session.time}`}>
                    <div className={styles.sessionHead}>
                      <strong>{session.time}</strong>
                      <span className={styles.tag}>{session.spots}</span>
                    </div>
                    <p>{session.title}</p>
                    <p className={styles.smallMuted}>{session.meta}</p>
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
