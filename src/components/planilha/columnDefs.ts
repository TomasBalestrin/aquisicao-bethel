export interface ColumnDef {
  key: string;
  label: string;
  editable: boolean;
  isCurrency: boolean;
  isPercent: boolean;
  group: string;
  width: string;
}

export function getColumns(planilha: {
  ob1_nome: string; ob2_nome: string; ob3_nome: string;
  ob4_nome: string; ob5_nome: string;
  upsell_nome: string; downsell_nome: string;
}): ColumnDef[] {
  const col = (key: string, label: string, group: string, opts?: Partial<ColumnDef>): ColumnDef => ({
    key, label, editable: true, isCurrency: false, isPercent: false, group, width: "w-[100px]", ...opts,
  });
  const curr = (key: string, label: string, group: string, opts?: Partial<ColumnDef>) =>
    col(key, label, group, { isCurrency: true, ...opts });
  const calc = (key: string, label: string, group: string, opts?: Partial<ColumnDef>) =>
    col(key, label, group, { editable: false, ...opts });

  return [
    col("data", "Dia", "geral", { editable: false, width: "w-[70px]" }),
    curr("investimento", "Investimento", "geral"),
    curr("faturamento_principal", "Fat. Principal", "geral", { width: "w-[120px]" }),
    col("vendas_principal", "Vendas", "geral", { width: "w-[80px]" }),
    curr("ob1_faturado", `${planilha.ob1_nome} R$`, "ob"),
    col("ob1_vendas", `${planilha.ob1_nome} Vd`, "ob", { width: "w-[70px]" }),
    curr("ob2_faturado", `${planilha.ob2_nome} R$`, "ob"),
    col("ob2_vendas", `${planilha.ob2_nome} Vd`, "ob", { width: "w-[70px]" }),
    curr("ob3_faturado", `${planilha.ob3_nome} R$`, "ob"),
    col("ob3_vendas", `${planilha.ob3_nome} Vd`, "ob", { width: "w-[70px]" }),
    curr("ob4_faturado", `${planilha.ob4_nome} R$`, "ob"),
    col("ob4_vendas", `${planilha.ob4_nome} Vd`, "ob", { width: "w-[70px]" }),
    curr("ob5_faturado", `${planilha.ob5_nome} R$`, "ob"),
    col("ob5_vendas", `${planilha.ob5_nome} Vd`, "ob", { width: "w-[70px]" }),
    curr("upsell_faturado", `${planilha.upsell_nome} R$`, "upsell"),
    col("upsell_vendas", `${planilha.upsell_nome} Vd`, "upsell", { width: "w-[70px]" }),
    curr("downsell_faturado", `${planilha.downsell_nome} R$`, "downsell"),
    col("downsell_vendas", `${planilha.downsell_nome} Vd`, "downsell", { width: "w-[70px]" }),
    col("ctr", "CTR%", "funil", { isPercent: true, width: "w-[70px]" }),
    col("page_view", "Page View", "funil", { width: "w-[90px]" }),
    col("carregamento", "Carreg.", "funil", { width: "w-[80px]" }),
    col("initiate_checkout", "Init Check", "funil", { width: "w-[90px]" }),
    curr("cpm", "CPM", "funil", { width: "w-[80px]" }),
    // Calculated
    calc("fat_total", "Fat. Total", "calc", { isCurrency: true, width: "w-[110px]" }),
    calc("lucro", "Lucro", "calc", { isCurrency: true }),
    calc("margem", "Margem%", "calc", { isPercent: true, width: "w-[80px]" }),
    calc("cpa", "CPA", "calc", { isCurrency: true, width: "w-[80px]" }),
    calc("ticket_medio", "Ticket Médio", "calc", { isCurrency: true, width: "w-[100px]" }),
    calc("pag_compra", "Pag→Compra%", "calc", { isPercent: true, width: "w-[100px]" }),
    calc("pag_check", "Pag→Check%", "calc", { isPercent: true, width: "w-[100px]" }),
    calc("check_compra", "Check→Compra%", "calc", { isPercent: true, width: "w-[110px]" }),
  ];
}
