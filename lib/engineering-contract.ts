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

/** Reading pointers only. They do not verify a user's design or a model-generated answer. */
export const engineeringReferences: readonly EngineeringSource[] = [
  { id: "esp-idf", title: "Espressif ESP-IDF documentation — select the exact chip", url: "https://docs.espressif.com/projects/esp-idf/en/stable/esp32/index.html", status: "reference-to-check" },
  { id: "stm32", title: "STMicroelectronics STM32 documentation and product selector", url: "https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html", status: "reference-to-check" },
  { id: "kicad", title: "KiCad official documentation", url: "https://docs.kicad.org/", status: "reference-to-check" },
  { id: "ti-antenna", title: "Texas Instruments DN035 Antenna Quick Guide", url: "https://www.ti.com/lit/an/swra351a/swra351a.pdf", status: "reference-to-check" },
  { id: "adi-lc", title: "Analog Devices: RLC resonance", url: "https://wiki.analog.com/university/courses/electronics/rlc_resonance", status: "reference-to-check" },
  { id: "itu-fspl", title: "ITU: basic free-space transmission loss", url: "https://www.itu.int/dms_pub/itu-r/opb/hdb/R-HDB-44-2002-OAS-PDF-E.pdf", status: "reference-to-check" },
  { id: "nasa-torque", title: "NASA Glenn: torque and moment arm", url: "https://www.grc.nasa.gov/WWW/K-12/airplane/torque.html", status: "reference-to-check" },
];
export const engineeringDisclaimer = "Engineering planning assistance, not a validated circuit, safety approval or quotation. Calculations use only supplied inputs and simplified models; confirm units, exact part ratings, applicable standards and measured results before building. Reference links are reading pointers, not proof of a particular design.";
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
  // Shape checks are not factual verification of model prose.
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

function positive(value: number, label: string): number {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${label} must be a finite positive number.`);
  return value;
}
function nonnegative(value: number, label: string): number {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${label} must be a finite nonnegative number.`);
  return value;
}
function finiteResult(value: number): number {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError("The supplied values are outside the calculator's numeric range.");
  return value;
}
function finiteNonnegativeResult(value: number): number {
  if (!Number.isFinite(value) || value < 0) throw new RangeError("The supplied values are outside the calculator's numeric range.");
  return value;
}

/** Ideal lumped LC resonance. Input units: henries and farads. */
export function calculateLcResonance(input: { inductanceH: number; capacitanceF: number }): number {
  const l = positive(input.inductanceH, "Inductance (H)");
  const c = positive(input.capacitanceF, "Capacitance (F)");
  return finiteResult(1 / (2 * Math.PI * Math.sqrt(l) * Math.sqrt(c)));
}

/** Ideal isotropic free-space loss. Input units: metres and hertz; output: dB. */
export function calculateFreeSpacePathLoss(input: { distanceM: number; frequencyHz: number }): number {
  const d = positive(input.distanceM, "Distance (m)");
  const f = positive(input.frequencyHz, "Frequency (Hz)");
  const c = 299_792_458; // m/s, exact SI speed of light
  const loss = 20 * (Math.log10(4 * Math.PI) + Math.log10(d) + Math.log10(f) - Math.log10(c));
  if (!Number.isFinite(loss)) throw new RangeError("The supplied values are outside the calculator's numeric range.");
  return loss;
}

/** Worst-case horizontal static holding torque at the motor, ignoring dynamics. */
export function calculateHoldingTorque(input: {
  armMassKg: number; armCgM: number; payloadMassKg: number; reachM: number;
  gearRatio: number; gearEfficiency: number; safetyFactor: number;
}): number {
  const arm = nonnegative(input.armMassKg, "Arm mass (kg)");
  const cg = nonnegative(input.armCgM, "Arm centre-of-gravity radius (m)");
  const payload = nonnegative(input.payloadMassKg, "Payload mass (kg)");
  const reach = nonnegative(input.reachM, "Payload reach (m)");
  const ratio = positive(input.gearRatio, "Gear reduction ratio");
  const efficiency = positive(input.gearEfficiency, "Gear efficiency");
  const safety = positive(input.safetyFactor, "Safety factor");
  if (efficiency > 1 || safety < 1) throw new RangeError("Efficiency must be at most 1 and safety factor at least 1.");
  return finiteNonnegativeResult(((arm * cg + payload * reach) * 9.80665 * safety) / (ratio * efficiency));
}

