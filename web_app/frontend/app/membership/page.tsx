import DashboardShell from "../../components/dashboard/DashboardShell";
import { plans } from "../../components/dashboard/dashboard-data";
import styles from "../../components/dashboard/dashboard-page.module.css";

export const dynamic = "force-dynamic";

export default function MembershipPage() {
  return (
    <DashboardShell
      active="membership"
      title="Абонемент"
      subtitle="Тарифы, информация о продлении и действия по управлению абонементом в удобном десктопном формате."
      actions={
        <button className={styles.primaryAction} type="button">
          Управлять оплатой
        </button>
      }
    >
      <section className={styles.stack}>
        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <article className={styles.planCard} key={plan.name}>
              <p className={styles.tag}>{plan.status}</p>
              <h3>{plan.name}</h3>
              <p className={styles.planPrice}>{plan.price}</p>
              <p>{plan.description}</p>
              <div className={styles.heroActions}>
                <button className={styles.primaryAction} type="button">
                  {plan.status === "Текущий тариф" ? "Продлить тариф" : "Улучшить"}
                </button>
                <button className={styles.secondaryAction} type="button">
                  Подробнее
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.doubleGrid}>
          <article className={styles.panel}>
            <h3 className={styles.sectionTitle}>Что включено</h3>
            <div className={styles.sessionList}>
              <div className={styles.sessionCard}>
                <strong>Безлимитный доступ</strong>
                <p className={styles.smallMuted}>Тренажерный зал, раздевалка, зона восстановления.</p>
              </div>
              <div className={styles.sessionCard}>
                <strong>Приоритет на классы</strong>
                <p className={styles.smallMuted}>Раннее окно бронирования для занятий в часы пик.</p>
              </div>
              <div className={styles.sessionCard}>
                <strong>Разбор с тренером</strong>
                <p className={styles.smallMuted}>Ежемесячный разбор прогресса и рекомендации.</p>
              </div>
            </div>
          </article>

          <article className={styles.mediaPanel}>
            <div className={styles.mediaContent}>
              <p className={styles.tag}>Окно продления</p>
              <h3>Не теряйте темп.</h3>
              <p>Автопродление включено. Следующее списание будет 12 апреля 2026.</p>
            </div>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
