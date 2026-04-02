"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface ActionResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}

function daysInMonth(mes: number, ano: number): number {
  return new Date(ano, mes, 0).getDate();
}

const dupSchema = z.object({
  planilhaId: z.string().uuid(),
  mes: z.number().int().min(1).max(12),
  ano: z.number().int().min(2020).max(2099),
});

export async function duplicatePlanilha(
  input: z.infer<typeof dupSchema>
): Promise<ActionResponse<{ planilhaId: string; perpetuoId: string }>> {
  const parsed = dupSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = createClient();
  const { data: og } = await supabase.from("planilhas").select("*").eq("id", parsed.data.planilhaId).single();
  if (!og) return { success: false, error: "Planilha original não encontrada" };

  const { data: nova, error } = await supabase.from("planilhas").insert({
    perpetuo_id: og.perpetuo_id, mes: parsed.data.mes, ano: parsed.data.ano,
    ob1_nome: og.ob1_nome, ob2_nome: og.ob2_nome, ob3_nome: og.ob3_nome,
    ob4_nome: og.ob4_nome, ob5_nome: og.ob5_nome, ob6_nome: og.ob6_nome,
    upsell_nome: og.upsell_nome, downsell_nome: og.downsell_nome,
    plat1_nome: og.plat1_nome, plat2_nome: og.plat2_nome, plat3_nome: og.plat3_nome,
    plat4_nome: og.plat4_nome, plat5_nome: og.plat5_nome,
  }).select("*").single();

  if (error) {
    if (error.code === "23505") return { success: false, error: "Já existe planilha para este mês/ano" };
    return { success: false, error: "Erro ao duplicar planilha" };
  }

  const days = daysInMonth(parsed.data.mes, parsed.data.ano);
  const entries = Array.from({ length: days }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    const month = String(parsed.data.mes).padStart(2, "0");
    return { planilha_id: nova.id, data: `${parsed.data.ano}-${month}-${day}` };
  });
  await supabase.from("daily_entries").insert(entries);
  revalidatePath(`/perpetuos/${og.perpetuo_id}`);
  return { success: true, data: { planilhaId: nova.id, perpetuoId: og.perpetuo_id } };
}

const n50 = z.string().max(50);
const nomesSchema = z.object({
  id: z.string().uuid(), perpetuo_id: z.string().uuid(),
  ob1_nome: n50, ob2_nome: n50, ob3_nome: n50,
  ob4_nome: n50, ob5_nome: n50, ob6_nome: n50,
  upsell_nome: n50, downsell_nome: n50,
  plat1_nome: n50, plat2_nome: n50, plat3_nome: n50,
  plat4_nome: n50, plat5_nome: n50,
});

export async function updatePlanilhaNomes(
  input: z.infer<typeof nomesSchema>
): Promise<ActionResponse> {
  const parsed = nomesSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = createClient();
  const { id, perpetuo_id, ...nomes } = parsed.data;
  const { error } = await supabase.from("planilhas")
    .update({ ...nomes, updated_at: new Date().toISOString() }).eq("id", id);

  if (error) return { success: false, error: "Erro ao atualizar nomes" };
  revalidatePath(`/perpetuos/${perpetuo_id}`);
  return { success: true };
}
