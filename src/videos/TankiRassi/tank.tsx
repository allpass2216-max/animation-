// TankiRassi pieces: night field, the 120 ft water tank (full-height diagram + close-up roof), ropes, hooks, ledge, measure bars.
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "../../lib/fonts";
import { H, INK, W } from "../../lib/reel";

// Diagram geometry (screen px): roof at ROOF, ground at GROUND, 120 ft between.
export const ROOF = 760;
export const GROUND = 1800;
export const PX_FT = (GROUND - ROOF) / 120;
export const ftY = (ft: number) => ROOF + ft * PX_FT; // ft below the roof -> screen y
export const LEDGE = ftY(60);
export const HOOK1: [number, number] = [600, ROOF];
export const HOOK2: [number, number] = [600, LEDGE];

export const NightField: React.FC<{ horizon?: number }> = ({ horizon = 1500 }) => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <rect x={-300} y={0} width={W + 600} height={H} fill="#0d1236" />
      <rect x={-300} y={horizon - 500} width={W + 600} height={500} fill="#1c2452" opacity={0.6} />
      {Array.from({ length: 50 }).map((_, i) => (
        <circle key={i} cx={random(`s${i}`) * W} cy={random(`t${i}`) * (horizon - 200)} r={1.5 + random(`r${i}`) * 3} fill="#fff" opacity={0.3 + 0.6 * Math.abs(Math.sin(frame / 18 + i))} />
      ))}
      <g transform="translate(860 260)">
        <circle r={130} fill="#fff4c2" opacity={0.15} />
        <circle r={80} fill="#fff4c2" stroke={INK} strokeWidth={7} />
        <circle cx={-24} cy={-14} r={14} fill="#efe1a0" />
        <circle cx={22} cy={24} r={10} fill="#efe1a0" />
      </g>
      {/* distant town lights */}
      {Array.from({ length: 26 }).map((_, i) => (
        <rect key={i} x={-100 + i * 50} y={horizon - 20 - (i % 4) * 14 - random(`h${i}`) * 40} width={30} height={20 + (i % 4) * 14 + random(`h${i}`) * 40} fill="#2b2f5c" />
      ))}
      {Array.from({ length: 30 }).map((_, i) => (
        <circle key={i} cx={-80 + random(`lx${i}`) * 1240} cy={horizon - 10 - random(`ly${i}`) * 60} r={3} fill="#ffd27a" opacity={0.5 + 0.5 * Math.abs(Math.sin(frame / 25 + i))} />
      ))}
      <rect x={-300} y={horizon} width={W + 600} height={H - horizon} fill="#1f3a26" />
    </svg>
  );
};

/** Full-height side view of the tank (concrete shaft + bowl), with the ledge (chhajja) and two hooks. */
export const TankDiagram: React.FC<{ glow1?: boolean; glow2?: boolean; bar?: boolean }> = ({ glow1, glow2, bar = true }) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + Math.abs(Math.sin(frame / 5)) * 0.5;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <rect x={-300} y={GROUND} width={W + 600} height={300} fill="#1f3a26" />
      {/* shaft */}
      <rect x={330} y={ROOF + 220} width={160} height={GROUND - ROOF - 220} fill="#8d8f9c" stroke={INK} strokeWidth={8} />
      <rect x={420} y={ROOF + 220} width={70} height={GROUND - ROOF - 220} fill="#000" opacity={0.15} />
      {Array.from({ length: 6 }).map((_, i) => (
        <path key={i} d={`M330 ${ROOF + 360 + i * 140} L490 ${ROOF + 360 + i * 140}`} stroke={INK} strokeWidth={4} opacity={0.35} />
      ))}
      {/* tank bowl */}
      <path d={`M200 ${ROOF} L600 ${ROOF} L560 ${ROOF + 230} L260 ${ROOF + 230} Z`} fill="#a9abb8" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <path d={`M440 ${ROOF} L600 ${ROOF} L560 ${ROOF + 230} L460 ${ROOF + 230} Z`} fill="#000" opacity={0.14} />
      {/* roof railing */}
      <path d={`M200 ${ROOF} L200 ${ROOF - 50} L600 ${ROOF - 50} L600 ${ROOF}`} fill="none" stroke={INK} strokeWidth={7} />
      {[260, 330, 400, 470, 540].map((x) => (
        <path key={x} d={`M${x} ${ROOF} L${x} ${ROOF - 50}`} stroke={INK} strokeWidth={4} />
      ))}
      {/* ledge (chhajja) */}
      <rect x={490} y={LEDGE} width={130} height={24} fill="#a9abb8" stroke={INK} strokeWidth={7} />
      {/* hooks */}
      {[
        [HOOK1, glow1],
        [HOOK2, glow2],
      ].map(([h, g], i) => {
        const [x, y] = h as [number, number];
        return (
          <g key={i}>
            {g && <circle cx={x + 10} cy={y + 2} r={34 * pulse + 10} fill="#ffd43b" opacity={0.35} />}
            <path d={`M${x} ${y} q16 0 16 14 q0 14 -12 14`} fill="none" stroke="#dee2e6" strokeWidth={7} />
          </g>
        );
      })}
      {bar && (
        <g>
          <path d={`M150 ${ROOF} L150 ${GROUND}`} stroke="#ffd43b" strokeWidth={6} />
          <path d={`M130 ${ROOF} L170 ${ROOF} M130 ${GROUND} L170 ${GROUND}`} stroke="#ffd43b" strokeWidth={6} />
          <rect x={90} y={(ROOF + GROUND) / 2 - 30} width={120} height={56} rx={12} fill="#ffd43b" stroke={INK} strokeWidth={5} />
          <text x={150} y={(ROOF + GROUND) / 2 + 10} fontSize={30} textAnchor="middle" fill={INK} fontFamily={FONT_FAMILY} fontWeight={800}>
            120 FT
          </text>
        </g>
      )}
    </svg>
  );
};

