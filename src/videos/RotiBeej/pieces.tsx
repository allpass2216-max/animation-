// RotiBeej pieces: office front, Kunal's room, the clay "beej" pot (coins drop in, glow, a sprout grows),
// falling ₹500 notes and shopping parcels (gravity + bounce), a year counter, and note-bundle stacks for A-D.
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "../../lib/fonts";
import { dropBounce, H, INK, W } from "../../lib/reel";
import { SignText } from "../../lib/world";

/** Office tower front with a big sign, morning sky, pavement. */
export const OfficeFront: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <rect x={-200} y={0} width={W + 400} height={H} fill="#a5d8ff" />
      {[0, 1].map((i) => (
        <g key={i} opacity={0.85} transform={`translate(${160 + i * 560 + Math.sin(frame / 60 + i) * 10} ${200 + i * 70})`}>
          <ellipse rx={110} ry={38} fill="#fff" />
          <ellipse cx={50} cy={-24} rx={60} ry={40} fill="#fff" />
        </g>
      ))}
      <rect x={60} y={360} width={960} height={1140} fill="#dee2e6" stroke={INK} strokeWidth={10} />
      <rect x={180} y={400} width={720} height={120} rx={16} fill="#1c7ed6" stroke={INK} strokeWidth={9} />
      <SignText x={540} y={482} size={70} text="SKYLINE TECH" />
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 5 }).map((__, c) => (
          <rect key={`${r}${c}`} x={110 + c * 180} y={580 + r * 170} width={140} height={120} rx={8} fill="#d0ebff" stroke={INK} strokeWidth={6} />
        )),
      )}
      <rect x={430} y={1260} width={220} height={240} fill="#74c0fc" stroke={INK} strokeWidth={9} />
      <rect x={-200} y={1500} width={W + 400} height={H} fill="#ced4da" />
      <rect x={-200} y={1500} width={W + 400} height={14} fill={INK} opacity={0.25} />
    </>
  );
};

/** Kunal's simple room: warm wall, window, shelf. */
export const SimpleRoom: React.FC<{ night?: boolean }> = ({ night }) => (
  <>
    <rect x={-200} y={0} width={W + 400} height={H} fill={night ? "#3b2f4a" : "#f3d9b1"} />
    <rect x={640} y={420} width={320} height={380} fill={night ? "#1c2452" : "#a5d8ff"} stroke={INK} strokeWidth={10} />
    <path d="M800 420 L800 800 M640 610 L960 610" stroke={INK} strokeWidth={9} />
    <rect x={60} y={900} width={360} height={24} fill="#a0663f" stroke={INK} strokeWidth={7} />
    <rect x={90} y={820} width={60} height={80} fill="#4dabf7" stroke={INK} strokeWidth={6} />
    <rect x={170} y={800} width={50} height={100} fill="#ff8787" stroke={INK} strokeWidth={6} />
    <rect x={-200} y={1500} width={W + 400} height={H} fill={night ? "#2a2238" : "#c08552"} />
    <rect x={-200} y={1500} width={W + 400} height={14} fill={INK} opacity={0.25} />
  </>
);

