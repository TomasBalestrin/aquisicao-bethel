"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types/database";

interface AuthResponse {
  success: boolean;
  error?: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: UserRole;
}

export async function loginAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (!email || !password) {
    return { success: false, error: "Email e senha são obrigatórios" };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: "Email ou senha inválidos" };
  }

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    avatar_url: data.avatar_url,
    role: data.role as UserRole,
  };
}
