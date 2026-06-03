"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { EmptyState } from "@/components/empty-state";
import { RatingPill } from "@/components/rating-pill";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type DiaryItem = {
  id: string;
  watched: boolean;
  attended: boolean;
  rating: number | null;
  visibility: "public" | "private";
  matches: {
    provider_match_id: number;
    competition: string;
    home_team_name: string;
    away_team_name: string;
  };
};

export default function DiaryPage() {
  const { data, isLoading } = useQuery<DiaryItem[]>({
    queryKey: ["diary"],
    queryFn: async () => {
      const client = getSupabaseBrowserClient();
      if (!client) return [];
      const { data: authData } = await client.auth.getUser();
      if (!authData.user) return [];

      const { data } = await client
        .from("match_logs")
        .select("id, watched, attended, rating, visibility, created_at, matches(provider_match_id, competition, home_team_name, away_team_name)")
        .eq("user_id", authData.user.id)
        .order("created_at", { ascending: false });
      const rows = (data ?? []) as Array<Record<string, unknown>>;
      return rows
        .map((row) => {
          const rawMatch = Array.isArray(row.matches) ? row.matches[0] : row.matches;
          if (!rawMatch) return null;
          const match = rawMatch as Record<string, unknown>;
          return {
            id: String(row.id ?? ""),
            watched: Boolean(row.watched),
            attended: Boolean(row.attended),
            rating: typeof row.rating === "number" ? row.rating : null,
            visibility: row.visibility === "private" ? "private" : "public",
            matches: {
              provider_match_id: Number(match.provider_match_id),
              competition: String(match.competition ?? ""),
              home_team_name: String(match.home_team_name ?? ""),
              away_team_name: String(match.away_team_name ?? ""),
            },
          } satisfies DiaryItem;
        })
        .filter((item): item is DiaryItem => item !== null);
    },
  });

  const stats = useMemo(() => {
    const items = data ?? [];
    const ratings = items.map((i) => i.rating).filter((n) => typeof n === "number");
    return {
      total: items.length,
      watched: items.filter((i) => i.watched).length,
      attended: items.filter((i) => i.attended).length,
      avg: ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null,
    };
  }, [data]);

  return (
    <AppShell>
      <main className="space-y-4">
        <h1 className="text-2xl font-bold">My diary</h1>
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#22304A] bg-[#111B2E] p-3 text-sm">
          <p>Total: {stats.total}</p>
          <p>Watched: {stats.watched}</p>
          <p>Attended: {stats.attended}</p>
          <p>Avg rating: {stats.avg?.toFixed(1) ?? "-"}</p>
        </div>
        {isLoading && <div className="h-28 animate-pulse rounded-xl bg-[#111B2E]" />}
        <div className="space-y-3">
          {data?.map((item) => (
            <Link key={item.id} href={`/match/${item.matches.provider_match_id}`} className="block rounded-xl border border-[#22304A] bg-[#111B2E] p-3">
              <p className="font-semibold">{item.matches.home_team_name} vs {item.matches.away_team_name}</p>
              <p className="text-xs text-[#94A3B8]">{item.matches.competition} • {item.visibility}</p>
              <RatingPill rating={item.rating} />
            </Link>
          ))}
        </div>
        {!isLoading && !data?.length && <EmptyState title="No logs yet" description="Log your first match from any match page." />}
      </main>
      <BottomNav />
    </AppShell>
  );
}
