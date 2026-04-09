import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { getMetaFaturamento } from "@/actions/settings-dashboard";
import {
  calcFatPrincipal, calcTotalFunil, calcVendasPrincipal,
} from "@/lib/utils/calcMetrics";
import { safeDivide } from "@/lib/utils/calcMetrics";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import type { PerpetuoDashboard } from "@/types/dashboard";
import type { DailyEntryRow } from "@/types/daily-entry";

export const metadata = { title: "Dashboard — PerpetuoHQ" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const now = new Date();
  const mesAtual = now.getMonth() + 1;
  const anoAtual = now.getFullYear();
  const diasNoMes = new Date(anoAtual, mesAtual, 0).getDate();

  const supabase = createClient();

  const { data: perpetuosRaw } = await supabase
    .from("perpetuos")
    .select("id, name")
    .order("name");

  const perpetuosList = perpetuosRaw ?? [];

  const perpetuos: PerpetuoDashboard[] = [];

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
        id: p.id,
        name: p.name,
        investimento: 0,
        faturamento: 0,
        lucro: 0,
        margem: null,
        vendas: 0,
        diasPreenchidos: 0,
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
    }

    const lucro = fat - inv;
    perpetuos.push({
      id: p.id,
      name: p.name,
      investimento: inv,
      faturamento: fat,
      lucro,
      margem: safeDivide(lucro * 100, fat),
      vendas,
      diasPreenchidos: dias,
    });
  }

  const metaRes = await getMetaFaturamento();
  const metaFaturamento = metaRes.data ?? 0;

  return (
    <DashboardClient
      perpetuos={perpetuos}
      metaFaturamento={metaFaturamento}
      diasNoMes={diasNoMes}
      mesAtual={mesAtual}
      anoAtual={anoAtual}
      isHead={user.role === "head"}
    />
  );
}
