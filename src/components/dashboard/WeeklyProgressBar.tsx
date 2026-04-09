import { fm } from "@/lib/utils/formatCurrency";

interface Props {
  current: number;
  target: number;
}

export function WeeklyProgressBar({ current, target }: Props) {
  const pct = target > 0 ? Math.min(current / target, 1) : 0;
  const pctLabel = Math.round(pct * 100);
  const isPositive = current >= 0;
  const fillColor = isPositive ? "#1B8A2A" : "#C62828";

  return (
    <div
      className="flex flex-col gap-[10px]"
      style={{
        background: "#fff",
        border: "1px solid #ECEDF0",
        borderRadius: 14,
        padding: "18px 24px",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className="uppercase tracking-[1.2px] font-semibold"
          style={{ fontSize: 9.5, color: "#B19365" }}
        >
          META LUCRO DA SEMANA
        </span>
        <span
          className="font-table font-bold"
          style={{ fontSize: 13, color: "rgba(0,19,33,0.5)" }}
        >
          {pctLabel}%
        </span>
      </div>

      {/* Bar */}
      <div
        style={{
          height: 14,
          borderRadius: 100,
          background: "#ECEDF0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct * 100}%`,
            borderRadius: 100,
            background: `linear-gradient(90deg, #001321, ${fillColor})`,
            transition: "width 0.6s ease",
          }}
        />
      </div>

      {/* Values */}
      <div className="flex items-center justify-between">
        <span
          className="font-table font-bold"
          style={{ fontSize: 15, color: fillColor }}
        >
          {fm(current)}
        </span>
        <span
          className="font-table font-medium"
          style={{ fontSize: 13, color: "rgba(0,19,33,0.35)" }}
        >
          Meta: {fm(target)}
        </span>
      </div>
    </div>
  );
}
