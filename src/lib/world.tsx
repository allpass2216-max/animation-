// World pieces for ShopSpot: layered backgrounds (far / mid / fore), landmarks, props.
import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "./fonts";
import { H, INK, W } from "./reel";

/** Parallax layer: drifts sideways at a speed proportional to its depth during the scene. */
export const Layer: React.FC<{ depth: number; from: number; drift?: number; blur?: number; children: React.ReactNode }> = ({
  depth,
  from,
  drift = -0.9,
  blur = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const x = (frame - from) * drift * depth;
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}px)`, filter: blur ? `blur(${blur}px)` : undefined }}>
      <svg width={W + 400} height={H} style={{ position: "absolute", left: -200, top: 0, overflow: "visible" }} viewBox={`-200 0 ${W + 400} ${H}`}>
        {children}
      </svg>
    </AbsoluteFill>
  );
};

export const SignText: React.FC<{ x: number; y: number; size: number; text: string; fill?: string; stroke?: string }> = ({
  x,
  y,
  size,
  text,
  fill = "#fff",
  stroke = INK,
}) => (
  <text
    x={x}
    y={y}
    fontFamily={FONT_FAMILY}
    fontWeight={800}
    fontSize={size}
    textAnchor="middle"
    fill={fill}
    stroke={stroke}
    strokeWidth={size * 0.14}
    paintOrder="stroke"
    style={{ letterSpacing: 1 }}
  >
    {text}
  </text>
);

export const Sky: React.FC<{ top: string; bottom: string }> = ({ top, bottom }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${top} 0%, ${bottom} 70%)` }} />
);

/** Far city skyline, soft and low contrast. */
export const FarCity: React.FC<{ seed: string; color: string; baseY?: number }> = ({ seed, color, baseY = 1180 }) => (
  <>
    {Array.from({ length: 12 }).map((_, i) => {
      const w = 110 + random(`${seed}w${i}`) * 90;
      const h = 260 + random(`${seed}h${i}`) * 380;
      const x = -200 + i * 130;
      return (
        <g key={i}>
          <rect x={x} y={baseY - h} width={w} height={h} fill={color} opacity={0.55} />
          {Array.from({ length: Math.floor(h / 70) }).map((__, r) => (
            <rect key={r} x={x + 18} y={baseY - h + 24 + r * 70} width={w - 36} height={22} fill="#fff" opacity={0.18} />
          ))}
        </g>
      );
    })}
    {/* clouds */}
    {[0, 1, 2].map((i) => (
      <g key={i} opacity={0.8} transform={`translate(${100 + i * 380} ${220 + (i % 2) * 120})`}>
        <ellipse cx={0} cy={0} rx={120} ry={42} fill="#fff" />
        <ellipse cx={60} cy={-26} rx={70} ry={46} fill="#fff" />
        <ellipse cx={-50} cy={-14} rx={60} ry={36} fill="#fff" />
      </g>
    ))}
  </>
);

/** Ground: road + pavement. */
export const Ground: React.FC<{ road?: boolean; color?: string }> = ({ road = true, color = "#cdb89a" }) => (
  <>
    <rect x={-200} y={1180} width={W + 400} height={H - 1180} fill={color} />
    <rect x={-200} y={1180} width={W + 400} height={18} fill={INK} opacity={0.25} />
    {road && (
      <>
        <rect x={-200} y={1290} width={W + 400} height={250} fill="#5d5a66" />
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={-180 + i * 170} y={1405} width={90} height={16} rx={8} fill="#f3e9c9" opacity={0.8} />
        ))}
        <rect x={-200} y={1540} width={W + 400} height={22} fill="#a8957a" />
      </>
    )}
  </>
);

