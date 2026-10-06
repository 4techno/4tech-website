import type { Metadata } from "next";
import Link from "next/link";
import OwnerPortal from "@/components/account/OwnerPortal";


export const metadata: Metadata = {
  title: "Founder Command Centre | 4TECH",
  description: "Private founder workspace for enquiries, quotations and consented visitor analytics.",
  robots: { index: false, follow: false },
};

export default function OwnerPage() {
  return (
    <main id="main" className="owner-page container-shell pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <Link href="/" className="inline-flex min-h-11 items-center text-sm text-neutral-300 transition-colors hover:text-[#e53935]">Back to 4TECH</Link>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[.25em] text-[#e53935]">[ PRIVATE / FOUNDER WORKSPACE ]</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Command centre.</h1>
          <p className="mt-4 max-w-2xl text-neutral-300">
            Review customer enquiries. Quotation, progress and visitor reports appear here when those services are enabled.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/founder" className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-xs text-neutral-200 transition-colors hover:border-[#c5221f] hover:text-[#e53935]">
            Founder profile
          </Link>
          <Link href="/co-founder" className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-xs text-neutral-200 transition-colors hover:border-[#c5221f] hover:text-[#e53935]">
            Co-founder profile
          </Link>
        </div>
      </div>

      <div className="space-y-12">
        <OwnerPortal />
      </div>
    </main>
  );
}
