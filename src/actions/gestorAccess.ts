"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "./auth";
import { revalidatePath } from "next/cache";

interface ActionResponse {
  success: boolean;
  error?: string;
}

export async function getGestorAccess(userId: string): Promise<{ success: boolean; data?: string[]; error?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "head") return { success: false, error: "Acesso restrito" };

  const supabase = createClient();
  const { data, error } = await supabase
    .from("perpetuo_access")
    .select("perpetuo_id")
    .eq("user_id", userId);

  if (error) return { success: false, error: "Erro ao buscar acessos" };
  return { success: true, data: (data ?? []).map((r) => r.perpetuo_id) };
}

export async function updateGestorAccess(
  userId: string, perpetuoIds: string[]
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "head") return { success: false, error: "Acesso restrito" };

  const admin = createAdminClient();

  const { error: delError } = await admin
    .from("perpetuo_access")
    .delete()
    .eq("user_id", userId);

  if (delError) return { success: false, error: "Erro ao atualizar acessos" };

  if (perpetuoIds.length > 0) {
    const rows = perpetuoIds.map((perpetuo_id) => ({ perpetuo_id, user_id: userId }));
    const { error: insError } = await admin.from("perpetuo_access").insert(rows);
    if (insError) return { success: false, error: "Erro ao conceder acessos" };
  }

  revalidatePath("/gestores");
  return { success: true };
}
