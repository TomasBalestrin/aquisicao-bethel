"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileSpreadsheet, Plus, Trash2, Copy, Pencil, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { AlertTriangle } from "lucide-react";
import { CreatePlanilhaDialog } from "@/components/planilha/CreatePlanilhaDialog";
import { DuplicatePlanilhaDialog } from "@/components/planilha/DuplicatePlanilhaDialog";
import { EditNomesDialog } from "@/components/planilha/EditNomesDialog";
import { deletePlanilha } from "@/actions/planilhas";

interface PlanilhaNomes {
  ob1_nome: string; ob2_nome: string; ob3_nome: string;
  ob4_nome: string; ob5_nome: string; ob6_nome: string;
  upsell_nome: string; downsell_nome: string;
  plat1_nome: string; plat2_nome: string; plat3_nome: string;
  plat4_nome: string; plat5_nome: string;
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

const iconBtn = "flex h-8 w-8 items-center justify-center rounded-md transition-colors";

export function PerpetuoDetail({ perpetuoId, perpetuoName, planilhas }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [dupTarget, setDupTarget] = useState<Planilha | null>(null);
  const [editTarget, setEditTarget] = useState<Planilha | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Planilha | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deletePlanilha(deleteTarget.id, perpetuoId);
    setDeleting(false);
    if (result.success) { toast.success("Planilha excluída"); setDeleteTarget(null); }
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
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={18} strokeWidth={2} className="text-gold" />
                <h3 className="text-[15px] font-semibold text-navy-dark">{MESES[p.mes]} {p.ano}</h3>
              </div>
              <div className="mt-3 flex items-center justify-end gap-2 border-t border-gray-200 pt-3">
                <Link href={`/perpetuos/${perpetuoId}/planilha/${p.id}`} className={`${iconBtn} text-navy-50 hover:bg-navy-05 hover:text-gold`} title="Abrir">
                  <ExternalLink size={18} strokeWidth={2} />
                </Link>
                <button onClick={() => setDupTarget(p)} className={`${iconBtn} text-navy-50 hover:bg-navy-05 hover:text-gold`} title="Duplicar">
                  <Copy size={18} strokeWidth={2} />
                </button>
                <button onClick={() => setEditTarget(p)} className={`${iconBtn} text-navy-50 hover:bg-navy-05 hover:text-gold`} title="Editar">
                  <Pencil size={18} strokeWidth={2} />
                </button>
                <button onClick={() => setDeleteTarget(p)} className={`${iconBtn} text-navy-50 hover:bg-[#FFEBEE] hover:text-error`} title="Excluir">
                  <Trash2 size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreatePlanilhaDialog open={showCreate} onClose={() => setShowCreate(false)} perpetuoId={perpetuoId} />
      {dupTarget && <DuplicatePlanilhaDialog open onClose={() => setDupTarget(null)} planilhaId={dupTarget.id} perpetuoId={perpetuoId} currentMes={dupTarget.mes} currentAno={dupTarget.ano} />}
      {editTarget && <EditNomesDialog open onClose={() => setEditTarget(null)} planilhaId={editTarget.id} perpetuoId={perpetuoId} nomes={{ ob1_nome: editTarget.ob1_nome, ob2_nome: editTarget.ob2_nome, ob3_nome: editTarget.ob3_nome, ob4_nome: editTarget.ob4_nome, ob5_nome: editTarget.ob5_nome, ob6_nome: editTarget.ob6_nome, upsell_nome: editTarget.upsell_nome, downsell_nome: editTarget.downsell_nome, plat1_nome: editTarget.plat1_nome, plat2_nome: editTarget.plat2_nome, plat3_nome: editTarget.plat3_nome, plat4_nome: editTarget.plat4_nome, plat5_nome: editTarget.plat5_nome }} />}

      {deleteTarget && (
        <Modal open onClose={() => setDeleteTarget(null)} title="Excluir Planilha">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 rounded-[6px] bg-[#FFEBEE] p-[14px]">
              <AlertTriangle size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-error" />
              <p className="text-[13px] text-error">
                Ao excluir <strong>{MESES[deleteTarget.mes]} {deleteTarget.ano}</strong>, todos os dados diários serão removidos permanentemente.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)} className="rounded-[6px] px-[22px] py-[10px] text-[13.5px] font-semibold text-navy-dark transition-colors hover:bg-navy-05">Cancelar</button>
              <button onClick={handleDelete} disabled={deleting} className="rounded-[6px] bg-error px-[22px] py-[10px] text-[13.5px] font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
                {deleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
