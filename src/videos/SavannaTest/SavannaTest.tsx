// Style test: golden-hour painting. Elephant family crossing the savanna against a low sun.
// Painted sky (loose horizontal brush strokes via turbulence displacement), streak clouds lit from below, distant ridges,
// flat-topped acacias, backlit silhouettes with a thin gold rim, glowing dust at the feet, tall swaying grass, a few birds.
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";

export const SAVANNA_DURATION = 300; // 10 s
const W = 1080;
const H = 1920;
const SUN = { x: 560, y: 1130, r: 120 };
const HORIZON = 1240;
const SIL = "#1d0f0b"; // silhouette
const RIM = "#ffcf6e"; // gold rim

/** Painted sky: gradient + many loose horizontal brush strokes, displaced by turbulence for a hand-painted edge. */
const Sky: React.FC = () => {
  const frame = useCurrentFrame();
  const strokes = Array.from({ length: 70 }).map((_, i) => {
    const y = random(`by${i}`) * HORIZON;
    const t = y / HORIZON;
    // colours from deep violet (top) to orange to pale gold near the sun line
    const c = t < 0.35 ? ["#3b2a5c", "#5a3a6e", "#7a4a72"][i % 3] : t < 0.7 ? ["#c0566a", "#e07a4f", "#d9663f"][i % 3] : ["#ffb35c", "#ffd08a", "#f59a4a"][i % 3];
    return { y, x: -200 + random(`bx${i}`) * 900, w: 300 + random(`bw${i}`) * 700, h: 12 + random(`bh${i}`) * 34, c, o: 0.25 + random(`bo${i}`) * 0.4 };
  });
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1f4a" />
          <stop offset="0.38" stopColor="#8a3f63" />
          <stop offset="0.62" stopColor="#e3703f" />
          <stop offset="0.8" stopColor="#ffb35c" />
          <stop offset="1" stopColor="#ffe2a0" />
        </linearGradient>
        <filter id="brush" x="-20%" y="-50%" width="140%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.18" numOctaves="3" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="38" />
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <radialGradient id="sunGlow">
          <stop offset="0" stopColor="#fff6d6" stopOpacity="1" />
          <stop offset="0.25" stopColor="#ffd98a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ff9a4a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={HORIZON + 40} fill="url(#skyG)" />
      <g filter="url(#brush)">
        {strokes.map((s, i) => (
          <rect key={i} x={s.x + Math.sin(frame / 90 + i) * 6} y={s.y} width={s.w} height={s.h} rx={s.h / 2} fill={s.c} opacity={s.o} />
        ))}
      </g>
      {/* low sun with a big glow */}
      <circle cx={SUN.x} cy={SUN.y} r={520} fill="url(#sunGlow)" opacity={0.75} />
      <circle cx={SUN.x} cy={SUN.y} r={SUN.r} fill="#fff1c4" />
      {/* streak clouds lit from below: dark violet bodies, gold undersides */}
      <g filter="url(#brush)">
        {[
          [80, 640, 560, 26],
          [420, 760, 640, 20],
          [-60, 880, 520, 18],
          [520, 960, 520, 14],
          [160, 1010, 380, 10],
        ].map(([x, y, w, h], i) => {
          const dx = (frame * (0.25 + i * 0.05)) % 60;
          return (
            <g key={i} transform={`translate(${x + dx} ${y})`}>
              <rect x={0} y={-h} width={w} height={h * 1.6} rx={h} fill="#4a2a52" opacity={0.75} />
              <rect x={20} y={h * 0.35} width={w - 40} height={h * 0.55} rx={h * 0.3} fill="#ffc46b" opacity={0.85} />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

/** Distant ridges (hazy layers) + flat-topped acacias + far grassland. */
const Land: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="haze">
        <feGaussianBlur stdDeviation="2.5" />
      </filter>
    </defs>
    <path d={`M0 ${HORIZON - 60} Q200 ${HORIZON - 130} 380 ${HORIZON - 70} T760 ${HORIZON - 90} T1080 ${HORIZON - 60} L1080 ${HORIZON + 40} L0 ${HORIZON + 40} Z`} fill="#b45a4a" opacity={0.55} filter="url(#haze)" />
    <path d={`M0 ${HORIZON - 20} Q260 ${HORIZON - 80} 520 ${HORIZON - 30} T1080 ${HORIZON - 40} L1080 ${HORIZON + 60} L0 ${HORIZON + 60} Z`} fill="#7a3a3a" opacity={0.75} filter="url(#haze)" />
    {/* plain */}
    <rect x={0} y={HORIZON + 20} width={W} height={H - HORIZON} fill="#3a1d14" />
    <rect x={0} y={HORIZON + 20} width={W} height={60} fill="#c0663a" opacity={0.35} />
    {/* acacias: thin trunk, flat wide canopy */}
    {[
      [140, HORIZON + 30, 1.0],
      [930, HORIZON + 26, 0.75],
      [700, HORIZON + 22, 0.45],
    ].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-6 0 L-4 -150 L-40 -210 M-4 -150 L30 -220 M-4 -150 L4 -230" stroke={SIL} strokeWidth={12} strokeLinecap="round" fill="none" />
        <path d="M-150 -220 Q-100 -270 0 -268 Q110 -272 160 -222 Q60 -206 0 -210 Q-80 -204 -150 -220Z" fill={SIL} />
        <path d="M-150 -220 Q-100 -270 0 -268 Q110 -272 160 -222" fill="none" stroke={RIM} strokeWidth={2} opacity={0.6} />
      </g>
    ))}
  </svg>
);

/** One elephant silhouette, facing right, walking. `phase` advances the gait; `s` scales it. */
const Elephant: React.FC<{ x: number; y: number; s: number; phase: number; seed: number; calf?: boolean }> = ({ x, y, s, phase, seed, calf }) => {
  const bob = Math.abs(Math.sin(phase)) * 6;
  // legs: diagonal pairs move together (front-left with back-right)
  const leg = (hx: number, hy: number, p: number, len: number, w: number) => {
    const swing = Math.sin(p) * 26;
    const lift = Math.max(0, Math.cos(p)) * 14;
    const fx = hx + swing;
    const fy = hy + len - lift;
    const kx = (hx + fx) / 2 + 6;
    const ky = hy + len * 0.55;
    return `M${hx} ${hy} Q${kx} ${ky} ${fx} ${fy} L${fx + w * 0.55} ${fy}`;
  };
  const trunkSegs = 6;
  let tx = 168;
  let ty = -70;
  let ang = 90;
  const trunk: string[] = [`M${tx} ${ty}`];
  for (let i = 0; i < trunkSegs; i++) {
    ang += Math.sin(phase * 0.5 + i * 0.6 + seed) * 7 - 2;
    tx += Math.cos((ang * Math.PI) / 180) * 22;
    ty += Math.sin((ang * Math.PI) / 180) * 22;
    trunk.push(`L${tx} ${ty}`);
  }
  const ear = 1 + Math.sin(phase * 0.8 + seed) * 0.16;
  const body = (
    <g>
      {/* far legs (slightly lighter) */}
      <path d={leg(-80, 10, phase + Math.PI, 150, 40)} stroke="#2a1712" strokeWidth={46} strokeLinecap="round" fill="none" />
      <path d={leg(90, 10, phase, 150, 40)} stroke="#2a1712" strokeWidth={46} strokeLinecap="round" fill="none" />
      {/* body + head */}
      <path d="M-150 20 Q-170 -80 -90 -120 Q0 -150 90 -120 Q150 -110 170 -70 Q190 -30 170 20 Q60 60 -40 50 Q-140 55 -150 20Z" />
      <path d="M120 -120 Q170 -150 205 -110 Q225 -70 190 -40 Q160 -30 140 -60Z" />
      {/* ear (flaps) */}
      <path d={`M120 -110 Q${120 - 70 * ear} -140 ${120 - 60 * ear} -40 Q100 -20 120 -60Z`} />
      {/* trunk */}
      <path d={trunk.join(" ")} fill="none" strokeWidth={calf ? 20 : 26} strokeLinecap="round" stroke="currentColor" />
      {/* tail */}
      <path d={`M-150 -20 Q${-175 + Math.sin(phase) * 8} 20 ${-170 + Math.sin(phase) * 12} 60`} fill="none" strokeWidth={6} stroke="currentColor" />
      {/* near legs */}
      <path d={leg(-60, 10, phase, 150, 44)} strokeWidth={50} strokeLinecap="round" fill="none" stroke="currentColor" />
      <path d={leg(110, 10, phase + Math.PI, 150, 44)} strokeWidth={50} strokeLinecap="round" fill="none" stroke="currentColor" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y - bob * s}) scale(${s})`}>
      {/* gold rim: thick blurred gold copy behind, then the dark silhouette on top (leaves a thin glowing edge) */}
      <g fill={RIM} color={RIM} stroke={RIM} strokeWidth={9} filter="url(#rimGlow)" opacity={0.95}>
        {body}
      </g>
      <g fill={SIL} color={SIL} stroke={SIL}>
        {body}
      </g>
    </g>
  );
};

/** Glowing dust kicked up at the feet. */
const Dust: React.FC<{ x: number; y: number; s: number; seed: number }> = ({ x, y, s, seed }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: 14 }).map((_, i) => {
        const life = 40;
        const t = ((frame + i * 3 + seed * 7) % life) / life;
        const px = x - t * 160 * s + (random(`dx${seed}${i}`) - 0.5) * 160 * s;
        const py = y - t * 70 * s - random(`dy${seed}${i}`) * 30 * s;
        const r = (10 + t * 30) * s;
        return <circle key={i} cx={px} cy={py} r={r} fill="#ffc46b" opacity={(1 - t) * 0.32} style={{ filter: "blur(6px)" }} />;
      })}
    </g>
  );
};

const Grass: React.FC<{ y: number; n: number; h: number; color: string; seed: string }> = ({ y, n, h, color, seed }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: n }).map((_, i) => {
        const x = -20 + (i / n) * (W + 40) + random(`${seed}x${i}`) * 20;
        const hh = h * (0.6 + random(`${seed}h${i}`) * 0.6);
        const sway = Math.sin(frame / 22 + i * 0.4) * 14 + 8;
        return (
          <g key={i}>
            <path d={`M${x} ${y} Q${x + sway * 0.5} ${y - hh * 0.6} ${x + sway} ${y - hh}`} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d={`M${x} ${y} Q${x + sway * 0.5} ${y - hh * 0.6} ${x + sway} ${y - hh}`} stroke={RIM} strokeWidth={1.2} fill="none" opacity={0.5} />
          </g>
        );
      })}
    </svg>
  );
};

const Birds: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {[0, 1, 2, 3].map((i) => {
        const x = -100 + ((frame * (2.2 + i * 0.3) + i * 140) % (W + 200));
        const y = 520 + i * 40 + Math.sin(frame / 20 + i) * 12;
        const flap = Math.sin(frame / 3 + i) * 10;
        return <path key={i} d={`M${x - 22} ${y - flap} Q${x - 10} ${y - 6} ${x} ${y} Q${x + 10} ${y - 6} ${x + 22} ${y - flap}`} stroke={SIL} strokeWidth={4} fill="none" strokeLinecap="round" />;
      })}
    </svg>
  );
};

export const SavannaTest: React.FC = () => {
  const frame = useCurrentFrame();
  const walk = interpolate(frame, [0, SAVANNA_DURATION], [-80, 420]);
  const phase = frame / 5;
  const herd = [
    { dx: 0, y: 1500, s: 1.15, seed: 1 },
    { dx: -330, y: 1490, s: 0.62, seed: 2, calf: true },
    { dx: -560, y: 1470, s: 1.0, seed: 3 },
  ];
  const camX = interpolate(frame, [0, SAVANNA_DURATION], [0, -60]);
  return (
    <AbsoluteFill style={{ background: "#2a1f4a", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${camX * 0.2}px)` }}>
        <Sky />
      </AbsoluteFill>
      <Birds />
      <AbsoluteFill style={{ transform: `translateX(${camX * 0.5}px)` }}>
        <Land />
        <Grass y={HORIZON + 60} n={80} h={40} color="#4a2418" seed="far" />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${camX}px)` }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <filter id="rimGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          {herd.map((e, i) => (
            <g key={i}>
              <Dust x={walk + e.dx} y={e.y + 160 * e.s} s={e.s} seed={e.seed} />
              <Elephant x={walk + e.dx} y={e.y} s={e.s} phase={phase + i * 0.9} seed={e.seed} calf={e.calf} />
            </g>
          ))}
        </svg>
      </AbsoluteFill>
      {/* foreground tall grass (dark, big, soft) */}
      <AbsoluteFill style={{ filter: "blur(1.5px)", transform: `translateX(${camX * 1.4}px)` }}>
        <Grass y={H + 20} n={46} h={300} color={SIL} seed="near" />
      </AbsoluteFill>
      {/* warm bloom + vignette */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${SUN.x}px ${SUN.y}px, rgba(255,210,140,0.35), transparent 45%)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, transparent 55%, rgba(20,8,20,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};
