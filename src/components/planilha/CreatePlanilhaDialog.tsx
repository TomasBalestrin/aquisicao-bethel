"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { createPlanilha } from "@/actions/planilhas";

interface Props {
  open: boolean;
  onClose: () => void;
  perpetuoId: string;
}

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const inputCls = "w-full rounded-[6px] border-[1.5px] border-gray-300 bg-white px-[14px] py-[10px] text-[13.5px] text-navy-dark outline-none transition-all placeholder:text-navy-30 focus:border-gold focus:ring-[3px] focus:ring-gold-lightest";
const labelCls = "text-[12.5px] font-semibold text-navy-70";

export function CreatePlanilhaDialog({ open, onClose, perpetuoId }: Props) {
  const [loading, setLoading] = useState(false);
  const now = new Date();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const result = await createPlanilha({
      perpetuo_id: perpetuoId,
      mes: Number(fd.get("mes")),
      ano: Number(fd.get("ano")),
      ob1_nome: (fd.get("ob1") as string) || undefined,
      ob2_nome: (fd.get("ob2") as string) || undefined,
      ob3_nome: (fd.get("ob3") as string) || undefined,
      ob4_nome: (fd.get("ob4") as string) || undefined,
      ob5_nome: (fd.get("ob5") as string) || undefined,
      upsell_nome: (fd.get("upsell") as string) || undefined,
      downsell_nome: (fd.get("downsell") as string) || undefined,
    });
    setLoading(false);

    if (result.success) {
      toast.success("Planilha criada com sucesso");
      onClose();
    } else {
      toast.error(result.error ?? "Erro ao criar planilha");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova Planilha">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="mes" className={labelCls}>Mês</label>
            <select id="mes" name="mes" defaultValue={now.getMonth() + 1} className={inputCls}>
              {MESES.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ano" className={labelCls}>Ano</label>
            <input id="ano" name="ano" type="number" defaultValue={now.getFullYear()} min={2020} max={2099} className={inputCls} />
          </div>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-gold">Nomes personalizados</p>

        {[1,2,3,4,5].map((n) => (
          <div key={n} className="flex flex-col gap-1">
            <label htmlFor={`ob${n}`} className={labelCls}>Order Bump {n}</label>
            <input id={`ob${n}`} name={`ob${n}`} placeholder={`Order Bump ${n}`} className={inputCls} />
          </div>
        ))}
        <div className="flex flex-col gap-1">
          <label htmlFor="upsell" className={labelCls}>Upsell</label>
          <input id="upsell" name="upsell" placeholder="Upsell" className={inputCls} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="downsell" className={labelCls}>Downsell</label>
          <input id="downsell" name="downsell" placeholder="Downsell" className={inputCls} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-[6px] px-[22px] py-[10px] text-[13.5px] font-semibold text-navy-dark transition-colors hover:bg-navy-05">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="rounded-[6px] bg-gold px-[22px] py-[10px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-light hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40">
            {loading ? "Criando..." : "Criar Planilha"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
