// SajdaRaat world: Muslim city skyline (domes, minarets, crescent), a home bedroom with arabesque tiles, arched window,
// hanging lantern, Quran + prayer mat on a shelf; Arabic calligraphy text; the sajda figure; nikah arch; path of small steps.
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { ARABIC_FONT } from "../../lib/fonts";
import { H, INK, W } from "../../lib/reel";

type Mood = "night" | "dawn" | "golden";
const SKY: Record<Mood, [string, string, string]> = {
  night: ["#0b1030", "#1c2452", "#2e2a5c"],
  dawn: ["#f6d7b0", "#f2b38f", "#c995b8"],
  golden: ["#3a2a5e", "#c2566a", "#ffb35c"],
};

/** Crescent moon. */
export const Crescent: React.FC<{ x: number; y: number; r: number; color?: string }> = ({ x, y, r, color = "#fff1c4" }) => (
  <g>
    <circle cx={x} cy={y} r={r * 1.8} fill={color} opacity={0.12} />
    <path d={`M${x} ${y - r} A${r} ${r} 0 1 0 ${x} ${y + r} A${r * 0.78} ${r * 0.78} 0 1 1 ${x} ${y - r} Z`} fill={color} transform={`rotate(-20 ${x} ${y})`} />
  </g>
);

/** Dome + minaret city skyline; silhouettes with lit windows; crescent finials. */
export const CitySkyline: React.FC<{ horizon: number; mood: Mood; scale?: number; offsetX?: number }> = ({ horizon, mood, scale = 1, offsetX = 0 }) => {
  const frame = useCurrentFrame();
  const sil = mood === "dawn" ? "#7a5a7e" : mood === "golden" ? "#2a1712" : "#151a3a";
  const rim = mood === "night" ? "#8fa3e0" : "#ffcf6e";
  const win = mood === "dawn" ? "#fff3d6" : "#ffd27a";
  const domes: { x: number; w: number; h: number }[] = [
    { x: 180, w: 220, h: 260 },
    { x: 560, w: 320, h: 360 },
    { x: 900, w: 200, h: 220 },
  ];
  const minarets = [70, 360, 760, 1010];
  return (
    <g transform={`translate(${offsetX} ${horizon}) scale(${scale}) translate(0 ${-horizon})`}>
      {/* back houses */}
      {Array.from({ length: 16 }).map((_, i) => {
        const hh = 90 + random(`hh${i}`) * 140;
        return <rect key={i} x={-200 + i * 95} y={horizon - hh} width={90} height={hh} fill={sil} opacity={0.75} />;
      })}
      {/* minarets */}
      {minarets.map((mx, i) => {
        const mh = 520 + (i % 2) * 120;
        return (
          <g key={mx}>
            <rect x={mx - 22} y={horizon - mh} width={44} height={mh} fill={sil} />
            <rect x={mx - 34} y={horizon - mh * 0.72} width={68} height={16} fill={sil} />
            <path d={`M${mx - 24} ${horizon - mh} Q${mx} ${horizon - mh - 70} ${mx + 24} ${horizon - mh} Z`} fill={sil} />
            <path d={`M${mx} ${horizon - mh - 70} L${mx} ${horizon - mh - 100}`} stroke={rim} strokeWidth={4} />
            <Crescent x={mx} y={horizon - mh - 112} r={10} color={rim} />
            <rect x={mx - 22} y={horizon - mh} width={3} height={mh} fill={rim} opacity={0.6} />
          </g>
        );
      })}
      {/* domed buildings */}
      {domes.map((d, i) => (
        <g key={i}>
          <rect x={d.x - d.w / 2} y={horizon - d.h * 0.55} width={d.w} height={d.h * 0.55} fill={sil} />
          <path d={`M${d.x - d.w * 0.42} ${horizon - d.h * 0.55} Q${d.x - d.w * 0.45} ${horizon - d.h * 1.05} ${d.x} ${horizon - d.h * 1.12} Q${d.x + d.w * 0.45} ${horizon - d.h * 1.05} ${d.x + d.w * 0.42} ${horizon - d.h * 0.55} Z`} fill={sil} />
          <path d={`M${d.x - d.w * 0.42} ${horizon - d.h * 0.55} Q${d.x - d.w * 0.45} ${horizon - d.h * 1.05} ${d.x} ${horizon - d.h * 1.12}`} fill="none" stroke={rim} strokeWidth={3} opacity={0.8} />
          <path d={`M${d.x} ${horizon - d.h * 1.12} L${d.x} ${horizon - d.h * 1.2}`} stroke={rim} strokeWidth={4} />
          <Crescent x={d.x} y={horizon - d.h * 1.25} r={12} color={rim} />
          {/* arched windows */}
          {[-1, 0, 1].map((k) => (
            <path key={k} d={`M${d.x + k * d.w * 0.28 - 14} ${horizon - 30} L${d.x + k * d.w * 0.28 - 14} ${horizon - 80} Q${d.x + k * d.w * 0.28} ${horizon - 100} ${d.x + k * d.w * 0.28 + 14} ${horizon - 80} L${d.x + k * d.w * 0.28 + 14} ${horizon - 30} Z`} fill={win} opacity={0.55 + 0.4 * Math.abs(Math.sin(frame / 30 + i + k))} />
          ))}
        </g>
      ))}
    </g>
  );
};

