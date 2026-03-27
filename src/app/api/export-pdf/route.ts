import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { PlanilhaPDFDoc } from "@/components/pdf/PlanilhaPDFDoc";
import type { DailyEntryRow } from "@/types/daily-entry";
import React from "react";

const MESES = [
  "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export async function GET(request: NextRequest) {
  const planilhaId = request.nextUrl.searchParams.get("planilhaId");
  if (!planilhaId) {
    return NextResponse.json({ error: "planilhaId obrigatório" }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data: planilha } = await supabase
    .from("planilhas").select("*").eq("id", planilhaId).single();
  if (!planilha) {
    return NextResponse.json({ error: "Planilha não encontrada" }, { status: 404 });
  }

  const { data: perpetuo } = await supabase
    .from("perpetuos").select("*").eq("id", planilha.perpetuo_id).single();

  const { data: entries } = await supabase
    .from("daily_entries").select("*")
    .eq("planilha_id", planilhaId).order("data", { ascending: true });

  const doc = React.createElement(PlanilhaPDFDoc, {
    perpetuoName: perpetuo?.name ?? "Perpétuo",
    mes: planilha.mes,
    ano: planilha.ano,
    entries: (entries ?? []) as DailyEntryRow[],
  });

  const buffer = await renderToBuffer(doc as unknown as React.ReactElement);
  const fileName = `${perpetuo?.name ?? "planilha"}-${MESES[planilha.mes]}-${planilha.ano}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
