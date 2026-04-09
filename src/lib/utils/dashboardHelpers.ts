import { fm } from "./formatCurrency";

export const COL_POSITIVE = "#1B8A2A";
export const COL_NEGATIVE = "#C62828";

export function valColor(v: number): string | undefined {
  if (v > 0) return COL_POSITIVE;
  if (v < 0) return COL_NEGATIVE;
  return undefined;
}

export function avg(total: number, days: number): string {
  return days > 0 ? fm(Math.round(total / days)) : "—";
}

export function tend(
  total: number,
  days: number,
  daysMonth: number
): string {
  if (days === 0) return "—";
  return fm(Math.round((total / days) * daysMonth));
}

export function avgNum(total: number, days: number): string {
  if (days === 0) return "—";
  return (total / days).toFixed(1);
}

export function tendNum(
  total: number,
  days: number,
  daysMonth: number
): string {
  if (days === 0) return "—";
  return String(Math.round((total / days) * daysMonth));
}
