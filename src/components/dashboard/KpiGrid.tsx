import { KpiCard } from "./KpiCard";
import { fm, formatPercent } from "@/lib/utils/formatCurrency";
import { avg, tend, valColor } from "@/lib/utils/dashboardHelpers";

interface Totals {
  investimento: number;
  faturamento: number;
  lucro: number;
  margem: number | null;
}

interface Props {
  totals: Totals;
  diasPreenchidos: number;
  diasNoMes: number;
}

export function KpiGrid({ totals: t, diasPreenchidos: d, diasNoMes }: Props) {
  const lucroColor = valColor(t.lucro);
  const lucroAvgColor = d > 0 ? valColor(t.lucro / d) : undefined;
  const lucroTendColor = d > 0 ? valColor((t.lucro / d) * diasNoMes) : undefined;
  const margemColor = t.margem !== null
    ? t.margem > 0 ? "#1B8A2A" : t.margem < 0 ? "#C62828" : undefined
    : undefined;

  return (
    <div className="flex flex-1 flex-col gap-[8px]">
      {/* Column headers */}
      <div className="grid grid-cols-3 gap-[8px]">
        {["Geral", "Média Diária", "Tendência"].map((h) => (
          <span
            key={h}
            className="text-center font-semibold"
            style={{ fontSize: 10.5, color: "rgba(0,19,33,0.35)" }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Investimento */}
      <div className="grid grid-cols-3 gap-[8px]">
        <KpiCard label="Investimento" value={fm(t.investimento)} />
        <KpiCard label="Investimento" value={avg(t.investimento, d)} />
        <KpiCard label="Investimento" value={tend(t.investimento, d, diasNoMes)} />
      </div>

      {/* Faturamento */}
      <div className="grid grid-cols-3 gap-[8px]">
        <KpiCard label="Faturamento" value={fm(t.faturamento)} />
        <KpiCard label="Faturamento" value={avg(t.faturamento, d)} />
        <KpiCard label="Faturamento" value={tend(t.faturamento, d, diasNoMes)} />
      </div>

      {/* Lucro */}
      <div className="grid grid-cols-3 gap-[8px]">
        <KpiCard label="Lucro" value={fm(t.lucro)} color={lucroColor} />
        <KpiCard label="Lucro" value={avg(t.lucro, d)} color={lucroAvgColor} />
        <KpiCard label="Lucro" value={tend(t.lucro, d, diasNoMes)} color={lucroTendColor} />
      </div>

      {/* Margem */}
      <div className="grid grid-cols-3 gap-[8px]">
        <KpiCard label="Margem" value={formatPercent(t.margem)} color={margemColor} />
        <KpiCard label="Margem" value="—" />
        <KpiCard label="Margem" value="—" />
      </div>
    </div>
  );
}