/** Full sky + city (for outdoor scenes). */
export const CityScene: React.FC<{ mood: Mood; horizon?: number }> = ({ mood, horizon = 1500 }) => {
  const frame = useCurrentFrame();
  const [a, b, c] = SKY[mood];
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <defs>
        <linearGradient id={`sky-${mood}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="0.6" stopColor={b} />
          <stop offset="1" stopColor={c} />
        </linearGradient>
      </defs>
      <rect x={-400} y={-600} width={W + 800} height={horizon + 600} fill={`url(#sky-${mood})`} />
      {mood === "night" &&
        Array.from({ length: 45 }).map((_, i) => (
          <circle key={i} cx={random(`sx${i}`) * W} cy={random(`sy${i}`) * (horizon - 500)} r={1.5 + random(`sr${i}`) * 2.5} fill="#fff" opacity={0.3 + 0.6 * Math.abs(Math.sin(frame / 20 + i))} />
        ))}
      {mood === "night" && <Crescent x={820} y={330} r={70} />}
      {mood === "golden" && (
        <g>
          <circle cx={540} cy={horizon - 120} r={420} fill="#ffd590" opacity={0.35} />
          <circle cx={540} cy={horizon - 120} r={95} fill="#fff1c4" />
        </g>
      )}
      {mood === "dawn" && <circle cx={300} cy={horizon - 260} r={80} fill="#fff6dc" opacity={0.9} />}
      <CitySkyline horizon={horizon} mood={mood} />
      <rect x={-400} y={horizon} width={W + 800} height={H - horizon + 600} fill={mood === "night" ? "#151a3a" : mood === "golden" ? "#3a2116" : "#b8957a"} />
    </svg>
  );
};

/** Eight-point star tile pattern (arabesque) for walls. */
const Arabesque: React.FC<{ color: string; opacity?: number }> = ({ color, opacity = 0.18 }) => (
  <g opacity={opacity}>
    {Array.from({ length: 8 }).map((_, r) =>
      Array.from({ length: 6 }).map((__, c) => {
        const cx = -40 + c * 220 + (r % 2) * 110;
        const cy = 40 + r * 200;
        return (
          <g key={`${r}-${c}`} transform={`translate(${cx} ${cy})`}>
            <rect x={-46} y={-46} width={92} height={92} fill="none" stroke={color} strokeWidth={5} />
            <rect x={-46} y={-46} width={92} height={92} fill="none" stroke={color} strokeWidth={5} transform="rotate(45)" />
          </g>
        );
      }),
    )}
  </g>
);

/** Bedroom at night (or morning): arabesque wall, arched window with the city, lantern, shelf with Quran + rolled prayer mat. */
export const Room: React.FC<{ morning?: boolean; phoneGlow?: number; dustyShelf?: boolean; lanternOn?: boolean }> = ({ morning, phoneGlow = 0, dustyShelf, lanternOn = true }) => {
  const frame = useCurrentFrame();
  const wall = morning ? "#e9d8bd" : "#1f2346";
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill={wall} />
      <Arabesque color={morning ? "#a0663f" : "#8fa3e0"} opacity={morning ? 0.14 : 0.08} />
      {/* arched window with the city */}
      <g>
        <defs>
          <clipPath id="arch">
            <path d="M620 1040 L620 560 Q620 380 790 360 Q960 380 960 560 L960 1040 Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#arch)">
          <rect x={600} y={340} width={380} height={720} fill={morning ? "#f6d7b0" : "#0b1030"} />
          {!morning && <Crescent x={880} y={470} r={36} />}
          <CitySkyline horizon={1040} mood={morning ? "dawn" : "night"} scale={0.42} offsetX={560} />
        </g>
        <path d="M620 1040 L620 560 Q620 380 790 360 Q960 380 960 560 L960 1040 Z" fill="none" stroke="#6b3f22" strokeWidth={22} />
        <path d="M790 370 L790 1040 M620 700 L960 700" stroke="#6b3f22" strokeWidth={10} />
      </g>
      {/* hanging lantern (fanoos) */}
      <g transform={`translate(120 ${560 + Math.sin(frame / 30) * 4}) rotate(${Math.sin(frame / 40) * 2})`}>
        <path d="M0 -560 L0 0" stroke="#c9a227" strokeWidth={5} />
        <path d="M-50 0 L50 0 L70 70 L40 160 L-40 160 L-70 70 Z" fill={lanternOn ? "#ffcf6e" : "#8a6d1d"} stroke="#6b4a10" strokeWidth={7} />
        <path d="M-30 20 L30 20 M-45 80 L45 80 M-30 140 L30 140" stroke="#6b4a10" strokeWidth={5} />
        <path d="M-20 0 Q0 -40 20 0" fill="#c9a227" stroke="#6b4a10" strokeWidth={5} />
        {lanternOn && <circle cx={0} cy={80} r={220} fill="#ffcf6e" opacity={morning ? 0.08 : 0.16} />}
      </g>
      {/* shelf with Quran (green, gold) + rolled prayer mat */}
      <g>
        <rect x={60} y={1000} width={420} height={26} fill="#8a5530" stroke={INK} strokeWidth={7} />
        <g transform="translate(140 935)">
          <rect x={-60} y={-60} width={120} height={70} rx={8} fill="#2b8a3e" stroke={INK} strokeWidth={6} />
          <rect x={-46} y={-48} width={92} height={46} rx={6} fill="none" stroke="#ffd43b" strokeWidth={4} />
          <circle cx={0} cy={-25} r={10} fill="none" stroke="#ffd43b" strokeWidth={4} />
        </g>
        <g transform="translate(360 950)">
          <rect x={-90} y={-46} width={180} height={92} rx={46} fill="#a61e4d" stroke={INK} strokeWidth={6} />
          <path d="M-60 -46 L-60 46 M0 -46 L0 46 M60 -46 L60 46" stroke="#ffd43b" strokeWidth={4} opacity={0.7} />
        </g>
        {dustyShelf &&
          Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx={80 + random(`du${i}`) * 380} cy={880 + random(`dv${i}`) * 110 - ((frame + i * 13) % 90) * 0.3} r={3} fill="#c9c2b0" opacity={0.6} />
          ))}
      </g>
      {/* floor + rug */}
      <rect x={-300} y={1500} width={W + 600} height={H} fill={morning ? "#b07a50" : "#151833"} />
      <rect x={-300} y={1500} width={W + 600} height={14} fill={INK} opacity={0.3} />
      <ellipse cx={540} cy={1760} rx={520} ry={90} fill={morning ? "#c2255c" : "#3b1b4e"} opacity={0.5} />
      {/* phone glow on the room */}
      {phoneGlow > 0 && <circle cx={420} cy={1150} r={520} fill="#74c0fc" opacity={0.18 * phoneGlow} />}
      {!morning && <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#000" opacity={0.18} />}
    </svg>
  );
};