/** Auto-rickshaw driving across (mid layer). */
export const Auto: React.FC<{ y: number; speed: number; start: number; color?: string; flip?: boolean }> = ({
  y,
  speed,
  start,
  color = "#F4C430",
  flip,
}) => {
  const frame = useCurrentFrame();
  const span = W + 900;
  const x = (((start + frame * speed) % span) + span) % span - 450;
  const wheel = (frame * speed * 3) % 360;
  const bounce = Math.abs(Math.sin(frame / 3)) * 4;
  return (
    <g transform={`translate(${x} ${y - bounce}) scale(${flip ? -1 : 1} 1)`}>
      <path d="M-150 -40 Q-150 -190 -20 -200 L90 -200 Q150 -190 150 -120 L150 -40 Z" fill={color} stroke={INK} strokeWidth={9} />
      <path d="M-150 -120 L150 -120" stroke={INK} strokeWidth={7} />
      <path d="M-160 -200 Q0 -250 160 -200 L150 -170 L-150 -170 Z" fill="#2f6b3a" stroke={INK} strokeWidth={9} />
      <rect x={-110} y={-160} width={90} height={60} rx={10} fill="#bfe6ff" stroke={INK} strokeWidth={7} />
      {[-95, 105].map((wx) => (
        <g key={wx} transform={`translate(${wx} -30) rotate(${wheel})`}>
          <circle r={36} fill="#2b2b33" stroke={INK} strokeWidth={8} />
          <path d="M-20 0 L20 0 M0 -20 L0 20" stroke="#aaa" strokeWidth={6} />
        </g>
      ))}
    </g>
  );
};

/** Building with an awning shop front and a sign. */
export const Building: React.FC<{
  x: number;
  w: number;
  h: number;
  color: string;
  sign?: string;
  signColor?: string;
  awning?: string;
  baseY?: number;
  windows?: boolean;
}> = ({ x, w, h, color, sign, signColor = "#2f4bb7", awning, baseY = 1190, windows = true }) => (
  <g>
    <rect x={x} y={baseY - h} width={w} height={h} fill={color} stroke={INK} strokeWidth={10} />
    {windows &&
      Array.from({ length: Math.floor((h - 300) / 150) }).map((_, r) =>
        Array.from({ length: Math.max(1, Math.floor(w / 150)) }).map((__, c) => (
          <rect
            key={`${r}-${c}`}
            x={x + 30 + c * ((w - 60) / Math.max(1, Math.floor(w / 150)))}
            y={baseY - h + 40 + r * 150}
            width={90}
            height={90}
            rx={8}
            fill="#bfe6ff"
            stroke={INK}
            strokeWidth={7}
          />
        )),
      )}
    {awning && (
      <path
        d={`M${x - 20} ${baseY - 280} L${x + w + 20} ${baseY - 280} L${x + w} ${baseY - 210} L${x} ${baseY - 210} Z`}
        fill={awning}
        stroke={INK}
        strokeWidth={9}
      />
    )}
    {sign && (
      <g>
        <rect x={x + 20} y={baseY - 380} width={w - 40} height={90} rx={14} fill={signColor} stroke={INK} strokeWidth={9} />
        <SignText x={x + w / 2} y={baseY - 316} size={Math.min(58, ((w - 70) / sign.length) * 1.6)} text={sign} />
      </g>
    )}
    <rect x={x + w / 2 - 70} y={baseY - 200} width={140} height={200} fill="#6b4a3a" stroke={INK} strokeWidth={9} />
  </g>
);

