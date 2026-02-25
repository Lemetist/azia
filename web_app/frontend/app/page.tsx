"use client";

import { useState } from "react";
import styles from "./page.module.css";

const heroImage =
  "https://www.figma.com/api/mcp/asset/bfafd760-8aa9-44c6-acff-afd08a00c360";
const featureImgTall =
  "https://www.figma.com/api/mcp/asset/7c2e4795-0557-46d0-92b7-9172ef487f7e";
const featureImgWideTop =
  "https://www.figma.com/api/mcp/asset/a88d7b51-52b0-44be-b8e1-4e890346b6f4";
const featureImgWideBottom =
  "https://www.figma.com/api/mcp/asset/5403ade4-773f-4a34-a814-3ee6db1ab371";
const iconStart =
  "https://www.figma.com/api/mcp/asset/dbc81489-6c7b-4ec1-abcd-53898428c82a";
const iconAnywhere =
  "https://www.figma.com/api/mcp/asset/6af52e33-953c-43c1-8316-88fee2122b53";
const iconProgress =
  "https://www.figma.com/api/mcp/asset/926d105d-5cb8-434d-99c5-e91bee87863a";
const googleLogo = "https://www.svgrepo.com/show/475656/google-color.svg";
const footerBg =
  "https://www.figma.com/api/mcp/asset/a187d1e4-d33d-4b88-92a0-021d594c1790";

const coachTiles = [
  {
    src: "https://www.figma.com/api/mcp/asset/7ce8c9ef-d24f-4da0-8a62-5d186d07a98a",
    alt: "Футбольный мяч на поле",
  },
  {
    src: "https://www.figma.com/api/mcp/asset/a742363d-addd-463c-8f27-21621554288c",
    alt: "Пловец в бассейне",
  },
  {
    src: "https://www.figma.com/api/mcp/asset/8a821eb7-63bb-478f-8f8b-e35673d0db69",
    alt: "Бегун в тумане",
  },
  {
    src: "https://www.figma.com/api/mcp/asset/06de155d-81de-4983-bd00-50041dd2b8f9",
    alt: "Работа на тренажере",
  },
  {
    src: "https://www.figma.com/api/mcp/asset/1204e420-2cdb-44c9-b751-04b6904774af",
    alt: "Борьба на татами",
  },
  {
    src: "https://www.figma.com/api/mcp/asset/29d63f3b-6a3c-4409-8205-3f6bdbca2d12",
    alt: "Тренер в зале",
  },
];

const reasons = [
  {
    icon: iconStart,
    title: "Программа для любого уровня",
    description:
      "Индивидуальный план с учетом ваших целей и стартовых показателей.",
  },
  {
    icon: iconAnywhere,
    title: "Тренируйтесь где удобно",
    description:
      "Стадион, зал или дом — подстраиваемся под ваш график и локацию.",
  },
  {
    icon: iconProgress,
    title: "Видимый прогресс",
    description:
      "Регулярные замеры и сопровождение тренером, чтобы держать фокус.",
  },
];

