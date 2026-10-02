'use client';

import React, { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { openAiCopilot } from './ai-copilot';
import styles from './ai-home-section.module.css';

const SAMPLE_ARCHITECTURES = [
  {
    code: '[01/UAV]',
    core: 'ESP32-S3 + MPU6050',
    title: 'Autonomous Drone Flight Controller',
    desc: 'Explore inertial sensing, attitude control, motor interfaces and telemetry, with staged bench and tethered testing.',
    prompt: 'Design an autonomous quadrotor drone flight controller with IMU attitude stabilization, cascaded PID loops, and telemetry.'
  },
  {
    code: '[02/ARM]',
    core: 'STM32F4 + TMC2209',
    title: '6-DOF Articulated Robotic Arm',
    desc: 'Plan joint feedback, motion control and inverse kinematics. Establish payload and positioning targets before selecting hardware.',
    prompt: 'Architect a 6-DOF articulated robotic arm with stepper motors, magnetic encoders, and inverse kinematics.'
  },
  {
    code: '[03/PWR]',
    core: 'Class-D H-Bridge + Litz Coils',
    title: 'Resonant Wireless Power System',
    desc: 'Explore coil coupling, power conversion and thermal monitoring. Output power and efficiency remain design targets to validate.',
    prompt: 'Design a 50W resonant inductive wireless power transmission system operating in the 100-200kHz range.'
  },
  {
    code: '[04/IOT]',
    core: 'SX1262 + Low-Power MCU',
    title: 'Ultra-Low-Power LoRa Sensor Mesh',
    desc: 'Outline environmental sensing, radio telemetry and power management. Measure battery life and link reliability during prototyping.',
    prompt: 'Architect an ultra-low-power environmental sensor node network communicating over 865MHz LoRa with deep sleep.'
  }
];

export default function AiHomeSection() {
  const [promptInput, setPromptInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) {
      openAiCopilot();
      return;
    }
    openAiCopilot(promptInput);
    setPromptInput('');
  };

  const handleCardClick = (prompt: string) => {
    openAiCopilot(prompt);
  };

  return (
    <section id="ai-copilot" className={styles.section} aria-labelledby="ai-section-title">
      <div className={styles.shell}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>
            <span>4TECH / PROJECT PLANNING</span>
            <span className={styles.aiBadge}>LOCAL TEMPLATES</span>
          </p>
          <h2 id="ai-section-title" className={styles.title}>
            Meet your Project Planner.<br />
            <em>Give your next idea a direction.</em>
          </h2>
          <p className={styles.lead}>
            Explore engineering planning templates for components, system architecture and prototyping milestones. Your input stays in this browser. Use the result to prepare an enquiry with 4TECH.
          </p>
        </div>

        <div className={styles.launcherBox}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              className={styles.input}
              placeholder="What are you engineering? e.g. Autonomous drone flight controller, 6-DOF arm, or 50W wireless power…"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              aria-label="Describe your project to the 4TECH Project Planner"
            />
            <button type="submit" className={styles.submitBtn}>
              Open Project Planner
            </button>
          </form>

          <div className={styles.cardsGrid}>
            {SAMPLE_ARCHITECTURES.map((arch) => (
              <button
                key={arch.code}
                type="button"
                className={styles.card}
                onClick={() => handleCardClick(arch.prompt)}
              >
                <div>
                  <div className={styles.cardTop}>
                    <span className={styles.cardCode}>{arch.code}</span>
                    <span className={styles.cardCore}>{arch.core}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{arch.title}</h3>
                  <p className={styles.cardDesc}>{arch.desc}</p>
                </div>
                <div className={styles.cardFooter}>
                  <span>Explore Planning Template</span>
                  <span className={styles.cardArrow} aria-hidden="true">→</span>
                </div>
              </button>
            ))}
          </div>

          <div className={styles.bottomRow}>
            <p className={styles.disclaimer}>
              Templates are starting points, not validated designs or quotations. Component compatibility, costs and performance need an engineering review.
            </p>
            <Link href="/ideas" className={styles.ideaLink}>
              Open Idea Studio worksheet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
