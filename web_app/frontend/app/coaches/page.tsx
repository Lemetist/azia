import DashboardShell from "../../components/dashboard/DashboardShell";
import { coaches } from "../../components/dashboard/dashboard-data";
import styles from "../../components/dashboard/dashboard-page.module.css";

export const dynamic = "force-dynamic";

export default function CoachesPage() {
  return (
    <DashboardShell
      active="coaches"
      title="Тренеры"
      subtitle="Программы под руководством экспертов по силе, плаванию и бегу с профилями, удобными для просмотра на десктопе."
      actions={
        <button className={styles.primaryAction} type="button">
          Подобрать тренера
        </button>
      }
    >
      <section className={styles.stack}>
        <div className={styles.coachesGrid}>
          {coaches.map((coach) => (
            <article
              className={styles.coachCard}
              key={coach.name}
              style={{ backgroundImage: `url(${coach.image})` }}
            >
              <span className={styles.coachRibbon} aria-hidden="true" />
              <span className={styles.coachRole}>{coach.role}</span>
              <div className={styles.coachContent}>
                <h3>{coach.name}</h3>
                <p>{coach.focus}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.doubleGrid}>
          <article className={`${styles.panel} ${styles.panelMedium}`}>
            <h3 className={styles.sectionTitle}>Формат работы</h3>
            <div className={styles.sessionList}>
              <div className={styles.sessionCard}>
                <strong>Индивидуальные сессии</strong>
                <p className={styles.smallMuted}>Детальная корректировка техники и прогрессия нагрузки.</p>
              </div>
              <div className={styles.sessionCard}>
                <strong>Занятия в малых группах</strong>
                <p className={styles.smallMuted}>Соревновательная атмосфера и структурированная программа.</p>
              </div>
              <div className={styles.sessionCard}>
                <strong>Удаленные чек-ины</strong>
                <p className={styles.smallMuted}>Еженедельные заметки, разбор данных трекера и обновление плана.</p>
              </div>
            </div>
          </article>

          <article className={styles.mediaPanel}>
            <div className={styles.mediaContent}>
              <p className={styles.tag}>Выбор тренера</p>
              <h3>Сначала техника, потом интенсивность.</h3>
              <p>
                Любая программа начинается с качества движения, а уже потом с роста объема.
              </p>
            </div>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
