"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { updatePlanilhaNomes } from "@/actions/planilhasAdmin";

interface Nomes {
  ob1_nome: string; ob2_nome: string; ob3_nome: string;
  ob4_nome: string; ob5_nome: string; ob6_nome: string;
  ob7_nome: string; ob8_nome: string; ob9_nome: string; ob10_nome: string;
  upsell_nome: string; downsell_nome: string;
  plat1_nome: string; plat2_nome: string; plat3_nome: string;
  plat4_nome: string; plat5_nome: string;
}

interface Props { open: boolean; onClose: () => void; planilhaId: string; perpetuoId: string; nomes: Nomes }

const inputCls = "w-full rounded-[6px] border-[1.5px] border-gray-300 bg-white px-[14px] py-[10px] text-[13.5px] text-navy-dark outline-none transition-all placeholder:text-navy-30 focus:border-gold focus:ring-[3px] focus:ring-gold-lightest";
const labelCls = "text-[12.5px] font-semibold text-navy-70";
const sectionCls = "text-[11px] font-bold uppercase tracking-[1.5px] text-gold";

export function EditNomesDialog({ open, onClose, planilhaId, perpetuoId, nomes }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const g = (n: string) => fd.get(n) as string;
    const result = await updatePlanilhaNomes({
      id: planilhaId, perpetuo_id: perpetuoId,
      ob1_nome: g("ob1"), ob2_nome: g("ob2"), ob3_nome: g("ob3"), ob4_nome: g("ob4"), ob5_nome: g("ob5"),
      ob6_nome: g("ob6"), ob7_nome: g("ob7"), ob8_nome: g("ob8"), ob9_nome: g("ob9"), ob10_nome: g("ob10"),
      upsell_nome: g("upsell"), downsell_nome: g("downsell"),
      plat1_nome: g("plat1"), plat2_nome: g("plat2"), plat3_nome: g("plat3"), plat4_nome: g("plat4"), plat5_nome: g("plat5"),
    });
    setLoading(false);
    if (result.success) { toast.success("Nomes atualizados"); onClose(); }
    else toast.error(result.error ?? "Erro ao salvar");
  }

  const platFields: [string, string, string][] = [
    ["plat1","Plataforma 1", nomes.plat1_nome], ["plat2","Plataforma 2", nomes.plat2_nome],
    ["plat3","Plataforma 3", nomes.plat3_nome], ["plat4","Plataforma 4", nomes.plat4_nome],
    ["plat5","Plataforma 5", nomes.plat5_nome],
  ];
  const obFields: [string, string, string][] = Array.from({ length: 10 }, (_, i) => {
    const n = i + 1;
    const key = `ob${n}` as keyof Nomes;
    return [`ob${n}`, `OB ${n}`, nomes[key]];
  });

  return (
    <Modal open={open} onClose={onClose} title="Editar Nomes">
      <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto pr-1">
        <p className={sectionCls}>Plataformas</p>
        {platFields.map(([n,l,v])=>(<div key={n} className="flex flex-col gap-1"><label htmlFor={`en-${n}`} className={labelCls}>{l}</label><input id={`en-${n}`} name={n} defaultValue={v} className={inputCls}/></div>))}
        <p className={sectionCls}>Order Bumps</p>
        {obFields.map(([n,l,v])=>(<div key={n} className="flex flex-col gap-1"><label htmlFor={`en-${n}`} className={labelCls}>{l}</label><input id={`en-${n}`} name={n} defaultValue={v} className={inputCls}/></div>))}
        <p className={sectionCls}>Upsell / Downsell</p>
        <div className="flex flex-col gap-1"><label htmlFor="en-upsell" className={labelCls}>Upsell</label><input id="en-upsell" name="upsell" defaultValue={nomes.upsell_nome} className={inputCls}/></div>
        <div className="flex flex-col gap-1"><label htmlFor="en-downsell" className={labelCls}>Downsell</label><input id="en-downsell" name="downsell" defaultValue={nomes.downsell_nome} className={inputCls}/></div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-[6px] px-[22px] py-[10px] text-[13.5px] font-semibold text-navy-dark transition-colors hover:bg-navy-05">Cancelar</button>
          <button type="submit" disabled={loading} className="rounded-[6px] bg-gold px-[22px] py-[10px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-light hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40">
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
