"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import DashboardShell from "../../components/dashboard/DashboardShell";
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

export default function WorkoutsPage() {
  const [catalog, setCatalog] = useState<WorkoutCatalogResponse | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(fallbackWorkoutDays[0].id);
  const [activeFilter, setActiveFilter] = useState<WorkoutCategory>("strength");
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(fallbackWorkouts[0].slug);
  const [startedWorkoutId, setStartedWorkoutId] = useState<string | null>(null);
  const [elapsedByWorkout, setElapsedByWorkout] = useState<Record<string, number>>({});
  const [savedWorkoutIds, setSavedWorkoutIds] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState("Выберите тренировку и запустите таймер.");

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

  function toggleWorkoutSaved() {
    const isSaved = savedWorkoutIds.includes(selectedWorkout.slug);
    setSavedWorkoutIds((current) =>
      isSaved
        ? current.filter((workoutId) => workoutId !== selectedWorkout.slug)
        : [...current, selectedWorkout.slug],
    );
    setStatusMessage(
      isSaved
        ? `${selectedWorkout.title} убрана из сохраненных.`
        : `${selectedWorkout.title} сохранена в кабинет.`,
    );
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
                  <em>{savedWorkoutIds.includes(workout.slug) ? "Saved" : workout.level}</em>
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

            <div className={styles.actions}>
              <button className={styles.primaryButton} type="button" onClick={toggleWorkoutStarted}>
                {startedWorkoutId === selectedWorkout.slug ? "Пауза" : "Старт"}
              </button>
              <button className={styles.ghostButton} type="button" onClick={skipToNextPhase}>
                {nextPhase ? `Следующая: ${nextPhase.label}` : "Финальная фаза"}
              </button>
              <button className={styles.ghostButton} type="button" onClick={resetWorkout}>
                Сбросить
              </button>
              <button className={styles.saveButton} type="button" onClick={toggleWorkoutSaved}>
                {savedWorkoutIds.includes(selectedWorkout.slug) ? "Сохранено" : "Сохранить"}
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