/** Street stall with a counter and a sign. */
export const Stall: React.FC<{ x: number; y: number; sign: string; color: string; item: "pills" | "chai" | "pens" | "xerox" }> = ({
  x,
  y,
  sign,
  color,
  item,
}) => {
  const frame = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-170} y={-360} width={20} height={360} fill="#8a6a4a" stroke={INK} strokeWidth={6} />
      <rect x={150} y={-360} width={20} height={360} fill="#8a6a4a" stroke={INK} strokeWidth={6} />
      <path d="M-210 -360 L210 -360 L190 -290 L-190 -290 Z" fill={color} stroke={INK} strokeWidth={9} />
      {[-150, -75, 0, 75, 150].map((sx, i) => (
        <path key={sx} d={`M${sx - 37} -290 Q${sx} -255 ${sx + 37} -290`} fill={i % 2 ? "#fff" : color} stroke={INK} strokeWidth={6} />
      ))}
      <rect x={-130} y={-440} width={260} height={80} rx={12} fill="#fff7d6" stroke={INK} strokeWidth={8} />
      <SignText x={0} y={-384} size={46} text={sign} fill={INK} stroke="#fff7d6" />
      <rect x={-190} y={-150} width={380} height={150} fill="#c98a4b" stroke={INK} strokeWidth={9} />
      <rect x={-200} y={-170} width={400} height={30} rx={6} fill="#e0a663" stroke={INK} strokeWidth={8} />
      {item === "pills" &&
        [-120, -50, 20, 90].map((px, i) => (
          <g key={px} transform={`translate(${px} -200)`}>
            <rect x={-26} y={-30} width={52} height={60} rx={8} fill={["#fff", "#ffd6e0", "#d6f0ff", "#fff"][i]} stroke={INK} strokeWidth={6} />
            <path d="M-8 0 L8 0 M0 -8 L0 8" stroke="#e23b3b" strokeWidth={6} />
          </g>
        ))}
      {item === "chai" && (
        <g transform="translate(-40 -175)">
          <path d="M-60 -70 L60 -70 L50 0 L-50 0 Z" fill="#b7b7c4" stroke={INK} strokeWidth={8} />
          <path d="M60 -50 Q100 -60 110 -90" fill="none" stroke={INK} strokeWidth={10} />
          {[0, 1, 2].map((i) => {
            const t = ((frame + i * 12) % 36) / 36;
            return (
              <path
                key={i}
                d={`M${-20 + i * 20} ${-90 - t * 120} q 14 -20 0 -40`}
                fill="none"
                stroke="#fff"
                strokeWidth={10}
                strokeLinecap="round"
                opacity={0.8 * (1 - t)}
              />
            );
          })}
          {[90, 140].map((cx) => (
            <path key={cx} d={`M${cx - 18} -40 L${cx + 18} -40 L${cx + 12} 0 L${cx - 12} 0 Z`} fill="#f5e6c8" stroke={INK} strokeWidth={6} />
          ))}
        </g>
      )}
      {item === "pens" &&
        [-130, -90, -50, -10, 30, 70, 110].map((px, i) => (
          <rect
            key={px}
            x={px}
            y={-250}
            width={22}
            height={90}
            rx={8}
            fill={["#2f6bff", "#e23b3b", "#2fb36b", "#ffb400"][i % 4]}
            stroke={INK}
            strokeWidth={5}
            transform={`rotate(${(i - 3) * 6} ${px + 11} -160)`}
          />
        ))}
      {item === "xerox" && <XeroxMachine x={0} y={-170} s={0.55} />}
    </g>
  );
};

export const XeroxMachine: React.FC<{ x: number; y: number; s?: number; printAt?: number }> = ({ x, y, s = 1, printAt }) => {
  const frame = useCurrentFrame();
  const t = printAt === undefined ? -1 : frame - printAt;
  const glow = t >= 0 && t < 30 ? 0.6 + Math.sin(t / 2) * 0.4 : 0.15;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-180} y={-260} width={360} height={260} rx={20} fill="#e3e6ee" stroke={INK} strokeWidth={10} />
      <rect x={-200} y={-300} width={400} height={56} rx={14} fill="#c9cdd9" stroke={INK} strokeWidth={10} />
      <rect x={-150} y={-220} width={150} height={30} rx={8} fill={`rgba(120,255,160,${glow})`} stroke={INK} strokeWidth={6} />
      <rect x={-210} y={-150} width={110} height={24} rx={6} fill="#fff" stroke={INK} strokeWidth={6} />
      <circle cx={110} cy={-205} r={18} fill="#ff5a5a" stroke={INK} strokeWidth={6} />
      <circle cx={60} cy={-205} r={18} fill="#4fd17a" stroke={INK} strokeWidth={6} />
    </g>
  );
};

/** Paper sheets shot out of the machine, flying under gravity and fluttering down. */
export const FlyingPapers: React.FC<{ at: number; x: number; y: number; floorY: number }> = ({ at, x, y, floorY }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / 30;
  if (t < 0) return null;
  return (
    <>
      {[0, 1, 2, 3].map((i) => {
        const tt = t - i * 0.08;
        if (tt < 0) return null;
        const vx = -380 - i * 90;
        const vy = -900 + i * 120;
        const g = 2600;
        const drag = Math.min(1, tt * 1.2);
        let px = x + vx * tt;
        let py = y + vy * tt + 0.5 * g * tt * tt;
        if (vy + g * tt > 220) {
          // terminal flutter
          const tc = (220 - vy) / g;
          px = x + vx * tc + -60 * (tt - tc) + Math.sin(tt * 9 + i) * 30;
          py = y + vy * tc + 0.5 * g * tc * tc + 220 * (tt - tc);
        }
        py = Math.min(py, floorY - i * 4);
        const rot = (tt * 300 + i * 40) * (1 - drag * 0.5) + Math.sin(tt * 8) * 20;
        return (
          <g key={i} transform={`translate(${px} ${py}) rotate(${py >= floorY - i * 4 ? 80 + i * 5 : rot})`}>
            <rect x={-40} y={-52} width={80} height={104} fill="#fff" stroke={INK} strokeWidth={6} />
            <path d="M-24 -30 L24 -30 M-24 -10 L24 -10 M-24 10 L14 10" stroke="#8a8aa0" strokeWidth={5} />
          </g>
        );
      })}
    </>
  );
};

