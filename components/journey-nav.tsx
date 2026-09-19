import Link from 'next/link';
export default function JourneyNav({ current }: { current: 'website' | 'portfolio' | 'resume' }) {
  return <nav aria-label="Website, portfolio and résumé" className="journey-nav">
    {[{ id: 'website', label: '4tech website', href: '/' }, { id: 'portfolio', label: 'My portfolio', href: '/portfolio' }, { id: 'resume', label: 'Résumé', href: '/resume' }].map((item, i) => <span key={item.id}>{i > 0 && <b aria-hidden>→</b>}<Link href={item.href} aria-current={current === item.id ? 'page' : undefined}>{item.label}</Link></span>)}
  </nav>;
}
