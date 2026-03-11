import Link from 'next/link';

import styles from './page.module.css';

const heroBackground =
  'https://www.figma.com/api/mcp/asset/cc575220-a357-4221-98b5-d29f24860867';

const navigationLinks = [
  { label: 'Главная', href: '#home' },
  { label: 'Программы', href: '#programs' },
  { label: 'Формат', href: '#format' },
  { label: 'Контакты', href: '#contacts' },
];

const heroStats = [
  { value: '12+', label: 'авторских программ' },
  { value: '5', label: 'профильных направлений' },
  { value: '98%', label: 'удержания дисциплины' },
];

const programCards = [
  {
    title: 'Strength Base',
    level: 'для силы',
    description:
      'Системная прогрессия, техника базовых движений и силовой цикл под конкретную цель.',
  },
  {
    title: 'Combat Engine',
    level: 'для выносливости',
    description:
      'Функциональные круги, интервальные блоки и работа в темпе, который держит вас в форме.',
  },
  {
    title: 'Athlete Reset',
    level: 'для восстановления',
    description:
      'Мобильность, контроль нагрузки и возвращение в режим без перегруза и хаоса.',
  },
];

const principles = [
  'Тренировки строятся вокруг режима, а не вокруг мотивационных всплесков.',
  'Каждая неделя имеет измеримую цель и понятную нагрузку.',
  'Тренер, чат и трекер прогресса работают как одна система.',
];

const formatCards = [
  {
    title: 'Стартовая диагностика',
    text: 'Фиксируем цели, ограничения, историю тренировок и текущую точку формы.',
  },
  {
    title: 'План на 6 недель',
    text: 'Вы получаете структуру по нагрузке, восстановлению, контролю и питанию.',
  },
  {
    title: 'Еженедельная корректировка',
    text: 'Программа обновляется по факту вашего прогресса, а не по шаблону.',
  },
];

const metrics = [
  { value: '24/7', label: 'связь с наставником' },
  { value: '150+', label: 'спортсменов в системе' },
  { value: '360°', label: 'контроль нагрузки и сна' },
  { value: '2026', label: 'новый сезон открыт' },
];

