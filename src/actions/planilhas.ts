"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { daysInMonth } from "@/lib/helpers";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/types/action";

const n = z.string().max(50).optional();

const createSchema = z.object({
  perpetuo_id: z.string().uuid(),
  mes: z.number().int().min(1).max(12),
  ano: z.number().int().min(2020).max(2099),
  ob1_nome: n, ob2_nome: n, ob3_nome: n,
  ob4_nome: n, ob5_nome: n, ob6_nome: n,
  upsell_nome: n, downsell_nome: n,
  plat1_nome: n, plat2_nome: n, plat3_nome: n,
  plat4_nome: n, plat5_nome: n,
});

const uuidSchema = z.string().uuid("ID inválido");

export async function getPlanilhasByPerpetuo(perpetuoId: string) {
  const validId = uuidSchema.safeParse(perpetuoId);
  if (!validId.success) return { success: false as const, error: "ID inválido" };

  const supabase = createClient();
  const { data, error } = await supabase
    .from("planilhas").select("*")
    .eq("perpetuo_id", perpetuoId)
    .order("ano", { ascending: false })
    .order("mes", { ascending: false });

  if (error) return { success: false as const, error: "Erro ao buscar planilhas" };
  return { success: true as const, data: data ?? [] };
}

export async function createPlanilha(
  input: z.infer<typeof createSchema>
): Promise<ActionResponse> {
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = createClient();
  const { data: planilha, error } = await supabase
    .from("planilhas").insert(parsed.data).select("id").single();

  if (error) {
    if (error.code === "23505") return { success: false, error: "Já existe planilha para este mês/ano" };
    return { success: false, error: "Erro ao criar planilha" };
  }

  const days = daysInMonth(parsed.data.mes, parsed.data.ano);
  const entries = Array.from({ length: days }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    const month = String(parsed.data.mes).padStart(2, "0");
    return { planilha_id: planilha.id, data: `${parsed.data.ano}-${month}-${day}` };
  });

  const { error: ee } = await supabase.from("daily_entries").insert(entries);
  if (ee) return { success: false, error: "Planilha criada, mas erro ao gerar dias" };

  revalidatePath(`/perpetuos/${parsed.data.perpetuo_id}`);
  return { success: true };
}

export async function deletePlanilha(
  id: string, perpetuoId: string
): Promise<ActionResponse> {
  const v1 = uuidSchema.safeParse(id);
  const v2 = uuidSchema.safeParse(perpetuoId);
  if (!v1.success || !v2.success) return { success: false, error: "ID inválido" };

  const supabase = createClient();
  const { error } = await supabase.from("planilhas").delete().eq("id", id);
  if (error) return { success: false, error: "Erro ao excluir planilha" };
  revalidatePath(`/perpetuos/${perpetuoId}`);
  return { success: true };
}
