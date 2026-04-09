"use client";

import { fm } from "@/lib/utils/formatCurrency";

interface Props {
  current: number;
  target: number;
  size?: number;
}

export function HalfMoonChart({ current, target, size = 260 }: Props) {
  const pct = target > 0 ? Math.min(current / target, 1) : 0;
  const pctLabel = Math.round(pct * 100);

  const strokeW = Math.round(size * 0.07);
  const r = (size - strokeW) / 2 - 4;
  const cx = size / 2;
  const cy = r + strokeW / 2 + 4;
  const svgH = cy + strokeW / 2 + 6;
  const halfCirc = Math.PI * r;
  const dashOffset = halfCirc * (1 - pct);

  const leftX = cx - r;
  const rightX = cx + r;
  const arcPath = `M ${leftX} ${cy} A ${r} ${r} 0 0 1 ${rightX} ${cy}`;

  return (
    <div
      style={{ width: size, minWidth: size }}
      className="flex flex-col items-center"
    >
      <span
        className="text-center uppercase tracking-[1.2px] font-semibold"
        style={{ fontSize: 9.5, color: "#B19365", marginBottom: 4 }}
      >
        META DO MÊS
      </span>
      <svg
        width={size}
        height={svgH}
        viewBox={`0 0 ${size} ${svgH}`}
      >
        <defs>
          <linearGradient id="moon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#001321" />
            <stop offset="100%" stopColor="#B19365" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path
          d={arcPath}
          fill="none"
          stroke="#ECEDF0"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={arcPath}
          fill="none"
          stroke="url(#moon-grad)"
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={halfCirc}
          strokeDashoffset={dashOffset}
        />
        {/* Percentage */}
        <text
          x={cx}
          y={cy - r * 0.3}
          textAnchor="middle"
          fontFamily="var(--font-poppins), Poppins, sans-serif"
          fontWeight={700}
          fontSize={size * 0.14}
          fill="#001321"
        >
          {pctLabel}%
        </text>
        {/* Subtitle */}
        <text
          x={cx}
          y={cy - r * 0.08}
          textAnchor="middle"
          fontFamily="var(--font-poppins), Poppins, sans-serif"
          fontWeight={500}
          fontSize={size * 0.042}
          fill="rgba(0,19,33,0.35)"
        >
          {fm(current)} de {fm(target)}
        </text>
      </svg>
    </div>
  );
}
