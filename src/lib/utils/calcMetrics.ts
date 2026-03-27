import type { DailyEntryRow } from "@/types/daily-entry";

export function centsToBrl(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function brlToCents(brl: string): number {
  const cleaned = brl.replace(/[^\d,.-]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.round(num * 100);
}

export function safeDivide(a: number, b: number): number | null {
  return b === 0 ? null : a / b;
}

export function calcFaturamentoTotal(e: DailyEntryRow): number {
  return e.faturamento_principal + e.ob1_faturado + e.ob2_faturado
    + e.ob3_faturado + e.ob4_faturado + e.ob5_faturado
    + e.upsell_faturado + e.downsell_faturado;
}

export function calcLucro(e: DailyEntryRow): number {
  return calcFaturamentoTotal(e) - e.investimento;
}

export function calcMargem(e: DailyEntryRow): number | null {
  const fat = calcFaturamentoTotal(e);
  return safeDivide(calcLucro(e) * 100, fat);
}

export function calcCpa(e: DailyEntryRow): number | null {
  return safeDivide(e.investimento, e.vendas_principal);
}

export function calcTicketMedio(e: DailyEntryRow): number | null {
  return safeDivide(calcFaturamentoTotal(e), e.vendas_principal);
}
