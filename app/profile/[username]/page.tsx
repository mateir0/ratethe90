"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { RatingPill } from "@/components/rating-pill";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type ProfileLog = {
  id: string;
  rating: number | null;
  review: string | null;
  matches: {
    home_team_name: string;
    away_team_name: string;
  };
};

type ProfileResult = {
  profile: { id: string; username: string; display_name: string | null } | null;
  logs: ProfileLog[];
};

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const username = String(params.username || "");
  const { data } = useQuery<ProfileResult>({
    queryKey: ["profile", username],
    queryFn: async () => {
      const client = getSupabaseBrowserClient();
      if (!client) return { profile: null, logs: [] };
      const { data: profile } = await client.from("profiles").select("id, username, display_name").eq("username", username).maybeSingle();
      if (!profile) return { profile: null, logs: [] };
      const profileId = (profile as { id: string }).id;
      const { data: logs } = await client
        .from("match_logs")
        .select("id, rating, review, matches(home_team_name, away_team_name)")
        .eq("user_id", profileId)
        .eq("visibility", "public")
        .order("created_at", { ascending: false })
        .limit(20);
      const rows = (logs ?? []) as Array<Record<string, unknown>>;
      const normalizedLogs = rows
        .map((row) => {
          const rawMatch = Array.isArray(row.matches) ? row.matches[0] : row.matches;
          if (!rawMatch) return null;
          const match = rawMatch as Record<string, unknown>;
          return {
            id: String(row.id ?? ""),
            rating: typeof row.rating === "number" ? row.rating : null,
            review: typeof row.review === "string" ? row.review : null,
            matches: {
              home_team_name: String(match.home_team_name ?? ""),
              away_team_name: String(match.away_team_name ?? ""),
            },
          } satisfies ProfileLog;
        })
        .filter((item): item is ProfileLog => item !== null);
      return { profile: profile as ProfileResult["profile"], logs: normalizedLogs };
    },
  });

  return (
    <AppShell>
      <main className="space-y-4">
        <h1 className="text-2xl font-bold">@{username}</h1>
        <p className="text-[#94A3B8]">{data?.profile?.display_name ?? "Fan"}</p>
        <div className="space-y-3">
          {(data?.logs as ProfileLog[])?.map((log) => (
            <article key={log.id} className="rounded-xl border border-[#22304A] bg-[#111B2E] p-3">
              <p className="font-semibold">{log.matches.home_team_name} vs {log.matches.away_team_name}</p>
              <RatingPill rating={log.rating} />
              {log.review && <p className="mt-2 text-sm">{log.review}</p>}
            </article>
          ))}
        </div>
      </main>
      <BottomNav />
    </AppShell>
  );
}
