import Link from "next/link";

import DashboardShell from "../../components/dashboard/DashboardShell";
import { membershipBenefits, plans } from "../../components/dashboard/dashboard-data";
import styles from "../../components/dashboard/dashboard-page.module.css";

export const dynamic = "force-dynamic";

export default function MembershipPage() {
  return (
    <DashboardShell
      active="membership"
      title="Абонемент"
      subtitle="Раздел тарифа с текущим статусом, выгодой апгрейда и расшифровкой того, что реально входит в обслуживание."
      actions={
        <Link className={styles.primaryAction} href="#plans">
          Сравнить планы
        </Link>
      }
    >
      <section className={styles.stack}>
        <div className={styles.plansGrid} id="plans">
          {plans.map((plan) => (
            <article className={styles.planCard} key={plan.name}>
              <p className={styles.tag}>{plan.status}</p>
              <h3>{plan.name}</h3>
              <p className={styles.planPrice}>{plan.price}</p>
              <p className={styles.planDescription}>{plan.description}</p>
              <div className={styles.planFeatures}>
                {plan.perks.map((perk) => (
                  <p className={styles.planFeature} key={perk}>
                    {perk}
                  </p>
                ))}
              </div>
              <div className={styles.heroActions}>
                <Link
                  className={styles.primaryAction}
                  href={plan.status === "Текущий тариф" ? "/profile" : "/coaches"}
                >
                  {plan.status === "Текущий тариф" ? "Открыть профиль" : "Подобрать тренера"}
                </Link>
                <Link className={styles.secondaryAction} href="#benefits">
                  Подробнее
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.doubleGrid}>
          <article className={`${styles.panel} ${styles.panelMedium}`} id="benefits">
            <h3 className={styles.sectionTitle}>Что входит</h3>
            <div className={styles.benefitsList}>
              {membershipBenefits.map((item) => (
                <div className={styles.benefitItem} key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.mediaPanel}>
            <div className={styles.mediaContent}>
              <p className={styles.tag}>Продление</p>
              <h3>Не теряйте ритм между циклами.</h3>
              <p>
                Автопродление включено. Следующее списание запланировано на 12 апреля
                2026, а при переходе на Performance+ окно бронирования откроется раньше.
              </p>
            </div>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
