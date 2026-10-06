'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { openCommandPalette } from '@/components/command-palette';
import { siteConfig } from '@/config';

const MENU_ITEMS = [
  { label: 'The Philosophy', href: '/#philosophy', num: '01' },
  { label: 'Built to Explore', href: '/#projects', num: '02' },
  { label: 'Capabilities', href: '/#services', num: '03' },
  { label: 'Engineering Interface', href: '/#tools', num: '04' },
  { label: 'All Works & Case Studies', href: '/projects', num: '05' },
  { label: '4-Phase Roadmap', href: '/#roadmap', num: '06' },
  { label: 'Our Approach', href: '/#experience', num: '07' },
  { label: 'Team & Leadership', href: '/team', num: '08' },
  { label: 'Codex Pet / Planner', href: '/#ai-copilot', num: '09' },
  { label: 'Idea Studio', href: '/ideas', num: '10' },
  { label: 'Contact', href: '/#contact', num: '11' },
  { label: 'Client Space', href: '/account', num: '12' },
];

export default function StaggeredMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === 'Tab' && isOpen && panelRef.current) {
        const focusable = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>('a, button')].filter(
          (element): element is HTMLElement => Boolean(element)
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) panelRef.current?.querySelector<HTMLElement>('a')?.focus();
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div
      className={`staggered-menu-wrapper fixed-wrapper ${isOpen ? 'sm-open' : ''}`}
      data-position="left"
      style={{ ['--sm-accent' as string]: '#A02A22' }}
    >
      {/* Backdrop */}
      <div className="sm-backdrop" onClick={closeMenu} aria-hidden="true" />

      {/* Staggered Pre-layers */}
      <div className="sm-prelayers" aria-hidden="true">
        <div className="sm-prelayer" style={{ background: '#0D0D0F' }} />
        <div className="sm-prelayer" style={{ background: '#1E1E24' }} />
      </div>

      {/* Main Sticky Header */}
      <header
        className={`staggered-menu-header ${scrolled ? 'sm-scrolled' : ''}`}
        aria-label="Main navigation header"
      >
        {/* Brand Logo */}
        <div className="sm-logo">
          <Link
            href="/"
            className="text-white font-bold text-lg sm:text-xl tracking-tight flex items-center gap-1.5"
            style={{ fontFamily: 'var(--font-display)' }}
            onClick={closeMenu}
            aria-label="4TECH Engineering home"
          >
            <span style={{ color: 'var(--ember)' }}>4</span>TECH
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-[#D0CCC6] ml-0.5">
              ENGINEERING
            </span>
            <span style={{ color: 'var(--ember)' }}>.</span>
          </Link>
        </div>

        {/* Center / Action Pills */}
        <div className="hidden md:flex items-center gap-4">
          <div className="ed-studio-status-pill">
            <span className="ed-studio-pulse" aria-hidden="true" />
            <span style={{ fontSize: '11px', color: '#B5B5B5', fontWeight: 500 }}>Independent engineering studio</span>
          </div>

          <button
            type="button"
            className="ed-cmd-trigger"
            onClick={() => openCommandPalette()}
            aria-label="Open command palette (Ctrl+K or Cmd+K)"
            title="Quick search (Cmd+K)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span style={{ color: '#EAE6E1' }}>Search</span>
            <kbd className="ed-cmd-kbd">Ctrl K</kbd>
          </button>
        </div>

        {/* Right Toggle Button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium tracking-wider text-white border border-white/20 hover:border-[#C5221F] hover:text-[#E53935] hover:shadow-[0_0_16px_rgba(197,34,31,0.45)] transition-all bg-black/40 backdrop-blur-sm"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Dive In +
          </Link>

          <button
            ref={toggleRef}
            className="sm-toggle"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="staggered-menu-panel"
            type="button"
            onClick={toggleMenu}
            style={{ color: '#FFFFFF' }}
          >
            <span className="sm-toggle-textWrap" aria-hidden="true">
              <span className="sm-toggle-textInner">
                <span className="sm-toggle-line">Menu</span>
                <span className="sm-toggle-line">Close</span>
              </span>
            </span>
            <span className="sm-icon" aria-hidden="true">
              <span className="sm-icon-line" />
              <span className="sm-icon-line sm-icon-line-v" />
            </span>
          </button>
        </div>
      </header>

      {/* Staggered Navigation Panel */}
      <aside
        ref={panelRef}
        id="staggered-menu-panel"
        className="staggered-menu-panel"
        aria-hidden={!isOpen}
        inert={!isOpen}
        role="dialog"
        aria-modal={isOpen}
        aria-label="4TECH navigation"
      >
        <div className="sm-panel-inner">
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-mono tracking-widest text-[#B5B5B5] uppercase">Navigation Index</span>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                openCommandPalette();
              }}
              className="text-xs font-mono text-ember flex items-center gap-1.5"
            >
              <span>Search</span>
            </button>
          </div>

          <ul className="sm-panel-list" role="list">
            {MENU_ITEMS.map((item) => (
              <li key={item.href} className="sm-panel-itemWrap">
                <Link
                  className="sm-panel-item"
                  href={item.href}
                  onClick={closeMenu}
                  data-index={item.num}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    padding: '16px 0',
                    color: '#EAE6E1',
                    fontSize: '18px',
                    fontWeight: 600,
                    letterSpacing: '-0.3px',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  <span className="sm-panel-itemLabel">{item.label}</span>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ember)', opacity: 0.8 }}>
                    {item.num}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Socials */}
          <div className="sm-socials" aria-label="Social links">
            <h3 className="sm-socials-title text-xs font-mono uppercase tracking-widest text-ash mb-3">
              Direct Channels
            </h3>
            <ul className="sm-socials-list flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono" role="list">
              <li className="sm-socials-item">
                <a
                  href={siteConfig.contacts.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm-socials-link text-white hover:text-ember transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="sm-socials-item">
                <a
                  href={`mailto:${siteConfig.contacts.email}`}
                  className="sm-socials-link text-white hover:text-ember transition-colors"
                >
                  Email
                </a>
              </li>
              <li className="sm-socials-item">
                <a
                  href={siteConfig.socials.find(s => s.name === 'GitHub')?.url || 'https://github.com/4techno'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm-socials-link text-white hover:text-ember transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li className="sm-socials-item">
                <a
                  href={siteConfig.socials.find(s => s.name === 'LinkedIn')?.url || 'https://www.linkedin.com/in/mohammed-vashir-793b89378/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm-socials-link text-white hover:text-ember transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
