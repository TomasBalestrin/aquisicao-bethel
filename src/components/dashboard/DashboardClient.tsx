"use client";

import { useState, useEffect, useCallback } from "react";
import { DollarSign, TrendingUp, Minus, Percent, Target, Ticket, XCircle, RefreshCw } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getDashboardData({
      perpetuoId: perpetuoId || undefined,
      dataInicio: dataInicio || undefined,
      dataFim: dataFim || undefined,
    });
    if (result.success && result.data) {
      setMetrics(result.data.metrics);
      setChart(result.data.chart);
    } else {
      setError(result.error ?? "Erro ao carregar dados do dashboard");
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
      <h1 className="text-[28px] font-bold tracking-[-0.5px] text-navy-dark">Dashboard</h1>

      <DashboardFilters
        perpetuos={perpetuos} perpetuoId={perpetuoId}
        dataInicio={dataInicio} dataFim={dataFim}
        onPerpetuo={setPerpetuoId} onDataInicio={setDataInicio} onDataFim={setDataFim}
      />

      {loading ? (
        <p className="text-sm text-navy-50">Carregando...</p>
      ) : error ? (
        <div className="flex items-start gap-3 rounded-[6px] bg-[#FFEBEE] p-4">
          <XCircle size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-error" />
          <div className="flex-1">
            <p className="text-[13px] text-error">{error}</p>
            <button onClick={fetchData} className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-error hover:underline">
              <RefreshCw size={14} strokeWidth={2} />
              Tentar novamente
            </button>
          </div>
        </div>
      ) : !metrics || (metrics.investido === 0 && metrics.faturamento === 0) ? (
        <p className="mt-8 text-center text-sm text-navy-50">Sem dados para o período selecionado</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => <MetricCard key={c.label} icon={c.icon} label={c.label} value={c.value} />)}
          </div>
          <EvolutionChart data={chart} />
        </>
      )}
    </div>
  );
}
