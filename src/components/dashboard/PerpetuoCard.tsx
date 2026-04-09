import { fm } from "@/lib/utils/formatCurrency";
import {
  COL_POSITIVE, COL_NEGATIVE, valColor,
  avg, tend, avgNum, tendNum,
} from "@/lib/utils/dashboardHelpers";

interface Metrics {
  investimento: number;
  faturamento: number;
  lucro: number;
  margem: number | null;
  vendas: number;
  diasPreenchidos: number;
  diasNoMes: number;
}

interface Props {
  name: string;
  metrics: Metrics;
}

interface RowData {
  label: string;
  geral: string;
  media: string;
  tend: string;
  colorGeral?: string;
  colorMedia?: string;
  colorTend?: string;
}

function buildRows(m: Metrics): RowData[] {
  return [
    {
      label: "Inve.",
      geral: fm(m.investimento),
      media: avg(m.investimento, m.diasPreenchidos),
      tend: tend(m.investimento, m.diasPreenchidos, m.diasNoMes),
    },
    {
      label: "Fatu.",
      geral: fm(m.faturamento),
      media: avg(m.faturamento, m.diasPreenchidos),
      tend: tend(m.faturamento, m.diasPreenchidos, m.diasNoMes),
    },
    {
      label: "Lucro",
      geral: fm(m.lucro),
      media: avg(m.lucro, m.diasPreenchidos),
      tend: tend(m.lucro, m.diasPreenchidos, m.diasNoMes),
      colorGeral: valColor(m.lucro),
      colorMedia: m.diasPreenchidos > 0 ? valColor(m.lucro / m.diasPreenchidos) : undefined,
      colorTend: m.diasPreenchidos > 0 ? valColor((m.lucro / m.diasPreenchidos) * m.diasNoMes) : undefined,
    },
    {
      label: "Alunos",
      geral: String(m.vendas),
      media: avgNum(m.vendas, m.diasPreenchidos),
      tend: tendNum(m.vendas, m.diasPreenchidos, m.diasNoMes),
    },
  ];
}

export function PerpetuoCard({ name, metrics: m }: Props) {
  const margemStr = m.margem !== null ? `${m.margem.toFixed(1)}%` : "—";
  const margemColor = m.margem !== null
    ? m.margem > 0 ? COL_POSITIVE : m.margem < 0 ? COL_NEGATIVE : undefined
    : undefined;
  const rows = buildRows(m);

  return (
    <div
      className="rounded-[14px] border transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,19,33,0.07)] hover:border-gold-lighter"
      style={{ background: "#fff", borderColor: "#ECEDF0" }}
    >
      <div
        className="flex items-center justify-between"
        style={{ padding: "18px 20px 16px", borderBottom: "1px solid #F0F0F0" }}
      >
        <span className="truncate font-bold" style={{ fontSize: 15, color: "#001321", maxWidth: "70%" }}>
          {name}
        </span>
        {m.margem !== null && (
          <MargemBadge value={margemStr} color={margemColor} />
        )}
      </div>
      <CardTable rows={rows} />
    </div>
  );
}

function MargemBadge({ value, color }: { value: string; color?: string }) {
  const bg = color === COL_POSITIVE ? "rgba(27,138,42,0.08)"
    : color === COL_NEGATIVE ? "rgba(198,40,40,0.08)" : "transparent";
  return (
    <span
      className="font-table font-bold shrink-0"
      style={{ fontSize: 12, borderRadius: 100, padding: "3px 10px", color, background: bg }}
    >
      {value}
    </span>
  );
}

function CardTable({ rows }: { rows: RowData[] }) {
  const cols = "60px 1fr 1fr 1fr";
  return (
    <div style={{ padding: "0 20px" }}>
      <div className="grid" style={{ gridTemplateColumns: cols, padding: "12px 0 8px" }}>
        <span />
        {["Geral", "Média", "Tend."].map((h) => (
          <span key={h} className="text-center font-semibold" style={{ fontSize: 12, color: "rgba(0,19,33,0.35)" }}>{h}</span>
        ))}
      </div>
      {rows.map((r, i) => (
        <div key={r.label} className="grid" style={{ gridTemplateColumns: cols, padding: "14px 0", borderBottom: i < rows.length - 1 ? "1px solid #F0F0F0" : "none" }}>
          <span className="font-medium" style={{ fontSize: 12, color: "rgba(0,19,33,0.4)" }}>{r.label}</span>
          <span className="text-center font-table font-bold" style={{ fontSize: 14, color: r.colorGeral ?? "#001321" }}>{r.geral}</span>
          <span className="text-center font-table font-bold" style={{ fontSize: 14, color: r.colorMedia ?? "#001321" }}>{r.media}</span>
          <span className="text-center font-table font-bold" style={{ fontSize: 14, color: r.colorTend ?? "#001321" }}>{r.tend}</span>
        </div>
      ))}
    </div>
  );
}
