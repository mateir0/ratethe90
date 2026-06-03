"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { ScoreSpoiler } from "@/components/score-spoiler";
import { LogMatchSheet } from "@/components/log-match-sheet";
import { MatchDTO } from "@/types/football";

export default function MatchPage() {
  const params = useParams<{ providerMatchId: string }>();
  const [open, setOpen] = useState(false);
  const id = Number(params.providerMatchId);

  const { data, isLoading, error } = useQuery<{ match: MatchDTO }>({
    queryKey: ["match", id],
    queryFn: async () => {
      const res = await fetch(`/api/football/match/${id}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  return (
    <AppShell>
      <main className="space-y-4">
        {isLoading && <div className="h-32 animate-pulse rounded-xl bg-[#111B2E]" />}
        {error && <p className="text-sm text-rose-400">Failed to load match.</p>}
        {data?.match && (
          <>
            <h1 className="text-xl font-bold">{data.match.homeTeam.name} vs {data.match.awayTeam.name}</h1>
            <div className="rounded-xl border border-[#22304A] bg-[#111B2E] p-4">
              <ScoreSpoiler
                matchId={data.match.providerMatchId}
                home={data.match.score.home}
                away={data.match.score.away}
                status={data.match.status}
              />
            </div>
            <button onClick={() => setOpen(true)} className="w-full rounded bg-[#22C55E] py-3 font-semibold text-black">Log match</button>
            <LogMatchSheet open={open} onClose={() => setOpen(false)} match={data.match} />
          </>
        )}
      </main>
      <BottomNav />
    </AppShell>
  );
}
