"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { getSpoilersOff, setSpoilersOff } from "@/lib/spoilers";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function SettingsPage() {
  const [spoilersOff, setLocalSpoilersOff] = useState(() => getSpoilersOff());

  return (
    <AppShell>
      <main className="space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <label className="flex items-center justify-between rounded-xl border border-[#22304A] bg-[#111B2E] p-4">
          <span>Spoilers OFF (show scores)</span>
          <input
            type="checkbox"
            checked={spoilersOff}
            onChange={(e) => {
              setLocalSpoilersOff(e.target.checked);
              setSpoilersOff(e.target.checked);
            }}
          />
        </label>
        <button
          onClick={async () => {
            const client = getSupabaseBrowserClient();
            await client?.auth.signOut();
            window.location.href = "/welcome";
          }}
          className="w-full rounded border border-[#22304A] bg-[#111B2E] py-3"
        >
          Sign out
        </button>
      </main>
      <BottomNav />
    </AppShell>
  );
}
