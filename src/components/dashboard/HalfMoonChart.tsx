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
  const cx = size / 2;
  const cy = size * 0.52;
  const r = size * 0.38;
  const stroke = size * 0.075;
  const halfCirc = Math.PI * r;
  const dashOffset = halfCirc * (1 - pct);

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
      <svg width={size} height={size * 0.58} viewBox={`0 0 ${size} ${size * 0.58}`}>
        <defs>
          <linearGradient id="moon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#001321" />
            <stop offset="100%" stopColor="#B19365" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path
          d={describeArc(cx, cy, r, 180, 360)}
          fill="none"
          stroke="#ECEDF0"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={describeArc(cx, cy, r, 180, 360)}
          fill="none"
          stroke="url(#moon-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={halfCirc}
          strokeDashoffset={dashOffset}
        />
        {/* Center text */}
        <text
          x={cx}
          y={cy - size * 0.04}
          textAnchor="middle"
          fontFamily="var(--font-poppins), Poppins, sans-serif"
          fontWeight={700}
          fontSize={size * 0.14}
          fill="#001321"
        >
          {pctLabel}%
        </text>
        <text
          x={cx}
          y={cy + size * 0.04}
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

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angle: number
): { x: number; y: number } {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
