import AuthCard from "../../../components/auth/AuthCard";
import styles from "../auth.module.css";

export const metadata = {
  title: "Регистрация — Primal Training",
  description:
    "Создайте аккаунт Primal Training и получите доступ к onboarding, тренировочным циклам и кабинету клуба.",
};

export default function RegisterPage() {
  return (
    <main className={styles.pageShell}>
      <section className={styles.formWrap}>
        <div className={styles.grid}>
          <article className={styles.heroPane}>
            <p className={styles.eyebrow}>Primal training system</p>
            <h1>Присоединяйся.</h1>
            <p>
              Создайте аккаунт, чтобы получить доступ к тренировочным циклам,
              сопровождению тренера и персональному ритму подготовки.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroChip}>Персональный план</span>
              <span className={styles.heroChip}>Трекинг нагрузки</span>
              <span className={styles.heroChip}>Старт за 1 минуту</span>
            </div>
          </article>

          <AuthCard mode="register" />
        </div>
      </section>
    </main>
  );
}
