// Hotel lobby for OyoSecret, dark pink + purple: glowing neon "ROOMS 24x7" (generic, no brand logo), neon heart, pink LED
// strips, chandelier, velvet sofa, glossy reflective floor; a purple reception counter with a pink LED edge sits in FRONT of
// the receptionist (foreground), with a desk bell that dings.
import React from "react";
import { useCurrentFrame } from "remotion";
import { H, INK, W } from "../../lib/reel";
import { SignText } from "../../lib/world";

const PINK = "#ff4fa3";
const PINK_SOFT = "#ffd1e8";

const Glow: React.FC<{ cx: number; cy: number; rx: number; ry: number; color: string; o: number }> = ({ cx, cy, rx, ry, color, o }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} opacity={o} style={{ filter: "blur(40px)" }} />
);

export const HotelLobby: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = frame % 53 >= 30 && frame % 53 < 33 ? 0.4 : 1; // neon flickers now and then (never on frame 0)
  const pulse = 0.85 + Math.sin(frame / 10) * 0.15;
  return (
    <>
      {/* deep purple walls */}
      <rect x={-200} y={0} width={W + 400} height={H} fill="#12081f" />
      <rect x={-200} y={0} width={W + 400} height={1450} fill="#1c0d30" />
      {/* velvet wall panels */}
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={-170 + i * 220} y={420} width={180} height={980} rx={20} fill="#26113f" stroke="#3b1b5e" strokeWidth={6} />
      ))}
      {/* pink LED strip along the ceiling + its glow */}
      <rect x={-200} y={380} width={W + 400} height={12} fill={PINK} opacity={pulse} />
      <Glow cx={540} cy={390} rx={900} ry={90} color={PINK} o={0.35 * pulse} />
      {/* chandelier */}
      <g transform={`translate(540 ${130 + Math.sin(frame / 30) * 3})`}>
        <path d="M0 -140 L0 0" stroke="#c9a227" strokeWidth={6} />
        <path d="M-150 30 Q0 90 150 30" fill="none" stroke="#c9a227" strokeWidth={10} />
        {[-150, -75, 0, 75, 150].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 30 L${x} ${70 + (i % 2) * 20}`} stroke="#c9a227" strokeWidth={5} />
            <circle cx={x} cy={80 + (i % 2) * 20} r={14} fill="#fff4f9" opacity={0.6 + Math.sin(frame / 5 + i) * 0.3} />
          </g>
        ))}
        <Glow cx={0} cy={70} rx={260} ry={120} color="#ffe3f1" o={0.25} />
      </g>
      {/* neon sign */}
      <Glow cx={540} cy={640} rx={420} ry={170} color={PINK} o={0.5 * flicker} />
      <g opacity={flicker}>
        <rect x={290} y={555} width={500} height={160} rx={30} fill="none" stroke={PINK} strokeWidth={12} />
        <rect x={290} y={555} width={500} height={160} rx={30} fill="none" stroke={PINK_SOFT} strokeWidth={4} />
        <SignText x={540} y={662} size={80} text="ROOMS 24x7" fill={PINK_SOFT} stroke={PINK} />
      </g>
      {/* neon heart */}
      <g transform={`translate(160 830) scale(${pulse})`}>
        <Glow cx={0} cy={0} rx={140} ry={120} color="#c77dff" o={0.5} />
        <path d="M0 50 C-110 -20 -70 -110 0 -55 C70 -110 110 -20 0 50Z" fill="none" stroke="#c77dff" strokeWidth={12} strokeLinejoin="round" />
        <path d="M0 50 C-110 -20 -70 -110 0 -55 C70 -110 110 -20 0 50Z" fill="none" stroke="#f3d9ff" strokeWidth={4} strokeLinejoin="round" />
      </g>
      {/* key rack (gold) */}
      <g transform="translate(740 800)">
        <rect x={0} y={0} width={250} height={210} rx={14} fill="#3b1b5e" stroke={INK} strokeWidth={8} />
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} transform={`translate(${34 + (i % 4) * 60} ${40 + Math.floor(i / 4) * 95}) rotate(${Math.sin(frame / 14 + i) * 6})`}>
            <circle r={8} fill="#ffd43b" stroke={INK} strokeWidth={4} />
            <rect x={-12} y={10} width={24} height={42} rx={5} fill={PINK} stroke={INK} strokeWidth={4} />
          </g>
        ))}
      </g>
      {/* velvet sofa (left, behind the couple) */}
      <g transform="translate(-40 1300)">
        <rect x={0} y={0} width={420} height={150} rx={40} fill="#7b2cbf" stroke={INK} strokeWidth={9} />
        <rect x={20} y={-110} width={380} height={130} rx={40} fill="#9d4edd" stroke={INK} strokeWidth={9} />
        {[90, 210, 330].map((x) => (
          <circle key={x} cx={x} cy={-50} r={8} fill="#5a189a" />
        ))}
      </g>
      {/* glossy floor with pink reflections */}
      <rect x={-200} y={1450} width={W + 400} height={H - 1450} fill="#2a0f3d" />
      {Array.from({ length: 7 }).map((_, i) => (
        <path key={i} d={`M${-200 + i * 220} 1450 L${-330 + i * 260} ${H}`} stroke="#3a1656" strokeWidth={5} />
      ))}
      <Glow cx={540} cy={1560} rx={380} ry={60} color={PINK} o={0.22 * flicker} />
      <rect x={-200} y={1450} width={W + 400} height={10} fill={PINK} opacity={0.5 * pulse} />
    </>
  );
};

/** Purple reception counter with a pink LED edge, in front of the receptionist; the bell dings (jumps) at `dingAt`. */
export const Counter: React.FC<{ x?: number; dingAt?: number }> = ({ x = 600, dingAt = -100 }) => {
  const frame = useCurrentFrame();
  const t = frame - dingAt;
  const ding = t >= 0 && t < 10 ? Math.sin((t / 10) * Math.PI) * 18 : 0;
  const pulse = 0.85 + Math.sin(frame / 10) * 0.15;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <rect x={x} y={1420} width={W - x + 300} height={360} fill="#3c096c" stroke={INK} strokeWidth={10} />
      <rect x={x + 20} y={1440} width={W - x + 260} height={20} fill="#5a189a" />
      <rect x={x - 20} y={1390} width={W - x + 320} height={46} rx={10} fill="#240046" stroke={INK} strokeWidth={9} />
      <rect x={x - 20} y={1432} width={W - x + 320} height={8} fill={PINK} opacity={pulse} />
      <ellipse cx={x + 300} cy={1440} rx={420} ry={30} fill={PINK} opacity={0.25 * pulse} style={{ filter: "blur(20px)" }} />
      <rect x={x + 40} y={1500} width={300} height={70} rx={12} fill="#240046" stroke={PINK} strokeWidth={5} />
      <SignText x={x + 190} y={1550} size={40} text="RECEPTION" fill={PINK_SOFT} stroke="#240046" />
      {/* bell */}
      <g transform={`translate(${x + 120} ${1390 - ding})`}>
        <path d="M-50 0 Q-50 -70 0 -70 Q50 -70 50 0 Z" fill="#ffd43b" stroke={INK} strokeWidth={7} />
        <rect x={-60} y={-6} width={120} height={14} rx={6} fill="#868e96" stroke={INK} strokeWidth={5} />
        <circle cx={0} cy={-76} r={9} fill="#ffd43b" stroke={INK} strokeWidth={5} />
      </g>
      {t >= 0 && t < 12 && (
        <g transform={`translate(${x + 120} ${1290})`} opacity={1 - t / 12}>
          {[-1, 0, 1].map((k) => (
            <path key={k} d={`M${k * 40} 0 L${k * 70} ${-40 - t * 3}`} stroke="#ffd43b" strokeWidth={8} strokeLinecap="round" />
          ))}
        </g>
      )}
    </svg>
  );
};
