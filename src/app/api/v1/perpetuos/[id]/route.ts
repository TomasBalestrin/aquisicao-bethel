import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateApiKey } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";

const PLANILHA_COLUMNS = [
  "id",
  "mes",
  "ano",
  "ob1_nome",
  "ob2_nome",
  "ob3_nome",
  "ob4_nome",
  "ob5_nome",
  "ob6_nome",
  "ob7_nome",
  "ob8_nome",
  "ob9_nome",
  "ob10_nome",
  "upsell_nome",
  "downsell_nome",
  "plat1_nome",
  "plat2_nome",
  "plat3_nome",
  "plat4_nome",
  "plat5_nome",
].join(", ");

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
      .select("id, name, created_at")
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
      .select(PLANILHA_COLUMNS)
      .eq("perpetuo_id", id)
      .order("ano", { ascending: false })
      .order("mes", { ascending: false });

    if (planilhasError) {
      return apiError("internal_error", "Erro interno do servidor", 500);
    }

    return apiSuccess({ ...perpetuo, planilhas: planilhas ?? [] });
  } catch {
    return apiError("internal_error", "Erro interno do servidor", 500);
  }
}
