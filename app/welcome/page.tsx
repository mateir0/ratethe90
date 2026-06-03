import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export default function WelcomePage() {
  return (
    <AppShell>
      <main className="space-y-5 pt-16">
        <p className="text-sm text-[#A3E635]">RateThe90</p>
        <h1 className="text-4xl font-black">Letterboxd for football matches</h1>
        <p className="text-[#94A3B8]">Browse fixtures, log what you watched, and keep scores spoiler-free by default.</p>
        <div className="grid gap-3 pt-4">
          <Link href="/auth/sign-up" className="rounded-xl bg-[#22C55E] px-4 py-3 text-center font-semibold text-black">Create account</Link>
          <Link href="/auth/sign-in" className="rounded-xl border border-[#22304A] px-4 py-3 text-center">Sign in</Link>
          <Link href="/competitions" className="rounded-xl border border-[#22304A] px-4 py-3 text-center text-[#94A3B8]">Continue as guest</Link>
        </div>
      </main>
    </AppShell>
  );
}
