import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateApiKey } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";
import type { PlanilhaListItem } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const userId = await validateApiKey(request);
    if (!userId) {
      return apiError("unauthorized", "API key inválida ou ausente", 401);
    }

    const supabase = createAdminClient();

    const { data: perpetuo, error: perpetuoError } = await supabase
      .from("perpetuos")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (perpetuoError) {
      return apiError("internal_error", "Erro interno do servidor", 500);
    }
    if (!perpetuo) {
      return apiError("not_found", "Perpétuo não encontrado", 404);
    }

    const { data: planilhas, error: planilhasError } = await supabase
      .from("planilhas")
      .select("id, mes, ano")
      .eq("perpetuo_id", id)
      .order("ano", { ascending: false })
      .order("mes", { ascending: false });

    if (planilhasError || !planilhas) {
      return apiError("internal_error", "Erro interno do servidor", 500);
    }

    const data: PlanilhaListItem[] = await Promise.all(
      planilhas.map(async (p) => {
        const { count } = await supabase
          .from("daily_entries")
          .select("id", { count: "exact", head: true })
          .eq("planilha_id", p.id)
          .or("investimento.gt.0,plat1_faturado.gt.0");

        return {
          id: p.id,
          mes: p.mes,
          ano: p.ano,
          dias_preenchidos: count ?? 0,
          dias_total: new Date(p.ano, p.mes, 0).getDate(),
        };
      }),
    );

    return apiSuccess(data, data.length);
  } catch {
    return apiError("internal_error", "Erro interno do servidor", 500);
  }
}
