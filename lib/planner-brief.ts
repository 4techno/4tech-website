import { ideaDomains, type IdeaInput, type IdeaProposal } from "./idea-contract";
import type { EngineeringReply } from "./engineering-contract";
import type { RequestInput } from "./customer-request";

export const plannerProjectTypes = [...ideaDomains, "To be scoped"] as const;
export const plannerBriefStorageKey = "4tech:pending-project-brief:v1";
const briefLifetime = 24 * 60 * 60 * 1000;

export type PlannerBrief = {
  version: 1;
  createdAt: number;
  source: "local" | "ai" | "direct";
  projectType: string;
  title: string;
  goal: string;
  constraints: string;
  timeline: string;
  budgetRange: string;
  openQuestions: string;
  planningNotes: string;
};

type BriefFields = Omit<PlannerBrief, "version" | "createdAt">;
type BriefStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const clean = (value: string) => value.trim();

function validBrief(value: unknown): value is PlannerBrief {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const brief = value as Record<string, unknown>;
  const expected = ["version", "createdAt", "source", "projectType", "title", "goal", "constraints", "timeline", "budgetRange", "openQuestions", "planningNotes"];
  if (Object.keys(brief).length !== expected.length || Object.keys(brief).some(key => !expected.includes(key))) return false;
  const within = (key: string, min: number, max: number) => typeof brief[key] === "string" && (brief[key] as string).trim().length >= min && (brief[key] as string).length <= max;
  return brief.version === 1 && typeof brief.createdAt === "number" && Number.isFinite(brief.createdAt)
    && (brief.source === "local" || brief.source === "ai" || brief.source === "direct")
    && typeof brief.projectType === "string" && plannerProjectTypes.includes(brief.projectType as typeof plannerProjectTypes[number])
    && within("title", 3, 120) && within("goal", 10, 3000) && within("constraints", 0, 1300)
    && within("timeline", 0, 100) && within("budgetRange", 0, 100)
    && within("openQuestions", 0, 800) && within("planningNotes", 0, 400);
}

export function createPlannerBrief(fields: BriefFields, now = Date.now()): PlannerBrief {
  const brief: PlannerBrief = {
    version: 1, createdAt: now, source: fields.source,
    projectType: fields.projectType, title: clean(fields.title), goal: clean(fields.goal),
    constraints: clean(fields.constraints), timeline: clean(fields.timeline),
    budgetRange: clean(fields.budgetRange), openQuestions: clean(fields.openQuestions),
    planningNotes: clean(fields.planningNotes),
  };
  if (!validBrief(brief)) throw new Error("Review the brief fields and shorten any text that exceeds its limit.");
  if (formatPlannerRequest(brief).details.length > 6000) throw new Error("The brief is too long for an enquiry. Shorten its notes or questions before continuing.");
  return brief;
}

// Keep complete lines where possible so a suggested question is not cut mid-sentence.
function fitLines(lines: string[], limit: number): string {
  const result: string[] = [];
  for (const line of lines.map(clean).filter(Boolean)) {
    const next = [...result, line].join("\n");
    if (next.length > limit) break;
    result.push(line);
  }
  return result.join("\n");
}

export function draftFromEngineeringReply(question: string, reply: EngineeringReply): BriefFields {
  const title = question.trim().split(/[\n.!?]/, 1)[0].trim().slice(0, 120);
  return {
    source: reply.source, projectType: "To be scoped", title: title.length >= 3 ? title : "Project enquiry",
    goal: question.trim(), constraints: "", timeline: "", budgetRange: "",
    openQuestions: fitLines(reply.questions, 800), planningNotes: fitLines(reply.steps, 400),
  };
}

export function draftFromIdea(input: IdeaInput, proposal: IdeaProposal, source: "local" | "ai"): BriefFields {
  return {
    source, projectType: input.domain, title: proposal.title.slice(0, 120), goal: input.goal,
    constraints: [input.constraints, input.refinement].map(clean).filter(Boolean).join("\n"),
    timeline: input.timeline, budgetRange: input.budget,
    openQuestions: fitLines(proposal.questions, 800), planningNotes: proposal.summary.slice(0, 400),
  };
}

/** The homepage contact card drafts an enquiry; only the account form submits it. */
export function draftFromContact(input: { title: string; domain: string; timeline: string; message: string }): BriefFields {
  if (!plannerProjectTypes.includes(input.domain as typeof plannerProjectTypes[number])) {
    throw new Error("Choose an engineering domain before continuing.");
  }
  return {
    source: "direct", projectType: input.domain, title: input.title,
    goal: input.message, constraints: "", timeline: input.timeline,
    budgetRange: "", openQuestions: "", planningNotes: "",
  };
}

export function formatPlannerRequest(brief: PlannerBrief): RequestInput {
  if (brief.source === "direct") {
    return {
      title: brief.title, category: "Something else", timeline: brief.timeline,
      details: [
        `Engineering domain: ${brief.projectType}`,
        `Project scope: ${brief.goal}`,
        `Timeline: ${brief.timeline || "To be discussed"}`,
      ].join("\n\n"),
    };
  }
  const sections = [
    `Project type: ${brief.projectType}`,
    `Goal: ${brief.goal}`,
    `Constraints: ${brief.constraints || "To be discussed"}`,
    `Budget range: ${brief.budgetRange || "To be discussed"}`,
    `Timeline: ${brief.timeline || "To be discussed"}`,
    `Open questions: ${brief.openQuestions || "To be discussed"}`,
    `Planning notes (${brief.source === "local" ? "local worksheet, no AI or engineering validation" : "AI concept, engineering review required"}): ${brief.planningNotes || "None added"}`,
  ];
  return { title: brief.title, category: "Something else", timeline: brief.timeline, details: sections.join("\n\n") };
}

export function savePlannerBrief(brief: PlannerBrief, storage: BriefStorage = window.sessionStorage): boolean {
  try { storage.setItem(plannerBriefStorageKey, JSON.stringify(brief)); return true; }
  catch { return false; }
}

export function readPlannerBrief(storage: BriefStorage = window.sessionStorage, now = Date.now()): PlannerBrief | null {
  try {
    const raw = storage.getItem(plannerBriefStorageKey);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!validBrief(value) || value.createdAt > now || now - value.createdAt > briefLifetime || formatPlannerRequest(value).details.length > 6000) {
      storage.removeItem(plannerBriefStorageKey);
      return null;
    }
    return value;
  } catch { return null; }
}

export function clearPlannerBrief(storage: BriefStorage = window.sessionStorage): void {
  try { storage.removeItem(plannerBriefStorageKey); } catch { /* Storage may be unavailable. */ }
}
