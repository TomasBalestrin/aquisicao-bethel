"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { updatePerpetuo } from "@/actions/perpetuos";

interface Props {
  open: boolean;
  onClose: () => void;
  perpetuoId: string;
  currentName: string;
}

export function EditPerpetuoDialog({ open, onClose, perpetuoId, currentName }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await updatePerpetuo(perpetuoId, formData);
    setLoading(false);

    if (result.success) {
      toast.success("Perpétuo atualizado com sucesso");
      onClose();
    } else {
      toast.error(result.error ?? "Erro ao editar perpétuo");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Editar Perpétuo">
      <form action={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-name" className="text-[12.5px] font-semibold text-navy-70">
            Nome do perpétuo
          </label>
          <input
            id="edit-name"
            name="name"
            type="text"
            required
            autoFocus
            defaultValue={currentName}
            className="w-full rounded-[6px] border-[1.5px] border-gray-300 bg-white px-[14px] py-[10px] text-[13.5px] text-navy-dark outline-none transition-all placeholder:text-navy-30 focus:border-gold focus:ring-[3px] focus:ring-gold-lightest"
          />
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
            type="submit"
            disabled={loading}
            className="rounded-[6px] bg-gold px-[22px] py-[10px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-light hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
