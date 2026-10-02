/**
 * 4TECH AI Assistant & Engineering Copilot Service
 * On-device engineering planning templates; no credentials or network transmission.
 */

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

/** Local planning templates. Network AI is handled by the authenticated Idea Studio. */
function generateLocalEngineeringResponse(prompt: string): { content: string; briefData: ProjectBriefData } {
  const p = prompt.toLowerCase();

  // Pattern matching for domain-specific engineering blueprints
  if (p.includes('drone') || p.includes('quadcopter') || p.includes('uav') || p.includes('flight')) {
    return {
      content: `### 4TECH Engineering Architecture: Autonomous Quadrotor UAV

**System Overview:**
An autonomous multi-rotor platform with dual-loop PID stabilization, attitude estimation via complementary/Kalman filtering, and telemetry streaming over 2.4GHz / RF.

**1. Hardware Architecture & Pinout:**
- **Flight Computer / MCU:** ESP32-S3 (Dual-core Xtensa 240MHz, native WiFi/BLE). Core 0 runs real-time sensor sampling & PID loop (500Hz); Core 1 handles RF telemetry and failsafe state machine.
- **Inertial Measurement Unit (IMU):** MPU6050 / ICM-42688P over 400kHz I2C with interrupt pin linked to hardware timer.
- **Electronic Speed Controllers (ESCs):** 4x 30A BLHeli_S running DShot300 or 50–400Hz OneShot PWM.
- **Propulsion:** 2205 2300KV brushless motors with 5045 3-blade propellers.
- **Power Delivery:** 3S/4S LiPo (1500mAh 75C) stepped down to 5V 3A via synchronous buck regulator for avionics.

**2. Firmware Pipeline:**
- **Sensor Fusion:** Raw gyro (rad/s) + accelerometer (g) fused via Madgwick or 6-state Extended Kalman Filter.
- **Control Loops:** Cascaded PID (Outer loop: Target Angle vs Measured Angle -> Inner loop: Angular Rate Error -> Motor PWM).
- **Safety Interlocks:** Armed switch, disarm on roll/pitch > 65°, low-battery voltage ADC trigger (<10.5V), failsafe watchdog.

**3. Prototyping Budget & Timeline:**
- **Estimated Prototyping Cost:** ₹18,500 – ₹24,000
- **Feasible Prototyping Timeline:** 4 to 6 weeks.
- **Discuss with 4TECH:** Turn this planning template into an enquiry for a feasibility and scope review.`,
      briefData: {
        title: 'Autonomous Quadrotor Flight Avionics Platform',
        domain: 'Robotics & Autonomous Systems',
        architecture: [
          'Power: 4S LiPo -> Buck 5V 3A -> ESP32-S3 + IMU',
          'Sensing: ICM-42688P IMU over 400kHz I2C with hardware interrupt',
          'Processing: Dual-core RTOS (Core 0: 500Hz PID / Core 1: Telemetry)',
          'Actuation: 4x DShot300 PWM lines to 30A BLHeli ESCs + 2300KV motors'
        ],
        hardwareBOM: [
          { item: 'ESP32-S3-WROOM-1', purpose: 'Flight controller MCU', estimatedCostINR: '₹650' },
          { item: 'ICM-42688P / MPU6050', purpose: '6-DOF IMU sensor', estimatedCostINR: '₹450' },
          { item: '4x 2205 2300KV BLDC Motors', purpose: 'Propulsion system', estimatedCostINR: '₹4,800' },
          { item: '4x 30A BLHeli_S ESCs', purpose: 'Motor speed control', estimatedCostINR: '₹3,600' },
          { item: 'Carbon Fiber Quad Frame 210mm', purpose: 'Structural airframe', estimatedCostINR: '₹2,200' },
          { item: '3S/4S 1500mAh 75C LiPo', purpose: 'Flight power source', estimatedCostINR: '₹2,500' }
        ],
        firmwareStack: ['ESP-IDF / FreeRTOS', 'Madgwick AHRS Filter', 'Cascaded PID Rate/Angle Controllers', 'DShot/PWM Driver'],
        developmentPhases: [
          { phase: 'Phase 1: Sensor & IMU Calibration', duration: '1 week', deliverable: 'Zero-bias calibrated quaternion streaming' },
          { phase: 'Phase 2: Motor Dyno & Single-Axis Testbed', duration: '1.5 weeks', deliverable: 'PID pitch/roll rate stabilization' },
          { phase: 'Phase 3: Tethered Flight Testing', duration: '1.5 weeks', deliverable: 'Controlled hover and attitude hold' },
          { phase: 'Phase 4: Telemetry & Autonomous Failsafe', duration: '1 week', deliverable: 'Flight data telemetry logging & return failsafe' }
        ],
        feasibilityNotes: 'High dynamic vibration requires silicone soft-mounting for the IMU to prevent gyro saturation. Battery monitoring requires a precision voltage divider with 1% metal film resistors.',
        estimatedBudgetINR: '₹18,500 – ₹24,000',
        suggestedTimeline: '4–6 weeks'
      }
    };
  }

  if (p.includes('arm') || p.includes('robot') || p.includes('kinematic') || p.includes('gripper') || p.includes('stepper')) {
    return {
      content: `### 4TECH Engineering Architecture: 5/6-DOF Articulated Robotic Arm

**System Overview:**
An articulated robotic manipulator utilizing inverse kinematics (Denavit-Hartenberg parameters), microstepping stepper motor drivers with closed-loop optical/magnetic encoders, and custom end-effector tooling.

**1. Mechanical & Actuation Architecture:**
- **Base (J1) & Shoulder (J2):** NEMA 23 stepper motors with 1:10 planetary planetary or timing belt reduction for high holding torque.
- **Elbow (J3) & Wrist Pitch/Roll (J4/J5):** NEMA 17 steppers (1.8°/step) with TMC2209 silent drivers running in StealthChop mode.
- **End-Effector (J6):** Coreless servo or miniature linear stepper driving parallel linkage gripper claws.
- **Position Feedback:** AS5600 12-bit magnetic rotary encoders on joint axes to prevent skipped-step position drift.

**2. Electronic & Control Topology:**
- **Main Controller:** STM32F401RET6 or ESP32-S3 over SPI/I2C.
- **Motor Bus:** Dedicated STEP/DIR pulses generated via hardware timers (DMA or timer capture) to ensure jitter-free trajectory generation.
- **Power Management:** 24V 10A DC industrial switching power supply, stepped down to 5V 5A for logic and servo rails.

**3. Kinematics Pipeline:**
- **Forward Kinematics:** 4x4 Homogeneous transformation matrices based on joint link lengths.
- **Inverse Kinematics:** Analytical geometric solver for 3-axis arm + decoupled spherical wrist, yielding target joint angles in under 2ms.

**4. Prototyping Budget & Timeline:**
- **Estimated Prototyping Cost:** ₹28,000 – ₹42,000
- **Feasible Prototyping Timeline:** 6 to 8 weeks.
- **Discuss with 4TECH:** Include your payload, reach and fabrication constraints in an enquiry for a feasibility review.`,
      briefData: {
        title: '5/6-DOF Articulated Robotic Manipulator',
        domain: 'Robotics & Mechanisms',
        architecture: [
          'Power: 24V 10A PSU -> Bus -> TMC2209 Stepper Drivers -> Steppers',
          'Feedback: AS5600 12-bit magnetic angle sensors on joint shafts over I2C mux',
          'Compute: STM32F401 (DMA Pulse Generation + Inverse Kinematics solver)',
          'End-Effector: 2-finger parallel pincer gripper with compliant rubber pads'
        ],
        hardwareBOM: [
          { item: 'NEMA 23 High-Torque Stepper', purpose: 'Joint 1 & 2 base/shoulder', estimatedCostINR: '₹3,200' },
          { item: '3x NEMA 17 Steppers', purpose: 'Joints 3, 4, 5 (elbow & wrist)', estimatedCostINR: '₹2,700' },
          { item: '5x TMC2209 Silent Stepper Drivers', purpose: 'Quiet microstepping drive', estimatedCostINR: '₹1,900' },
          { item: 'STM32F401 Development Board', purpose: 'Trajectory & kinematics MCU', estimatedCostINR: '₹850' },
          { item: '24V 10A Industrial PSU', purpose: 'System power supply', estimatedCostINR: '₹2,400' },
          { item: 'Laser-cut Acrylic / 3D Printed Linkages', purpose: 'Mechanical arm structure', estimatedCostINR: '₹5,500' }
        ],
        firmwareStack: ['C/C++ Bare-Metal / FreeRTOS', 'Analytical Inverse Kinematics', 'Trapezoidal Velocity Profiles', 'I2C Sensor Multiplexer'],
        developmentPhases: [
          { phase: 'Phase 1: CAD Linkage & Stress Analysis', duration: '2 weeks', deliverable: 'Complete 3D assembly & joint gear ratio verification' },
          { phase: 'Phase 2: Driver Board & Base Axis Control', duration: '2 weeks', deliverable: 'Smooth microstepping with AS5600 feedback' },
          { phase: 'Phase 3: Multi-Axis Coordinated Kinematics', duration: '2 weeks', deliverable: 'Linear path planning & Cartesian coordinate reach' },
          { phase: 'Phase 4: Gripper Integration & Repeatability Testing', duration: '1.5 weeks', deliverable: 'Sub-millimeter pick-and-place operation' }
        ],
        feasibilityNotes: 'Shoulder joint torque requires counterbalancing springs or 1:10 planetary gearbox to prevent motor stall when arm is fully extended horizontally.',
        estimatedBudgetINR: '₹28,000 – ₹42,000',
        suggestedTimeline: '6–8 weeks'
      }
    };
  }

  if (p.includes('wireless power') || p.includes('resonant') || p.includes('power transfer') || p.includes('inductive')) {
    return {
      content: `### 4TECH Engineering Architecture: Resonant Inductive Wireless Power System

**System Overview:**
A magnetically coupled high-efficiency resonant wireless power transmission system operating in the 100kHz–200kHz range, featuring automatic resonant frequency tracking and synchronized rectification.

**1. Power Electronics Topology:**
- **Transmitter Stage:** Half-Bridge / Full-Bridge Class D/E inverter using low RDS(on) MOSFETs (e.g. IRFZ44N or GaN FETs) driven by an IR2104 / TC4427 gate driver.
- **LC Resonant Tank:** Custom wound Litz-wire planar spiral coil paired with high-voltage polypropylene film capacitors (WIMA MKP) to minimize dielectric losses.
- **Receiver Stage:** Synchronous MOSFET rectifier or high-speed Schottky bridge (SS34) followed by an LC smoothing filter and buck-boost regulation for a stable 5V/12V output.

**2. Sensing & Safety Protections:**
- **Foreign Object Detection (FOD):** Coil Q-factor decay sensing and input current anomaly monitoring.
- **Thermal Supervision:** NTC thermistors affixed to coil cores with hardware shutdown at >70°C.
- **Efficiency Telemetry:** Real-time Tx input power vs Rx output power calculation streamed over BLE.

**3. Prototyping Budget & Timeline:**
- **Estimated Prototyping Cost:** ₹12,000 – ₹18,000
- **Feasible Prototyping Timeline:** 3 to 5 weeks.
- **Fabrication with 4TECH:** 4TECH has engineered wireless power prototypes with tuned planar coils and discrete H-bridge drivers.`,
      briefData: {
        title: 'High-Efficiency Resonant Wireless Power Platform',
        domain: 'RF & Power Electronics',
        architecture: [
          'Input: 12V–24V DC Source -> High-Speed Gate Driver (IR2104)',
          'Inverter: Full-Bridge MOSFET switching at tuned resonant frequency (150kHz)',
          'Resonant Tank: Planar Litz coil + Low-ESR Polypropylene Capacitor',
          'Output: Receiver Coil -> Fast Schottky Rectification -> DC-DC Step-Down (5V/12V)'
        ],
        hardwareBOM: [
          { item: 'IRFZ44N / GaN MOSFETs (x4)', purpose: 'H-bridge switching switches', estimatedCostINR: '₹400' },
          { item: 'IR2104 Gate Driver ICs', purpose: 'High/low side gate drive', estimatedCostINR: '₹350' },
          { item: 'Litz Wire Planar Spiral Coils (Tx & Rx)', purpose: 'Magnetic inductive transfer', estimatedCostINR: '₹1,800' },
          { item: 'WIMA MKP Resonant Capacitors', purpose: 'High-Q resonant tank matching', estimatedCostINR: '₹600' },
          { item: 'INA219 Current/Voltage Monitor', purpose: 'Transfer efficiency telemetry', estimatedCostINR: '₹300' },
          { item: 'Custom Double-Sided FR4 PCB', purpose: 'Low-inductance trace fabrication', estimatedCostINR: '₹1,500' }
        ],
        firmwareStack: ['PWM Phase-Shift Generator', 'Frequency Tracking Sweep Algorithm', 'FOD Detection', 'ADC Power Calculation'],
        developmentPhases: [
          { phase: 'Phase 1: Coil Inductance & Resonance Simulation', duration: '1 week', deliverable: 'L-C frequency tuning in MATLAB/SPICE' },
          { phase: 'Phase 2: Gate Driver & Switching Bench Test', duration: '1 week', deliverable: 'Clean square-wave switching without ringing' },
          { phase: 'Phase 3: Resonant Coupling & Air-Gap Testing', duration: '1.5 weeks', deliverable: 'Coupled power transfer over 20mm–50mm gap' },
          { phase: 'Phase 4: Thermal & Efficiency Optimization', duration: '1 week', deliverable: '>75% end-to-end efficiency validation' }
        ],
        feasibilityNotes: 'High AC currents require multi-strand Litz wire to mitigate the skin effect. Flyback voltage spikes across MOSFET drains must be clamped with fast RC snubber circuits.',
        estimatedBudgetINR: '₹12,000 – ₹18,000',
        suggestedTimeline: '3–5 weeks'
      }
    };
  }

  if (p.includes('lora') || p.includes('iot') || p.includes('sensor') || p.includes('agriculture') || p.includes('mesh')) {
    return {
      content: `### 4TECH Engineering Architecture: Long-Range LoRaWAN Sensor Network

**System Overview:**
An ultra-low-power industrial sensor node topology communicating over 865–867MHz (India frequency band) to an edge gateway, designed for battery-operated field deployment with deep-sleep power states (<15µA).

**1. Edge Node Hardware:**
- **Microcontroller:** ESP32-S3 or STM32L0 (ultra-low power ARM Cortex-M0+).
- **RF Transceiver:** Semtech SX1262 / SX1278 (868MHz band, +22dBm transmit power, -148dBm sensitivity).
- **Antenna:** Quarter-wave tuned helical or external 3dBi omnidirectional dipole with 50Ω microstrip trace impedance match.
- **Sensors:** SHT40 (precision temperature & humidity), soil moisture TDR probe, and battery voltage divider.
- **Power:** Single 18650 LiFePO4 cell (3.2V, 1500mAh) or solar energy harvester with TP4056 / CN3065 charger.

**2. Power Management & Sleep Cycle:**
- **Deep Sleep:** 99.8% of time spent in ultra-low power standby (12µA quiescent current).
- **Wake Cycle:** Every 15 minutes, wake via RTC timer, sample sensors (20ms), transmit encrypted LoRa packet (60ms @ SF7), listen for downlink ACK (100ms), and return to deep sleep.
- **Calculated Battery Lifetime:** Over 18 months on a single 18650 cell.

**3. Prototyping Budget & Timeline:**
- **Estimated Prototyping Cost:** ₹9,500 – ₹15,000 (includes 3 field nodes + 1 gateway).
- **Feasible Prototyping Timeline:** 3 to 4 weeks.
- **Fabrication with 4TECH:** 4TECH has implemented custom RF antenna matching networks and low-power IoT telemetry hardware.`,
      briefData: {
        title: 'Ultra-Low-Power LoRa Sensor Network',
        domain: 'Connected Systems & IoT',
        architecture: [
          'Power: 18650 LiFePO4 + 6V Solar Cell -> Low-Quiescent LDO (TPS782)',
          'Sensing: I2C environmental sensors sampled in burst mode (<30ms)',
          'RF: SX1262 LoRa module transmitting AES-128 encrypted telemetry at 868MHz',
          'Gateway: Multi-channel concentrator forwarding to local SQLite & cloud dashboard'
        ],
        hardwareBOM: [
          { item: '3x ESP32-S3 Mini / STM32L0 boards', purpose: 'Node microcontrollers', estimatedCostINR: '₹1,500' },
          { item: '3x SX1262 LoRa Transceivers', purpose: '868MHz long-range RF', estimatedCostINR: '₹1,800' },
          { item: '3x Tuned 868MHz 3dBi Antennas', purpose: 'RF antenna matching', estimatedCostINR: '₹900' },
          { item: '3x SHT40 Industrial Sensors', purpose: 'Temperature & humidity telemetry', estimatedCostINR: '₹1,200' },
          { item: 'Solar Harvester + 18650 Batteries', purpose: 'Off-grid battery power', estimatedCostINR: '₹2,100' },
          { item: 'IP67 Weatherproof Enclosures', purpose: 'Outdoor environmental protection', estimatedCostINR: '₹1,500' }
        ],
        firmwareStack: ['RadioLib / LoRaWAN Class A', 'FreeRTOS Deep Sleep State Machine', 'AES-128 Encryption', 'Battery ADC Fuel Gauge'],
        developmentPhases: [
          { phase: 'Phase 1: RF Range & Packet Error Test', duration: '1 week', deliverable: 'Verified 3km+ line-of-sight packet transmission' },
          { phase: 'Phase 2: Sleep Current Optimization', duration: '1 week', deliverable: 'Measured <20µA deep sleep bench current' },
          { phase: 'Phase 3: Gateway & Telemetry Dashboard', duration: '1 week', deliverable: 'Local web interface displaying live node telemetry' },
          { phase: 'Phase 4: Field Enclosure & Reliability Test', duration: '1 week', deliverable: 'Deployed solar test node with 7-day continuous uptime' }
        ],
        feasibilityNotes: 'India radio regulations specify 865–867MHz for unlicensed ISM operation. Antenna PCB traces must be designed as 50Ω grounded coplanar waveguides.',
        estimatedBudgetINR: '₹9,500 – ₹15,000',
        suggestedTimeline: '3–4 weeks'
      }
    };
  }

  // Default comprehensive engineering blueprint for any custom idea
  const cleanTitle = prompt.trim().slice(0, 60);
  return {
    content: `### 4TECH Engineering Architecture: ${cleanTitle}

**System Overview:**
A complete embedded engineering system tailored to your requirements, prioritizing robust circuit protection, modular firmware structure, and rapid prototyping feasibility.

**1. Recommended Core Architecture:**
- **Microcontroller / Compute:** ESP32-S3 (for connected IoT, WiFi/BLE, dual-core concurrency) or STM32F4 (for deterministic motor control and high-speed hardware timers).
- **Signal Conditioning & Input:** Filtered analog front-end with passive RC low-pass filters and TVS diodes for ESD protection on all external lines.
- **Power Supply Network:** Wide-input switching regulator (buck DC-DC, e.g. LM2596 or MP1584) stepped down to 3.3V/5V rails with dedicated ground plane separation for digital and analog domains.

**2. Firmware Pipeline & State Machine:**
- **Architecture:** Event-driven architecture with cooperative tasks under FreeRTOS.
- **Diagnostics:** UART serial telemetry bus (115200 baud) streaming JSON-formatted system metrics and error codes.
- **Fail-Safe Mechanism:** Hardware watchdog timer (WDT) and brownout detection enabled.

**3. Prototyping Roadmap:**
- **Phase 1: Breadboard Proof of Concept (PoC)** — Core sensor and actuator validation.
- **Phase 2: Schematic & PCB Layout** — Designed in KiCad with ground pour and thermal vias.
- **Phase 3: Enclosure & Integration** — 3D CAD modeling in SOLIDWORKS with tolerance fitting.
- **Phase 4: Functional Validation** — Bench tests under full load and thermal inspection.

**4. Prototyping Budget & Timeline:**
- **Estimated Prototyping Cost:** ₹12,000 – ₹25,000
- **Feasible Prototyping Timeline:** 3 to 6 weeks.
- **Fabrication with 4TECH:** Mohammed Vashir and Sabeel Ahamed will evaluate your specific requirements to formulate a physical prototype delivery plan.`,
    briefData: {
      title: cleanTitle || 'Custom Embedded Engineering Prototype',
      domain: 'Embedded Systems & Prototyping',
      architecture: [
        'Power: Unregulated DC Input -> Switching Buck Regulator (5V/3.3V Rails)',
        'Compute: ESP32 / STM32 Microcontroller with RTOS task scheduling',
        'Inputs: Filtered sensor bus (I2C/SPI) with ESD clamping diodes',
        'Outputs: High-side driver / MOSFET switching / Display telemetry'
      ],
      hardwareBOM: [
        { item: 'Core Microcontroller (ESP32-S3 / STM32)', purpose: 'Main system computing', estimatedCostINR: '₹750' },
        { item: 'Power Supply & Buck Converter Module', purpose: 'Clean regulated voltage rail', estimatedCostINR: '₹450' },
        { item: 'Dedicated Sensors & Actuators', purpose: 'Physical domain interface', estimatedCostINR: '₹4,500' },
        { item: 'Custom Double-Sided Prototype PCB', purpose: 'Hardware circuit integration', estimatedCostINR: '₹2,000' },
        { item: 'Passives, Connectors & Protection Diodes', purpose: 'Signal conditioning & ESD safety', estimatedCostINR: '₹1,200' },
        { item: 'Custom 3D Printed / Laser-cut Enclosure', purpose: 'Mechanical housing', estimatedCostINR: '₹2,500' }
      ],
      firmwareStack: ['C/C++ Bare-Metal or FreeRTOS', 'Hardware Abstraction Layer (HAL)', 'State Machine with WDT', 'Telemetry Logging'],
      developmentPhases: [
        { phase: 'Phase 1: Hardware Breadboard Validation', duration: '1 week', deliverable: 'Functional verification of sensors & MCU code' },
        { phase: 'Phase 2: Schematic Capture & KiCad PCB', duration: '1.5 weeks', deliverable: 'Schematic, layout and BOM for independent design-rule review' },
        { phase: 'Phase 3: PCB Assembly & Firmware Flashing', duration: '1.5 weeks', deliverable: 'Soldered hardware running calibrated control code' },
        { phase: 'Phase 4: System Stress Testing & Packaging', duration: '1 week', deliverable: 'Verified prototype ready for field testing' }
      ],
      feasibilityNotes: 'Power rails must be decoupled with 100nF ceramic capacitors placed as close as possible to IC VDD pins to suppress switching noise.',
      estimatedBudgetINR: '₹12,000 – ₹25,000',
      suggestedTimeline: '3–6 weeks'
    }
  };
}

