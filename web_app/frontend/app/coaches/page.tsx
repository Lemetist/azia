import Link from "next/link";

import DashboardShell from "../../components/dashboard/DashboardShell";
import { coachFormats, coaches } from "../../components/dashboard/dashboard-data";
import styles from "../../components/dashboard/dashboard-page.module.css";

export const dynamic = "force-dynamic";

export default function CoachesPage() {
  return (
    <DashboardShell
      active="coaches"
      title="Тренеры"
      subtitle="Профили с понятной специализацией, доступностью и форматом работы, чтобы выбор тренера был предметным, а не декоративным."
      actions={
        <Link className={styles.primaryAction} href="#coach-formats">
          Как выбрать тренера
        </Link>
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
                <div className={styles.coachMeta}>
                  <span className={styles.miniTag}>{coach.speciality}</span>
                  <span className={styles.miniTag}>{coach.experience}</span>
                  <span className={styles.statusTag}>{coach.availability}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.doubleGrid}>
          <article className={`${styles.panel} ${styles.panelMedium}`} id="coach-formats">
            <h3 className={styles.sectionTitle}>Как строится работа</h3>
            <div className={styles.benefitsList}>
              {coachFormats.map((item) => (
                <div className={styles.benefitItem} key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.mediaPanel}>
            <div className={styles.mediaContent}>
              <p className={styles.tag}>Логика подбора</p>
              <h3>Сначала цель и ритм недели, потом уже фамилия тренера.</h3>
              <p>
                Если фокус на силе и технике, нужен плотный контакт с Marcus. Если
                задача в выносливости и восстановлении, логичнее входить через Nina
                или Arseniy.
              </p>
            </div>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
