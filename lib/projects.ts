/** Public portfolio records. Development stages are not claims of measured performance. */
export const difficultyLevels = ['Research Level', 'Advanced', 'Intermediate'] as const;
export type ProjectDifficulty = (typeof difficultyLevels)[number];

export type Project = {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly stage: string;
  readonly difficulty: ProjectDifficulty;
  readonly rank: number;
  readonly short: string;
  readonly body: string;
  readonly tech: readonly string[];
  readonly status: string;
  readonly problem: string;
  readonly solution: string;
  readonly impact: string;
  readonly validation: string;
  readonly featured: boolean;
  readonly title?: string;
  readonly art: string;
};

const projectRecords: Project[] = [
  {
    id: 'antenna',
    name: 'Automated Antenna Radiation Pattern Measurement System',
    title: 'Measuring the invisible.',
    category: 'RF systems / Automation',
    stage: 'Prototype development', difficulty: 'Research Level', rank: 1, featured: true, art: 'polar',
    short: 'Coordinating angular motion and RF measurements to explore antenna response.',
    body: 'An ESP32-based system combining NEMA17/A4988 motion hardware, an AD8317 RF detector and an nRF24L01+ transmitter path. The development work includes OLED output, live visualisation and CSV export. A controlled measurement setup and detector calibration remain necessary before interpreting scans as antenna radiation patterns.',
    tech: ['ESP32', 'AD8317', 'NEMA17', 'A4988', 'nRF24L01+', 'Data visualisation'],
    status: 'Prototype development and component testing; calibrated end-to-end measurement remains unverified.',
    problem: 'Exploring directional antenna response requires repeatable angular positioning, stable RF acquisition and a measurement setup whose limitations are understood.',
    solution: 'Coordinate motor positioning with detector readings, then record angle-dependent observations for plotting and comparison. Establish reference measurements and calibration before drawing performance conclusions.',
    impact: 'Develop a repeatable experimental platform for RF characterization and comparison of antenna observations across angles.',
    validation: 'Prototype development and component testing were discussed, and motor operation was reported. Complete calibrated radiation-pattern measurement, angular accuracy and RF measurement uncertainty have not been verified.',
  },
  {
    id: 'robot-arm',
    name: 'Advanced Robotic Arm Systems',
    title: 'From joint geometry to motion.',
    category: 'Robotics / Mechanical design / Computation',
    stage: 'CAD design & computational studies', difficulty: 'Advanced', rank: 1, featured: true, art: 'kinematics',
    short: 'A five-axis mechanical design alongside analytical, neural and proposed hybrid motion studies.',
    body: 'A five-degree-of-freedom SOLIDWORKS arm assembly explores links, joints and gripper integration. Related Python studies cover analytical inverse kinematics for 3-DOF and 4-DOF models and multilayer-perceptron approximations. A hybrid trajectory-tracking approach combining learned predictions, forward-kinematics checks and analytical correction remains a proposed extension; these studies remain separate from physical control integration.',
    tech: ['SOLIDWORKS', 'Python', 'Inverse kinematics', 'MLP neural networks', 'Trajectory planning', 'Mechatronics'],
    status: 'CAD and computational work exist in the project record; integrated hardware and hybrid tracking results remain unconfirmed.',
    problem: 'A robotic arm needs compatible mechanical geometry, feasible joint solutions and consistent trajectory behavior before motion can be tested on hardware.',
    solution: 'Develop the mechanical assembly, derive interpretable inverse-kinematics models, study learned mappings against analytical references, and define a hybrid evaluation method before hardware integration.',
    impact: 'Connect mechanical design with robot positioning, model comparison and future motion-control integration.',
    validation: 'The CAD design and analytical/neural research work were shared and discussed. Physical construction, model performance metrics, integrated control and publication status are unconfirmed. Hybrid trajectory tracking is methodology planning rather than a completed experiment.',
  },
  {
    id: 'drone',
    name: 'ESP32 Drone Platform',
    title: 'A compact flight platform, from first principles.',
    category: 'PCB design / Embedded systems',
    stage: 'Engineering development', difficulty: 'Advanced', rank: 2, featured: true, art: 'drone',
    short: 'A custom ESP32-S3 control-board design for a compact brushed-motor drone.',
    body: 'A KiCad flight-controller design built around the ESP32-S3, a 1S LiPo supply and 8520 brushed motors. The existing work addresses controller and sensor integration, motor-drive stages, USB connectivity and power circuitry. A complete flying platform depends on resolving electrical design checks, validating the hardware and developing and testing flight-control behavior.',
    tech: ['KiCad', 'ESP32-S3', '1S LiPo', '8520 motors', 'Motor drivers', 'Embedded control'],
    status: 'PCB design and routing remain in progress; no manufacturing-ready board or flight-validated platform is claimed.',
    problem: 'A compact drone controller must fit sensing, computation, motor drive and power distribution into a small, electrically coherent board.',
    solution: 'Develop the custom controller PCB, resolve connectivity and design-rule issues, then approach hardware bring-up and controlled subsystem testing before any flight evaluation.',
    impact: 'Build practical understanding of integrated control electronics and the constraints of a lightweight battery-powered platform.',
    validation: 'The last recorded native design-rule audit did not pass. Routing, electrical verification and hardware bring-up remain unfinished; the board is not manufacturing-ready and the platform has not been flight-validated.',
  },
  {
    id: 'sewersense',
    name: 'SewerSense',
    title: 'Turning signals into insight.',
    category: 'IoT / Environmental sensing',
    stage: 'Hardware integration', difficulty: 'Intermediate', rank: 1, featured: true, art: 'signals',
    short: 'An ESP32 sensing project bringing environmental readings and device state into one interface.',
    body: 'An ESP32 monitoring project involving MQ-4, MQ-7 and MQ-135 gas-sensor modules, a DHT22 temperature/humidity sensor and a MAX30102 pulse sensor. Firmware and a web dashboard support experimentation with readings, connectivity and alarm information. Demonstration displays and uncalibrated signals must be distinguished from validated measurements.',
    tech: ['ESP32', 'MQ gas-sensor modules', 'DHT22', 'MAX30102', 'Web dashboard'],
    status: 'Firmware and dashboard work were recorded; hardware calibration and alarm verification remain incomplete.',
    problem: 'An environmental-sensing prototype needs to make readings, missing or stale data and device connectivity understandable in one place.',
    solution: 'Integrate acquisition firmware and a dashboard that presents observations with device state, while retaining explicit calibration and hardware-validation boundaries.',
    impact: 'Support connected environmental instrumentation with explicit device-state reporting and measurement-quality checks.',
    validation: 'Firmware builds and dashboard checks were recorded. Sensor calibration, pulse readings and alarm wiring require further verification. This project is not a certified safety instrument and cannot establish that a workplace is safe.',
  },
  {
    id: 'power',
    name: 'Wireless EV Charging System',
    category: 'Power electronics / Inductive coupling',
    stage: 'Design study / proposed EV extension', difficulty: 'Research Level', rank: 6, featured: false, art: 'wireless-power',
    short: 'Extending an inductive power-transfer study toward a conceptual EV charging architecture.',
    body: 'Existing lower-power design and presentation work explores transmitter/receiver coils, switching circuitry, rectification and ESP32 monitoring. The EV application is a proposed research direction, not a demonstrated vehicle charger. Scaling would require separate work on coupling, alignment, thermal behavior, protection, control and relevant charging interfaces.',
    tech: ['Inductive coupling', 'Resonant power electronics', 'ESP32 monitoring', 'Coil design', 'Thermal and protection studies'],
    status: 'Lower-power design study; the EV-scale extension is conceptual.',
    problem: 'Contactless vehicle charging introduces alignment, power-conversion, thermal and protection requirements beyond a small inductive-transfer experiment.',
    solution: 'Use the existing lower-power architecture as a learning baseline, characterize a controlled bench system, and develop an EV-level requirements and simulation study before proposing scaled hardware.',
    impact: 'Create a structured research path for understanding wireless energy transfer and the engineering work needed to evaluate a vehicle-charging concept.',
    validation: 'Lower-power design and presentation work were reviewed, but final operation and measured transfer performance remain unconfirmed. No EV charging power, efficiency, charging time, compatibility or completed vehicle demonstration is claimed.',
  },
  {
    id: 'rescue',
    name: 'Autonomous Disaster Rescue Vehicle',
    category: 'Mobile robotics / Environmental perception',
    stage: 'Proposed R&D concept', difficulty: 'Research Level', rank: 4, featured: false, art: 'rescue',
    short: 'A ground-vehicle concept exploring obstacle awareness and search-assistance sensing.',
    body: 'An earlier system concept begins with LD2450 radar and considers camera, thermal sensing and navigation as complementary capabilities. Autonomous operation would need a defined environment, suitable sensing, dependable mobility and extensive controlled evaluation. A person-detection signal alone is not proof of a successful rescue capability.',
    tech: ['LD2450 radar exploration', 'Mobile robotics', 'Sensor fusion', 'Navigation research', 'Camera/thermal sensing concepts'],
    status: 'System architecture and research planning; no completed autonomous rescue vehicle.',
    problem: 'A search-assistance robot needs to interpret uncertain observations and move through constrained environments without overstating what its sensors can detect.',
    solution: 'Define representative test scenarios, study complementary sensing methods and develop perception and navigation modules for controlled ground-vehicle experiments.',
    impact: 'Investigate how mobile robotics could support future search-assistance tools and the evidence needed to evaluate them responsibly.',
    validation: 'The project is at concept and system-architecture stage. Human-detection reliability, autonomous navigation, environmental ruggedness and field rescue performance have not been established.',
  },
  {
    id: 'passive-rf-drone',
    name: 'Passive RF Drone Detection Receiver',
    category: 'RF instrumentation / Signal analysis',
    stage: 'Proposed R&D concept', difficulty: 'Research Level', rank: 2, featured: false, art: 'rf-spectrum',
    short: 'A receive-only study of radio activity associated with controlled drone-link experiments.',
    body: 'A proposed passive receiver and analysis workflow for observing RF activity and comparing recorded spectral features in controlled experiments. Frequency coverage depends on the chosen antennas, filters, RF front end and SDR. A generic inexpensive SDR dongle is not assumed to cover 2.4 GHz or 5.8 GHz directly.',
    tech: ['Band-appropriate SDR', 'RF filters and antennas', 'Spectrum analysis', 'Python signal processing', 'Recorded-signal datasets'],
    status: 'Proposed receiver architecture and evaluation plan; no built or validated detection system.',
    problem: 'Shared RF bands contain many signal sources, making it difficult to distinguish relevant link activity from ordinary traffic using spectrum observations alone.',
    solution: 'Select receive hardware for the target bands, collect labeled observations from controlled sources, and evaluate candidate signal features against background activity. Keep the system passive and quantify false alarms and missed observations.',
    impact: 'Develop RF measurement and classification skills while exploring the limitations of spectrum-based drone-link observation.',
    validation: 'No receiver build, dataset, detection accuracy or range has been demonstrated. Passive RF observations do not establish drone identity or detect every drone, particularly those without an observable radio link.',
  },
  {
    id: 'rf-direction-finder',
    name: 'RF Direction Finder',
    category: 'RF measurement / Localization research',
    stage: 'Proposed R&D concept', difficulty: 'Research Level', rank: 3, featured: false, art: 'direction-finder',
    short: 'Exploring how receive-antenna observations can support directional RF measurements.',
    body: 'A proposed receive-only direction-finding study comparing observations from a rotated directional antenna or a suitably synchronized antenna arrangement. The approach would require band-appropriate receivers, reference-source measurements and careful treatment of reflections and receiver calibration.',
    tech: ['Directional antennas', 'Band-appropriate RF receiver', 'Angular scanning', 'Python', 'Calibration and uncertainty analysis'],
    status: 'Proposed measurement architecture; hardware and angular performance unverified.',
    problem: 'Signal strength and phase observations are affected by antenna behavior, reflections and receiver differences, so a stronger reading does not automatically indicate a reliable source bearing.',
    solution: 'Start with controlled reference-source experiments, compare candidate scanning or multi-antenna methods, and report directional estimates with their uncertainty and environmental limitations.',
    impact: 'Build an experimental foundation in antenna behavior, RF measurement and the interpretation of directional observations.',
    validation: 'No completed receiver array, calibration dataset, bearing accuracy or localization range has been demonstrated. A bearing estimate alone does not determine a source location or identity; all proposed analysis is passive.',
  },
  {
    id: 'rf-shielding',
    name: 'RF Shielding Effectiveness / Faraday Cage System',
    category: 'Electromagnetics / Enclosure design',
    stage: 'Proposed R&D concept', difficulty: 'Advanced', rank: 4, featured: false, art: 'shielding',
    short: 'A proposed test enclosure for studying how materials, seams and openings affect RF attenuation.',
    body: 'A comparative enclosure study that would examine conductive materials, joints, apertures and cable feedthroughs under a defined RF measurement setup. The aim is to measure shielding effectiveness over specified frequencies and conditions, not to claim universal electromagnetic isolation.',
    tech: ['Conductive enclosure design', 'RF measurement', 'Seam and aperture studies', 'Reference measurements', 'Data analysis'],
    status: 'Proposed enclosure and measurement study; no tested shielding performance.',
    problem: 'An enclosure can perform very differently across frequencies, and seams or cables may dominate leakage even when the main wall material is conductive.',
    solution: 'Define a repeatable source-and-receiver arrangement, record a baseline, compare enclosure variants and report frequency-dependent attenuation alongside the setup and its limitations.',
    impact: 'Improve understanding of practical electromagnetic compatibility and how enclosure details influence RF containment.',
    validation: 'No enclosure, attenuation measurements or compliance tests have been completed. No absolute shielding, EMP protection or protection of safety-critical equipment is claimed.',
  },
  {
    id: 'vision-tracking',
    name: 'Autonomous Vision Tracking Platform',
    category: 'Computer vision / Motion control',
    stage: 'Proposed R&D concept', difficulty: 'Advanced', rank: 3, featured: false, art: 'vision',
    short: 'A camera-only pan-and-tilt concept for following selected objects in controlled scenes.',
    body: 'A proposed vision system that would estimate an object position in camera frames and command a pan-and-tilt camera mount to keep it in view. Work would focus on tracking stability, latency, motion limits and recovery after the object leaves the scene. The application focuses on camera observation and visual feedback.',
    tech: ['OpenCV', 'Python', 'Object tracking', 'Pan-and-tilt camera mount', 'Feedback control'],
    status: 'Proposed camera-tracking R&D; no integrated platform or measured tracking results.',
    problem: 'A moving camera needs to translate noisy image observations into smooth bounded motion and behave predictably when tracking confidence falls.',
    solution: 'Evaluate tracking methods on controlled footage, couple a selected method to a limited-motion camera mount, and test latency, stability and loss-of-track behavior.',
    impact: 'Explore practical links between computer vision and feedback control for demonstrations, filming and observation experiments.',
    validation: 'No integrated build, object-recognition accuracy, tracking latency or autonomous performance has been verified. The intended application is camera observation only.',
  },
  {
    id: 'ar-hud',
    name: 'AR Heads-Up Display Goggles',
    category: 'Wearable interfaces / Display optics',
    stage: 'Proposed R&D concept', difficulty: 'Research Level', rank: 5, featured: false, art: 'ar-display',
    short: 'A wearable display concept for presenting simple information within the field of view.',
    body: 'A proposed near-eye display study combining a small display, an optical arrangement and an embedded information source. Early work would investigate readability, alignment, fit and display control. World-locked augmented-reality overlays would require additional tracking and calibration beyond a fixed heads-up display.',
    tech: ['Near-eye display research', 'Optical prototyping', 'Embedded display control', 'Mechanical CAD', 'Interface design'],
    status: 'Proposed optics and wearable-interface R&D; no completed goggles.',
    problem: 'A wearable display must present legible information while managing alignment, optical comfort and a constrained mechanical package.',
    solution: 'Begin with a bench optical demonstrator, evaluate simple static information, and study mechanical and display integration before considering head tracking or spatial overlays.',
    impact: 'Develop knowledge of embedded displays, optical prototyping and human-centered wearable interfaces.',
    validation: 'No optical prototype, wearable fit, eye-comfort evaluation or spatial-tracking performance has been established. Field of view, outdoor readability and AR registration are unmeasured.',
  },
  {
    id: 'night-vision',
    name: 'Digital Night-Vision Monocular',
    category: 'Imaging / Embedded displays',
    stage: 'Proposed R&D concept', difficulty: 'Advanced', rank: 6, featured: false, art: 'night-vision',
    short: 'A digital low-light imaging concept linking a camera sensor to a compact viewing display.',
    body: 'A proposed camera-and-display monocular investigating low-light image acquisition, digital processing and enclosure design. Sensor sensitivity, lens selection and illumination conditions would define what can be observed. Digital low-light imaging is distinct from thermal imaging and image-intensifier technology.',
    tech: ['Low-light camera module', 'Image processing', 'Compact display', 'Optical integration', 'Mechanical enclosure design'],
    status: 'Proposed imaging and enclosure study; no completed monocular.',
    problem: 'A compact digital viewer must balance usable image quality, latency, display ergonomics and power demand under clearly specified lighting conditions.',
    solution: 'Compare camera behavior under controlled illumination, prototype a camera-to-display path and evaluate image noise and viewing latency before developing a handheld enclosure.',
    impact: 'Explore embedded imaging and the practical limits of digital observation in dim environments.',
    validation: 'No prototype, sensitivity, viewing range, battery life or eye-comfort result has been demonstrated. No thermal capability or guaranteed vision in complete darkness is claimed.',
  },
  {
    id: 'wind-tunnel',
    name: 'Desktop Wind Tunnel',
    category: 'Experimental mechanics / Flow measurement',
    stage: 'Proposed R&D concept', difficulty: 'Intermediate', rank: 2, featured: false, art: 'wind-tunnel',
    short: 'A benchtop concept for controlled airflow experiments around small test models.',
    body: 'A proposed small wind-tunnel architecture involving airflow generation, flow conditioning, a test section and measurement access. The study would begin with repeatability and velocity distribution before comparing model behavior. Model-scale observations would need careful interpretation before relating them to larger systems.',
    tech: ['Mechanical CAD', 'Flow conditioning', 'Air-velocity measurement', 'Pressure sensing', 'Experimental data logging'],
    status: 'Proposed benchtop design and measurement plan; no constructed or calibrated tunnel.',
    problem: 'Meaningful small-model flow experiments require a characterized test section rather than assuming that a fan produces uniform, repeatable conditions.',
    solution: 'Design a compact flow path, measure velocity variation and repeatability, then develop simple model experiments with recorded test conditions and measurement limits.',
    impact: 'Create an instrumented platform for fluid mechanics, experimental design and comparison of model-scale observations.',
    validation: 'No tunnel build, flow-uniformity measurements, calibrated velocity range or aerodynamic force data has been established.',
  },
  {
    id: 'composite-drop-test',
    name: 'Composite Material Drop-Test System',
    category: 'Materials testing / Instrumentation',
    stage: 'Proposed R&D concept', difficulty: 'Advanced', rank: 5, featured: false, art: 'composite',
    short: 'A proposed controlled-impact rig for comparative material experiments.',
    body: 'A concept for comparing composite specimens under documented, repeatable drop conditions. The study would consider specimen support, impactor guidance, containment and measurement of motion or response. Comparative observations would be distinct from certified material properties or compliance testing.',
    tech: ['Mechanical fixture design', 'Impact instrumentation', 'Data acquisition', 'High-frame-rate video concepts', 'Comparative materials analysis'],
    status: 'Proposed test-rig and instrumentation R&D; no constructed or qualified system.',
    problem: 'Uncontrolled impact experiments can mix specimen differences with variations in support, alignment and impact conditions, making comparisons unreliable.',
    solution: 'Define the experimental protocol and contained fixture, establish repeatability with reference specimens, and select calibrated measurements appropriate to the comparison before testing composites.',
    impact: 'Develop an educational method for studying material response and the importance of repeatable mechanical experiments.',
    validation: 'No apparatus, calibrated impact measurements, specimen results or standards qualification has been demonstrated. The concept does not establish structural suitability or safety certification for any material.',
  },
  {
    id: 'magnetic-anomaly',
    name: 'Magnetic Anomaly Detector',
    category: 'Magnetic sensing / Signal analysis',
    stage: 'Proposed R&D concept', difficulty: 'Research Level', rank: 7, featured: false, art: 'magnetic',
    short: 'A sensing concept for observing local changes in a measured magnetic field.',
    body: 'A proposed magnetometer-based study of local field variations in controlled laboratory or educational surveying experiments. Sensor offset, orientation, nearby electronics and environmental drift would need to be characterized before interpreting a change as a meaningful anomaly.',
    tech: ['Magnetometer', 'Embedded acquisition', 'Baseline calibration', 'Signal filtering', 'Python data analysis'],
    status: 'Proposed sensing and calibration research; no demonstrated detector.',
    problem: 'Magnetic measurements contain orientation effects, drift and local interference that can be mistaken for a change caused by an object or material.',
    solution: 'Characterize the sensor and baseline environment, record repeatable controlled changes, and compare filtering or differential-measurement approaches while reporting uncertainty.',
    impact: 'Build understanding of magnetic sensing, environmental interference and cautious interpretation of weak signals.',
    validation: 'No completed device, detection threshold, object-classification ability, depth or range has been demonstrated. A measured field change alone does not identify its source.',
  },
];

/** Group by difficulty, then prioritize documented work before newer concepts. */
export const projects: readonly Project[] = [...projectRecords].sort((a, b) =>
  difficultyLevels.indexOf(a.difficulty) - difficultyLevels.indexOf(b.difficulty) || a.rank - b.rank,
);

const featuredIds = ['antenna', 'robot-arm', 'drone', 'sewersense'] as const;
export const featuredProjects: readonly Project[] = featuredIds.map((id) => {
  const project = projectRecords.find((entry) => entry.id === id);
  if (!project) throw new Error(`Missing featured project: ${id}`);
  return project;
});

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.id === slug);
}