/** Constant-power battery-energy estimate; not a demonstrated flight endurance. */
export function calculateFlightTime(input: {
  capacityMah: number; nominalVoltageV: number; depthOfDischarge: number; hoverPowerW: number;
}): number {
  const capacity = positive(input.capacityMah, "Capacity (mAh)");
  const voltage = positive(input.nominalVoltageV, "Nominal voltage (V)");
  const usable = positive(input.depthOfDischarge, "Usable fraction");
  const power = positive(input.hoverPowerW, "Hover power (W)");
  if (usable > 1) throw new RangeError("Usable fraction must be at most 1.");
  return finiteResult(((capacity / 1000) * voltage * usable * 60) / power);
}

const numberPattern = "([+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:e[+-]?\\d+)?)";
function quantity(message: string, key: string, units: Record<string, number>): number | undefined {
  const unitPattern = Object.keys(units).sort((a, b) => b.length - a.length).join("|");
  const match = new RegExp(`(?:^|[^A-Za-z0-9_])${key}\\s*=\\s*${numberPattern}\\s*(${unitPattern})(?=$|[^A-Za-z])`, "i").exec(message);
  if (!match) return undefined;
  const factor = Object.entries(units).find(([unit]) => unit.toLowerCase() === match[2].toLowerCase())?.[1];
  return factor === undefined ? undefined : Number(match[1]) * factor;
}
function scalar(message: string, key: string): number | undefined {
  const match = new RegExp(`(?:^|[^A-Za-z0-9_])${key}\\s*=\\s*${numberPattern}(?=$|[\\s,;])`, "i").exec(message);
  return match ? Number(match[1]) : undefined;
}
const shown = (value: number) => Number(value.toPrecision(6)).toString();
type CalculationAttempt = { calculation?: EngineeringCalculation; question?: string; sourceId?: string };
function explicitCalculation(message: string): CalculationAttempt {
  const query = message.toLowerCase();
  try {
    if (/\blc\b|resonan(?:ce|t)\s+frequen/.test(query)) {
      const l = quantity(message, "L", { H: 1, mH: 1e-3, uH: 1e-6, "µH": 1e-6, "μH": 1e-6, nH: 1e-9 });
      const c = quantity(message, "C", { F: 1, mF: 1e-3, uF: 1e-6, "µF": 1e-6, "μF": 1e-6, nF: 1e-9, pF: 1e-12 });
      if (l === undefined || c === undefined) return { question: "For LC resonance, provide both L and C with units, for example: L=10 uH, C=100 nF." };
      const result = calculateLcResonance({ inductanceH: l, capacitanceF: c });
      return { calculation: { expression: "f₀ = 1 / (2π√(L·C))", working: `L=${shown(l)} H; C=${shown(c)} F.`, result: shown(result), units: "Hz", assumptions: ["Ideal lumped LC model; parasitics, coupling and component tolerance are not included."] }, sourceId: "adi-lc" };
    }
    if (/\bfspl\b|free.space.path.loss/.test(query)) {
      const d = quantity(message, "d", { m: 1, km: 1000 });
      const f = quantity(message, "f", { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9 });
      if (d === undefined || f === undefined) return { question: "For free-space path loss, provide distance and frequency, for example: d=100 m, f=2.4 GHz." };
      const result = calculateFreeSpacePathLoss({ distanceM: d, frequencyHz: f });
      return { calculation: { expression: "FSPL = 20 log₁₀(4πdf/c)", working: `d=${shown(d)} m; f=${shown(f)} Hz; c=299792458 m/s.`, result: shown(result), units: "dB", assumptions: ["Ideal unobstructed far-field path between isotropic antennas; gains, cables, reflections and fading are excluded."] }, sourceId: "itu-fspl" };
    }
    if (/holding torque|calculate torque/.test(query)) {
      const arm = quantity(message, "m_arm", { kg: 1, g: 1e-3 });
      const cg = quantity(message, "r_cg", { m: 1, cm: 1e-2 });
      const payload = quantity(message, "m_payload", { kg: 1, g: 1e-3 });
      const reach = quantity(message, "reach", { m: 1, cm: 1e-2 });
      const ratio = scalar(message, "ratio"), efficiency = scalar(message, "efficiency"), safety = scalar(message, "sf");
      if ([arm, cg, payload, reach, ratio, efficiency, safety].some(value => value === undefined)) return { question: "For static holding torque, provide m_arm=0.5 kg, r_cg=0.2 m, m_payload=0.3 kg, reach=0.4 m, ratio=10, efficiency=0.8, sf=1.5." };
      const result = calculateHoldingTorque({ armMassKg: arm!, armCgM: cg!, payloadMassKg: payload!, reachM: reach!, gearRatio: ratio!, gearEfficiency: efficiency!, safetyFactor: safety! });
      return { calculation: { expression: "τ_motor = (m_arm·r_cg + m_payload·reach)·g·SF / (ratio·η)", working: `m_arm=${shown(arm!)} kg; r_cg=${shown(cg!)} m; m_payload=${shown(payload!)} kg; reach=${shown(reach!)} m; ratio=${shown(ratio!)}; η=${shown(efficiency!)}; SF=${shown(safety!)}.`, result: shown(result), units: "N·m", assumptions: ["Worst-case horizontal static hold; acceleration, friction, backlash and counterweights are excluded."] }, sourceId: "nasa-torque" };
    }
    if (/flight time|flight endurance/.test(query)) {
      const capacity = quantity(message, "capacity", { mAh: 1, Ah: 1000 });
      const voltage = quantity(message, "voltage", { V: 1 });
      const usable = scalar(message, "dod"), power = quantity(message, "power", { W: 1 });
      if ([capacity, voltage, usable, power].some(value => value === undefined)) return { question: "For a constant-power flight-time estimate, provide capacity=1500 mAh, voltage=11.1 V, dod=0.8, power=100 W." };
      const result = calculateFlightTime({ capacityMah: capacity!, nominalVoltageV: voltage!, depthOfDischarge: usable!, hoverPowerW: power! });
      return { calculation: { expression: "t = (C_mAh/1000)·V_nom·usable_fraction·60 / P_hover", working: `C=${shown(capacity!)} mAh; V=${shown(voltage!)} V; usable fraction=${shown(usable!)}; P=${shown(power!)} W.`, result: shown(result), units: "minutes", assumptions: ["Constant measured hover power and nominal voltage; reserve, voltage sag, temperature, aging and manoeuvres are excluded."] } };
    }
  } catch (error) {
    return { question: error instanceof Error ? `Cannot calculate: ${error.message}` : "Cannot calculate from these inputs." };
  }
  return {};
}

