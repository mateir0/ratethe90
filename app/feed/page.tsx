"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { EmptyState } from "@/components/empty-state";
import { RatingPill } from "@/components/rating-pill";
import { ScoreSpoiler } from "@/components/score-spoiler";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type FeedItem = {
  id: string;
  rating: number | null;
  review: string | null;
  profiles: { username: string | null } | null;
  matches: {
    provider_match_id: number;
    home_team_name: string;
    away_team_name: string;
    score_home: number | null;
    score_away: number | null;
    status: string;
  };
};

export default function FeedPage() {
  const { data, isLoading } = useQuery<FeedItem[]>({
    queryKey: ["feed"],
    queryFn: async () => {
      const client = getSupabaseBrowserClient();
      if (!client) return [];
      const { data } = await client
        .from("match_logs")
        .select("id, rating, review, created_at, visibility, profiles(username), matches(provider_match_id, home_team_name, away_team_name, score_home, score_away, status)")
        .eq("visibility", "public")
        .order("created_at", { ascending: false })
        .limit(30);
      const rows = (data ?? []) as Array<Record<string, unknown>>;
      return rows
        .map((row) => {
          const rawMatch = Array.isArray(row.matches) ? row.matches[0] : row.matches;
          if (!rawMatch) return null;
          const match = rawMatch as Record<string, unknown>;
          const rawProfile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
          const profile = rawProfile as Record<string, unknown> | null;
          return {
            id: String(row.id ?? ""),
            rating: typeof row.rating === "number" ? row.rating : null,
            review: typeof row.review === "string" ? row.review : null,
            profiles: profile ? { username: typeof profile.username === "string" ? profile.username : null } : null,
            matches: {
              provider_match_id: Number(match.provider_match_id),
              home_team_name: String(match.home_team_name ?? ""),
              away_team_name: String(match.away_team_name ?? ""),
              score_home: typeof match.score_home === "number" ? match.score_home : null,
              score_away: typeof match.score_away === "number" ? match.score_away : null,
              status: String(match.status ?? ""),
            },
          } satisfies FeedItem;
        })
        .filter((item): item is FeedItem => item !== null);
    },
  });

  return (
    <AppShell>
      <main className="space-y-4">
        <h1 className="text-2xl font-bold">Community feed</h1>
        {isLoading && <div className="h-32 animate-pulse rounded-xl bg-[#111B2E]" />}
        <div className="space-y-3">
          {data?.map((item) => {
            const match = item.matches;
            return (
              <Link key={item.id} href={`/match/${match.provider_match_id}`} className="block rounded-xl border border-[#22304A] bg-[#111B2E] p-4">
                <p className="text-xs text-[#94A3B8]">@{item.profiles?.username ?? "user"}</p>
                <p className="font-semibold">{match.home_team_name} vs {match.away_team_name}</p>
                <ScoreSpoiler matchId={match.provider_match_id} home={match.score_home} away={match.score_away} status={match.status} />
                <div className="mt-2"><RatingPill rating={item.rating} /></div>
                {item.review && <p className="mt-2 text-sm text-[#E5E7EB]">{item.review}</p>}
              </Link>
            );
          })}
        </div>
        {!isLoading && !data?.length && <EmptyState title="No public logs yet" description="Follow matches and write the first review." />}
      </main>
      <BottomNav />
    </AppShell>
  );
}
