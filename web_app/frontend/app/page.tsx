import Link from "next/link";

import styles from "./page.module.css";

const navigationLinks = [
  { label: "Треки", href: "#tracks" },
  { label: "Платформа", href: "#workspace" },
  { label: "Маршрут", href: "#journey" },
];

const heroMetrics = [
  { value: "12+", label: "структурированных циклов" },
  { value: "5", label: "тренерских специализаций" },
  { value: "91%", label: "средняя посещаемость" },
];

const streamDetails = [
  { label: "Фокус", value: "Сила + выносливость" },
  { label: "Тренер", value: "Marcus Bell" },
  { label: "Следующий слот", value: "18:30 сегодня" },
];

const weeklyFlow = [
  { day: "Пн", title: "Силовая база", meta: "Низ тела · 18:30", href: "/schedule" },
  { day: "Ср", title: "Бойцовская выносливость", meta: "Интервалы · 19:00", href: "/workouts" },
  { day: "Сб", title: "Мобилити-сброс", meta: "Восстановление · 10:15", href: "/progress" },
];

const programCards = [
  {
    title: "Силовая база",
    duration: "8 недель",
    description: "База силы, техника со штангой и постепенная прогрессия без перегруза.",
    href: "/assessment",
  },
  {
    title: "Гибридная выносливость",
    duration: "10 недель",
    description: "Силовые блоки, кардио и восстановление в едином недельном ритме.",
    href: "/workouts",
  },
  {
    title: "Бойцовская форма",
    duration: "6 недель",
    description: "Плотная кондиционная работа, интервалы и взрывная мощность.",
    href: "/coaches",
  },
];

const workspaceCards = [
  {
    title: "Тренировки",
    eyebrow: "Мобильный сценарий",
    description: "Подборка тренировок, длительность, фазы сессии и быстрый запуск из одного экрана.",
    href: "/workouts",
  },
  {
    title: "Расписание",
    eyebrow: "Десктопный контроль",
    description: "Слоты, загрузка недели и быстрые записи на занятия без хаоса в календаре.",
    href: "/schedule",
  },
  {
    title: "Прогресс",
    eyebrow: "Метрики",
    description: "Тренировочный объем, цели и восстановление в аналитическом формате.",
    href: "/progress",
  },
];

