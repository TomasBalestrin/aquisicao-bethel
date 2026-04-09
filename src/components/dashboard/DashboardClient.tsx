"use client";

import { useState, useCallback } from "react";
import { DashboardContent } from "./DashboardContent";
import { SettingsModal } from "./SettingsModal";
import { PresentView } from "./PresentView";
import { safeDivide } from "@/lib/utils/calcMetrics";
import type { PerpetuoDashboard } from "@/types/dashboard";

interface Props {
  perpetuos: PerpetuoDashboard[];
  metaFaturamento: number;
  diasNoMes: number;
  mesAtual: number;
  anoAtual: number;
  isHead: boolean;
}

export function DashboardClient({
  perpetuos, metaFaturamento: initialMeta,
  diasNoMes, mesAtual, anoAtual, isHead,
}: Props) {
  const [meta, setMeta] = useState(initialMeta);
  const [showSettings, setShowSettings] = useState(false);
  const [presenting, setPresenting] = useState(false);

  const totals = computeTotals(perpetuos);
  const totalAlunos = perpetuos.reduce((s, p) => s + p.vendas, 0);
  const diasPreenchidos = Math.max(...perpetuos.map((p) => p.diasPreenchidos), 0);
  const exitPresent = useCallback(() => setPresenting(false), []);

  const shared = {
    perpetuos, totals, totalAlunos, diasPreenchidos, meta, diasNoMes,
    mesAtual, anoAtual, isHead, presenting,
    onOpenSettings: () => setShowSettings(true),
    onPresent: () => setPresenting(true),
  };

  return (
    <div style={{ background: "#F5F6F8", padding: "24px 32px", minHeight: "100vh" }}>
      <DashboardContent {...shared} moonSize={260} />

      {isHead && (
        <SettingsModal
          open={showSettings}
          onClose={() => setShowSettings(false)}
          currentMeta={meta}
          onSaved={setMeta}
        />
      )}

      <PresentView active={presenting} onExit={exitPresent}>
        <DashboardContent {...shared} moonSize={300} />
      </PresentView>
    </div>
  );
}

function computeTotals(perpetuos: PerpetuoDashboard[]) {
  let inv = 0;
  let fat = 0;
  for (const p of perpetuos) {
    inv += p.investimento;
    fat += p.faturamento;
  }
  const lucro = fat - inv;
  return { investimento: inv, faturamento: fat, lucro, margem: safeDivide(lucro * 100, fat) };
}
