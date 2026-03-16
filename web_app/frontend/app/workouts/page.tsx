import styles from "./workouts.module.css";

const workoutDays = [
  { month: "Aug", day: "18" },
  { month: "Aug", day: "19" },
  { month: "Aug", day: "20", active: true },
  { month: "Aug", day: "21" },
];

const workoutFilters = [
  { label: "Strength", active: true },
  { label: "Cardio" },
  { label: "Mobility" },
];

const workoutList = [
  {
    title: "Strength Forge",
    meta: "52 min · Upper body",
    accent: "indigo",
  },
  {
    title: "Core Tempo",
    meta: "28 min · Stability",
    accent: "gold",
  },
  {
    title: "Sprint Builder",
    meta: "34 min · Track",
    accent: "coral",
  },
  {
    title: "Mobility Reset",
    meta: "22 min · Recovery",
    accent: "mint",
  },
  {
    title: "Leg Power",
    meta: "46 min · Lower body",
    accent: "indigo",
  },
];

const workoutPhases = [
  { label: "Warm-up", value: "12 min", tone: "gold", width: "34%" },
  { label: "Strength", value: "28 min", tone: "indigo", width: "82%" },
  { label: "Mobility", value: "12 min", tone: "coral", width: "42%" },
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

function PhaseIcon({ tone }: { tone: string }) {
  return (
    <span className={`${styles.phaseIcon} ${styles[`phaseIcon${tone}`]}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export default function WorkoutsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <div className={styles.phoneShell}>
          <article className={`${styles.phone} ${styles.heroPhone}`}>
            <StatusBar />
            <div className={styles.heroGlow} aria-hidden="true" />
            <div className={styles.heroContent}>
              <p className={styles.heroEyebrow}>12-week plan</p>
              <h1 className={styles.heroTitle}>
                Personalized
                <br />
                Workouts
              </h1>
              <button className={styles.lightCta} type="button">
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
              <button className={styles.roundButton} type="button" aria-label="Go back">
                &lt;
              </button>
              <h2 className={styles.screenTitle}>Workout</h2>
              <button className={styles.roundButtonMuted} type="button" aria-label="Open options">
                ...
              </button>
            </header>

            <section className={styles.featureStage}>
              <button className={`${styles.sideArrow} ${styles.sideArrowLeft}`} type="button" aria-label="Previous workout">
                &lt;
              </button>
              <button className={`${styles.sideArrow} ${styles.sideArrowRight}`} type="button" aria-label="Next workout">
                &gt;
              </button>
              <div className={styles.featureHalo} aria-hidden="true" />
              <div className={styles.featureDisc}>
                <div className={styles.featureImage} />
              </div>
              <div className={styles.featureBadge}>Level 04</div>
            </section>

            <section className={styles.detailBody}>
              <h3 className={styles.featureTitle}>Athlete Engine</h3>
              <p className={styles.featureMeta}>Push and pull strength with controlled pacing.</p>
              <div className={styles.metaRow}>
                <span>48 min</span>
                <span>540 kcal</span>
                <span>Strength</span>
              </div>
            </section>

            <div className={styles.primaryPanel}>
              <button className={styles.darkCta} type="button">
                Start workout
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
                  <h3>Power &amp; Core</h3>
                  <p>Session split</p>
                </div>
                <div className={styles.metricsStat}>
                  <strong>52 min</strong>
                  <span>540 kcal</span>
                </div>
              </div>

              <div className={styles.phaseList}>
                {workoutPhases.map((phase) => (
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

              <button className={styles.darkCtaWide} type="button">
                Save session
                <span aria-hidden="true">-&gt;</span>
              </button>
            </section>
          </article>
        </div>

        <div className={styles.phoneShell}>
          <article className={`${styles.phone} ${styles.listPhone}`}>
            <StatusBar />
            <header className={styles.listHeader}>
              <button className={styles.listBack} type="button" aria-label="Go back">
                &lt;
              </button>
              <div>
                <p className={styles.listLabel}>My</p>
                <h2 className={styles.listTitle}>Workouts</h2>
              </div>
              <div className={styles.listActions}>
                <button className={styles.smallIconButton} type="button" aria-label="Create workout">
                  +
                </button>
                <button className={styles.smallIconButton} type="button" aria-label="Share workouts">
                  /
                </button>
              </div>
            </header>

            <div className={styles.dayScroller}>
              {workoutDays.map((day) => (
                <div
                  className={`${styles.dayCard} ${day.active ? styles.dayCardActive : ""}`}
                  key={`${day.month}-${day.day}`}
                >
                  <span>{day.month}</span>
                  <strong>{day.day}</strong>
                </div>
              ))}
            </div>

            <div className={styles.segmentedControl}>
              {workoutFilters.map((filter) => (
                <button
                  className={`${styles.segmentButton} ${filter.active ? styles.segmentButtonActive : ""}`}
                  key={filter.label}
                  type="button"
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <section className={styles.workoutList}>
              {workoutList.map((workout) => (
                <article className={styles.workoutCard} key={workout.title}>
                  <div className={`${styles.workoutAccent} ${styles[`workoutAccent${workout.accent}`]}`} aria-hidden="true" />
                  <div className={styles.workoutInfo}>
                    <h3>{workout.title}</h3>
                    <p>{workout.meta}</p>
                  </div>
                  <button className={styles.listDots} type="button" aria-label={`More about ${workout.title}`}>
                    ...
                  </button>
                </article>
              ))}
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