const part = (item: string, purpose: string, selectionCriteria: string): EngineeringBomItem => ({ item, purpose, selectionCriteria, quantity: "To be scoped", status: "provisional" });

export function buildLocalEngineeringReply(message: string): EngineeringReply {
  const query = message.toLowerCase();
  const isPortfolio = /portfolio|4tech|project.*(?:completed|built)|founder|mohammed|vashir|sabeel/.test(query);
  const isDrone = /drone|quadcopter|uav|flight|propulsion/.test(query);
  const isRobot = /robot|motor|pid|kinematic|torque|actuator|stepper|\barm\b|gripper/.test(query);
  const isWpt = /wireless power|resonant|inductive|coil|inverter|\bwpt\b|\blc\b/.test(query);
  const isRf = /\brf\b|antenna|\bsdr\b|impedance|yagi|radar|\bfspl\b|free.space.path.loss/.test(query);
  const isPcb = /kicad|\bpcb\b|schematic|circuit|layout|gerber/.test(query);
  const attempt = explicitCalculation(message);

  let overview = "Local engineering worksheet. Define the objective, interfaces and verification method before selecting parts or claiming performance.";
  let assumptions = ["Hardware variants, operating limits, test conditions and project scope have not been supplied or verified."];
  let steps = ["State the intended function and measurable acceptance criteria.", "Map inputs, processing, power and outputs; identify hazards and interface limits.", "Select candidate parts from current datasheets, then prototype and measure against the criteria."];
  let bom: EngineeringBomItem[] = [];
  let questions = ["What are the required function and operating environment?", "What supply, dimensions, budget and verification evidence are available?"];
  let sourceIds: string[] = [];

  if (isPortfolio) {
    overview = "4TECH is an engineering practice led by Mohammed Vashir and Sabeel Ahamed. Its public project pages describe the work and distinguish documented evidence from results that have not been verified for publication.";
    assumptions = ["A project description is not a substitute for a build photograph, measurement record or independent validation."];
    steps = ["Open the relevant project page and read its problem, approach and evidence status.", "Use the Idea Studio to define a new scope and acceptance test.", "Submit an editable brief through the customer portal for review."];
    questions = ["Which project or engineering domain would you like to discuss?"];
  } else if (isDrone) {
    overview = "Quadrotor planning: estimate mass and propulsion needs, select a flight controller and sensors, then validate control and failsafe behaviour on a restrained test setup before flight.";
    steps = ["Measure or specify airframe mass, payload, battery and intended flight conditions.", "Select compatible controller, IMU, motors, propellers and ESCs from their actual ratings.", "Define sensor calibration, attitude estimation and control-loop timing from measured hardware behaviour.", "Test disarm, loss-of-link and low-voltage responses on a restrained rig before flight."];
    bom = [part("Flight controller", "Sensor sampling and control", "Choose exact MCU, timers, I/O and software stack after loop-rate measurement."), part("IMU", "Attitude measurement", "Check interface, noise, range and vibration mounting against the chosen board."), part("Motors, propellers and ESCs", "Propulsion", "Size from mass, thrust measurements and electrical limits."), part("Battery and power regulation", "Energy and stable logic rails", "Select from measured current, voltage range, wiring and protection needs.")];
    questions = ["What are the measured all-up mass, battery voltage and hover power?", "What flight mode and safety requirements apply?"];
    sourceIds = ["esp-idf", "stm32"];
  } else if (isRobot) {
    overview = "Manipulator planning: define the reach, payload and joint geometry before choosing actuators, feedback and forward/inverse Kinematics methods.";
    steps = ["Record link lengths, payload, centre-of-gravity positions and duty cycle.", "Calculate static torque from the supplied masses and moment arms; include dynamic loads separately.", "Choose motor, gearbox, driver and feedback after thermal and positioning requirements are known.", "Validate travel limits, emergency stop and positioning repeatability on the assembled mechanism."];
    bom = [part("Joint actuators and transmission", "Create controlled motion", "Size torque, speed, backlash and thermal duty from geometry and payload."), part("Joint feedback", "Observe actual position", "Select resolution and interface from the required repeatability."), part("Controller and drivers", "Coordinate trajectories and power", "Check I/O, current, voltage and stop behaviour for the selected actuators.")];
    questions = ["What are the link lengths, payload mass and joint centres of gravity?", "Is the requested result static holding torque, motion torque or measured repeatability?"];
    sourceIds = ["nasa-torque", "stm32"];
  } else if (isWpt) {
    overview = "Resonant wireless-power planning: estimate an ideal LC frequency only from supplied L and C, then measure real coil losses, coupling and temperature before selecting switching hardware.";
    steps = ["Specify input/output power, air gap, coil geometry and allowed temperature rise.", "Measure inductance and capacitance, then calculate the ideal LC frequency.", "Choose switching, rectification and protection devices from voltage/current stress measurements and datasheets.", "Measure transfer efficiency and foreign-object heating; do not infer them from resonance alone."];
    bom = [part("Transmit and receive coils", "Magnetic coupling", "Select geometry and winding after measuring inductance, resistance and coupling."), part("Resonant capacitors", "Tank tuning", "Choose capacitance, AC current and voltage ratings from the measured circuit."), part("Switching and protection stage", "Drive and shut down the system", "Choose topology and device ratings after a controlled low-power experiment.")];
    questions = ["What measured L and C values, with units, are available?", "What input/output power and air gap are required?"];
    sourceIds = ["adi-lc"];
  } else if (isRf) {
    overview = "RF measurement planning: define the frequency band, antenna and receiver before estimating ideal path loss or interpreting measured signal levels.";
    steps = ["Specify the frequency, distance, antennas and measurement environment.", "Select receiver, filtering and directional/reference antennas against the actual signal bandwidth and power range.", "Calibrate with a traceable reference where available and record uncertainty, multipath and cable loss.", "Compare measurements with the ideal free-space estimate only under its stated assumptions."];
    bom = [part("Receiver or detector", "Observe the target signal", "Select supported frequency, dynamic range and bandwidth from the exact datasheet."), part("Antenna and feed", "Receive and direct the signal", "Measure matching, polarization and cable loss at the chosen frequency."), part("Angular or position reference", "Relate readings to direction", "Choose encoder and mechanics based on required resolution and calibration method.")];
    questions = ["What frequency and distance, with units, should the ideal FSPL calculation use?", "Do you have measured antenna gain and cable loss?"];
    sourceIds = ["itu-fspl", "ti-antenna"];
  } else if (isPcb) {
    overview = "PCB planning: verify the schematic and interfaces, then route to the selected fabricator's rules and check the assembled board against its actual acceptance criteria.";
    steps = ["Confirm each part number, symbol pinout, power rail and interface voltage from its datasheet.", "Define stack-up, clearances, current paths and return paths with the fabricator.", "Run ERC and native DRC, then resolve every error and unconnected net before release.", "Review assembly, bring-up and test records separately from CAD checks."];
    bom = [part("Selected controller and peripherals", "Provide the required system functions", "Choose exact variants after interfaces, availability and power are defined."), part("Power and protection components", "Maintain electrical limits", "Size from fault, load and thermal analysis."), part("PCB and assembly materials", "Connect and build the circuit", "Specify stack-up and assembly criteria in the project requirements.")];
    questions = ["Which exact component variants and board fabricator are selected?", "Is there a native ERC/DRC report and bring-up record?"];
    sourceIds = ["kicad"];
  }

  if (attempt.question) questions = [attempt.question, ...questions].slice(0, 5);
  if (attempt.calculation) sourceIds = [...new Set([...sourceIds, ...(attempt.sourceId ? [attempt.sourceId] : [])])].slice(0, 4);
  return assembleEngineeringReply({ overview, assumptions, steps, calculations: attempt.calculation ? [attempt.calculation] : [], bom, sourceIds, questions }, "local");
}
