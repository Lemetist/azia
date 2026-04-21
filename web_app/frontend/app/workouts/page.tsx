"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchSessionJson } from "../../lib/session";
import styles from "./workouts.module.css";

type WorkoutTone = "gold" | "indigo" | "coral";
type WorkoutAccent = WorkoutTone | "mint";
type WorkoutCategory = "strength" | "cardio" | "mobility";

type WorkoutPhase = {
  label: string;
  value: string;
  tone: WorkoutTone;
  width: string;
};

type WorkoutItem = {
  slug: string;
  title: string;
  list_meta: string;
  detail_meta: string;
  description: string;
  category: WorkoutCategory;
  accent: WorkoutAccent;
  duration: string;
  calories: string;
  level: string;
  hero_eyebrow: string;
  hero_lead: string;
  phases: WorkoutPhase[];
  days: string[];
};

type WorkoutDay = {
  id: string;
  month: string;
  day: string;
  label: string;
};

type WorkoutCatalogResponse = {
  days: WorkoutDay[];
  filters: Array<{ key: WorkoutCategory; label: string }>;
  workouts: WorkoutItem[];
};

const fallbackWorkoutDays: WorkoutDay[] = [
  { id: "mon", month: "Apr", day: "21", label: "Пн" },
  { id: "tue", month: "Apr", day: "22", label: "Вт" },
  { id: "wed", month: "Apr", day: "23", label: "Ср" },
  { id: "thu", month: "Apr", day: "24", label: "Чт" },
];

const fallbackWorkoutFilters: Array<{ key: WorkoutCategory; label: string }> = [
  { key: "strength", label: "Strength" },
  { key: "cardio", label: "Cardio" },
  { key: "mobility", label: "Mobility" },
];

const fallbackWorkouts: WorkoutItem[] = [
  {
    slug: "strength-forge",
    title: "Strength Forge",
    list_meta: "52 min · Upper body",
    detail_meta: "Тяги, жим и плотный контроль темпа без провалов по технике.",
    description: "Силовой блок дня для верха тела с контролируемыми паузами и добивкой корпуса.",
    category: "strength",
    accent: "indigo",
    duration: "52 min",
    calories: "540 kcal",
    level: "Level 04",
    hero_eyebrow: "12-week plan",
    hero_lead: "Главный силовой слот недели уже собран и готов к запуску.",
    phases: [
      { label: "Warm-up", value: "12 min", tone: "gold", width: "34%" },
      { label: "Strength", value: "28 min", tone: "indigo", width: "82%" },
      { label: "Mobility", value: "12 min", tone: "coral", width: "42%" },
    ],
    days: ["mon", "wed"],
  },
  {
    slug: "pool-conditioning",
    title: "Pool Conditioning",
    list_meta: "38 min · Cardio",
    detail_meta: "Плавание на темпе с коротким восстановлением между отрезками.",
    description: "Кардио-сессия для дыхания, ритма и разгрузки суставов после силового блока.",
    category: "cardio",
    accent: "gold",
    duration: "38 min",
    calories: "410 kcal",
    level: "Level 03",
    hero_eyebrow: "Engine reset",
    hero_lead: "Смена фокуса на выносливость без потери восстановительного окна.",
    phases: [
      { label: "Prep", value: "8 min", tone: "gold", width: "26%" },
      { label: "Intervals", value: "22 min", tone: "indigo", width: "78%" },
      { label: "Cooldown", value: "8 min", tone: "coral", width: "30%" },
    ],
    days: ["tue", "thu"],
  },
  {
    slug: "mobility-reset",
    title: "Mobility Reset",
    list_meta: "24 min · Recovery",
    detail_meta: "Мягкая подвижность, дыхание и разгрузка после насыщенных дней.",
    description: "Короткая recovery-сессия для суставов, дыхания и снижения накопленной усталости.",
    category: "mobility",
    accent: "mint",
    duration: "24 min",
    calories: "140 kcal",
    level: "Level 01",
    hero_eyebrow: "Recovery mode",
    hero_lead: "Экран восстановления, который не дает неделе развалиться на пике нагрузки.",
    phases: [
      { label: "Breathing", value: "6 min", tone: "gold", width: "22%" },
      { label: "Mobility", value: "14 min", tone: "coral", width: "66%" },
      { label: "Reset", value: "4 min", tone: "indigo", width: "18%" },
    ],
    days: ["wed", "thu"],
  },
  {
    slug: "tempo-run",
    title: "Tempo Run",
    list_meta: "34 min · Track",
    detail_meta: "Беговой темп с ровным дыханием и постепенным выходом в целевую скорость.",
    description: "Беговая работа на пороге: устойчивый темп, техника шага и экономичность.",
    category: "cardio",
    accent: "coral",
    duration: "34 min",
    calories: "360 kcal",
    level: "Level 03",
    hero_eyebrow: "Run economy",
    hero_lead: "Сценарий для ускорения темпа без резкого скачка тренировочного стресса.",
    phases: [
      { label: "Warm-up", value: "10 min", tone: "gold", width: "32%" },
      { label: "Tempo", value: "18 min", tone: "coral", width: "74%" },
      { label: "Walkdown", value: "6 min", tone: "indigo", width: "24%" },
    ],
    days: ["mon", "thu"],
  },
  {
    slug: "leg-power",
    title: "Leg Power",
    list_meta: "46 min · Lower body",
    detail_meta: "Низ тела, взрывная работа и силовая плотность без лишнего объема.",
    description: "Тяжелый блок на ноги с акцентом на силу, скорость штанги и контроль техники.",
    category: "strength",
    accent: "indigo",
    duration: "46 min",
    calories: "500 kcal",
    level: "Level 04",
    hero_eyebrow: "Power session",
    hero_lead: "Главный нижний день с понятной фазировкой и быстрым стартом из одного экрана.",
    phases: [
      { label: "Primer", value: "8 min", tone: "gold", width: "24%" },
      { label: "Main lifts", value: "30 min", tone: "indigo", width: "86%" },
      { label: "Cooldown", value: "8 min", tone: "coral", width: "28%" },
    ],
    days: ["tue", "wed"],
  },
];

