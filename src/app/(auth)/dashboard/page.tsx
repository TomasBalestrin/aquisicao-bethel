import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { createClient } from "@/lib/supabase/server";
import {
  getMetaFaturamento,
  getMetaLucroSemanal,
} from "@/actions/settings-dashboard";
import {
  calcFatPrincipal, calcTotalFunil, calcVendasPrincipal, safeDivide,
} from "@/lib/utils/calcMetrics";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import type { PerpetuoDashboard } from "@/types/dashboard";
import type { DailyEntryRow } from "@/types/daily-entry";

export const metadata = { title: "Dashboard — PerpetuoHQ" };

function getWeekRange(now: Date): { start: string; end: string } {
  const day = now.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().slice(0, 10),
    end: sunday.toISOString().slice(0, 10),
  };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const now = new Date();
  const mesAtual = now.getMonth() + 1;
  const anoAtual = now.getFullYear();
  const diasNoMes = new Date(anoAtual, mesAtual, 0).getDate();
  const week = getWeekRange(now);

  const supabase = createClient();

  const { data: perpetuosRaw } = await supabase
    .from("perpetuos")
    .select("id, name")
    .order("name");

  const perpetuosList = perpetuosRaw ?? [];
  const perpetuos: PerpetuoDashboard[] = [];
  let lucroSemana = 0;

  for (const p of perpetuosList) {
    const { data: planilha } = await supabase
      .from("planilhas")
      .select("id")
      .eq("perpetuo_id", p.id)
      .eq("mes", mesAtual)
      .eq("ano", anoAtual)
      .single();

    if (!planilha) {
      perpetuos.push({
        id: p.id, name: p.name,
        investimento: 0, faturamento: 0, lucro: 0,
        margem: null, vendas: 0, diasPreenchidos: 0,
      });
      continue;
    }

    const { data: entries } = await supabase
      .from("daily_entries")
      .select("*")
      .eq("planilha_id", planilha.id)
      .order("data", { ascending: true });

    const rows = (entries ?? []) as DailyEntryRow[];
    let inv = 0;
    let fat = 0;
    let vendas = 0;
    let dias = 0;

    for (const e of rows) {
      const fatPrinc = calcFatPrincipal(e);
      const fatFunil = calcTotalFunil(e);
      const fatTotal = fatPrinc + fatFunil;
      const vp = calcVendasPrincipal(e);
      if (e.investimento > 0 || fatPrinc > 0) dias++;
      inv += e.investimento;
      fat += fatTotal;
      vendas += vp;

      if (e.data >= week.start && e.data <= week.end) {
        lucroSemana += fatTotal - e.investimento;
      }
    }

    const lucro = fat - inv;
    perpetuos.push({
      id: p.id, name: p.name,
      investimento: inv, faturamento: fat, lucro,
      margem: safeDivide(lucro * 100, inv),
      vendas, diasPreenchidos: dias,
    });
  }

  const [metaRes, metaSemRes] = await Promise.all([
    getMetaFaturamento(),
    getMetaLucroSemanal(),
  ]);

  return (
    <DashboardClient
      perpetuos={perpetuos}
      metaFaturamento={metaRes.data ?? 0}
      metaLucroSemanal={metaSemRes.data ?? 0}
      lucroSemana={lucroSemana}
      diasNoMes={diasNoMes}
      mesAtual={mesAtual}
      anoAtual={anoAtual}
      isHead={user.role === "head"}
    />
  );
}
