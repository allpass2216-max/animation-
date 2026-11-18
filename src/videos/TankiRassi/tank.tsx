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

/** Golden-hour painting mode for the whole video (wrap in <Golden.Provider value>). */
export const Golden = React.createContext(false);
export const RIM = "#ffcf6e";
export const SIL = "#22120d";

/** Painted dusk sky: horizontal brush strokes, streak clouds lit from below, a setting sun on the horizon, rising moon,
 *  backlit town silhouettes with a few lit windows, a few birds. */
const GoldenSky: React.FC<{ horizon: number }> = ({ horizon }) => {
  const frame = useCurrentFrame();
  const strokes = Array.from({ length: 80 }).map((_, i) => {
    const y = -300 + random(`gy${i}`) * (horizon + 300);
    const t = (y + 300) / (horizon + 300);
    const c =
      t < 0.4
        ? ["#2c2150", "#3d2a5e", "#523468"][i % 3]
        : t < 0.75
          ? ["#a1466a", "#c75a55", "#e0703f"][i % 3]
          : ["#ffab55", "#ffd08a", "#f59446"][i % 3];
    return {
      y,
      x: -400 + random(`gx${i}`) * 1100,
      w: 320 + random(`gw${i}`) * 760,
      h: 12 + random(`gh${i}`) * 34,
      c,
      o: 0.25 + random(`go${i}`) * 0.4,
    };
  });
  const sunX = 830;
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      width={W}
      height={H}
    >
      <defs>
        <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e1740" />
          <stop offset="0.45" stopColor="#7a3a63" />
          <stop offset="0.75" stopColor="#e3703f" />
          <stop offset="1" stopColor="#ffd590" />
        </linearGradient>
        <filter id="gBrush" x="-20%" y="-50%" width="140%" height="200%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.18"
            numOctaves="3"
            seed="7"
          />
          <feDisplacementMap in="SourceGraphic" scale="38" />
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <radialGradient id="gSun">
          <stop offset="0" stopColor="#fff6d6" />
          <stop offset="0.25" stopColor="#ffd98a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ff9a4a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect
        x={-600}
        y={-900}
        width={W + 1200}
        height={horizon + 900}
        fill="url(#gSky)"
      />
      <g filter="url(#gBrush)">
        {strokes.map((st, i) => (
          <rect
            key={i}
            x={st.x + Math.sin(frame / 90 + i) * 6}
            y={st.y}
            width={st.w}
            height={st.h}
            rx={st.h / 2}
            fill={st.c}
            opacity={st.o}
          />
        ))}
      </g>
      {/* moon (it's already "raat") */}
      <g transform="translate(930 560)">
        <circle r={80} fill="#fff4d6" opacity={0.12} />
        <circle r={42} fill="#fff1d0" opacity={0.9} />
      </g>
      {/* setting sun, half below the horizon */}
      <circle cx={sunX} cy={horizon - 90} r={600} fill="url(#gSun)" opacity={0.8} />
      <circle cx={sunX} cy={horizon - 90} r={110} fill="#fff1c4" />
      {/* streak clouds, lit from below */}
      <g filter="url(#gBrush)">
        {[
          [-120, horizon - 980, 620, 26],
          [380, horizon - 820, 660, 20],
          [-80, horizon - 640, 560, 18],
          [480, horizon - 470, 520, 14],
          [100, horizon - 300, 420, 10],
        ].map(([x, y, w, h], i) => (
          <g
            key={i}
            transform={`translate(${x + ((frame * (0.25 + i * 0.05)) % 60)} ${y})`}
          >
            <rect
              x={0}
              y={-h}
              width={w}
              height={h * 1.6}
              rx={h}
              fill="#43264d"
              opacity={0.75}
            />
            <rect
              x={20}
              y={h * 0.35}
              width={w - 40}
              height={h * 0.55}
              rx={h * 0.3}
              fill="#ffc46b"
              opacity={0.85}
            />
          </g>
        ))}
      </g>
      {/* birds */}
      {[0, 1, 2].map((i) => {
        const x = -100 + ((frame * (2 + i * 0.3) + i * 180) % (W + 200));
        const y = horizon - 760 + i * 46 + Math.sin(frame / 20 + i) * 10;
        const fl = Math.sin(frame / 3 + i) * 9;
        return (
          <path
            key={i}
            d={`M${x - 20} ${y - fl} Q${x - 9} ${y - 5} ${x} ${y} Q${x + 9} ${y - 5} ${x + 20} ${y - fl}`}
            stroke={SIL}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
      {/* backlit town silhouettes + a few warm windows */}
      {Array.from({ length: 26 }).map((_, i) => {
        const h = 30 + (i % 4) * 18 + random(`th${i}`) * 50;
        return (
          <g key={i}>
            <rect
              x={-200 + i * 60}
              y={horizon - h}
              width={46}
              height={h}
              fill={SIL}
            />
            <rect
              x={-200 + i * 60}
              y={horizon - h}
              width={46}
              height={3}
              fill={RIM}
              opacity={0.7}
            />
          </g>
        );
      })}
      {Array.from({ length: 18 }).map((_, i) => (
        <rect
          key={i}
          x={-160 + random(`wx${i}`) * 1300}
          y={horizon - 14 - random(`wy${i}`) * 40}
          width={7}
          height={7}
          fill="#ffd27a"
          opacity={0.6 + 0.4 * Math.abs(Math.sin(frame / 25 + i))}
        />
      ))}
      {/* ground + glowing horizon line */}
      <rect
        x={-600}
        y={horizon}
        width={W + 1200}
        height={H - horizon + 900}
        fill="#2c160f"
      />
      <rect
        x={-600}
        y={horizon}
        width={W + 1200}
        height={10}
        fill={RIM}
        opacity={0.45}
      />
    </svg>
  );
};

export const NightField: React.FC<{ horizon?: number }> = ({
  horizon = 1500,
}) => {
  const frame = useCurrentFrame();
  const golden = React.useContext(Golden);
  if (golden) return <GoldenSky horizon={horizon} />;
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      width={W}
      height={H}
    >
      <rect
        x={-600}
        y={-900}
        width={W + 1200}
        height={H + 1800}
        fill="#0d1236"
      />
      <rect
        x={-300}
        y={horizon - 500}
        width={W + 600}
        height={500}
        fill="#1c2452"
        opacity={0.6}
      />
      {Array.from({ length: 50 }).map((_, i) => (
        <circle
          key={i}
          cx={random(`s${i}`) * W}
          cy={-400 + random(`t${i}`) * (horizon + 200)}
          r={1.5 + random(`r${i}`) * 3}
          fill="#fff"
          opacity={0.3 + 0.6 * Math.abs(Math.sin(frame / 18 + i))}
        />
      ))}
      <g transform="translate(860 260)">
        <circle r={130} fill="#fff4c2" opacity={0.15} />
        <circle r={80} fill="#fff4c2" stroke={INK} strokeWidth={7} />
        <circle cx={-24} cy={-14} r={14} fill="#efe1a0" />
        <circle cx={22} cy={24} r={10} fill="#efe1a0" />
      </g>
      {/* distant town lights */}
      {Array.from({ length: 26 }).map((_, i) => (
        <rect
          key={i}
          x={-100 + i * 50}
          y={horizon - 20 - (i % 4) * 14 - random(`h${i}`) * 40}
          width={30}
          height={20 + (i % 4) * 14 + random(`h${i}`) * 40}
          fill="#2b2f5c"
        />
      ))}
      {Array.from({ length: 30 }).map((_, i) => (
        <circle
          key={i}
          cx={-80 + random(`lx${i}`) * 1240}
          cy={horizon - 10 - random(`ly${i}`) * 60}
          r={3}
          fill="#ffd27a"
          opacity={0.5 + 0.5 * Math.abs(Math.sin(frame / 25 + i))}
        />
      ))}
      <rect
        x={-600}
        y={horizon}
        width={W + 1200}
        height={H - horizon + 900}
        fill="#1f3a26"
      />
    </svg>
  );
};

/** Full-height side view of the tank (concrete shaft + bowl), with the ledge (chhajja) and two hooks. */
export const TankDiagram: React.FC<{
  glow1?: boolean;
  glow2?: boolean;
  bar?: boolean;
}> = ({ glow1, glow2, bar = true }) => {
  const frame = useCurrentFrame();
  const g = React.useContext(Golden);
  const shaft = g ? SIL : "#8d8f9c";
  const bowl = g ? "#2a1610" : "#a9abb8";
  const line = g ? RIM : INK;
  const pulse = 0.5 + Math.abs(Math.sin(frame / 5)) * 0.5;
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      width={W}
      height={H}
    >
      <rect
        x={-300}
        y={GROUND}
        width={W + 600}
        height={300}
        fill={g ? "#2c160f" : "#1f3a26"}
      />
      {/* shaft */}
      <rect
        x={330}
        y={ROOF + 220}
        width={160}
        height={GROUND - ROOF - 220}
        fill={shaft}
        stroke={line}
        strokeWidth={g ? 3 : 8}
      />
      <rect
        x={420}
        y={ROOF + 220}
        width={70}
        height={GROUND - ROOF - 220}
        fill="#000"
        opacity={0.15}
      />
      {Array.from({ length: 6 }).map((_, i) => (
        <path
          key={i}
          d={`M330 ${ROOF + 360 + i * 140} L490 ${ROOF + 360 + i * 140}`}
          stroke={INK}
          strokeWidth={4}
          opacity={0.35}
        />
      ))}
      {/* tank bowl */}
      <path
        d={`M200 ${ROOF} L600 ${ROOF} L560 ${ROOF + 230} L260 ${ROOF + 230} Z`}
        fill={bowl}
        stroke={line}
        strokeWidth={g ? 3.5 : 9}
        strokeLinejoin="round"
      />
      <path
        d={`M440 ${ROOF} L600 ${ROOF} L560 ${ROOF + 230} L460 ${ROOF + 230} Z`}
        fill="#000"
        opacity={0.14}
      />
      {/* roof railing */}
      <path
        d={`M200 ${ROOF} L200 ${ROOF - 50} L600 ${ROOF - 50} L600 ${ROOF}`}
        fill="none"
        stroke={g ? SIL : INK}
        strokeWidth={7}
      />
      {[260, 330, 400, 470, 540].map((x) => (
        <path
          key={x}
          d={`M${x} ${ROOF} L${x} ${ROOF - 50}`}
          stroke={g ? SIL : INK}
          strokeWidth={4}
        />
      ))}
      {/* ledge (chhajja) */}
      <rect
        x={490}
        y={LEDGE}
        width={130}
        height={24}
        fill={bowl}
        stroke={line}
        strokeWidth={g ? 3 : 7}
      />
      {/* hooks */}
      {[
        [HOOK1, glow1],
        [HOOK2, glow2],
      ].map(([h, g], i) => {
        const [x, y] = h as [number, number];
        return (
          <g key={i}>
            {g && (
              <circle
                cx={x + 10}
                cy={y + 2}
                r={34 * pulse + 10}
                fill="#ffd43b"
                opacity={0.35}
              />
            )}
            <path
              d={`M${x} ${y} q16 0 16 14 q0 14 -12 14`}
              fill="none"
              stroke="#dee2e6"
              strokeWidth={7}
            />
          </g>
        );
      })}
      {bar && (
        <g>
          <path
            d={`M150 ${ROOF} L150 ${GROUND}`}
            stroke="#ffd43b"
            strokeWidth={6}
          />
          <path
            d={`M130 ${ROOF} L170 ${ROOF} M130 ${GROUND} L170 ${GROUND}`}
            stroke="#ffd43b"
            strokeWidth={6}
          />
          <rect
            x={90}
            y={(ROOF + GROUND) / 2 - 30}
            width={120}
            height={56}
            rx={12}
            fill="#ffd43b"
            stroke={INK}
            strokeWidth={5}
          />
          <text
            x={150}
            y={(ROOF + GROUND) / 2 + 10}
            fontSize={30}
            textAnchor="middle"
            fill={INK}
            fontFamily={FONT_FAMILY}
            fontWeight={800}
          >
            120 FT
          </text>
        </g>
      )}
    </svg>
  );
};

/** A hanging rope from (x, y1) to y2, gently swaying. */
export const Rope: React.FC<{
  x: number;
  y1: number;
  y2: number;
  sway?: number;
  color?: string;
}> = ({ x, y1, y2, sway = 1, color = "#d9a066" }) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / 14) * 10 * sway;
  const d = `M${x} ${y1} Q${x + dx} ${(y1 + y2) / 2} ${x + dx * 0.6} ${y2}`;
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={INK}
        strokeWidth={12}
        strokeLinecap="round"
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray="10 6"
      />
    </g>
  );
};

