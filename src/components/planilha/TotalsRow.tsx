"use client";

import type { DailyEntryRow } from "@/types/daily-entry";
import type { ColumnDef } from "./columnDefs";
import { calcFaturamentoTotal, calcLucro, safeDivide, centsToBrl } from "@/lib/utils/calcMetrics";

interface Props {
  entries: DailyEntryRow[];
  columns: ColumnDef[];
}

function sumField(entries: DailyEntryRow[], field: string): number {
  return entries.reduce((acc, e) => acc + (e[field as keyof DailyEntryRow] as number ?? 0), 0);
}

function getTotalValue(entries: DailyEntryRow[], key: string): number | null {
  if (entries.length === 0) return null;
  switch (key) {
    case "data": return null;
    case "fat_total": return entries.reduce((a, e) => a + calcFaturamentoTotal(e), 0);
    case "lucro": return entries.reduce((a, e) => a + calcLucro(e), 0);
    case "margem": {
      const fat = entries.reduce((a, e) => a + calcFaturamentoTotal(e), 0);
      const lucro = entries.reduce((a, e) => a + calcLucro(e), 0);
      return safeDivide(lucro * 100, fat);
    }
    case "cpa": return safeDivide(sumField(entries, "investimento"), sumField(entries, "vendas_principal"));
    case "ticket_medio": {
      const fat = entries.reduce((a, e) => a + calcFaturamentoTotal(e), 0);
      return safeDivide(fat, sumField(entries, "vendas_principal"));
    }
    case "pag_compra": return safeDivide(sumField(entries, "vendas_principal") * 100, sumField(entries, "page_view"));
    case "pag_check": return safeDivide(sumField(entries, "initiate_checkout") * 100, sumField(entries, "page_view"));
    case "check_compra": return safeDivide(sumField(entries, "vendas_principal") * 100, sumField(entries, "initiate_checkout"));
    case "ctr": {
      const count = entries.filter((e) => e.ctr > 0).length;
      return count === 0 ? null : entries.reduce((a, e) => a + e.ctr, 0) / count;
    }
    default: return sumField(entries, key);
  }
}

function formatTotal(val: number | null, col: ColumnDef): string {
  if (val === null) return "—";
  if (col.isCurrency) return `R$ ${centsToBrl(val)}`;
  if (col.isPercent) return `${val.toFixed(2)}%`;
  return val.toLocaleString("pt-BR");
}

export function TotalsRow({ entries, columns }: Props) {
  return (
    <tr className="bg-gold-lightest font-semibold">
      {columns.map((col) => {
        if (col.key === "data") {
          return (
            <td key={col.key} className="border-r border-gold-lighter px-2 py-2 font-mono text-[12px] text-navy-dark">
              Total
            </td>
          );
        }
        const val = getTotalValue(entries, col.key);
        return (
          <td key={col.key} className="border-r border-gold-lighter px-2 py-2 font-mono text-[12px] tabular-nums text-navy-dark">
            {formatTotal(val, col)}
          </td>
        );
      })}
    </tr>
  );
}
