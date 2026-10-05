'use client';

import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config';

export default function JmFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black text-[#B5B5B5] z-10 border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="text-white font-bold text-2xl tracking-tight inline-flex items-center gap-1.5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="text-ember">4</span>TECH
              <span className="text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase text-[#D0CCC6] ml-1">
                ENGINEERING
              </span>
              <span className="text-ember">.</span>
            </Link>
            <p className="text-xs text-ash max-w-sm leading-relaxed">
              Human curiosity meets engineered possibility. An independent practice connecting embedded systems, robotics and RF instrumentation.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-ember" aria-hidden="true" />
              <span className="text-[11px] font-mono text-ash">Project enquiries welcome</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Index
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link href="/#projects" className="hover:text-ember transition-colors">Selected Projects</Link>
              </li>
              <li>
                <Link href="/#philosophy" className="hover:text-ember transition-colors">The Philosophy</Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-ember transition-colors">Capabilities</Link>
              </li>
              <li>
                <Link href="/#ai-copilot" className="hover:text-ember transition-colors">Project Planner</Link>
              </li>
              <li>
                <Link href="/#roadmap" className="hover:text-ember transition-colors">4-Phase Delivery</Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-ember transition-colors">Leadership &amp; Team</Link>
              </li>
            </ul>
          </div>

          {/* Client & Lab Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Workspaces
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link href="/account" className="hover:text-ember transition-colors">Client Space &amp; Inquiries</Link>
              </li>
              <li>
                <Link href="/ideas" className="hover:text-ember transition-colors">Idea Scoping Studio</Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-ember transition-colors">Technical Résumé</Link>
              </li>
              <li>
                <Link href="/owner" className="hover:text-ember transition-colors">Founder Telemetry (Owner)</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-ember transition-colors">Privacy &amp; Data Rights</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <p className="text-ash">
            © {new Date().getFullYear()} 4TECH · Mohammed Vashir, Sabeel Ahamed &amp; Yashwanth C. Engineering with purpose.
          </p>

          <button
            onClick={scrollToTop}
            className="text-ash hover:text-white transition-colors flex items-center gap-1.5 font-medium group cursor-pointer py-1"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <span className="transition-transform duration-300 group-hover:-translate-y-0.5 text-ember font-bold">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
