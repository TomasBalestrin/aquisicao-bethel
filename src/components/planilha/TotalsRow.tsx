"use client";

import type { DailyEntryRow } from "@/types/daily-entry";
import type { ColumnDef } from "./columnDefs";
import { GROUP_COLORS } from "./columnDefs";
import { calcFaturamentoTotal, calcLucro, safeDivide, centsToBrl } from "@/lib/utils/calcMetrics";

interface Props {
  entries: DailyEntryRow[];
  columns: ColumnDef[];
}

function sumField(entries: DailyEntryRow[], field: string): number {
  return entries.reduce((acc, e) => acc + (e[field as keyof DailyEntryRow] as number ?? 0), 0);
}

function calcTotalExtras(entries: DailyEntryRow[]): number {
  return entries.reduce((a, e) =>
    a + e.ob1_faturado + e.ob2_faturado + e.ob3_faturado
    + e.ob4_faturado + e.ob5_faturado + e.upsell_faturado + e.downsell_faturado, 0);
}

function getTotal(entries: DailyEntryRow[], key: string): number | null {
  if (entries.length === 0) return null;
  const fat = entries.reduce((a, e) => a + calcFaturamentoTotal(e), 0);
  const lucro = entries.reduce((a, e) => a + calcLucro(e), 0);
  const vendas = sumField(entries, "vendas_principal");

  switch (key) {
    case "data": return null;
    case "fat_total": return fat;
    case "lucro": return lucro;
    case "margem": return safeDivide(lucro * 100, fat);
    case "cpa": return safeDivide(sumField(entries, "investimento"), vendas);
    case "ticket_medio": return safeDivide(fat, vendas);
    case "fat_extras": return calcTotalExtras(entries);
    case "vendas_principal_num": return vendas;
    case "pag_compra": return safeDivide(vendas * 100, sumField(entries, "page_view"));
    case "pag_check": return safeDivide(sumField(entries, "initiate_checkout") * 100, sumField(entries, "page_view"));
    case "check_compra": return safeDivide(vendas * 100, sumField(entries, "initiate_checkout"));
    case "ctr": {
      const ct = entries.filter((e) => e.ctr > 0).length;
      return ct === 0 ? null : entries.reduce((a, e) => a + e.ctr, 0) / ct;
    }
    default: return sumField(entries, key);
  }
}

function fmtTotal(val: number | null, col: ColumnDef): string {
  if (val === null) return "—";
  if (col.key === "vendas_principal_num") return val.toLocaleString("pt-BR");
  if (col.isCurrency) return `R$ ${centsToBrl(val)}`;
  if (col.isPercent) return `${val.toFixed(2)}%`;
  return val.toLocaleString("pt-BR");
}

function dynColor(key: string, val: number | null): string {
  if (val === null) return "";
  if (key === "lucro" || key === "margem") {
    return val > 0 ? "text-[#2E7D32]" : val < 0 ? "text-[#C62828]" : "";
  }
  return "";
}

export function TotalsRow({ entries, columns }: Props) {
  return (
    <tr className="bg-gold-lightest font-semibold">
      {columns.map((col) => {
        const gc = GROUP_COLORS[col.group];
        const cellBg = gc?.cell ? "bg-gold-lightest" : "bg-gold-lightest";
        if (col.key === "data") {
          return (
            <td key={col.key} className={`border-r border-gold-lighter ${cellBg} px-2 py-2 font-mono text-[12px] text-navy-dark`}>
              Total
            </td>
          );
        }
        const val = getTotal(entries, col.key);
        return (
          <td key={col.key} className={`border-r border-gold-lighter ${cellBg} px-2 py-2 font-mono text-[12px] tabular-nums text-navy-dark ${dynColor(col.key, val)}`}>
            {fmtTotal(val, col)}
          </td>
        );
      })}
    </tr>
  );
}
