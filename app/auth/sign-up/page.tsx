"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { ensureProfile } from "@/lib/profile";

export default function SignUpPage() {
  const client = getSupabaseBrowserClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!client) return setMessage("Missing Supabase environment variables");
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) return setMessage(error.message);
    if (data.user) await ensureProfile(client, data.user);
    router.push("/feed");
  }

  return (
    <AppShell>
      <main className="space-y-4">
        <h1 className="text-2xl font-bold">Create account</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full rounded border border-[#22304A] bg-[#111B2E] p-3" required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded border border-[#22304A] bg-[#111B2E] p-3" required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full rounded bg-[#22C55E] py-3 font-semibold text-black">Sign up</button>
        </form>
        {message && <p role="status" className="text-sm text-[#A3E635]">{message}</p>}
        <Link href="/auth/sign-in" className="text-sm text-[#94A3B8] underline">Have an account?</Link>
      </main>
    </AppShell>
  );
}
