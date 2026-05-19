"use client";

import { useRouter } from "next/navigation";
import { type CSSProperties, FormEvent, useEffect, useMemo, useState } from "react";

import {
  clearSession,
  ensureSessionUser,
  saveAssessment,
  SessionError,
  type UserGoal,
  type UserSex,
} from "../../lib/session";
import styles from "./assessment.module.css";

const sexOptions: Array<{ value: UserSex; label: string; marker: string }> = [
  { value: "male", label: "Мужской", marker: "M" },
  { value: "female", label: "Женский", marker: "F" },
];

const goalOptions: Array<{
  value: UserGoal;
  label: string;
  summary: string;
  accent: string;
}> = [
  {
    value: "recomposition",
    label: "Рекомпозиция",
    summary: "Силовой прогресс и постепенное изменение состава тела",
    accent: "amber",
  },
  {
    value: "fat_loss",
    label: "Снижение веса",
    summary: "Дефицит без провалов энергии и сохранение мышц",
    accent: "green",
  },
  {
    value: "muscle_gain",
    label: "Набор мышц",
    summary: "Профицит, объем и контролируемая силовая работа",
    accent: "red",
  },
  {
    value: "endurance",
    label: "Выносливость",
    summary: "Кардио-база, интервалы и устойчивый недельный темп",
    accent: "cyan",
  },
  {
    value: "wellness",
    label: "Здоровье и тонус",
    summary: "Мобилити, базовая сила и регулярный режим",
    accent: "stone",
  },
];

const goalPlanCopy: Record<UserGoal, { nutrition: string; workout: string }> = {
  fat_loss: {
    nutrition: "Высокий белок, умеренный дефицит и простые порции на день.",
    workout: "Силовой круг с легким кардио-финишем.",
  },
  muscle_gain: {
    nutrition: "Небольшой профицит и углеводы вокруг тренировки.",
    workout: "Гипертрофия всего тела с рабочим объемом.",
  },
  endurance: {
    nutrition: "Больше углеводов до нагрузки и фокус на восстановлении.",
    workout: "Темповые отрезки и спокойная заминка.",
  },
  wellness: {
    nutrition: "Стабильные приемы пищи и мягкая поддержка энергии.",
    workout: "Мобилити, осанка и базовая сила.",
  },
  recomposition: {
    nutrition: "Около поддержки, высокий белок и понятный контроль порций.",
    workout: "Сила с коротким метаболическим блоком.",
  },
};

function clampMetric(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatMetric(value: number) {
  return Number.isInteger(value) ? String(value) : String(value).replace(/\.0$/, "");
}

function normalizeMetricInput(
  value: string,
  fallback: number,
  min: number,
  max: number,
  shouldRound = false,
) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return fallback;
  }

  const normalizedValue = shouldRound ? Math.round(parsedValue) : parsedValue;
  return clampMetric(normalizedValue, min, max);
}

