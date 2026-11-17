// Places for DinnerSecret: mall atrium, home doorway (morning), park bench with calendar, dinner room + table.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { H, INK, W } from "../../lib/reel";
import { SignText } from "../../lib/world";

/** Bright mall atrium: back shops (far), escalator with moving steps (mid), tiled floor. */
export const Mall: React.FC = () => {
  const frame = useCurrentFrame();
  const shops = [
    { n: "FOOD COURT", c: "#f76707" },
    { n: "GAMES", c: "#7048e8" },
    { n: "SHOES", c: "#1c7ed6" },
    { n: "CAFE", c: "#2f9e44" },
  ];
  return (
    <>
      <rect x={-200} y={0} width={W + 400} height={H} fill="#f1e9dc" />
      {/* skylight */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={-120 + i * 280} y={60} width={220} height={140} fill="#d0ebff" stroke={INK} strokeWidth={7} />
      ))}
      {/* upper floor shops */}
      <rect x={-200} y={640} width={W + 400} height={30} fill="#ced4da" stroke={INK} strokeWidth={7} />
      {shops.map((s, i) => (
        <g key={s.n}>
          <rect x={-150 + i * 320} y={720} width={290} height={400} fill="#fff8ec" stroke={INK} strokeWidth={8} />
          <rect x={-140 + i * 320} y={730} width={270} height={70} rx={10} fill={s.c} stroke={INK} strokeWidth={6} />
          <SignText x={-5 + i * 320} y={780} size={36} text={s.n} />
          <rect x={-120 + i * 320} y={830} width={230} height={290} fill="#d0ebff" stroke={INK} strokeWidth={6} opacity={0.8} />
        </g>
      ))}
      {/* escalator */}
      <g transform="translate(700 1440)">
        <path d="M-60 0 L260 -500 L380 -500 L60 0 Z" fill="#adb5bd" stroke={INK} strokeWidth={9} />
        {Array.from({ length: 9 }).map((_, i) => {
          const t = ((i / 9 + frame / 90) % 1);
          return <path key={i} d={`M${-40 + t * 300} ${-t * 480} l90 0`} stroke="#495057" strokeWidth={8} />;
        })}
        <path d="M-80 -60 L240 -560" stroke={INK} strokeWidth={14} />
      </g>
      {/* floor */}
      <rect x={-200} y={1440} width={W + 400} height={H - 1440} fill="#e9dcc6" />
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={i} d={`M${-200 + i * 180} 1440 L${-400 + i * 230} ${H}`} stroke="#d4c3a6" strokeWidth={5} />
      ))}
      <rect x={-200} y={1440} width={W + 400} height={12} fill={INK} opacity={0.2} />
    </>
  );
};

/** Morning: house front with open door, sunny sky. */
export const HomeFront: React.FC = () => (
  <>
    <rect x={-200} y={0} width={W + 400} height={H} fill="#bfe3ff" />
    <circle cx={880} cy={300} r={90} fill="#ffe066" stroke={INK} strokeWidth={8} />
    <rect x={-200} y={620} width={W + 400} height={880} fill="#ffd8a8" stroke={INK} strokeWidth={9} />
    <path d="M-220 640 L540 380 L1300 640 Z" fill="#c92a2a" stroke={INK} strokeWidth={10} />
    <rect x={380} y={980} width={300} height={520} fill="#6b3f22" stroke={INK} strokeWidth={9} />
    <rect x={400} y={1000} width={260} height={500} fill="#2b2b33" />
    <rect x={60} y={880} width={220} height={200} fill="#d0ebff" stroke={INK} strokeWidth={8} />
    <rect x={800} y={880} width={220} height={200} fill="#d0ebff" stroke={INK} strokeWidth={8} />
    <rect x={-200} y={1500} width={W + 400} height={H} fill="#9ccf6b" />
    <rect x={-200} y={1500} width={W + 400} height={14} fill={INK} opacity={0.25} />
  </>
);

