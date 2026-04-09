"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "./auth";
import type { ActionResponse, ActionResponseWithData } from "@/types/action";

const metaSchema = z.object({
  value: z.number().int().min(0, "Meta deve ser positiva"),
});

export async function getMetaFaturamento(): Promise<ActionResponseWithData<number>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Não autenticado" };

  const admin = createAdminClient();
  const { data } = await admin
    .from("settings")
    .select("value")
    .eq("key", "meta_faturamento")
    .single();

  return { success: true, data: data ? parseInt(data.value, 10) : 0 };
}

export async function updateMetaFaturamento(
  cents: number
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "head") {
    return { success: false, error: "Apenas Head pode alterar a meta" };
  }

  const parsed = metaSchema.safeParse({ value: cents });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Valor inválido" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("settings")
    .upsert(
      {
        key: "meta_faturamento",
        value: String(parsed.data.value),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

  if (error) return { success: false, error: "Erro ao salvar meta" };
  return { success: true };
}
