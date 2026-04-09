interface Props {
  label: string;
  value: string;
  color?: string;
}

export function KpiCard({ label, value, color }: Props) {
  return (
    <div
      className="flex flex-col gap-[2px] rounded-[10px] px-[14px] py-[12px]"
      style={{ background: "#F8F9FA" }}
    >
      <span
        className="font-semibold"
        style={{ fontSize: 10.5, color: "rgba(0,19,33,0.4)" }}
      >
        {label}
      </span>
      <span
        className="font-table font-bold"
        style={{
          fontSize: 19,
          letterSpacing: -0.3,
          color: color ?? "#001321",
        }}
      >
        {value}
      </span>
    </div>
  );
}
