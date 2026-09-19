import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config";

export const metadata: Metadata = {
  title: "Customer privacy",
  description: "How 4tech handles customer accounts, project enquiries and your information.",
  alternates: { canonical: '/privacy' },
};

const sections = [
  {
    title: "What the customer area stores",
    text: "When you create an account, Firebase Authentication processes your email address, account identifier and sign-in credentials. If you choose Google sign-in, Google shares the profile information you authorize. 4tech does not receive your Google password. Enquiries store the title, category, timeline, description, submission time and any status updates shared by 4tech.",
  },
  {
    title: "Why we use it",
    text: "We use these details to provide your account, review your enquiry and communicate about a potential project. Sending an enquiry does not create a paid order or guarantee a quote, delivery date or result.",
  },
  {
    title: "Who can access it",
    text: "You can view your own enquiries after signing in. 4tech’s authorized project owner can review enquiries and update their status. Google Firebase provides authentication and database hosting. Public project pages and the founder’s portfolio do not require an account.",
  },
  {
    title: "Storage on your device",
    text: "The authentication service stores session information in your browser so you can stay signed in. Use Sign out on shared devices. The customer area does not include advertising or analytics trackers.",
  },
  {
    title: "Your choices",
    text: "Contact 4tech to request correction or deletion of your account and enquiry data. These requests are handled manually, and account ownership must be verified before changes. Customers cannot change a request’s status or delete submissions through the customer area. Do not include passwords, payment details, identification documents or sensitive personal information in an enquiry.",
  },
];

export default function PrivacyPage() {
  return <main id="main" className="container-shell pb-24 pt-32 sm:pb-32 sm:pt-40">
    <div className="mx-auto max-w-3xl"><Link href="/" className="text-sm text-neutral-400 transition-colors hover:text-white"><span aria-hidden="true">← </span>Back to 4tech</Link><p className="section-kicker mb-5 mt-10">A clear approach to your information</p><h1 className="text-4xl font-medium tracking-tight sm:text-6xl">Customer privacy.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-neutral-400">The information behind your account, and the choices you have.</p><p className="mt-4 text-xs text-neutral-500">Last updated 18 September 2026</p>
      <div className="mt-12 space-y-9 border-t border-white/10 pt-10">{sections.map((section, index) => <section key={section.title} aria-labelledby={`privacy-${index}`}><h2 id={`privacy-${index}`} className="text-xl font-medium tracking-tight">{section.title}</h2><p className="mt-3 text-base leading-8 text-neutral-400">{section.text}</p></section>)}
        <section aria-labelledby="privacy-contact"><h2 id="privacy-contact" className="text-xl font-medium tracking-tight">Contact</h2><p className="mt-3 text-base leading-8 text-neutral-400">Mohammed Vashir · 4tech<br/>{siteConfig.contacts.location}</p><div className="mt-5 flex flex-wrap gap-3"><a className="button-secondary" href={`mailto:${siteConfig.contacts.email}`}>Email 4tech <span aria-hidden="true">↗</span></a><a className="button-secondary" href={siteConfig.contacts.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp <span aria-hidden="true">↗</span></a></div></section>
      </div>
    </div>
  </main>;
}
