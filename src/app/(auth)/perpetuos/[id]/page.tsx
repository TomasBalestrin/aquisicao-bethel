import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PerpetuoDetail } from "@/components/perpetuos/PerpetuoDetail";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("perpetuos").select("*").eq("id", params.id).single();
  return { title: data ? `${data.name} — PerpetuoHQ` : "Perpétuo" };
}

export default async function PerpetuoDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: perpetuo } = await supabase.from("perpetuos").select("*").eq("id", params.id).single();
  if (!perpetuo) notFound();

  const { data: planilhas } = await supabase
    .from("planilhas")
    .select("*")
    .eq("perpetuo_id", params.id)
    .order("ano", { ascending: false })
    .order("mes", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <PerpetuoDetail
        perpetuoId={perpetuo.id}
        perpetuoName={perpetuo.name}
        planilhas={(planilhas ?? []).map((p) => ({
          id: p.id, mes: p.mes, ano: p.ano,
          ob1_nome: p.ob1_nome, ob2_nome: p.ob2_nome, ob3_nome: p.ob3_nome,
          ob4_nome: p.ob4_nome, ob5_nome: p.ob5_nome,
          upsell_nome: p.upsell_nome, downsell_nome: p.downsell_nome,
        }))}
      />
    </div>
  );
}
