"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { DailyEntryRow } from "@/types/daily-entry";
import type { ActionResponse, ActionResponseWithData } from "@/types/action";

const EDITABLE_FIELDS = [
  "investimento",
  "plat1_vendas", "plat1_faturado", "plat2_vendas", "plat2_faturado",
  "plat3_vendas", "plat3_faturado", "plat4_vendas", "plat4_faturado",
  "plat5_vendas", "plat5_faturado",
  "ob1_faturado", "ob1_vendas", "ob2_faturado", "ob2_vendas",
  "ob3_faturado", "ob3_vendas", "ob4_faturado", "ob4_vendas",
  "ob5_faturado", "ob5_vendas", "ob6_faturado", "ob6_vendas",
  "upsell_faturado", "upsell_vendas",
  "downsell_faturado", "downsell_vendas",
  "ctr", "page_view", "initiate_checkout", "cpm", "cliques_link",
] as const;

type EditableField = typeof EDITABLE_FIELDS[number];

const updateSchema = z.object({
  id: z.string().uuid(),
  field: z.enum(EDITABLE_FIELDS),
  value: z.number(),
});

export async function getDailyEntries(
  planilhaId: string
): Promise<ActionResponseWithData<DailyEntryRow[]>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("daily_entries")
    .select("*")
    .eq("planilha_id", planilhaId)
    .order("data", { ascending: true });

  if (error) return { success: false, error: "Erro ao buscar dados" };
  return { success: true, data: data ?? [] };
}

export async function updateDailyEntry(
  id: string, field: EditableField, value: number
): Promise<ActionResponse> {
  const parsed = updateSchema.safeParse({ id, field, value });
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos" };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("daily_entries")
    .update({
      [parsed.data.field]: parsed.data.value,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);

  if (error) return { success: false, error: "Erro ao salvar" };
  return { success: true };
}
