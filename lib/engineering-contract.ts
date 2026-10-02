/** Serializable engineering-assistant contract shared by the Worker and browser. */
export type EngineeringMessage = { role: "user" | "assistant"; content: string };
export type EngineeringCalculation = { expression: string; working: string; result: string; units: string; assumptions: string[] };
export type EngineeringBomItem = { item: string; purpose: string; selectionCriteria: string; quantity: string; status: "provisional" };
export type EngineeringSource = { id: string; title: string; url: string; status: "reference-to-check" };
export type EngineeringReply = {
  source: "local" | "ai"; overview: string; assumptions: string[]; steps: string[];
  calculations: EngineeringCalculation[]; bom: EngineeringBomItem[]; sources: EngineeringSource[];
  questions: string[]; disclaimer: string; links: { label: string; href: string }[];
};
export type EngineeringInput = { message: string; history: EngineeringMessage[] };

/** Reviewed entry points, not live retrieval or proof of a particular component specification. */
export const engineeringReferences: readonly EngineeringSource[] = [
  { id: "esp-idf", title: "Espressif ESP-IDF documentation — select the exact chip", url: "https://docs.espressif.com/projects/esp-idf/en/stable/esp32/index.html", status: "reference-to-check" },
  { id: "stm32", title: "STMicroelectronics STM32 documentation and product selector", url: "https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html", status: "reference-to-check" },
  { id: "kicad", title: "KiCad official documentation", url: "https://docs.kicad.org/", status: "reference-to-check" },
  { id: "ti-antenna", title: "Texas Instruments DN035 Antenna Quick Guide", url: "https://www.ti.com/lit/an/swra351a/swra351a.pdf", status: "reference-to-check" },
];
export const engineeringDisclaimer = "Engineering planning assistance, not a validated circuit, safety approval or quotation. Confirm exact part numbers, manufacturer ratings and test results before building. Reference links are reading pointers; their contents have not been retrieved for this answer.";
export const engineeringLinks = [
  { label: "Explore 4TECH projects", href: "/projects" },
  { label: "Open Project Idea Studio", href: "/ideas" },
  { label: "Submit a project enquiry", href: "/account" },
];

const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const keys = (value: Record<string, unknown>, allowed: string[]) => Object.keys(value).length === allowed.length && Object.keys(value).every(key => allowed.includes(key));
const text = (value: unknown, max = 1000) => typeof value === "string" && value.trim().length > 0 && value.length <= max && !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value);
const list = (value: unknown, max: number, min = 0): value is string[] => Array.isArray(value) && value.length >= min && value.length <= max && value.every(item => text(item));

export function validateEngineeringInput(value: unknown): EngineeringInput {
  if (!object(value) || !keys(value, ["message", "history"]) || !text(value.message, 3000) || !Array.isArray(value.history) || value.history.length > 8) throw new Error("Invalid engineering request");
  if (value.history.some(item => !object(item) || !keys(item, ["role", "content"]) || !["user", "assistant"].includes(item.role as string) || !text(item.content, 3000))) throw new Error("Invalid conversation history");
  if (value.history.reduce((sum, item) => sum + item.content.length, 0) > 12000) throw new Error("Conversation is too long");
  return { message: (value.message as string).trim(), history: value.history.map(item => ({ role: item.role, content: item.content.trim() })) };
}

export type EngineeringModelReply = Omit<EngineeringReply, "source" | "sources" | "disclaimer" | "links"> & { sourceIds: string[] };
export function validEngineeringModelReply(value: unknown): value is EngineeringModelReply {
  if (!object(value) || !keys(value, ["overview", "assumptions", "steps", "calculations", "bom", "sourceIds", "questions"])) return false;
  if (!text(value.overview, 1800) || !list(value.assumptions, 6, 1) || !list(value.steps, 8, 1) || !list(value.questions, 5) || !list(value.sourceIds, 4)) return false;
  if (new Set(value.sourceIds).size !== value.sourceIds.length || value.sourceIds.some(id => !engineeringReferences.some(source => source.id === id))) return false;
  if (!Array.isArray(value.calculations) || value.calculations.length > 4 || value.calculations.some(item => !object(item) || !keys(item, ["expression", "working", "result", "units", "assumptions"]) || !text(item.expression, 300) || !text(item.working, 1500) || !text(item.result, 300) || !text(item.units, 80) || !list(item.assumptions, 5, 1))) return false;
  if (!Array.isArray(value.bom) || value.bom.length > 8 || value.bom.some(item => !object(item) || !keys(item, ["item", "purpose", "selectionCriteria", "quantity", "status"]) || !text(item.item, 200) || !text(item.purpose, 600) || !text(item.selectionCriteria, 1000) || !text(item.quantity, 80) || item.status !== "provisional")) return false;
  // Model prose cannot invent links, embedded code execution, or unreviewed destinations.
  return JSON.stringify(value).length <= 24000 && !/https?:\/\/|www\.|<\/?(?:script|iframe|img|svg)\b/i.test(JSON.stringify(value));
}
export function assembleEngineeringReply(value: EngineeringModelReply, source: "local" | "ai"): EngineeringReply {
  const { sourceIds, ...body } = value;
  return { ...body, source, sources: sourceIds.map(id => ({ ...engineeringReferences.find(item => item.id === id)! })), disclaimer: engineeringDisclaimer, links: engineeringLinks.map(item => ({ ...item })) };
}
export function validEngineeringReply(value: unknown): value is EngineeringReply {
  if (!object(value) || !keys(value, ["source", "overview", "assumptions", "steps", "calculations", "bom", "sources", "questions", "disclaimer", "links"]) || !["local", "ai"].includes(value.source as string) || value.disclaimer !== engineeringDisclaimer || !Array.isArray(value.sources) || !Array.isArray(value.links)) return false;
  if (value.sources.some(item => !object(item) || !keys(item, ["id", "title", "url", "status"]) || !engineeringReferences.some(reference => JSON.stringify(reference) === JSON.stringify(item)))) return false;
  if (JSON.stringify(value.links) !== JSON.stringify(engineeringLinks)) return false;
  const { source, sources, disclaimer, links, ...body } = value;
  void source; void disclaimer; void links;
  return validEngineeringModelReply({ ...body, sourceIds: (sources as EngineeringSource[]).map(item => item.id) });
}

