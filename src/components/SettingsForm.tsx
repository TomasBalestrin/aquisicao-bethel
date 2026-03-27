"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { updateProfile, uploadOwnAvatar } from "@/actions/settings";

interface Props {
  name: string;
  email: string;
  avatarUrl: string | null;
}

const inputCls = "w-full rounded-[6px] border-[1.5px] border-gray-300 bg-white px-[14px] py-[10px] text-[13.5px] text-navy-dark outline-none transition-all placeholder:text-navy-30 focus:border-gold focus:ring-[3px] focus:ring-gold-lightest";
const labelCls = "text-[12.5px] font-semibold text-navy-70";

function getInitials(name: string): string {
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export function SettingsForm({ name, email, avatarUrl }: Props) {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);

    const file = fileRef.current?.files?.[0];
    if (file) {
      const res = await uploadOwnAvatar(file);
      if (!res.success) toast.error(res.error ?? "Erro no upload da foto");
    }

    const result = await updateProfile({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
    });
    setLoading(false);

    if (result.success) toast.success("Perfil atualizado");
    else toast.error(result.error ?? "Erro ao salvar");
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[480px] flex-col gap-5">
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} width={64} height={64} className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-navy-dark to-navy">
            <span className="text-lg font-bold text-gold">{getInitials(name)}</span>
          </div>
        )}
        <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-[6px] border-[1.5px] border-dashed border-gray-300 px-4 py-2 text-[12px] text-navy-50 transition-colors hover:border-gold hover:text-gold">
          <Upload size={14} strokeWidth={2} />
          Trocar foto
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="s-name" className={labelCls}>Nome</label>
        <input id="s-name" name="name" required defaultValue={name} className={inputCls} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="s-email" className={labelCls}>Email</label>
        <input id="s-email" name="email" type="email" required defaultValue={email} className={inputCls} />
      </div>

      <button type="submit" disabled={loading} className="w-fit rounded-[6px] bg-gold px-[28px] py-[14px] text-[15px] font-semibold text-white transition-all hover:bg-gold-light hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40">
        {loading ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
