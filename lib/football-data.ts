import { SUPPORTED_COMPETITIONS } from "@/lib/competitions";
import { MatchDTO, CompetitionCode } from "@/types/football";

const API_BASE = "https://api.football-data.org/v4";
const inMemoryCache = new Map<number, MatchDTO>();

function requireToken() {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) {
    throw new Error("FOOTBALL_DATA_TOKEN is not configured");
  }
  return token;
}

function assertCompetition(code: string): CompetitionCode {
  if (!SUPPORTED_COMPETITIONS.find((c) => c.code === code)) {
    throw new Error("Unsupported competition");
  }
  return code as CompetitionCode;
}

type FootballDataMatch = {
  id: number;
  utcDate: string;
  status?: string;
  stage?: string | null;
  matchday?: number | null;
  competition?: { code?: string };
  homeTeam?: { name?: string; shortName?: string };
  awayTeam?: { name?: string; shortName?: string };
  score?: { fullTime?: { home?: number | null; away?: number | null } };
};

function normalizeMatch(match: FootballDataMatch): MatchDTO {
  return {
    provider: "football-data",
    providerMatchId: Number(match.id),
    competition: assertCompetition(match.competition?.code ?? "PL"),
    utcKickoff: new Date(match.utcDate).toISOString(),
    status: String(match.status ?? "SCHEDULED"),
    stage: match.stage ?? null,
    matchday: match.matchday ?? null,
    homeTeam: { name: String(match.homeTeam?.shortName || match.homeTeam?.name || "Home") },
    awayTeam: { name: String(match.awayTeam?.shortName || match.awayTeam?.name || "Away") },
    score: {
      home: match.score?.fullTime?.home ?? null,
      away: match.score?.fullTime?.away ?? null,
    },
  };
}

export function getCachedMatches(): MatchDTO[] {
  return Array.from(inMemoryCache.values()).sort(
    (a, b) => +new Date(b.utcKickoff) - +new Date(a.utcKickoff),
  );
}

export async function fetchMatchesByCompetitionDate(competition: string, date: string): Promise<MatchDTO[]> {
  const code = assertCompetition(competition);
  const token = requireToken();
  const url = `${API_BASE}/competitions/${code}/matches?dateFrom=${date}&dateTo=${date}`;
  const res = await fetch(url, {
    headers: { "X-Auth-Token": token },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`football-data request failed (${res.status})`);
  }

  const data = await res.json();
  const normalized = (data.matches ?? []).map(normalizeMatch);
  for (const m of normalized) inMemoryCache.set(m.providerMatchId, m);
  return normalized;
}

export async function fetchMatchById(id: string): Promise<MatchDTO> {
  const numericId = Number(id);
  if (inMemoryCache.has(numericId)) {
    return inMemoryCache.get(numericId)!;
  }

  const token = requireToken();
  const res = await fetch(`${API_BASE}/matches/${id}`, {
    headers: { "X-Auth-Token": token },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`football-data request failed (${res.status})`);
  }

  const data = await res.json();
  const normalized = normalizeMatch(data);
  inMemoryCache.set(normalized.providerMatchId, normalized);
  return normalized;
}