/**
 * Main AI generation dispatcher
 */
export async function generateEngineeringAdvice(
  prompt: string,
  _history: AiMessage[] = []
): Promise<{ content: string; provider: 'local-engine'; briefData?: ProjectBriefData }> {
  // Use the built-in engineering model
  const local = generateLocalEngineeringResponse(prompt);
  return {
    content: 'Planning template — not a validated design, quotation or safety approval. Component choices, budget and timing need engineering review.\n\n' + local.content,
    provider: 'local-engine',
    briefData: local.briefData
  };
}

/**
 * Format a project brief into readable text for downloading or clipboard
 */
export function formatProjectBriefText(brief: ProjectBriefData, notes?: string): string {
  const separator = '='.repeat(68);
  const subSeparator = '-'.repeat(68);

  const bomLines = brief.hardwareBOM
    .map((item, idx) => `  ${String(idx + 1).padStart(2, '0')}. ${item.item.padEnd(30)} | ${item.purpose.padEnd(25)} | ${item.estimatedCostINR}`)
    .join('\n');

  const phaseLines = brief.developmentPhases
    .map((p, idx) => `  [Phase ${idx + 1}] ${p.phase} (${p.duration})\n    Deliverable: ${p.deliverable}`)
    .join('\n\n');

  return `${separator}
4TECH ENGINEERING PROJECT BRIEF
Technology That Shapes Tomorrow.
${separator}
Project Title:        ${brief.title}
Engineering Domain:   ${brief.domain}
Estimated Budget:     ${brief.estimatedBudgetINR}
Suggested Timeline:   ${brief.suggestedTimeline}
Date Formulated:      ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
${subSeparator}

1. SYSTEM ARCHITECTURE
${brief.architecture.map((a, i) => `  - [0${i + 1}] ${a}`).join('\n')}

2. RECOMMENDED BILL OF MATERIALS (BOM)
${bomLines}

3. FIRMWARE & SOFTWARE ARCHITECTURE
${brief.firmwareStack.map(f => `  - ${f}`).join('\n')}

4. DEVELOPMENT ROADMAP & MILESTONES
${phaseLines}

5. CRITICAL FEASIBILITY & PHYSICAL CONSIDERATIONS
  ${brief.feasibilityNotes}

${notes ? `6. ADDITIONAL SPECIFICATIONS & USER NOTES\n  ${notes}\n` : ''}
${separator}
FABRICATION & PROTOTYPE ENQUIRY:
Mohammed Vashir (Founder & Principal Systems Engineer)
Sabeel Ahamed (Co-Founder & Lead Systems Architect)
4TECH — Tamil Nadu, India
Web: https://4tech-9cy.pages.dev/
Email: 4tech.management@gmail.com
${separator}`;
}
