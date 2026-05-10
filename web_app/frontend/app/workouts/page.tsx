"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import DashboardShell from "../../components/dashboard/DashboardShell";
import { completeWorkoutSession, fetchSessionJson } from "../../lib/session";
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
  completed_count: number;
  last_completed_at: string | null;
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

type LiveGuidance = {
  modeLabel: string;
  effortLabel: string;
  actions: string[];
  upcomingLabel: string;
};

type DemoPose = "idle" | "strength" | "cardio" | "mobility" | "cooldown";

const fallbackWorkoutDays: WorkoutDay[] = [
  { id: "mon", month: "Апр", day: "21", label: "Пн" },
  { id: "tue", month: "Апр", day: "22", label: "Вт" },
  { id: "wed", month: "Апр", day: "23", label: "Ср" },
  { id: "thu", month: "Апр", day: "24", label: "Чт" },
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
    completed_count: 0,
    last_completed_at: null,
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
    completed_count: 0,
    last_completed_at: null,
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
    completed_count: 0,
    last_completed_at: null,
  },
];

function parseDurationMinutes(duration: string) {
  const match = duration.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function formatElapsed(seconds: number) {
  const minutes = Math.floor(Math.max(0, seconds) / 60);
  const remainder = Math.max(0, seconds) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function formatWorkoutCategory(category: WorkoutCategory) {
  if (category === "cardio") {
    return "Cardio";
  }

  if (category === "mobility") {
    return "Mobility";
  }

  return "Strength";
}

function getPhaseMinutes(phase: WorkoutPhase) {
  return parseDurationMinutes(phase.value);
}

function resolveDemoPose({
  category,
  phaseLabel,
  isRunning,
  progressPercent,
}: {
  category: WorkoutCategory;
  phaseLabel: string;
  isRunning: boolean;
  progressPercent: number;
}): DemoPose {
  const normalizedPhase = phaseLabel.toLowerCase();
  const isWarmup = /warm|prep|breath|размин|дых/.test(normalizedPhase);
  const isCooldown = /cool|reset|замин|recovery/.test(normalizedPhase) || progressPercent >= 95;

  if (!isRunning && progressPercent === 0) {
    return "idle";
  }

  if (isCooldown) {
    return "cooldown";
  }

  if (isWarmup && category === "mobility") {
    return "mobility";
  }

  if (category === "cardio") {
    return "cardio";
  }

  if (category === "mobility") {
    return "mobility";
  }

  return "strength";
}

function getTechniqueChecklist(pose: DemoPose): string[] {
  if (pose === "strength") {
    return [
      "Спина нейтральная, плечи опущены, корпус стабилен.",
      "Вниз — медленно, вверх — с усилием без рывка.",
      "Колени смотрят по линии носков, пятки на полу.",
    ];
  }

  if (pose === "cardio") {
    return [
      "Ровный ритм шагов/движения без спринта в начале.",
      "Локти около корпуса, плечи расслаблены.",
      "Дыхание ровное: вдох короче, выдох длиннее.",
    ];
  }

  if (pose === "mobility") {
    return [
      "Двигайтесь в комфортной амплитуде без боли.",
      "Не пружиньте в крайних точках, держите контроль.",
      "Синхронизируйте движение с ровным дыханием.",
    ];
  }

  if (pose === "cooldown") {
    return [
      "Плавно снижайте темп, не останавливайтесь резко.",
      "Восстанавливайте дыхание длинным выдохом.",
      "Завершайте движение с мягкой осанкой без зажима.",
    ];
  }

  return [
    "Подготовьте стойку и проверьте нейтральную спину.",
    "Сделайте 2-3 пробных повтора в медленном темпе.",
    "Начните тренировку только после контроля техники.",
  ];
}

function buildLiveGuidance({
  category,
  currentPhaseLabel,
  nextPhaseLabel,
  isRunning,
  elapsedSeconds,
  totalDurationSeconds,
}: {
  category: WorkoutCategory;
  currentPhaseLabel: string;
  nextPhaseLabel: string | null;
  isRunning: boolean;
  elapsedSeconds: number;
  totalDurationSeconds: number;
}): LiveGuidance {
  const phaseLabel = currentPhaseLabel.toLowerCase();
  const progressPercent = totalDurationSeconds
    ? Math.round((elapsedSeconds / totalDurationSeconds) * 100)
    : 0;

  if (!isRunning && elapsedSeconds === 0) {
    return {
      modeLabel: "Подготовка",
      effortLabel: "Нагрузка: старт",
      actions: [
        "Поставьте воду и полотенце рядом, освободите пространство.",
        "Проверьте технику первого упражнения: 2-3 медленных повтора без веса.",
        "Нажмите «Старт» и войдите в первую фазу без резкого темпа.",
      ],
      upcomingLabel: nextPhaseLabel
        ? `После запуска следующая фаза: ${nextPhaseLabel}.`
        : "После запуска работайте в текущей фазе.",
    };
  }

  if (!isRunning && progressPercent > 0 && progressPercent < 100) {
    return {
      modeLabel: "Пауза",
      effortLabel: "Нагрузка: удержание",
      actions: [
        "Восстановите дыхание: длинный выдох 4-6 секунд.",
        "Проверьте технику и вернитесь с тем же контролируемым темпом.",
        "Продолжайте с текущей фазы или переключитесь на следующую.",
      ],
      upcomingLabel: nextPhaseLabel
        ? `Дальше переход к фазе ${nextPhaseLabel}.`
        : "Вы в финальном блоке, завершайте сессию технично.",
    };
  }

  if (progressPercent >= 100) {
    return {
      modeLabel: "Завершение",
      effortLabel: "Нагрузка: выполнено",
      actions: [
        "Сделайте 2-3 минуты лёгкой ходьбы или дыхания.",
        "Оцените самочувствие: усталость, пульс, техника последнего блока.",
        "Нажмите «Сохранить выполнение», затем при необходимости «Повторить».",
      ],
      upcomingLabel: "Сессия завершена, зафиксируйте результат.",
    };
  }

  const isWarmup = /warm|prep|breath|размин|дых/.test(phaseLabel);
  const isCooldown = /cool|reset|замин|recovery/.test(phaseLabel);
  const effortLabel =
    progressPercent < 30 ? "Нагрузка: вход" : progressPercent < 75 ? "Нагрузка: рабочая" : "Нагрузка: финиш";

  if (category === "strength") {
    return {
      modeLabel: isWarmup ? "Силовая активация" : isCooldown ? "Силовое восстановление" : "Силовой блок",
      effortLabel,
      actions: isWarmup
        ? [
            "Разогрейте суставы и выполните лёгкий подход в неполной амплитуде.",
            "Держите корпус стабильным, лопатки собраны, движение контролируемое.",
            "Переходите к рабочему весу только без боли и рывков.",
          ]
        : isCooldown
          ? [
              "Снизьте темп и сосредоточьтесь на диапазоне движения.",
              "Выполняйте повторения плавно, без отказа и без задержки дыхания.",
              "Фиксируйте технику, а не вес — это финальная стабилизация.",
            ]
          : [
              "Работайте сериями ровно: усилие на подъёме, контроль на опускании.",
              "Пауза между подходами 45-90 секунд, держите технику в приоритете.",
              "Если техника плывёт — уменьшите вес и сохраняйте амплитуду.",
            ],
      upcomingLabel: nextPhaseLabel
        ? `Дальше: ${nextPhaseLabel}. Подготовьтесь за 20-30 секунд.`
        : "Финальная фаза: завершите чисто и сохраните выполнение.",
    };
  }

  if (category === "cardio") {
    return {
      modeLabel: isWarmup ? "Кардио разгон" : isCooldown ? "Кардио заминка" : "Кардио интервал",
      effortLabel,
      actions: isWarmup
        ? [
            "Начните с лёгкого темпа, выровняйте дыхание через нос.",
            "Плавно повышайте интенсивность, не выходя в закисление.",
            "Контролируйте каденс: ровный ритм важнее резких ускорений.",
          ]
        : isCooldown
          ? [
              "Снижайте темп постепенно, не останавливайтесь резко.",
              "Верните пульс в комфортную зону, удлиняя выдох.",
              "Дайте ногам расслабиться и завершите спокойным шагом.",
            ]
          : [
              "Держите заданный темп отрезка, не уходите в спринт.",
              "На восстановлении активно дышите и сохраняйте движение.",
              "Следите за ритмом: одинаковое качество каждого интервала.",
            ],
      upcomingLabel: nextPhaseLabel
        ? `Дальше: ${nextPhaseLabel}. Переключение по таймеру.`
        : "Финальный блок: завершите темп и зафиксируйте сессию.",
    };
  }

  return {
    modeLabel: isWarmup ? "Мобилити старт" : isCooldown ? "Мобилити финиш" : "Мобилити контроль",
    effortLabel,
    actions: isWarmup
      ? [
          "Запускайте амплитуду мягко: шея, грудной отдел, таз.",
          "Движения медленные, без боли и пружинящих рывков.",
          "Каждое повторение с ровным дыханием и контролем позиции.",
        ]
      : isCooldown
        ? [
            "Снимайте остаточное напряжение длинными плавными движениями.",
            "Удерживайте комфортную растяжку без боли.",
            "Завершите дыханием: длинный выдох для восстановления.",
          ]
        : [
            "Держите качество: чистая траектория и стабильный корпус.",
            "Синхронизируйте движение с дыханием, не торопитесь.",
            "Сохраняйте одинаковую амплитуду в каждом повторе.",
          ],
    upcomingLabel: nextPhaseLabel
      ? `Дальше: ${nextPhaseLabel}. Подготовьте темп заранее.`
      : "Финальная фаза: мягко закройте тренировку и сохраните результат.",
  };
}

export default function WorkoutsPage() {
  const [catalog, setCatalog] = useState<WorkoutCatalogResponse | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(fallbackWorkoutDays[0].id);
  const [activeFilter, setActiveFilter] = useState<WorkoutCategory>("strength");
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(fallbackWorkouts[0].slug);
  const [startedWorkoutId, setStartedWorkoutId] = useState<string | null>(null);
  const [elapsedByWorkout, setElapsedByWorkout] = useState<Record<string, number>>({});
  const [isCompletingWorkout, setIsCompletingWorkout] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Выберите тренировку и запустите таймер.");

  const workoutDays = catalog?.days?.length ? catalog.days : fallbackWorkoutDays;
  const workoutFilters = catalog?.filters?.length ? catalog.filters : fallbackWorkoutFilters;
  const workouts = catalog?.workouts?.length ? catalog.workouts : fallbackWorkouts;

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      try {
        const data = (await fetchSessionJson("/workouts")) as WorkoutCatalogResponse;

        if (cancelled) {
          return;
        }

        setCatalog(data);
        setCatalogError(null);
        setStatusMessage("Каталог тренировок загружен из backend.");
      } catch (error) {
        if (cancelled) {
          return;
        }

        setCatalogError(
          error instanceof Error ? error.message : "Не удалось загрузить каталог тренировок.",
        );
      }
    }

    void loadCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleWorkouts = useMemo(() => {
    const workoutsForDay = workouts.filter((workout) => workout.days.includes(selectedDay));
    const workoutsForDayAndFilter = workoutsForDay.filter(
      (workout) => workout.category === activeFilter,
    );

    if (workoutsForDayAndFilter.length) {
      return workoutsForDayAndFilter;
    }

    if (workoutsForDay.length) {
      return workoutsForDay;
    }

    return workouts.filter((workout) => workout.category === activeFilter);
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
  const selectedDayMeta = workoutDays.find((day) => day.id === selectedDay) ?? workoutDays[0];
  const totalDurationSeconds = parseDurationMinutes(selectedWorkout.duration) * 60;
  const elapsedSeconds = elapsedByWorkout[selectedWorkout.slug] ?? 0;
  const isRunning = startedWorkoutId === selectedWorkout.slug;
  const hasProgress = elapsedSeconds > 0;
  const completedCount = selectedWorkout.completed_count ?? 0;
  const canRepeat = completedCount > 0;
  const nextStepNumber = !hasProgress ? 1 : !canRepeat ? 2 : 3;
  const nextStepMessage =
    nextStepNumber === 1
      ? "Шаг 1: нажмите «Старт», чтобы начать тренировку."
      : nextStepNumber === 2
        ? "Шаг 2: нажмите «Сохранить выполнение», чтобы открыть повторы."
        : "Шаг 3: нажмите «Повторить» для нового круга.";
  const sessionPercent = totalDurationSeconds
    ? Math.min(100, Math.round((elapsedSeconds / totalDurationSeconds) * 100))
    : 0;
  const phaseDurations = selectedWorkout.phases.map((phase) => getPhaseMinutes(phase) * 60);
  const activePhaseIndex = phaseDurations.findIndex((_, index) => {
    const threshold = phaseDurations.slice(0, index + 1).reduce((sum, value) => sum + value, 0);
    return elapsedSeconds < threshold;
  });
  const currentPhase =
    selectedWorkout.phases[
      activePhaseIndex >= 0 ? activePhaseIndex : selectedWorkout.phases.length - 1
    ];
  const nextPhase =
    activePhaseIndex >= 0 && activePhaseIndex < selectedWorkout.phases.length - 1
      ? selectedWorkout.phases[activePhaseIndex + 1]
      : null;
  const demoPose = resolveDemoPose({
    category: selectedWorkout.category,
    phaseLabel: currentPhase.label,
    isRunning,
    progressPercent: sessionPercent,
  });
  const techniqueChecklist = getTechniqueChecklist(demoPose);
  const liveGuidance = buildLiveGuidance({
    category: selectedWorkout.category,
    currentPhaseLabel: currentPhase.label,
    nextPhaseLabel: nextPhase?.label ?? null,
    isRunning,
    elapsedSeconds,
    totalDurationSeconds,
  });

  useEffect(() => {
    if (startedWorkoutId !== selectedWorkout.slug) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedByWorkout((current) => {
        const currentElapsed = current[selectedWorkout.slug] ?? 0;
        const nextElapsed = Math.min(currentElapsed + 1, totalDurationSeconds);

        if (nextElapsed >= totalDurationSeconds) {
          setStartedWorkoutId(null);
          setStatusMessage(`${selectedWorkout.title} завершена. Сохраните сессию в кабинет.`);
        }

        return {
          ...current,
          [selectedWorkout.slug]: nextElapsed,
        };
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [selectedWorkout.slug, selectedWorkout.title, startedWorkoutId, totalDurationSeconds]);

  function toggleWorkoutStarted() {
    const nextStarted = startedWorkoutId === selectedWorkout.slug ? null : selectedWorkout.slug;
    setStartedWorkoutId(nextStarted);
    setStatusMessage(
      nextStarted
        ? `${selectedWorkout.title} запущена. Сейчас активна фаза ${currentPhase.label}.`
        : `${selectedWorkout.title} поставлена на паузу.`,
    );
  }

  function skipToNextPhase() {
    if (!nextPhase || !totalDurationSeconds) {
      setStatusMessage("Сессия уже на финальной фазе.");
      return;
    }

    const nextElapsed = phaseDurations
      .slice(0, activePhaseIndex + 1)
      .reduce((sum, value) => sum + value, 0);
    setElapsedByWorkout((current) => ({
      ...current,
      [selectedWorkout.slug]: Math.min(totalDurationSeconds, nextElapsed),
    }));
    setStatusMessage(`Переключено на фазу ${nextPhase.label}.`);
  }

  function resetWorkout() {
    setStartedWorkoutId(null);
    setElapsedByWorkout((current) => ({
      ...current,
      [selectedWorkout.slug]: 0,
    }));
    setStatusMessage(`${selectedWorkout.title} сброшена к старту.`);
  }

  function repeatWorkout() {
    if (!canRepeat) {
      setStatusMessage("Сначала сохраните хотя бы одно выполнение этой тренировки.");
      return;
    }

    setElapsedByWorkout((current) => ({
      ...current,
      [selectedWorkout.slug]: 0,
    }));
    setStartedWorkoutId(selectedWorkout.slug);
    setStatusMessage(`Повтор ${selectedWorkout.title} запущен.`);
  }

  async function saveCompletedWorkout() {
    if (isCompletingWorkout) {
      return;
    }

    if (elapsedSeconds < 1) {
      setStatusMessage("Запустите тренировку и пройдите хотя бы часть сессии перед сохранением.");
      return;
    }

    setIsCompletingWorkout(true);
    try {
      const result = await completeWorkoutSession(selectedWorkout.slug, elapsedSeconds);
      setCatalog((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          workouts: current.workouts.map((workout) =>
            workout.slug === selectedWorkout.slug
              ? {
                  ...workout,
                  completed_count: result.completed_count,
                  last_completed_at: result.last_completed_at,
                }
              : workout,
          ),
        };
      });
      setStatusMessage(
        `${selectedWorkout.title} сохранена. Повторов: ${result.completed_count}.`,
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Не удалось сохранить выполненную тренировку.",
      );
    } finally {
      setIsCompletingWorkout(false);
    }
  }

  return (
    <DashboardShell
      active="workouts"
      title="Workouts"
      subtitle="Каталог тренировок с фильтрами, фазами, таймером сессии и сохранением в рабочий список."
      actions={
        <Link className={styles.secondaryAction} href="/schedule">
          Расписание
        </Link>
      }
    >
      <section className={styles.stack}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>{selectedWorkout.hero_eyebrow}</p>
            <h3>{selectedWorkout.title}</h3>
            <p>{selectedWorkout.hero_lead}</p>
          </div>

          <div className={styles.heroStats}>
            <div>
              <span>День</span>
              <strong>{selectedDayMeta?.label ?? "День"}</strong>
            </div>
            <div>
              <span>Категория</span>
              <strong>{formatWorkoutCategory(selectedWorkout.category)}</strong>
            </div>
            <div>
              <span>Сессия</span>
              <strong>{startedWorkoutId === selectedWorkout.slug ? "Идет" : "Готова"}</strong>
            </div>
          </div>
        </section>

        <section className={styles.controls}>
          <div className={styles.dayRail} aria-label="Дни недели">
            {workoutDays.map((day) => (
              <button
                className={day.id === selectedDay ? styles.dayActive : styles.dayButton}
                key={`${day.month}-${day.day}-${day.id}`}
                type="button"
                onClick={() => {
                  setSelectedDay(day.id);
                  setStatusMessage(`Показаны тренировки на ${day.label}.`);
                }}
              >
                <span>{day.month}</span>
                <strong>{day.day}</strong>
                <small>{day.label}</small>
              </button>
            ))}
          </div>

          <div className={styles.filterRail} aria-label="Тип тренировки">
            {workoutFilters.map((filter) => (
              <button
                className={filter.key === activeFilter ? styles.filterActive : styles.filterButton}
                key={filter.key}
                type="button"
                onClick={() => {
                  setActiveFilter(filter.key);
                  setStatusMessage(`Фильтр: ${filter.label}.`);
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.grid}>
          <aside className={styles.listPanel}>
            <div className={styles.panelHead}>
              <div>
                <p className={styles.kicker}>Catalog</p>
                <h3>Доступные тренировки</h3>
              </div>
              <span>{visibleWorkouts.length}</span>
            </div>

            {catalogError ? <p className={styles.errorText}>{catalogError}</p> : null}

            <div className={styles.workoutList}>
              {visibleWorkouts.map((workout) => (
                <button
                  className={workout.slug === selectedWorkout.slug ? styles.workoutActive : styles.workoutCard}
                  key={workout.slug}
                  type="button"
                  onClick={() => {
                    setSelectedWorkoutId(workout.slug);
                    setStatusMessage(`Открыта ${workout.title}.`);
                  }}
                >
                  <span className={`${styles.accentDot} ${styles[`accent${workout.accent}`]}`} />
                  <span>
                    <strong>{workout.title}</strong>
                    <small>{workout.list_meta}</small>
                  </span>
                  <em>{workout.completed_count > 0 ? `Повторы: ${workout.completed_count}` : workout.level}</em>
                </button>
              ))}
            </div>
          </aside>

          <article className={styles.sessionPanel}>
            <div className={styles.sessionTop}>
              <div>
                <p className={styles.kicker}>Session</p>
                <h3>{selectedWorkout.title}</h3>
                <p>{selectedWorkout.detail_meta}</p>
              </div>
              <span className={styles.categoryTag}>{formatWorkoutCategory(selectedWorkout.category)}</span>
            </div>

            <div className={styles.progressBlock}>
              <div className={styles.timerRow}>
                <strong>{formatElapsed(elapsedSeconds)}</strong>
                <span>{selectedWorkout.duration}</span>
              </div>
              <div className={styles.progressTrack}>
                <span style={{ width: `${sessionPercent}%` }} />
              </div>
              <div className={styles.progressMeta}>
                <span>{sessionPercent}%</span>
                <span>{currentPhase.label}</span>
              </div>
            </div>

            <section className={styles.liveModelCard}>
              <div className={styles.liveModelHead}>
                <p className={styles.liveModelLabel}>Live model</p>
                <span>{liveGuidance.effortLabel}</span>
              </div>
              <div className={styles.coachDemoStage}>
                <div
                  aria-hidden="true"
                  className={`${styles.coachFigure} ${styles[`pose${demoPose}`]} ${
                    isRunning ? styles.coachRunning : styles.coachPaused
                  }`}
                >
                  <span className={styles.coachHead} />
                  <span className={styles.coachTorso} />
                  <span className={`${styles.coachLimb} ${styles.coachArmLeft}`} />
                  <span className={`${styles.coachLimb} ${styles.coachArmRight}`} />
                  <span className={`${styles.coachLimb} ${styles.coachLegLeft}`} />
                  <span className={`${styles.coachLimb} ${styles.coachLegRight}`} />
                </div>
                <div className={styles.coachShadow} />
              </div>
              <h4>{liveGuidance.modeLabel}</h4>
              <ul className={styles.coachTechniqueList}>
                {techniqueChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <ul className={styles.liveModelActions}>
                {liveGuidance.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
              <p className={styles.liveModelUpcoming}>{liveGuidance.upcomingLabel}</p>
            </section>

            <section className={styles.nextStepCard}>
              <p className={styles.nextStepLabel}>Что делать сейчас</p>
              <p className={styles.nextStepMessage}>{nextStepMessage}</p>
              <ol className={styles.stepsList}>
                <li className={nextStepNumber === 1 ? styles.stepActive : styles.stepItem}>
                  Запустите тренировку кнопкой «Старт».
                </li>
                <li className={nextStepNumber === 2 ? styles.stepActive : styles.stepItem}>
                  Пройдите хотя бы часть сессии и сохраните выполнение.
                </li>
                <li className={nextStepNumber === 3 ? styles.stepActive : styles.stepItem}>
                  Используйте «Повторить», чтобы начать заново.
                </li>
              </ol>
            </section>

            <div className={styles.actions}>
              <button
                className={`${styles.primaryButton} ${nextStepNumber === 1 ? styles.recommendedAction : ""}`}
                type="button"
                onClick={toggleWorkoutStarted}
              >
                {isRunning ? "Пауза" : "Старт"}
              </button>
              <button className={styles.ghostButton} type="button" onClick={skipToNextPhase}>
                {nextPhase ? `Следующая: ${nextPhase.label}` : "Финальная фаза"}
              </button>
              <button className={styles.ghostButton} type="button" onClick={resetWorkout}>
                Сбросить
              </button>
              <button
                className={`${styles.ghostButton} ${nextStepNumber === 3 ? styles.recommendedAction : ""}`}
                type="button"
                disabled={!canRepeat}
                onClick={repeatWorkout}
              >
                Повторить
              </button>
              <button
                className={`${styles.saveButton} ${nextStepNumber === 2 ? styles.recommendedAction : ""}`}
                type="button"
                disabled={isCompletingWorkout}
                onClick={saveCompletedWorkout}
              >
                {isCompletingWorkout ? "Сохраняем..." : "Сохранить выполнение"}
              </button>
            </div>

            <p className={styles.statusText}>{statusMessage}</p>
          </article>

          <aside className={styles.phasePanel}>
            <div className={styles.panelHead}>
              <div>
                <p className={styles.kicker}>Plan</p>
                <h3>Фазы тренировки</h3>
              </div>
              <span>{selectedWorkout.calories}</span>
            </div>

            <div className={styles.phaseList}>
              {selectedWorkout.phases.map((phase, index) => (
                <div
                  className={index === activePhaseIndex ? styles.phaseActive : styles.phaseCard}
                  key={`${selectedWorkout.slug}-${phase.label}`}
                >
                  <div className={styles.phaseHead}>
                    <span className={`${styles.phaseIcon} ${styles[`phase${phase.tone}`]}`} />
                    <div>
                      <strong>{phase.label}</strong>
                      <small>{phase.value}</small>
                    </div>
                  </div>
                  <div className={styles.phaseTrack}>
                    <span style={{ width: index < activePhaseIndex ? "100%" : phase.width }} />
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.coachCue}>
              <span>Coach cue</span>
              <p>
                {nextPhase
                  ? `Держите текущую фазу ${currentPhase.label.toLowerCase()}, затем переходите к ${nextPhase.label.toLowerCase()}.`
                  : "Финальный блок активен: завершите технику и сохраните сессию."}
              </p>
            </div>
          </aside>
        </section>
      </section>
    </DashboardShell>
  );
}
