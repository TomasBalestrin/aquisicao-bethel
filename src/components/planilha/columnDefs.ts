export { GROUP_COLORS, CALC_BG } from "@/lib/planilha-colors";

export interface ColumnDef {
  key: string;
  label: string;
  editable: boolean;
  isCurrency: boolean;
  isPercent: boolean;
  group: string;
  width: string;
}

interface PlanilhaNames {
  ob1_nome: string; ob2_nome: string; ob3_nome: string;
  ob4_nome: string; ob5_nome: string; ob6_nome: string;
  ob7_nome: string; ob8_nome: string; ob9_nome: string; ob10_nome: string;
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
  const w80 = { width: "w-[80px]" };
  const w75 = { width: "w-[75px]", isPercent: true };

  function obCols(n: number, nome: string): ColumnDef[] {
    const g = `ob${n}`;
    return [
      c(`ob${n}_vendas`, `${nome} Und`, g, w80),
      $(`ob${n}_faturado`, `${nome} R$`, g),
      x(`ob${n}_taxa`, `% ${nome}`, g, w75),
    ];
  }

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

    ...obCols(1, p.ob1_nome), ...obCols(2, p.ob2_nome), ...obCols(3, p.ob3_nome),
    ...obCols(4, p.ob4_nome), ...obCols(5, p.ob5_nome), ...obCols(6, p.ob6_nome),
    ...obCols(7, p.ob7_nome), ...obCols(8, p.ob8_nome), ...obCols(9, p.ob9_nome),
    ...obCols(10, p.ob10_nome),

    c("upsell_vendas", `${p.upsell_nome} Und`, "upsell", w80),
    $("upsell_faturado", `${p.upsell_nome} R$`, "upsell"),
    x("upsell_taxa", `% ${p.upsell_nome}`, "upsell", w75),
    c("downsell_vendas", `${p.downsell_nome} Und`, "downsell", w80),
    $("downsell_faturado", `${p.downsell_nome} R$`, "downsell"),
    x("downsell_taxa", `% ${p.downsell_nome}`, "downsell", w75),

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
