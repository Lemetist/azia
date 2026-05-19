"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import DashboardShell from "../../components/dashboard/DashboardShell";
import {
  membershipBenefits,
  membershipPlanStorageKey,
  plans,
} from "../../components/dashboard/dashboard-data";
import styles from "../../components/dashboard/dashboard-page.module.css";

export const dynamic = "force-dynamic";

export default function MembershipPage() {
  const defaultPlanName = plans.find((plan) => plan.status === "Текущий тариф")?.name ?? plans[0].name;
  const [selectedPlanName, setSelectedPlanName] = useState<string>(defaultPlanName);
  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.name === selectedPlanName) ?? plans[0],
    [selectedPlanName],
  );

  useEffect(() => {
    const storedPlanName = window.localStorage.getItem(membershipPlanStorageKey);

    if (storedPlanName && plans.some((plan) => plan.name === storedPlanName)) {
      setSelectedPlanName(storedPlanName);
    }
  }, []);

  function selectPlan(planName: string) {
    setSelectedPlanName(planName);
    window.localStorage.setItem(membershipPlanStorageKey, planName);
  }

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
          {plans.map((plan) => {
            const isCurrentPlan = plan.name === selectedPlanName;

            return (
            <article
              className={`${styles.planCard} ${isCurrentPlan ? styles.planCardActive : ""}`}
              key={plan.name}
            >
              <p className={isCurrentPlan ? styles.statusTag : styles.tag}>
                {isCurrentPlan ? "Текущий тариф" : plan.status}
              </p>
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
                <button
                  className={styles.primaryAction}
                  type="button"
                  disabled={isCurrentPlan}
                  onClick={() => selectPlan(plan.name)}
                >
                  {isCurrentPlan ? "Выбран" : "Выбрать тариф"}
                </button>
                <Link className={styles.secondaryAction} href="#benefits">
                  Подробнее
                </Link>
              </div>
            </article>
            );
          })}
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
              <h3>Активен тариф {selectedPlan.name}.</h3>
              <p>
                {selectedPlan.price} Следующее списание запланировано на 12 апреля
                2026. Изменение тарифа применяется сразу в кабинете и профиле.
              </p>
            </div>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
