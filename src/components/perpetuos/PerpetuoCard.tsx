"use client";

import Link from "next/link";
import { Pencil, Trash2, Calendar } from "lucide-react";

interface PerpetuoCardProps {
  id: string;
  name: string;
  createdAt: string;
  isHead: boolean;
  onEdit: (id: string, name: string) => void;
  onDelete: (id: string, name: string) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function PerpetuoCard({
  id, name, createdAt, isHead, onEdit, onDelete,
}: PerpetuoCardProps) {
  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <Link href={`/perpetuos/${id}`} className="block">
        <h3 className="text-[17px] font-bold text-navy-dark">{name}</h3>
        <div className="mt-2 flex items-center gap-1.5 text-[12px] text-navy-30">
          <Calendar size={14} strokeWidth={2} />
          <span>Criado em {formatDate(createdAt)}</span>
        </div>
      </Link>

      {isHead && (
        <div className="mt-4 flex gap-2 border-t border-gray-200 pt-3">
          <button
            onClick={(e) => { e.preventDefault(); onEdit(id, name); }}
            className="flex items-center gap-1.5 rounded-[6px] px-3 py-[7px] text-[12px] font-semibold text-navy-dark transition-colors hover:bg-navy-05"
          >
            <Pencil size={14} strokeWidth={2} />
            Editar
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onDelete(id, name); }}
            className="flex items-center gap-1.5 rounded-[6px] px-3 py-[7px] text-[12px] font-semibold text-error transition-colors hover:bg-[#FFEBEE]"
          >
            <Trash2 size={14} strokeWidth={2} />
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}
