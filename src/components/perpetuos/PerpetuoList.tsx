"use client";

import { useState } from "react";
import { Inbox } from "lucide-react";
import { PerpetuoCard } from "./PerpetuoCard";
import { CreatePerpetuoDialog } from "./CreatePerpetuoDialog";
import { EditPerpetuoDialog } from "./EditPerpetuoDialog";
import { DeletePerpetuoDialog } from "./DeletePerpetuoDialog";

interface Perpetuo {
  id: string;
  name: string;
  created_at: string;
}

interface Props {
  perpetuos: Perpetuo[];
  isHead: boolean;
}

export function PerpetuoList({ perpetuos, isHead }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold tracking-[-0.5px] text-navy-dark">
          Perpétuos
        </h1>
        {isHead && (
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-md bg-gold px-[22px] py-[10px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-light hover:shadow-md"
          >
            Novo Perpétuo
          </button>
        )}
      </div>

      {/* Lista */}
      {perpetuos.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Inbox size={28} strokeWidth={2} className="text-navy-30" />
          </div>
          <p className="text-[14px] font-medium text-navy-50">
            Nenhum perpétuo cadastrado
          </p>
          {isHead && (
            <p className="text-[12px] text-navy-30">
              Clique em &quot;Novo Perpétuo&quot; para começar
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perpetuos.map((p) => (
            <PerpetuoCard
              key={p.id}
              id={p.id}
              name={p.name}
              createdAt={p.created_at}
              isHead={isHead}
              onEdit={(id, name) => setEditTarget({ id, name })}
              onDelete={(id, name) => setDeleteTarget({ id, name })}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreatePerpetuoDialog open={showCreate} onClose={() => setShowCreate(false)} />

      {editTarget && (
        <EditPerpetuoDialog
          open
          onClose={() => setEditTarget(null)}
          perpetuoId={editTarget.id}
          currentName={editTarget.name}
        />
      )}

      {deleteTarget && (
        <DeletePerpetuoDialog
          open
          onClose={() => setDeleteTarget(null)}
          perpetuoId={deleteTarget.id}
          perpetuoName={deleteTarget.name}
        />
      )}
    </>
  );
}
