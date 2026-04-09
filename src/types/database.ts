import type { DailyEntryRow, DailyEntryInsert, DailyEntryUpdate } from "./daily-entry";
import type { PlanilhaRow, PlanilhaInsert, PlanilhaUpdate } from "./planilha";

export type { DailyEntryRow, DailyEntryInsert, DailyEntryUpdate };
export type { PlanilhaRow, PlanilhaInsert, PlanilhaUpdate };
export type UserRole = "head" | "gestor";

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          password_hash: string;
          avatar_url: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          password_hash: string;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          password_hash?: string;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      perpetuos: {
        Row: {
          id: string;
          name: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "perpetuos_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      perpetuo_access: {
        Row: {
          id: string;
          perpetuo_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          perpetuo_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          perpetuo_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      planilhas: {
        Row: PlanilhaRow;
        Insert: PlanilhaInsert;
        Update: PlanilhaUpdate;
        Relationships: [
          {
            foreignKeyName: "planilhas_perpetuo_id_fkey";
            columns: ["perpetuo_id"];
            isOneToOne: false;
            referencedRelation: "perpetuos";
            referencedColumns: ["id"];
          },
        ];
      };
      daily_entries: {
        Row: DailyEntryRow;
        Insert: DailyEntryInsert;
        Update: DailyEntryUpdate;
        Relationships: [
          {
            foreignKeyName: "daily_entries_planilha_id_fkey";
            columns: ["planilha_id"];
            isOneToOne: false;
            referencedRelation: "planilhas";
            referencedColumns: ["id"];
          },
        ];
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_role: {
        Args: Record<string, never>;
        Returns: string;
      };
      has_perpetuo_access: {
        Args: { p_perpetuo_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
