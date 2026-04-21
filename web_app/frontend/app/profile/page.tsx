import Link from "next/link";

import DashboardShell from "../../components/dashboard/DashboardShell";
import ProfileIdentityCard from "../../components/dashboard/ProfileIdentityCard";
import {
  profileFacts,
  profilePreferences,
} from "../../components/dashboard/dashboard-data";
import styles from "../../components/dashboard/dashboard-page.module.css";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return (
    <DashboardShell
      active="profile"
      title="Профиль"
      subtitle="Личные данные, цели цикла, статусы подключений и привычки посещения в одном аккуратном разделе."
      actions={
        <Link className={styles.primaryAction} href="#preferences">
          К настройкам
        </Link>
      }
    >
      <section className={styles.stack}>
        <div className={styles.heroGrid}>
          <article className={styles.mediaPanel}>
            <ProfileIdentityCard />
          </article>

          <article className={`${styles.panel} ${styles.panelMedium}`}>
            <h3 className={styles.sectionTitle}>Состояние аккаунта</h3>
            <div className={styles.sessionList}>
              <div className={styles.sessionCard}>
                <div className={styles.sessionHead}>
                  <strong>Абонемент активен</strong>
                  <span className={styles.statusTag}>OK</span>
                </div>
                <p className={styles.sessionMeta}>Тариф «Элитный доступ», автопродление включено.</p>
              </div>
              <div className={styles.sessionCard}>
                <div className={styles.sessionHead}>
                  <strong>Трекер подключен</strong>
                  <span className={styles.miniTag}>Apple Watch</span>
                </div>
                <p className={styles.sessionMeta}>Последняя синхронизация 18 минут назад.</p>
              </div>
              <div className={styles.sessionCard}>
                <div className={styles.sessionHead}>
                  <strong>Тренер назначен</strong>
                  <span className={styles.miniTag}>Marcus Bell</span>
                </div>
                <p className={styles.sessionMeta}>Еженедельный разбор по воскресеньям.</p>
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

        <article className={styles.panel} id="preferences">
          <h3 className={styles.sectionTitle}>Предпочтения и ритм</h3>
          <div className={styles.tripleGrid}>
            {profilePreferences.map((item) => (
              <div className={styles.sessionCard} key={item.label}>
                <strong>{item.label}</strong>
                <p className={styles.listValue}>{item.value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}
