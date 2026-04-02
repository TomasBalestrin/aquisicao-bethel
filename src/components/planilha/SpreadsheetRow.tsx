"use client";

import { memo, useCallback } from "react";
import type { DailyEntryRow } from "@/types/daily-entry";
import type { ColumnDef } from "./columnDefs";
import { GROUP_COLORS } from "./columnDefs";
import { EditableCell } from "./EditableCell";
import {
  calcFaturamentoTotal, calcLucro, calcMargem, calcCpa, calcTicketMedio,
  calcVendasPrincipal, calcFatPrincipal, calcTotalFunil, calcCarregamento,
  safeDivide, centsToBrl,
} from "@/lib/utils/calcMetrics";

interface Props {
  entry: DailyEntryRow;
  columns: ColumnDef[];
  onUpdate: (entryId: string, field: string, value: number) => void;
}

function getCalcValue(e: DailyEntryRow, key: string): number | null {
  const vp = calcVendasPrincipal(e);
  switch (key) {
    case "fat_total": return calcFaturamentoTotal(e);
    case "lucro": return calcLucro(e);
    case "margem": return calcMargem(e);
    case "cpa": return calcCpa(e);
    case "ticket_medio": return calcTicketMedio(e);
    case "vendas_principal": return vp;
    case "fat_principal": return calcFatPrincipal(e);
    case "total_funil": return calcTotalFunil(e);
    case "calc_carregamento": return calcCarregamento(e);
    case "ob1_taxa": return safeDivide(e.ob1_vendas * 100, vp);
    case "ob2_taxa": return safeDivide(e.ob2_vendas * 100, vp);
    case "ob3_taxa": return safeDivide(e.ob3_vendas * 100, vp);
    case "ob4_taxa": return safeDivide(e.ob4_vendas * 100, vp);
    case "ob5_taxa": return safeDivide(e.ob5_vendas * 100, vp);
    case "ob6_taxa": return safeDivide(e.ob6_vendas * 100, vp);
    case "upsell_taxa": return safeDivide(e.upsell_vendas * 100, vp);
    case "downsell_taxa": return safeDivide(e.downsell_vendas * 100, vp);
    case "conv_pag_check": return safeDivide(e.initiate_checkout * 100, e.page_view);
    case "conv_check_compra": return safeDivide(vp * 100, e.initiate_checkout);
    case "conv_pag_compra": return safeDivide(vp * 100, e.page_view);
    default: return null;
  }
}

function dynColor(key: string, val: number | null): string {
  if (val === null) return "text-navy-70";
  if (key === "lucro" || key === "margem") {
    return val > 0 ? "text-[#2E7D32]" : val < 0 ? "text-[#C62828]" : "text-navy-70";
  }
  return "text-navy-70";
}

function fmtCalc(val: number | null, col: ColumnDef): string {
  if (val === null) return "—";
  if (col.key === "vendas_principal" || col.key === "calc_carregamento") return val.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
  if (col.isCurrency) return `R$ ${centsToBrl(val)}`;
  if (col.isPercent) return `${val.toFixed(2)}%`;
  return String(val);
}

function formatDate(d: string): string {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export const SpreadsheetRow = memo(function SpreadsheetRow({ entry, columns, onUpdate }: Props) {
  const handleCellUpdate = useCallback(
    (field: string, value: number) => onUpdate(entry.id, field, value),
    [entry.id, onUpdate]
  );

  return (
    <tr className="border-b border-gray-200">
      {columns.map((col) => {
        const gc = GROUP_COLORS[col.group];
        const cellBg = gc?.cell ?? "";

        if (col.key === "data") {
          return (
            <td key={col.key} className="border-r border-gray-200 px-2 py-1.5 font-table text-[12px] font-medium text-navy-70">
              {formatDate(entry.data)}
            </td>
          );
        }
        if (!col.editable) {
          const val = getCalcValue(entry, col.key);
          return (
            <td key={col.key} className={`border-r border-gray-200 ${cellBg} px-2 py-1.5 font-table text-[12px] tabular-nums ${dynColor(col.key, val)}`}>
              {fmtCalc(val, col)}
            </td>
          );
        }
        const rawVal = entry[col.key as keyof DailyEntryRow] as number;
        return (
          <td key={col.key} className={`border-r border-gray-200 ${cellBg} p-0`}>
            <EditableCell entryId={entry.id} field={col.key} value={rawVal} isCurrency={col.isCurrency} isPercent={col.isPercent} onUpdate={handleCellUpdate} />
          </td>
        );
      })}
    </tr>
  );
});
