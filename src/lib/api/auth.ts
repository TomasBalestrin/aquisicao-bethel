import { createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";
import type { ApiKeyRow } from "@/types/api";

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

export async function validateApiKey(
  request: Request,
): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const hash = createHash("sha256").update(token).digest("hex");

  const supabase = createAdminClient() as unknown as SupabaseClient<ApiKeysDatabase>;

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, user_id")
    .eq("key_hash", hash)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  void supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return data.user_id;
}
