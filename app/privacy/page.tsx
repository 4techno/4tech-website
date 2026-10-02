import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config";

export const metadata: Metadata = {
  title: "Customer privacy",
  description: "How 4tech handles customer accounts, project enquiries and your information.",
  alternates: { canonical: '/privacy' },
};

const sections = [
  { title: "Optional visitor analytics", text: "When enabled, this feature asks before recording public page paths, coarse device and viewport categories, and the time between recorded events. A separate choice allows a verified account name, email and browser-observed sign-in event to appear in the founder workspace. Anonymous visitors remain unnamed. Sessions represent browser tabs, not unique people, and sign-in records are not a complete authentication audit. The analytics records do not contain exact screen dimensions, device fingerprints, query strings, form entries or browsing history outside 4TECH. Google Firebase and App Check process service requests according to their own policies; those providers may receive normal network information. Analytics records are scheduled for deletion after 30 days; database expiry cleanup can take additional time. You can withdraw future collection using Privacy choices." },
  { title: "Project idea studio", text: "The local planning worksheet runs in your browser and sends no requirements to an AI provider. When the AI connection is enabled, your selected domain, budget, experience, timeline and typed requirements are sent through our protected endpoint to Cloudflare Workers AI. Your Firebase account token is used for access checks and is not sent to the model. A hashed account identifier is used for daily rate limits. We do not store prompts or generated ideas in our application database. Provider processing follows Cloudflare policies. Avoid confidential designs and personal information. Suggestions are starting points for engineering review, not verified designs or quotations." },

  {
    title: "What the customer area stores",
    text: "When you create an account, Firebase Authentication processes your email address, account identifier and sign-in credentials. If you choose Google sign-in, Google shares the profile information you authorize. 4tech does not receive your Google password. The workspace stores enquiries, project updates, quotations, your quotation responses and notification preferences. When file storage is enabled, it also stores the files you choose to attach and their names, types, sizes and upload times.",
  },
  {
    title: "Why we use it",
    text: "We use these details to provide your account, review your enquiry and communicate about a potential project. Sending an enquiry does not create a paid order or guarantee a quote, delivery date or result.",
  },
  {
    title: "Who can access it",
    text: "You and 4tech’s authorized owner can access your project workspace and its files. Other customers cannot access them. Google Firebase provides authentication, database and configured file hosting. The owner’s personal and business photo libraries are private and are not automatically published on the website. Public project pages and the founder’s portfolio do not require an account.",
  },
  {
    title: "Notifications and email",
    text: "Project updates and quotations can create notifications inside your customer area. Automatic email updates are optional and require you to enable them after the email service is activated. You can turn them off from notification settings. Service emails such as verification and password reset are requested separately. Any configured email provider processes the recipient address and notification needed to deliver that message.",
  },
  {
    title: "Storage on your device",
    text: "The authentication service stores session information in your browser so you can stay signed in. Use Sign out on shared devices. Optional visitor analytics stays off until you allow it. Your privacy choice is saved for 180 days and a session identifier lasts for the current tab. Customer and owner workspace pages are excluded from analytics.",
  },
  {
    title: "Your choices",
    text: "Contact 4tech to request correction or deletion of your account and enquiry data. These requests are handled manually, and account ownership must be verified before changes. Customers cannot change a request’s status or delete submissions through the customer area. Do not include passwords, payment details, identification documents or sensitive personal information in an enquiry.",
  },
];

export default function PrivacyPage() {
  return <main id="main" className="container-shell pb-24 pt-32 sm:pb-32 sm:pt-40">
    <div className="mx-auto max-w-3xl"><Link href="/" className="text-sm text-neutral-400 transition-colors hover:text-white"><span aria-hidden="true">← </span>Back to 4tech</Link><p className="section-kicker mb-5 mt-10">A clear approach to your information</p><h1 className="text-4xl font-medium tracking-tight sm:text-6xl">Customer privacy.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-neutral-400">The information behind your account, and the choices you have.</p><p className="mt-4 text-xs text-neutral-500">Last updated 2 October 2026</p>
      <div className="mt-12 space-y-9 border-t border-white/10 pt-10">{sections.map((section, index) => <section key={section.title} aria-labelledby={`privacy-${index}`}><h2 id={`privacy-${index}`} className="text-xl font-medium tracking-tight">{section.title}</h2><p className="mt-3 text-base leading-8 text-neutral-400">{section.text}</p></section>)}
        <section aria-labelledby="privacy-contact"><h2 id="privacy-contact" className="text-xl font-medium tracking-tight">Contact</h2><p className="mt-3 text-base leading-8 text-neutral-400">Mohammed Vashir · 4tech<br/>{siteConfig.contacts.location}</p><div className="mt-5 flex flex-wrap gap-3"><a className="button-secondary" href={`mailto:${siteConfig.contacts.email}`}>Email 4tech </a><a className="button-secondary" href={siteConfig.contacts.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp </a></div></section>
      </div>
    </div>
  </main>;
}
