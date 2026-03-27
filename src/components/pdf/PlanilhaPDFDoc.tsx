import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { DailyEntryRow } from "@/types/daily-entry";

const MESES = [
  "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

interface Props {
  perpetuoName: string;
  mes: number;
  ano: number;
  entries: DailyEntryRow[];
}

const s = StyleSheet.create({
  page: { padding: 30, fontSize: 7, fontFamily: "Helvetica" },
  header: { marginBottom: 16 },
  title: { fontSize: 16, fontWeight: "bold", color: "#001321" },
  subtitle: { fontSize: 10, color: "#002C4A", marginTop: 4 },
  table: { width: "100%" },
  headRow: { flexDirection: "row", backgroundColor: "#001321" },
  headCell: { color: "#FFFFFF", padding: 4, fontWeight: "bold", fontSize: 6, width: "7.7%" },
  row: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#E9ECEF" },
  cell: { padding: 4, fontSize: 6, color: "#001321", width: "7.7%" },
  calcCell: { padding: 4, fontSize: 6, color: "#002C4A", width: "7.7%", backgroundColor: "#F8F9FA" },
  totalRow: { flexDirection: "row", backgroundColor: "#F5EDE1" },
  footer: { marginTop: 16, fontSize: 8, color: "#B19365", textAlign: "center" },
});

function brl(cents: number): string {
  return (cents / 100).toFixed(2);
}

function pct(a: number, b: number): string {
  return b === 0 ? "—" : ((a / b) * 100).toFixed(1) + "%";
}

function fatTotal(e: DailyEntryRow): number {
  return e.faturamento_principal + e.ob1_faturado + e.ob2_faturado
    + e.ob3_faturado + e.ob4_faturado + e.ob5_faturado
    + e.upsell_faturado + e.downsell_faturado;
}

const COLS = ["Dia", "Invest.", "Fat.Princ", "Vendas", "Fat.Total", "Lucro", "Margem%",
  "CPA", "Ticket", "OB1", "OB2", "Upsell", "Downsell"];

export function PlanilhaPDFDoc({ perpetuoName, mes, ano, entries }: Props) {
  const totInv = entries.reduce((a, e) => a + e.investimento, 0);
  const totFat = entries.reduce((a, e) => a + fatTotal(e), 0);
  const totVendas = entries.reduce((a, e) => a + e.vendas_principal, 0);
  const totLucro = totFat - totInv;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.header}>
          <Text style={s.title}>PerpetuoHQ</Text>
          <Text style={s.subtitle}>{perpetuoName} — {MESES[mes]} {ano}</Text>
        </View>
        <View style={s.table}>
          <View style={s.headRow}>
            {COLS.map((c) => <Text key={c} style={s.headCell}>{c}</Text>)}
          </View>
          {entries.map((e) => {
            const ft = fatTotal(e);
            const luc = ft - e.investimento;
            return (
              <View key={e.id} style={s.row}>
                <Text style={s.cell}>{e.data.split("-")[2]}</Text>
                <Text style={s.cell}>{brl(e.investimento)}</Text>
                <Text style={s.cell}>{brl(e.faturamento_principal)}</Text>
                <Text style={s.cell}>{e.vendas_principal}</Text>
                <Text style={s.calcCell}>{brl(ft)}</Text>
                <Text style={s.calcCell}>{brl(luc)}</Text>
                <Text style={s.calcCell}>{pct(luc, ft)}</Text>
                <Text style={s.calcCell}>{e.vendas_principal === 0 ? "—" : brl(e.investimento / e.vendas_principal)}</Text>
                <Text style={s.calcCell}>{e.vendas_principal === 0 ? "—" : brl(ft / e.vendas_principal)}</Text>
                <Text style={s.cell}>{brl(e.ob1_faturado)}</Text>
                <Text style={s.cell}>{brl(e.ob2_faturado)}</Text>
                <Text style={s.cell}>{brl(e.upsell_faturado)}</Text>
                <Text style={s.cell}>{brl(e.downsell_faturado)}</Text>
              </View>
            );
          })}
          <View style={s.totalRow}>
            <Text style={s.cell}>Total</Text>
            <Text style={s.cell}>{brl(totInv)}</Text>
            <Text style={s.cell}>{brl(entries.reduce((a, e) => a + e.faturamento_principal, 0))}</Text>
            <Text style={s.cell}>{totVendas}</Text>
            <Text style={s.calcCell}>{brl(totFat)}</Text>
            <Text style={s.calcCell}>{brl(totLucro)}</Text>
            <Text style={s.calcCell}>{pct(totLucro, totFat)}</Text>
            <Text style={s.calcCell}>{totVendas === 0 ? "—" : brl(totInv / totVendas)}</Text>
            <Text style={s.calcCell}>{totVendas === 0 ? "—" : brl(totFat / totVendas)}</Text>
            <Text style={s.cell}>{brl(entries.reduce((a, e) => a + e.ob1_faturado, 0))}</Text>
            <Text style={s.cell}>{brl(entries.reduce((a, e) => a + e.ob2_faturado, 0))}</Text>
            <Text style={s.cell}>{brl(entries.reduce((a, e) => a + e.upsell_faturado, 0))}</Text>
            <Text style={s.cell}>{brl(entries.reduce((a, e) => a + e.downsell_faturado, 0))}</Text>
          </View>
        </View>
        <Text style={s.footer}>Gerado em {new Date().toLocaleDateString("pt-BR")}</Text>
      </Page>
    </Document>
  );
}
