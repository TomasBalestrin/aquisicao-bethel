"use client";

import { useState } from "react";
import { Download } from "lucide-react";

interface Props {
  planilhaId: string;
}

export function ExportPdfButton({ planilhaId }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    const url = `/api/export-pdf?planilhaId=${planilhaId}`;
    const res = await fetch(url);
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
    setLoading(false);
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 rounded-[6px] border-[1.5px] border-navy-15 px-[22px] py-[10px] text-[13.5px] font-semibold text-navy-dark transition-all hover:border-navy-dark hover:bg-navy-05 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Download size={16} strokeWidth={2} />
      {loading ? "Gerando..." : "Exportar PDF"}
    </button>
  );
}
