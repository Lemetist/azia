import DashboardShell from "../../components/dashboard/DashboardShell";
import { profileFacts } from "../../components/dashboard/dashboard-data";
import styles from "../../components/dashboard/dashboard-page.module.css";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return (
    <DashboardShell
      active="profile"
      title="Профиль"
      subtitle="Личные данные, цели и управление аккаунтом в удобной десктопной компоновке."
      actions={
        <button className={styles.primaryAction} type="button">
          Редактировать профиль
        </button>
      }
    >
      <section className={styles.stack}>
        <div className={styles.heroGrid}>
          <article className={styles.mediaPanel}>
            <div className={styles.mediaContent}>
              <p className={styles.tag}>Карточка атлета</p>
              <h3>Alex Mercer</h3>
              <p>Профиль гибридного атлета с фокусом на силе, плавании и беге.</p>
            </div>
          </article>

          <article className={`${styles.panel} ${styles.panelMedium}`}>
            <h3 className={styles.sectionTitle}>Статус аккаунта</h3>
            <div className={styles.sessionList}>
              <div className={styles.sessionCard}>
                <strong>Абонемент активен</strong>
                <p className={styles.smallMuted}>Тариф «Элитный доступ», автопродление включено.</p>
              </div>
              <div className={styles.sessionCard}>
                <strong>Трекер подключен</strong>
                <p className={styles.smallMuted}>Последняя синхронизация 18 минут назад.</p>
              </div>
              <div className={styles.sessionCard}>
                <strong>Тренер назначен</strong>
                <p className={styles.smallMuted}>Marcus Bell, еженедельный разбор по воскресеньям.</p>
              </div>
            </div>
          </article>
        </div>

        <div className={styles.factsGrid}>
          {profileFacts.map((fact) => (
            <article className={styles.factCard} key={fact.label}>
              <p>{fact.label}</p>
              <strong>{fact.value}</strong>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
