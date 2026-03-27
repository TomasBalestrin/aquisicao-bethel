"use client";

import { useState } from "react";
import { Eye, Copy, Download } from "lucide-react";
import { DuplicatePlanilhaDialog } from "./DuplicatePlanilhaDialog";

interface Props {
  planilhaId: string;
  perpetuoId: string;
  mes: number;
  ano: number;
}

export function PlanilhaToolbar({ planilhaId, perpetuoId, mes, ano }: Props) {
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [exporting, setExporting] = useState(false);

  function handleShowAll() {
    const fn = (window as unknown as Record<string, unknown>).__showAllColumns;
    if (typeof fn === "function") (fn as () => void)();
  }

  async function handleExport() {
    setExporting(true);
    const res = await fetch(`/api/export-pdf?planilhaId=${planilhaId}`);
    if (res.ok) {
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="(.+)"/);
      link.download = match?.[1] ?? "planilha.pdf";
      link.click();
      URL.revokeObjectURL(link.href);
    }
    setExporting(false);
  }

  const btnCls = "flex items-center gap-2 rounded-[6px] border-[1.5px] border-navy-15 px-[16px] py-[8px] text-[12px] font-semibold text-navy-dark transition-all hover:border-navy-dark hover:bg-navy-05 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button onClick={handleShowAll} className={btnCls} title="Mostrar todas as colunas">
          <Eye size={14} strokeWidth={2} />
          <span className="hidden sm:inline">Mostrar Colunas</span>
        </button>
        <button onClick={() => setShowDuplicate(true)} className={btnCls}>
          <Copy size={14} strokeWidth={2} />
          <span className="hidden sm:inline">Duplicar</span>
        </button>
        <button onClick={handleExport} disabled={exporting} className={btnCls}>
          <Download size={14} strokeWidth={2} />
          {exporting ? "Gerando..." : <span className="hidden sm:inline">Exportar PDF</span>}
        </button>
      </div>

      <DuplicatePlanilhaDialog
        open={showDuplicate}
        onClose={() => setShowDuplicate(false)}
        planilhaId={planilhaId}
        perpetuoId={perpetuoId}
        currentMes={mes}
        currentAno={ano}
      />
    </>
  );
}
