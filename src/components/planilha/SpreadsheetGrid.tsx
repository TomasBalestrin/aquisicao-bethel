"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { EyeOff } from "lucide-react";
import type { DailyEntryRow } from "@/types/daily-entry";
import { getColumns, GROUP_COLORS, type ColumnDef } from "./columnDefs";
import { SpreadsheetRow } from "./SpreadsheetRow";
import { TotalsRow } from "./TotalsRow";
import { PlanilhaKPIs } from "./PlanilhaKPIs";

interface Props {
  entries: DailyEntryRow[];
  planilhaId: string;
  planilha: {
    ob1_nome: string; ob2_nome: string; ob3_nome: string;
    ob4_nome: string; ob5_nome: string; ob6_nome: string;
    ob7_nome: string; ob8_nome: string; ob9_nome: string; ob10_nome: string;
    upsell_nome: string; downsell_nome: string;
    plat1_nome: string; plat2_nome: string; plat3_nome: string;
    plat4_nome: string; plat5_nome: string;
  };
}

const STORAGE_KEY = (id: string) => `hidden-columns-${id}`;

export function SpreadsheetGrid({ entries: initial, planilhaId, planilha }: Props) {
  const [entries, setEntries] = useState(initial);
  const allColumns = useMemo(() => getColumns(planilha), [planilha]);
  const [hidden, setHidden] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    const stored = localStorage.getItem(STORAGE_KEY(planilhaId));
    return stored ? new Set(JSON.parse(stored) as string[]) : new Set();
  });

  useEffect(() => {
    if (hidden.size === 0) localStorage.removeItem(STORAGE_KEY(planilhaId));
    else localStorage.setItem(STORAGE_KEY(planilhaId), JSON.stringify(Array.from(hidden)));
  }, [hidden, planilhaId]);

  const columns = useMemo(() => allColumns.filter((c) => !hidden.has(c.key)), [allColumns, hidden]);

  const handleUpdate = useCallback((entryId: string, field: string, value: number) => {
    setEntries((prev) => prev.map((e) => (e.id === entryId ? { ...e, [field]: value } : e)));
  }, []);

  const hideColumn = useCallback((key: string) => {
    setHidden((prev) => { const next = new Set(prev); next.add(key); return next; });
  }, []);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__showAllColumns = () => setHidden(new Set());
    return () => { delete (window as unknown as Record<string, unknown>).__showAllColumns; };
  }, []);

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      {/* KPIs — fixos, nunca scrollam */}
      <div className="flex-shrink-0">
        <PlanilhaKPIs entries={entries} />
      </div>

      {/* Tabela — preenche espaço restante, scroll interno */}
      <div className="flex-1 overflow-x-auto overflow-y-auto rounded-lg border border-gray-200">
        <table className="min-w-max border-collapse">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <HeaderCell key={col.key} col={col} onHide={hideColumn} isFirst={i === 0} />
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <SpreadsheetRow key={entry.id} entry={entry} columns={columns} onUpdate={handleUpdate} />
            ))}
          </tbody>
          <tfoot>
            <TotalsRow entries={entries} columns={columns} />
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function HeaderCell({ col, onHide, isFirst }: { col: ColumnDef; onHide: (key: string) => void; isFirst: boolean }) {
  const gc = GROUP_COLORS[col.group];
  const fallbackBg = !col.editable && col.key !== "data" ? "bg-[#3d5a80]" : "bg-navy-dark";
  const canHide = col.key !== "data";
  const stickyClass = isFirst ? "sticky left-0 top-0 z-30" : "sticky top-0 z-20";

  return (
    <th
      className={`${col.width} ${stickyClass} group/th relative whitespace-nowrap border-b border-r border-white/10 ${gc ? "" : fallbackBg} px-2 py-2.5 text-left font-table text-[11px] font-semibold ${gc ? "" : "text-white"}`}
      style={gc ? { backgroundColor: gc.headerBg, color: gc.headerText } : undefined}
    >
      {col.label}
      {canHide && (
        <button onClick={() => onHide(col.key)} className="absolute right-1 top-1/2 hidden -translate-y-1/2 rounded p-0.5 opacity-0 transition-opacity hover:opacity-100 group-hover/th:opacity-60" title={`Ocultar ${col.label}`}>
          <EyeOff size={12} strokeWidth={2} />
        </button>
      )}
    </th>
  );
}
