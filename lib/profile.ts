// Profile details supplied by the owner and preserved from the existing résumé.
export const skillGroups = [
  { name: 'Embedded systems', description: 'Bringing sensors, code and hardware together.', skills: ['ESP32', 'Arduino Nano', 'Sensor integration', 'I²C · SPI · UART', 'Motor & servo control'], project: 'antenna' },
  { name: 'Code & computation', description: 'Turning an engineering question into a working model.', skills: ['C', 'Arduino C++', 'Python', 'MATLAB', 'Numerical computation'], project: 'robot-arm' },
  { name: 'Design & robotics', description: 'Exploring mechanisms, motion and electronic systems.', skills: ['SOLIDWORKS', 'KiCad', 'Mechanical CAD', 'Inverse kinematics', 'Neural-network modelling'], project: 'robot-arm' },
] as const;
export const education = {
  degree: 'B.Tech — Electrical and Electronics Engineering',
  institution: 'B.S. Abdur Rahman Crescent Institute of Science and Technology',
  location: 'Vandalur, Tamil Nadu',
  stage: 'Second-year undergraduate',
};
export const certifications = [
  { title: 'MATLAB Onramp', provider: 'MathWorks', date: 'February 2026' },
  { title: 'C Training', provider: 'EduPyramids, SINE, IIT Bombay', date: 'November 2025 · Score: 82.5%' },
];
export const resumeProjects = [
  { id: 'antenna', name: 'Automated Antenna Measurement System', stage: 'Completed', text: 'Developed firmware and wiring for ESP32-based RF acquisition and motorised scanning using AD8317, NEMA17/A4988 and nRF24L01+. Worked on OLED output, live visualisation and CSV data export.' },
  { id: 'sewersense', name: 'SewerSense IoT Monitoring', stage: 'Completed', text: 'Developed ESP32 firmware and a web dashboard for gas, temperature, humidity and pulse-sensor data. Worked through sensor detection, live data updates and alarm-control issues during hardware testing.' },
  { id: 'drone', name: 'ESP32 Drone Platform', stage: 'Completed', text: 'Developed an ESP32-S3 flight-controller PCB in KiCad for a compact 1S brushed-motor drone. Engineering work covers motor-drive stages, power distribution, USB connectivity and sensor integration. The project combines embedded hardware architecture and compact PCB design.' },
  { id: 'robot-arm', name: 'Robotic Arm Design and Kinematics', stage: 'Completed', text: 'Created a 5-DOF robotic-arm assembly in SOLIDWORKS. Developed analytical inverse-kinematics work for separate 3-DOF and 4-DOF models, explored neural-network approximation, and investigated trajectory-tracking approaches.' },
];
