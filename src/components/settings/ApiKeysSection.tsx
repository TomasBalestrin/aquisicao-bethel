"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Copy } from "lucide-react";
import { generateApiKey, revokeApiKey, listApiKeys } from "@/actions/apiKeys";
import type { ApiKeyPublic } from "@/types/api";
import { ApiKeyCard } from "./ApiKeyCard";
import { ApiKeyReveal } from "./ApiKeyReveal";

const BASE_URL = "https://perpetuohq.vercel.app/api/v1";

export function ApiKeysSection() {
  const [keys, setKeys] = useState<ApiKeyPublic[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [revealKey, setRevealKey] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await listApiKeys();
      if (res.success && res.data) setKeys(res.data);
      else if (!res.success) toast.error(res.error ?? "Erro ao listar chaves");
    })();
  }, []);

  async function handleGenerate() {
    setCreating(true);
    try {
      const res = await generateApiKey(name || undefined);
      if (res.success && res.data) {
        const { key, apiKey } = res.data;
        setRevealKey(key);
        setKeys((prev) => [apiKey, ...prev]);
        setName("");
        setShowForm(false);
      } else {
        toast.error(res.error ?? "Erro ao gerar chave");
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    const res = await revokeApiKey(id);
    if (res.success) {
      setKeys((prev) =>
        prev.map((k) => (k.id === id ? { ...k, is_active: false } : k)),
      );
      toast.success("Chave revogada");
    } else {
      toast.error(res.error ?? "Erro ao revogar");
    }
  }

  async function handleCopyBase() {
    try {
      await navigator.clipboard.writeText(BASE_URL);
      toast.success("URL copiada");
    } catch {
      toast.error("Erro ao copiar");
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-[22px] font-bold text-navy-dark">API</h2>
        <p className="text-[13px] text-navy-50">
          Chaves de acesso para integração com outros sistemas
        </p>
      </div>

      {revealKey && (
        <ApiKeyReveal keyString={revealKey} onDismiss={() => setRevealKey(null)} />
      )}

      {keys.length > 0 && (
        <div className="flex flex-col gap-3">
          {keys.map((k) => (
            <ApiKeyCard key={k.id} apiKey={k} onRevoke={handleRevoke} />
          ))}
        </div>
      )}

      {showForm ? (
        <div className="flex items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da chave"
            maxLength={50}
            className="flex-1 rounded-[6px] border-[1.5px] border-gray-300 bg-white px-3 py-2 text-[13px] text-navy-dark outline-none focus:border-gold focus:ring-[3px] focus:ring-gold-lightest"
          />
          <button
            type="button"
            disabled={creating}
            onClick={handleGenerate}
            className="rounded-[6px] bg-gold px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-gold-light disabled:opacity-40"
          >
            {creating ? "Gerando..." : "Gerar"}
          </button>
          <button
            type="button"
            onClick={() => { setShowForm(false); setName(""); }}
            className="rounded-[6px] px-3 py-2 text-[13px] text-navy-50 transition-colors hover:text-navy-dark"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex w-fit items-center gap-1.5 rounded-[6px] border-[1.5px] border-gold bg-transparent px-4 py-2 text-[13px] font-semibold text-gold transition-colors hover:bg-gold-lightest"
        >
          <Plus size={14} strokeWidth={2} />
          Gerar nova chave
        </button>
      )}

      <div className="mt-2 flex flex-col gap-1.5">
        <label className="text-[12.5px] font-semibold text-navy-70">Base URL</label>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={BASE_URL}
            className="flex-1 rounded-[6px] border-[1.5px] border-gray-300 bg-gray-50 px-3 py-2 font-mono text-[13px] text-navy-70 outline-none"
          />
          <button
            type="button"
            onClick={handleCopyBase}
            className="flex items-center gap-1.5 rounded-[6px] border-[1.5px] border-gray-300 bg-white px-4 py-2 text-[13px] font-semibold text-navy-dark transition-colors hover:border-gold hover:text-gold"
          >
            <Copy size={14} strokeWidth={2} />
            Copiar
          </button>
        </div>
      </div>
    </section>
  );
}
