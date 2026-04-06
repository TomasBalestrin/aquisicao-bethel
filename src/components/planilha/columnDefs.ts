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
  main: { header: "bg-[#1565C0]", cell: "bg-[#EBF5FF]" },
  plat: { header: "bg-[#E65100]", cell: "bg-[#FFF3E0]" },
  ob: { header: "bg-[#F9A825]", cell: "bg-[#FFF8E1]" },
  upsdown: { header: "bg-[#7B1FA2]", cell: "bg-[#F3E5F5]" },
  fb: { header: "bg-[#1565C0]", cell: "bg-[#EBF5FF]" },
};

export const CALC_BG = "bg-[#EDF2F7]";

interface PlanilhaNames {
  ob1_nome: string; ob2_nome: string; ob3_nome: string;
  ob4_nome: string; ob5_nome: string; ob6_nome: string;
  upsell_nome: string; downsell_nome: string;
  plat1_nome: string; plat2_nome: string; plat3_nome: string;
  plat4_nome: string; plat5_nome: string;
}

export function getColumns(p: PlanilhaNames): ColumnDef[] {
  const c = (key: string, label: string, group: string, o?: Partial<ColumnDef>): ColumnDef => ({
    key, label, editable: true, isCurrency: false, isPercent: false, group, width: "w-[100px]", ...o,
  });
  const $ = (k: string, l: string, g: string, o?: Partial<ColumnDef>) => c(k, l, g, { isCurrency: true, ...o });
  const x = (k: string, l: string, g: string, o?: Partial<ColumnDef>) => c(k, l, g, { editable: false, ...o });

  return [
    c("data", "Data", "data", { editable: false, width: "w-[95px]" }),
    $("investimento", "Investido FB", "main"),
    x("fat_total", "Total Vendido", "main", { isCurrency: true, width: "w-[110px]" }),
    x("margem", "Margem Lucro", "main", { isPercent: true, width: "w-[95px]" }),
    x("lucro", "Lucro", "main", { isCurrency: true }),

    x("vendas_principal", "Vendas Princ.", "plat", { width: "w-[100px]" }),
    x("fat_principal", "Fat. Princ.", "plat", { isCurrency: true, width: "w-[100px]" }),
    c("plat1_vendas", `${p.plat1_nome} Und`, "plat", { width: "w-[90px]" }),
    $("plat1_faturado", `${p.plat1_nome} R$`, "plat", { width: "w-[95px]" }),
    c("plat2_vendas", `${p.plat2_nome} Und`, "plat", { width: "w-[90px]" }),
    $("plat2_faturado", `${p.plat2_nome} R$`, "plat", { width: "w-[95px]" }),
    c("plat3_vendas", `${p.plat3_nome} Und`, "plat", { width: "w-[90px]" }),
    $("plat3_faturado", `${p.plat3_nome} R$`, "plat", { width: "w-[95px]" }),
    c("plat4_vendas", `${p.plat4_nome} Und`, "plat", { width: "w-[90px]" }),
    $("plat4_faturado", `${p.plat4_nome} R$`, "plat", { width: "w-[95px]" }),
    c("plat5_vendas", `${p.plat5_nome} Und`, "plat", { width: "w-[90px]" }),
    $("plat5_faturado", `${p.plat5_nome} R$`, "plat", { width: "w-[95px]" }),
    x("total_funil", "Total Funil", "plat", { isCurrency: true, width: "w-[100px]" }),
    c("ob1_vendas", `${p.ob1_nome} Und`, "ob", { width: "w-[80px]" }),
    $("ob1_faturado", `${p.ob1_nome} R$`, "ob"),
    x("ob1_taxa", `% ${p.ob1_nome}`, "ob", { isPercent: true, width: "w-[75px]" }),
    c("ob2_vendas", `${p.ob2_nome} Und`, "ob", { width: "w-[80px]" }),
    $("ob2_faturado", `${p.ob2_nome} R$`, "ob"),
    x("ob2_taxa", `% ${p.ob2_nome}`, "ob", { isPercent: true, width: "w-[75px]" }),
    c("ob3_vendas", `${p.ob3_nome} Und`, "ob", { width: "w-[80px]" }),
    $("ob3_faturado", `${p.ob3_nome} R$`, "ob"),
    x("ob3_taxa", `% ${p.ob3_nome}`, "ob", { isPercent: true, width: "w-[75px]" }),
    c("ob4_vendas", `${p.ob4_nome} Und`, "ob", { width: "w-[80px]" }),
    $("ob4_faturado", `${p.ob4_nome} R$`, "ob"),
    x("ob4_taxa", `% ${p.ob4_nome}`, "ob", { isPercent: true, width: "w-[75px]" }),
    c("ob5_vendas", `${p.ob5_nome} Und`, "ob", { width: "w-[80px]" }),
    $("ob5_faturado", `${p.ob5_nome} R$`, "ob"),
    x("ob5_taxa", `% ${p.ob5_nome}`, "ob", { isPercent: true, width: "w-[75px]" }),
    c("ob6_vendas", `${p.ob6_nome} Und`, "ob", { width: "w-[80px]" }),
    $("ob6_faturado", `${p.ob6_nome} R$`, "ob"),
    x("ob6_taxa", `% ${p.ob6_nome}`, "ob", { isPercent: true, width: "w-[75px]" }),
    c("upsell_vendas", `${p.upsell_nome} Und`, "upsdown", { width: "w-[80px]" }),
    $("upsell_faturado", `${p.upsell_nome} R$`, "upsdown"),
    x("upsell_taxa", `% ${p.upsell_nome}`, "upsdown", { isPercent: true, width: "w-[75px]" }),
    c("downsell_vendas", `${p.downsell_nome} Und`, "upsdown", { width: "w-[80px]" }),
    $("downsell_faturado", `${p.downsell_nome} R$`, "upsdown"),
    x("downsell_taxa", `% ${p.downsell_nome}`, "upsdown", { isPercent: true, width: "w-[75px]" }),

    x("cpa", "CPA", "fb", { isCurrency: true, width: "w-[80px]" }),
    x("ticket_medio", "Ticket Médio", "fb", { isCurrency: true, width: "w-[100px]" }),
    c("ctr", "CTR %", "fb", { isPercent: true, width: "w-[70px]" }),
    $("cpm", "CPM", "fb", { width: "w-[80px]" }),
    c("page_view", "Vis. Página", "fb", { width: "w-[90px]" }),
    c("carregamento", "Carregamento", "fb", { isPercent: true, width: "w-[100px]" }),
    c("initiate_checkout", "Fin. Compra", "fb", { width: "w-[95px]" }),
    x("conv_pag_check", "Conv Pág/Check %", "fb", { isPercent: true, width: "w-[120px]" }),
    x("conv_check_compra", "Conv Check/Compra %", "fb", { isPercent: true, width: "w-[135px]" }),
    x("conv_pag_compra", "Conv Pág/Compra %", "fb", { isPercent: true, width: "w-[125px]" }),
  ];
}
