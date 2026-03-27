import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDailyEntries } from "@/actions/dailyEntries";
import { SpreadsheetGrid } from "@/components/planilha/SpreadsheetGrid";

const MESES = [
  "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

interface Props {
  params: { id: string; planilhaId: string };
}

export async function generateMetadata({ params }: Props) {
  const supabase = createClient();
  const { data } = await supabase.from("planilhas").select("*").eq("id", params.planilhaId).single();
  if (!data) return { title: "Planilha" };
  return { title: `${MESES[data.mes]} ${data.ano} — PerpetuoHQ` };
}

export default async function PlanilhaPage({ params }: Props) {
  const supabase = createClient();
  const { data: planilha } = await supabase
    .from("planilhas").select("*").eq("id", params.planilhaId).single();

  if (!planilha) notFound();

  const result = await getDailyEntries(params.planilhaId);
  const entries = result.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link
          href={`/perpetuos/${params.id}`}
          className="flex h-9 w-9 items-center justify-center rounded-md text-navy-50 transition-colors hover:bg-navy-05 hover:text-navy-dark"
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </Link>
        <h1 className="text-[22px] font-bold tracking-[-0.3px] text-navy-dark">
          {MESES[planilha.mes]} {planilha.ano}
        </h1>
      </div>
      <SpreadsheetGrid
        entries={entries}
        planilha={{
          ob1_nome: planilha.ob1_nome, ob2_nome: planilha.ob2_nome,
          ob3_nome: planilha.ob3_nome, ob4_nome: planilha.ob4_nome,
          ob5_nome: planilha.ob5_nome,
          upsell_nome: planilha.upsell_nome,
          downsell_nome: planilha.downsell_nome,
        }}
      />
    </div>
  );
}
