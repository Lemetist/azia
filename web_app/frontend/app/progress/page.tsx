import Link from "next/link";

import DashboardShell from "../../components/dashboard/DashboardShell";
import styles from "../../components/dashboard/dashboard-page.module.css";

export const dynamic = "force-dynamic";

const progressStats = [
  { label: "Выполнение цикла", value: "76%", change: "+8% за неделю", tone: "accent" },
  { label: "Силовой индекс", value: "1.18", change: "+0.07 к базе", tone: "neutral" },
  { label: "Лучший темп", value: "4:37", change: "-18 сек/км", tone: "neutral" },
  { label: "Готовность", value: "84%", change: "Можно нагружать", tone: "good" },
] as const;

const trendPoints = [
  { week: "8", label: "Неделя 8", volume: "44%", recovery: "72%", value: "18.4 т" },
  { week: "9", label: "Неделя 9", volume: "52%", recovery: "78%", value: "20.1 т" },
  { week: "10", label: "Неделя 10", volume: "63%", recovery: "74%", value: "22.8 т" },
  { week: "11", label: "Неделя 11", volume: "71%", recovery: "80%", value: "25.6 т" },
  { week: "12", label: "Неделя 12", volume: "82%", recovery: "84%", value: "27.2 т" },
] as const;

const goals = [
  {
    label: "Вес",
    current: "78.0 кг",
    target: "74.0 кг",
    delta: "-1.8 кг за 5 недель",
    progress: "45%",
  },
  {
    label: "VO2 max",
    current: "49",
    target: "54",
    delta: "+3 пункта за месяц",
    progress: "60%",
  },
  {
    label: "Жим лежа",
    current: "92 кг",
    target: "105 кг",
    delta: "+7 кг к прошлому циклу",
    progress: "54%",
  },
] as const;

const loadBalance = [
  { label: "Сила", value: "46%", detail: "4 рабочих блока", tone: "accent" },
  { label: "Кардио", value: "31%", detail: "2 темповых блока", tone: "neutral" },
  { label: "Recovery", value: "23%", detail: "мобилити и бассейн", tone: "good" },
] as const;

const markers = [
  { label: "Сон", value: "7ч 48м", status: "Хорошо" },
  { label: "Пульс покоя", value: "54", status: "Ниже базы" },
  { label: "HRV", value: "68 мс", status: "Стабильно" },
  { label: "RPE недели", value: "7.2", status: "Контролируемо" },
] as const;

const weekPlan = [
  { day: "Пн", load: "Сила", intensity: "82%" },
  { day: "Вт", load: "Плавание", intensity: "44%" },
  { day: "Ср", load: "Темп", intensity: "68%" },
  { day: "Чт", load: "Recovery", intensity: "28%" },
  { day: "Пт", load: "Сила", intensity: "74%" },
  { day: "Сб", load: "Длинный бег", intensity: "63%" },
  { day: "Вс", load: "Сброс", intensity: "18%" },
] as const;