function StatusBar() {
  return (
    <div className={styles.statusBar}>
      <span className={styles.statusTime}>9:41</span>
      <div className={styles.statusIcons} aria-hidden="true">
        <span className={styles.signalBars}>
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className={styles.wifiIcon}>
          <i />
        </span>
        <span className={styles.batteryIcon}>
          <span />
        </span>
      </div>
    </div>
  );
}

function PhaseIcon({ tone }: { tone: WorkoutTone }) {
  return (
    <span className={`${styles.phaseIcon} ${styles[`phaseIcon${tone}`]}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function splitTitle(title: string) {
  const words = title.split(" ");

  if (words.length < 2) {
    return [title, ""];
  }

  const pivot = Math.ceil(words.length / 2);
  return [words.slice(0, pivot).join(" "), words.slice(pivot).join(" ")];
}

export default function WorkoutsPage() {
  const [catalog, setCatalog] = useState<WorkoutCatalogResponse | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(fallbackWorkoutDays[0].id);
  const [activeFilter, setActiveFilter] = useState<WorkoutCategory>("strength");
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(fallbackWorkouts[0].slug);
  const [startedWorkoutId, setStartedWorkoutId] = useState<string | null>(null);
  const [savedWorkoutIds, setSavedWorkoutIds] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState(
    "Экран теперь живой: выбери день, фильтр и тренировку."
  );

  const workoutDays = catalog?.days?.length ? catalog.days : fallbackWorkoutDays;
  const workoutFilters = catalog?.filters?.length ? catalog.filters : fallbackWorkoutFilters;
  const workouts = catalog?.workouts?.length ? catalog.workouts : fallbackWorkouts;

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      try {
        const data = (await fetchSessionJson("/workouts/")) as WorkoutCatalogResponse;

        if (cancelled) {
          return;
        }

        setCatalog(data);
        setCatalogError(null);
        setStatusMessage("Каталог тренировок подключен к backend.");
      } catch (error) {
        if (cancelled) {
          return;
        }

        setCatalogError(
          error instanceof Error
            ? error.message
            : "Не удалось загрузить каталог тренировок."
        );
      }
    }

    void loadCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleWorkouts = useMemo(() => {
    const workoutsForDay = workouts.filter((workout) =>
      workout.days.includes(selectedDay)
    );
    const workoutsForDayAndFilter = workoutsForDay.filter(
      (workout) =>
        workout.category === activeFilter
    );

    return workoutsForDayAndFilter.length ? workoutsForDayAndFilter : workoutsForDay;
  }, [activeFilter, selectedDay, workouts]);

  useEffect(() => {
    if (!workoutDays.some((day) => day.id === selectedDay)) {
      setSelectedDay(workoutDays[0]?.id ?? fallbackWorkoutDays[0].id);
    }
  }, [selectedDay, workoutDays]);

  useEffect(() => {
    if (!visibleWorkouts.some((workout) => workout.slug === selectedWorkoutId)) {
      setSelectedWorkoutId(visibleWorkouts[0]?.slug ?? workouts[0].slug);
    }
  }, [selectedWorkoutId, visibleWorkouts, workouts]);

  const selectedWorkout =
    visibleWorkouts.find((workout) => workout.slug === selectedWorkoutId) ??
    workouts.find((workout) => workout.slug === selectedWorkoutId) ??
    workouts[0];

  const selectedDayMeta =
    workoutDays.find((day) => day.id === selectedDay) ?? workoutDays[0];

  const heroTitle = splitTitle(selectedWorkout.title);
  const selectedIndex = visibleWorkouts.findIndex(
    (workout) => workout.slug === selectedWorkout.slug,
  );

  function cycleWorkout(step: number) {
    if (!visibleWorkouts.length) {
      return;
    }

    const nextIndex =
      (selectedIndex + step + visibleWorkouts.length) % visibleWorkouts.length;
    const nextWorkout = visibleWorkouts[nextIndex];
    setSelectedWorkoutId(nextWorkout.slug);
    setStatusMessage(`Открыта тренировка ${nextWorkout.title}.`);
  }

  function toggleWorkoutStarted() {
    const nextStarted =
      startedWorkoutId === selectedWorkout.slug ? null : selectedWorkout.slug;

    setStartedWorkoutId(nextStarted);
    setStatusMessage(
      nextStarted
        ? `${selectedWorkout.title} запущена. Можно идти по фазам экрана.`
        : `Запуск ${selectedWorkout.title} остановлен.`
    );
  }

  function toggleWorkoutSaved() {
    const isSaved = savedWorkoutIds.includes(selectedWorkout.slug);
    const nextSavedIds = isSaved
      ? savedWorkoutIds.filter((workoutId) => workoutId !== selectedWorkout.slug)
      : [...savedWorkoutIds, selectedWorkout.slug];

    setSavedWorkoutIds(nextSavedIds);
    setStatusMessage(
      isSaved
        ? `${selectedWorkout.title} убрана из сохраненных сессий.`
        : `${selectedWorkout.title} сохранена в кабинет.`
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <div className={styles.phoneShell}>
          <article className={`${styles.phone} ${styles.heroPhone}`}>
            <StatusBar />
            <div className={styles.heroGlow} aria-hidden="true" />
            <div className={styles.heroContent}>
              <p className={styles.heroEyebrow}>{selectedWorkout.hero_eyebrow}</p>
              <h1 className={styles.heroTitle}>
                {heroTitle[0]}
                <br />
                {heroTitle[1] || selectedWorkout.category}
              </h1>
              <p className={styles.heroText}>{selectedWorkout.hero_lead}</p>
              <button
                className={styles.lightCta}
                type="button"
                onClick={() =>
                  setStatusMessage(
                    `Собран рабочий экран для ${selectedWorkout.title} на ${selectedDayMeta.label}.`
                  )
                }
              >
                Explore
                <span aria-hidden="true">-&gt;</span>
              </button>
            </div>
          </article>
        </div>

        <div className={styles.phoneShell}>
          <article className={`${styles.phone} ${styles.detailPhone}`}>
            <StatusBar />
            <header className={styles.topHeader}>
              <button
                className={styles.roundButton}
                type="button"
                aria-label="Вернуться к первой тренировке"
                onClick={() => {
                  setSelectedWorkoutId(visibleWorkouts[0]?.slug ?? workouts[0].slug);
                  setStatusMessage("Выбор тренировки сброшен к первому доступному слоту.");
                }}
              >
                &lt;
              </button>
              <h2 className={styles.screenTitle}>Workout</h2>
              <button
                className={styles.roundButtonMuted}
                type="button"
                aria-label="Показать статус тренировки"
                onClick={() =>
                  setStatusMessage(
                    `${selectedWorkout.title}: ${selectedWorkout.duration}, ${selectedWorkout.calories}.`
                  )
                }
              >
                ...
              </button>
            </header>

            <section className={styles.featureStage}>
              <button
                className={`${styles.sideArrow} ${styles.sideArrowLeft}`}
                type="button"
                aria-label="Предыдущая тренировка"
                onClick={() => cycleWorkout(-1)}
              >
                &lt;
              </button>
              <button
                className={`${styles.sideArrow} ${styles.sideArrowRight}`}
                type="button"
                aria-label="Следующая тренировка"
                onClick={() => cycleWorkout(1)}
              >
                &gt;
              </button>
              <div className={styles.featureHalo} aria-hidden="true" />
              <div className={styles.featureDisc}>
                <div className={styles.featureImage} />
              </div>
              <div className={styles.featureBadge}>{selectedWorkout.level}</div>
            </section>

            <section className={styles.detailBody}>
              <h3 className={styles.featureTitle}>{selectedWorkout.title}</h3>
              <p className={styles.featureMeta}>{selectedWorkout.detail_meta}</p>
              <div className={styles.metaRow}>
                <span>{selectedWorkout.duration}</span>
                <span>{selectedWorkout.calories}</span>
                <span>{formatWorkoutCategory(selectedWorkout.category)}</span>
              </div>
              <p className={styles.detailNote}>{catalogError ?? statusMessage}</p>
            </section>

            <div className={styles.primaryPanel}>
              <button className={styles.darkCta} type="button" onClick={toggleWorkoutStarted}>
                {startedWorkoutId === selectedWorkout.slug ? "Pause workout" : "Start workout"}
                <span aria-hidden="true">-&gt;</span>
              </button>
            </div>
          </article>
        </div>

        <div className={styles.phoneShell}>
          <article className={`${styles.phone} ${styles.metricsPhone}`}>
            <div className={styles.metricsHero}>
              <StatusBar />
              <header className={styles.overlayHeader}>
                <button className={styles.roundButtonGhost} type="button" aria-label="Go back">
                  &lt;
                </button>
                <h2 className={styles.overlayTitle}>Workouts</h2>
                <button className={styles.roundButtonGhost} type="button" aria-label="Open options">
                  ...
                </button>
              </header>
              <div className={styles.metricsImageWrap}>
                <div className={styles.metricsImageGlow} aria-hidden="true" />
                <div className={styles.metricsImageCard} />
              </div>
            </div>

            <section className={styles.metricsCard}>
              <div className={styles.metricsHeading}>
                <div>
                  <h3>{selectedWorkout.title}</h3>
                  <p>Session split</p>
                </div>
                <div className={styles.metricsStat}>
                  <strong>{selectedWorkout.duration}</strong>
                  <span>{selectedWorkout.calories}</span>
                </div>
              </div>

              <div className={styles.phaseList}>
                {selectedWorkout.phases.map((phase) => (
                  <div className={styles.phaseRow} key={phase.label}>
                    <PhaseIcon tone={phase.tone} />
                    <div className={styles.phaseCopy}>
                      <div className={styles.phaseHead}>
                        <span>{phase.label}</span>
                        <span>{phase.value}</span>
                      </div>
                      <div className={styles.phaseTrack}>
                        <div
                          className={`${styles.phaseFill} ${styles[`phaseFill${phase.tone}`]}`}
                          style={{ width: phase.width }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className={styles.darkCtaWide} type="button" onClick={toggleWorkoutSaved}>
                {savedWorkoutIds.includes(selectedWorkout.slug)
                  ? "Saved to workspace"
                  : "Save session"}
                <span aria-hidden="true">-&gt;</span>
              </button>
            </section>
          </article>
        </div>

        <div className={styles.phoneShell}>
          <article className={`${styles.phone} ${styles.listPhone}`}>
            <StatusBar />
            <header className={styles.listHeader}>
              <button
                className={styles.listBack}
                type="button"
                aria-label="Вернуться к понедельнику"
                onClick={() => {
                  setSelectedDay(workoutDays[0]?.id ?? fallbackWorkoutDays[0].id);
                  setStatusMessage("Календарь возвращен к началу недели.");
                }}
              >
                &lt;
              </button>
              <div>
                <p className={styles.listLabel}>My</p>
                <h2 className={styles.listTitle}>Workouts</h2>
              </div>
              <div className={styles.listActions}>
                <button
                  className={styles.smallIconButton}
                  type="button"
                  aria-label="Создать тренировку"
                  onClick={() =>
                    setStatusMessage(
                      `Новый слот создается на ${selectedDayMeta.label}. Базой станет ${selectedWorkout.title}.`
                    )
                  }
                >
                  +
                </button>
                <button
                  className={styles.smallIconButton}
                  type="button"
                  aria-label="Поделиться тренировками"
                  onClick={() =>
                    setStatusMessage(
                      `Ссылка на ${selectedWorkout.title} подготовлена для отправки тренеру.`
                    )
                  }
                >
                  /
                </button>
              </div>
            </header>

            <div className={styles.dayScroller}>
              {workoutDays.map((day) => (
                <button
                  className={`${styles.dayCard} ${day.id === selectedDay ? styles.dayCardActive : ""}`}
                  key={`${day.month}-${day.day}`}
                  type="button"
                  onClick={() => {
                    setSelectedDay(day.id);
                    setStatusMessage(`Календарь переключен на ${day.label}.`);
                  }}
                >
                  <span>{day.month}</span>
                  <strong>{day.day}</strong>
                </button>
              ))}
            </div>

            <div className={styles.segmentedControl}>
              {workoutFilters.map((filter) => (
                <button
                  className={`${styles.segmentButton} ${filter.key === activeFilter ? styles.segmentButtonActive : ""}`}
                  key={filter.label}
                  type="button"
                  onClick={() => {
                    setActiveFilter(filter.key);
                    setStatusMessage(`Фильтр переключен на ${filter.label}.`);
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <p className={styles.listStatus}>{statusMessage}</p>

            <section className={styles.workoutList}>
              {visibleWorkouts.map((workout) => (
                <button
                  className={`${styles.workoutCard} ${workout.slug === selectedWorkout.slug ? styles.workoutCardActive : ""}`}
                  key={workout.title}
                  type="button"
                  onClick={() => {
                    setSelectedWorkoutId(workout.slug);
                    setStatusMessage(`Открыта карточка ${workout.title}.`);
                  }}
                >
                  <div className={`${styles.workoutAccent} ${styles[`workoutAccent${workout.accent}`]}`} aria-hidden="true" />
                  <div className={styles.workoutInfo}>
                    <h3>{workout.title}</h3>
                    <p>{workout.list_meta}</p>
                  </div>
                  <span
                    className={styles.listDots}
                    aria-label={`Подробнее о ${workout.title}`}
                  >
                    ...
                  </span>
                </button>
              ))}
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}

function formatWorkoutCategory(filter: WorkoutCategory) {
  if (filter === "cardio") {
    return "Cardio";
  }

  if (filter === "mobility") {
    return "Mobility";
  }

  return "Strength";
}
