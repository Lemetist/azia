import AuthCard from "../../../components/auth/AuthCard";
import styles from "../auth.module.css";

export const metadata = {
  title: "Регистрация — FIT CENTER",
  description:
    "Создайте аккаунт FIT CENTER, заполните анкету и получите персональную программу тренировок.",
};

export default function RegisterPage() {
  return (
    <main className={styles.pageShell}>
      <section className={styles.formWrap}>
        <div className={styles.grid}>
          <article className={styles.heroPane}>
            <h1>Начните путь осознанных тренировок</h1>
            <p>
              Расскажите о целях, уровне и предпочтениях — и получите план,
              который адаптируется под ваш режим. Личный тренер, контроль
              прогресса и доступ к комьюнити внутри одного аккаунта.
            </p>

            <div className={styles.heroStats}>
              <div className={styles.statCard}>
                <p className={styles.statValue}>7 дней</p>
                <p className={styles.statLabel}>до персонального плана</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statValue}>24/7</p>
                <p className={styles.statLabel}>поддержка наставника</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statValue}>360°</p>
                <p className={styles.statLabel}>контроль здоровья и нагрузки</p>
              </div>
            </div>
          </article>

          <AuthCard
            title="Создать аккаунт FIT CENTER"
            subtitle="Заполните анкету и получите стартовую консультацию."
            defaultMode="register"
          />
        </div>
      </section>
    </main>
  );
}