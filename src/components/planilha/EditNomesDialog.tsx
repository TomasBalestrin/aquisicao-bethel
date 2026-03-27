"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { updatePlanilhaNomes } from "@/actions/planilhasAdmin";

interface Props {
  open: boolean;
  onClose: () => void;
  planilhaId: string;
  perpetuoId: string;
  nomes: {
    ob1_nome: string; ob2_nome: string; ob3_nome: string;
    ob4_nome: string; ob5_nome: string;
    upsell_nome: string; downsell_nome: string;
  };
}

const inputCls = "w-full rounded-[6px] border-[1.5px] border-gray-300 bg-white px-[14px] py-[10px] text-[13.5px] text-navy-dark outline-none transition-all placeholder:text-navy-30 focus:border-gold focus:ring-[3px] focus:ring-gold-lightest";
const labelCls = "text-[12.5px] font-semibold text-navy-70";

export function EditNomesDialog({ open, onClose, planilhaId, perpetuoId, nomes }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);

    const result = await updatePlanilhaNomes({
      id: planilhaId,
      perpetuo_id: perpetuoId,
      ob1_nome: fd.get("ob1") as string,
      ob2_nome: fd.get("ob2") as string,
      ob3_nome: fd.get("ob3") as string,
      ob4_nome: fd.get("ob4") as string,
      ob5_nome: fd.get("ob5") as string,
      upsell_nome: fd.get("upsell") as string,
      downsell_nome: fd.get("downsell") as string,
    });

    setLoading(false);
    if (result.success) {
      toast.success("Nomes atualizados");
      onClose();
    } else {
      toast.error(result.error ?? "Erro ao salvar");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Editar Nomes">
      <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto pr-1">
        {([
          ["ob1", "Order Bump 1", nomes.ob1_nome],
          ["ob2", "Order Bump 2", nomes.ob2_nome],
          ["ob3", "Order Bump 3", nomes.ob3_nome],
          ["ob4", "Order Bump 4", nomes.ob4_nome],
          ["ob5", "Order Bump 5", nomes.ob5_nome],
          ["upsell", "Upsell", nomes.upsell_nome],
          ["downsell", "Downsell", nomes.downsell_nome],
        ] as const).map(([name, label, value]) => (
          <div key={name} className="flex flex-col gap-1">
            <label htmlFor={`en-${name}`} className={labelCls}>{label}</label>
            <input id={`en-${name}`} name={name} defaultValue={value} className={inputCls} />
          </div>
        ))}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-[6px] px-[22px] py-[10px] text-[13.5px] font-semibold text-navy-dark transition-colors hover:bg-navy-05">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="rounded-[6px] bg-gold px-[22px] py-[10px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-light hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40">
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
