'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  return <div className="md:hidden">
    <button className="menu-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? 'Close −' : 'Menu +'}</button>
    <nav hidden={!open} id="mobile-nav" aria-label="Mobile navigation" className="mobile-nav" onClick={() => setOpen(false)}>
      <Link href="/projects">Work <span>01</span></Link><Link href="/#expertise">Expertise <span>02</span></Link><Link href="/portfolio">About <span>03</span></Link>
      <Link href="/resume">Résumé ↗</Link><Link href="/account">Customer area ↗</Link><Link href="/#contact">Let&apos;s build ↗</Link>
    </nav>
  </div>;
}