/** Arabic calligraphy line, right-to-left, Amiri font, gold with a dark outline + glow; pops in at `at`. */
export const Arabic: React.FC<{ text: string; at: number; until?: number; y: number; size?: number; color?: string }> = ({ text, at, until = 1e9, y, size = 96, color = "#ffd77a" }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  const p = interpolate(frame - at, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const out = interpolate(frame, [until - 6, until], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: y,
        textAlign: "center",
        fontFamily: ARABIC_FONT,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.5,
        color,
        WebkitTextStroke: `${Math.max(3, size * 0.05)}px #2a1a08`,
        paintOrder: "stroke fill",
        textShadow: `0 0 ${size * 0.4}px rgba(255,210,120,0.75)`,
        opacity: p * out,
        transform: `translateY(${(1 - p) * 20}px) scale(${0.92 + 0.08 * p})`,
      }}
    >
      {text}
    </div>
  );
};

/** Figure in sajda on a prayer mat (side view, simple), with tears; `at` = when he goes down. */
export const SajdaFigure: React.FC<{ x: number; y: number; at: number; kufi?: string; robe?: string; s?: number }> = ({ x, y, at, kufi = "#f8f9fa", robe = "#e9ecef", s = 1 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - at, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const breathe = Math.sin(frame / 14) * 3;
  const headX = interpolate(t, [0, 1], [30, 150]);
  const headY = interpolate(t, [0, 1], [-330, -70]);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {/* prayer mat with arch motif */}
        <rect x={-260} y={-10} width={560} height={40} rx={8} fill="#a61e4d" stroke={INK} strokeWidth={7} />
        <path d="M200 -10 Q240 -40 280 -10" fill="none" stroke="#ffd43b" strokeWidth={5} />
        {/* body: from kneeling-up to forehead on the mat */}
        <path d={`M-150 0 Q-190 ${-120 - (1 - t) * 120} -60 ${-170 - (1 - t) * 140 + breathe} Q${60 + t * 30} ${-200 - (1 - t) * 130} ${headX - 40} ${headY + 40} L${headX - 60} 0 Z`} fill={robe} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        {/* arm to the mat */}
        <path d={`M${-10 + t * 40} ${-150 + t * 60} Q${60 + t * 60} ${-60} ${headX + 10} -6`} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" />
        <path d={`M${-10 + t * 40} ${-150 + t * 60} Q${60 + t * 60} ${-60} ${headX + 10} -6`} fill="none" stroke={robe} strokeWidth={20} strokeLinecap="round" />
        {/* head + kufi */}
        <circle cx={headX} cy={headY} r={66} fill="#C98B5E" stroke={INK} strokeWidth={8} />
        <path d={`M${headX - 64} ${headY - 10} Q${headX - 60} ${headY - 74} ${headX} ${headY - 78} Q${headX + 60} ${headY - 74} ${headX + 64} ${headY - 10} Z`} fill={kufi} stroke={INK} strokeWidth={7} transform={`rotate(${t * 70} ${headX} ${headY})`} />
        {/* tears */}
        {t >= 1 &&
          [0, 1].map((i) => {
            const tt = ((frame + i * 14) % 28) / 28;
            return <path key={i} d={`M${headX + 30 + i * 12} ${headY + 20 + tt * 50} q8 14 0 20 q-8 -6 0 -20`} fill="#a5d8ff" stroke={INK} strokeWidth={3} opacity={1 - tt * 0.6} />;
          })}
      </g>
    </svg>
  );
};

