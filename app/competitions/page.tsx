"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { SkeletonCard } from "@/components/skeletons";
import { EmptyState } from "@/components/empty-state";
import { CompetitionConfig } from "@/types/football";

export default function CompetitionsPage() {
  const { data, isLoading } = useQuery<{ competitions: CompetitionConfig[] }>({
    queryKey: ["competitions"],
    queryFn: async () => {
      const res = await fetch("/api/football/competitions");
      if (!res.ok) throw new Error("Failed to load competitions");
      return res.json();
    },
  });

  return (
    <AppShell>
      <main className="space-y-4">
        <h1 className="text-2xl font-bold">Competitions</h1>
        <p className="text-sm text-[#94A3B8]">Select a competition and browse by date.</p>
        <div className="space-y-3">
          {isLoading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          {!isLoading && data?.competitions?.map((competition) => (
            <Link
              key={competition.code}
              href={`/competition/${competition.code}`}
              className="block rounded-xl border border-[#22304A] bg-[#111B2E] p-4 transition hover:bg-[#16233A]"
            >
              <p className="text-xs" style={{ color: competition.color }}>{competition.code}</p>
              <h2 className="font-semibold">{competition.name}</h2>
            </Link>
          ))}
          {!isLoading && !data?.competitions?.length && <EmptyState title="No competitions" description="Competition config is empty." />}
        </div>
      </main>
      <BottomNav />
    </AppShell>
  );
}
