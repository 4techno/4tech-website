import Link from 'next/link';
import SocialLinks from './social-links';
export default function SiteFooter() {
  return <footer className="site-footer container-shell">
    <div className="footer-main"><Link href="/" className="wordmark"><span>4</span>tech.</Link><p>From first principles<br/>to working prototypes.</p>
      <SocialLinks className="max-sm:w-full" label="Connect with 4tech"/>
    </div><div className="footer-bottom"><span>© {new Date().getFullYear()} 4tech</span><div><Link href="/portfolio">My portfolio</Link><Link href="/resume">Résumé</Link><Link href="/account">Customer area ↗</Link><Link href="/privacy">Privacy</Link><a href="#top">Back to top ↑</a></div></div>
  </footer>;
}
