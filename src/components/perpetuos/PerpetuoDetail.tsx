"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileSpreadsheet, Plus, Trash2, Copy, Settings } from "lucide-react";
import { toast } from "sonner";
import { CreatePlanilhaDialog } from "@/components/planilha/CreatePlanilhaDialog";
import { DuplicatePlanilhaDialog } from "@/components/planilha/DuplicatePlanilhaDialog";
import { EditNomesDialog } from "@/components/planilha/EditNomesDialog";
import { deletePlanilha } from "@/actions/planilhas";

interface PlanilhaNomes {
  ob1_nome: string; ob2_nome: string; ob3_nome: string;
  ob4_nome: string; ob5_nome: string;
  upsell_nome: string; downsell_nome: string;
}

interface Planilha extends PlanilhaNomes {
  id: string;
  mes: number;
  ano: number;
}

interface Props {
  perpetuoId: string;
  perpetuoName: string;
  planilhas: Planilha[];
}

const MESES = [
  "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const btnCls = "flex items-center gap-1.5 rounded-[6px] px-3 py-[7px] text-[12px] font-semibold transition-colors";

export function PerpetuoDetail({ perpetuoId, perpetuoName, planilhas }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [dupTarget, setDupTarget] = useState<Planilha | null>(null);
  const [editTarget, setEditTarget] = useState<Planilha | null>(null);

  async function handleDelete(planilhaId: string) {
    const result = await deletePlanilha(planilhaId, perpetuoId);
    if (result.success) toast.success("Planilha excluída");
    else toast.error(result.error ?? "Erro ao excluir");
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/perpetuos" className="flex h-9 w-9 items-center justify-center rounded-md text-navy-50 transition-colors hover:bg-navy-05 hover:text-navy-dark">
            <ArrowLeft size={20} strokeWidth={2} />
          </Link>
          <h1 className="text-[28px] font-bold tracking-[-0.5px] text-navy-dark">{perpetuoName}</h1>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-md bg-gold px-[22px] py-[10px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-light hover:shadow-md">
          <Plus size={16} strokeWidth={2} />
          Nova Planilha
        </button>
      </div>

      {planilhas.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <FileSpreadsheet size={28} strokeWidth={2} className="text-navy-30" />
          </div>
          <p className="text-[14px] font-medium text-navy-50">Nenhuma planilha criada</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {planilhas.map((p) => (
            <div key={p.id} className="rounded-lg border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <Link href={`/perpetuos/${perpetuoId}/planilha/${p.id}`} className="flex items-center gap-2">
                <FileSpreadsheet size={18} strokeWidth={2} className="text-gold" />
                <h3 className="text-[15px] font-semibold text-navy-dark">{MESES[p.mes]} {p.ano}</h3>
              </Link>
              <div className="mt-3 flex flex-wrap gap-1 border-t border-gray-200 pt-2">
                <button onClick={() => setDupTarget(p)} className={`${btnCls} text-navy-dark hover:bg-navy-05`}>
                  <Copy size={14} strokeWidth={2} />
                  Duplicar
                </button>
                <button onClick={() => setEditTarget(p)} className={`${btnCls} text-gold hover:bg-gold-lightest`}>
                  <Settings size={14} strokeWidth={2} />
                  Nomes
                </button>
                <button onClick={() => handleDelete(p.id)} className={`${btnCls} text-error hover:bg-[#FFEBEE]`}>
                  <Trash2 size={14} strokeWidth={2} />
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreatePlanilhaDialog open={showCreate} onClose={() => setShowCreate(false)} perpetuoId={perpetuoId} />

      {dupTarget && (
        <DuplicatePlanilhaDialog
          open onClose={() => setDupTarget(null)}
          planilhaId={dupTarget.id} perpetuoId={perpetuoId}
          currentMes={dupTarget.mes} currentAno={dupTarget.ano}
        />
      )}

      {editTarget && (
        <EditNomesDialog
          open onClose={() => setEditTarget(null)}
          planilhaId={editTarget.id} perpetuoId={perpetuoId}
          nomes={{
            ob1_nome: editTarget.ob1_nome, ob2_nome: editTarget.ob2_nome,
            ob3_nome: editTarget.ob3_nome, ob4_nome: editTarget.ob4_nome,
            ob5_nome: editTarget.ob5_nome,
            upsell_nome: editTarget.upsell_nome, downsell_nome: editTarget.downsell_nome,
          }}
        />
      )}
    </>
  );
}
