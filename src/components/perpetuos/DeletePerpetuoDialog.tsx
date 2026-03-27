"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { deletePerpetuo } from "@/actions/perpetuos";

interface Props {
  open: boolean;
  onClose: () => void;
  perpetuoId: string;
  perpetuoName: string;
}

export function DeletePerpetuoDialog({ open, onClose, perpetuoId, perpetuoName }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const result = await deletePerpetuo(perpetuoId);
    setLoading(false);

    if (result.success) {
      toast.success("Perpétuo excluído com sucesso");
      onClose();
    } else {
      toast.error(result.error ?? "Erro ao excluir perpétuo");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Excluir Perpétuo">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 rounded-[6px] bg-[#FFEBEE] p-[14px]">
          <AlertTriangle size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-error" />
          <p className="text-[13px] text-error">
            Ao excluir <strong>{perpetuoName}</strong>, todas as planilhas e
            dados diários associados serão removidos permanentemente.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[6px] px-[22px] py-[10px] text-[13.5px] font-semibold text-navy-dark transition-colors hover:bg-navy-05"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded-[6px] bg-error px-[22px] py-[10px] text-[13.5px] font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
