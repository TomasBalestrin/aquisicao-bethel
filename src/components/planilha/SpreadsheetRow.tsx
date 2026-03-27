"use client";

import { memo, useCallback } from "react";
import type { DailyEntryRow } from "@/types/daily-entry";
import type { ColumnDef } from "./columnDefs";
import { EditableCell } from "./EditableCell";
import { calcFaturamentoTotal, calcLucro, calcMargem, calcCpa, calcTicketMedio, safeDivide, centsToBrl } from "@/lib/utils/calcMetrics";

interface Props {
  entry: DailyEntryRow;
  columns: ColumnDef[];
  onUpdate: (entryId: string, field: string, value: number) => void;
}

function getCalcValue(entry: DailyEntryRow, key: string): number | null {
  switch (key) {
    case "fat_total": return calcFaturamentoTotal(entry);
    case "lucro": return calcLucro(entry);
    case "margem": return calcMargem(entry);
    case "cpa": return calcCpa(entry);
    case "ticket_medio": return calcTicketMedio(entry);
    case "pag_compra": return safeDivide(entry.vendas_principal * 100, entry.page_view);
    case "pag_check": return safeDivide(entry.initiate_checkout * 100, entry.page_view);
    case "check_compra": return safeDivide(entry.vendas_principal * 100, entry.initiate_checkout);
    default: return null;
  }
}

function formatCalc(val: number | null, col: ColumnDef): string {
  if (val === null) return "—";
  if (col.isCurrency) return `R$ ${centsToBrl(val)}`;
  if (col.isPercent) return `${val.toFixed(2)}%`;
  return String(val);
}

function formatDay(dateStr: string): string {
  return dateStr.split("-")[2] ?? dateStr;
}

export const SpreadsheetRow = memo(function SpreadsheetRow({ entry, columns, onUpdate }: Props) {
  const handleCellUpdate = useCallback(
    (field: string, value: number) => onUpdate(entry.id, field, value),
    [entry.id, onUpdate]
  );

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      {columns.map((col) => {
        if (col.key === "data") {
          return (
            <td key={col.key} className="border-r border-gray-200 px-2 py-1.5 font-mono text-[12px] font-medium text-navy-70">
              {formatDay(entry.data)}
            </td>
          );
        }

        if (!col.editable) {
          const val = getCalcValue(entry, col.key);
          return (
            <td key={col.key} className="border-r border-gray-200 bg-gray-50 px-2 py-1.5 font-mono text-[12px] tabular-nums text-navy-70">
              {formatCalc(val, col)}
            </td>
          );
        }

        const rawVal = entry[col.key as keyof DailyEntryRow] as number;
        return (
          <td key={col.key} className="border-r border-gray-200 p-0">
            <EditableCell
              entryId={entry.id}
              field={col.key}
              value={rawVal}
              isCurrency={col.isCurrency}
              isPercent={col.isPercent}
              onUpdate={handleCellUpdate}
            />
          </td>
        );
      })}
    </tr>
  );
});
