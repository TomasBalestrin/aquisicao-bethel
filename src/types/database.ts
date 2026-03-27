export type UserRole = "head" | "gestor";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          password_hash: string;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          password_hash: string;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          password_hash?: string;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "perpetuos_created_by_fkey";
            columns: ["id"];
            isOneToOne: false;
            referencedRelation: "perpetuos";
            referencedColumns: ["created_by"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "perpetuo_access_perpetuo_id_fkey";
            columns: ["perpetuo_id"];
            isOneToOne: false;
            referencedRelation: "perpetuos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "perpetuo_access_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      planilhas: {
        Row: {
          id: string;
          perpetuo_id: string;
          mes: number;
          ano: number;
          ob1_nome: string;
          ob2_nome: string;
          ob3_nome: string;
          ob4_nome: string;
          ob5_nome: string;
          upsell_nome: string;
          downsell_nome: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          perpetuo_id: string;
          mes: number;
          ano: number;
          ob1_nome?: string;
          ob2_nome?: string;
          ob3_nome?: string;
          ob4_nome?: string;
          ob5_nome?: string;
          upsell_nome?: string;
          downsell_nome?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          perpetuo_id?: string;
          mes?: number;
          ano?: number;
          ob1_nome?: string;
          ob2_nome?: string;
          ob3_nome?: string;
          ob4_nome?: string;
          ob5_nome?: string;
          upsell_nome?: string;
          downsell_nome?: string;
          created_at?: string;
          updated_at?: string;
        };
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
}

export interface DailyEntryRow {
  id: string;
  planilha_id: string;
  data: string;
  investimento: number;
  faturamento_principal: number;
  vendas_principal: number;
  ob1_faturado: number;
  ob1_vendas: number;
  ob2_faturado: number;
  ob2_vendas: number;
  ob3_faturado: number;
  ob3_vendas: number;
  ob4_faturado: number;
  ob4_vendas: number;
  ob5_faturado: number;
  ob5_vendas: number;
  upsell_faturado: number;
  upsell_vendas: number;
  downsell_faturado: number;
  downsell_vendas: number;
  ctr: number;
  page_view: number;
  carregamento: number;
  initiate_checkout: number;
  cpm: number;
  created_at: string;
  updated_at: string;
}

export interface DailyEntryInsert {
  id?: string;
  planilha_id: string;
  data: string;
  investimento?: number;
  faturamento_principal?: number;
  vendas_principal?: number;
  ob1_faturado?: number;
  ob1_vendas?: number;
  ob2_faturado?: number;
  ob2_vendas?: number;
  ob3_faturado?: number;
  ob3_vendas?: number;
  ob4_faturado?: number;
  ob4_vendas?: number;
  ob5_faturado?: number;
  ob5_vendas?: number;
  upsell_faturado?: number;
  upsell_vendas?: number;
  downsell_faturado?: number;
  downsell_vendas?: number;
  ctr?: number;
  page_view?: number;
  carregamento?: number;
  initiate_checkout?: number;
  cpm?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DailyEntryUpdate {
  id?: string;
  planilha_id?: string;
  data?: string;
  investimento?: number;
  faturamento_principal?: number;
  vendas_principal?: number;
  ob1_faturado?: number;
  ob1_vendas?: number;
  ob2_faturado?: number;
  ob2_vendas?: number;
  ob3_faturado?: number;
  ob3_vendas?: number;
  ob4_faturado?: number;
  ob4_vendas?: number;
  ob5_faturado?: number;
  ob5_vendas?: number;
  upsell_faturado?: number;
  upsell_vendas?: number;
  downsell_faturado?: number;
  downsell_vendas?: number;
  ctr?: number;
  page_view?: number;
  carregamento?: number;
  initiate_checkout?: number;
  cpm?: number;
  created_at?: string;
  updated_at?: string;
}
