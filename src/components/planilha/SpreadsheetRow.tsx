"use client";

import { memo, useCallback, useMemo } from "react";
import type { DailyEntryRow } from "@/types/daily-entry";
import type { ColumnDef } from "./columnDefs";
import { GROUP_COLORS, CALC_BG } from "./columnDefs";
import { EditableCell } from "./EditableCell";
import {
  calcFaturamentoTotal, calcVendasPrincipal, calcFatPrincipal,
  calcTotalFunil, safeDivide, centsToBrl,
} from "@/lib/utils/calcMetrics";

interface Props {
  entry: DailyEntryRow;
  columns: ColumnDef[];
  onUpdate: (entryId: string, field: string, value: number) => void;
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
  if (col.key === "vendas_principal") return val.toLocaleString("pt-BR");
  if (col.isCurrency) return `R$ ${centsToBrl(val)}`;
  if (col.isPercent) return `${val.toFixed(2).replace(".", ",")}%`;
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

  const calc = useMemo(() => {
    const vp = calcVendasPrincipal(entry);
    const ft = calcFaturamentoTotal(entry);
    const lucro = ft - entry.investimento;
    return {
      fat_total: ft, lucro, vendas_principal: vp,
      margem: ft === 0 ? null : (lucro / ft) * 100,
      fat_principal: calcFatPrincipal(entry),
      total_funil: calcTotalFunil(entry),
      cpa: safeDivide(entry.investimento, vp),
      ticket_medio: safeDivide(ft, vp),
      ob1_taxa: safeDivide(entry.ob1_vendas * 100, vp),
      ob2_taxa: safeDivide(entry.ob2_vendas * 100, vp),
      ob3_taxa: safeDivide(entry.ob3_vendas * 100, vp),
      ob4_taxa: safeDivide(entry.ob4_vendas * 100, vp),
      ob5_taxa: safeDivide(entry.ob5_vendas * 100, vp),
      ob6_taxa: safeDivide(entry.ob6_vendas * 100, vp),
      ob7_taxa: safeDivide(entry.ob7_vendas * 100, vp),
      ob8_taxa: safeDivide(entry.ob8_vendas * 100, vp),
      ob9_taxa: safeDivide(entry.ob9_vendas * 100, vp),
      ob10_taxa: safeDivide(entry.ob10_vendas * 100, vp),
      upsell_taxa: safeDivide(entry.upsell_vendas * 100, vp),
      downsell_taxa: safeDivide(entry.downsell_vendas * 100, vp),
      conv_pag_check: safeDivide(entry.initiate_checkout * 100, entry.page_view),
      conv_check_compra: safeDivide(vp * 100, entry.initiate_checkout),
      conv_pag_compra: safeDivide(vp * 100, entry.page_view),
    } as Record<string, number | null>;
  }, [entry]);

  return (
    <tr className="border-b border-gray-200">
      {columns.map((col) => {
        const gc = GROUP_COLORS[col.group];

        if (col.key === "data") {
          return (
            <td key={col.key} className="sticky left-0 z-10 border-r border-gray-200 bg-white px-2 py-1.5 font-table text-[12px] font-medium text-navy-70">
              {formatDate(entry.data)}
            </td>
          );
        }
        if (!col.editable) {
          const val = calc[col.key] ?? null;
          return (
            <td key={col.key} className={`border-r border-gray-200 px-2 py-1.5 font-table text-[12px] tabular-nums ${dynColor(col.key, val)}`} style={{ backgroundColor: gc?.cellBg || CALC_BG }}>
              {fmtCalc(val, col)}
            </td>
          );
        }
        const rawVal = entry[col.key as keyof DailyEntryRow] as number;
        return (
          <td key={col.key} className="border-r border-gray-200 p-0" style={gc?.cellBg ? { backgroundColor: gc.cellBg } : undefined}>
            <EditableCell entryId={entry.id} field={col.key} value={rawVal} isCurrency={col.isCurrency} isPercent={col.isPercent} onUpdate={handleCellUpdate} />
          </td>
        );
      })}
    </tr>
  );
});
