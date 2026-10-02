"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { User } from "firebase/auth";
import { buildLocalBrief, formatIdeaBrief, ideaBudgets, ideaDomains, ideaSkills, ideaTimelines, validIdeaResult, type IdeaInput, type IdeaResult } from "@/lib/idea-contract";
import { openAiCopilot } from "@/components/ai/ai-copilot";
import styles from "./idea-studio.module.css";

const configuredEndpoint = process.env.NEXT_PUBLIC_IDEA_API_URL?.trim() || "";
function apiEndpoint() {
  try { const url = new URL(configuredEndpoint); return url.protocol === "https:" && !url.username && !url.password ? url.toString() : ""; } catch { return ""; }
}
const endpoint = apiEndpoint();
const initialInput: IdeaInput = { domain: ideaDomains[0], budget: ideaBudgets[4], skill: ideaSkills[1], timeline: ideaTimelines[1], goal: "", constraints: "", refinement: "" };

const quickPrompts = [
  {
    label: "Drone telemetry",
    domain: "Robotics",
    budget: "₹15,000–₹40,000",
    skill: "Comfortable building prototypes",
    timeline: "1–3 months",
    goal: "Build an autonomous quadcopter drone with closed-loop PID attitude stabilization, inertial measurement, and wireless telemetry streaming.",
    constraints: "ESP32 flight computer, MPU6050 IMU over 400kHz I2C, brushless motors with ESCs."
  },
  {
    label: "Wireless power",
    domain: "Experimental engineering",
    budget: "₹5,000–₹15,000",
    skill: "Learning the fundamentals",
    timeline: "2–4 weeks",
    goal: "Design a high-efficiency resonant inductive wireless power transmission system with real-time coil voltage and current telemetry.",
    constraints: "Coupled planar coils, Schottky bridge rectifier, capacitor filtering, 5V regulated output."
  },
  {
    label: "Robotic mechanisms",
    domain: "Robotics",
    budget: "₹15,000–₹40,000",
    skill: "Experienced engineering team",
    timeline: "3–6 months",
    goal: "Develop a 5-DOF articulated robotic arm with Denavit-Hartenberg inverse kinematics, smooth microstepping control, and custom gripper.",
    constraints: "SOLIDWORKS 3D CAD, NEMA steppers with TMC2209 silent drivers, absolute position feedback."
  },
  {
    label: "Solar monitoring",
    domain: "Embedded systems",
    budget: "₹5,000–₹15,000",
    skill: "Comfortable building prototypes",
    timeline: "1–3 months",
    goal: "Design a high-efficiency maximum power point tracking (MPPT) solar charger with synchronous buck-boost converter and cloud telemetry.",
    constraints: "Perturb and Observe algorithm, INA219 current/voltage monitors, LiFePO4 battery."
  },
  {
    label: "Environmental sensing",
    domain: "Automation & IoT",
    budget: "Under ₹5,000",
    skill: "Learning the fundamentals",
    timeline: "2–4 weeks",
    goal: "Create a bench-top environmental sensor data logger to learn about sensor response, calibration and stale-data detection. This is an educational prototype, not a worker safety instrument.",
    constraints: "Controlled indoor testing with temperature and humidity sensors first; no confined-space deployment."
  },
  {
    label: "Attendance system",
    domain: "Embedded systems",
    budget: "₹5,000–₹15,000",
    skill: "Comfortable building prototypes",
    timeline: "1–3 months",
    goal: "Build a secure IoT biometric verification and attendance terminal with optical fingerprint scanning, OLED display, and cloud logging.",
    constraints: "R307S optical sensor over UART, SSD1306 display, REST / SQL database sync."
  }
];