export default function HomePage() {
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navBrand}>FIT CENTER</div>
          <nav className={styles.navMenu} aria-label="Основная навигация">
            <ul className={styles.navLinks}>
              <li>
                <a href="#why">Почему мы</a>
              </li>
              <li>
                <a href="#coaches">Тренеры</a>
              </li>
              <li>
                <a href="#auth">Записаться</a>
              </li>
            </ul>
          </nav>
          <div className={styles.navActions}>
            <a className={styles.navGhost} href="#auth">
              Войти
            </a>
            <a className={styles.navPrimary} href="#auth">
              Начать
            </a>
          </div>
        </div>
      </header>

      <section className={styles.hero} id="hero">
        <img className={styles.heroImage} src={heroImage} alt="Спортзал" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <h1 className={styles.heroHeadline}>HARD WORK PAYS.</h1>
      </section>

      <section className={styles.section} id="why">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2>Почему выбирают нас</h2>
            <p>
              Команда тренеров, гибкие форматы и современный инвентарь — все для
              того, чтобы вы достигли цели.
            </p>
          </div>
          <div className={styles.whyGrid}>
            <div className={styles.reasonList}>
              {reasons.map((reason) => (
                <article className={styles.reason} key={reason.title}>
                  <div className={styles.iconWrap}>
                    <img
                      className={styles.icon}
                      src={reason.icon}
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3>{reason.title}</h3>
                    <p>{reason.description}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className={styles.whyImages} aria-hidden="true">
              <div className={styles.whyTall}>
                <img src={featureImgTall} alt="Тренировка" />
              </div>
              <div className={styles.whyStack}>
                <img src={featureImgWideTop} alt="Командная тренировка" />
                <img src={featureImgWideBottom} alt="Инвентарь" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.coaches}`} id="coaches">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2>Познакомьтесь с нашими тренерами</h2>
            <p>
              Каждый блок — часть одной команды: функциональный тренинг,
              плавание, футбол и борьба.
            </p>
          </div>
          <div className={styles.coachRows} role="list">
            <div
              className={styles.coachRow}
              role="listitem"
              aria-label="Тренеры, верхний ряд"
            >
              <div className={`${styles.coachTile} ${styles.tileSmall}`}>
                <img src={coachTiles[0].src} alt={coachTiles[0].alt} />
              </div>
              <div className={`${styles.coachTile} ${styles.tileFlex}`}>
                <img src={coachTiles[1].src} alt={coachTiles[1].alt} />
              </div>
              <div
                className={`${styles.coachTile} ${styles.tileSmall} ${styles.tileOffset}`}
              >
                <img src={coachTiles[2].src} alt={coachTiles[2].alt} />
              </div>
            </div>
            <div
              className={styles.coachRow}
              role="listitem"
              aria-label="Тренеры, нижний ряд"
            >
              <div className={`${styles.coachTile} ${styles.tileFlex}`}>
                <img src={coachTiles[3].src} alt={coachTiles[3].alt} />
              </div>
              <div
                className={`${styles.coachTile} ${styles.tileSmall} ${styles.tileOffset}`}
              >
                <img src={coachTiles[4].src} alt={coachTiles[4].alt} />
              </div>
              <div className={`${styles.coachTile} ${styles.tileFlex}`}>
                <img src={coachTiles[5].src} alt={coachTiles[5].alt} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.auth} id="auth">
        <div className={`${styles.sectionInner} ${styles.authInner}`}>
          <div className={styles.authCard}>
            <div
              className={styles.authTabs}
              role="tablist"
              aria-label="Переключение форм"
            >
              <button
                className={[
                  styles.authTab,
                  authTab === "login" ? styles.active : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                type="button"
                role="tab"
                aria-selected={authTab === "login"}
                onClick={() => setAuthTab("login")}
              >
                Войти
              </button>
              <button
                className={[
                  styles.authTab,
                  authTab === "register" ? styles.active : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                type="button"
                role="tab"
                aria-selected={authTab === "register"}
                onClick={() => setAuthTab("register")}
              >
                Регистрация
              </button>
            </div>

            <form className={styles.authForm}>
              {authTab === "register" && (
                <label className={styles.authField}>
                  <span className={styles.authLabel}>Имя и фамилия</span>
                  <span className={styles.inputShell}>
                    <span className={styles.inputIcon}>👤</span>
                    <input name="fullName" type="text" placeholder="Ваше имя" />
                  </span>
                </label>
              )}
              <label className={styles.authField}>
                <span className={styles.authLabel}>Email</span>
                <span className={styles.inputShell}>
                  <span className={styles.inputIcon}>✉️</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="example@mail.com"
                  />
                </span>
              </label>
              <label className={styles.authField}>
                <span className={styles.authLabel}>Пароль</span>
                <span className={styles.inputShell}>
                  <span className={styles.inputIcon}>🔒</span>
                  <input
                    name="password"
                    type="password"
                    placeholder="Минимум 8 символов"
                  />
                </span>
              </label>
              <button className={styles.ctaPrimary} type="button">
                {authTab === "login" ? "Войти" : "Создать аккаунт"}
              </button>
            </form>

            <div className={styles.divider} aria-hidden="true">
              <span>или</span>
            </div>
            <button className={styles.ctaGoogle} type="button">
              <span className={styles.googleMark}>
                <img src={googleLogo} alt="Google" />
              </span>
              Продолжить с Google
            </button>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBg} aria-hidden="true">
          <img src={footerBg} alt="" />
          <div className={styles.footerOverlay} />
        </div>
        <div className={styles.footerContent}>
          <p>Готовы выйти на новый уровень?</p>
          <h3>Присоединения уже сейчас</h3>
          <div className={styles.footerNote}>Ежедневно с 7:00 до 23:00</div>
        </div>
      </footer>
    </main>
  );
}
