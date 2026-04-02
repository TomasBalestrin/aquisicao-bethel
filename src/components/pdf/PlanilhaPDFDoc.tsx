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
  page: { padding: 24, fontSize: 6, fontFamily: "Helvetica" },
  header: { marginBottom: 12 },
  title: { fontSize: 14, fontWeight: "bold", color: "#001321" },
  subtitle: { fontSize: 9, color: "#002C4A", marginTop: 3 },
  table: { width: "100%" },
  headRow: { flexDirection: "row", backgroundColor: "#001321" },
  headCell: { color: "#FFF", padding: 3, fontWeight: "bold", fontSize: 5, width: "8.3%" },
  row: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#E9ECEF" },
  cell: { padding: 3, fontSize: 5, color: "#001321", width: "8.3%" },
  calcCell: { padding: 3, fontSize: 5, color: "#002C4A", width: "8.3%", backgroundColor: "#F8F9FA" },
  totalRow: { flexDirection: "row", backgroundColor: "#F5EDE1" },
  footer: { marginTop: 12, fontSize: 7, color: "#B19365", textAlign: "center" },
});

function brl(c: number): string { return (c / 100).toFixed(2); }
function pct(a: number, b: number): string { return b === 0 ? "—" : ((a / b) * 100).toFixed(1) + "%"; }

function vp(e: DailyEntryRow): number {
  return e.plat1_vendas + e.plat2_vendas + e.plat3_vendas + e.plat4_vendas + e.plat5_vendas;
}
function fp(e: DailyEntryRow): number {
  return e.plat1_faturado + e.plat2_faturado + e.plat3_faturado + e.plat4_faturado + e.plat5_faturado;
}
function funil(e: DailyEntryRow): number {
  return e.ob1_faturado + e.ob2_faturado + e.ob3_faturado + e.ob4_faturado
    + e.ob5_faturado + e.ob6_faturado + e.upsell_faturado + e.downsell_faturado;
}
function fat(e: DailyEntryRow): number { return fp(e) + funil(e); }

const COLS = ["Dia","Invest","Tot.Vend","Margem","Lucro","Vd.Princ","Fat.Princ",
  "Tot.Funil","CPA","Ticket","CTR","CPM"];

export function PlanilhaPDFDoc({ perpetuoName, mes, ano, entries }: Props) {
  const tInv = entries.reduce((a, e) => a + e.investimento, 0);
  const tFat = entries.reduce((a, e) => a + fat(e), 0);
  const tVp = entries.reduce((a, e) => a + vp(e), 0);

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
            const f = fat(e); const l = f - e.investimento; const v = vp(e);
            return (
              <View key={e.id} style={s.row}>
                <Text style={s.cell}>{e.data.split("-")[2]}</Text>
                <Text style={s.cell}>{brl(e.investimento)}</Text>
                <Text style={s.calcCell}>{brl(f)}</Text>
                <Text style={s.calcCell}>{pct(l, f)}</Text>
                <Text style={s.calcCell}>{brl(l)}</Text>
                <Text style={s.calcCell}>{v}</Text>
                <Text style={s.calcCell}>{brl(fp(e))}</Text>
                <Text style={s.calcCell}>{brl(funil(e))}</Text>
                <Text style={s.calcCell}>{v === 0 ? "—" : brl(e.investimento / v)}</Text>
                <Text style={s.calcCell}>{v === 0 ? "—" : brl(f / v)}</Text>
                <Text style={s.cell}>{e.ctr}%</Text>
                <Text style={s.cell}>{brl(e.cpm)}</Text>
              </View>
            );
          })}
          <View style={s.totalRow}>
            <Text style={s.cell}>Total</Text>
            <Text style={s.cell}>{brl(tInv)}</Text>
            <Text style={s.calcCell}>{brl(tFat)}</Text>
            <Text style={s.calcCell}>{pct(tFat - tInv, tFat)}</Text>
            <Text style={s.calcCell}>{brl(tFat - tInv)}</Text>
            <Text style={s.calcCell}>{tVp}</Text>
            <Text style={s.calcCell}>{brl(entries.reduce((a, e) => a + fp(e), 0))}</Text>
            <Text style={s.calcCell}>{brl(entries.reduce((a, e) => a + funil(e), 0))}</Text>
            <Text style={s.calcCell}>{tVp === 0 ? "—" : brl(tInv / tVp)}</Text>
            <Text style={s.calcCell}>{tVp === 0 ? "—" : brl(tFat / tVp)}</Text>
            <Text style={s.cell}>—</Text>
            <Text style={s.cell}>—</Text>
          </View>
        </View>
        <Text style={s.footer}>Gerado em {new Date().toLocaleDateString("pt-BR")}</Text>
      </Page>
    </Document>
  );
}
