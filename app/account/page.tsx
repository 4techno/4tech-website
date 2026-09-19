import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AccountPortal from "@/components/account/AccountPortal";

export const metadata: Metadata = {
  title: "Customer area",
  description: "Your 4tech project enquiries and updates, in one place.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <main id="main" className="container-shell pb-24 pt-32 sm:pb-32 sm:pt-40">
    <div className="mb-10 sm:mb-14"><Link href="/" className="text-sm text-neutral-400 transition-colors hover:text-white"><span aria-hidden="true">← </span>Back to 4tech</Link><h1 className="mt-8 text-4xl font-medium tracking-tight sm:text-6xl">Your next chapter.</h1></div>
    <Suspense fallback={<div role="status" className="panel flex min-h-72 items-center justify-center gap-3 p-8 text-sm text-neutral-400"><span className="h-4 w-4 animate-spin rounded-full border border-white/15 border-t-[#ff3b55] motion-reduce:animate-none" aria-hidden="true"/>Loading your customer space…</div>}><AccountPortal/></Suspense>
  </main>;
}
