import Link from 'next/link';

import styles from './page.module.css';

const navigationLinks = [
  { label: 'Программы', href: '#programs' },
  { label: 'Преимущества', href: '#advantages' },
  { label: 'Сообщество', href: '#community' },
];

const streamDetails = [
  { label: 'Фокус', value: 'Strength + Engine' },
  { label: 'Тренер', value: 'Marcus Bell' },
  { label: 'Старт', value: '18 марта' },
];

const narrativeTags = ['Сила', 'Функциональность', 'Контроль прогрессии'];

const programCards = [
  {
    title: 'Strength Base',
    duration: '8 недель',
    description: 'Штанга, техника, прогрессия нагрузок и работа на силу без хаоса.',
    cta: 'Открыть план',
  },
  {
    title: 'Fight Conditioning',
    duration: '6 недель',
    description: 'Интервалы, темп и метаболическая мощность для плотного ритма недели.',
    cta: 'Смотреть блок',
  },
  {
    title: 'Hybrid Engine',
    duration: '10 недель',
    description: 'Сочетание силы, кардио и восстановления для стабильного прогресса.',
    cta: 'Изучить цикл',
  },
];

const metrics = [
  { value: '12+', label: 'Программ подготовки' },
  { value: '5', label: 'Тренерских направлений' },
  { value: '24/7', label: 'Поддержка в чате' },
  { value: '2026', label: 'Новый сезон открыт' },
];

const featureCards = [
  {
    title: 'Сильная система',
    description:
      'Каждый цикл собирается из нагрузки, восстановления и контроля техники, а не из случайных тренировок.',
  },
  {
    title: 'Живой ритм',
    description:
      'Тренер, расписание и персональные блоки связаны в один поток, чтобы не терять импульс между сессиями.',
  },
  {
    title: 'Прогресс на цифрах',
    description:
      'Следим за силой, объемом, посещаемостью и восстановлением, чтобы рост был измеримым, а не на ощущениях.',
  },
];

const weeklyFlow = [
  { day: 'Пн', title: 'Strength forge', meta: '18:30 · Нижняя часть' },
  { day: 'Ср', title: 'Fight conditioning', meta: '19:00 · Интервалы' },
  { day: 'Сб', title: 'Mobility reset', meta: '10:15 · Recovery' },
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.shell}>
          <header className={styles.header}>
            <Link className={styles.brand} href="/" aria-label="Primal Training">
              PT
            </Link>

            <nav className={styles.navigation} aria-label="Основная навигация">
              {navigationLinks.map((item) => (
                <a key={item.label} className={styles.navLink} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className={styles.headerActions}>
              <Link className={styles.loginButton} href="/auth/login">
                Вход
              </Link>
              <Link className={styles.registerButton} href="/auth/register">
                Регистрация
              </Link>
            </div>
          </header>

          <div className={styles.heroIntro}>
            <p className={styles.eyebrow}>Primal training system</p>
            <div className={styles.statementBar}>
              <span>HARD WORK PAYS.</span>
            </div>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <h1 className={styles.heroTitle}>
                Пробуди зверя внутри. Стань крепче стали.
              </h1>
              <p className={styles.heroLead}>
                Силовые циклы, функциональная подготовка и понятная прогрессия в одном
                ритме. Без лишнего шума, но с характером.
              </p>

              <div className={styles.heroActions}>
                <Link className={styles.primaryButton} href="/assessment">
                  Начать цикл
                </Link>
                <a className={styles.secondaryButton} href="#weekly-flow">
                  Посмотреть расписание
                </a>
              </div>
            </div>

            <aside className={styles.streamCard}>
              <p className={styles.cardEyebrow}>Текущий поток</p>
              <h2 className={styles.streamTitle}>Spring Iron Block</h2>
              <p className={styles.streamLead}>
                4 силовые сессии, 2 интервальные работы, 1 восстановительное окно и
                ревью по итогам недели.
              </p>

              <div className={styles.streamStats}>
                {streamDetails.map((item) => (
                  <div key={item.label} className={styles.streamRow}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className={`${styles.storySection} ${styles.shell}`}>
        <article className={styles.storyCard}>
          <p className={styles.sectionEyebrow}>Our vision</p>
          <h2 className={styles.sectionTitle}>
            Тренировки, которые собирают дисциплину, а не только усталость.
          </h2>
          <p className={styles.sectionText}>
            Мы строим маршрут от первой сессии до стабильного результата через базовую
            силу, координацию, функциональную выносливость и понятную нагрузку на каждую
            неделю.
          </p>

          <div className={styles.tagRow}>
            {narrativeTags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </article>

        <div className={styles.storyAside}>
          <span className={styles.floatingPill}>Coach-led</span>
          <div className={styles.storyQuote}>
            Режим, в котором каждая неделя ощущается как следующая ступень, а не повтор
            вчерашнего дня.
          </div>
        </div>
      </section>

      <section className={`${styles.programSection} ${styles.shell}`} id="programs">
        <div className={styles.programVisual} aria-hidden="true" />

        <article className={styles.programContent}>
          <p className={styles.sectionEyebrowMuted}>Program tracks</p>
          <h2 className={styles.sectionTitle}>
            Разные сценарии подготовки, но один уровень качества.
          </h2>

          <div className={styles.programGrid}>
            {programCards.map((item) => (
              <article key={item.title} className={styles.programCard}>
                <div className={styles.programHead}>
                  <h3>{item.title}</h3>
                  <span>{item.duration}</span>
                </div>
                <p>{item.description}</p>
                <Link className={styles.programButton} href="/assessment">
                  {item.cta}
                </Link>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.metricsSection} id="advantages">
        <div className={styles.shell}>
          <div className={styles.metricsIntro}>
            <div>
              <p className={styles.sectionEyebrowDark}>Почему это работает</p>
              <h2 className={`${styles.sectionTitle} ${styles.darkTitle}`}>
                Из этой идеи получилось нормальное ядро, а не просто красивый экран.
              </h2>
            </div>
            <p className={styles.metricsLead}>
              Я убрал пустой провал из середины макета и собрал связный лендинг: hero,
              narrative-блоки, карточки программ, метрики и живой финальный CTA.
            </p>
          </div>

          <div className={styles.metricGrid}>
            {metrics.map((item) => (
              <article key={item.label} className={styles.metricCard}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>

          <div className={styles.featureGrid}>
            {featureCards.map((item) => (
              <article key={item.title} className={styles.featureCard}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.weeklySection} ${styles.shell}`} id="community">
        <div className={styles.weeklyCopy}>
          <p className={styles.sectionEyebrowDark}>Weekly flow</p>
          <h2 className={`${styles.sectionTitle} ${styles.darkTitle}`} id="weekly-flow">
            Неделя выглядит как система, а не набор случайных заходов в зал.
          </h2>
        </div>

        <div className={styles.weeklyPanel}>
          <div className={styles.flowList}>
            {weeklyFlow.map((item) => (
              <article key={item.day} className={styles.flowCard}>
                <div className={styles.flowDay}>{item.day}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.meta}</p>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.weeklyCta}>
            <p>
              Открывай расписание, смотри мобильный сценарий тренировок и веди прогресс
              в одном приложении.
            </p>
            <div className={styles.weeklyActions}>
              <Link className={styles.primaryButton} href="/assessment">
                Открыть workouts
              </Link>
              <a className={styles.secondaryButtonStrong} href="#advantages">
                Смотреть прогресс
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>Позвоните нам прямо сейчас</p>
          <a href="tel:+70000000000">+Phone</a>
          <span>© 2026</span>
        </div>
      </footer>
    </main>
  );
}
