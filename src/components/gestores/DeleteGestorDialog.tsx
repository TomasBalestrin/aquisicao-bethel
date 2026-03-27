"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { deleteGestor } from "@/actions/gestoresAdmin";

interface Props {
  open: boolean;
  onClose: () => void;
  gestorId: string;
  gestorName: string;
}

export function DeleteGestorDialog({ open, onClose, gestorId, gestorName }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const result = await deleteGestor(gestorId);
    setLoading(false);

    if (result.success) {
      toast.success("Gestor excluído com sucesso");
      onClose();
    } else {
      toast.error(result.error ?? "Erro ao excluir gestor");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Excluir Gestor">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 rounded-[6px] bg-[#FFEBEE] p-[14px]">
          <AlertTriangle size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-error" />
          <p className="text-[13px] text-error">
            Ao excluir <strong>{gestorName}</strong>, o gestor perderá
            acesso a todos os perpétuos concedidos. Esta ação não pode ser desfeita.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-[6px] px-[22px] py-[10px] text-[13.5px] font-semibold text-navy-dark transition-colors hover:bg-navy-05">
            Cancelar
          </button>
          <button onClick={handleDelete} disabled={loading} className="rounded-[6px] bg-error px-[22px] py-[10px] text-[13.5px] font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
