"use client";

import { useState, useEffect, useCallback } from "react";
import { DollarSign, TrendingUp, Minus, Percent, Target, Ticket } from "lucide-react";
import { getDashboardData, type DashboardMetrics, type ChartPoint } from "@/actions/dashboard";
import { formatBrl, formatPercent } from "@/lib/utils/formatCurrency";
import { DashboardFilters } from "./DashboardFilters";
import { MetricCard } from "./MetricCard";
import { EvolutionChart } from "./EvolutionChart";

interface Perpetuo { id: string; name: string }
interface Props { perpetuos: Perpetuo[] }

export function DashboardClient({ perpetuos }: Props) {
  const [perpetuoId, setPerpetuoId] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await getDashboardData({
      perpetuoId: perpetuoId || undefined,
      dataInicio: dataInicio || undefined,
      dataFim: dataFim || undefined,
    });
    if (result.success && result.data) {
      setMetrics(result.data.metrics);
      setChart(result.data.chart);
    }
    setLoading(false);
  }, [perpetuoId, dataInicio, dataFim]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const cards = metrics ? [
    { icon: DollarSign, label: "Total Investido", value: formatBrl(metrics.investido) },
    { icon: TrendingUp, label: "Faturamento Total", value: formatBrl(metrics.faturamento) },
    { icon: Minus, label: "Lucro", value: formatBrl(metrics.lucro) },
    { icon: Percent, label: "Margem", value: formatPercent(metrics.margem) },
    { icon: Target, label: "CPA Médio", value: metrics.cpa !== null ? formatBrl(metrics.cpa) : "—" },
    { icon: Ticket, label: "Ticket Médio", value: metrics.ticketMedio !== null ? formatBrl(metrics.ticketMedio) : "—" },
  ] : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold tracking-[-0.5px] text-navy-dark">Dashboard</h1>
      </div>

      <DashboardFilters
        perpetuos={perpetuos} perpetuoId={perpetuoId}
        dataInicio={dataInicio} dataFim={dataFim}
        onPerpetuo={setPerpetuoId} onDataInicio={setDataInicio} onDataFim={setDataFim}
      />

      {loading ? (
        <p className="text-sm text-navy-50">Carregando...</p>
      ) : !metrics || (metrics.investido === 0 && metrics.faturamento === 0) ? (
        <p className="mt-8 text-center text-sm text-navy-50">Sem dados para o período selecionado</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <MetricCard key={c.label} icon={c.icon} label={c.label} value={c.value} />
            ))}
          </div>
          <EvolutionChart data={chart} />
        </>
      )}
    </div>
  );
}
