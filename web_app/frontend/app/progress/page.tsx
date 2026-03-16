import DashboardShell from "../../components/dashboard/DashboardShell";
import { milestones } from "../../components/dashboard/dashboard-data";
import styles from "../../components/dashboard/dashboard-page.module.css";

export const dynamic = "force-dynamic";

export default function ProgressPage() {
  return (
    <DashboardShell
      active="progress"
      title="Прогресс"
      subtitle="Десктопный аналитический вид для метрик тела, тренировочного объема и отслеживания целей."
      actions={
        <button className={styles.primaryAction} type="button">
          Экспортировать отчет
        </button>
      }
    >
      <section className={styles.stack}>
        <div className={styles.doubleGrid}>
          <article className={`${styles.mediaPanel} ${styles.mediaPanelLarge}`}>
            <div className={styles.mediaContent}>
              <p className={styles.tag}>Тренд за 30 дней</p>
              <h3>Дисциплина дает накопительный эффект.</h3>
              <p>Объем вырос на 14%, пульс в покое снизился на 4 уд/мин, готовность остается стабильной.</p>
            </div>
          </article>

          <article className={`${styles.panel} ${styles.panelLarge}`}>
            <h3 className={styles.sectionTitle}>Контрольные цели</h3>
            <div className={styles.milestoneList}>
              {milestones.map((milestone) => (
                <div className={styles.milestoneCard} key={milestone.label}>
                  <div className={styles.sessionHead}>
                    <strong>{milestone.label}</strong>
                    <span className={styles.tag}>Цель {milestone.target}</span>
                  </div>
                  <p className={styles.value}>{milestone.current}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className={styles.tripleGrid}>
          <article className={`${styles.panel} ${styles.metricPanel}`}>
            <h3 className={styles.sectionTitle}>Стабильность</h3>
            <p className={styles.value}>91%</p>
            <p className={styles.smallMuted}>Посещаемость за последние 8 недель.</p>
          </article>
          <article className={`${styles.panel} ${styles.metricPanel}`}>
            <h3 className={styles.sectionTitle}>Лучший темп</h3>
            <p className={styles.value}>4:37/km</p>
            <p className={styles.smallMuted}>Улучшение на 18 секунд в этом месяце.</p>
          </article>
          <article className={`${styles.panel} ${styles.metricPanel}`}>
            <h3 className={styles.sectionTitle}>Восстановление</h3>
            <p className={styles.value}>Готов</p>
            <p className={styles.smallMuted}>Сон и HRV показывают, что сегодня можно тренироваться интенсивно.</p>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
