'use client';
import styles from './team.module.css';
export default function PrintResume() { return <button className={styles.printButton} type="button" onClick={() => window.print()}>Print / Save as PDF</button>; }
