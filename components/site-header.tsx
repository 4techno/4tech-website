import Link from 'next/link';
import MobileNavigation from './mobile-navigation';

export default function SiteHeader() {
  return <header className="site-header container-shell">
    <Link href="/" aria-label="4tech home" className="wordmark"><span>4</span>tech.</Link>
    <nav aria-label="Main navigation" className="hidden items-center gap-9 text-[13px] text-zinc-400 md:flex">
      <Link href="/projects">Work</Link><Link href="/#expertise">Expertise</Link><Link href="/portfolio">About</Link>
      <Link href="/resume">Résumé <span aria-hidden>↗</span></Link>
    </nav>
    <Link href="/#contact" className="header-cta hidden sm:inline-flex">Let&apos;s build <span aria-hidden>↗</span></Link>
    <MobileNavigation />
  </header>;
}
