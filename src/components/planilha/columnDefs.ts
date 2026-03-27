export interface ColumnDef {
  key: string;
  label: string;
  editable: boolean;
  isCurrency: boolean;
  isPercent: boolean;
  group: string;
  width: string;
}

export const GROUP_COLORS: Record<string, { header: string; cell: string }> = {
  data: { header: "bg-navy-dark", cell: "" },
  invest: { header: "bg-[#1565C0]", cell: "bg-[#EBF5FF]" },
  revenue: { header: "bg-[#2E7D32]", cell: "bg-[#E8F5E9]" },
  ob: { header: "bg-[#F9A825]", cell: "bg-[#FFF8E1]" },
  upsdown: { header: "bg-[#7B1FA2]", cell: "bg-[#F3E5F5]" },
  traffic: { header: "bg-[#E65100]", cell: "bg-[#FFF3E0]" },
  calc_cpa: { header: "bg-[#616161]", cell: "bg-[#F5F5F5]" },
};

export function getColumns(p: {
  ob1_nome: string; ob2_nome: string; ob3_nome: string;
  ob4_nome: string; ob5_nome: string;
  upsell_nome: string; downsell_nome: string;
}): ColumnDef[] {
  const c = (key: string, label: string, group: string, o?: Partial<ColumnDef>): ColumnDef => ({
    key, label, editable: true, isCurrency: false, isPercent: false, group, width: "w-[100px]", ...o,
  });
  const $ = (key: string, label: string, g: string, o?: Partial<ColumnDef>) => c(key, label, g, { isCurrency: true, ...o });
  const x = (key: string, label: string, g: string, o?: Partial<ColumnDef>) => c(key, label, g, { editable: false, ...o });

  return [
    c("data", "Dia", "data", { editable: false, width: "w-[95px]" }),
    $("investimento", "Investimento", "invest"),
    x("fat_total", "Fat. Total", "revenue", { isCurrency: true, width: "w-[110px]" }),
    c("vendas_principal", "Vendas", "revenue", { width: "w-[80px]" }),
    x("lucro", "Lucro", "revenue", { isCurrency: true }),
    x("margem", "Margem %", "revenue", { isPercent: true, width: "w-[85px]" }),
    c("vendas_principal_num", "Nº Vendas Princ.", "revenue", { editable: false, width: "w-[120px]" }),
    $("faturamento_principal", "Vendas Princ. R$", "revenue", { width: "w-[120px]" }),
    x("fat_extras", "Fat. Extras", "revenue", { isCurrency: true, width: "w-[100px]" }),
    $("ob1_faturado", `${p.ob1_nome} R$`, "ob"),
    c("ob1_vendas", `${p.ob1_nome} Vd`, "ob", { width: "w-[70px]" }),
    $("ob2_faturado", `${p.ob2_nome} R$`, "ob"),
    c("ob2_vendas", `${p.ob2_nome} Vd`, "ob", { width: "w-[70px]" }),
    $("ob3_faturado", `${p.ob3_nome} R$`, "ob"),
    c("ob3_vendas", `${p.ob3_nome} Vd`, "ob", { width: "w-[70px]" }),
    $("ob4_faturado", `${p.ob4_nome} R$`, "ob"),
    c("ob4_vendas", `${p.ob4_nome} Vd`, "ob", { width: "w-[70px]" }),
    $("ob5_faturado", `${p.ob5_nome} R$`, "ob"),
    c("ob5_vendas", `${p.ob5_nome} Vd`, "ob", { width: "w-[70px]" }),
    $("upsell_faturado", `${p.upsell_nome} R$`, "upsdown"),
    c("upsell_vendas", `${p.upsell_nome} Vd`, "upsdown", { width: "w-[70px]" }),
    $("downsell_faturado", `${p.downsell_nome} R$`, "upsdown"),
    c("downsell_vendas", `${p.downsell_nome} Vd`, "upsdown", { width: "w-[70px]" }),
    x("cpa", "CPA", "calc_cpa", { isCurrency: true, width: "w-[80px]" }),
    x("ticket_medio", "Ticket Médio", "calc_cpa", { isCurrency: true, width: "w-[100px]" }),
    c("ctr", "CTR %", "traffic", { isPercent: true, width: "w-[70px]" }),
    c("page_view", "Page Views", "traffic", { width: "w-[90px]" }),
    c("carregamento", "Carreg.", "traffic", { width: "w-[80px]" }),
    c("initiate_checkout", "Início Check", "traffic", { width: "w-[95px]" }),
    x("pag_compra", "Pág→Compra %", "traffic", { isPercent: true, width: "w-[105px]" }),
    x("pag_check", "Pág→Check %", "traffic", { isPercent: true, width: "w-[100px]" }),
    x("check_compra", "Check→Compra %", "traffic", { isPercent: true, width: "w-[110px]" }),
    $("cpm", "CPM", "invest", { width: "w-[80px]" }),
  ];
}
