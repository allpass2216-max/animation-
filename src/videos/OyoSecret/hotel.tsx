// Hotel lobby for OyoSecret: generic neon "ROOMS 24x7" sign (no brand logo), key rack, plant, and a reception counter
// that sits in FRONT of the receptionist (foreground), with a desk bell that dings.
import React from "react";
import { useCurrentFrame } from "remotion";
import { H, INK, W } from "../../lib/reel";
import { SignText } from "../../lib/world";

export const HotelLobby: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = frame % 47 >= 20 && frame % 47 < 23 ? 0.35 : 1; // neon flickers now and then (never on frame 0)
  return (
    <>
      <rect x={-200} y={0} width={W + 400} height={H} fill="#2b1838" />
      {/* wallpaper stripes */}
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={-200 + i * 110} y={0} width={50} height={1450} fill="#341d45" />
      ))}
      {/* neon sign */}
      <g opacity={flicker}>
        <rect x={300} y={560} width={480} height={150} rx={26} fill="none" stroke="#ff2d55" strokeWidth={10} />
        <rect x={300} y={560} width={480} height={150} rx={26} fill="#ff2d55" opacity={0.12} />
        <SignText x={540} y={660} size={76} text="ROOMS 24x7" fill="#ffd6e0" stroke="#ff2d55" />
      </g>
      <ellipse cx={540} cy={640} rx={380} ry={150} fill="#ff2d55" opacity={0.08 * flicker} />
      {/* key rack */}
      <g transform="translate(730 820)">
        <rect x={0} y={0} width={260} height={220} rx={12} fill="#6b3f22" stroke={INK} strokeWidth={8} />
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} transform={`translate(${36 + (i % 4) * 62} ${40 + Math.floor(i / 4) * 100}) rotate(${Math.sin(frame / 14 + i) * 6})`}>
            <circle r={8} fill="#ffd43b" stroke={INK} strokeWidth={4} />
            <rect x={-12} y={10} width={24} height={44} rx={5} fill="#e03131" stroke={INK} strokeWidth={4} />
          </g>
        ))}
      </g>
      {/* clock 10:00 */}
      <g transform="translate(160 800)">
        <circle r={70} fill="#fffaf0" stroke={INK} strokeWidth={8} />
        <path d="M0 0 L-34 -20 M0 0 L0 -54" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <circle r={7} fill={INK} />
      </g>
      {/* floor */}
      <rect x={-200} y={1450} width={W + 400} height={H - 1450} fill="#5c3d2e" />
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d={`M${-200 + i * 200} 1450 L${-300 + i * 230} ${H}`} stroke="#4a3125" strokeWidth={6} />
      ))}
      <rect x={-200} y={1450} width={W + 400} height={14} fill={INK} opacity={0.3} />
    </>
  );
};

/** Reception counter in front of the receptionist; the bell dings (jumps) at `dingAt`. */
export const Counter: React.FC<{ x?: number; dingAt?: number }> = ({ x = 600, dingAt = -100 }) => {
  const frame = useCurrentFrame();
  const t = frame - dingAt;
  const ding = t >= 0 && t < 10 ? Math.sin((t / 10) * Math.PI) * 18 : 0;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <rect x={x} y={1420} width={W - x + 300} height={360} fill="#8a5530" stroke={INK} strokeWidth={10} />
      <rect x={x - 20} y={1390} width={W - x + 320} height={50} rx={10} fill="#a0663f" stroke={INK} strokeWidth={9} />
      <rect x={x + 40} y={1480} width={300} height={70} rx={10} fill="#e03131" stroke={INK} strokeWidth={7} />
      <SignText x={x + 190} y={1530} size={40} text="RECEPTION" />
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
