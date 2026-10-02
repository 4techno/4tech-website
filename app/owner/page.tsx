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
    <main id="main" className="container-shell pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <Link href="/" className="text-sm text-neutral-400 hover:text-white">← Back to 4TECH</Link>
          <h1 className="mt-8 text-4xl font-medium tracking-tight sm:text-6xl font-serif">Command centre.</h1>
          <p className="mt-4 max-w-2xl text-neutral-400">
            Manage enquiries, accepted quotations, project progress and consented visitor records in your private workspace.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/founder" className="text-xs px-3 py-1.5 border border-white/20 rounded-full text-neutral-300 hover:text-white hover:border-white">
            Founder Profile →
          </Link>
          <Link href="/co-founder" className="text-xs px-3 py-1.5 border border-white/20 rounded-full text-neutral-300 hover:text-white hover:border-white">
            Co-Founder Profile →
          </Link>
        </div>
      </div>

      <div className="space-y-12">
        <OwnerPortal />
      </div>
    </main>
  );
}
