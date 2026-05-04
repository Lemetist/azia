import AuthCard from "../../../components/auth/AuthCard";
import styles from "../auth.module.css";

export const metadata = {
  title: "Вход — Primal Training",
  description:
    "Авторизуйтесь в кабинете Primal Training, чтобы вернуться к расписанию, тренировкам и прогрессу.",
};

export default function LoginPage() {
  return (
    <main className={styles.pageShell}>
      <section className={styles.formWrap}>
        <div className={styles.grid}>
          <article className={styles.heroPane}>
            <p className={styles.eyebrow}>Primal training system</p>
            <h1>С возвращением в систему.</h1>
            <p>
              Авторизуйтесь, чтобы вернуться к расписанию, прогрессу и
              персональному плану без лишних шагов.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroChip}>Доступ к тренировкам</span>
              <span className={styles.heroChip}>Чат с тренером</span>
              <span className={styles.heroChip}>История прогресса</span>
            </div>
          </article>

          <AuthCard mode="login" />
        </div>
      </section>
    </main>
  );
}
