"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "./auth";
import { calcFaturamentoTotal, calcLucro, safeDivide } from "@/lib/utils/calcMetrics";
import type { DailyEntryRow } from "@/types/daily-entry";

const filtersSchema = z.object({
  perpetuoId: z.string().uuid().optional(),
  dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

type Filters = z.infer<typeof filtersSchema>;

export interface DashboardMetrics {
  investido: number;
  faturamento: number;
  lucro: number;
  margem: number | null;
  cpa: number | null;
  ticketMedio: number | null;
}

export interface ChartPoint {
  data: string;
  faturamento: number;
  lucro: number;
  investimento: number;
}

interface DashboardResult {
  success: boolean;
  data?: { metrics: DashboardMetrics; chart: ChartPoint[] };
  error?: string;
}

export async function getDashboardData(filters: Filters): Promise<DashboardResult> {
  const parsed = filtersSchema.safeParse(filters);
  if (!parsed.success) return { success: false, error: "Filtros inválidos" };

  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Não autenticado" };

  const supabase = createClient();
  let query = supabase.from("daily_entries").select("*, planilhas!inner(perpetuo_id)");

  if (filters.perpetuoId) {
    query = query.eq("planilhas.perpetuo_id", filters.perpetuoId);
  }
  if (filters.dataInicio) query = query.gte("data", filters.dataInicio);
  if (filters.dataFim) query = query.lte("data", filters.dataFim);

  const { data, error } = await query.order("data", { ascending: true });
  if (error) return { success: false, error: "Erro ao buscar dados" };

  const entries = (data ?? []) as (DailyEntryRow & { planilhas: { perpetuo_id: string } })[];

  let investido = 0;
  let faturamento = 0;
  let vendas = 0;

  const chart: ChartPoint[] = [];
  for (const e of entries) {
    const fat = calcFaturamentoTotal(e);
    const luc = calcLucro(e);
    investido += e.investimento;
    faturamento += fat;
    vendas += e.vendas_principal;
    chart.push({ data: e.data, faturamento: fat, lucro: luc, investimento: e.investimento });
  }

  const lucro = faturamento - investido;
  return {
    success: true,
    data: {
      metrics: {
        investido,
        faturamento,
        lucro,
        margem: safeDivide(lucro * 100, faturamento),
        cpa: safeDivide(investido, vendas),
        ticketMedio: safeDivide(faturamento, vendas),
      },
      chart,
    },
  };
}
