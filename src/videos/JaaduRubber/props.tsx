// JaaduRubber props: the magic eraser (blue = big, red = small), a grow/shrink spring, magic burst, and the objects
// that change size: chai glass, school bag, mango, garbage pile, dustbin, toy house / real house, auto-rickshaw.
import React from "react";
import { interpolate, random, spring, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "../../lib/fonts";
import { INK } from "../../lib/reel";

/** Scale that springs from `from` to `to` at frame `at` (with overshoot), for grow/shrink magic. */
export const useMorph = (at: number, from: number, to: number) => {
  const frame = useCurrentFrame();
  const p = spring({ frame: frame - at, fps: 30, config: { damping: 9, stiffness: 120, mass: 0.8 } });
  return from + (to - from) * p;
};

/** Two-colour eraser; `glow` = "blue" | "red" | "both" (alternating) | "none". */
export const Eraser: React.FC<{ x: number; y: number; s?: number; rot?: number; glow?: "blue" | "red" | "both" | "none" }> = ({ x, y, s = 1, rot = -12, glow = "none" }) => {
  const frame = useCurrentFrame();
  const g = glow === "both" ? (Math.floor(frame / 12) % 2 ? "blue" : "red") : glow;
  const pulse = 0.6 + Math.sin(frame / 4) * 0.3;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {g !== "none" && <ellipse cx={g === "blue" ? -60 : 60} cy={0} rx={110} ry={80} fill={g === "blue" ? "#4dabf7" : "#ff6b6b"} opacity={0.45 * pulse} style={{ filter: "blur(18px)" }} />}
      <rect x={-120} y={-46} width={120} height={92} rx={14} fill="#339af0" stroke={INK} strokeWidth={8} />
      <rect x={0} y={-46} width={120} height={92} rx={14} fill="#ff6b6b" stroke={INK} strokeWidth={8} />
      <path d="M-104 -30 L-40 -30" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.6} />
      <path d="M16 -30 L80 -30" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.6} />
    </g>
  );
};

/** Sparkle ring burst at a magic moment. `big` = expanding (grow) or contracting (shrink). */
export const MagicBurst: React.FC<{ at: number; x: number; y: number; grow?: boolean; color?: string }> = ({ at, x, y, grow = true, color }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 20) return null;
  const c = color ?? (grow ? "#4dabf7" : "#ff6b6b");
  const r = grow ? 40 + t * 18 : 380 - t * 17;
  return (
    <g opacity={1 - t / 20}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={c} strokeWidth={10} />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const rr = r + 30;
        const cx = x + Math.cos(a) * rr;
        const cy = y + Math.sin(a) * rr;
        const sz = 16;
        return <path key={i} d={`M${cx} ${cy - sz} L${cx + 5} ${cy - 5} L${cx + sz} ${cy} L${cx + 5} ${cy + 5} L${cx} ${cy + sz} L${cx - 5} ${cy + 5} L${cx - sz} ${cy} L${cx - 5} ${cy - 5}Z`} fill="#fff3a0" stroke={INK} strokeWidth={3} />;
      })}
    </g>
  );
};

/** Cutting-chai glass that becomes a bucket of chai (scale applied by the caller), with steam. */
export const ChaiGlass: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => {
  const frame = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 1, 2].map((i) => {
        const t = ((frame + i * 12) % 36) / 36;
        return <path key={i} d={`M${-14 + i * 14} ${-70 - t * 50} q10 -14 0 -28`} fill="none" stroke="#fff" strokeWidth={6 / Math.max(1, s * 0.4)} strokeLinecap="round" opacity={0.8 * (1 - t)} />;
      })}
      <path d="M-30 -60 L30 -60 L22 0 L-22 0 Z" fill="#e8d3b0" stroke={INK} strokeWidth={5 / Math.max(1, s * 0.5)} opacity={0.9} />
      <path d="M-27 -44 L27 -44 L22 0 L-22 0 Z" fill="#c98a4b" />
      <ellipse cx={0} cy={-44} rx={27} ry={6} fill="#e0a663" />
    </g>
  );
};

/** School bag (big, heavy) — scale applied by caller. */
export const SchoolBag: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-60 -170 Q0 -230 60 -170" fill="none" stroke={INK} strokeWidth={12} />
    <rect x={-130} y={-170} width={260} height={300} rx={40} fill="#e8590c" stroke={INK} strokeWidth={9} />
    <rect x={-90} y={-30} width={180} height={120} rx={24} fill="#fd7e14" stroke={INK} strokeWidth={7} />
    <path d="M-60 10 L60 10" stroke={INK} strokeWidth={6} />
    <text x={0} y={-80} fontSize={52} textAnchor="middle" fill="#fff" fontFamily={FONT_FAMILY} fontWeight={800}>
      10 KG
    </text>
  </g>
);

