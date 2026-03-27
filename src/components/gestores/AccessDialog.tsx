"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { getGestorAccess, updateGestorAccess } from "@/actions/gestorAccess";

interface Perpetuo {
  id: string;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  gestorId: string;
  gestorName: string;
  perpetuos: Perpetuo[];
}

export function AccessDialog({ open, onClose, gestorId, gestorName, perpetuos }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!open) return;
    setFetching(true);
    getGestorAccess(gestorId).then((res) => {
      if (res.success && res.data) setSelected(new Set(res.data));
      setFetching(false);
    });
  }, [open, gestorId]);

  function toggle(perpetuoId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(perpetuoId)) next.delete(perpetuoId);
      else next.add(perpetuoId);
      return next;
    });
  }

  async function handleSave() {
    setLoading(true);
    const result = await updateGestorAccess(gestorId, Array.from(selected));
    setLoading(false);

    if (result.success) {
      toast.success("Acessos atualizados");
      onClose();
    } else {
      toast.error(result.error ?? "Erro ao salvar acessos");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Acessos — ${gestorName}`}>
      <div className="flex flex-col gap-4">
        {fetching ? (
          <p className="text-[13px] text-navy-50">Carregando...</p>
        ) : perpetuos.length === 0 ? (
          <p className="text-[13px] text-navy-50">Nenhum perpétuo cadastrado</p>
        ) : (
          <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto">
            {perpetuos.map((p) => (
              <label key={p.id} className="flex cursor-pointer items-center gap-3 rounded-[6px] px-3 py-2.5 transition-colors hover:bg-navy-05">
                <input
                  type="checkbox"
                  checked={selected.has(p.id)}
                  onChange={() => toggle(p.id)}
                  className="h-[18px] w-[18px] rounded-[4px] border-[1.5px] border-gray-400 accent-navy-dark"
                />
                <span className="text-[14px] font-medium text-navy-dark">{p.name}</span>
              </label>
            ))}
          </div>
        )}
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-[6px] px-[22px] py-[10px] text-[13.5px] font-semibold text-navy-dark transition-colors hover:bg-navy-05">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={loading || fetching} className="rounded-[6px] bg-gold px-[22px] py-[10px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-light hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40">
            {loading ? "Salvando..." : "Salvar Acessos"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
