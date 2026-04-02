"use client";

import type { DailyEntryRow } from "@/types/daily-entry";
import {
  calcFaturamentoTotal, calcVendasPrincipal, safeDivide, centsToBrl,
} from "@/lib/utils/calcMetrics";

interface Props {
  entries: DailyEntryRow[];
}

function formatVal(cents: number): string {
  return `R$ ${centsToBrl(cents)}`;
}

function formatPct(val: number | null): string {
  if (val === null) return "—";
  return `${val.toFixed(1).replace(".", ",")}%`;
}

export function PlanilhaKPIs({ entries }: Props) {
  const investimento = entries.reduce((a, e) => a + e.investimento, 0);
  const faturamento = entries.reduce((a, e) => a + calcFaturamentoTotal(e), 0);
  const vendas = entries.reduce((a, e) => a + calcVendasPrincipal(e), 0);
  const lucro = faturamento - investimento;
  const margem = safeDivide(lucro * 100, faturamento);
  const cpa = safeDivide(investimento, vendas);
  const ticket = safeDivide(faturamento, vendas);

  const hasData = investimento > 0 || faturamento > 0;
  const lucroColor = lucro > 0 ? "text-success" : lucro < 0 ? "text-error" : "text-navy-dark";
  const margemColor = margem !== null && margem > 0 ? "text-success" : margem !== null && margem < 0 ? "text-error" : "text-navy-dark";

  const kpis = [
    { label: "Investimento", value: hasData ? formatVal(investimento) : "—", color: "text-navy-dark" },
    { label: "Faturamento", value: hasData ? formatVal(faturamento) : "—", color: "text-navy-dark" },
    { label: "Lucro", value: hasData ? formatVal(lucro) : "—", color: lucroColor },
    { label: "Margem", value: hasData ? formatPct(margem) : "—", color: margemColor },
    { label: "CPA", value: hasData && cpa !== null ? formatVal(cpa) : "—", color: "text-navy-dark" },
    { label: "Ticket Médio", value: hasData && ticket !== null ? formatVal(ticket) : "—", color: "text-navy-dark" },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-[12px] font-semibold text-navy-70">{kpi.label}</p>
          <p className={`mt-1 font-mono text-[22px] font-extrabold tracking-[-0.5px] ${kpi.color}`}>
            {kpi.value}
          </p>
        </div>
      ))}
    </div>
  );
}
