"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import {
  updateMetaFaturamento,
  updateMetaLucroSemanal,
} from "@/actions/settings-dashboard";
import { toast } from "sonner";
import { FieldInput } from "./FieldInput";

interface Props {
  open: boolean;
  onClose: () => void;
  currentMeta: number;
  currentMetaSemanal: number;
  onSaved: (metaFat: number, metaLucro: number) => void;
}

export function SettingsModal({
  open, onClose, currentMeta, currentMetaSemanal, onSaved,
}: Props) {
  const [valFat, setValFat] = useState("");
  const [valLucro, setValLucro] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setValFat(currentMeta > 0 ? String(currentMeta / 100) : "");
      setValLucro(currentMetaSemanal > 0 ? String(currentMetaSemanal / 100) : "");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, currentMeta, currentMetaSemanal]);

  if (!open) return null;

  async function handleSave() {
    const numFat = parseFloat(valFat.replace(",", "."));
    const numLucro = parseFloat(valLucro.replace(",", "."));
    if (isNaN(numFat) || numFat < 0 || isNaN(numLucro) || numLucro < 0) {
      toast.error("Informe valores válidos");
      return;
    }
    const centsFat = Math.round(numFat * 100);
    const centsLucro = Math.round(numLucro * 100);
    setSaving(true);
    const [r1, r2] = await Promise.all([
      updateMetaFaturamento(centsFat),
      updateMetaLucroSemanal(centsLucro),
    ]);
    setSaving(false);
    if (r1.success && r2.success) {
      toast.success("Metas salvas");
      onSaved(centsFat, centsLucro);
      onClose();
    } else {
      toast.error(r1.error ?? r2.error ?? "Erro ao salvar");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,19,33,0.5)" }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col gap-5"
        style={{
          background: "#fff", borderRadius: 16,
          padding: "28px 32px", width: 400,
          boxShadow: "0 16px 50px rgba(0,19,33,0.16)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-navy-50 hover:text-navy-dark">
          <X size={18} strokeWidth={2} />
        </button>

        <h3 className="font-bold" style={{ fontSize: 17, color: "#001321" }}>Configurações</h3>

        <FieldInput ref={inputRef} label="Meta de faturamento mensal (R$)" value={valFat} onChange={setValFat} placeholder="Ex: 500000" onEnter={handleSave} />
        <FieldInput label="Meta de lucro semanal (R$)" value={valLucro} onChange={setValLucro} placeholder="Ex: 50000" onEnter={handleSave} />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="font-semibold hover:bg-[rgba(0,19,33,0.05)]" style={{ padding: "10px 22px", fontSize: 13.5, borderRadius: 6, color: "#001321" }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving} className="font-semibold disabled:opacity-40" style={{ padding: "10px 22px", fontSize: 13.5, borderRadius: 6, background: "#001321", color: "#fff" }}>
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
