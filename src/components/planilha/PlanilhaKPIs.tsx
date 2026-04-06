"use client";

import { useMemo } from "react";
import type { DailyEntryRow } from "@/types/daily-entry";
import {
  calcFaturamentoTotal, calcVendasPrincipal, safeDivide, centsToBrl,
} from "@/lib/utils/calcMetrics";

interface Props {
  entries: DailyEntryRow[];
}

function fmtVal(cents: number): string {
  return `R$ ${centsToBrl(cents)}`;
}

function fmtPct(val: number | null): string {
  if (val === null) return "—";
  return `${val.toFixed(1).replace(".", ",")}%`;
}

export function PlanilhaKPIs({ entries }: Props) {
  const data = useMemo(() => {
    const inv = entries.reduce((a, e) => a + e.investimento, 0);
    const fat = entries.reduce((a, e) => a + calcFaturamentoTotal(e), 0);
    const vd = entries.reduce((a, e) => a + calcVendasPrincipal(e), 0);
    const lucro = fat - inv;
    return {
      inv, fat, lucro,
      margem: safeDivide(lucro * 100, fat),
      cpa: safeDivide(inv, vd),
      ticket: safeDivide(fat, vd),
    };
  }, [entries]);

  const has = data.inv > 0 || data.fat > 0;
  const lcCl = data.lucro > 0 ? "text-success" : data.lucro < 0 ? "text-error" : "text-navy-dark";
  const mgCl = data.margem !== null && data.margem > 0 ? "text-success" : data.margem !== null && data.margem < 0 ? "text-error" : "text-navy-dark";

  const kpis = [
    { label: "INVESTIMENTO", value: has ? fmtVal(data.inv) : "—", color: "text-navy-dark" },
    { label: "FATURAMENTO", value: has ? fmtVal(data.fat) : "—", color: "text-navy-dark" },
    { label: "LUCRO", value: has ? fmtVal(data.lucro) : "—", color: lcCl },
    { label: "MARGEM", value: has ? fmtPct(data.margem) : "—", color: mgCl },
    { label: "CPA", value: has && data.cpa !== null ? fmtVal(data.cpa) : "—", color: "text-navy-dark" },
    { label: "TICKET MÉDIO", value: has && data.ticket !== null ? fmtVal(data.ticket) : "—", color: "text-navy-dark" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {kpis.map((k) => (
        <div key={k.label} className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-[11px] font-bold uppercase tracking-[1px] text-navy-50">{k.label}</p>
          <p className={`mt-1 font-mono text-[20px] font-extrabold tracking-[-0.5px] ${k.color}`}>
            {k.value}
          </p>
        </div>
      ))}
    </div>
  );
}
