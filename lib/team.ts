/** Public profile details and portraits supplied by the founders. */
export const teamMembers = [
  {
    id: 'mohammed-vashir', name: 'Mohammed Vashir', role: 'Founder',
    focus: 'Embedded systems · Robotics · RF engineering',
    image: '/assets/team/mohammed-vashir.jpg', position: '54% 30%',
    headline: 'From an engineering question to a working system.',
    introduction: 'I bring electronics, software and mechanical design together to develop engineering projects across RF instrumentation, robotics, connected systems and experimental research.',
    biography: 'I am a B.Tech Electrical and Electronics Engineering student at B.S. Abdur Rahman Crescent Institute of Science and Technology. As the founder of 4TECH Engineering, I lead project development and technical direction, connecting requirements, circuit design, firmware and practical integration.',
    profile: '/founder', portfolio: '/portfolio', resume: '/resume',
    disciplines: ['Embedded control and sensor integration', 'RF measurement and instrumentation', 'Robotic mechanisms and computational kinematics', 'PCB development and system integration'],
    education: 'B.Tech Electrical and Electronics Engineering · Second-year undergraduate',
    institution: 'B.S. Abdur Rahman Crescent Institute of Science and Technology',
  },
  {
    id: 'sabeel-ahamed', name: 'Sabeel Ahamed', role: 'Co-founder',
    focus: 'Embedded hardware · Power electronics · Coordination',
    image: '/assets/team/sabeel-ahamed.jpg', position: '51% 24%',
    headline: 'Thoughtful hardware. Clear coordination.',
    introduction: 'I work with embedded hardware and power electronics, combining practical circuit experience with team leadership and technical communication.',
    biography: 'I am an Electrical and Electronics Engineering student at B.S.A. Crescent Institute of Science and Technology. My work includes ESP32 interfacing, inductive power transfer and a fingerprint attendance workflow. Alongside engineering, I serve as Joint Secretary of Crescent Energy Club and have coordinated the 17 Frames event.',
    profile: '/co-founder', portfolio: '/portfolio/sabeel-ahamed', resume: '/resume/sabeel-ahamed',
    disciplines: ['ESP32 and sensor communication', 'Inductive power transfer and circuit testing', 'Technical presentations and event delivery', 'Team coordination and student outreach'],
    education: 'B.Tech Electrical and Electronics Engineering · Pursuing',
    institution: 'B.S.A. Crescent Institute of Science and Technology',
  },
  {
    id: 'yashwanth-c', name: 'Yashwanth C', role: 'Co-founder',
    focus: 'Circuit design · Robotic kinematics · Project coordination',
    image: '/assets/team/yashwanth-c.jpg', position: '50% 50%',
    headline: 'Circuit-level thinking. A system-level perspective.',
    introduction: 'I connect circuit design, embedded hardware and computational robotics with practical project scoping, feasibility analysis and coordinated delivery.',
    biography: 'I am a B.Tech Electrical and Electronics Engineering student at B.S. Abdur Rahman Crescent Institute of Science and Technology. As a co-founder of 4TECH Engineering, I contribute to project scoping, prototype development, resource planning and budgeting. My technical interests include neural-network approaches to robotic kinematics, power conversion and resonant circuits. I also serve as Co-Treasurer and Event Coordinator of Crescent Energy Club.',
    profile: '/team/yashwanth-c', portfolio: '/portfolio/yashwanth-c', resume: '/resume/yashwanth-c',
    disciplines: ['Circuit design and analog hardware prototyping', 'Neural-network methods for robotic kinematics', 'Hardware-software validation and board-level testing', 'Project feasibility, budgeting and team coordination'],
    education: 'B.Tech Electrical and Electronics Engineering · July 2024–present',
    institution: 'B.S. Abdur Rahman Crescent Institute of Science and Technology',
  },
] as const;

export const yashwanthSkills = [
  { name: 'Programming & modelling', skills: ['C', 'C++', 'Python', 'MATLAB', 'Simulink'] },
  { name: 'Hardware & circuits', skills: ['Analog prototyping', 'Power conversion', 'Resonant circuits', 'Linear / SMPS topologies', 'Soldering'] },
  { name: 'Robotics & validation', skills: ['Neural-network kinematics', 'Inverse kinematics', 'Trajectory planning', 'Circuit debugging', 'Component verification'] },
  { name: 'Project delivery', skills: ['Feasibility analysis', 'Resource planning', 'Budgeting', 'Excel modelling', 'Technical presentations'] },
] as const;

export const yashwanthResearch = {
  title: 'Neural Network-Controlled 4-DOF Robotic Arm',
  role: 'Lead author & researcher',
  status: 'Research paper in progress',
  summary: 'Exploring artificial neural networks for inverse kinematics and trajectory planning in a four-degree-of-freedom robotic arm.',
  approach: 'The study uses Python and MATLAB to investigate joint-angle mapping and computational approaches to robotic motion. The technical paper and presentation are in development.',
  scope: 'Computational efficiency and end-effector precision are research objectives. No measured improvement, published paper or validated performance result is claimed here.',
  technologies: ['Python', 'MATLAB', 'Artificial neural networks', 'Inverse kinematics', '4-DOF robotics'],
} as const;

export const yashwanthCertifications = [
  'MATLAB Onramp — MathWorks Training Services, February 2026',
  'C Training & Certification — Spoken Tutorial, IIT Bombay / EduPyramids, November 2025',
  'Financial Accounting Fundamentals — University of Virginia, Coursera',
  'Profit & Loss Optimization — HP LIFE',
  'Basics of Finance & Break-Even Analysis — HP LIFE',
] as const;

export const sabeelSkills = [
  { name: 'Embedded hardware', skills: ['ESP32', 'R307S fingerprint sensor', 'SSD1306 OLED', 'UART', 'I²C'] },
  { name: 'Power electronics', skills: ['Inductive power transfer', 'Rectification', 'Capacitor filtering', 'Multimeter testing'] },
  { name: 'Software & interfaces', skills: ['Arduino IDE', 'Arduino C/C++ foundations', 'XAMPP', 'PHP', 'MySQL'] },
  { name: 'Communication & delivery', skills: ['Technical presentations', 'Event coordination', 'Team leadership', 'Promotional content'] },
] as const;

export const sabeelProjects = [
  {
    title: 'Wireless Power Transfer with Smart Monitoring', role: 'Batch lead · Four-member team', period: '2026 — present',
    summary: 'An inductive power-transfer prototype connecting coil design, receiver conditioning and embedded monitoring.',
    work: 'Led the transmitter and receiver development using coupled coils, a bridge rectifier and capacitor filtering. Rewinding the receiver coil to 25 turns produced a measured 5 V DC output.',
    next: 'The monitoring extension covers ESP32 voltage, current and temperature sensing with a Wi-Fi interface.',
    technologies: ['ESP32', 'Inductive coupling', 'Bridge rectifier', 'Filtering', 'Wi-Fi'],
  },
  {
    title: 'Smart Fingerprint Attendance System', role: 'Embedded hardware & application integration', period: 'November — December 2025',
    summary: 'A biometric attendance workflow combining a fingerprint sensor, local status display and database logging.',
    work: 'Interfaced the R307S module with ESP32 and confirmed sensor communication over UART. Worked on an SSD1306 OLED interface and attendance records through a XAMPP, PHP and MySQL backend.',
    next: 'Engineering work included wiring checks, serial troubleshooting, Wi-Fi connectivity and local server/database setup.',
    technologies: ['ESP32', 'R307S', 'SSD1306', 'UART / I²C', 'PHP / MySQL'],
  },
] as const;
