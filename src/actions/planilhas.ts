"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface ActionResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}

const createSchema = z.object({
  perpetuo_id: z.string().uuid(),
  mes: z.number().int().min(1).max(12),
  ano: z.number().int().min(2020).max(2099),
  ob1_nome: z.string().max(50).optional(),
  ob2_nome: z.string().max(50).optional(),
  ob3_nome: z.string().max(50).optional(),
  ob4_nome: z.string().max(50).optional(),
  ob5_nome: z.string().max(50).optional(),
  upsell_nome: z.string().max(50).optional(),
  downsell_nome: z.string().max(50).optional(),
});

function daysInMonth(mes: number, ano: number): number {
  return new Date(ano, mes, 0).getDate();
}

export async function getPlanilhasByPerpetuo(perpetuoId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("planilhas")
    .select("*")
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
    .from("planilhas")
    .insert(parsed.data)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Já existe planilha para este mês/ano" };
    }
    return { success: false, error: "Erro ao criar planilha" };
  }

  const days = daysInMonth(parsed.data.mes, parsed.data.ano);
  const entries = Array.from({ length: days }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    const month = String(parsed.data.mes).padStart(2, "0");
    return { planilha_id: planilha.id, data: `${parsed.data.ano}-${month}-${day}` };
  });

  const { error: entriesError } = await supabase.from("daily_entries").insert(entries);
  if (entriesError) {
    return { success: false, error: "Planilha criada, mas erro ao gerar dias" };
  }

  revalidatePath(`/perpetuos/${parsed.data.perpetuo_id}`);
  return { success: true };
}

export async function deletePlanilha(
  id: string, perpetuoId: string
): Promise<ActionResponse> {
  const supabase = createClient();
  const { error } = await supabase.from("planilhas").delete().eq("id", id);
  if (error) return { success: false, error: "Erro ao excluir planilha" };
  revalidatePath(`/perpetuos/${perpetuoId}`);
  return { success: true };
}
