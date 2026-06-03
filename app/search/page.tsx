"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { MatchRow } from "@/components/match-row";
import { MatchDTO } from "@/types/football";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const { data, isFetching } = useQuery<{ matches: MatchDTO[] }>({
    queryKey: ["search", q],
    enabled: q.trim().length > 1,
    queryFn: async () => {
      const res = await fetch(`/api/football/search?q=${encodeURIComponent(q)}`);
      return res.json();
    },
  });

  return (
    <AppShell>
      <main className="space-y-4">
        <h1 className="text-2xl font-bold">Search</h1>
        <input className="w-full rounded border border-[#22304A] bg-[#111B2E] p-3" placeholder="Search by team" value={q} onChange={(e) => setQ(e.target.value)} />
        {isFetching && <p className="text-sm text-[#94A3B8]">Searching...</p>}
        <div className="space-y-3">
          {data?.matches?.map((match) => <MatchRow key={match.providerMatchId} match={match} />)}
        </div>
      </main>
      <BottomNav />
    </AppShell>
  );
}
