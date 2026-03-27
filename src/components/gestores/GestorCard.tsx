"use client";

import Image from "next/image";
import { Pencil, Trash2, KeyRound } from "lucide-react";

interface Props {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  onEdit: (id: string, name: string, email: string) => void;
  onDelete: (id: string, name: string) => void;
  onAccess: (id: string, name: string) => void;
}

function getInitials(name: string): string {
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export function GestorCard({ id, name, email, avatarUrl, onEdit, onDelete, onAccess }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-light">
            <span className="text-sm font-bold text-white">{getInitials(name)}</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-bold text-navy-dark">{name}</h3>
          <p className="truncate text-[12px] text-navy-50">{email}</p>
          <span className="mt-1 inline-block rounded-full bg-navy-05 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[1px] text-navy-70">
            Gestor
          </span>
        </div>
      </div>

      <div className="mt-4 flex gap-2 border-t border-gray-200 pt-3">
        <button onClick={() => onAccess(id, name)} className="flex items-center gap-1.5 rounded-[6px] px-3 py-[7px] text-[12px] font-semibold text-gold transition-colors hover:bg-gold-lightest">
          <KeyRound size={14} strokeWidth={2} />
          Acessos
        </button>
        <button onClick={() => onEdit(id, name, email)} className="flex items-center gap-1.5 rounded-[6px] px-3 py-[7px] text-[12px] font-semibold text-navy-dark transition-colors hover:bg-navy-05">
          <Pencil size={14} strokeWidth={2} />
          Editar
        </button>
        <button onClick={() => onDelete(id, name)} className="flex items-center gap-1.5 rounded-[6px] px-3 py-[7px] text-[12px] font-semibold text-error transition-colors hover:bg-[#FFEBEE]">
          <Trash2 size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