export default function ProgressPage() {
  return (
    <DashboardShell
      active="progress"
      title="Прогресс"
      subtitle="Контроль цикла без лишнего шума: динамика нагрузки, цели, восстановление и решение по следующей тренировке."
      actions={
        <Link className={styles.primaryAction} href="/workouts">
          Открыть тренировки
        </Link>
      }
    >
      <section className={styles.stack}>
        <div className={styles.progressHero}>
          <article className={styles.progressHeroMain}>
            <div>
              <p className={styles.tag}>Неделя 12 из 16</p>
              <h3>Прогресс выше плана, но следующий прирост лучше брать через технику.</h3>
              <p>
                Силовой объем вырос на 14%, темп улучшился на 9%, а восстановление держится в
                зеленой зоне. Сегодня можно оставить интенсивный блок, но без форсирования веса.
              </p>
            </div>

            <div className={styles.progressHeroMeta}>
              <span>Цель цикла: рекомпозиция + 10 км</span>
              <span>Обновлено: сегодня, 09:20</span>
            </div>
          </article>

          <aside className={styles.progressScoreCard} aria-label="Итоговый статус прогресса">
            <div className={styles.progressRing}>
              <span>84%</span>
            </div>
            <div>
              <p className={styles.scoreLabel}>Готовность к нагрузке</p>
              <h3>Рабочий день</h3>
              <p className={styles.smallMuted}>
                Лучший слот: силовая база, 18:30. Ограничение: не поднимать RPE выше 8.
              </p>
            </div>
          </aside>
        </div>

        <div className={styles.progressStatGrid}>
          {progressStats.map((item) => (
            <article className={styles.statCard} key={item.label}>
              <div className={styles.statHead}>
                <span className={styles.listLabel}>{item.label}</span>
                <span
                  className={
                    item.tone === "accent"
                      ? styles.tag
                      : item.tone === "good"
                        ? styles.statusTag
                        : styles.miniTag
                  }
                >
                  {item.change}
                </span>
              </div>
              <strong className={item.tone === "accent" ? styles.accentText : undefined}>
                {item.value}
              </strong>
            </article>
          ))}
        </div>

        <div className={styles.progressMainGrid}>
          <article className={`${styles.panel} ${styles.trendPanel}`} id="trend-report">
            <div className={styles.panelHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Динамика нагрузки</h3>
                <p className={styles.panelCopy}>Тоннаж растет без провала по восстановлению.</p>
              </div>
              <span className={styles.statusTag}>Тренд +14%</span>
            </div>

            <div className={styles.trendChart} aria-label="Динамика объема за последние пять недель">
              {trendPoints.map((point) => (
                <div className={styles.trendColumn} key={point.week}>
                  <div className={styles.trendBars}>
                    <span className={styles.recoveryBar} style={{ height: point.recovery }} />
                    <span className={styles.volumeBar} style={{ height: point.volume }} />
                  </div>
                  <div className={styles.trendLegend}>
                    <strong>{point.value}</strong>
                    <span>{point.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.chartLegend}>
              <span>
                <i className={styles.legendVolume} /> Объем
              </span>
              <span>
                <i className={styles.legendRecovery} /> Восстановление
              </span>
            </div>
          </article>

          <article className={`${styles.panel} ${styles.goalPanel}`}>
            <div className={styles.panelHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Контрольные цели</h3>
                <p className={styles.panelCopy}>Три метрики, по которым оцениваем цикл.</p>
              </div>
              <span className={styles.miniTag}>до конца 4 недели</span>
            </div>

            <div className={styles.goalList}>
              {goals.map((goal) => (
                <div className={styles.goalCard} key={goal.label}>
                  <div className={styles.sessionHead}>
                    <strong>{goal.label}</strong>
                    <span className={styles.tag}>Цель {goal.target}</span>
                  </div>
                  <div className={styles.goalValueRow}>
                    <span>{goal.current}</span>
                    <small>{goal.delta}</small>
                  </div>
                  <div className={styles.goalTrack}>
                    <span style={{ width: goal.progress }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className={styles.progressDetailGrid}>
          <article className={styles.panel}>
            <h3 className={styles.sectionTitle}>Баланс недели</h3>
            <div className={styles.balanceList}>
              {loadBalance.map((item) => (
                <div className={styles.balanceItem} key={item.label}>
                  <div className={styles.balanceHead}>
                    <strong>{item.label}</strong>
                    <span className={item.tone === "good" ? styles.statusTag : styles.miniTag}>
                      {item.value}
                    </span>
                  </div>
                  <p className={styles.smallMuted}>{item.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.panel}>
            <h3 className={styles.sectionTitle}>Маркеры восстановления</h3>
            <div className={styles.markerGrid}>
              {markers.map((marker) => (
                <div className={styles.markerCard} key={marker.label}>
                  <span>{marker.label}</span>
                  <strong>{marker.value}</strong>
                  <small>{marker.status}</small>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.panel}>
            <h3 className={styles.sectionTitle}>Микроцикл</h3>
            <div className={styles.weekLoad}>
              {weekPlan.map((day) => (
                <div className={styles.weekLoadItem} key={day.day}>
                  <span>{day.day}</span>
                  <div className={styles.weekLoadTrack}>
                    <i style={{ height: day.intensity }} />
                  </div>
                  <strong>{day.load}</strong>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className={styles.progressDecision}>
          <div>
            <p className={styles.tag}>Решение на сегодня</p>
            <h3>Оставить силовую тренировку, убрать один добивочный подход.</h3>
            <p>
              Так цикл сохранит темп прогрессии без лишнего долга восстановления перед
              субботним длинным бегом.
            </p>
          </div>
          <Link className={styles.secondaryAction} href="/schedule">
            Проверить расписание
          </Link>
        </article>
      </section>
    </DashboardShell>
  );
}
