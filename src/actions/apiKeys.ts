"use server";

import { z } from "zod";
import { randomBytes, createHash } from "crypto";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/actions/auth";
import type { Database } from "@/types/database";
import type {
  ActionResponse,
  ActionResponseWithData,
} from "@/types/action";
import type {
  ApiKeyRow,
  ApiKeyPublic,
  GenerateApiKeyResult,
} from "@/types/api";

type ApiKeysDatabase = Database & {
  public: Database["public"] & {
    Tables: Database["public"]["Tables"] & {
      api_keys: {
        Row: ApiKeyRow;
        Insert: Partial<Omit<ApiKeyRow, "id" | "created_at">> & {
          user_id: string;
          key_hash: string;
          key_prefix: string;
        };
        Update: Partial<ApiKeyRow>;
        Relationships: [];
      };
    };
  };
};

function getClient(): SupabaseClient<ApiKeysDatabase> {
  return createClient() as unknown as SupabaseClient<ApiKeysDatabase>;
}

const generateSchema = z.object({
  name: z.string().max(50).default("Chave padrão"),
});

const idSchema = z.string().uuid();

export async function generateApiKey(
  name?: string,
): Promise<ActionResponseWithData<GenerateApiKeyResult>> {
  const parsed = generateSchema.safeParse({ name });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Nome inválido",
    };
  }

  const user = await getCurrentUser();
  if (!user || user.role !== "head") {
    return { success: false, error: "Acesso negado" };
  }

  const key = "phq_" + randomBytes(16).toString("hex");
  const key_prefix = key.slice(0, 8);
  const key_hash = createHash("sha256").update(key).digest("hex");

  const supabase = getClient();
  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      user_id: user.id,
      key_hash,
      key_prefix,
      name: parsed.data.name,
    })
    .select("id, key_prefix, name, is_active, last_used_at, created_at")
    .single();

  if (error || !data) {
    return { success: false, error: "Erro ao gerar chave" };
  }

  revalidatePath("/settings");
  return { success: true, data: { key, apiKey: data as ApiKeyPublic } };
}

export async function revokeApiKey(id: string): Promise<ActionResponse> {
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) {
    return { success: false, error: "ID inválido" };
  }

  const user = await getCurrentUser();
  if (!user || user.role !== "head") {
    return { success: false, error: "Acesso negado" };
  }

  const supabase = getClient();
  const { error } = await supabase
    .from("api_keys")
    .update({ is_active: false })
    .eq("id", parsed.data);

  if (error) {
    return { success: false, error: "Erro ao revogar chave" };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function listApiKeys(): Promise<
  ActionResponseWithData<ApiKeyPublic[]>
> {
  const user = await getCurrentUser();
  if (!user || user.role !== "head") {
    return { success: false, error: "Acesso negado" };
  }

  const supabase = getClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, key_prefix, name, is_active, last_used_at, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { success: false, error: "Erro ao listar chaves" };
  }

  return { success: true, data: data as ApiKeyPublic[] };
}
