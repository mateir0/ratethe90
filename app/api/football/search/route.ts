import { NextRequest, NextResponse } from "next/server";
import { getCachedMatches } from "@/lib/football-data";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.toLowerCase().trim() ?? "";
  if (!q) return NextResponse.json({ matches: [] });

  const matches = getCachedMatches().filter(
    (m) => m.homeTeam.name.toLowerCase().includes(q) || m.awayTeam.name.toLowerCase().includes(q),
  );

  return NextResponse.json({ matches: matches.slice(0, 30) });
}
