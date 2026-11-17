export type TimestampUnit = "seconds" | "milliseconds";
export type DisplayFormat = "local" | "utc" | "iso";

export function timestampToDate(ts: string, unit: TimestampUnit): Date | null {
  if (!/^\d+$/.test(ts)) return null;
  const num = parseInt(ts, 10);
  if (num < 0) return null;
  const ms = unit === "seconds" ? num * 1000 : num;
  const d = new Date(ms);
  return isNaN(d.getTime()) ? null : d;
}

export function dateToTimestamp(dateStr: string, unit: TimestampUnit): string | null {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const val = unit === "seconds" ? Math.floor(d.getTime() / 1000) : d.getTime();
  return String(val);
}

export function getNowTimestamp(unit: TimestampUnit): string {
  const ms = Date.now();
  return unit === "seconds" ? String(Math.floor(ms / 1000)) : String(ms);
}

export function formatTimestampDate(date: Date, format: DisplayFormat): string {
  switch (format) {
    case "iso":
      return date.toISOString();
    case "utc":
      return date.toUTCString();
    case "local":
    default:
      return date.toLocaleString();
  }
}
