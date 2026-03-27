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
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = createClient();
  const { data: original } = await supabase
    .from("planilhas").select("*").eq("id", parsed.data.planilhaId).single();

  if (!original) return { success: false, error: "Planilha original não encontrada" };

  const { data: nova, error } = await supabase.from("planilhas").insert({
    perpetuo_id: original.perpetuo_id,
    mes: parsed.data.mes, ano: parsed.data.ano,
    ob1_nome: original.ob1_nome, ob2_nome: original.ob2_nome,
    ob3_nome: original.ob3_nome, ob4_nome: original.ob4_nome,
    ob5_nome: original.ob5_nome,
    upsell_nome: original.upsell_nome, downsell_nome: original.downsell_nome,
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
  revalidatePath(`/perpetuos/${original.perpetuo_id}`);
  return { success: true, data: { planilhaId: nova.id, perpetuoId: original.perpetuo_id } };
}

const nomesSchema = z.object({
  id: z.string().uuid(),
  perpetuo_id: z.string().uuid(),
  ob1_nome: z.string().max(50), ob2_nome: z.string().max(50),
  ob3_nome: z.string().max(50), ob4_nome: z.string().max(50),
  ob5_nome: z.string().max(50),
  upsell_nome: z.string().max(50), downsell_nome: z.string().max(50),
});

export async function updatePlanilhaNomes(
  input: z.infer<typeof nomesSchema>
): Promise<ActionResponse> {
  const parsed = nomesSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = createClient();
  const { error } = await supabase.from("planilhas").update({
    ob1_nome: parsed.data.ob1_nome, ob2_nome: parsed.data.ob2_nome,
    ob3_nome: parsed.data.ob3_nome, ob4_nome: parsed.data.ob4_nome,
    ob5_nome: parsed.data.ob5_nome,
    upsell_nome: parsed.data.upsell_nome, downsell_nome: parsed.data.downsell_nome,
    updated_at: new Date().toISOString(),
  }).eq("id", parsed.data.id);

  if (error) return { success: false, error: "Erro ao atualizar nomes" };
  revalidatePath(`/perpetuos/${parsed.data.perpetuo_id}`);
  return { success: true };
}
