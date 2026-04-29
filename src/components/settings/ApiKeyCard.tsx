"use client";

import { Trash2 } from "lucide-react";
import type { ApiKeyPublic } from "@/types/api";

interface Props {
  apiKey: ApiKeyPublic;
  onRevoke: (id: string) => void;
}

function formatDate(iso: string | null): string {
  if (!iso) return "Nunca";
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function ApiKeyCard({ apiKey, onRevoke }: Props) {
  function handleRevoke() {
    if (
      !window.confirm(
        `Revogar a chave "${apiKey.name}"? Esta ação não pode ser desfeita.`,
      )
    ) {
      return;
    }
    onRevoke(apiKey.id);
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border-[1.5px] border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[14px] font-semibold text-navy-dark">
            {apiKey.name}
          </span>
          <span className="font-mono text-[12.5px] text-navy-50">
            {apiKey.key_prefix}…
          </span>
          {apiKey.is_active ? (
            <span className="rounded-[6px] bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
              Ativa
            </span>
          ) : (
            <span className="rounded-[6px] bg-error/10 px-2 py-0.5 text-[11px] font-semibold text-error">
              Revogada
            </span>
          )}
        </div>
        <p className="text-[12px] text-navy-50">
          Criada em {formatDate(apiKey.created_at)} · Último uso:{" "}
          {formatDate(apiKey.last_used_at)}
        </p>
      </div>

      {apiKey.is_active && (
        <button
          type="button"
          onClick={handleRevoke}
          aria-label="Revogar chave"
          className="rounded-[6px] p-2 text-error transition-colors hover:bg-error/10"
        >
          <Trash2 size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
