/** Public, owner-maintained content. Edit source and redeploy; never put secrets here. */
export const siteConfig = Object.freeze({
  name: '4tech',
  description: '4TECH engineering across robotics, embedded systems, RF and automation. Explore completed projects and meet founder Mohammed Vashir and co-founder Sabeel Ahamed.',
  founder: Object.freeze({
    name: 'Mohammed Vashir',
    // Public portrait explicitly selected by the owner. Private uploads remain separate.
    image: '/assets/team/mohammed-vashir.jpg',
  }),
  contacts: Object.freeze({
    email: 'mohammedvashir75@gmail.com', whatsapp: 'https://wa.me/919360108408',
    phone: '+91 93601 08408', location: 'Tamil Nadu, India',
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
