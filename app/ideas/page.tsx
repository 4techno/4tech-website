import type { Metadata } from "next";
import IdeaStudio from "@/components/ideas/idea-studio";
import styles from "@/components/ideas/idea-studio.module.css";

export const metadata: Metadata = {
  title: "Project Idea Studio",
  description: "Turn an engineering question into a project brief. Explore scope, technologies, architecture and practical next steps with 4TECH.",
  alternates: { canonical: "/ideas" },
};

export default function IdeasPage() {
  return <main id="main" className={styles.page}>
    <header className={styles.heading}><p className={styles.kicker}>4TECH / IDEA STUDIO</p><h1>A question today.<br/><em>A project tomorrow.</em></h1><p>Tell us what you want to explore. Shape an engineering concept around your interests, resources and time, then bring the brief to our team.</p></header>
    <IdeaStudio/>
    <section className={styles.explainer} aria-label="How the idea studio works"><article><span>01</span><h2>Define the question</h2><p>Start with a useful outcome and the constraints that matter.</p></article><article><span>02</span><h2>Explore the direction</h2><p>Review a concept, system architecture and a practical sequence of work.</p></article><article><span>03</span><h2>Make it concrete</h2><p>Share your brief with 4TECH to agree the scope, cost and validation plan.</p></article></section>
  </main>;
}
