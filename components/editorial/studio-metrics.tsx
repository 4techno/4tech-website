import styles from './studio-metrics.module.css';

const disciplines = [
  { number: '01', name: 'Embedded systems', detail: 'Firmware, sensing and control electronics.' },
  { number: '02', name: 'Robotics', detail: 'Mechanisms, kinematics and motion control.' },
  { number: '03', name: 'RF instrumentation', detail: 'Signal acquisition and measurement workflows.' },
  { number: '04', name: 'Research prototypes', detail: 'Feasibility, simulation and iterative testing.' },
] as const;

export default function StudioMetricsStrip() {
  return (
    <section className={styles.strip} aria-label="4TECH engineering disciplines">
      <div className={styles.header}>
        <span className={styles.kicker}>[ 01 / ENGINEERING FOCUS ]</span>
        <span className={styles.note}>From a defined question to a testable system.</span>
      </div>
      <div className={styles.grid}>
        {disciplines.map((item) => (
          <div key={item.number} className={styles.card}>
            <span className={styles.number}>{item.number}</span>
            <h2>{item.name}</h2>
            <p>{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
