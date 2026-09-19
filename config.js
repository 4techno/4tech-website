/** Public, owner-maintained content. Edit source and redeploy; never put secrets here. */
export const siteConfig = Object.freeze({
  name: '4tech',
  description: 'Independent engineering R&D across robotics, embedded systems, RF and automation. Project development and practical training with Mohammed Vashir in Kalpakkam, India.',
  founder: Object.freeze({
    name: 'Mohammed Vashir',
    image: '/assets/mohammed-vashir.jpg',
    imageAlt: 'Mohammed Vashir at Crescent’s Mega Demo Day',
    imagePosition: 'center 28%',
  }),
  contacts: Object.freeze({
    email: 'mohammedvashir75@gmail.com', whatsapp: 'https://wa.me/919360108408',
    phone: '+91 93601 08408', location: 'Kalpakkam, Tamil Nadu 603102 · India',
  }),
  socials: Object.freeze([
    { name: 'GitHub', url: 'https://github.com/4techno' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/mohammed-vashir-793b89378/' },
    { name: 'Instagram', url: 'https://www.instagram.com/_.herculex._/' },
    { name: 'Reddit', url: 'https://www.reddit.com/user/mohammedvashir75/' },
  ]),
});

/** Retired URLs lead visitors to the current engineering collection. */
export const retiredProjectIds = Object.freeze(['tesla', 'rectifier', 'matlab', 'wireless', 'wireless-transmitter', 'emo-bot', 'emf', 'airtouch', 'analytical', 'neural', 'hybrid']);

/** @param {string} [path] */
export function siteUrl(path = '') {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');
  const url = new URL(origin);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('SITE_URL must use https or http');
  return new URL(path || '/', url.origin).toString();
}
