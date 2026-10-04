/** Licensed contextual photography. None of these photographs documents a 4TECH build. */
export type ProjectMedia = {
  readonly src: string;
  readonly alt: string;
  readonly credit: string;
  readonly sourceUrl: string;
  readonly license: string;
  readonly licenseUrl: string;
  readonly position?: string;
};

export const representativeImageNotice = 'Representative imagery — not this 4TECH build.';

export const projectMedia: Readonly<Record<string, ProjectMedia>> = {
  antenna: {
    src: '/assets/projects/antenna.webp',
    alt: 'NASA robotic scanner measuring an antenna mounted on an aircraft',
    credit: 'NASA / Lauren Hughes',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Testing_a_Conformal_Antenna_with_a_Robotic_Arm_(AFRC2019-0093-51).jpg',
    license: 'Public domain (US government work)',
    licenseUrl: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
    position: 'center',
  },
  'robot-arm': {
    src: '/assets/projects/robot-arm.webp',
    alt: 'Articulated industrial robot arm in a manufacturing facility',
    credit: 'Freek Wolsink / Pexels',
    sourceUrl: 'https://www.pexels.com/photo/industrial-robot-arm-in-a-manufacturing-facility-34207359/',
    license: 'Pexels License',
    licenseUrl: 'https://www.pexels.com/license/',
    position: '55% center',
  },
  drone: {
    src: '/assets/projects/drone.webp',
    alt: 'Disassembled drone electronics and optical modules on a workbench',
    credit: 'Dr Failov / Pexels',
    sourceUrl: 'https://www.pexels.com/photo/close-up-of-disassembled-drone-parts-on-table-32162329/',
    license: 'Pexels License',
    licenseUrl: 'https://www.pexels.com/license/',
    position: 'center',
  },
  sewersense: {
    src: '/assets/projects/sewersense.webp',
    alt: 'Worker wearing respiratory protective equipment in an industrial setting',
    credit: 'Tima Miroshnichenko / Pexels',
    sourceUrl: 'https://www.pexels.com/photo/grayscale-photography-of-a-person-wearing-gas-mask-6474204/',
    license: 'Pexels License',
    licenseUrl: 'https://www.pexels.com/license/',
    position: 'center 42%',
  },
  power: {
    src: '/assets/projects/power.webp',
    alt: 'Oak Ridge National Laboratory wireless vehicle charging demonstration',
    credit: 'Oak Ridge National Laboratory',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Wireless_power_transfer_demonstration_(26394736155).jpg',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    position: 'center 62%',
  },
  'passive-rf-drone': {
    src: '/assets/projects/passive-rf-drone.webp',
    alt: 'Electronics laboratory with signal measurement instruments',
    credit: 'khezez / Pexels',
    sourceUrl: 'https://www.pexels.com/photo/electronics-lab-with-oscilloscopes-on-desks-34007243/',
    license: 'Pexels License',
    licenseUrl: 'https://www.pexels.com/license/',
    position: 'center',
  },
  'rf-direction-finder': {
    src: '/assets/projects/rf-direction-finder.webp',
    alt: 'Civil Air Patrol member operating a handheld radio direction finder',
    credit: 'U.S. Air Force / Robert Wydock Jr.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:A_member_of_the_local_Civil_Air_Patrol_operates_a_radio_direction_finder_(Indiana).jpg',
    license: 'Public domain (US government work)',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    position: 'center 38%',
  },
  'rf-shielding': {
    src: '/assets/projects/rf-shielding.webp',
    alt: 'Historic Bureau of Standards Faraday cage containing radio instruments',
    credit: 'U.S. National Bureau of Standards',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Faraday_cage_at_US_Bureau_of_Standards_1925.jpg',
    license: 'Public domain (US government work)',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
  'vision-tracking': {
    src: '/assets/projects/vision-tracking.webp',
    alt: 'Close view of an indoor camera lens and infrared illumination',
    credit: 'Doğan Alpaslan Demir / Pexels',
    sourceUrl: 'https://www.pexels.com/photo/close-up-of-a-modern-security-camera-in-action-29280895/',
    license: 'Pexels License',
    licenseUrl: 'https://www.pexels.com/license/',
  },
  rescue: {
    src: '/assets/projects/rescue.webp',
    alt: 'Search-and-rescue test robot navigating a rubble field',
    credit: 'National Institute of Standards and Technology',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rescue_Robot_Tests_To_Offer_Responders_High-Tech_Help_(5940525341).jpg',
    license: 'Public domain (US government work)',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
  'wind-tunnel': {
    src: '/assets/projects/wind-tunnel.webp',
    alt: 'Aircraft model undergoing aerodynamic testing in a wind tunnel',
    credit: 'NASA / QinetiQ',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:NASA,_Boeing_Advance_Truss-Braced_Wing_Research_in_Test.jpg',
    license: 'Public domain',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
  'composite-drop-test': {
    src: '/assets/projects/composite-drop-test.webp',
    alt: 'Close detail of a carbon-fiber composite structure',
    credit: 'Quentin Martinez / Pexels',
    sourceUrl: 'https://www.pexels.com/photo/close-up-of-advanced-carbon-fiber-structure-30360253/',
    license: 'Pexels License',
    licenseUrl: 'https://www.pexels.com/license/',
  },
  'magnetic-anomaly': {
    src: '/assets/projects/magnetic-anomaly.webp',
    alt: 'Field technician using a dual-sensor magnetic gradiometer',
    credit: 'Tapatio / Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mag_survey_g858grad.JPG',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    position: 'center 45%',
  },
  'ar-hud': {
    src: '/assets/projects/ar-hud.webp',
    alt: 'Person wearing experimental smart glasses at an interactive exhibit',
    credit: 'Vika Glitter / Pexels',
    sourceUrl: 'https://www.pexels.com/photo/man-standing-by-modern-device-19793385/',
    license: 'Pexels License',
    licenseUrl: 'https://www.pexels.com/license/',
    position: '70% center',
  },
  'night-vision': {
    src: '/assets/projects/night-vision.webp',
    alt: 'Night-vision photograph of an operator wearing low-light optics',
    credit: 'U.S. Army / Staff Sgt. Whitney Hughes',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Night_ops_140621-A-TA175-001.jpg',
    license: 'Public domain (US government work)',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    position: 'center 40%',
  },
};

export function getProjectMedia(id: string): ProjectMedia | undefined {
  return projectMedia[id];
}
