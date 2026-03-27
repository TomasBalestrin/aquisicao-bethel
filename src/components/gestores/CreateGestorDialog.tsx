"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { createGestor } from "@/actions/gestores";

interface Props {
  open: boolean;
  onClose: () => void;
}

const inputCls = "w-full rounded-[6px] border-[1.5px] border-gray-300 bg-white px-[14px] py-[10px] text-[13.5px] text-navy-dark outline-none transition-all placeholder:text-navy-30 focus:border-gold focus:ring-[3px] focus:ring-gold-lightest";
const labelCls = "text-[12.5px] font-semibold text-navy-70";

export function CreateGestorDialog({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);

    const result = await createGestor({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      password: fd.get("password") as string,
    });

    if (!result.success) {
      setLoading(false);
      toast.error(result.error ?? "Erro ao criar gestor");
      return;
    }

    toast.success("Gestor criado com sucesso");
    setLoading(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo Gestor">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="g-name" className={labelCls}>Nome</label>
          <input id="g-name" name="name" required placeholder="Nome completo" className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="g-email" className={labelCls}>Email</label>
          <input id="g-email" name="email" type="email" required placeholder="email@exemplo.com" className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="g-pass" className={labelCls}>Senha</label>
          <input id="g-pass" name="password" type="password" required minLength={6} placeholder="Mínimo 6 caracteres" className={inputCls} />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-[6px] px-[22px] py-[10px] text-[13.5px] font-semibold text-navy-dark transition-colors hover:bg-navy-05">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="rounded-[6px] bg-gold px-[22px] py-[10px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-light hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40">
            {loading ? "Criando..." : "Criar Gestor"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
