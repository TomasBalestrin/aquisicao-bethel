"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { GestorCard } from "./GestorCard";
import { CreateGestorDialog } from "./CreateGestorDialog";
import { EditGestorDialog } from "./EditGestorDialog";
import { DeleteGestorDialog } from "./DeleteGestorDialog";
import { AccessDialog } from "./AccessDialog";

interface Gestor {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
}

interface Perpetuo {
  id: string;
  name: string;
}

interface Props {
  gestores: Gestor[];
  perpetuos: Perpetuo[];
}

type EditTarget = { id: string; name: string; email: string } | null;
type Target = { id: string; name: string } | null;

export function GestorList({ gestores, perpetuos }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [deleteTarget, setDeleteTarget] = useState<Target>(null);
  const [accessTarget, setAccessTarget] = useState<Target>(null);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold tracking-[-0.5px] text-navy-dark">Gestores</h1>
        <button onClick={() => setShowCreate(true)} className="rounded-md bg-gold px-[22px] py-[10px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-light hover:shadow-md">
          Novo Gestor
        </button>
      </div>

      {gestores.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Users size={28} strokeWidth={2} className="text-navy-30" />
          </div>
          <p className="text-[14px] font-medium text-navy-50">Nenhum gestor cadastrado</p>
          <p className="text-[12px] text-navy-30">Clique em &quot;Novo Gestor&quot; para começar</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gestores.map((g) => (
            <GestorCard
              key={g.id} id={g.id} name={g.name} email={g.email} avatarUrl={g.avatar_url}
              onEdit={(id, name, email) => setEditTarget({ id, name, email })}
              onDelete={(id, name) => setDeleteTarget({ id, name })}
              onAccess={(id, name) => setAccessTarget({ id, name })}
            />
          ))}
        </div>
      )}

      <CreateGestorDialog open={showCreate} onClose={() => setShowCreate(false)} />

      {editTarget && (
        <EditGestorDialog open onClose={() => setEditTarget(null)} gestorId={editTarget.id} currentName={editTarget.name} currentEmail={editTarget.email} />
      )}
      {deleteTarget && (
        <DeleteGestorDialog open onClose={() => setDeleteTarget(null)} gestorId={deleteTarget.id} gestorName={deleteTarget.name} />
      )}
      {accessTarget && (
        <AccessDialog open onClose={() => setAccessTarget(null)} gestorId={accessTarget.id} gestorName={accessTarget.name} perpetuos={perpetuos} />
      )}
    </>
  );
}
