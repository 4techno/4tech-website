/** Project completion updated from the owner’s statement on 30 September 2026. */
export const difficultyLevels = ['Research Level', 'Advanced', 'Intermediate'] as const;
export type ProjectDifficulty = (typeof difficultyLevels)[number];
export type ProjectEvidence = {
  readonly subject: string;
  readonly state: 'Described work' | 'Reported observation' | 'Review finding' | 'Not verified';
  readonly detail: string;
};
export type ProjectCaseStudy = {
  readonly visual: 'polar' | 'kinematics' | 'drone' | 'signals';
  readonly basis: string;
  readonly evidence: readonly ProjectEvidence[];
  readonly media: string;
  readonly nextChecks: readonly string[];
};
export type Project = { readonly id: string; readonly name: string; readonly category: string; readonly stage: string; readonly difficulty: ProjectDifficulty; readonly rank: number; readonly short: string; readonly body: string; readonly tech: readonly string[]; readonly status: string; readonly problem: string; readonly solution: string; readonly impact: string; readonly validation: string; readonly developedBy: string; readonly featured: boolean; readonly art: string; readonly caseStudy?: ProjectCaseStudy; };
const projectRecords: Project[] = [
  {
    "id": "antenna",
    "name": "Automated Antenna Radiation Pattern Measurement System",
    "category": "RF instrumentation & automation",
    "difficulty": "Research Level",
    "rank": 1,
    "tech": [
      "ESP32",
      "AD8317",
      "NEMA17 / A4988",
      "nRF24L01+",
      "Python",
      "CSV acquisition"
    ],
    "short": "Automated angular scanning and RF data acquisition for antenna pattern analysis.",
    "problem": "Comparing antennas requires measurements that relate received signal level to orientation. Manual rotation and separate readings make it difficult to maintain a consistent sequence and reconstruct the resulting pattern.",
    "solution": "The system brings motorized positioning, an RF detector and microcontroller acquisition into one workflow. ESP32 firmware coordinates angular steps with readings from the AD8317 detector, while the measurement interface presents observations and supports data export.",
    "body": "Engineering work covers the motor-driver interface, sensor acquisition, scan sequencing and the transfer of readings into a structured dataset. The resulting architecture connects the mechanical angle, electronic measurement and software visualization so that a scan can be examined as a complete engineering record.",
    "impact": "Provides a practical antenna-characterization workflow and a reusable platform for RF measurement experiments.",
    "validation": "Radiation patterns depend on the measurement environment, reference source and calibration procedure. No numerical gain accuracy or certified frequency coverage is specified here.",
    "stage": "Completed",
    "status": "Completed by Mohammed Vashir.",
    "developedBy": "Mohammed Vashir",
    "featured": true,
    "art": "antenna",
    "caseStudy": {
      "visual": "polar",
      "basis": "This record draws on the owner's project description, résumé and earlier development notes. It describes the engineering scope without treating an unshared dataset as a measured result.",
      "evidence": [
        { "subject": "Motorized positioning", "state": "Reported observation", "detail": "The motor setup was reported working during prototype development. No angular repeatability log is included." },
        { "subject": "RF acquisition workflow", "state": "Described work", "detail": "The ESP32, AD8317 detector, NEMA17/A4988 drive and nRF24L01+ link are described alongside display, visualization and CSV-export work." },
        { "subject": "Radiation-pattern result", "state": "Not verified", "detail": "A calibrated angular dataset, reference setup and repeatability analysis have not been supplied for publication." }
      ],
      "media": "No project-specific setup photograph, sweep plot or measurement file is included in this public portfolio. The photograph above shows a different antenna measurement setup and is not evidence for this project.",
      "nextChecks": [
        "Record the angle reference, step size, RF source, detector calibration and measurement environment.",
        "Export raw sweep data and repeat the scan under the same conditions to establish repeatability.",
        "Publish the setup photograph, CSV and plotted pattern together so the result can be checked."
      ]
    }
  },
  {
    "id": "robot-arm",
    "name": "Advanced Robotic Arm Systems",
    "category": "Robotics & computational engineering",
    "difficulty": "Advanced",
    "rank": 1,
    "tech": [
      "SOLIDWORKS",
      "Python",
      "Inverse kinematics",
      "Neural-network modelling",
      "Motion control"
    ],
    "short": "Mechanical design and computational kinematics for coordinated robotic manipulation.",
    "problem": "A robotic arm must connect its mechanical geometry to achievable end-effector positions. Joint limits, coordinate frames and the choice of kinematic solution all influence whether a motion can be executed consistently.",
    "solution": "The project combines a five-degree-of-freedom CAD assembly with analytical and computational inverse-kinematics work. Separate modelling studies explore three- and four-degree-of-freedom formulations and neural-network approximation of joint solutions.",
    "body": "The engineering approach links CAD geometry, mathematical representation and software evaluation. Forward and inverse models provide a way to examine motion, compare solutions and describe the relationship between joint coordinates and the working envelope.",
    "impact": "Connects mechanical design with reusable kinematic models for robotic positioning and automation research.",
    "validation": "Degrees of freedom refer to the corresponding assembly or model. Payload ratings, positioning tolerance and comparative solver performance are not quantified in this portfolio.",
    "stage": "Completed",
    "status": "Completed by Mohammed Vashir.",
    "developedBy": "Mohammed Vashir",
    "featured": true,
    "art": "robot-arm",
    "caseStudy": {
      "visual": "kinematics",
      "basis": "The available portfolio record describes a five-degree-of-freedom SOLIDWORKS assembly and separate computational kinematics studies. The models are distinct from a validated physical arm.",
      "evidence": [
        { "subject": "Mechanical assembly", "state": "Described work", "detail": "A five-degree-of-freedom arm assembly with articulated links, joints and gripper integration is described. The native CAD file is not in this public package." },
        { "subject": "Kinematics research", "state": "Described work", "detail": "Analytical three- and four-degree-of-freedom inverse-kinematics models and neural-network approximation are described as separate studies." },
        { "subject": "Motion performance", "state": "Not verified", "detail": "No physical build, payload test, positioning-tolerance measurement or solver benchmark is provided here." }
      ],
      "media": "No project-specific CAD render, assembly photograph or solver output is included in this public portfolio. The photograph above shows a different industrial arm and is not evidence for this project.",
      "nextChecks": [
        "Publish the CAD assembly or an export showing link dimensions, joint axes and travel limits.",
        "Test the analytical and learned solutions against a defined set of reachable and unreachable targets.",
        "If a physical arm is built, record joint motion, end-effector error and payload under stated conditions."
      ]
    }
  },
  {
    "id": "drone",
    "name": "ESP32 Drone Platform",
    "category": "Embedded control & PCB engineering",
    "difficulty": "Advanced",
    "rank": 2,
    "tech": [
      "ESP32-S3",
      "KiCad",
      "1S LiPo",
      "Brushed motor drivers",
      "Inertial sensing",
      "Embedded C++"
    ],
    "short": "A compact controller architecture integrating processing, sensing, motor drive and battery power.",
    "problem": "A small aerial platform must integrate sensitive control electronics with changing motor loads in a limited space. Power distribution, sensor interfaces and driver connections need to be considered together.",
    "solution": "The platform centres on an ESP32-S3 controller and a custom KiCad electronics design for a compact 1S brushed-motor system. The design connects sensing, motor-drive channels, programming access and the power network within a single architecture.",
    "body": "Work spans schematic development, component interfaces, board layout and embedded control. Particular attention is given to the interaction between supply rails, driver stages and sensor readings, as well as practical access for programming and troubleshooting.",
    "impact": "Provides a compact platform for embedded-control development and integration of small robotic systems.",
    "validation": "Project completion does not imply a manufacturing release, certified airworthiness or a specific flight envelope. Fabrication and flight decisions require their own applicable checks.",
    "stage": "Completed",
    "status": "Completed by Mohammed Vashir.",
    "developedBy": "Mohammed Vashir",
    "featured": true,
    "art": "drone",
    "caseStudy": {
      "visual": "drone",
      "basis": "The owner describes a completed PCB design effort. The last available native board audit did not pass, so fabrication and flight performance remain outside the verified record.",
      "evidence": [
        { "subject": "Controller architecture", "state": "Described work", "detail": "The KiCad design combines ESP32-S3 control, a 1S battery system, brushed-motor drive, sensing, USB and power distribution." },
        { "subject": "Native PCB audit", "state": "Review finding", "detail": "The last recorded KiCad design-rule audit did not pass. No later zero-error, zero-unconnected release check is included." },
        { "subject": "Fabrication and flight", "state": "Not verified", "detail": "No fabricated-board bring-up record, motor test or flight log is included in the available portfolio evidence." }
      ],
      "media": "No native board files, board photograph or flight-test media are included in this public portfolio. The photograph above shows other drone electronics and is not evidence for this project.",
      "nextChecks": [
        "Run native KiCad design-rule checks on the exact release revision until there are zero errors and zero unconnected items.",
        "Inspect power rails, USB, sensor communication and each motor channel on a fabricated board before fitting propellers.",
        "Record controlled bench and flight tests with the board revision and test conditions identified."
      ]
    }
  },
  {
    "id": "sewersense",
    "name": "SewerSense",
    "category": "IoT & environmental instrumentation",
    "difficulty": "Intermediate",
    "rank": 1,
    "tech": [
      "ESP32",
      "MQ gas sensors",
      "Temperature / humidity sensing",
      "MAX30102",
      "Web dashboard"
    ],
    "short": "Multi-sensor data acquisition and a web interface for environmental monitoring experiments.",
    "problem": "Environmental sensing becomes more useful when individual readings, device state and communication quality can be reviewed together. A disconnected collection of sensor values makes faults and changes harder to interpret.",
    "solution": "SewerSense combines an ESP32-based acquisition node with gas, ambient-condition and pulse-sensor inputs and a web dashboard. The workflow brings readings into one interface and supports examination of sensor communication and local alarm behaviour.",
    "body": "The project covers sensor interfacing, firmware, data updates and dashboard presentation. Its engineering value lies in joining physical inputs to an understandable system view, including the distinction between a live reading and an unavailable or unreliable channel.",
    "impact": "Demonstrates integrated sensing and remote monitoring across hardware and software.",
    "validation": "This is an engineering monitoring project, not a certified life-safety instrument. Sensor values alone do not establish whether a confined space is safe to enter.",
    "stage": "Completed",
    "status": "Completed by Mohammed Vashir.",
    "developedBy": "Mohammed Vashir",
    "featured": true,
    "art": "sewersense",
    "caseStudy": {
      "visual": "signals",
      "basis": "The available development record includes firmware builds and dashboard checks. Sensor calibration and alarm behavior still need physical verification before any operational claim.",
      "evidence": [
        { "subject": "Firmware and dashboard", "state": "Described work", "detail": "ESP32 firmware, multi-sensor integration and a live web dashboard are described, with build and interface checks recorded during development." },
        { "subject": "Sensor and alarm integration", "state": "Review finding", "detail": "Hardware troubleshooting covered sensor detection, data updates and alarm control. Pulse readings and buzzer wiring remained unresolved in the last available test notes." },
        { "subject": "Safety performance", "state": "Not verified", "detail": "Gas sensor calibration, exposure thresholds and reliable alarm behavior have not been established. The system does not demonstrate confined-space safety." }
      ],
      "media": "No project-specific field photograph, calibration record or end-to-end alarm test log is included in this public portfolio. The photograph above illustrates protective equipment and is not evidence for this project.",
      "nextChecks": [
        "Confirm each sensor's power, interface and calibration against its exact module documentation.",
        "Test missing, stale and warming readings so the interface never presents them as a safe condition.",
        "Verify the alarm circuit and an end-to-end test record before making any field-use claim."
      ]
    }
  },
  {
    "id": "power",
    "name": "Wireless EV Charging System",
    "category": "Power electronics & wireless energy",
    "difficulty": "Research Level",
    "rank": 6,
    "tech": [
      "Inductive coupling",
      "Coil design",
      "Rectification",
      "Filtering",
      "Electrical measurement"
    ],
    "short": "Contactless power-transfer engineering through coupled coils and receiver conditioning.",
    "problem": "Wireless energy transfer depends on coil geometry, alignment and the electrical load. A useful engineering study must examine the receiving circuit and losses alongside the magnetic coupling.",
    "solution": "The project connects transmitter and receiver coils with power-conditioning stages to investigate contactless transfer. Receiver rectification and filtering form part of the system, alongside the measurement of electrical behaviour under controlled conditions.",
    "body": "The work considers coil placement, operating conditions and load behaviour as linked design variables. It provides an experimental basis for discussing how a contactless architecture could be scaled and what additional controls and protections would be needed.",
    "impact": "Builds practical understanding of inductive energy transfer and the system requirements behind wireless charging.",
    "validation": "The EV-oriented scope is a research application. No vehicle-scale power rating, charging standard compliance or automotive qualification is claimed.",
    "stage": "Completed",
    "status": "Completed by Mohammed Vashir.",
    "developedBy": "Mohammed Vashir",
    "featured": false,
    "art": "power"
  },
  {
    "id": "passive-rf-drone",
    "name": "Passive RF Drone Detection Receiver",
    "category": "RF reception & signal analysis",
    "difficulty": "Research Level",
    "rank": 2,
    "tech": [
      "SDR",
      "Receive antennas",
      "Spectrum analysis",
      "Python",
      "RF filtering"
    ],
    "short": "Passive RF observation and spectral analysis of signals associated with drone communication.",
    "problem": "Wireless activity changes with time, channel and location. Observing that activity requires a receiver workflow that distinguishes measured spectral features from assumptions about the transmitter.",
    "solution": "The receiver uses SDR-based acquisition and a signal-analysis interface to inspect activity in the bands supported by the selected RF hardware. Antenna choice and receiver configuration are matched to the measurement question.",
    "body": "The project brings together receiver setup, spectrum visualization and observation of signal activity. Analysis focuses on features in the received data, with awareness that other devices can occupy the same bands and that frequency coverage is a property of the actual receiver chain.",
    "impact": "Provides a receive-only platform for RF observation and investigation of wireless communication behaviour.",
    "validation": "An RF observation is not definitive identification of an aircraft or operator. Detection range, classification accuracy and simultaneous band coverage are not specified.",
    "stage": "Completed",
    "status": "Completed by Mohammed Vashir.",
    "developedBy": "Mohammed Vashir",
    "featured": false,
    "art": "passive-rf-drone"
  },
  {
    "id": "rf-direction-finder",
    "name": "RF Direction Finder",
    "category": "RF localization & instrumentation",
    "difficulty": "Research Level",
    "rank": 3,
    "tech": [
      "Directional antenna",
      "SDR",
      "Angular measurement",
      "Python",
      "Signal-strength analysis"
    ],
    "short": "Directional reception and angular comparison for estimating the bearing of an RF source.",
    "problem": "Locating a radio source requires more than detecting its presence. Received power varies with antenna orientation, reflections and obstructions, which complicates the interpretation of a bearing.",
    "solution": "The system combines directional reception with measurements recorded at known orientations. Signal observations are compared across the angular sweep to present an estimated source direction.",
    "body": "The engineering workflow links the antenna, RF receiver, angular reference and visualization. It emphasizes consistent measurement conditions and interpretation of the directional response, rather than treating the strongest sample as an infallible location estimate.",
    "impact": "Supports controlled transmitter-location exercises and investigation of directional antenna response.",
    "validation": "Bearing estimates are affected by multipath, antenna pattern and geometry. No angular accuracy or geolocation precision is specified.",
    "stage": "Completed",
    "status": "Completed by Mohammed Vashir.",
    "developedBy": "Mohammed Vashir",
    "featured": false,
    "art": "rf-direction-finder"
  },
  {
    "id": "rf-shielding",
    "name": "RF Shielding Effectiveness / Faraday Cage System",
    "category": "Electromagnetics & RF measurement",
    "difficulty": "Advanced",
    "rank": 4,
    "tech": [
      "Conductive enclosure",
      "Seam treatment",
      "SDR / RF receiver",
      "Reference measurements",
      "Attenuation analysis"
    ],
    "short": "Enclosure construction and comparative measurements for evaluating RF attenuation.",
    "problem": "An enclosure can lose shielding performance through seams, openings and poor electrical continuity. Observing signal loss requires a repeatable comparison between reference and enclosed conditions.",
    "solution": "The project combines a conductive enclosure with an RF measurement workflow. Measurements compare received levels under defined conditions to investigate the effect of enclosure construction and seam treatment.",
    "body": "The work connects material selection and mechanical assembly with signal observation. Repeated reference measurements help separate the behaviour of the enclosure from changes in the signal source, receiver or surrounding environment.",
    "impact": "Provides a practical method for studying shielding behaviour and electromagnetic enclosure design.",
    "validation": "No specific attenuation figure, EMC compliance or EMP-hardening certification is asserted. Results are specific to the tested frequency, geometry and measurement setup.",
    "stage": "Completed",
    "status": "Completed by Mohammed Vashir.",
    "developedBy": "Mohammed Vashir",
    "featured": false,
    "art": "rf-shielding"
  },
  {
    "id": "vision-tracking",
    "name": "Autonomous Vision Tracking Platform",
    "category": "Computer vision & mechatronics",
    "difficulty": "Advanced",
    "rank": 3,
    "tech": [
      "Camera",
      "OpenCV",
      "Python",
      "Pan–tilt mechanism",
      "Servo control"
    ],
    "short": "Camera perception and motor control combined in a subject-tracking platform.",
    "problem": "Keeping a moving subject within a camera frame requires a useful visual estimate and a mechanical response that avoids excessive oscillation or abrupt movement.",
    "solution": "The platform connects image processing with a two-axis camera mechanism. Visual position information is translated into bounded motion commands that adjust the camera orientation.",
    "body": "The system brings together image capture, target selection, coordinate processing and actuator control. Its architecture allows the perception stage and motion response to be examined separately while retaining a complete feedback workflow.",
    "impact": "Demonstrates hardware–software integration for automated camera positioning and robotics research.",
    "validation": "This is a camera-tracking system. Tracking speed, recognition accuracy and performance in unconstrained scenes are not quantified.",
    "stage": "Completed",
    "status": "Completed by Mohammed Vashir.",
    "developedBy": "Mohammed Vashir",
    "featured": false,
    "art": "vision-tracking"
  },
  {
    "id": "rescue",
    "name": "Autonomous Disaster Rescue Vehicle",
    "category": "Mobile robotics & navigation",
    "difficulty": "Research Level",
    "rank": 4,
    "tech": [
      "Mobile chassis",
      "Embedded controller",
      "Obstacle sensors",
      "Camera",
      "Wireless telemetry"
    ],
    "short": "A sensor-equipped robotic vehicle for remote observation and navigation experiments.",
    "problem": "Remote inspection requires a mobile platform that can observe its surroundings and communicate useful information while accounting for obstacles and limits in the operating environment.",
    "solution": "The vehicle integrates a drive system, environmental perception and an operator interface. Navigation logic and remote observation are considered together to support exploration in controlled test settings.",
    "body": "Engineering work includes mechanical integration, sensor interfaces, motor-control logic and communication between the vehicle and its monitoring interface. The system connects local decision-making with a practical way for an operator to review the scene.",
    "impact": "Provides a mobile robotics platform for exploration, telepresence and research into assisted navigation.",
    "validation": "A completed research vehicle does not establish field-rescue suitability, all-terrain capability or a guarantee of safe autonomous operation.",
    "stage": "Completed",
    "status": "Completed by Mohammed Vashir.",
    "developedBy": "Mohammed Vashir",
    "featured": false,
    "art": "rescue"
  },
  {
    "id": "wind-tunnel",
    "name": "Desktop Wind Tunnel",
    "category": "Experimental aerodynamics",
    "difficulty": "Intermediate",
    "rank": 2,
    "tech": [
      "Fan and flow control",
      "Honeycomb straightener",
      "Transparent test section",
      "CAD",
      "Measurement instrumentation"
    ],
    "short": "A compact airflow test platform for observing aerodynamic behaviour around small specimens.",
    "problem": "An ordinary fan produces a disturbed flow that is difficult to use for comparative aerodynamic observations. A test platform needs a defined flow path, accessible specimen region and repeatable setup.",
    "solution": "The desktop tunnel combines an airflow source, flow-straightening elements and a transparent test section. Specimens can be positioned in the flow while their behaviour is observed and recorded.",
    "body": "The engineering work covers the relationship between the enclosure, flow path, test section and instrumentation. A repeatable setup supports comparisons between specimens and operating conditions within the limits of a benchtop apparatus.",
    "impact": "Enables practical investigation of airflow, model geometry and aerodynamic experimentation.",
    "validation": "Flow uniformity, turbulence intensity and force-measurement uncertainty are not numerically specified. Desktop observations are not full-scale aerodynamic certification.",
    "stage": "Completed",
    "status": "Completed by Mohammed Vashir.",
    "developedBy": "Mohammed Vashir",
    "featured": false,
    "art": "wind-tunnel"
  },
  {
    "id": "composite-drop-test",
    "name": "Composite Material Drop-Test System",
    "category": "Materials engineering & impact testing",
    "difficulty": "Advanced",
    "rank": 5,
    "tech": [
      "Guided drop mechanism",
      "Specimen fixture",
      "Impact sensing",
      "Data acquisition",
      "Composite samples"
    ],
    "short": "A guided impact rig for comparative investigation of composite specimen behaviour.",
    "problem": "Material comparisons require control over the specimen fixture, impact geometry and release conditions. Variability in the setup can obscure the effect of the material itself.",
    "solution": "The rig combines a guided falling mass with a specimen support and an observation or acquisition workflow. Defined release conditions create a structured basis for comparing sample responses.",
    "body": "The work links mechanical alignment, specimen preparation and measurement. The resulting test record connects the setup conditions to observed deformation or damage so that comparisons can be discussed in an engineering context.",
    "impact": "Provides a repeatable framework for practical impact experiments on material samples.",
    "validation": "No standard-compliant test qualification, numerical toughness rating or calibrated impact uncertainty is asserted.",
    "stage": "Completed",
    "status": "Completed by Mohammed Vashir.",
    "developedBy": "Mohammed Vashir",
    "featured": false,
    "art": "composite-drop-test"
  },
  {
    "id": "magnetic-anomaly",
    "name": "Magnetic Anomaly Detector",
    "category": "Magnetometry & embedded sensing",
    "difficulty": "Research Level",
    "rank": 7,
    "tech": [
      "Magnetometers",
      "Embedded acquisition",
      "Baseline compensation",
      "Signal filtering",
      "Data visualization"
    ],
    "short": "Magnetic-field acquisition and analysis for observing local ferrous disturbances.",
    "problem": "A magnetic anomaly must be distinguished from sensor offsets, movement and background field variation. The mechanical arrangement and baseline procedure therefore matter as much as the sensor readings.",
    "solution": "The instrument brings magnetometer acquisition, baseline comparison and visualization into one workflow. Changes in the local field can be examined while the sensing assembly moves through a controlled area.",
    "body": "The project addresses sensor communication, mounting geometry and interpretation of field changes. Its processing workflow helps compare observations against a reference and presents the resulting variation in an accessible form.",
    "impact": "Connects embedded sensing with practical exploration of magnetic-field anomalies.",
    "validation": "No guaranteed detection depth, object-identification ability or drift-free performance is claimed. Results depend on target material, geometry and background conditions.",
    "stage": "Completed",
    "status": "Completed by Mohammed Vashir.",
    "developedBy": "Mohammed Vashir",
    "featured": false,
    "art": "magnetic-anomaly"
  },
  {
    "id": "ar-hud",
    "name": "AR Heads-Up Display Goggles",
    "category": "Wearable optics & embedded displays",
    "difficulty": "Research Level",
    "rank": 5,
    "tech": [
      "Micro-display",
      "Optical combiner",
      "Embedded graphics",
      "Orientation sensing",
      "Wearable enclosure"
    ],
    "short": "A wearable display system combining optical presentation and embedded information.",
    "problem": "A head-up display must place information within the viewer’s line of sight while preserving a useful view of the surroundings. Optical alignment and readable content are central design constraints.",
    "solution": "The goggles combine a small display and an optical combiner with embedded graphics. The arrangement overlays selected information through a wearable optical assembly.",
    "body": "The work connects enclosure design, display positioning and information presentation. Engineering decisions consider how the viewer sees the virtual content, how the assembly is supported and how sensor information is represented.",
    "impact": "Demonstrates integration of optics, electronics and interface design for wearable information systems.",
    "validation": "No calibrated optical field of view, outdoor luminance rating or aviation-use qualification is specified.",
    "stage": "Completed",
    "status": "Completed by Mohammed Vashir.",
    "developedBy": "Mohammed Vashir",
    "featured": false,
    "art": "ar-hud"
  },
  {
    "id": "night-vision",
    "name": "Digital Night-Vision Monocular",
    "category": "Digital imaging & optical integration",
    "difficulty": "Advanced",
    "rank": 6,
    "tech": [
      "Near-infrared-sensitive camera",
      "IR illumination",
      "Display electronics",
      "Optical enclosure",
      "Portable power"
    ],
    "short": "A digital viewing system integrating near-infrared imaging, illumination and display.",
    "problem": "Low-light observation requires coordination between sensor sensitivity, illumination and the viewing interface. Camera noise, focus and enclosure light leakage can all affect the resulting image.",
    "solution": "The monocular combines a camera suited to near-infrared observation with an illumination source and a compact display. Optical and electronic components are integrated into a portable viewing assembly.",
    "body": "The system connects image acquisition, power delivery and display presentation. The project considers focus, mechanical alignment and the interaction between ambient conditions and active illumination.",
    "impact": "Demonstrates an integrated digital-imaging workflow for low-light observation experiments.",
    "validation": "No guaranteed viewing range, runtime or eye-safety classification is specified. IR illumination should be selected and used according to its rated operating limits.",
    "stage": "Completed",
    "status": "Completed by Mohammed Vashir.",
    "developedBy": "Mohammed Vashir",
    "featured": false,
    "art": "night-vision"
  }
];
export const projects: readonly Project[] = [...projectRecords].sort((a,b) => difficultyLevels.indexOf(a.difficulty)-difficultyLevels.indexOf(b.difficulty) || a.rank-b.rank);
export const featuredProjects: readonly Project[] = ['antenna','robot-arm','drone','sewersense'].map(id => { const item=projectRecords.find(project=>project.id===id); if(!item) throw new Error('Missing featured project'); return item; });
export function getProjectBySlug(slug: string): Project | undefined { return projects.find(project=>project.id===slug); }
