"use client";

import { useState, useCallback } from "react";
import type { DailyEntryRow } from "@/types/daily-entry";
import { getColumns } from "./columnDefs";
import { SpreadsheetRow } from "./SpreadsheetRow";
import { TotalsRow } from "./TotalsRow";

interface Props {
  entries: DailyEntryRow[];
  planilha: {
    ob1_nome: string; ob2_nome: string; ob3_nome: string;
    ob4_nome: string; ob5_nome: string;
    upsell_nome: string; downsell_nome: string;
  };
}

export function SpreadsheetGrid({ entries: initial, planilha }: Props) {
  const [entries, setEntries] = useState(initial);
  const columns = getColumns(planilha);

  const handleUpdate = useCallback((entryId: string, field: string, value: number) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, [field]: value } : e))
    );
  }, []);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-max min-w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${col.width} whitespace-nowrap border-b border-r border-navy/20 bg-navy-dark px-2 py-2.5 text-left text-[11px] font-semibold text-white ${!col.editable && col.key !== "data" ? "bg-navy" : ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <SpreadsheetRow
              key={entry.id}
              entry={entry}
              columns={columns}
              onUpdate={handleUpdate}
            />
          ))}
        </tbody>
        <tfoot>
          <TotalsRow entries={entries} columns={columns} />
        </tfoot>
      </table>
    </div>
  );
}
