import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function MetricCard({ icon: Icon, label, value }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[6px] bg-navy-dark">
        <Icon size={20} strokeWidth={2} className="text-white" />
      </div>
      <p className="font-mono text-[28px] font-extrabold tracking-[-1px] text-navy-dark">
        {value}
      </p>
      <p className="mt-1 text-[12.5px] text-navy-50">{label}</p>
    </div>
  );
}
