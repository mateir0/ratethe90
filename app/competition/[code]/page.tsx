"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { SkeletonMatchRow } from "@/components/skeletons";
import { EmptyState } from "@/components/empty-state";
import { MatchRow } from "@/components/match-row";
import { MatchDTO } from "@/types/football";

export default function CompetitionPage() {
  const params = useParams<{ code: string }>();
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const code = useMemo(() => String(params.code || "PL"), [params.code]);

  const { data, isLoading, error } = useQuery<{ matches: MatchDTO[]; error?: string }>({
    queryKey: ["matches", code, date],
    queryFn: async () => {
      const res = await fetch(`/api/football/matches?competition=${code}&date=${date}`);
      return res.json();
    },
  });

  return (
    <AppShell>
      <main className="space-y-4">
        <h1 className="text-2xl font-bold">{code}</h1>
        <label className="text-sm text-[#94A3B8]">Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded border border-[#22304A] bg-[#111B2E] p-2" />
        <div className="space-y-3">
          {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonMatchRow key={i} />)}
          {!isLoading && !!data?.error && <EmptyState title="Could not load matches" description={data.error} />}
          {!isLoading && !data?.error && data?.matches?.map((match) => <MatchRow key={match.providerMatchId} match={match} />)}
          {!isLoading && !error && !data?.matches?.length && <EmptyState title="No matches" description="Try a different date." />}
        </div>
      </main>
      <BottomNav />
    </AppShell>
  );
}
