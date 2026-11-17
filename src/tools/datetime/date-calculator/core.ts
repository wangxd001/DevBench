function parseDateOnly(dateStr: string): Date | null {
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const y = parseInt(m[1], 10);
  const mo = parseInt(m[2], 10);
  const d = parseInt(m[3], 10);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const daysInMonth = new Date(y, mo, 0).getDate();
  if (d > daysInMonth) return null;
  return new Date(Date.UTC(y, mo - 1, d));
}

function formatYMD(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(dateStr: string, days: number): { value: string; error?: string } {
  const d = parseDateOnly(dateStr);
  if (!d) return { value: "", error: "Invalid date" };
  const result = new Date(d.getTime() + days * 86400000);
  return { value: formatYMD(result) };
}

export function subtractDays(dateStr: string, days: number): { value: string; error?: string } {
  return addDays(dateStr, -days);
}

export interface DateDiffResult {
  totalDays: number;
  years: number;
  months: number;
  days: number;
}

export function dateDiff(fromStr: string, toStr: string): DateDiffResult {
  const from = parseDateOnly(fromStr);
  const to = parseDateOnly(toStr);
  if (!from || !to) return { totalDays: 0, years: 0, months: 0, days: 0 };

  const msDiff = to.getTime() - from.getTime();
  const totalDays = Math.round(msDiff / 86400000);

  // 日历分解
  let years = 0;
  let months = 0;
  let days = 0;

  const absTotal = Math.abs(totalDays);
  const sign = totalDays < 0 ? -1 : 1;

  let y = from.getUTCFullYear();
  let m = from.getUTCMonth();
  let d = from.getUTCDate();

  if (absTotal > 365) {
    years = Math.floor(absTotal / 365.25);
    const remaining = absTotal - Math.round(years * 365.25);
    months = Math.floor(remaining / 30.44);
    days = Math.round(remaining - months * 30.44);
  } else {
    const target = new Date(Date.UTC(y, m, d + absTotal));
    years = target.getUTCFullYear() - from.getUTCFullYear();
    months = target.getUTCMonth() - from.getUTCMonth() + (years ? 12 : 0);
    days = target.getUTCDate() - from.getUTCDate();
    if (days < 0) {
      months--;
      days += new Date(Date.UTC(y, m, 0)).getDate() - from.getUTCDate();
    }
  }

  return {
    totalDays,
    years: years * sign,
    months: months * sign,
    days: days * sign,
  };
}
