"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "./auth";
import type { ActionResponse, ActionResponseWithData } from "@/types/action";

const metaSchema = z.object({
  value: z.number().int().min(0, "Meta deve ser positiva"),
});

async function getSetting(key: string): Promise<number> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("settings")
    .select("value")
    .eq("key", key)
    .single();
  return data ? parseInt(data.value, 10) : 0;
}

async function upsertSetting(key: string, value: number): Promise<ActionResponse> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("settings")
    .upsert(
      { key, value: String(value), updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
  if (error) return { success: false, error: "Erro ao salvar configuração" };
  return { success: true };
}

export async function getMetaFaturamento(): Promise<ActionResponseWithData<number>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Não autenticado" };
  return { success: true, data: await getSetting("meta_faturamento") };
}

export async function getMetaLucroSemanal(): Promise<ActionResponseWithData<number>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Não autenticado" };
  return { success: true, data: await getSetting("meta_lucro_semanal") };
}

export async function updateMetaFaturamento(cents: number): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "head") {
    return { success: false, error: "Apenas Head pode alterar a meta" };
  }
  const parsed = metaSchema.safeParse({ value: cents });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Valor inválido" };
  }
  return upsertSetting("meta_faturamento", parsed.data.value);
}

export async function updateMetaLucroSemanal(cents: number): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "head") {
    return { success: false, error: "Apenas Head pode alterar a meta" };
  }
  const parsed = metaSchema.safeParse({ value: cents });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Valor inválido" };
  }
  return upsertSetting("meta_lucro_semanal", parsed.data.value);
}