/** Park with a bench and a tear-off calendar losing pages from `tearAt`. */
export const ParkBench: React.FC<{ tearAt: number }> = ({ tearAt }) => {
  const frame = useCurrentFrame();
  const months = ["SEP", "OCT", "NOV"];
  return (
    <>
      <rect x={-200} y={0} width={W + 400} height={H} fill="#a5d8ff" />
      {[120, 420, 820].map((x, i) => (
        <g key={i}>
          <rect x={x - 16} y={900} width={32} height={500} fill="#8a5a3b" stroke={INK} strokeWidth={7} />
          <circle cx={x} cy={850} r={150} fill={i % 2 ? "#51cf66" : "#40c057"} stroke={INK} strokeWidth={8} />
        </g>
      ))}
      <rect x={-200} y={1400} width={W + 400} height={H} fill="#82c91e" />
      <rect x={-200} y={1400} width={W + 400} height={14} fill={INK} opacity={0.25} />
      {/* bench */}
      <rect x={300} y={1500} width={560} height={40} rx={10} fill="#a0663f" stroke={INK} strokeWidth={8} />
      <rect x={300} y={1420} width={560} height={30} rx={10} fill="#a0663f" stroke={INK} strokeWidth={8} />
      <path d="M340 1540 L340 1640 M820 1540 L820 1640" stroke={INK} strokeWidth={14} />
      {/* cardboard box of desk things */}
      <g transform="translate(240 1600)">
        <rect x={-90} y={-110} width={180} height={110} fill="#d9a066" stroke={INK} strokeWidth={8} />
        <rect x={-50} y={-160} width={30} height={60} fill="#4dabf7" stroke={INK} strokeWidth={5} />
        <circle cx={40} cy={-130} r={26} fill="#69db7c" stroke={INK} strokeWidth={5} />
      </g>
      {/* calendar */}
      <g transform="translate(870 860)">
        <rect x={-150} y={-180} width={300} height={320} rx={16} fill="#fff" stroke={INK} strokeWidth={9} />
        <rect x={-150} y={-180} width={300} height={80} rx={16} fill="#e03131" stroke={INK} strokeWidth={9} />
        {months.map((m, i) => {
          const t = frame - (tearAt + i * 6);
          const shown = i === months.length - 1 || t < 0;
          const fly = t > 0 && i < months.length - 1 ? t : 0;
          if (!shown && fly > 30) return null;
          return (
            <g key={m} transform={`translate(${fly * 18} ${fly * 22 + fly * fly * 0.8}) rotate(${fly * 9})`} opacity={i === months.length - 1 || t < 30 ? 1 : 0}>
              <rect x={-140} y={-96} width={280} height={226} fill="#fffdf5" stroke={INK} strokeWidth={6} />
              <SignText x={0} y={40} size={90} text={m} fill={INK} stroke="#fffdf5" />
            </g>
          );
        })}
      </g>
    </>
  );
};

/** Dinner room behind the table (far layer). */
export const DinnerRoom: React.FC<{ dim?: number }> = ({ dim = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <rect x={-200} y={0} width={W + 400} height={H} fill="#c8935f" />
      <rect x={-200} y={0} width={W + 400} height={H} fill="#000" opacity={dim} />
      {[
        [80, 640, 170, 210],
        [820, 600, 170, 230],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={i ? "#a5d8ff" : "#ffd8a8"} stroke={INK} strokeWidth={9} />
      ))}
      <rect x={380} y={640} width={320} height={260} fill="#1c2452" stroke={INK} strokeWidth={9} />
      <path d="M540 640 L540 900 M380 770 L700 770" stroke={INK} strokeWidth={8} />
      {/* hanging lamp */}
      <path d={`M540 0 L540 ${880 + Math.sin(frame / 25) * 4}`} stroke={INK} strokeWidth={6} />
      <g transform={`translate(540 ${900 + Math.sin(frame / 25) * 4})`}>
        <path d="M-120 60 L-60 -20 L60 -20 L120 60 Z" fill="#ffd43b" stroke={INK} strokeWidth={8} />
        <path d="M-120 60 L-420 900 L420 900 L120 60 Z" fill="#fff3bf" opacity={0.18} />
      </g>
    </>
  );
};

/** Front of the dinner table with plates, covering the diners' bodies (foreground layer). */
export const DinnerTable: React.FC<{ y?: number }> = ({ y = 1440 }) => {
  const frame = useCurrentFrame();
  const plates = [150, 400, 680, 930];
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <rect x={-700} y={y} width={W + 1400} height={H - y + 600} fill="#f8f0e3" stroke={INK} strokeWidth={10} />
      <rect x={-700} y={y + 120} width={W + 1400} height={H - y + 600} fill="#e9dcc6" stroke={INK} strokeWidth={8} />
      {plates.map((x, i) => (
        <g key={x}>
          <ellipse cx={x} cy={y + 60} rx={95} ry={30} fill="#fff" stroke={INK} strokeWidth={7} />
          <ellipse cx={x} cy={y + 56} rx={55} ry={16} fill={["#f59f00", "#e8590c", "#82c91e", "#f59f00"][i]} />
        </g>
      ))}
      {/* steam from the dal bowl */}
      {[0, 1, 2].map((i) => {
        const t = ((frame + i * 14) % 42) / 42;
        return <path key={i} d={`M${520 + i * 30} ${y + 20 - t * 120} q14 -20 0 -40`} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.7 * (1 - t)} />;
      })}
    </svg>
  );
};

/** Lines between two eyes meeting ("nazrein mili"). */
export const EyeZap: React.FC<{ at: number; x1: number; x2: number; y: number }> = ({ at, x1, x2, y }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  const grow = interpolate(t, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const mid = (x1 + x2) / 2;
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <path
          d={`M${mid - ((mid - x1) * grow)} ${y} L${mid - 20} ${y - 30} L${mid + 20} ${y + 20} L${mid + (x2 - mid) * grow} ${y}`}
          fill="none"
          stroke="#ffe066"
          strokeWidth={12}
          strokeLinejoin="round"
          opacity={0.6 + Math.sin(frame / 2) * 0.4}
        />
      </svg>
    </AbsoluteFill>
  );
};
