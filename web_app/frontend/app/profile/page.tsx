"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import DashboardShell from "../../components/dashboard/DashboardShell";
import ProfileIdentityCard from "../../components/dashboard/ProfileIdentityCard";
import {
  membershipPlanStorageKey,
  plans,
  profilePreferences,
} from "../../components/dashboard/dashboard-data";
import { ensureSessionUser, type SessionUser } from "../../lib/session";
import styles from "../../components/dashboard/dashboard-page.module.css";

export const dynamic = "force-dynamic";

function formatProfileMetric(value: string, unit: string) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return `${value} ${unit}`;
  }

  return `${new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 1,
  }).format(numericValue)} ${unit}`;
}

export default function ProfilePage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [membershipPlanName, setMembershipPlanName] = useState<string>(plans[0].name);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const currentUser = await ensureSessionUser();
        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        if (cancelled) {
          return;
        }
        setUser(null);
      }
    }

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const storedPlanName = window.localStorage.getItem(membershipPlanStorageKey);

    if (storedPlanName && plans.some((plan) => plan.name === storedPlanName)) {
      setMembershipPlanName(storedPlanName);
    }
  }, []);

  const profile = user?.profile;
  const profileFacts = profile
    ? [
        { label: "Цель", value: profile.goal_label },
        { label: "Анкета", value: `${profile.sex_label}, ${profile.age} лет` },
        {
          label: "Параметры",
          value: `${formatProfileMetric(profile.height_cm, "см")} · ${formatProfileMetric(
            profile.weight_kg,
            "кг",
          )}`,
        },
      ]
    : [
        { label: "Цель", value: "Анкета еще не заполнена" },
        { label: "Анкета", value: "Нет данных" },
        { label: "Параметры", value: "Нет данных" },
      ];

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
                <p className={styles.sessionMeta}>Тариф «{membershipPlanName}», автопродление включено.</p>
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

        {profile ? (
          <div className={styles.doubleGrid}>
            <article className={`${styles.panel} ${styles.panelMedium}`}>
              <h3 className={styles.sectionTitle}>Рекомендации по питанию</h3>
              <div className={styles.sessionList}>
                {profile.nutrition_recommendations.map((item) => (
                  <div className={styles.sessionCard} key={item.label}>
                    <div className={styles.sessionHead}>
                      <strong>{item.label}</strong>
                      <span className={styles.statusTag}>{item.value}</span>
                    </div>
                    <p className={styles.sessionMeta}>{item.note}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className={`${styles.panel} ${styles.panelMedium}`}>
              <h3 className={styles.sectionTitle}>Тренировка на день</h3>
              <div className={styles.sessionCard}>
                <div className={styles.sessionHead}>
                  <strong>{profile.daily_workout.title}</strong>
                  <span className={styles.tag}>{profile.daily_workout.intensity}</span>
                </div>
                <p className={styles.sessionMeta}>
                  {profile.daily_workout.duration} · {profile.daily_workout.focus}
                </p>
              </div>
              <div className={styles.sessionList}>
                {profile.daily_workout.blocks.map((block) => (
                  <div className={styles.timelineCard} key={block}>
                    <p className={styles.listValue}>{block}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        ) : null}
      </section>
    </DashboardShell>
  );
}
