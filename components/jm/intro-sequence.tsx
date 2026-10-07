'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import styles from './odometer-intro.module.css';

const CHARSET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:/+!?-&";
const CHAR_COUNT = CHARSET.length;
const storageKey = '4tech:intro-seen:v4';
let seenInThisPage = false;

interface Scene {
  plate: string;
  word: string;
  captionPrefix: string;
  captionItalic: string;
  captionSuffix: string;
}

function getTodayFormatted(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
}

const SCENES: Scene[] = [
  {
    plate: 'NO. 001 / 008',
    word: '4TECH.ENG',
    captionPrefix: 'Engineering hardware that ',
    captionItalic: 'shapes tomorrow',
    captionSuffix: '.',
  },
  {
    plate: 'NO. 002 / 008',
    word: getTodayFormatted(),
    captionPrefix: 'Today is a good day to ',
    captionItalic: 'build',
    captionSuffix: ' something.',
  },
  {
    plate: 'NO. 003 / 008',
    word: 'ROBOTICS',
    captionPrefix: 'Precision kinematics, 6-DOF actuation and ',
    captionItalic: 'closed-loop motion',
    captionSuffix: '.',
  },
  {
    plate: 'NO. 004 / 008',
    word: 'EMBEDDED',
    captionPrefix: 'Silicon, RTOS and sensors built for ',
    captionItalic: 'harsh reality',
    captionSuffix: '.',
  },
  {
    plate: 'NO. 005 / 008',
    word: 'RF + WAVE',
    captionPrefix: 'Microwave instrumentation and ',
    captionItalic: 'signal integrity',
    captionSuffix: '.',
  },
  {
    plate: 'NO. 006 / 008',
    word: 'CIRCUITS',
    captionPrefix: 'Multilayer PCB architecture designed to ',
    captionItalic: 'scale safely',
    captionSuffix: '.',
  },
  {
    plate: 'NO. 007 / 008',
    word: 'PROTOTYPE',
    captionPrefix: 'From bench validation to ',
    captionItalic: 'production reliability',
    captionSuffix: '.',
  },
  {
    plate: 'NO. 008 / 008',
    word: 'SHIP IT!',
    captionPrefix: 'Ideas need more than a spark — ',
    captionItalic: 'they need execution',
    captionSuffix: '.',
  },
];

function centerWord(word: string, length = 9): string {
  const clean = word.toUpperCase();
  if (clean.length >= length) return clean.slice(0, length);
  const leftPad = Math.floor((length - clean.length) / 2);
  return clean.padStart(leftPad + clean.length, ' ').padEnd(length, ' ');
}

function easeBackOut(t: number, c = 1.35): number {
  const p = t - 1;
  return 1 + (c + 1) * Math.pow(p, 3) + c * Math.pow(p, 2);
}

const INITIAL_CHARS = centerWord(SCENES[0].word, 9);

