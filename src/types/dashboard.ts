export interface PerpetuoDashboard {
  id: string;
  name: string;
  investimento: number;
  faturamento: number;
  lucro: number;
  margem: number | null;
  vendas: number;
  diasPreenchidos: number;
}

export interface DashboardPageData {
  perpetuos: PerpetuoDashboard[];
  metaFaturamento: number;
  diasNoMes: number;
  mesAtual: number;
  anoAtual: number;
  isHead: boolean;
}
