"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { formatBrlAxis } from "@/lib/utils/formatCurrency";
import { centsToBrl } from "@/lib/utils/calcMetrics";

interface ChartPoint {
  data: string;
  faturamento: number;
  lucro: number;
}

interface Props {
  data: ChartPoint[];
}

function formatDate(d: string): string {
  const parts = d.split("-");
  return `${parts[2]}/${parts[1]}`;
}

interface TooltipEntry {
  name?: string;
  value?: number;
  color?: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipEntry[]; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
      <p className="mb-1 text-[11px] font-semibold text-navy-70">{formatDate(String(label))}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-[12px]" style={{ color: entry.color }}>
          {entry.name}: R$ {centsToBrl(entry.value ?? 0)}
        </p>
      ))}
    </div>
  );
}

export function EvolutionChart({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-[18px] font-semibold text-navy-dark">Evolução</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
          <XAxis dataKey="data" tickFormatter={formatDate} tick={{ fontSize: 11, fill: "#001321" }} />
          <YAxis tickFormatter={formatBrlAxis} tick={{ fontSize: 11, fill: "#001321" }} width={60} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="faturamento" stroke="#B19365" strokeWidth={2} dot={false} name="Faturamento" />
          <Line type="monotone" dataKey="lucro" stroke="#001321" strokeWidth={2} dot={false} name="Lucro" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
