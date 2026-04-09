import { fm, formatPercent } from "@/lib/utils/formatCurrency";
import {
  COL_POSITIVE, COL_NEGATIVE, valColor, avg, tend,
} from "@/lib/utils/dashboardHelpers";

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

interface RowData {
  label: string;
  geral: string;
  media: string;
  tend: string;
  color?: string;
}

function buildRows(t: Totals, dias: number, diasMes: number): RowData[] {
  return [
    {
      label: "Inve.",
      geral: fm(t.investimento),
      media: avg(t.investimento, dias),
      tend: tend(t.investimento, dias, diasMes),
    },
    {
      label: "Fatu.",
      geral: fm(t.faturamento),
      media: avg(t.faturamento, dias),
      tend: tend(t.faturamento, dias, diasMes),
    },
    {
      label: "Lucro",
      geral: fm(t.lucro),
      media: avg(t.lucro, dias),
      tend: tend(t.lucro, dias, diasMes),
      color: valColor(t.lucro),
    },
    {
      label: "Margem",
      geral: formatPercent(t.margem),
      media: "—",
      tend: "—",
      color: t.margem !== null
        ? t.margem > 0 ? COL_POSITIVE : t.margem < 0 ? COL_NEGATIVE : undefined
        : undefined,
    },
  ];
}

export function KpiTable({ totals, diasPreenchidos, diasNoMes }: Props) {
  const rows = buildRows(totals, diasPreenchidos, diasNoMes);
  const cols = "60px 1fr 1fr 1fr";

  return (
    <div className="flex flex-1 flex-col justify-center">
      {/* Header */}
      <div className="grid" style={{ gridTemplateColumns: cols, padding: "0 0 8px" }}>
        <span />
        {["Geral", "Média", "Tend."].map((h) => (
          <span
            key={h}
            className="text-center font-semibold"
            style={{ fontSize: 12, color: "rgba(0,19,33,0.35)" }}
          >
            {h}
          </span>
        ))}
      </div>
      {/* Rows */}
      {rows.map((r, i) => (
        <div
          key={r.label}
          className="grid"
          style={{
            gridTemplateColumns: cols,
            padding: "12px 0",
            borderBottom: i < rows.length - 1 ? "1px solid #F0F0F0" : "none",
          }}
        >
          <span
            className="font-medium"
            style={{ fontSize: 12, color: "rgba(0,19,33,0.4)" }}
          >
            {r.label}
          </span>
          <span
            className="text-center font-table font-bold"
            style={{ fontSize: 15, color: r.color ?? "#001321" }}
          >
            {r.geral}
          </span>
          <span
            className="text-center font-table font-bold"
            style={{ fontSize: 15, color: r.color ?? "#001321" }}
          >
            {r.media}
          </span>
          <span
            className="text-center font-table font-bold"
            style={{ fontSize: 15, color: r.color ?? "#001321" }}
          >
            {r.tend}
          </span>
        </div>
      ))}
    </div>
  );
}
