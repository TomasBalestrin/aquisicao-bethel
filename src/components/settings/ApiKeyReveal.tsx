"use client";

import { toast } from "sonner";
import { AlertTriangle, Copy, X } from "lucide-react";

interface Props {
  keyString: string;
  onDismiss: () => void;
}

export function ApiKeyReveal({ keyString, onDismiss }: Props) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(keyString);
      toast.success("Chave copiada");
    } catch {
      toast.error("Erro ao copiar");
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border-[1.5px] border-gold-lighter bg-gold-lightest p-5">
      <div className="flex items-center gap-2">
        <AlertTriangle size={18} strokeWidth={2} className="text-gold" />
        <span className="text-[14px] font-semibold text-navy-dark">
          Sua nova chave de API:
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          readOnly
          value={keyString}
          className="flex-1 rounded-[6px] border-[1.5px] border-gold-lighter bg-white px-3 py-2 font-mono text-[13px] text-navy-dark outline-none"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-[6px] bg-gold px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-gold-light"
        >
          <Copy size={14} strokeWidth={2} />
          Copiar
        </button>
      </div>

      <p className="text-[12.5px] text-navy-70">
        Salve esta chave agora. Ela não será exibida novamente.
      </p>

      <button
        type="button"
        onClick={onDismiss}
        className="flex w-fit items-center gap-1.5 text-[12.5px] font-semibold text-navy-50 transition-colors hover:text-navy-dark"
      >
        <X size={14} strokeWidth={2} />
        Fechar
      </button>
    </div>
  );
}