/** Nikah arch with flowers and fairy lights. */
export const NikahArch: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <path d="M180 1700 L180 900 Q180 620 540 590 Q900 620 900 900 L900 1700" fill="none" stroke="#f8f0e3" strokeWidth={40} />
      <path d="M180 1700 L180 900 Q180 620 540 590 Q900 620 900 900 L900 1700" fill="none" stroke={INK} strokeWidth={6} opacity={0.4} />
      {Array.from({ length: 22 }).map((_, i) => {
        const a = Math.PI + (i / 21) * Math.PI;
        const cx = 540 + Math.cos(a) * 360;
        const cy = 900 + Math.sin(a) * 300;
        return <circle key={i} cx={cx} cy={cy} r={20 + (i % 3) * 4} fill={["#f783ac", "#fff0f6", "#ffd43b"][i % 3]} stroke={INK} strokeWidth={4} />;
      })}
      {Array.from({ length: 16 }).map((_, i) => (
        <circle key={i} cx={210 + i * 44} cy={640 + Math.sin(i / 2.5) * 40 + 60} r={6} fill="#fff3bf" opacity={0.5 + 0.5 * Math.abs(Math.sin(frame / 8 + i))} />
      ))}
    </svg>
  );
};

/** Path of small stepping stones (chat bubbles) leading to a dark drop; stones light up one by one from `at`. */
export const StepsPath: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      {/* dark drop at the end */}
      <ellipse cx={850} cy={1000} rx={220} ry={70} fill="#05060f" />
      <ellipse cx={850} cy={985} rx={240} ry={70} fill="none" stroke="#e03131" strokeWidth={4} opacity={0.5} />
      {Array.from({ length: 6 }).map((_, i) => {
        const cx = 260 + i * 105;
        const cy = 1560 - i * 100;
        const lit = frame >= at + i * 4;
        const s = 1.5 - i * 0.14;
        return (
          <g key={i} transform={`translate(${cx} ${cy}) scale(${s})`}>
            <ellipse cx={0} cy={0} rx={80} ry={30} fill={lit ? "#74c0fc" : "#5c6699"} stroke={INK} strokeWidth={6} />
            {lit && <ellipse cx={0} cy={0} rx={110} ry={44} fill="#74c0fc" opacity={0.25} />}
            {lit && (
              <g>
                <rect x={-34} y={-46} width={68} height={34} rx={14} fill="#e7f5ff" stroke={INK} strokeWidth={4} />
                <path d="M-18 -30 L18 -30" stroke="#868e96" strokeWidth={5} />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/** Heavy heart that drops with gravity and lands with a thud at `at`. */
export const HeavyHeart: React.FC<{ at: number; x: number; floor: number }> = ({ at, x, floor }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - at) / 30;
  const y = Math.min(floor, 700 + 0.5 * 3200 * t * t);
  const squash = y >= floor && frame - at < 30 ? 0.18 : 0;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <g transform={`translate(${x} ${y}) scale(${1 + squash} ${1 - squash})`}>
        <path d="M0 50 C-120 -30 -80 -130 0 -70 C80 -130 120 -30 0 50Z" fill="#c92a2a" stroke={INK} strokeWidth={8} />
        <rect x={-36} y={50} width={72} height={60} rx={8} fill="#495057" stroke={INK} strokeWidth={6} />
        <text x={0} y={92} fontSize={30} textAnchor="middle" fill="#fff" fontFamily="Poppins" fontWeight={800}>
          10 KG
        </text>
      </g>
    </svg>
  );
};
