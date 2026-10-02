'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { openAiCopilot } from '@/components/ai/ai-copilot';

const navigation = [
  { label: 'Services', href: '/#services' },
  { label: 'Project planner', href: '/#ai-copilot', action: 'copilot' },
  { label: 'Team', href: '/team' },
  { label: 'Work', href: '/projects' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Idea studio', href: '/ideas' },
];

export default function EditorialNavigation() {
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const releaseScroll = useCallback(() => {
    if (!document.querySelector('dialog[open]')) {
      document.documentElement.classList.remove('ed-dialog-open');
    }
  }, []);

  const closeMenu = useCallback(() => {
    menu.current?.close();
    setMenuOpen(false);
    releaseScroll();
  }, [releaseScroll]);

  useEffect(() => {
    const updateHeader = () => header.current?.classList.toggle('ed-scrolled', window.scrollY > 50);
    const desktop = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => {
      if (desktop.matches) closeMenu();
    };
    const dialog = menu.current;

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      window.removeEventListener('scroll', updateHeader);
      desktop.removeEventListener('change', closeOnDesktop);
      dialog?.close();
      releaseScroll();
    };
  }, [closeMenu, releaseScroll]);

  const openMenu = () => {
    if (!menu.current || menu.current.open) return;
    menu.current.showModal();
    document.documentElement.classList.add('ed-dialog-open');
    setMenuOpen(true);
  };

  return (
    <>
      <header ref={header} className="ed-site-header">
        <nav className="ed-navigation ed-shell" aria-label="Main navigation">
          <Link className="ed-brand" href="/" aria-label="4TECH home">
            4TECH<span className="ed-brand-mark" aria-hidden="true">✳</span>
          </Link>
          <div className="ed-desktop-links">
            {navigation.map((item) =>
              item.action === 'copilot' ? (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => openAiCopilot()}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    font: 'inherit',
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: 0
                  }}
                >
                  {item.label}
                  <span style={{ fontSize: '0.62rem', background: '#0a0a0a', color: '#f5f5f0', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>LOCAL</span>
                </button>
              ) : (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              )
            )}
          </div>
          <div className="ed-nav-actions">
            <Link className="ed-login-link" href="/account">
              Login
            </Link>
            <Link className="ed-button ed-button-small" href="/#contact">
              Start a project
            </Link>
            <button
              className="ed-menu-toggle"
              type="button"
              aria-label="Open navigation"
              aria-controls="editorial-mobile-menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onClick={openMenu}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>
      <dialog
        ref={menu}
        id="editorial-mobile-menu"
        className="ed-mobile-menu"
        aria-labelledby="editorial-menu-title"
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClose={() => {
          setMenuOpen(false);
          releaseScroll();
        }}
      >
        <div className="ed-menu-top">
          <span id="editorial-menu-title" className="ed-brand">
            4TECH
          </span>
          <button
            type="button"
            className="ed-close-button"
            onClick={closeMenu}
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {[
            ...navigation,
            { label: 'Résumé', href: '/resume' },
            { label: 'Contact', href: '/#contact' },
            { label: 'Customer login', href: '/account' },
          ].map((item, index) =>
            'action' in item && item.action === 'copilot' ? (
              <button
                key={item.href}
                type="button"
                onClick={() => {
                  closeMenu();
                  openAiCopilot();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '0.85rem 0',
                  textAlign: 'left',
                  font: 'inherit',
                  color: 'inherit',
                  cursor: 'pointer'
                }}
              >
                <small aria-hidden="true" style={{ width: '2.5rem', opacity: 0.6 }}>0{index + 1}</small>
                <span>{item.label}</span>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', background: '#0a0a0a', color: '#f5f5f0', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>LOCAL</span>
              </button>
            ) : (
              <Link key={item.href} href={item.href} onClick={closeMenu}>
                <small aria-hidden="true">0{index + 1}</small>
                {item.label}
              </Link>
            )
          )}
        </nav>
        <p className="ed-menu-location">Engineering, research and practical collaboration.</p>
      </dialog>
    </>
  );
}
