"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { updateMetaFaturamento } from "@/actions/settings-dashboard";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  currentMeta: number;
  onSaved: (newMeta: number) => void;
}

export function SettingsModal({ open, onClose, currentMeta, onSaved }: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setValue(currentMeta > 0 ? String(currentMeta / 100) : "");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, currentMeta]);

  if (!open) return null;

  async function handleSave() {
    const num = parseFloat(value.replace(",", "."));
    if (isNaN(num) || num < 0) {
      toast.error("Informe um valor válido");
      return;
    }
    const cents = Math.round(num * 100);
    setSaving(true);
    const res = await updateMetaFaturamento(cents);
    setSaving(false);
    if (res.success) {
      toast.success("Meta salva");
      onSaved(cents);
      onClose();
    } else {
      toast.error(res.error ?? "Erro ao salvar");
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
          background: "#fff",
          borderRadius: 16,
          padding: "28px 32px",
          width: 400,
          boxShadow: "0 16px 50px rgba(0,19,33,0.16)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-navy-50 hover:text-navy-dark"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <h3 className="font-bold" style={{ fontSize: 17, color: "#001321" }}>
          Configurações
        </h3>

        <div className="flex flex-col gap-1.5">
          <label
            className="font-semibold"
            style={{ fontSize: 12.5, color: "rgba(0,19,33,0.7)" }}
          >
            Meta de faturamento (R$)
          </label>
          <input
            ref={inputRef}
            type="number"
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ex: 500000"
            className="font-table outline-none"
            style={{
              padding: "10px 14px",
              fontSize: 13.5,
              border: "1.5px solid #DEE2E6",
              borderRadius: 8,
              color: "#001321",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#B19365";
              e.currentTarget.style.boxShadow = "0 0 0 3px #F5EDE1";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#DEE2E6";
              e.currentTarget.style.boxShadow = "none";
            }}
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="font-semibold hover:bg-[rgba(0,19,33,0.05)]"
            style={{
              padding: "10px 22px",
              fontSize: 13.5,
              borderRadius: 6,
              color: "#001321",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="font-semibold disabled:opacity-40"
            style={{
              padding: "10px 22px",
              fontSize: 13.5,
              borderRadius: 6,
              background: "#001321",
              color: "#fff",
            }}
          >
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
