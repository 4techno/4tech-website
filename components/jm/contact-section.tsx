'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/config';
import { createPlannerBrief, draftFromContact, savePlannerBrief } from '@/lib/planner-brief';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    domain: 'Embedded systems',
    message: '',
    timeline: '',
  });

  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const targets = sectionRef.current?.querySelectorAll('.contact-animate');
      if (targets && targets.length) {
        gsap.fromTo(
          targets,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    try {
      const draft = createPlannerBrief(draftFromContact(formData));
      if (!savePlannerBrief(draft)) {
        setStatusMessage('Your browser could not keep this draft. Open the customer area and enter your project details there.');
        return;
      }
      setStatusMessage('');
      router.push('/account#request-heading');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Review the project details and try again.');
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-16 sm:py-24 md:py-36 overflow-hidden bg-black text-white"
      style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
    >
      {/* Top Divider */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden="true"
      />

      {/* Atmospheric Ember Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[800px] h-[350px] sm:h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(197, 34, 31, 0.22) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Heading */}
        <div className="mb-12 sm:mb-16 md:mb-20 text-center contact-animate">
          <span className="text-ember text-xs font-semibold tracking-[0.14em] uppercase block mb-3 font-mono">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.15] tracking-tight max-w-3xl mx-auto">
            Let&apos;s Create Something Extraordinary
          </h2>
          <p className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg text-ash max-w-xl mx-auto leading-relaxed font-normal">
            Have a project in mind or want to collaborate? Outline the scope, then review and submit it from your customer account.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          {/* Left Card: Contact Details */}
          <div className="contact-animate glass-card p-6 sm:p-10 flex flex-col justify-between lg:col-span-5 rounded-2xl bg-white/[0.03] border border-white/15 backdrop-blur-2xl">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-6">
                Direct Studio Channels
              </h3>
              <div className="space-y-5">
                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <span className="w-9 h-9 rounded-full bg-ember/10 border border-ember/20 flex items-center justify-center text-ember shrink-0">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-ash uppercase tracking-wider mb-0.5 font-semibold font-mono">
                      Email
                    </p>
                    <a
                      href={`mailto:${siteConfig.contacts.email}?subject=Project%20Enquiry%20%E2%80%94%204TECH`}
                      className="text-sm text-white hover:text-ember transition-colors font-medium break-all"
                    >
                      {siteConfig.contacts.email}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <span className="w-9 h-9 rounded-full bg-ember/10 border border-ember/20 flex items-center justify-center text-ember shrink-0">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[10px] text-ash uppercase tracking-wider mb-0.5 font-semibold font-mono">
                      Location
                    </p>
                    <p className="text-sm text-white font-medium">Tamil Nadu, India</p>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-start gap-3.5">
                  <span className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="absolute inset-1 rounded-full border border-emerald-400/50 animate-ping" />
                  </span>
                  <div>
                    <p className="text-[10px] text-ash uppercase tracking-wider mb-0.5 font-semibold font-mono">
                      Availability
                    </p>
                    <p className="text-sm text-emerald-400 font-medium">Project enquiries welcome</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-[10px] text-ash uppercase tracking-wider mb-3.5 font-semibold font-mono">
                Connect
              </p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href={siteConfig.contacts.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-ember hover:bg-white/10 transition-all duration-300"
                  title="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>
                <a
                  href={siteConfig.socials.find((s) => s.name === 'GitHub')?.url || 'https://github.com/4techno'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-ember hover:bg-white/10 transition-all duration-300"
                  title="GitHub"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
                  </svg>
                </a>
                <a
                  href={
                    siteConfig.socials.find((s) => s.name === 'LinkedIn')?.url ||
                    'https://www.linkedin.com/in/mohammed-vashir-793b89378/'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-ember hover:bg-white/10 transition-all duration-300"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Card: Interactive Form */}
          <div className="contact-animate glass-card p-6 sm:p-10 lg:col-span-7 rounded-2xl bg-white/[0.03] border border-white/15 backdrop-blur-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Status Banner */}
              {statusMessage && (
                <div
                  role="alert"
                  className="p-4 rounded-xl text-xs font-mono leading-relaxed bg-rose-500/10 border border-rose-500/30 text-rose-300"
                >
                  {statusMessage}
                </div>
              )}

              {/* Project title */}
              <div>
                <label
                  htmlFor="contact-title"
                  className="text-xs text-ash uppercase tracking-wider block mb-1.5 font-semibold font-mono"
                >
                  Project title
                </label>
                <input
                  id="contact-title"
                  type="text"
                  required
                  minLength={3}
                  maxLength={120}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="A few words about your idea"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-base text-white placeholder:text-zinc-600 focus:outline-none focus:border-ember transition-colors"
                />
              </div>

              {/* Timeline */}
              <div>
                <label
                  htmlFor="contact-timeline"
                  className="text-xs text-ash uppercase tracking-wider block mb-1.5 font-semibold font-mono"
                >
                  Timeline <span className="normal-case tracking-normal font-normal">(optional)</span>
                </label>
                <input
                  id="contact-timeline"
                  type="text"
                  maxLength={100}
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  placeholder="Flexible, or an approximate date"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-base text-white placeholder:text-zinc-600 focus:outline-none focus:border-ember transition-colors"
                />
              </div>

              {/* Domain Select */}
              <div>
                <label
                  htmlFor="contact-domain"
                  className="text-xs text-ash uppercase tracking-wider block mb-1.5 font-semibold font-mono"
                >
                  Project Domain
                </label>
                <select
                  id="contact-domain"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full bg-[#18181b] border border-white/15 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-ember transition-colors"
                >
                  <option value="Embedded systems">Embedded systems &amp; firmware</option>
                  <option value="Robotics">Robotics &amp; mechanisms</option>
                  <option value="RF & instrumentation">RF &amp; instrumentation</option>
                  <option value="Automation & IoT">Automation &amp; connected systems</option>
                  <option value="Computer vision">Computer vision</option>
                  <option value="Experimental engineering">Experimental engineering</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="text-xs text-ash uppercase tracking-wider block mb-1.5 font-semibold font-mono"
                >
                  Engineering Scope / Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the functional requirements, constraints, or timeline..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-base text-white placeholder:text-zinc-600 focus:outline-none focus:border-ember transition-colors resize-none"
                />
              </div>

              <p className="text-xs leading-relaxed text-ash">This prepares an editable draft in this browser tab. Sign in or create an account to submit it securely. Your message is not sent until you select “Submit your request” in the customer area. <Link href="/privacy" className="underline underline-offset-4 hover:text-white">Privacy details</Link></p>

              {/* Review Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-full font-semibold text-sm tracking-wider uppercase text-white bg-ember hover:bg-ember-bright transition-all duration-300 shadow-[0_0_25px_rgba(160,42,34,0.4)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Review secure enquiry</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M14 2L7 9M14 2L10 14L7 9M14 2L2 6L7 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
