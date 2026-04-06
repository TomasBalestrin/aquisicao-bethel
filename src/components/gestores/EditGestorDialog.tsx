"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { updateGestor, uploadAvatar } from "@/actions/gestoresAdmin";

interface Props {
  open: boolean;
  onClose: () => void;
  gestorId: string;
  currentName: string;
  currentEmail: string;
}

const inputCls = "w-full rounded-[6px] border-[1.5px] border-gray-300 bg-white px-[14px] py-[10px] text-[13.5px] text-navy-dark outline-none transition-all placeholder:text-navy-30 focus:border-gold focus:ring-[3px] focus:ring-gold-lightest";
const labelCls = "text-[12.5px] font-semibold text-navy-70";

export function EditGestorDialog({ open, onClose, gestorId, currentName, currentEmail }: Props) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange() {
    const file = fileRef.current?.files?.[0];
    setFileName(file?.name ?? "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);

    try {
      const file = fileRef.current?.files?.[0];
      if (file) {
        setUploading(true);
        const avatarFd = new FormData();
        avatarFd.append("userId", gestorId);
        avatarFd.append("file", file);
        const res = await uploadAvatar(avatarFd);
        setUploading(false);
        if (!res.success) {
          toast.error(res.error ?? "Erro no upload da foto");
          return;
        }
        toast.success("Foto atualizada");
      }

      const result = await updateGestor(gestorId, {
        name: fd.get("name") as string,
        email: fd.get("email") as string,
      });

      if (result.success) {
        toast.success("Gestor atualizado");
        onClose();
      } else {
        toast.error(result.error ?? "Erro ao atualizar");
      }
    } catch (err) {
      console.error("Erro ao salvar gestor:", err);
      toast.error("Erro inesperado ao salvar");
    } finally {
      setUploading(false);
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Editar Gestor">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="eg-name" className={labelCls}>Nome</label>
          <input id="eg-name" name="name" required defaultValue={currentName} className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="eg-email" className={labelCls}>Email</label>
          <input id="eg-email" name="email" type="email" required defaultValue={currentEmail} className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Foto de perfil</label>
          <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-[6px] border-[1.5px] border-dashed border-gray-300 px-4 py-3 text-[12px] text-navy-50 transition-colors hover:border-gold hover:text-gold">
            {uploading ? <Loader2 size={16} strokeWidth={2} className="animate-spin" /> : <Upload size={16} strokeWidth={2} />}
            {fileName || "Selecionar imagem"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-[6px] px-[22px] py-[10px] text-[13.5px] font-semibold text-navy-dark transition-colors hover:bg-navy-05">Cancelar</button>
          <button type="submit" disabled={loading} className="rounded-[6px] bg-gold px-[22px] py-[10px] text-[13.5px] font-semibold text-white transition-all hover:bg-gold-light hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40">
            {loading ? (uploading ? "Enviando foto..." : "Salvando...") : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