export default function AssessmentPage() {
  const router = useRouter();
  const [sex, setSex] = useState<UserSex>("male");
  const [goal, setGoal] = useState<UserGoal>("recomposition");
  const [age, setAge] = useState(32);
  const [heightCm, setHeightCm] = useState(178);
  const [weightKg, setWeightKg] = useState(78);
  const [ageInput, setAgeInput] = useState("32");
  const [heightInput, setHeightInput] = useState("178");
  const [weightInput, setWeightInput] = useState("78");
  const [loading, setLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const user = await ensureSessionUser();
        if (cancelled) {
          return;
        }

        if (user.profile) {
          setSex(user.profile.sex);
          setGoal(user.profile.goal);
          const nextAge = user.profile.age;
          const nextHeight = Number(user.profile.height_cm);
          const nextWeight = Number(user.profile.weight_kg);

          setAge(nextAge);
          setHeightCm(nextHeight);
          setWeightKg(nextWeight);
          setAgeInput(formatMetric(nextAge));
          setHeightInput(formatMetric(nextHeight));
          setWeightInput(formatMetric(nextWeight));
        }

        setPageReady(true);
      } catch (currentError) {
        clearSession();
        if (!cancelled) {
          router.replace(
            currentError instanceof SessionError && currentError.code === "AUTH_REQUIRED"
              ? "/auth/register"
              : "/auth/login",
          );
        }
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const preview = useMemo(() => {
    const selectedGoal = goalOptions.find((item) => item.value === goal) ?? goalOptions[0];
    const bmi = weightKg / (heightCm / 100) ** 2;
    const readiness = Math.min(94, Math.max(58, Math.round(100 - Math.abs(bmi - 23) * 3 + (age < 45 ? 4 : -3))));

    return {
      selectedGoal,
      readiness,
      bmi: bmi.toFixed(1),
      nutrition: goalPlanCopy[goal].nutrition,
      workout: goalPlanCopy[goal].workout,
    };
  }, [age, goal, heightCm, weightKg]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const nextAge = normalizeMetricInput(ageInput, age, 12, 90, true);
    const nextHeight = normalizeMetricInput(heightInput, heightCm, 120, 230, true);
    const nextWeight = normalizeMetricInput(weightInput, weightKg, 35, 250);

    setAge(nextAge);
    setHeightCm(nextHeight);
    setWeightKg(nextWeight);
    setAgeInput(formatMetric(nextAge));
    setHeightInput(formatMetric(nextHeight));
    setWeightInput(formatMetric(nextWeight));

    try {
      await saveAssessment({
        sex,
        age: nextAge,
        heightCm: nextHeight,
        weightKg: nextWeight,
        goal,
      });
      router.push("/overview");
      router.refresh();
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : "Не удалось сохранить анкету. Попробуйте еще раз.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!pageReady) {
    return (
      <main className={styles.page}>
        <section className={styles.loadingPanel}>
          <p>Проверяем сессию</p>
          <strong>Готовим персональный старт</strong>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Персональная настройка</p>
            <h1>Соберем план под тебя</h1>
          </div>
          <div className={styles.progressBadge}>
            <span />
            1 экран
          </div>
        </header>

        <form className={styles.layout} onSubmit={handleSubmit}>
          <section className={styles.formPanel}>
            <div className={styles.sectionHead}>
              <span>01</span>
              <div>
                <h2>Профиль нагрузки</h2>
                <p>Эти данные нужны для расчета питания и тренировки дня.</p>
              </div>
            </div>

            <div className={styles.segmented} aria-label="Пол">
              {sexOptions.map((option) => (
                <button
                  key={option.value}
                  className={sex === option.value ? styles.segmentActive : styles.segment}
                  type="button"
                  onClick={() => setSex(option.value)}
                >
                  <span>{option.marker}</span>
                  {option.label}
                </button>
              ))}
            </div>

            <div className={styles.metricGrid}>
              <label className={styles.metricControl}>
                <span className={styles.metricLabel}>Возраст</span>
                <div className={styles.metricValueRow}>
                  <strong>{age} лет</strong>
                  <input
                    className={styles.metricNumber}
                    type="number"
                    min={12}
                    max={90}
                    step={1}
                    inputMode="numeric"
                    value={ageInput}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setAgeInput(nextValue);

                      if (nextValue) {
                        const nextAge = normalizeMetricInput(nextValue, age, 12, 90, true);
                        setAge(nextAge);
                      }
                    }}
                    onBlur={() => {
                      const nextAge = normalizeMetricInput(ageInput, age, 12, 90, true);
                      setAge(nextAge);
                      setAgeInput(formatMetric(nextAge));
                    }}
                    aria-label="Возраст числом"
                  />
                </div>
                <input
                  type="range"
                  min={12}
                  max={90}
                  value={age}
                  onChange={(event) => {
                    const nextAge = Number(event.target.value);
                    setAge(nextAge);
                    setAgeInput(formatMetric(nextAge));
                  }}
                />
              </label>

              <label className={styles.metricControl}>
                <span className={styles.metricLabel}>Рост</span>
                <div className={styles.metricValueRow}>
                  <strong>{heightCm} см</strong>
                  <input
                    className={styles.metricNumber}
                    type="number"
                    min={120}
                    max={230}
                    step={1}
                    inputMode="numeric"
                    value={heightInput}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setHeightInput(nextValue);

                      if (nextValue) {
                        const nextHeight = normalizeMetricInput(nextValue, heightCm, 120, 230, true);
                        setHeightCm(nextHeight);
                      }
                    }}
                    onBlur={() => {
                      const nextHeight = normalizeMetricInput(heightInput, heightCm, 120, 230, true);
                      setHeightCm(nextHeight);
                      setHeightInput(formatMetric(nextHeight));
                    }}
                    aria-label="Рост числом"
                  />
                </div>
                <input
                  type="range"
                  min={120}
                  max={230}
                  value={heightCm}
                  onChange={(event) => {
                    const nextHeight = Number(event.target.value);
                    setHeightCm(nextHeight);
                    setHeightInput(formatMetric(nextHeight));
                  }}
                />
              </label>

              <label className={styles.metricControl}>
                <span className={styles.metricLabel}>Вес</span>
                <div className={styles.metricValueRow}>
                  <strong>{weightKg} кг</strong>
                  <input
                    className={styles.metricNumber}
                    type="number"
                    min={35}
                    max={250}
                    step={0.5}
                    inputMode="decimal"
                    value={weightInput}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setWeightInput(nextValue);

                      if (nextValue) {
                        const nextWeight = normalizeMetricInput(nextValue, weightKg, 35, 250);
                        setWeightKg(nextWeight);
                      }
                    }}
                    onBlur={() => {
                      const nextWeight = normalizeMetricInput(weightInput, weightKg, 35, 250);
                      setWeightKg(nextWeight);
                      setWeightInput(formatMetric(nextWeight));
                    }}
                    aria-label="Вес числом"
                  />
                </div>
                <input
                  type="range"
                  min={35}
                  max={250}
                  step={0.5}
                  value={weightKg}
                  onChange={(event) => {
                    const nextWeight = Number(event.target.value);
                    setWeightKg(nextWeight);
                    setWeightInput(formatMetric(nextWeight));
                  }}
                />
              </label>
            </div>

            <div className={styles.sectionHead}>
              <span>02</span>
              <div>
                <h2>Главная цель</h2>
                <p>Выбери направление, вокруг которого построится первый день.</p>
              </div>
            </div>

            <div className={styles.goalGrid}>
              {goalOptions.map((option) => {
                const selected = goal === option.value;

                return (
                  <button
                    key={option.value}
                    className={`${styles.goalCard} ${selected ? styles.goalCardActive : ""}`}
                    data-accent={option.accent}
                    type="button"
                    onClick={() => setGoal(option.value)}
                  >
                    <span className={styles.goalMark} />
                    <strong>{option.label}</strong>
                    <small>{option.summary}</small>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className={styles.previewPanel}>
            <div className={styles.previewHero}>
              <p className={styles.kicker}>Предпросмотр</p>
              <h2>{preview.selectedGoal.label}</h2>
              <p>{preview.selectedGoal.summary}</p>
            </div>

            <div
              className={styles.scoreRing}
              style={{ "--score": `${preview.readiness}%` } as CSSProperties}
            >
              <div>
                <strong>{preview.readiness}%</strong>
                <span>стартовая готовность</span>
              </div>
            </div>

            <div className={styles.previewList}>
              <div>
                <span>ИМТ</span>
                <strong>{preview.bmi}</strong>
              </div>
              <div>
                <span>Питание</span>
                <strong>{preview.nutrition}</strong>
              </div>
              <div>
                <span>Тренировка</span>
                <strong>{preview.workout}</strong>
              </div>
            </div>

            {error ? <p className={styles.errorText}>{error}</p> : null}

            <button className={styles.submitButton} type="submit" disabled={loading}>
              {loading ? "Сохраняем..." : "Сформировать рекомендации"}
            </button>
          </aside>
        </form>
      </section>
    </main>
  );
}
