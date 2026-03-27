"use client";

interface Perpetuo {
  id: string;
  name: string;
}

interface Props {
  perpetuos: Perpetuo[];
  perpetuoId: string;
  dataInicio: string;
  dataFim: string;
  onPerpetuo: (id: string) => void;
  onDataInicio: (d: string) => void;
  onDataFim: (d: string) => void;
}

const inputCls = "rounded-[6px] border-[1.5px] border-gray-300 bg-white px-[14px] py-[10px] text-[13.5px] text-navy-dark outline-none transition-all focus:border-gold focus:ring-[3px] focus:ring-gold-lightest";

export function DashboardFilters({
  perpetuos, perpetuoId, dataInicio, dataFim,
  onPerpetuo, onDataInicio, onDataFim,
}: Props) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-semibold text-navy-70">Perpétuo</label>
        <select value={perpetuoId} onChange={(e) => onPerpetuo(e.target.value)} className={inputCls}>
          <option value="">Todos</option>
          {perpetuos.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-semibold text-navy-70">Data início</label>
        <input type="date" value={dataInicio} onChange={(e) => onDataInicio(e.target.value)} className={inputCls} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-semibold text-navy-70">Data fim</label>
        <input type="date" value={dataFim} onChange={(e) => onDataFim(e.target.value)} className={inputCls} />
      </div>
    </div>
  );
}