/** A hanging rope from (x, y1) to y2, gently swaying. */
export const Rope: React.FC<{ x: number; y1: number; y2: number; sway?: number; color?: string }> = ({ x, y1, y2, sway = 1, color = "#d9a066" }) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / 14) * 10 * sway;
  const d = `M${x} ${y1} Q${x + dx} ${(y1 + y2) / 2} ${x + dx * 0.6} ${y2}`;
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={12} strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeDasharray="10 6" />
    </g>
  );
};

/** Measure bar with a label (red = danger gap, yellow = info). */
export const Measure: React.FC<{ x: number; y1: number; y2: number; label: string; red?: boolean }> = ({ x, y1, y2, label, red }) => {
  const c = red ? "#ff6b6b" : "#ffd43b";
  return (
    <g>
      <path d={`M${x} ${y1} L${x} ${y2} M${x - 16} ${y1} L${x + 16} ${y1} M${x - 16} ${y2} L${x + 16} ${y2}`} stroke={c} strokeWidth={6} />
      <rect x={x + 22} y={(y1 + y2) / 2 - 28} width={label.length * 20 + 30} height={56} rx={12} fill={c} stroke={INK} strokeWidth={5} />
      <text x={x + 37} y={(y1 + y2) / 2 + 10} fontSize={30} fill={red ? "#fff" : INK} fontFamily={FONT_FAMILY} fontWeight={800}>
        {label}
      </text>
    </g>
  );
};

/** Close-up of the tank roof: railing, slab edge, broken ladder top (falls with gravity at `breakAt`). */
export const RoofCloseup: React.FC<{ breakAt?: number }> = ({ breakAt = 1e9 }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - breakAt) / 30;
  const fallY = 0.5 * 3000 * t * t;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      {/* ladder top (right side) */}
      {fallY < 1400 && (
        <g transform={`translate(920 ${1500 + fallY}) rotate(${Math.min(40, t * 120)})`}>
          <path d="M-50 0 L-50 -260 M50 0 L50 -260" stroke="#868e96" strokeWidth={14} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M-50 ${-40 - i * 60} L50 ${-40 - i * 60}`} stroke="#868e96" strokeWidth={10} />
          ))}
        </g>
      )}
      {/* roof slab */}
      <rect x={-100} y={1720} width={W + 200} height={60} fill="#a9abb8" stroke={INK} strokeWidth={9} />
      <rect x={-100} y={1780} width={W + 200} height={300} fill="#8d8f9c" />
      <path d="M-100 1720 L-100 1560 L1180 1560 L1180 1720" fill="none" stroke={INK} strokeWidth={10} />
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={i} d={`M${-40 + i * 150} 1720 L${-40 + i * 150} 1560`} stroke={INK} strokeWidth={6} />
      ))}
      <path d="M-100 1600 L1180 1600" stroke={INK} strokeWidth={5} opacity={0.5} />
    </svg>
  );
};

/** Coil of rope (inventory). */
export const RopeCoil: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => (
      <ellipse key={i} cx={0} cy={-i * 18} rx={90 - i * 8} ry={34} fill="none" stroke={INK} strokeWidth={22} />
    ))}
    {[0, 1, 2].map((i) => (
      <ellipse key={i} cx={0} cy={-i * 18} rx={90 - i * 8} ry={34} fill="none" stroke="#d9a066" strokeWidth={13} strokeDasharray="10 6" />
    ))}
  </g>
);

export const Knife: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = -30 }) => {
  const frame = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 -14 L140 -14 Q170 0 140 14 L0 14 Z" fill="#dee2e6" stroke={INK} strokeWidth={6} />
      <path d={`M${40 + ((frame * 6) % 100)} -10 L${60 + ((frame * 6) % 100)} 10`} stroke="#fff" strokeWidth={6} opacity={0.8} />
      <rect x={-90} y={-18} width={90} height={36} rx={10} fill="#8a5530" stroke={INK} strokeWidth={6} />
    </g>
  );
};
