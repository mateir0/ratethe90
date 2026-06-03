import { NextRequest, NextResponse } from "next/server";
import { fetchMatchesByCompetitionDate } from "@/lib/football-data";

export async function GET(request: NextRequest) {
  const competition = request.nextUrl.searchParams.get("competition");
  const date = request.nextUrl.searchParams.get("date");
  if (!competition || !date) {
    return NextResponse.json({ error: "competition and date are required" }, { status: 400 });
  }

  try {
    const matches = await fetchMatchesByCompetitionDate(competition, date);
    return NextResponse.json({ matches });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 500 });
  }
}
