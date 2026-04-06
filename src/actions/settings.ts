"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "./auth";
import { revalidatePath } from "next/cache";
import type { ActionResponse, ActionResponseWithData } from "@/types/action";

const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  email: z.string().email("Email inválido"),
});

export async function updateProfile(
  input: { name: string; email: string }
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Não autenticado" };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = createClient();
  const { error: dbError } = await supabase.from("users").update({
    name: parsed.data.name,
    email: parsed.data.email,
    updated_at: new Date().toISOString(),
  }).eq("id", user.id);

  if (dbError) return { success: false, error: "Erro ao atualizar perfil" };

  if (parsed.data.email !== user.email) {
    const admin = createAdminClient();
    const { error: authError } = await admin.auth.admin.updateUserById(user.id, {
      email: parsed.data.email,
    });
    if (authError) return { success: false, error: "Erro ao atualizar email" };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function uploadOwnAvatar(
  formData: FormData
): Promise<ActionResponseWithData<string>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Não autenticado" };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "Nenhum arquivo selecionado" };
  }

  const admin = createAdminClient();
  const ext = file.name.split(".").pop() ?? "png";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { error } = await admin.storage.from("avatars").upload(path, file, { upsert: true });
  if (error) return { success: false, error: "Erro no upload da foto" };

  const { data: { publicUrl } } = admin.storage.from("avatars").getPublicUrl(path);

  const { error: dbErr } = await admin.from("users")
    .update({ avatar_url: publicUrl }).eq("id", user.id);
  if (dbErr) return { success: false, error: "Upload ok, mas erro ao salvar URL" };

  revalidatePath("/settings");
  return { success: true, data: publicUrl };
}
