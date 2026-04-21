"use client";

import { useEffect, useState } from "react";

import { getDisplayName, getStoredUser, type SessionUser } from "../../lib/session";
import styles from "./dashboard-page.module.css";

export default function ProfileIdentityCard() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const displayName = getDisplayName(user);

  return (
    <div className={styles.mediaContent}>
      <p className={styles.tag}>Карточка атлета</p>
      <h3>{displayName}</h3>
      <p>
        {user ? (
          <>
            Аккаунт подключен к кабинету через email {user.email}. Здесь собраны
            персональные настройки, статусы сессии и рабочий ритм тренировочного цикла.
          </>
        ) : (
          <>
            Здесь собраны персональные настройки, статусы сессии и рабочий ритм
            тренировочного цикла.
          </>
        )}
      </p>
      {user ? (
        <div className={styles.coachMeta}>
          <span className={styles.miniTag}>{user.email}</span>
          <span className={styles.statusTag}>Сессия активна</span>
        </div>
      ) : null}
    </div>
  );
}
