"use client";

import { useState } from "react";
import { getRevealedScores, getSpoilersOff, setRevealedScore } from "@/lib/spoilers";

type Props = {
  matchId: number;
  home: number | null;
  away: number | null;
  status: string;
};

export function ScoreSpoiler({ matchId, home, away, status }: Props) {
  const [revealed, setRevealed] = useState(() => getRevealedScores().includes(matchId));
  const [spoilersOff] = useState(() => getSpoilersOff());

  const visible = spoilersOff || revealed;

  return (
    <div className="min-w-20 text-right">
      {visible ? (
        <div className="text-sm font-semibold">
          {home ?? "-"} : {away ?? "-"}
          <div className="text-xs text-[#94A3B8]">{status}</div>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="text-sm font-semibold tracking-widest">— : —</div>
          <button
            onClick={() => {
              setRevealed(true);
              setRevealedScore(matchId);
            }}
            className="text-xs text-[#A3E635] underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635]"
          >
            Reveal score
          </button>
        </div>
      )}
    </div>
  );
}
