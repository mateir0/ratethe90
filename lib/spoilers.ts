export const REVEALED_SCORES_KEY = "ratethe90:revealedScores";
export const SPOILERS_OFF_KEY = "ratethe90:spoilersOff";

export function getRevealedScores(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REVEALED_SCORES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setRevealedScore(matchId: number) {
  if (typeof window === "undefined") return;
  const current = new Set(getRevealedScores());
  current.add(matchId);
  window.localStorage.setItem(REVEALED_SCORES_KEY, JSON.stringify(Array.from(current)));
}

export function getSpoilersOff(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SPOILERS_OFF_KEY) === "1";
}

export function setSpoilersOff(value: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SPOILERS_OFF_KEY, value ? "1" : "0");
}
