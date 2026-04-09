export function formatBrl(cents: number): string {
  const value = cents / 100;
  if (Math.abs(value) >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(1)}K`;
  }
  return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercent(value: number | null): string {
  if (value === null) return "—";
  return `${value.toFixed(1)}%`;
}

export function formatBrlAxis(cents: number): string {
  const value = cents / 100;
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toFixed(0);
}

/** Compact format: R$ 1.2M / R$ 45.8K / R$ 350 */
export function fm(cents: number): string {
  const v = cents / 100;
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}R$ ${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}R$ ${(abs / 1_000).toFixed(1)}K`;
  return `${sign}R$ ${Math.round(abs)}`;
}

/** Full format: R$ 1.234,56 */
export function fFull(cents: number): string {
  const v = cents / 100;
  return `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
