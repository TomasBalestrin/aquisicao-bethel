import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateApiKey } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";
import {
  calcVendasPrincipal,
  calcFaturamentoTotal,
} from "@/lib/utils/calcMetrics";
import type { DailyEntryRow } from "@/types/daily-entry";
import type { PlanilhaTotais } from "@/types/api";

function calcTotais(entries: DailyEntryRow[]): PlanilhaTotais {
  let investimento = 0;
  let faturamento_total = 0;
  let vendas_principal = 0;
  for (const e of entries) {
    investimento += e.investimento;
    faturamento_total += calcFaturamentoTotal(e);
    vendas_principal += calcVendasPrincipal(e);
  }
  const lucro = faturamento_total - investimento;
  const margem =
    investimento > 0
      ? Math.round((lucro / investimento) * 100 * 100) / 100
      : 0;
  const cpa =
    vendas_principal > 0 ? Math.round(investimento / vendas_principal) : 0;
  const ticket_medio =
    vendas_principal > 0
      ? Math.round(faturamento_total / vendas_principal)
      : 0;
  return {
    investimento,
    faturamento_total,
    lucro,
    margem,
    vendas_principal,
    cpa,
    ticket_medio,
  };
}

function stripMeta(e: DailyEntryRow): Omit<
  DailyEntryRow,
  "id" | "planilha_id" | "created_at" | "updated_at"
> {
  const { id, planilha_id, created_at, updated_at, ...rest } = e;
  void id;
  void planilha_id;
  void created_at;
  void updated_at;
  return rest;
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ id: string; planilhaId: string }> },
) {
  try {
    const { id, planilhaId } = await params;

    const userId = await validateApiKey(request);
    if (!userId) {
      return apiError("unauthorized", "API key inválida ou ausente", 401);
    }

    const supabase = createAdminClient();

    const { data: planilha, error: planilhaError } = await supabase
      .from("planilhas")
      .select("*")
      .eq("id", planilhaId)
      .eq("perpetuo_id", id)
      .maybeSingle();

    if (planilhaError) {
      return apiError("internal_error", "Erro interno do servidor", 500);
    }
    if (!planilha) {
      return apiError("not_found", "Planilha não encontrada", 404);
    }

    const url = new URL(request.url);
    const de = url.searchParams.get("de");
    const ate = url.searchParams.get("ate");

    let query = supabase
      .from("daily_entries")
      .select("*")
      .eq("planilha_id", planilhaId)
      .order("data", { ascending: true });
    if (de) query = query.gte("data", de);
    if (ate) query = query.lte("data", ate);

    const { data: entries, error: entriesError } = await query;
    if (entriesError || !entries) {
      return apiError("internal_error", "Erro interno do servidor", 500);
    }

    const totais = calcTotais(entries);
    const cleanEntries = entries.map(stripMeta);

    return apiSuccess({ ...planilha, entries: cleanEntries, totais });
  } catch {
    return apiError("internal_error", "Erro interno do servidor", 500);
  }
}