/** Measure bar with a label (red = danger gap, yellow = info). */
export const Measure: React.FC<{
  x: number;
  y1: number;
  y2: number;
  label: string;
  red?: boolean;
}> = ({ x, y1, y2, label, red }) => {
  const c = red ? "#ff6b6b" : "#ffd43b";
  return (
    <g>
      <path
        d={`M${x} ${y1} L${x} ${y2} M${x - 16} ${y1} L${x + 16} ${y1} M${x - 16} ${y2} L${x + 16} ${y2}`}
        stroke={c}
        strokeWidth={6}
      />
      <rect
        x={x + 22}
        y={(y1 + y2) / 2 - 28}
        width={label.length * 20 + 30}
        height={56}
        rx={12}
        fill={c}
        stroke={INK}
        strokeWidth={5}
      />
      <text
        x={x + 37}
        y={(y1 + y2) / 2 + 10}
        fontSize={30}
        fill={red ? "#fff" : INK}
        fontFamily={FONT_FAMILY}
        fontWeight={800}
      >
        {label}
      </text>
    </g>
  );
};

/** Close-up of the tank roof: railing, slab edge, broken ladder top (falls with gravity at `breakAt`). */
export const RoofCloseup: React.FC<{ breakAt?: number }> = ({
  breakAt = 1e9,
}) => {
  const frame = useCurrentFrame();
  const g = React.useContext(Golden);
  const t = Math.max(0, frame - breakAt) / 30;
  const fallY = 0.5 * 3000 * t * t;
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      width={W}
      height={H}
    >
      {/* ladder top (right side) */}
      {fallY < 1400 && (
        <g
          transform={`translate(920 ${1500 + fallY}) rotate(${Math.min(40, t * 120)})`}
        >
          <path
            d="M-50 0 L-50 -260 M50 0 L50 -260"
            stroke="#868e96"
            strokeWidth={14}
          />
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M-50 ${-40 - i * 60} L50 ${-40 - i * 60}`}
              stroke="#868e96"
              strokeWidth={10}
            />
          ))}
        </g>
      )}
      {/* roof slab */}
      <rect
        x={-100}
        y={1720}
        width={W + 200}
        height={60}
        fill={g ? "#2a1610" : "#a9abb8"}
        stroke={g ? RIM : INK}
        strokeWidth={g ? 3.5 : 9}
      />
      <rect
        x={-100}
        y={1780}
        width={W + 200}
        height={300}
        fill={g ? SIL : "#8d8f9c"}
      />
      <path
        d="M-100 1720 L-100 1560 L1180 1560 L1180 1720"
        fill="none"
        stroke={INK}
        strokeWidth={10}
      />
      {Array.from({ length: 9 }).map((_, i) => (
        <path
          key={i}
          d={`M${-40 + i * 150} 1720 L${-40 + i * 150} 1560`}
          stroke={INK}
          strokeWidth={6}
        />
      ))}
      <path
        d="M-100 1600 L1180 1600"
        stroke={INK}
        strokeWidth={5}
        opacity={0.5}
      />
    </svg>
  );
};

/** Coil of rope (inventory). */
export const RopeCoil: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => (
      <ellipse
        key={i}
        cx={0}
        cy={-i * 18}
        rx={90 - i * 8}
        ry={34}
        fill="none"
        stroke={INK}
        strokeWidth={22}
      />
    ))}
    {[0, 1, 2].map((i) => (
      <ellipse
        key={i}
        cx={0}
        cy={-i * 18}
        rx={90 - i * 8}
        ry={34}
        fill="none"
        stroke="#d9a066"
        strokeWidth={13}
        strokeDasharray="10 6"
      />
    ))}
  </g>
);

export const Knife: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
}> = ({ x, y, s = 1, rot = -30 }) => {
  const frame = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path
        d="M0 -14 L140 -14 Q170 0 140 14 L0 14 Z"
        fill="#dee2e6"
        stroke={INK}
        strokeWidth={6}
      />
      <path
        d={`M${40 + ((frame * 6) % 100)} -10 L${60 + ((frame * 6) % 100)} 10`}
        stroke="#fff"
        strokeWidth={6}
        opacity={0.8}
      />
      <rect
        x={-90}
        y={-18}
        width={90}
        height={36}
        rx={10}
        fill="#8a5530"
        stroke={INK}
        strokeWidth={6}
      />
    </g>
  );
};