export default function IntroSequence() {
  const [visible, setVisible] = useState(true);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [cardEjected, setCardEjected] = useState(false);
  const [clockString, setClockString] = useState('00:00:00');
  const [progressRatio, setProgressRatio] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const machineUnitRef = useRef<HTMLDivElement>(null);
  const drumsContainerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize drums with Scene 0 positions so numbers are visible on initial mount
  const drumStates = useRef(
    INITIAL_CHARS.split('').map((char) => {
      const idx = CHARSET.indexOf(char);
      const pos = idx >= 0 ? idx : 0;
      return {
        currentPos: pos,
        startPos: pos,
        targetPos: pos,
        startTime: 0,
        duration: 1000,
        isAnimating: false,
        flickOffset: 0,
      };
    })
  );

  const isTransitioningRef = useRef(false);
  const lastWheelTime = useRef(0);
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sceneStartTimeRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Mechanical click synthesizer using Web Audio API
  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const bufferSize = Math.floor(ctx.sampleRate * 0.02); // 20ms noise burst
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, ctx.currentTime);
      filter.Q.setValueAtTime(3.2, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch {
      // AudioContext unavailable
    }
  }, [soundEnabled]);

  // Finish intro and reveal website
  const finish = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    seenInThisPage = true;
    try {
      window.sessionStorage.setItem(storageKey, '1');
    } catch {}
    document.documentElement.dataset.techIntroComplete = 'true';
    setVisible(false);
    window.dispatchEvent(new Event('4tech:intro-complete'));
  }, []);

  // Smooth curtain exit
  const exitIntro = useCallback(() => {
    if (isTransitioningRef.current) return;
    const root = rootRef.current;
    if (root) {
      gsap.to(root, {
        yPercent: -101,
        duration: 0.85,
        ease: 'power4.inOut',
        onComplete: finish,
      });
    } else {
      finish();
    }
  }, [finish]);

  // Transition drums to target scene
  const goToScene = useCallback(
    (sceneIdx: number, extraSpins = 0) => {
      const targetScene = SCENES[sceneIdx];
      const targetChars = centerWord(targetScene.word, 9);
      const now = performance.now();
      sceneStartTimeRef.current = now;
      setCurrentSceneIdx(sceneIdx);

      // Alternating stagger orders: 0 = L->R, 1 = R->L, 2 = Center-out
      const orderMode = sceneIdx % 3;

      targetChars.split('').forEach((char, i) => {
        const charIdx = CHARSET.indexOf(char);
        const validTargetIdx = charIdx >= 0 ? charIdx : 0;
        const state = drumStates.current[i];

        state.startPos = state.currentPos;
        const currentInt = Math.floor(state.currentPos);
        const currentMod = ((currentInt % CHAR_COUNT) + CHAR_COUNT) % CHAR_COUNT;

        let stepsForward = (validTargetIdx - currentMod + CHAR_COUNT) % CHAR_COUNT;
        if (stepsForward === 0 && extraSpins > 0) {
          stepsForward = CHAR_COUNT;
        }
        stepsForward += extraSpins * CHAR_COUNT;

        state.targetPos = currentInt + stepsForward;

        let staggerDelay = 0;
        if (orderMode === 0) staggerDelay = i * 75; // left to right
        else if (orderMode === 1) staggerDelay = (8 - i) * 75; // right to left
        else staggerDelay = Math.abs(4 - i) * 85; // center out

        state.startTime = now + staggerDelay;
        state.duration = Math.min(2200, 600 + stepsForward * 24);
        state.isAnimating = true;
      });
    },
    []
  );

  const nextScene = useCallback(() => {
    const nextIdx = (currentSceneIdx + 1) % SCENES.length;
    goToScene(nextIdx);
  }, [currentSceneIdx, goToScene]);

  const prevScene = useCallback(() => {
    const prevIdx = (currentSceneIdx - 1 + SCENES.length) % SCENES.length;
    goToScene(prevIdx);
  }, [currentSceneIdx, goToScene]);

  // Pull knob random spin
  const triggerPullKnob = useCallback(() => {
    const randomIdx = Math.floor(Math.random() * SCENES.length);
    goToScene(randomIdx, 1);
  }, [goToScene]);

  // Interactive drum flick on hover
  const flickDrum = useCallback((index: number) => {
    const st = drumStates.current[index];
    if (!st.isAnimating) {
      gsap.to(st, {
        flickOffset: 0.32,
        duration: 0.18,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(st, {
            flickOffset: 0,
            duration: 0.3,
            ease: 'back.out(2)',
          });
        },
      });
    }
  }, []);

  // Card eject interaction
  const triggerCardEject = useCallback(() => {
    setCardEjected(true);
    setTimeout(() => {
      setCardEjected(false);
    }, 900);
  }, []);

  // Render loop using projected cylinder math
  useEffect(() => {
    let active = true;

    const render = () => {
      if (!active) return;
      const now = performance.now();

      // Update progress ratio for active scene
      const elapsed = now - sceneStartTimeRef.current;
      const ratio = Math.min(1, elapsed / 4000);
      setProgressRatio(ratio);

      const drumsContainer = drumsContainerRef.current;
      if (drumsContainer) {
        const drumCells = drumsContainer.querySelectorAll<HTMLDivElement>('[data-drum-cell]');
        const cellHeight = drumCells[0]?.offsetHeight || 136;
        const faceHeight = cellHeight / 1.62;
        const R = faceHeight / (2 * Math.sin((17 * Math.PI) / 180));

        drumStates.current.forEach((st, drumIdx) => {
          if (st.isAnimating) {
            if (now >= st.startTime) {
              const progress = Math.min(1, (now - st.startTime) / st.duration);
              const eased = easeBackOut(progress);
              st.currentPos = st.startPos + (st.targetPos - st.startPos) * eased;

              if (progress >= 1) {
                st.currentPos = st.targetPos;
                st.isAnimating = false;
                playClick();
              }
            }
          }

          const cell = drumCells[drumIdx];
          if (!cell) return;

          const faces = cell.querySelectorAll<HTMLDivElement>('[data-drum-face]');
          const effectivePos = st.currentPos + st.flickOffset;
          const intPart = Math.floor(effectivePos);
          const fracPart = effectivePos - intPart;

          // Project 6 faces (-2 to +3 relative to intPart)
          faces.forEach((face, fIdx) => {
            const offset = fIdx - 2;
            const angleDeg = (offset - fracPart) * 34;
            const angleRad = (angleDeg * Math.PI) / 180;

            if (Math.abs(angleDeg) >= 88) {
              face.style.opacity = '0';
              face.style.transform = 'translateY(calc(-50% + 200px)) scaleY(0)';
            } else {
              const translateY = R * Math.sin(angleRad);
              const scaleY = Math.cos(angleRad);
              const charIndex = ((intPart + offset) % CHAR_COUNT + CHAR_COUNT) % CHAR_COUNT;

              face.textContent = CHARSET[charIndex] || ' ';
              face.style.opacity = '1';
              face.style.transform = `translateY(calc(-50% + ${translateY.toFixed(2)}px)) scaleY(${scaleY.toFixed(3)})`;
            }
          });
        });
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [playClick]);

  // Auto-cycle scenes every 4.2 seconds
  useEffect(() => {
    cycleTimerRef.current = setTimeout(() => {
      nextScene();
    }, 4200);

    return () => {
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
    };
  }, [currentSceneIdx, nextScene]);

  // Live real-time clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setClockString(`${h}:${m}:${s}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initial load check
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let alreadySeen = seenInThisPage;
    try {
      alreadySeen ||= window.sessionStorage.getItem(storageKey) === '1';
    } catch {}

    if (reduced || alreadySeen) {
      finish();
      return;
    }

    sceneStartTimeRef.current = performance.now();

    // Keyboard shortcuts [ESC / Space / Enter]
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        exitIntro();
      } else if (e.key === ' ' || e.key === 'Enter') {
        nextScene();
      } else if (e.key === 'ArrowRight') {
        nextScene();
      } else if (e.key === 'ArrowLeft') {
        prevScene();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [exitIntro, finish, nextScene, prevScene]);

  // Mouse tilt and radial light follow
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    root.style.setProperty('--mouse-x', `${x * 100}%`);
    root.style.setProperty('--mouse-y', `${y * 100}%`);

    if (machineUnitRef.current) {
      const rotX = -(y - 0.5) * 8;
      const rotY = (x - 0.5) * 8;
      machineUnitRef.current.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    }
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const now = performance.now();
      if (now - lastWheelTime.current < 650) return;
      lastWheelTime.current = now;

      if (e.deltaY > 20) {
        nextScene();
      } else if (e.deltaY < -20) {
        prevScene();
      }
    },
    [nextScene, prevScene]
  );

  if (!visible) return null;

  const currentScene = SCENES[currentSceneIdx];

  return (
    <div
      ref={rootRef}
      className={styles.root}
      onMouseMove={handleMouseMove}
      aria-label="4TECH Engineering Odometer Mechanical Intro"
      role="region"
    >
      <div className={styles.noiseOverlay} aria-hidden="true" />

      {/* =========================================================================
          TOP NAVIGATION BAR (3-Column Grid)
          ========================================================================= */}
      <header className={styles.nav}>
        <div className={styles.navLeft}>
          <a href="#main" onClick={(e) => { e.preventDefault(); exitIntro(); }} className={styles.logo}>
            4TECH<sup>®</sup>
          </a>
        </div>

        <ul className={styles.navLinks}>
          <li className={styles.navItem}>
            <a href="#projects" onClick={(e) => { e.preventDefault(); exitIntro(); }} className={styles.navLink}>
              <span>WORK <sup style={{ fontSize: '9px' }}>06</sup></span>
              <span>WORK <sup style={{ fontSize: '9px' }}>06</sup></span>
            </a>
          </li>
          <li className={styles.navItem}>
            <a href="#about" onClick={(e) => { e.preventDefault(); exitIntro(); }} className={styles.navLink}>
              <span>ABOUT</span>
              <span>ABOUT</span>
            </a>
          </li>
          <li className={styles.navItem}>
            <a href="#roadmap" onClick={(e) => { e.preventDefault(); exitIntro(); }} className={styles.navLink}>
              <span>PROCESS</span>
              <span>PROCESS</span>
            </a>
          </li>
          <li className={styles.navItem}>
            <a href="#services" onClick={(e) => { e.preventDefault(); exitIntro(); }} className={styles.navLink}>
              <span>CAPABILITIES</span>
              <span>CAPABILITIES</span>
            </a>
          </li>
        </ul>

        <div className={styles.navRight}>
          {/* Live Mechanical Rolling Clock */}
          <div className={styles.clockWrap} title="Studio Master Clock">
            <span>{clockString}</span>
          </div>

          {/* Sound Synthesizer Toggle */}
          <button
            type="button"
            className={styles.soundBtn}
            onClick={() => setSoundEnabled((prev) => !prev)}
            aria-label={soundEnabled ? 'Disable mechanical sound' : 'Enable mechanical sound'}
            title="Toggle mechanical relay clicks"
          >
            <span>SOUND</span>
            <div className={styles.eqBars} aria-hidden="true">
              <span className={styles.eqBar} data-active={soundEnabled} style={{ height: soundEnabled ? undefined : '3px' }} />
              <span className={styles.eqBar} data-active={soundEnabled} style={{ height: soundEnabled ? undefined : '7px' }} />
              <span className={styles.eqBar} data-active={soundEnabled} style={{ height: soundEnabled ? undefined : '4px' }} />
            </div>
          </button>

          {/* Action Button */}
          <a href="/account" onClick={(e) => { e.preventDefault(); exitIntro(); }} className={styles.talkBtn}>
            <span className={styles.talkDot} aria-hidden="true" />
            <span>LET&apos;S TALK</span>
          </a>
        </div>
      </header>

      {/* =========================================================================
          THE MACHINE (Centered Skeuomorphic Console)
          ========================================================================= */}
      <section className={styles.machineStage} aria-label="Mechanical Odometer Console">
        <div ref={machineUnitRef} className={styles.machineUnit}>
          {/* Top Plate: Scene Number */}
          <div className={styles.scenePlate}>
            <span className={styles.scenePlateLed}>{currentScene.plate}</span>
          </div>

          {/* Recessed Odometer Aperture + Engineering Card Slot */}
          <div className={styles.counterEnclosure} onWheel={handleWheel}>
            {/* 9 Mechanical Rolling Drums Bank */}
            <div
              ref={drumsContainerRef}
              className={styles.drumsBank}
              onClick={nextScene}
              role="button"
              tabIndex={0}
              aria-label="Advance mechanical odometer counter"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  nextScene();
                }
              }}
            >
              <div className={styles.drumsShading} aria-hidden="true" />

              {Array.from({ length: 9 }).map((_, drumIdx) => {
                const initialChar = INITIAL_CHARS[drumIdx];
                const initialPos = Math.max(0, CHARSET.indexOf(initialChar));

                return (
                  <div
                    key={drumIdx}
                    className={styles.drumCell}
                    data-drum-cell="true"
                    onMouseEnter={() => flickDrum(drumIdx)}
                  >
                    {/* 6 Projected Cylinder Faces */}
                    {Array.from({ length: 6 }).map((__, faceIdx) => {
                      const offset = faceIdx - 2;
                      const charIdx = ((initialPos + offset) % CHAR_COUNT + CHAR_COUNT) % CHAR_COUNT;
                      return (
                        <div
                          key={faceIdx}
                          className={styles.drumFace}
                          data-drum-face="true"
                        >
                          {CHARSET[charIdx] || ' '}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Milled Engineering Card Slot */}
            <div
              className={styles.cardSlot}
              onClick={triggerCardEject}
              title="Click to eject 4TECH Laboratory Dossier Card"
              role="button"
              tabIndex={0}
              aria-label="Inspect 4TECH Laboratory Dossier Card"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  triggerCardEject();
                }
              }}
            >
              <div className={styles.cardMouth} aria-hidden="true" />
              <div className={styles.cardItem} data-ejected={cardEjected}>
                <div className={styles.cardChip} aria-hidden="true" />
                <div className={styles.cardMeta}>
                  <span className={styles.cardLogo}>4TECH</span>
                  <span>LABS // 26</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actuator Pull Knob */}
          <div
            className={styles.knobContainer}
            onClick={triggerPullKnob}
            role="button"
            tabIndex={0}
            aria-label="Pull knob to cycle random engineering scene"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerPullKnob();
              }
            }}
          >
            <div className={styles.knobBall} aria-hidden="true" />
            <span className={styles.knobLabel}>PULL</span>
          </div>

          {/* Big Editorial Caption */}
          <div className={styles.captionWrap} aria-live="polite">
            <h2 className={styles.captionText}>
              {currentScene.captionPrefix}
              <em>{currentScene.captionItalic}</em>
              {currentScene.captionSuffix}
            </h2>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM RAIL & TRANSITION TO SITE
          ========================================================================= */}
      <footer className={styles.rail}>
        <div className={styles.railLeft}>
          <span>HARDWARE ARCHITECTURE // EMBEDDED SYSTEMS // KINEMATICS</span>
        </div>

        {/* 8 Scene Progress Segments */}
        <div className={styles.progressSegments} aria-label="Scene progress indicator">
          {SCENES.map((_, idx) => (
            <div
              key={idx}
              className={styles.progressSegment}
              data-past={idx < currentSceneIdx}
            >
              <div
                className={styles.progressSegmentFill}
                style={{
                  width:
                    idx < currentSceneIdx
                      ? '100%'
                      : idx === currentSceneIdx
                      ? `${progressRatio * 100}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Enter Studio CTA / Skip */}
        <button
          type="button"
          onClick={exitIntro}
          className={styles.enterSiteBtn}
          aria-label="Enter 4TECH Engineering Studio and explore site"
        >
          <span>ENTER STUDIO →</span>
          <div className={styles.scrollIndicatorLine} aria-hidden="true">
            <span className={styles.scrollPip} />
          </div>
        </button>
      </footer>
    </div>
  );
}
