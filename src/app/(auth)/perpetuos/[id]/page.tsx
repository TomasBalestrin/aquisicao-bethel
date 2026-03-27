import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileSpreadsheet, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("perpetuos")
    .select("*")
    .eq("id", params.id)
    .single();

  return { title: data ? `${data.name} — PerpetuoHQ` : "Perpétuo" };
}

export default async function PerpetuoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: perpetuo } = await supabase
    .from("perpetuos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!perpetuo) notFound();

  const { data: planilhas } = await supabase
    .from("planilhas")
    .select("*")
    .eq("perpetuo_id", params.id)
    .order("ano", { ascending: false })
    .order("mes", { ascending: false });

  const meses = [
    "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/perpetuos"
            className="flex h-9 w-9 items-center justify-center rounded-md text-navy-50 transition-colors hover:bg-navy-05 hover:text-navy-dark"
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </Link>
          <h1 className="text-[28px] font-bold tracking-[-0.5px] text-navy-dark">
            {perpetuo.name}
          </h1>
        </div>
        <button
          disabled
          className="flex items-center gap-2 rounded-md bg-gold px-[22px] py-[10px] text-[13.5px] font-semibold text-white opacity-40"
          title="Em breve"
        >
          <Plus size={16} strokeWidth={2} />
          Nova Planilha
        </button>
      </div>

      {/* Lista de planilhas */}
      {!planilhas || planilhas.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <FileSpreadsheet size={28} strokeWidth={2} className="text-navy-30" />
          </div>
          <p className="text-[14px] font-medium text-navy-50">
            Nenhuma planilha criada
          </p>
          <p className="text-[12px] text-navy-30">
            A funcionalidade de planilhas será implementada em breve
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {planilhas.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={18} strokeWidth={2} className="text-gold" />
                <h3 className="text-[15px] font-semibold text-navy-dark">
                  {meses[p.mes]} {p.ano}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