export default function IdeaStudio() {
  const [input, setInput] = useState<IdeaInput>(initialInput);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(!endpoint);
  const [result, setResult] = useState<IdeaResult | null>(null);
  const [submittedInput, setSubmittedInput] = useState<IdeaInput>(initialInput);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    let unsubscribe = () => {};
    if (endpoint) void Promise.all([import("firebase/auth"), import("@/lib/firebase")]).then(([auth, client]) => {
      if (!alive) return;
      unsubscribe = auth.onAuthStateChanged(client.getFirebaseClient().auth, (current) => { setUser(current); setAuthReady(true); }, () => { setAuthReady(true); });
    }).catch(() => { if (alive) setAuthReady(true); });
    return () => { alive = false; unsubscribe(); requestRef.current?.abort(); };
  }, []);

  function update<K extends keyof IdeaInput>(key: K, value: IdeaInput[K]) { setInput((previous) => ({ ...previous, [key]: value })); }
  function showResult(next: IdeaResult, snapshot: IdeaInput) {
    setResult(next); setSubmittedInput(snapshot); setCopied(null);
    requestAnimationFrame(() => resultRef.current?.focus({ preventScroll: false }));
  }
  function localBrief() {
    if (input.goal.trim().length < 12) { setMessage("Describe the result you want in at least 12 characters."); return; }
    setMessage(""); showResult(buildLocalBrief(input), { ...input });
  }
  function applyQuickPrompt(prompt: typeof quickPrompts[number]) {
    const nextInput: IdeaInput = {
      domain: prompt.domain,
      budget: prompt.budget,
      skill: prompt.skill,
      timeline: prompt.timeline,
      goal: prompt.goal,
      constraints: prompt.constraints,
      refinement: ""
    };
    setInput(nextInput);
    setMessage("");
    showResult(buildLocalBrief(nextInput), nextInput);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity() || busy) return;
    if (!endpoint) { localBrief(); return; }
    if (!user) { setMessage("Sign in to use AI, or build a local planning worksheet below."); return; }
    if (!user.emailVerified) { setMessage("Verify your account email before using AI. The local worksheet is available now."); return; }
    const snapshot = { ...input };
    setBusy(true); setMessage("");
    const controller = new AbortController(); requestRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 32000);
    try {
      const token = await user.getIdToken();
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(snapshot), signal: controller.signal, credentials: "omit", cache: "no-store" });
      if (!response.ok) {
        if (response.status === 429) throw new Error("The idea limit has been reached. Try later, or use the local worksheet.");
        if (response.status === 401 || response.status === 403) throw new Error("Please sign in again with a verified account, then retry.");
        throw new Error("The AI service is unavailable right now. You can still build a local planning worksheet.");
      }
      const text = await response.text();
      if (text.length > 20000) throw new Error("The response could not be displayed. Please try again.");
      const data: unknown = JSON.parse(text);
      if (!validIdeaResult(data)) throw new Error("The response could not be displayed. Please try again.");
      showResult(data, snapshot);
    } catch (error) { if (!controller.signal.aborted) setMessage(error instanceof Error ? error.message : "Please try again."); else setMessage("The request took too long. Try again or use the local worksheet."); }
    finally { clearTimeout(timeout); if (requestRef.current === controller) requestRef.current = null; setBusy(false); }
  }
  async function copyBrief(index: number) {
    if (!result) return;
    try { await navigator.clipboard.writeText(formatIdeaBrief(submittedInput, result.ideas[index], result.source)); setCopied(index); }
    catch { setMessage("Clipboard access is unavailable. Use the Download brief button instead."); }
  }
  function downloadBrief(index: number) {
    if (!result) return;
    const url = URL.createObjectURL(new Blob([formatIdeaBrief(submittedInput, result.ideas[index], result.source)], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "4TECH-project-brief.txt"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <div className={styles.studio}>
    <form className={styles.form} onSubmit={submit} aria-busy={busy}>
      <div className={styles.formTitle}>
        <span className={styles.kicker}>4TECH / PROJECT PLANNING</span>
        <h2>What are you curious about?</h2>
        <p className={styles.serviceNote}>Choose an engineering direction to explore immediately, or customize your parameters:</p>
        <div className={styles.chips} role="group" aria-label="Suggested project starters">
          {quickPrompts.map((p) => (
            <button
              key={p.label}
              type="button"
              className={styles.chip}
              onClick={() => applyQuickPrompt(p)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.fields}>
        <label>Engineering domain<select value={input.domain} onChange={(event) => update("domain", event.target.value)}>{ideaDomains.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Budget target<select value={input.budget} onChange={(event) => update("budget", event.target.value)}>{ideaBudgets.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Experience<select value={input.skill} onChange={(event) => update("skill", event.target.value)}>{ideaSkills.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Time available<select value={input.timeline} onChange={(event) => update("timeline", event.target.value)}>{ideaTimelines.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <label>The outcome you want<textarea required minLength={12} maxLength={900} rows={4} value={input.goal} onChange={(event) => update("goal", event.target.value)} placeholder="For example: monitor the condition of a small motor and understand how vibration changes with load."/></label>
      <label>Available equipment and constraints <span>(optional)</span><textarea maxLength={700} rows={3} value={input.constraints} onChange={(event) => update("constraints", event.target.value)} placeholder="Components you have, workspace, power limits or the feature that matters most."/></label>
      {result && <label>Refine your direction <span>(optional)</span><textarea maxLength={600} rows={2} value={input.refinement} onChange={(event) => update("refinement", event.target.value)} placeholder="For example: simplify the mechanical work, keep it offline or focus on measurement accuracy."/></label>}
      <p className={styles.serviceNote}>
        {endpoint
          ? "Cloud AI uses your project requirements to suggest concepts through the configured 4TECH service. Concepts need an engineering review before use."
          : "This local worksheet organizes your requirements into a starting brief. The Project Planner also offers on-device templates. Cloud AI is not enabled for this release."}
      </p>
      {endpoint && authReady && !user && <p className={styles.loginNote}><Link href="/account">Sign in to use cloud AI</Link><span>Return here after signing in. The local worksheet and Project Planner need no account.</span></p>}
      <div className={styles.actions}>
        <button className={styles.primary} disabled={busy || (Boolean(endpoint) && (!authReady || !user))} type="submit">
          {busy ? "Synthesizing engineering brief…" : endpoint ? "Generate AI Engineering Brief" : "Build planning brief"}
        </button>
        <button
          className={styles.secondary}
          type="button"
          disabled={busy}
          onClick={() =>
            openAiCopilot(
              input.goal.trim()
                ? `Architect an engineering system for: ${input.goal.trim()}. Domain: ${input.domain}, Target Budget: ${input.budget}. Constraints: ${input.constraints.trim() || 'None'}`
                : undefined
            )
          }
        >
          Open Project Planner
        </button>
        {endpoint && <button className={styles.secondary} type="button" disabled={busy} onClick={localBrief}>Use local worksheet</button>}
      </div>
      <p role="status" aria-live="polite" className={styles.status}>{message}</p>
      <noscript><p>This guided form needs JavaScript. You can still <a href="/projects">explore our engineering projects</a> or <a href="/#contact">contact 4TECH</a> with your requirements.</p></noscript>
    </form>
    <div ref={resultRef} tabIndex={-1} className={styles.results} aria-label="Your project directions">
      {result ? <><div className={styles.resultIntro}><span className={styles.kicker}>{result.source === "ai" ? "AI-GENERATED CONCEPTS" : "LOCAL PLANNING WORKSHEET"}</span><h2>A direction to explore.</h2><p>{result.introduction}</p></div>{result.ideas.map((idea, index) => <article className={styles.idea} key={`${index}-${idea.title}`}><div className={styles.ideaIndex}>{String(index + 1).padStart(2, "0")} / CONCEPT</div><h3>{idea.title}</h3><p>{idea.summary}</p><ul className={styles.tags} aria-label="Suggested technologies">{idea.technologies.map((tag, i) => <li key={`${i}-${tag}`}>{tag}</li>)}</ul><details open><summary>System architecture</summary><ol>{idea.architecture.map((step, i) => <li key={i}>{step}</li>)}</ol></details><details><summary>Development milestones</summary><ol>{idea.milestones.map((step, i) => <li key={i}>{step}</li>)}</ol></details><details><summary>Feasibility & open questions</summary><p>{idea.feasibility}</p><ul>{idea.questions.map((question, i) => <li key={i}>{question}</li>)}</ul></details><div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => void copyBrief(index)}>{copied === index ? "Brief copied ✓" : "Copy brief"}</button><button type="button" className={styles.textButton} onClick={() => downloadBrief(index)}>Download brief ↓</button></div><div className={styles.commissionBox}><div><strong>Commission this build with 4TECH</strong><p>Mohammed Vashir and Sabeel Ahamed will evaluate your brief and formulate a complete fabrication proposal.</p></div><Link href="/account#request-heading" className={styles.primary}>Start Project Enquiry →</Link></div></article>)}</> : <div className={styles.empty}><div className={styles.orbit} aria-hidden="true"><span>?</span></div><span className={styles.kicker}>ROOM FOR POSSIBILITY</span><h2>Start with the problem.<br/>Build towards the answer.</h2><p>Your direction will include an architecture, milestones, suggested technologies and the questions worth resolving first.</p><Link href="/projects">Explore completed engineering work</Link></div>}
    </div>
  </div>;
}
