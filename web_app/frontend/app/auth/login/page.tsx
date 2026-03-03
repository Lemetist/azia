import AuthCard, { Credentials } from "../../../components/auth/AuthCard";
import styles from "../auth.module.css";

export const metadata = {
  title: "Вход — FIT CENTER",
  description:
    "Авторизуйтесь в личном кабинете FIT CENTER, чтобы получать персональные тренировки и рекомендации тренеров.",
};

export default function LoginPage() {
  const handleLogin = async (credentials: Credentials) => {
    console.log("Login credentials", credentials);
  };

  return (
    <main className={styles.pageShell}>
      <section className={styles.formWrap}>
        <div className={styles.grid}>
          <article className={styles.heroPane}>
            <h1>Сила системы в дисциплине</h1>
            <p>
              FIT CENTER объединяет тренеров, данные и поддержку, чтобы вы
              добивались результата. Войдите в аккаунт и продолжайте движение по
              персональному плану.
            </p>

            <div className={styles.heroStats}>
              <div className={styles.statCard}>
                <p className={styles.statValue}>150+</p>
                <p className={styles.statLabel}>сертифицированных тренеров</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statValue}>12K</p>
                <p className={styles.statLabel}>
                  активных спортсменов в сообществе
                </p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statValue}>98%</p>
                <p className={styles.statLabel}>доведённых до результата</p>
              </div>
            </div>
          </article>

          <AuthCard
            title="Войти в FIT CENTER"
            subtitle="Следите за планом, получайте задания и держите связь с тренером."
            defaultMode="login"
            onLogin={handleLogin}
          />
        </div>
      </section>
    </main>
  );
}