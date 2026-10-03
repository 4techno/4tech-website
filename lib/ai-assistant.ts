/** Local 4TECH planning templates. This module never makes a network request. */
import { buildLocalEngineeringReply } from './engineering-contract';

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  provider?: 'local-engine';
  briefData?: ProjectBriefData;
}

export interface ProjectBriefData {
  title: string;
  domain: string;
  architecture: string[];
  hardwareBOM: Array<{ item: string; purpose: string; estimatedCostINR: string }>;
  firmwareStack: string[];
  developmentPhases: Array<{ phase: string; duration: string; deliverable: string }>;
  feasibilityNotes: string;
  estimatedBudgetINR: string;
  suggestedTimeline: string;
}

function projectType(prompt: string): { title: string; domain: string; software: string[] } {
  const query = prompt.toLowerCase();
  if (/drone|quadcopter|uav|flight/.test(query)) return {
    title: 'Quadrotor flight-control concept', domain: 'Robotics & Autonomous Systems',
    software: ['Attitude estimation method to be chosen from sensor data', 'Control and failsafe software to be verified on a restrained rig'],
  };
  if (/robot|kinematic|gripper|stepper|\barm\b/.test(query)) return {
    title: 'Articulated robotic manipulator concept', domain: 'Robotics & Mechanisms',
    software: ['Forward and inverse Kinematics model based on actual link geometry', 'Motion limits and position-feedback checks'],
  };
  if (/wireless power|resonant|inductive|power transfer|\blc\b/.test(query)) return {
    title: 'Resonant wireless power concept', domain: 'RF & Power Electronics',
    software: ['Switching and protection logic after topology selection', 'Measurement of power, temperature and coupling'],
  };
  if (/\brf\b|antenna|\bsdr\b|\bfspl\b/.test(query)) return {
    title: 'RF measurement concept', domain: 'RF & Instrumentation',
    software: ['Data acquisition matched to the selected receiver', 'Calibration and uncertainty recording'],
  };
  if (/sensor|\biot\b|\blora\b|telemetry/.test(query)) return {
    title: 'Connected sensor system concept', domain: 'Connected Systems & IoT',
    software: ['Sampling and communication rates based on power and data requirements', 'Fault logging and disconnection handling'],
  };
  const title = prompt.trim().replace(/\s+/g, ' ').slice(0, 80) || 'Engineering project concept';
  return { title, domain: 'Embedded Systems & Prototyping', software: ['Firmware architecture to be selected after requirements', 'Bench tests against agreed acceptance criteria'] };
}

/** The output is an editable starting point, with no guessed price or delivery promise. */
export async function generateEngineeringAdvice(
  prompt: string,
  _history: AiMessage[] = [],
): Promise<{ content: string; provider: 'local-engine'; briefData?: ProjectBriefData }> {
  const reply = buildLocalEngineeringReply(prompt);
  const type = projectType(prompt);
  const calculationText = reply.calculations.length
    ? '\n\n### Calculation from your inputs\n' + reply.calculations.map(calc => `${calc.expression}\n${calc.working}\nResult: ${calc.result} ${calc.units}\nAssumptions: ${calc.assumptions.join('; ')}`).join('\n\n')
    : '';
  const content = [
    'Planning template — not a validated design, measured result, quotation or safety approval. Exact component choices, prices and timing require review.',
    `### 4TECH Engineering Planning: ${type.title}`,
    reply.overview,
    '### Engineering steps',
    reply.steps.map((step, index) => `${index + 1}. ${step}`).join('\n'),
    '### Assumptions to verify',
    reply.assumptions.map(item => `- ${item}`).join('\n'),
    reply.bom.length ? '### Provisional parts\n' + reply.bom.map(item => `- ${item.item}: ${item.purpose} Selection: ${item.selectionCriteria}`).join('\n') : '',
    calculationText,
    '### Questions before a quote',
    reply.questions.map(item => `- ${item}`).join('\n'),
  ].filter(Boolean).join('\n\n');

  const briefData: ProjectBriefData = {
    title: type.title,
    domain: type.domain,
    architecture: reply.steps,
    hardwareBOM: reply.bom.map(item => ({ item: item.item, purpose: item.purpose, estimatedCostINR: 'Unpriced; supplier quote required' })),
    firmwareStack: type.software,
    developmentPhases: [
      { phase: 'Requirements and feasibility', duration: 'To be agreed', deliverable: 'Objective, constraints and measurable acceptance criteria' },
      { phase: 'Architecture and part selection', duration: 'To be agreed', deliverable: 'Reviewed schematic or system plan with provisional parts' },
      { phase: 'Prototype and verification', duration: 'To be agreed', deliverable: 'Test observations and known limitations against the agreed scope' },
    ],
    feasibilityNotes: `${reply.assumptions.join(' ')} ${reply.questions.join(' ')} ${reply.disclaimer}`,
    estimatedBudgetINR: 'INR (₹) amount pending scoped quotation',
    suggestedTimeline: 'To be agreed after feasibility review',
  };
  return { content, provider: 'local-engine', briefData };
}

/** Format an editable project brief for download or clipboard. */
export function formatProjectBriefText(brief: ProjectBriefData, notes?: string): string {
  const separator = '='.repeat(68);
  const subSeparator = '-'.repeat(68);
  const bomLines = brief.hardwareBOM
    .map((item, idx) => `  ${String(idx + 1).padStart(2, '0')}. ${item.item.padEnd(30)} | ${item.purpose.padEnd(25)} | ${item.estimatedCostINR}`)
    .join('\n');
  const phaseLines = brief.developmentPhases
    .map((phase, idx) => `  [Phase ${idx + 1}] ${phase.phase} (${phase.duration})\n    Deliverable: ${phase.deliverable}`)
    .join('\n\n');

  return `${separator}
4TECH ENGINEERING PROJECT BRIEF
Technology That Shapes Tomorrow.
${separator}
Project Title:        ${brief.title}
Engineering Domain:   ${brief.domain}
Budget Status:        ${brief.estimatedBudgetINR}
Timeline Status:      ${brief.suggestedTimeline}
Date Formulated:      ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
${subSeparator}

1. PROVISIONAL SYSTEM ARCHITECTURE
${brief.architecture.map((item, index) => `  - [0${index + 1}] ${item}`).join('\n')}

2. PROVISIONAL PARTS — PRICES REQUIRE A SUPPLIER QUOTE
${bomLines || '  No parts selected yet.'}

3. FIRMWARE & SOFTWARE QUESTIONS
${brief.firmwareStack.map(item => `  - ${item}`).join('\n')}

4. POSSIBLE DEVELOPMENT STAGES — DURATIONS TO BE AGREED
${phaseLines}

5. FEASIBILITY, ASSUMPTIONS & LIMITATIONS
  ${brief.feasibilityNotes}

${notes ? `6. ADDITIONAL USER NOTES\n  ${notes}\n` : ''}
${separator}
Mohammed Vashir (Founder) and Sabeel Ahamed (Co-founder)
4TECH — Tamil Nadu, India
Web: https://4tech-9cy.pages.dev/
This worksheet is not a validated design or quotation.
${separator}`;
}
