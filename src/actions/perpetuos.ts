"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "./auth";
import { revalidatePath } from "next/cache";

const perpetuoSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Máximo 100 caracteres"),
});

interface ActionResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}

type PerpetuoRow = {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export async function getPerpetuos(): Promise<ActionResponse<PerpetuoRow[]>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("perpetuos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: "Erro ao buscar perpétuos" };
  return { success: true, data: data ?? [] };
}

export async function createPerpetuo(formData: FormData): Promise<ActionResponse<PerpetuoRow>> {
  const user = await getCurrentUser();
  if (!user || user.role !== "head") {
    return { success: false, error: "Apenas Head pode criar perpétuos" };
  }

  const parsed = perpetuoSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("perpetuos")
    .insert({ name: parsed.data.name, created_by: user.id })
    .select("*")
    .single();

  if (error) return { success: false, error: "Erro ao criar perpétuo" };
  revalidatePath("/perpetuos");
  return { success: true, data };
}

export async function updatePerpetuo(id: string, formData: FormData): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "head") {
    return { success: false, error: "Apenas Head pode editar perpétuos" };
  }

  const parsed = perpetuoSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("perpetuos")
    .update({ name: parsed.data.name, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { success: false, error: "Erro ao editar perpétuo" };
  revalidatePath("/perpetuos");
  return { success: true };
}

export async function deletePerpetuo(id: string): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "head") {
    return { success: false, error: "Apenas Head pode excluir perpétuos" };
  }

  const supabase = createClient();
  const { error } = await supabase.from("perpetuos").delete().eq("id", id);

  if (error) return { success: false, error: "Erro ao excluir perpétuo" };
  revalidatePath("/perpetuos");
  return { success: true };
}