export default function HomePage() {
  return (
    <main className={styles.page} id="home">
      <section className={styles.hero}>
        <div
          className={styles.heroImage}
          style={{ backgroundImage: `url(${heroBackground})` }}
          aria-hidden="true"
        />
        <div className={styles.heroMask} aria-hidden="true" />

        <header className={styles.nav}>
          <button className={styles.search} type="button" aria-label="Поиск">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M11 4.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 0 0 0-13Zm0-2a8.5 8.5 0 1 1-5.33 15.12l-3.14 3.14a1 1 0 1 1-1.41-1.41l3.14-3.14A8.5 8.5 0 0 1 11 2.5Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <nav className={styles.navMenu} aria-label="Основное меню">
            {navigationLinks.map((item, index) => {
              const isActive = index === 0;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`.trim()}
                >
                  <span>{item.label}</span>
                  {isActive ? <span className={styles.activeLine} aria-hidden="true" /> : null}
                </a>
              );
            })}
          </nav>

          <div className={styles.authActions}>
            <Link className={styles.loginButton} href="/auth/login">
              Вход
            </Link>
            <Link className={styles.registerButton} href="/auth/register">
              Регистрация
            </Link>
          </div>
        </header>

        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>primal training system</p>
            <h1 className={styles.heroHeadline}>HARD WORK PAYS.</h1>
            <p className={styles.heroLead}>
              Не просто тренировки, а режим, в котором сила, выносливость и дисциплина
              становятся системой. FIT CENTER соединяет нагрузку, аналитику и сопровождение
              в один рабочий цикл.
            </p>

            <div className={styles.heroActions}>
              <Link className={styles.primaryCta} href="/auth/register">
                Начать сейчас
              </Link>
              <a className={styles.secondaryCta} href="#programs">
                Посмотреть программы
              </a>
            </div>

            <div className={styles.heroStatsRow}>
              {heroStats.map((item) => (
                <article key={item.label} className={styles.heroStatCard}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
          </div>

          <aside className={styles.heroPanel}>
            <p className={styles.heroPanelLabel}>Режим недели</p>
            <div className={styles.heroPanelMetric}>
              <strong>5/7</strong>
              <span>тренировочных дней</span>
            </div>
            <ul className={styles.heroChecklist}>
              <li>силовой блок</li>
              <li>кардио-сессия</li>
              <li>восстановление и мобильность</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className={styles.programSection} id="programs">
        <div className={styles.sectionHeader}>
          <p>Ключевые программы</p>
          <h2>Три маршрута под разные задачи, но один стандарт нагрузки</h2>
        </div>

        <div className={styles.programGrid}>
          {programCards.map((item) => (
            <article key={item.title} className={styles.programCard}>
              <span>{item.level}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.showcaseSection}>
        <article className={styles.showcasePanel}>
          <p className={styles.showcaseEyebrow}>our vision</p>
          <h2>Пробуди зверя внутри. Стань крепче стали.</h2>
          <p>
            Primal Training - это программа тренировок, основанная на сырой силе,
            функциональном фитнесе и надежной поддержке сообщества. Мы помогаем участникам
            раскрыть первобытную мощь, укрепить дисциплину и выйти на уровень, где результат
            становится новой нормой.
          </p>
          <ul className={styles.principlesList}>
            {principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <div
          className={styles.showcaseImage}
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(17, 17, 17, 0.08), rgba(17, 17, 17, 0.48)), url(${heroBackground})`,
          }}
        >
          <div className={styles.visionOverlayCard}>
            <span>Функциональная сила</span>
            <strong>Скорость, техника, выносливость</strong>
          </div>
        </div>
      </section>

      <section className={styles.metricsSection}>
        <div className={styles.metricsInner}>
          <div className={styles.sectionHeaderCompact}>
            <p>Почему это работает</p>
            <h2>Одна экосистема вместо разрозненных действий</h2>
          </div>

          <div className={styles.metricsGrid}>
            {metrics.map((item) => (
              <article key={item.label} className={styles.metricCard}>
                <div className={styles.metricValue}>{item.value}</div>
                <p>{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.formatSection} id="format">
        <div className={styles.formatIntro}>
          <p>Формат работы</p>
          <h2>Путь построен так, чтобы прогресс был управляемым и видимым</h2>
        </div>

        <div className={styles.formatGrid}>
          {formatCards.map((item, index) => (
            <article key={item.title} className={styles.formatCard}>
              <span className={styles.formatIndex}>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection} id="contacts">
        <div className={styles.ctaContent}>
          <p>Готовы включиться в систему</p>
          <h2>Возьмите первый цикл на 6 недель и начните работать в ритме результата</h2>
          <div className={styles.heroActions}>
            <Link className={styles.primaryCta} href="/auth/register">
              Получить план
            </Link>
            <a className={styles.secondaryCtaLight} href="tel:+70000000000">
              +7 (000) 000-00-00
            </a>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <p className={styles.footerLabel}>FIT CENTER</p>
            <p className={styles.footerText}>
              Система подготовки для тех, кто хочет не просто начать, а удержать темп и дойти до результата.
            </p>
          </div>
          <div>
            <p className={styles.footerLabel}>Контакты</p>
            <p className={styles.footerText}>+7 (000) 000-00-00</p>
            <p className={styles.footerText}>hello@fit-center.ru</p>
          </div>
          <div>
            <p className={styles.footerLabel}>Навигация</p>
            <div className={styles.footerLinks}>
              {navigationLinks.map((item) => (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className={styles.copyright}>© 2026 FIT CENTER</p>
      </footer>
    </main>
  );
}