export type PlanilhaRow = {
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

export type PlanilhaInsert = {
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

export type PlanilhaUpdate = Partial<PlanilhaInsert>;
