"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertHead } from "@/lib/helpers";
import { revalidatePath } from "next/cache";
import type { ActionResponse, ActionResponseWithData } from "@/types/action";

const uuidSchema = z.string().uuid("ID inválido");

const updateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  email: z.string().email("Email inválido"),
});

export async function updateGestor(
  id: string, input: { name: string; email: string }
): Promise<ActionResponse> {
  if (!uuidSchema.safeParse(id).success) return { success: false, error: "ID inválido" };

  const denied = await assertHead();
  if (denied) return denied;

  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const admin = createAdminClient();
  const { error: authError } = await admin.auth.admin.updateUserById(id, {
    email: parsed.data.email,
  });

  if (authError) return { success: false, error: "Erro ao atualizar email" };

  const { error: dbError } = await admin.from("users").update({
    name: parsed.data.name,
    email: parsed.data.email,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (dbError) return { success: false, error: "Erro ao atualizar perfil" };
  revalidatePath("/gestores");
  return { success: true };
}

export async function deleteGestor(id: string): Promise<ActionResponse> {
  if (!uuidSchema.safeParse(id).success) return { success: false, error: "ID inválido" };

  const denied = await assertHead();
  if (denied) return denied;

  const admin = createAdminClient();
  const { error: dbError } = await admin.from("users").delete().eq("id", id);
  if (dbError) return { success: false, error: "Erro ao excluir perfil" };

  const { error: authError } = await admin.auth.admin.deleteUser(id);
  if (authError) return { success: false, error: "Perfil removido, mas erro ao excluir conta" };

  revalidatePath("/gestores");
  return { success: true };
}

export async function uploadAvatar(
  userId: string, file: File
): Promise<ActionResponseWithData<string>> {
  const denied = await assertHead();
  if (denied) return denied;

  const admin = createAdminClient();
  const ext = file.name.split(".").pop() ?? "png";
  const path = `${userId}/avatar.${ext}`;

  const { error } = await admin.storage.from("avatars").upload(path, file, { upsert: true });
  if (error) return { success: false, error: "Erro no upload da foto" };

  const { data: { publicUrl } } = admin.storage.from("avatars").getPublicUrl(path);

  const { error: dbErr } = await admin.from("users")
    .update({ avatar_url: publicUrl }).eq("id", userId);
  if (dbErr) return { success: false, error: "Upload ok, mas erro ao salvar URL" };

  revalidatePath("/gestores");
  return { success: true, data: publicUrl };
}