const journeySteps = [
  {
    index: "01",
    title: "Выбери цель",
    description: "Короткий onboarding собирает задачу: сила, рекомпозиция, выносливость или возврат в форму.",
  },
  {
    index: "02",
    title: "Получай маршрут",
    description: "После оценки открывается релевантный сценарий: тренировки, расписание и тренерский контекст.",
  },
  {
    index: "03",
    title: "Отслеживай прогресс",
    description: "Платформа связывает посещаемость, нагрузку и восстановление, чтобы курс не распадался через неделю.",
  },
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.shell} ${styles.heroShell}`}>
          <header className={styles.header}>
            <Link className={styles.brand} href="/" aria-label="Primal Training">
              <span className={styles.brandMark} aria-hidden="true">
                <span className={styles.brandIconPlate} />
                <span className={styles.brandIconBar} />
                <span className={styles.brandIconPlate} />
              </span>
              <span className={styles.brandText}>
                <strong>Primal Training</strong>
                <span>System-led fitness</span>
              </span>
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

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Primal training system</p>
              <h1 className={styles.heroTitle}>
                Сильный фитнес-клуб с маршрутом, а не набором случайных экранов.
              </h1>
              <p className={styles.heroLead}>
                Персональный onboarding, понятные тренировочные циклы, расписание и
                аналитика прогресса собраны в одну систему. Вход в продукт начинается
                без лишнего шума и без потерянных шагов.
              </p>

              <div className={styles.heroActions}>
                <Link className={styles.primaryButton} href="/assessment">
                  Начать оценку
                </Link>
                <Link className={styles.secondaryButton} href="/workouts">
                  Смотреть тренировки
                </Link>
              </div>

              <div className={styles.metricRow}>
                {heroMetrics.map((item) => (
                  <article key={item.label} className={styles.metricChip}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </article>
                ))}
              </div>
            </div>

            <aside className={styles.heroPanel}>
              <div className={styles.panelTop}>
                <p className={styles.panelEyebrow}>Текущий блок</p>
                <h2 className={styles.panelTitle}>Spring Iron Cycle</h2>
                <p className={styles.panelLead}>
                  4 силовые сессии, 2 кондиционных блока и окно восстановления в конце
                  недели.
                </p>
              </div>

              <div className={styles.panelStats}>
                {streamDetails.map((item) => (
                  <div key={item.label} className={styles.panelRow}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>

              <div className={styles.panelFlow}>
                <div className={styles.panelFlowHead}>
                  <p>Живой ритм недели</p>
                  <Link href="/schedule">Открыть</Link>
                </div>

                <div className={styles.flowList}>
                  {weeklyFlow.map((item) => (
                    <Link key={item.day} className={styles.flowCard} href={item.href}>
                      <span className={styles.flowDay}>{item.day}</span>
                      <span className={styles.flowCopy}>
                        <strong>{item.title}</strong>
                        <span>{item.meta}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className={`${styles.storySection} ${styles.shell}`}>
        <article className={styles.storyCard}>
          <p className={styles.sectionEyebrow}>Подход</p>
          <h2 className={styles.sectionTitle}>
            Каждая часть продукта продолжает предыдущую, а не существует отдельно.
          </h2>
          <p className={styles.sectionText}>
            Сначала пользователь понимает логику клуба, затем выбирает цель, получает
            маршрут и переходит в рабочие разделы кабинета. Так onboarding, тренировки
            и кабинет ощущаются одной системой.
          </p>
        </article>

        <div className={styles.storyAside}>
          <span className={styles.floatingPill}>Coach-led + data-aware</span>
          <p className={styles.storyQuote}>
            Каждый следующий экран продолжает сценарий пользователя, а не обрывает его.
          </p>
        </div>
      </section>

      <section className={`${styles.tracksSection} ${styles.shell}`} id="tracks">
        <div className={styles.sectionIntro}>
          <div>
            <p className={styles.sectionEyebrowDark}>Треки подготовки</p>
            <h2 className={`${styles.sectionTitle} ${styles.darkTitle}`}>
              Разные цели, один стандарт качества и один визуальный язык.
            </h2>
          </div>
          <p className={styles.sectionLead}>
            Программы связаны с реальными разделами приложения, поэтому пользователь
            может перейти от обещания к действию в один клик.
          </p>
        </div>

        <div className={styles.programGrid}>
          {programCards.map((item) => (
            <article key={item.title} className={styles.programCard}>
              <div className={styles.programHead}>
                <h3>{item.title}</h3>
                <span>{item.duration}</span>
              </div>
              <p>{item.description}</p>
              <Link className={styles.programButton} href={item.href}>
                Открыть
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.workspaceSection} id="workspace">
        <div className={styles.shell}>
          <div className={styles.sectionIntro}>
            <div>
              <p className={styles.sectionEyebrow}>Платформа</p>
              <h2 className={styles.sectionTitle}>
                Основные разделы теперь собраны в ясную продуктовую витрину.
              </h2>
            </div>
            <p className={`${styles.sectionLead} ${styles.sectionLeadLight}`}>
              Вместо абстрактного лендинга пользователь видит, какие сценарии уже
              доступны: подбор тренировки, расписание и аналитика прогресса.
            </p>
          </div>

          <div className={styles.workspaceGrid}>
            {workspaceCards.map((item) => (
              <article key={item.title} className={styles.workspaceCard}>
                <p className={styles.cardEyebrow}>{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link className={styles.inlineLink} href={item.href}>
                  Перейти в раздел
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.journeySection} ${styles.shell}`} id="journey">
        <div className={styles.journeyCopy}>
          <p className={styles.sectionEyebrowDark}>Маршрут пользователя</p>
          <h2 className={`${styles.sectionTitle} ${styles.darkTitle}`}>
            От первого касания до регулярной тренировки путь стал короче и чище.
          </h2>
        </div>

        <div className={styles.journeyPanel}>
          <div className={styles.journeyList}>
            {journeySteps.map((item) => (
              <article key={item.index} className={styles.journeyCard}>
                <span>{item.index}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.ctaCard}>
            <p>
              Начните с короткой оценки цели, чтобы открыть релевантный сценарий:
              тренировочный план, недельное расписание и трек прогресса.
            </p>
            <div className={styles.ctaActions}>
              <Link className={styles.primaryButton} href="/assessment">
                Открыть оценку
              </Link>
              <Link className={styles.secondaryButtonStrong} href="/schedule">
                Смотреть расписание
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.shell} ${styles.footerInner}`}>
          <p>Primal Training</p>
          <a href="tel:+70000000000">+7 000 000 00 00</a>
          <span>Фитнес-платформа и кабинет клуба, 2026</span>
        </div>
      </footer>
    </main>
  );
}