/** Foreground bokeh plant / pole at the frame edge, blurred, for depth. */
export const Foreground: React.FC<{ side: "left" | "right"; kind: "plant" | "pole" }> = ({ side, kind }) => {
  const frame = useCurrentFrame();
  const sx = side === "left" ? -60 : W + 60;
  const sway = Math.sin(frame / 20) * 4;
  return (
    <AbsoluteFill style={{ filter: "blur(5px)", pointerEvents: "none" }}>
      <svg width={W} height={H}>
        {kind === "plant" ? (
          <g transform={`translate(${sx} ${H - 120}) rotate(${sway})`}>
            {[-60, -20, 20, 60, 0].map((a, i) => (
              <ellipse key={i} cx={0} cy={-200} rx={46} ry={190} fill={i % 2 ? "#2f7a43" : "#3c9a54"} stroke={INK} strokeWidth={8} transform={`rotate(${a} 0 0)`} />
            ))}
            <rect x={-120} y={-30} width={240} height={160} rx={20} fill="#b0583a" stroke={INK} strokeWidth={10} />
          </g>
        ) : (
          <g transform={`translate(${sx} 0)`}>
            <rect x={-40} y={300} width={80} height={H} fill="#3d4352" stroke={INK} strokeWidth={10} />
            <rect x={-70} y={900} width={140} height={60} rx={10} fill="#4d5466" stroke={INK} strokeWidth={8} />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

/** Signpost with four arrow boards (A-D style question). */
export const Signpost: React.FC<{ x: number; y: number; wobbleAt?: number }> = ({ x, y, wobbleAt = 0 }) => {
  const frame = useCurrentFrame();
  const t = frame - wobbleAt;
  const wob = t >= 0 && t < 30 ? Math.sin(t / 2) * 8 * (1 - t / 30) : 0;
  const boards = [
    { a: -14, c: "#ff6b6b", dy: -520 },
    { a: 12, c: "#4dabf7", dy: -420 },
    { a: -8, c: "#51cf66", dy: -320 },
    { a: 16, c: "#fcc419", dy: -220 },
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${wob})`}>
      <rect x={-18} y={-600} width={36} height={600} fill="#8a6a4a" stroke={INK} strokeWidth={8} />
      {boards.map((b, i) => (
        <g key={i} transform={`translate(0 ${b.dy}) rotate(${b.a + Math.sin((frame + i * 10) / 18) * 2})`}>
          <path
            d={i % 2 ? "M-10 -36 L170 -36 L210 0 L170 36 L-10 36 Z" : "M10 -36 L-170 -36 L-210 0 L-170 36 L10 36 Z"}
            fill={b.c}
            stroke={INK}
            strokeWidth={8}
          />
          <SignText x={i % 2 ? 90 : -90} y={18} size={52} text="?" />
        </g>
      ))}
    </g>
  );
};

/** Flash overlay (camera flash). */
export const Flash: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 6) return null;
  return <AbsoluteFill style={{ background: "#fff", opacity: 0.85 * (1 - t / 6) }} />;
};

/** Rotating rays background for the re-hook. */
export const Rays: React.FC<{ c1: string; c2: string }> = ({ c1, c2 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: c1, overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`}>
        <g transform={`rotate(${frame * 0.6})`}>
          {Array.from({ length: 16 }).map((_, i) => (
            <path key={i} d="M0 0 L-180 -1500 L180 -1500 Z" fill={c2} transform={`rotate(${i * 22.5})`} opacity={0.55} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
