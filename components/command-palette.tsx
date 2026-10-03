'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/config';
import { openAiCopilot } from '@/components/ai/ai-copilot';
import styles from './command-palette.module.css';

export const OPEN_COMMAND_PALETTE_EVENT = '4tech:open-command-palette';

export function openCommandPalette() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE_EVENT));
  }
}

interface CommandItem {
  id: string;
  category: 'Projects' | 'Capabilities' | 'Studio Navigation' | 'Quick Actions';
  title: string;
  subtitle: string;
  badge?: string;
  icon: React.ReactNode;
  href?: string;
  action?: () => void;
}

const COMMAND_ITEMS: CommandItem[] = [
  // Quick Actions
  {
    id: 'action-contact',
    category: 'Quick Actions',
    title: 'Start a Project Enquiry',
    subtitle: 'Direct brief submission for custom engineering work',
    badge: 'Enquiry',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    href: '/#contact',
  },
  {
    id: 'action-copilot',
    category: 'Quick Actions',
    title: 'Open AI Project Planner',
    subtitle: 'Local browser-based engineering scope estimator',
    badge: 'AI Planner',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    action: () => openAiCopilot(),
  },
  {
    id: 'action-whatsapp',
    category: 'Quick Actions',
    title: 'Chat on WhatsApp with Founder',
    subtitle: 'Fast technical conversation with Mohammed Vashir',
    badge: 'WhatsApp',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    ),
    action: () => {
      window.open(siteConfig.contacts.whatsapp, '_blank', 'noopener,noreferrer');
    },
  },
  {
    id: 'action-email',
    category: 'Quick Actions',
    title: 'Email Studio (mohammedvashir75@gmail.com)',
    subtitle: 'Send technical briefs and RFP documentation',
    badge: 'Email',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    action: () => {
      window.location.href = `mailto:${siteConfig.contacts.email}?subject=Project%20Enquiry%20%E2%80%94%204TECH`;
    },
  },

  // Projects
  {
    id: 'project-antenna',
    category: 'Projects',
    title: 'Antenna Radiation Pattern Measurement',
    subtitle: 'Automated angular scanning, AD8317 RF detector, ESP32',
    badge: 'RF / SMT',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" />
        <path d="M17 5H7" />
        <path d="M4.93 10.93a10 10 0 0 1 14.14 0" />
        <path d="M7.76 13.76a6 6 0 0 1 8.48 0" />
      </svg>
    ),
    href: '/projects/antenna',
  },
  {
    id: 'project-robot-arm',
    category: 'Projects',
    title: 'Advanced Robotic Arm Systems',
    subtitle: 'Inverse kinematics, SOLIDWORKS CAD, neural modeling',
    badge: 'Robotics',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M3 12h6" />
        <path d="M15 12h6" />
        <path d="M12 3v6" />
        <path d="M12 15v6" />
      </svg>
    ),
    href: '/projects/robot-arm',
  },
  {
    id: 'project-passive-rf-drone',
    category: 'Projects',
    title: 'Passive RF Drone Detection System',
    subtitle: 'Direction finding, signal surveillance & zero-emission tracking',
    badge: 'Defense RF',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="3" y1="12" x2="21" y2="12" />
      </svg>
    ),
    href: '/projects/passive-rf-drone',
  },
  {
    id: 'project-rf-direction-finder',
    category: 'Projects',
    title: 'Portable RF Direction Finder',
    subtitle: 'Compact field-deployable antenna array & angle calculation',
    badge: 'Instrumentation',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    href: '/projects/rf-direction-finder',
  },
  {
    id: 'project-resonant-wpt',
    category: 'Projects',
    title: 'Resonant Wireless Power Transfer',
    subtitle: 'Magnetic resonance coupling, coil geometry & power efficiency',
    badge: 'Power Elect.',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="6" width="18" height="12" rx="2" />
        <line x1="23" y1="13" x2="23" y2="11" />
      </svg>
    ),
    href: '/projects/resonant-wpt',
  },
  {
    id: 'project-all',
    category: 'Projects',
    title: 'Explore engineering projects',
    subtitle: 'Completed robotics, RF systems, and embedded builds',
    badge: 'Portfolio',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    href: '/projects',
  },

  // Capabilities & Services
  {
    id: 'cap-roadmap',
    category: 'Capabilities',
    title: '4-Phase Commercial Engineering Delivery Roadmap',
    subtitle: 'From Phase 01 Feasibility to Phase 04 Firmware & IP Handover',
    badge: 'Framework',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    href: '/#roadmap',
  },
  {
    id: 'cap-embedded',
    category: 'Capabilities',
    title: 'Embedded Systems & Firmware',
    subtitle: 'ESP32, STM32, sensor buses (I2C/SPI/UART/CAN), KiCad PCB',
    badge: 'Service',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    href: '/#services',
  },
  {
    id: 'cap-robotics',
    category: 'Capabilities',
    title: 'Robotics & Mechanisms',
    subtitle: 'Actuation kinematics, mechanical CAD design, motor control',
    badge: 'Service',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    href: '/#services',
  },
  {
    id: 'cap-rf',
    category: 'Capabilities',
    title: 'RF & Instrumentation',
    subtitle: 'Antenna characterization, RF power detection, field telemetry',
    badge: 'Service',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" />
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
      </svg>
    ),
    href: '/#services',
  },
  {
    id: 'cap-connected',
    category: 'Capabilities',
    title: 'Connected IoT Systems',
    subtitle: 'Microcontroller gateways, real-time dashboards & cloud state',
    badge: 'Service',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    href: '/#services',
  },

  // Studio Navigation
  {
    id: 'nav-founder',
    category: 'Studio Navigation',
    title: 'Founder Profile — Mohammed Vashir',
    subtitle: 'Lead developer, systems architecture & embedded engineering',
    badge: 'Founder',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    href: '/founder',
  },
  {
    id: 'nav-co-founder',
    category: 'Studio Navigation',
    title: 'Co-Founder Profile — Sabeel Ahamed',
    subtitle: 'Engineering operations, prototyping & collaborative leadership',
    badge: 'Co-Founder',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    href: '/co-founder',
  },
  {
    id: 'nav-team',
    category: 'Studio Navigation',
    title: 'Leadership & Team Overview',
    subtitle: 'Meet the engineers shaping 4TECH tomorrow',
    badge: 'Team',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    href: '/team',
  },
  {
    id: 'nav-ideas',
    category: 'Studio Navigation',
    title: 'Project Idea Studio',
    subtitle: 'Interactive hardware scoping and specification generator',
    badge: 'Interactive',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="9" y1="18" x2="15" y2="18" />
        <line x1="10" y1="22" x2="14" y2="22" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
      </svg>
    ),
    href: '/ideas',
  },
  {
    id: 'nav-account',
    category: 'Studio Navigation',
    title: 'Customer Space & Project Orders',
    subtitle: 'Enquiry tracking, milestone status and quotation workspace',
    badge: 'Client Portal',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    href: '/account',
  },
  {
    id: 'nav-owner',
    category: 'Studio Navigation',
    title: 'Founder Command Centre (Owner Only)',
    subtitle: 'Restricted telemetry, customer login audit & visitor graphs',
    badge: 'Restricted',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    href: '/owner',
  },
  {
    id: 'nav-resume',
    category: 'Studio Navigation',
    title: 'Technical Résumé & Verification',
    subtitle: 'Official engineering qualifications and publication records',
    badge: 'Document',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    href: '/resume',
  },
];

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMAND_ITEMS;
    return COMMAND_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q))
    );
  }, [query]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, handleCustomOpen);
    };
  }, [open]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const executeItem = (item: CommandItem) => {
    setOpen(false);
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filteredItems.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(filteredItems.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        executeItem(filteredItems[selectedIndex]);
      }
    }
  };

  // Auto-scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-label="4TECH Global Command Palette"
    >
      <div className={styles.palette}>
        {/* Search Input Bar */}
        <div className={styles.searchHeader}>
          <span className={styles.searchIcon} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search projects, capabilities, team, actions... (or type 'owner', 'ai')"
            className={styles.input}
          />
          <span className={styles.escKey}>ESC</span>
        </div>

        {/* Results List */}
        <ul ref={listRef} className={styles.resultList} role="listbox">
          {filteredItems.length === 0 ? (
            <li className={styles.emptyState}>No matching engineering records found.</li>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  className={`${styles.item} ${isSelected ? styles.itemActive : ''}`}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className={styles.itemMain}>
                    <span className={styles.itemIcon}>{item.icon}</span>
                    <div className={styles.itemText}>
                      <span className={styles.itemTitle}>{item.title}</span>
                      <span className={styles.itemSubtitle}>{item.subtitle}</span>
                    </div>
                  </div>
                  {item.badge && <span className={styles.itemBadge}>{item.badge}</span>}
                </li>
              );
            })
          )}
        </ul>

        {/* Footer Hints */}
        <div className={styles.footer}>
          <div className={styles.footerHints}>
            <span className={styles.footerHint}>
              <span className={styles.footerKbd}>↑↓</span> navigate
            </span>
            <span className={styles.footerHint}>
              <span className={styles.footerKbd}>↵</span> select
            </span>
            <span className={styles.footerHint}>
              <span className={styles.footerKbd}>esc</span> close
            </span>
          </div>
          <span>4TECH Studio Index</span>
        </div>
      </div>
    </div>
  );
}
