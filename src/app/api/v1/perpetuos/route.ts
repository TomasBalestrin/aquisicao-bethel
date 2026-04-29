import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateApiKey } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";
import type { PerpetuoListItem } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const userId = await validateApiKey(request);
    if (!userId) {
      return apiError("unauthorized", "API key inválida ou ausente", 401);
    }

    const supabase = createAdminClient();

    const { data: perpetuos, error } = await supabase
      .from("perpetuos")
      .select("id, name, created_at")
      .order("created_at", { ascending: false });

    if (error || !perpetuos) {
      return apiError("internal_error", "Erro interno do servidor", 500);
    }

    const result: PerpetuoListItem[] = await Promise.all(
      perpetuos.map(async (p) => {
        const { count } = await supabase
          .from("planilhas")
          .select("id", { count: "exact", head: true })
          .eq("perpetuo_id", p.id);

        return {
          id: p.id,
          name: p.name,
          created_at: p.created_at,
          planilhas_count: count ?? 0,
        };
      }),
    );

    return apiSuccess(result, result.length);
  } catch {
    return apiError("internal_error", "Erro interno do servidor", 500);
  }
}
