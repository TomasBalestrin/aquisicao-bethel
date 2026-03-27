"use client";

import { memo, useCallback } from "react";
import type { DailyEntryRow } from "@/types/daily-entry";
import type { ColumnDef } from "./columnDefs";
import { GROUP_COLORS } from "./columnDefs";
import { EditableCell } from "./EditableCell";
import { calcFaturamentoTotal, calcLucro, calcMargem, calcCpa, calcTicketMedio, safeDivide, centsToBrl } from "@/lib/utils/calcMetrics";

interface Props {
  entry: DailyEntryRow;
  columns: ColumnDef[];
  onUpdate: (entryId: string, field: string, value: number) => void;
}

function calcExtras(e: DailyEntryRow): number {
  return e.ob1_faturado + e.ob2_faturado + e.ob3_faturado
    + e.ob4_faturado + e.ob5_faturado + e.upsell_faturado + e.downsell_faturado;
}

function getCalcValue(e: DailyEntryRow, key: string): number | null {
  switch (key) {
    case "fat_total": return calcFaturamentoTotal(e);
    case "lucro": return calcLucro(e);
    case "margem": return calcMargem(e);
    case "cpa": return calcCpa(e);
    case "ticket_medio": return calcTicketMedio(e);
    case "fat_extras": return calcExtras(e);
    case "vendas_principal_num": return e.vendas_principal;
    case "pag_compra": return safeDivide(e.vendas_principal * 100, e.page_view);
    case "pag_check": return safeDivide(e.initiate_checkout * 100, e.page_view);
    case "check_compra": return safeDivide(e.vendas_principal * 100, e.initiate_checkout);
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

function formatCalc(val: number | null, col: ColumnDef): string {
  if (val === null) return "—";
  if (col.key === "vendas_principal_num") return String(val);
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
            <td key={col.key} className="border-r border-gray-200 px-2 py-1.5 font-sans text-[12px] font-medium text-navy-70">
              {formatDate(entry.data)}
            </td>
          );
        }
        if (!col.editable) {
          const val = getCalcValue(entry, col.key);
          return (
            <td key={col.key} className={`border-r border-gray-200 ${cellBg} px-2 py-1.5 font-sans text-[12px] tabular-nums ${dynColor(col.key, val)}`}>
              {formatCalc(val, col)}
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