export function buildLocalEngineeringReply(message: string): EngineeringReply {
  const query = message.toLowerCase();
  const isRf = /\brf\b|antenna|433|2\.4|sdr|impedance/.test(query);
  const isRobot = /robot|motor|pid|kinematic|torque|actuator/.test(query);
  const isPcb = /kicad|pcb|schematic|circuit/.test(query);
  const isPortfolio = /portfolio|4tech|project.*(?:completed|built)|founder/.test(query);
  const steps = isRf ? ["Define the measurement band, signal type, permitted operation, receiver input limit and reference equipment.", "Map antenna → compatible RF front end → receiver → logged observations; keep uncertain gain and loss values explicit.", "Record reference measurements and repeatability before making detection, range or direction-accuracy claims."]
    : isRobot ? ["Write the joint geometry, coordinate frames, travel limits, payload and intended motion before choosing the actuator.", "Create a sensing → controller → driver → actuator block diagram, including feedback and a physical stop path.", "Start with an unloaded constrained mechanism; record errors and tune control only with documented limits and measured response."]
    : isPcb ? ["List exact IC, module and connector part numbers with datasheet revisions before assigning pins.", "Draw power, return paths and each signal interface; verify input limits and logic compatibility on both sides.", "Review footprint-to-pin mapping and run electrical and board design checks; resolve errors and inspect the fabrication outputs before release."]
    : ["Define the measurable outcome, existing hardware, available power and interface requirements.", "Map sensor/input → controller → communication/output, and document what happens when a reading or connection is missing.", "Verify exact board and sensor documentation, then test one interface at a time with captured observations."];
  const references = isRf ? ["ti-antenna"] : isPcb ? ["kicad"] : /stm32|cortex/.test(query) ? ["stm32"] : /esp32|i2c|spi|uart|can/.test(query) ? ["esp-idf"] : [];
  return assembleEngineeringReply({
    overview: isPortfolio ? "4TECH is led by Mohammed Vashir and focuses on engineering prototypes, robotics, embedded systems and RF instrumentation. The project pages contain the maintained case studies and their stated validation limits. This on-device planner can help structure an enquiry; it does not independently verify project performance." : "Local planning worksheet — no model or live source search was used. I can help frame the engineering problem, but exact wiring, ratings and component selection need the specific hardware documentation.",
    assumptions: ["The exact component variants, operating limits and measured test data have not been established in this worksheet."],
    steps: isPortfolio ? ["Explore a project case study and its validation section.", "Use Project Idea Studio to capture the goal, constraints, budget preference and acceptance criteria.", "Submit the resulting brief through your customer account for a scope review."] : steps,
    calculations: [],
    bom: /\bbom\b|bill of materials|parts list/.test(query) ? [
      { item: isRobot ? "Actuator and compatible driver" : isRf ? "Band-compatible antenna and receiver" : "Controller and interface hardware", purpose: "Implement the primary engineering function", selectionCriteria: "Confirm exact ratings, interface compatibility, availability and measured requirements before choosing a part", quantity: "To be scoped", status: "provisional" },
      { item: "Power and measurement provisions", purpose: "Power the prototype and observe its behaviour", selectionCriteria: "Determine supply range, peak load, protection and required reference instruments from the selected hardware", quantity: "To be scoped", status: "provisional" },
    ] : [],
    sourceIds: references,
    questions: ["What are the exact board/module part numbers and datasheet links?", "What result, operating conditions and acceptance test must the project meet?", "Which budget, equipment and schedule constraints should the brief include?"],
  }, "local");
}
