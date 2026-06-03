"use client";

import { useState } from "react";
import { MatchDTO } from "@/types/football";
import { RatingInput } from "@/components/rating-input";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { ensureProfile } from "@/lib/profile";

type Props = {
  open: boolean;
  onClose: () => void;
  match: MatchDTO;
};

export function LogMatchSheet({ open, onClose, match }: Props) {
  const [watched, setWatched] = useState(true);
  const [attended, setAttended] = useState(false);
  const [rating, setRating] = useState(8);
  const [review, setReview] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [stadium, setStadium] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4">
      <div className="mx-auto mt-20 max-w-md rounded-2xl border border-[#22304A] bg-[#111B2E] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Log match</h2>
          <button className="text-sm text-[#94A3B8]" onClick={onClose}>Close</button>
        </div>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const client = getSupabaseBrowserClient();
            if (!client) {
              setMessage("Missing Supabase environment variables");
              return;
            }
            setSaving(true);
            setMessage(null);
            try {
              const { data: authData } = await client.auth.getUser();
              const user = authData.user;
              if (!user) throw new Error("Please sign in first");

              await ensureProfile(client, user);

              const { data: matchRow, error: matchErr } = await client
                .from("matches")
                .upsert(
                  {
                    provider: "football-data",
                    provider_match_id: match.providerMatchId,
                    competition: match.competition,
                    utc_kickoff: match.utcKickoff,
                    home_team_name: match.homeTeam.name,
                    away_team_name: match.awayTeam.name,
                    status: match.status,
                    score_home: match.score.home,
                    score_away: match.score.away,
                    stage: match.stage,
                    matchday: match.matchday,
                  },
                  { onConflict: "provider,provider_match_id" },
                )
                .select("id")
                .single();

              if (matchErr) throw matchErr;

              const { error: logErr } = await client.from("match_logs").upsert(
                {
                  user_id: user.id,
                  match_id: matchRow.id,
                  watched,
                  attended,
                  rating,
                  review: review || null,
                  visibility,
                  stadium: attended ? stadium || null : null,
                  city: attended ? city || null : null,
                  notes: attended ? notes || null : null,
                },
                { onConflict: "user_id,match_id" },
              );

              if (logErr) throw logErr;
              setMessage("Saved");
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Failed to save");
            } finally {
              setSaving(false);
            }
          }}
        >
          <label className="flex items-center gap-2"><input type="checkbox" checked={watched} onChange={(e) => setWatched(e.target.checked)} /> Watched</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={attended} onChange={(e) => setAttended(e.target.checked)} /> Attended</label>
          {attended && (
            <>
              <input aria-label="Stadium" className="w-full rounded border border-[#22304A] bg-[#0B1220] p-2" placeholder="Stadium" value={stadium} onChange={(e) => setStadium(e.target.value)} />
              <input aria-label="Stadium" className="w-full rounded border border-[#22304A] bg-[#0B1220] p-2" placeholder="Stadium" value={stadium} onChange={(e) => setStadium(e.target.value)} />
              <input aria-label="City" className="w-full rounded border border-[#22304A] bg-[#0B1220] p-2" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <textarea aria-label="Attendance notes" className="w-full rounded border border-[#22304A] bg-[#0B1220] p-2" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </>
          )}
          <RatingInput value={rating} onChange={setRating} />
          <textarea aria-label="Review" maxLength={800} className="w-full rounded border border-[#22304A] bg-[#0B1220] p-2" placeholder="Review (max 800)" value={review} onChange={(e) => setReview(e.target.value)} />
          <select aria-label="Visibility" value={visibility} onChange={(e) => setVisibility(e.target.value as "public" | "private")} className="w-full rounded border border-[#22304A] bg-[#0B1220] p-2">
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <button disabled={saving} className="w-full rounded bg-[#22C55E] py-2 font-semibold text-black disabled:opacity-60" type="submit">
            {saving ? "Saving..." : "Save"}
          </button>
          {message && <p role="status" className="text-sm text-[#A3E635]">{message}</p>}
        </form>
      </div>
    </div>
  );
}
