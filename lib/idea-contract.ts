export const ideaDomains = [
  "Embedded systems",
  "Robotics",
  "RF & instrumentation",
  "Automation & IoT",
  "Computer vision",
  "Experimental engineering"
] as const;

export const ideaBudgets = [
  "Under ₹5,000",
  "₹5,000–₹15,000",
  "₹15,000–₹40,000",
  "₹40,000+",
  "Help me scope it"
] as const;

export const ideaSkills = [
  "Learning the fundamentals",
  "Comfortable building prototypes",
  "Experienced engineering team"
] as const;

export const ideaTimelines = [
  "2–4 weeks",
  "1–3 months",
  "3–6 months",
  "Flexible"
] as const;

export type IdeaInput = {
  domain: string;
  budget: string;
  skill: string;
  timeline: string;
  goal: string;
  constraints: string;
  refinement: string;
};

export type IdeaProposal = {
  title: string;
  summary: string;
  technologies: string[];
  architecture: string[];
  milestones: string[];
  feasibility: string;
  questions: string[];
};

export type IdeaResult = {
  source: "ai" | "local";
  introduction: string;
  ideas: IdeaProposal[];
};

// A deterministic worksheet, deliberately labelled separately from model output.
export function buildLocalBrief(input: IdeaInput): IdeaResult {
  const approaches: Record<string, { title: string; technologies: string[]; first: string }> = {
    "Embedded systems": { title: "Sensor-to-decision prototype", technologies: ["Microcontroller", "Sensor interface", "Embedded C/C++", "Serial diagnostics"], first: "Choose one measurable quantity and document the sensor range, interface and power requirements." },
    "Robotics": { title: "Mechanism and control demonstrator", technologies: ["Mechanical CAD", "Motor controller", "Position feedback", "Control firmware"], first: "Define the mechanism, motion envelope and feedback needed before selecting actuators." },
    "RF & instrumentation": { title: "Repeatable RF measurement platform", technologies: ["Receive antenna", "Band-compatible receiver", "Data acquisition", "Python plotting"], first: "Define a permitted receive-only measurement, frequency range and reference signal before selecting hardware." },
    "Automation & IoT": { title: "Connected condition-monitoring system", technologies: ["Microcontroller", "Condition sensors", "MQTT or HTTPS", "Dashboard"], first: "Select one process variable and define meaningful readings, stale-data handling and alert thresholds." },
    "Computer vision": { title: "Camera-based observation platform", technologies: ["Camera", "OpenCV", "Python", "Edge computer"], first: "Define the observable event and obtain permission to collect representative test images." },
    "Experimental engineering": { title: "Instrumented engineering test rig", technologies: ["Mechanical fixture", "Measurement sensors", "Data logging", "Analysis tools"], first: "Define a hypothesis, controlled inputs and measurable outputs for a contained experiment." }
  };
  const approach = approaches[input.domain] || approaches["Embedded systems"];
  return {
    source: "local",
    introduction: "This is a planning worksheet selected from your engineering domain. It has not been generated or validated by AI. Use your requirements below to refine it with the team.",
    ideas: [{
      title: approach.title,
      summary: "Planning objective: " + input.goal.trim().replace(/[.!?]+$/, "") + ". Start with a small, measurable prototype before committing to a complete build.",
      technologies: approach.technologies,
      architecture: [approach.first, "Map input, processing, output and power connections; identify interface compatibility and failure states.", "Capture readings or behaviour with timestamps and diagnostics so results can be reviewed."],
      milestones: ["Agree the problem, deliverables and acceptance criteria.", "Prove the critical interface with available equipment.", "Integrate the prototype and test normal, missing-data and failure cases.", "Document results, limitations and the next iteration."],
      feasibility: "Your targets: " + input.budget + " / " + input.timeline + " / " + input.skill + ". These are planning preferences, not a cost estimate or delivery commitment. Component choices and feasibility require a technical review.",
      questions: ["What measurable result would count as success?", "Which equipment is already available, and what constraints are non-negotiable?", "How will you test the result against a trustworthy reference?"]
    }]
  };
}

export function formatIdeaBrief(input: IdeaInput, proposal: IdeaProposal, source: "ai" | "local"): string {
  return [
    `==================================================`,
    `4TECH ENGINEERING BRIEF — ${proposal.title.toUpperCase()}`,
    `==================================================`,
    "Source: " + (source === "ai" ? "AI-generated concept — engineering review required" : "Local planning worksheet — no AI used"),
    `Goal: ${input.goal}`,
    `Domain: ${input.domain}`,
    `Target Budget: ${input.budget}`,
    `Skill Level: ${input.skill}`,
    `Target Timeline: ${input.timeline}`,
    `Constraints: ${input.constraints || "None specified"}`,
    `Refinement: ${input.refinement || "Standard"}`,
    ``,
    `SYSTEM SUMMARY:`,
    proposal.summary,
    ``,
    `RECOMMENDED TECHNOLOGIES & COMPONENTS:`,
    ...proposal.technologies.map((item) => `  • ${item}`),
    ``,
    `SYSTEM ARCHITECTURE:`,
    ...proposal.architecture.map((item) => `  [+] ${item}`),
    ``,
    `ENGINEERING MILESTONES:`,
    ...proposal.milestones.map((item, index) => `  ${index + 1}. ${item}`),
    ``,
    `FEASIBILITY & SCOPING:`,
    proposal.feasibility,
    ``,
    `ENGINEERING QUESTIONS TO RESOLVE:`,
    ...proposal.questions.map((item) => `  ? ${item}`),
    ``,
    `Ready to build this system with 4TECH?`,
    `Contact: mohammedvashir75@gmail.com | +91 93601 08408`,
    `==================================================`
  ].join("\n");
}

export function validIdeaResult(value: unknown): value is IdeaResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Record<string, unknown>;
  const text = (item: unknown, limit: number) => typeof item === "string" && item.trim().length > 0 && item.length <= limit;
  const list = (items: unknown, count: number) => Array.isArray(items) && items.length > 0 && items.length <= count && items.every((item) => text(item, 800));
  return (result.source === "ai" || result.source === "local") && text(result.introduction, 1200) && Array.isArray(result.ideas) && result.ideas.length > 0 && result.ideas.length <= 3 && result.ideas.every((item: unknown) => {
    if (!item || typeof item !== "object") return false;
    const idea = item as Record<string, unknown>;
    return text(idea.title, 200) && text(idea.summary, 1200) && text(idea.feasibility, 1200) && list(idea.technologies, 12) && list(idea.architecture, 10) && list(idea.milestones, 10) && list(idea.questions, 6);
  });
}
