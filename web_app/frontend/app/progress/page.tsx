import Link from "next/link";

import DashboardShell from "../../components/dashboard/DashboardShell";
import { milestones, trendBars } from "../../components/dashboard/dashboard-data";
import styles from "../../components/dashboard/dashboard-page.module.css";

export const dynamic = "force-dynamic";

export default function ProgressPage() {
  return (
    <DashboardShell
      active="progress"
      title="Прогресс"
      subtitle="Нормальный аналитический экран: цели, динамика по циклу и сигналы восстановления в одной логике принятия решений."
      actions={
        <Link className={styles.primaryAction} href="#trend-report">
          К динамике цикла
        </Link>
      }
    >
      <section className={styles.stack}>
        <div className={styles.doubleGrid}>
          <article className={`${styles.panel} ${styles.panelLarge}`} id="trend-report">
            <h3 className={styles.sectionTitle}>Тренд за 30 дней</h3>
            <div className={styles.chartList}>
              {trendBars.map((bar) => (
                <div className={styles.chartItem} key={bar.label}>
                  <div className={styles.chartHead}>
                    <span>{bar.label}</span>
                    <span>{bar.value}</span>
                  </div>
                  <div className={styles.chartBar}>
                    <div className={styles.chartFill} style={{ width: bar.width }} />
                  </div>
                </div>
              ))}
            </div>
            <p className={styles.progressHint}>
              Объем растет быстрее темпа, значит база силы держится хорошо, но беговую
              механику еще есть куда подтягивать.
            </p>
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
                  <p className={styles.smallMuted}>{milestone.delta}</p>
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
            <p className={styles.value}>4:37/км</p>
            <p className={styles.smallMuted}>Улучшение на 18 секунд в этом месяце.</p>
          </article>
          <article className={`${styles.panel} ${styles.metricPanel}`}>
            <h3 className={styles.sectionTitle}>Восстановление</h3>
            <p className={styles.value}>Готов</p>
            <p className={styles.smallMuted}>Сон и HRV подтверждают интенсивную работу сегодня.</p>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
