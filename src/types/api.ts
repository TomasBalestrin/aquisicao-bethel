export type ApiKeyRow = {
  id: string;
  user_id: string;
  key_hash: string;
  key_prefix: string;
  name: string;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
};

export type ApiKeyPublic = {
  id: string;
  key_prefix: string;
  name: string;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
};

export type GenerateApiKeyResult = {
  key: string;
  apiKey: ApiKeyPublic;
};

export type PerpetuoListItem = {
  id: string;
  name: string;
  created_at: string;
  planilhas_count: number;
};

export type PlanilhaListItem = {
  id: string;
  mes: number;
  ano: number;
  dias_preenchidos: number;
  dias_total: number;
};

export type PlanilhaTotais = {
  investimento: number;
  faturamento_total: number;
  lucro: number;
  margem: number;
  vendas_principal: number;
  cpa: number;
  ticket_medio: number;
};
