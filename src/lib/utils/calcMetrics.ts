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

export function calcVendasPrincipal(e: DailyEntryRow): number {
  return e.plat1_vendas + e.plat2_vendas + e.plat3_vendas + e.plat4_vendas + e.plat5_vendas;
}

export function calcFatPrincipal(e: DailyEntryRow): number {
  return e.plat1_faturado + e.plat2_faturado + e.plat3_faturado + e.plat4_faturado + e.plat5_faturado;
}

export function calcTotalFunil(e: DailyEntryRow): number {
  return e.ob1_faturado + e.ob2_faturado + e.ob3_faturado
    + e.ob4_faturado + e.ob5_faturado + e.ob6_faturado
    + e.upsell_faturado + e.downsell_faturado;
}

export function calcFaturamentoTotal(e: DailyEntryRow): number {
  return calcFatPrincipal(e) + calcTotalFunil(e);
}

export function calcLucro(e: DailyEntryRow): number {
  return calcFaturamentoTotal(e) - e.investimento;
}

export function calcMargem(e: DailyEntryRow): number | null {
  const fat = calcFaturamentoTotal(e);
  return safeDivide(calcLucro(e) * 100, fat);
}

export function calcCpa(e: DailyEntryRow): number | null {
  return safeDivide(e.investimento, calcVendasPrincipal(e));
}

export function calcTicketMedio(e: DailyEntryRow): number | null {
  return safeDivide(calcFaturamentoTotal(e), calcVendasPrincipal(e));
}

export function calcCarregamento(e: DailyEntryRow): number | null {
  return safeDivide(e.page_view, e.cliques_link);
}
