import { formatInTimeZone } from "date-fns-tz";

export function formatKickoff(iso: string, timeZone?: string) {
  const tz = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return formatInTimeZone(new Date(iso), tz, "MMM d, HH:mm zzz");
}