/** Clay "beej" pot: `fill` 0..1 sets the glow level; a sprout grows from `sproutAt`; a coin drops in at each frame of `coinsAt`. */
export const BeejPot: React.FC<{ x: number; y: number; s?: number; fill?: number; sproutAt?: number; coinsAt?: number[] }> = ({
  x,
  y,
  s = 1,
  fill = 0.3,
  sproutAt = 1e9,
  coinsAt = [],
}) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [sproutAt, sproutAt + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sway = Math.sin(frame / 12) * 4;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx={0} cy={-120} rx={170 * (0.6 + fill)} ry={160 * (0.6 + fill)} fill="#ffd43b" opacity={0.18 + fill * 0.25} style={{ filter: "blur(30px)" }} />
        {/* sprout */}
        {grow > 0 && (
          <g transform={`translate(0 -250) rotate(${sway}) scale(${grow})`}>
            <path d="M0 0 L0 -130" stroke="#2f9e44" strokeWidth={12} strokeLinecap="round" />
            <path d="M0 -90 Q-70 -130 -90 -70 Q-40 -60 0 -90Z" fill="#51cf66" stroke={INK} strokeWidth={6} />
            <path d="M0 -120 Q70 -170 95 -100 Q40 -90 0 -120Z" fill="#69db7c" stroke={INK} strokeWidth={6} />
          </g>
        )}
        <path d="M-120 -240 Q-170 -120 -110 0 L110 0 Q170 -120 120 -240 Z" fill="#c8693a" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        <rect x={-90} y={-270} width={180} height={40} rx={14} fill="#a8552c" stroke={INK} strokeWidth={8} />
        <path d={`M-100 ${-30 - fill * 150} Q0 ${-50 - fill * 150} 100 ${-30 - fill * 150}`} fill="none" stroke="#ffd43b" strokeWidth={12} opacity={0.9} />
        <path d="M-110 -150 Q0 -120 110 -150" fill="none" stroke="#8a3f1c" strokeWidth={6} />
        <SignText x={0} y={-80} size={46} text="BEEJ" fill="#ffe8cc" stroke="#7a3412" />
        {/* coins dropping in */}
        {coinsAt.map((c, i) => {
          const t = (frame - c) / 30;
          if (t < 0 || t > 0.45) return null;
          const cy = -520 + 0.5 * 4400 * t * t;
          return (
            <g key={i} transform={`translate(${Math.sin(i) * 10} ${Math.min(cy, -250)})`}>
              <ellipse rx={30 * Math.abs(Math.cos(t * 20)) + 4} ry={30} fill="#ffd43b" stroke={INK} strokeWidth={6} />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

/** ₹500 notes fluttering down from (x, y) after `at`, drifting sideways (money being blown). */
export const NoteFlutter: React.FC<{ at: number; x: number; y: number; count?: number }> = ({ at, x, y, count = 10 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      {Array.from({ length: count }).map((_, i) => {
        const tt = t - i * 3;
        if (tt < 0) return null;
        const dir = random(`nd${i}`) > 0.5 ? 1 : -1;
        const px = x + dir * (40 + random(`nx${i}`) * 220) * Math.min(1, tt / 20) + Math.sin(tt / 6 + i) * 30;
        const py = Math.min(y + tt * (5 + random(`ny${i}`) * 3), 1720);
        return (
          <g key={i} transform={`translate(${px} ${py}) rotate(${Math.sin(tt / 5 + i) * 40})`}>
            <rect x={-46} y={-24} width={92} height={48} rx={6} fill="#c3a6e0" stroke={INK} strokeWidth={5} />
            <text x={0} y={10} fontSize={26} textAnchor="middle" fill="#5f3dc4" fontFamily={FONT_FAMILY} fontWeight={800}>
              ₹500
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** Online-shopping parcels dropping one after another, bouncing and piling up. */
export const Parcels: React.FC<{ at: number; x: number; floorY: number }> = ({ at, x, floorY }) => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      {[0, 1, 2].map((i) => {
        const d = dropBounce(frame, at + i * 6, 700);
        if (frame < at + i * 6) return null;
        const w = [180, 150, 120][i];
        const yBase = floorY - [0, 110, 200][i];
        return (
          <g key={i} transform={`translate(${x + [0, 20, -10][i]} ${yBase + d.y}) scale(${1 + d.squash * 0.15} ${1 - d.squash * 0.2})`}>
            <rect x={-w / 2} y={-100} width={w} height={100} rx={8} fill="#d9a066" stroke={INK} strokeWidth={7} />
            <path d={`M${-w / 2} -60 L${w / 2} -60`} stroke="#8a5a3b" strokeWidth={10} />
          </g>
        );
      })}
    </svg>
  );
};

/** Year counter badge "SAAL n" counting 1 -> 10 between frames a and b. */
export const YearCounter: React.FC<{ a: number; b: number; x: number; y: number }> = ({ a, b, x, y }) => {
  const frame = useCurrentFrame();
  const yr = Math.round(interpolate(frame, [a, b], [1, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const pop = (frame - a) % Math.max(1, Math.round((b - a) / 9)) < 3 ? 1.08 : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${pop})`,
        padding: "16px 34px",
        background: "#7a4a2c",
        border: `8px solid ${INK}`,
        borderRadius: 22,
        boxShadow: `0 10px 0 ${INK}`,
        fontFamily: FONT_FAMILY,
        fontWeight: 800,
        fontSize: 64,
        color: "#fff3bf",
        whiteSpace: "nowrap",
      }}
    >
      SAAL {yr}
    </div>
  );
};

/** Stack of ₹ note bundles: `n` bundles grow up from (x, floorY) as `at` passes, with a label tag. */
export const NoteStack: React.FC<{ n: number; at: number; x: number; floorY: number; label: string; tint?: string }> = ({ n, at, x, floorY, label, tint = "#8fe08c" }) => {
  const frame = useCurrentFrame();
  const shown = Math.min(n, Math.max(0, Math.floor((frame - at) / 1.5)));
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      {Array.from({ length: shown }).map((_, i) => (
        <g key={i} transform={`translate(${x + (i % 2 ? 6 : -6)} ${floorY - i * 46})`}>
          <rect x={-110} y={-44} width={220} height={44} rx={6} fill={tint} stroke={INK} strokeWidth={6} />
          <rect x={-22} y={-44} width={44} height={44} fill="#f6d55c" stroke={INK} strokeWidth={5} />
        </g>
      ))}
      {shown >= n && (
        <g transform={`translate(${x} ${floorY - n * 46 - 70})`}>
          <rect x={-150} y={-50} width={300} height={84} rx={18} fill="#fff" stroke={INK} strokeWidth={7} />
          <text x={0} y={12} fontSize={48} textAnchor="middle" fill={INK} fontFamily={FONT_FAMILY} fontWeight={800}>
            {label}
          </text>
        </g>
      )}
    </svg>
  );
};

/** Empty plate (roti all eaten). */
export const EmptyPlate: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
    <ellipse cx={x} cy={y} rx={130} ry={40} fill="#e9ecef" stroke={INK} strokeWidth={8} />
    <ellipse cx={x} cy={y - 4} rx={80} ry={22} fill="#dee2e6" />
    <circle cx={x - 30} cy={y - 6} r={5} fill="#c98a4b" />
    <circle cx={x + 20} cy={y - 2} r={4} fill="#c98a4b" />
  </svg>
);
