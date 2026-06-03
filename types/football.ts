export const COMPETITION_CODES = [
  "WC",
  "CL",
  "BL1",
  "DED",
  "BSA",
  "PD",
  "FL1",
  "ELC",
  "PPL",
  "EC",
  "SA",
  "PL",
] as const;

export type CompetitionCode = (typeof COMPETITION_CODES)[number];

export type MatchDTO = {
  provider: "football-data";
  providerMatchId: number;
  competition: CompetitionCode;
  utcKickoff: string;
  status: string;
  stage?: string | null;
  matchday?: number | null;
  homeTeam: { name: string };
  awayTeam: { name: string };
  score: { home: number | null; away: number | null };
};

export type CompetitionConfig = {
  code: CompetitionCode;
  name: string;
  color: string;
};
