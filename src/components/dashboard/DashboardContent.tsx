"use client";

import { Settings, Users, Presentation } from "lucide-react";
import { HalfMoonChart } from "./HalfMoonChart";
import { KpiGrid } from "./KpiGrid";
import { PerpetuoCard } from "./PerpetuoCard";
import type { PerpetuoDashboard } from "@/types/dashboard";

const MONTHS = [
  "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

interface Props {
  perpetuos: PerpetuoDashboard[];
  totals: { investimento: number; faturamento: number; lucro: number; margem: number | null };
  totalAlunos: number;
  diasPreenchidos: number;
  meta: number;
  moonSize: number;
  diasNoMes: number;
  mesAtual: number;
  anoAtual: number;
  isHead: boolean;
  presenting: boolean;
  onOpenSettings: () => void;
  onPresent: () => void;
}

export function DashboardContent({
  perpetuos, totals, totalAlunos, diasPreenchidos, meta, moonSize,
  diasNoMes, mesAtual, anoAtual, isHead, presenting,
  onOpenSettings, onPresent,
}: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-extrabold" style={{ fontSize: 24, color: "#001321" }}>Dashboard</h1>
          <span className="font-medium" style={{ fontSize: 12.5, color: "rgba(0,19,33,0.38)" }}>
            {MONTHS[mesAtual]} {anoAtual}
          </span>
        </div>
        <div className="flex gap-2">
          {isHead && (
            <button onClick={onOpenSettings} className="flex items-center gap-[6px] font-semibold transition-colors hover:bg-[rgba(0,19,33,0.05)]" style={{ padding: "10px 22px", fontSize: 13.5, borderRadius: 6, border: "1.5px solid rgba(0,19,33,0.15)", color: "#001321" }}>
              <Settings size={16} strokeWidth={2} /> Config
            </button>
          )}
          {!presenting && (
            <button onClick={onPresent} className="flex items-center gap-[6px] font-semibold transition-colors" style={{ padding: "10px 22px", fontSize: 13.5, borderRadius: 6, background: "#B19365", color: "#fff" }}>
              <Presentation size={16} strokeWidth={2} /> Apresentar
            </button>
          )}
        </div>
      </div>

      {/* Top row */}
      <div className="flex gap-[14px]">
        <div className="flex flex-1 items-center gap-6" style={{ background: "#fff", border: "1px solid #ECEDF0", borderRadius: 14, padding: "18px 24px" }}>
          <HalfMoonChart current={totals.faturamento} target={meta} size={moonSize} />
          <KpiGrid totals={totals} diasPreenchidos={diasPreenchidos} diasNoMes={diasNoMes} />
        </div>
        <div className="flex flex-col items-center justify-center" style={{ minWidth: 160, background: "#fff", border: "1px solid #ECEDF0", borderRadius: 14, padding: "24px 20px" }}>
          <span className="uppercase tracking-[1.2px] font-semibold" style={{ fontSize: 9.5, color: "#B19365", marginBottom: 10 }}>ALUNOS NO MÊS</span>
          <Users size={28} strokeWidth={2} color="#B19365" />
          <span className="font-table font-bold" style={{ fontSize: 38, color: "#001321", marginTop: 6 }}>{totalAlunos}</span>
        </div>
      </div>

      {/* Perpétuos grid */}
      <div>
        <span className="block uppercase tracking-[1.2px] font-semibold" style={{ fontSize: 9.5, color: "#B19365", marginBottom: 10 }}>PERPÉTUOS</span>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
          {perpetuos.map((p) => (
            <PerpetuoCard key={p.id} name={p.name} metrics={{ ...p, diasNoMes }} />
          ))}
        </div>
      </div>
    </div>
  );
}
