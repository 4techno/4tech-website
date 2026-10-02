import Link from 'next/link';
import { siteConfig } from '@/config';
import SocialLinks from './social-links';

export default function SiteFooter() {
  return (
    <footer className="ed-site-footer ed-shell">
      <div className="ed-footer-grid">
        <div className="ed-footer-brand">
          <Link className="ed-brand" href="/" aria-label="4TECH home">
            4TECH<span className="ed-brand-mark" aria-hidden="true">✳</span>
          </Link>
          <p>
            Independent engineering.<br />
            Built with curiosity.<br />
            Made for what comes next.
          </p>
          <span className="ed-footer-location">Tamil Nadu, India</span>
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/#services">Services</Link>
          <Link href="/founder">Founder (Mohammed Vashir)</Link>
          <Link href="/co-founder">Co-founder (Sabeel Ahamed)</Link>
          <Link href="/team">Leadership &amp; team</Link>
          <Link href="/projects">Selected work</Link>
          <Link href="/#contact">Contact</Link>
        </div>
        <div>
          <h3>More from 4TECH</h3>
          <Link href="/portfolio">Founder portfolio</Link>
          <Link href="/portfolio/sabeel-ahamed">Co-founder portfolio</Link>
          <Link href="/ideas">Project idea studio</Link>
          <Link href="/resume">Résumé</Link>
          <Link href="/account">Customer login</Link>
          <Link href="/owner">Owner dashboard</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
        <div>
          <h3>Let’s talk</h3>
          <a href={`mailto:${siteConfig.contacts.email}`}>Send an email</a>
          <a href={siteConfig.contacts.whatsapp} target="_blank" rel="noopener noreferrer">
            Start a conversation
          </a>
          <p className="ed-footer-note">
            For project enquiries,<br />
            collaborations and ideas.
          </p>
        </div>
      </div>
      <div className="ed-footer-bottom">
        <small>© {new Date().getFullYear()} 4TECH. All rights reserved.</small>
        <SocialLinks className="ed-socials" label="Connect with 4TECH" />
        <a href="#top" className="ed-back-top">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
