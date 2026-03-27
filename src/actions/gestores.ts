"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "./auth";
import { revalidatePath } from "next/cache";

interface ActionResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}

const createSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type GestorRow = {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
};

async function assertHead(): Promise<ActionResponse | null> {
  const user = await getCurrentUser();
  if (!user || user.role !== "head") {
    return { success: false, error: "Acesso restrito ao Head" };
  }
  return null;
}

export async function getGestores(): Promise<ActionResponse<GestorRow[]>> {
  const denied = await assertHead();
  if (denied) return { success: false, error: denied.error };

  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "gestor")
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: "Erro ao buscar gestores" };
  return { success: true, data: data ?? [] };
}

export async function createGestor(
  input: { name: string; email: string; password: string }
): Promise<ActionResponse> {
  const denied = await assertHead();
  if (denied) return denied;

  const parsed = createSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const admin = createAdminClient();
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message.includes("already been registered")) {
      return { success: false, error: "Este email já está cadastrado" };
    }
    return { success: false, error: "Erro ao criar conta do gestor" };
  }

  const { error: dbError } = await admin.from("users").insert({
    id: authData.user.id,
    email: parsed.data.email,
    name: parsed.data.name,
    password_hash: "managed-by-supabase-auth",
    role: "gestor",
  });

  if (dbError) return { success: false, error: "Conta criada, mas erro ao salvar perfil" };
  revalidatePath("/gestores");
  return { success: true };
}
