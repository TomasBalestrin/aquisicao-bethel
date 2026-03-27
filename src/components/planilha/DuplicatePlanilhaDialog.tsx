"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { duplicatePlanilha } from "@/actions/planilhas";

interface Props {
  open: boolean;
  onClose: () => void;
  planilhaId: string;
  perpetuoId: string;
  currentMes: number;
  currentAno: number;
}

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const inputCls = "w-full rounded-[6px] border-[1.5px] border-gray-300 bg-white px-[14px] py-[10px] text-[13.5px] text-navy-dark outline-none transition-all focus:border-gold focus:ring-[3px] focus:ring-gold-lightest";

export function DuplicatePlanilhaDialog({ open, onClose, planilhaId, currentMes, currentAno }: Props) {
  const nextMes = currentMes === 12 ? 1 : currentMes + 1;
  const nextAno = currentMes === 12 ? currentAno + 1 : currentAno;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);

    const result = await duplicatePlanilha({
      planilhaId,
      mes: Number(fd.get("mes")),
      ano: Number(fd.get("ano")),
    });

    setLoading(false);
    if (result.success && result.data) {
      toast.success("Planilha duplicada com sucesso");
      onClose();
      router.push(`/perpetuos/${result.data.perpetuoId}/planilha/${result.data.planilhaId}`);
    } else {
      toast.error(result.error ?? "Erro ao duplicar");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Duplicar Planilha">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-[13px] text-navy-50">
          Os nomes dos Order Bumps, Upsell e Downsell serão mantidos. Valores iniciam zerados.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="dup-mes" className="text-[12.5px] font-semibold text-navy-70">Mês</label>
            <select id="dup-mes" name="mes" defaultValue={nextMes} className={inputCls}>
              {MESES.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="dup-ano" className="text-[12.5px] font-semibold text-navy-70">Ano</label>
            <input id="dup-ano" name="ano" type="number" defaultValue={nextAno} min={2020} max={2099} className={inputCls} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-[6px] px-[22px] py-[10px] text-[13.5px] font-semibold text-navy-dark transition-colors hover:bg-navy-05">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="rounded-[6px] bg-gold px-[22px] py-[10px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-light hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40">
            {loading ? "Duplicando..." : "Duplicar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