/** Mango (scale by caller), with a leaf. */
export const Mango: React.FC<{ x: number; y: number; s: number; bitten?: number }> = ({ x, y, s, bitten = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -10 Q-56 -14 -60 -64 Q-58 -120 0 -126 Q64 -124 62 -60 Q60 -14 0 -10Z" fill="#ffb703" stroke={INK} strokeWidth={6 / Math.max(1, s * 0.6)} />
    <path d="M10 -120 Q40 -104 52 -70" fill="none" stroke="#fb8500" strokeWidth={10} opacity={0.6} />
    <path d="M0 -126 Q30 -150 56 -138 Q34 -120 0 -126Z" fill="#40c057" stroke={INK} strokeWidth={4} />
    {bitten > 0 &&
      Array.from({ length: Math.min(6, Math.floor(bitten)) }).map((_, i) => (
        <circle key={i} cx={-60 + i * 22} cy={-118 + (i % 2) * 10} r={18} fill="#87ceeb" opacity={0} />
      ))}
  </g>
);

/** Garbage mountain with flies (scale by caller). */
export const Garbage: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => {
  const frame = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-320 0 Q-280 -200 -120 -260 Q0 -360 120 -250 Q290 -190 330 0 Z" fill="#7d6b57" stroke={INK} strokeWidth={9} />
      {[
        [-180, -80, "#adb5bd"],
        [-60, -190, "#e64980"],
        [90, -120, "#74c0fc"],
        [200, -60, "#ffd43b"],
        [-10, -60, "#69db7c"],
      ].map(([bx, by, c], i) => (
        <rect key={i} x={(bx as number) - 40} y={(by as number) - 30} width={80} height={60} rx={10} fill={c as string} stroke={INK} strokeWidth={6} transform={`rotate(${(i - 2) * 18} ${bx} ${by})`} />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={i} cx={Math.sin(frame / 4 + i * 2) * 160} cy={-320 + Math.cos(frame / 3 + i) * 60} r={7} fill={INK} />
      ))}
      {[-120, 0, 120].map((sx, i) => {
        const t = ((frame + i * 10) % 30) / 30;
        return <path key={i} d={`M${sx} ${-300 - t * 80} q20 -20 0 -40`} fill="none" stroke="#a9e34b" strokeWidth={10} strokeLinecap="round" opacity={0.7 * (1 - t)} />;
      })}
    </g>
  );
};

export const Dustbin: React.FC<{ x: number; y: number; bumpAt?: number }> = ({ x, y, bumpAt = -100 }) => {
  const frame = useCurrentFrame();
  const t = frame - bumpAt;
  const bump = t >= 0 && t < 10 ? Math.sin((t / 10) * Math.PI) * 0.15 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${1 + bump} ${1 - bump})`}>
      <path d="M-90 -200 L90 -200 L72 0 L-72 0 Z" fill="#2f9e44" stroke={INK} strokeWidth={9} />
      <rect x={-104} y={-226} width={208} height={34} rx={10} fill="#2b8a3e" stroke={INK} strokeWidth={8} />
      <path d="M-30 -140 L30 -140 M-30 -90 L30 -90" stroke="#fff" strokeWidth={8} opacity={0.6} />
    </g>
  );
};

/** House: draws a pink house with a red roof; used as a toy (small scale) and as the real house (big scale). */
export const House: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-200} y={-300} width={400} height={300} fill="#ffc9de" stroke={INK} strokeWidth={9} />
    <path d="M-240 -290 L0 -470 L240 -290 Z" fill="#e8590c" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <rect x={120} y={-440} width={44} height={90} fill="#c92a2a" stroke={INK} strokeWidth={7} />
    <rect x={-40} y={-140} width={80} height={140} fill="#8a5530" stroke={INK} strokeWidth={8} />
    <rect x={-160} y={-230} width={90} height={80} fill="#a5d8ff" stroke={INK} strokeWidth={7} />
    <rect x={70} y={-230} width={90} height={80} fill="#a5d8ff" stroke={INK} strokeWidth={7} />
  </g>
);

/** Falling confetti from `at`. */
export const Confetti: React.FC<{ at: number; count?: number }> = ({ at, count = 40 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const x0 = random(`cf${i}`) * 1080;
        const y = -40 + (t - random(`cd${i}`) * 20) * (8 + random(`cs${i}`) * 6);
        if (y < -40) return null;
        const c = ["#ff6b6b", "#ffd43b", "#4dabf7", "#69db7c", "#f783ac"][i % 5];
        return <rect key={i} x={x0 + Math.sin(t / 6 + i) * 30} y={y} width={18} height={10} fill={c} transform={`rotate(${t * 12 + i * 30} ${x0} ${y})`} />;
      })}
    </g>
  );
};

export const clampT = (frame: number, a: number, b: number) => interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
