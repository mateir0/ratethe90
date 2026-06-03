import Link from "next/link";
import { MatchDTO } from "@/types/football";
import { ScoreSpoiler } from "@/components/score-spoiler";
import { formatKickoff } from "@/lib/format";

export function MatchRow({ match }: { match: MatchDTO }) {
  return (
    <Link
      href={`/match/${match.providerMatchId}`}
      className="flex items-center justify-between rounded-xl border border-[#22304A] bg-[#111B2E] p-3 transition hover:bg-[#16233A]"
    >
      <div>
        <p className="font-semibold">{match.homeTeam.name}</p>
        <p className="font-semibold">{match.awayTeam.name}</p>
        <p className="text-xs text-[#94A3B8]">{formatKickoff(match.utcKickoff)}</p>
      </div>
      <ScoreSpoiler
        matchId={match.providerMatchId}
        home={match.score.home}
        away={match.score.away}
        status={match.status}
      />
    </Link>
  );
}
