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
  ob6_nome: string;
  upsell_nome: string;
  downsell_nome: string;
  plat1_nome: string;
  plat2_nome: string;
  plat3_nome: string;
  plat4_nome: string;
  plat5_nome: string;
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
  ob6_nome?: string;
  upsell_nome?: string;
  downsell_nome?: string;
  plat1_nome?: string;
  plat2_nome?: string;
  plat3_nome?: string;
  plat4_nome?: string;
  plat5_nome?: string;
  created_at?: string;
  updated_at?: string;
};

export type PlanilhaUpdate = Partial<PlanilhaInsert>;
