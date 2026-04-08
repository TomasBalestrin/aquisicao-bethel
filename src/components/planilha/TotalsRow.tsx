"use client";

import type { DailyEntryRow } from "@/types/daily-entry";
import type { ColumnDef } from "./columnDefs";
import {
  calcFaturamentoTotal, calcLucro, calcVendasPrincipal, calcFatPrincipal,
  calcTotalFunil, safeDivide, centsToBrl,
} from "@/lib/utils/calcMetrics";

interface Props { entries: DailyEntryRow[]; columns: ColumnDef[] }

function sum(es: DailyEntryRow[], f: string): number {
  return es.reduce((a, e) => a + (e[f as keyof DailyEntryRow] as number ?? 0), 0);
}

function getTotal(es: DailyEntryRow[], key: string): number | null {
  if (es.length === 0) return null;
  const fat = es.reduce((a, e) => a + calcFaturamentoTotal(e), 0);
  const lucro = es.reduce((a, e) => a + calcLucro(e), 0);
  const vp = es.reduce((a, e) => a + calcVendasPrincipal(e), 0);

  switch (key) {
    case "data": return null;
    case "fat_total": return fat;
    case "lucro": return lucro;
    case "margem": return safeDivide(lucro * 100, sum(es, "investimento"));
    case "vendas_principal": return vp;
    case "fat_principal": return es.reduce((a, e) => a + calcFatPrincipal(e), 0);
    case "total_funil": return es.reduce((a, e) => a + calcTotalFunil(e), 0);
    case "cpa": return safeDivide(sum(es, "investimento"), vp);
    case "ticket_medio": return safeDivide(fat, vp);
    case "ob1_taxa": return safeDivide(sum(es, "ob1_vendas") * 100, vp);
    case "ob2_taxa": return safeDivide(sum(es, "ob2_vendas") * 100, vp);
    case "ob3_taxa": return safeDivide(sum(es, "ob3_vendas") * 100, vp);
    case "ob4_taxa": return safeDivide(sum(es, "ob4_vendas") * 100, vp);
    case "ob5_taxa": return safeDivide(sum(es, "ob5_vendas") * 100, vp);
    case "ob6_taxa": return safeDivide(sum(es, "ob6_vendas") * 100, vp);
    case "ob7_taxa": return safeDivide(sum(es, "ob7_vendas") * 100, vp);
    case "ob8_taxa": return safeDivide(sum(es, "ob8_vendas") * 100, vp);
    case "ob9_taxa": return safeDivide(sum(es, "ob9_vendas") * 100, vp);
    case "ob10_taxa": return safeDivide(sum(es, "ob10_vendas") * 100, vp);
    case "upsell_taxa": return safeDivide(sum(es, "upsell_vendas") * 100, vp);
    case "downsell_taxa": return safeDivide(sum(es, "downsell_vendas") * 100, vp);
    case "conv_pag_check": return safeDivide(sum(es, "initiate_checkout") * 100, sum(es, "page_view"));
    case "conv_check_compra": return safeDivide(vp * 100, sum(es, "initiate_checkout"));
    case "conv_pag_compra": return safeDivide(vp * 100, sum(es, "page_view"));
    case "ctr": { const ct = es.filter((e) => e.ctr > 0).length; return ct === 0 ? null : es.reduce((a, e) => a + e.ctr, 0) / ct; }
    case "carregamento": { const ct = es.filter((e) => e.carregamento > 0).length; return ct === 0 ? null : es.reduce((a, e) => a + e.carregamento, 0) / ct; }
    default: return sum(es, key);
  }
}

function fmt(val: number | null, col: ColumnDef): string {
  if (val === null) return "—";
  if (col.key === "vendas_principal") return val.toLocaleString("pt-BR");
  if (col.isCurrency) return `R$ ${centsToBrl(val)}`;
  if (col.isPercent) return `${val.toFixed(2).replace(".", ",")}%`;
  return val.toLocaleString("pt-BR");
}

function dyn(key: string, val: number | null): string {
  if (val === null) return "";
  if (key === "lucro" || key === "margem") return val > 0 ? "text-[#2E7D32]" : val < 0 ? "text-[#C62828]" : "";
  return "";
}

export function TotalsRow({ entries, columns }: Props) {
  return (
    <tr className="bg-gold-lightest font-semibold">
      {columns.map((col) => {
        if (col.key === "data") {
          return <td key={col.key} className="sticky left-0 z-10 border-r border-gold-lighter bg-gold-lightest px-2 py-2 font-table text-[12px] text-navy-dark">Total</td>;
        }
        const val = getTotal(entries, col.key);
        return (
          <td key={col.key} className={`border-r border-gold-lighter bg-gold-lightest px-2 py-2 font-table text-[12px] tabular-nums text-navy-dark ${dyn(col.key, val)}`}>
            {fmt(val, col)}
          </td>
        );
      })}
    </tr>
  );
}
