// Places for DinnerSecret: mall atrium, home doorway (morning), park bench with calendar, dinner room + table.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { H, INK, W } from "./reel";
import { SignText } from "./world";

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

/** House front with open door: sunny morning, or `night` (dark sky, moon, stars, warm lit windows and door). */
export const HomeFront: React.FC<{ night?: boolean }> = ({ night }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <rect x={-200} y={0} width={W + 400} height={H} fill={night ? "#0d0a24" : "#bfe3ff"} />
      {night && Array.from({ length: 30 }).map((_, i) => (
        <circle key={i} cx={-150 + ((i * 137) % 1380)} cy={40 + ((i * 89) % 520)} r={2 + (i % 3)} fill="#fff" opacity={0.4 + 0.5 * Math.abs(Math.sin(frame / 20 + i))} />
      ))}
      {night ? (
        <g transform="translate(880 300)">
          <circle r={120} fill="#fff4c2" opacity={0.18} />
          <circle r={80} fill="#fff4c2" stroke={INK} strokeWidth={8} />
        </g>
      ) : (
        <circle cx={880} cy={300} r={90} fill="#ffe066" stroke={INK} strokeWidth={8} />
      )}
      <rect x={-200} y={620} width={W + 400} height={880} fill={night ? "#4a3560" : "#ffd8a8"} stroke={INK} strokeWidth={9} />
      <path d="M-220 640 L540 380 L1300 640 Z" fill={night ? "#6b1f3a" : "#c92a2a"} stroke={INK} strokeWidth={10} />
      <rect x={380} y={980} width={300} height={520} fill="#6b3f22" stroke={INK} strokeWidth={9} />
      <rect x={400} y={1000} width={260} height={500} fill={night ? "#ffcf6e" : "#2b2b33"} />
      <rect x={60} y={880} width={220} height={200} fill={night ? "#ffd27a" : "#d0ebff"} stroke={INK} strokeWidth={8} />
      <rect x={800} y={880} width={220} height={200} fill={night ? "#ffd27a" : "#d0ebff"} stroke={INK} strokeWidth={8} />
      {night && <ellipse cx={530} cy={1500} rx={360} ry={70} fill="#ffcf6e" opacity={0.25} style={{ filter: "blur(30px)" }} />}
      <rect x={-200} y={1500} width={W + 400} height={H} fill={night ? "#26402a" : "#9ccf6b"} />
      <rect x={-200} y={1500} width={W + 400} height={14} fill={INK} opacity={0.25} />
    </>
  );
};

/** Park with a bench and a tear-off calendar losing pages from `tearAt`. */
export const ParkBench: React.FC<{ tearAt: number; night?: boolean }> = ({ tearAt, night }) => {
  const frame = useCurrentFrame();
  const months = ["SEP", "OCT", "NOV"];
  return (
    <>
      <rect x={-200} y={0} width={W + 400} height={H} fill={night ? "#0d0a24" : "#a5d8ff"} />
      {night && Array.from({ length: 30 }).map((_, i) => (
        <circle key={i} cx={-150 + ((i * 137) % 1380)} cy={40 + ((i * 89) % 520)} r={2 + (i % 3)} fill="#fff" opacity={0.4 + 0.5 * Math.abs(Math.sin(frame / 20 + i))} />
      ))}
      {[120, 420, 820].map((x, i) => (
        <g key={i}>
          <rect x={x - 16} y={900} width={32} height={500} fill={night ? "#4a3326" : "#8a5a3b"} stroke={INK} strokeWidth={7} />
          <circle cx={x} cy={850} r={150} fill={night ? (i % 2 ? "#1f4d2c" : "#1a4326") : i % 2 ? "#51cf66" : "#40c057"} stroke={INK} strokeWidth={8} />
        </g>
      ))}
      {night && (
        <g>
          <path d="M610 560 L420 1420 L820 1420 Z" fill="#fff3bf" opacity={0.18} />
          <rect x={596} y={520} width={28} height={900} fill="#495057" stroke={INK} strokeWidth={7} />
          <path d="M560 540 L660 540 L640 580 L580 580 Z" fill="#fff3bf" stroke={INK} strokeWidth={6} />
        </g>
      )}
      <rect x={-200} y={1400} width={W + 400} height={H} fill={night ? "#244a1f" : "#82c91e"} />
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
export const DinnerRoom: React.FC<{ dim?: number; night?: boolean }> = ({ dim = 0, night }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <rect x={-200} y={0} width={W + 400} height={H} fill={night ? "#3a2440" : "#c8935f"} />
      {night && (
        <g opacity={0.5}>
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={-180 + i * 190} y={0} width={70} height={H} fill="#43294b" />
          ))}
        </g>
      )}
      <rect x={-200} y={0} width={W + 400} height={H} fill="#000" opacity={dim} />
      {[
        [80, 640, 170, 210],
        [820, 600, 170, 230],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={night ? (i ? "#5f3dc4" : "#c2255c") : i ? "#a5d8ff" : "#ffd8a8"} stroke={INK} strokeWidth={9} />
      ))}
      <rect x={380} y={640} width={320} height={260} fill="#0d0a24" stroke={INK} strokeWidth={9} />
      {night && <circle cx={630} cy={700} r={30} fill="#fff4c2" />}
      <path d="M540 640 L540 900 M380 770 L700 770" stroke={INK} strokeWidth={8} />
      {/* hanging lamp */}
      <path d={`M540 0 L540 ${880 + Math.sin(frame / 25) * 4}`} stroke={INK} strokeWidth={6} />
      <g transform={`translate(540 ${900 + Math.sin(frame / 25) * 4})`}>
        <path d="M-120 60 L-60 -20 L60 -20 L120 60 Z" fill="#ffd43b" stroke={INK} strokeWidth={8} />
        <path d="M-120 60 L-420 900 L420 900 L120 60 Z" fill="#fff3bf" opacity={night ? 0.26 : 0.18} />
        {night && <ellipse cx={0} cy={60} rx={200} ry={80} fill="#ffd43b" opacity={0.3} style={{ filter: "blur(30px)" }} />}
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

/** Street outside: COACHING building on the left, CITY MALL entrance with sliding glass doors on the right. */
export const MallEntrance: React.FC<{ doorsAt: number }> = ({ doorsAt }) => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [doorsAt, doorsAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <rect x={-200} y={0} width={W + 400} height={H} fill="#9fd4ff" />
      {[0, 1].map((i) => (
        <g key={i} opacity={0.85} transform={`translate(${200 + i * 520} ${200 + i * 60})`}>
          <ellipse cx={0} cy={0} rx={110} ry={38} fill="#fff" />
          <ellipse cx={50} cy={-24} rx={60} ry={40} fill="#fff" />
        </g>
      ))}
      {/* coaching building (left) */}
      <rect x={-200} y={560} width={640} height={940} fill="#adb5bd" stroke={INK} strokeWidth={10} />
      <rect x={20} y={600} width={400} height={110} rx={14} fill="#1971c2" stroke={INK} strokeWidth={9} />
      <SignText x={220} y={680} size={64} text="COACHING" />
      {[0, 1].map((r) =>
        [0, 1].map((c) => <rect key={`${r}${c}`} x={60 + c * 200} y={780 + r * 170} width={130} height={120} rx={8} fill="#e7f5ff" stroke={INK} strokeWidth={7} />),
      )}
      <rect x={140} y={1180} width={170} height={320} fill="#5c636a" stroke={INK} strokeWidth={9} />
      {/* mall facade (right) */}
      <rect x={480} y={480} width={800} height={1020} fill="#f3d9fa" stroke={INK} strokeWidth={10} />
      <rect x={530} y={520} width={480} height={130} rx={18} fill="#c2255c" stroke={INK} strokeWidth={9} />
      <SignText x={770} y={612} size={74} text="CITY MALL" />
      {[0, 1].map((c) => (
        <rect key={c} x={560 + c * 230} y={700} width={190} height={300} rx={10} fill="#d0ebff" stroke={INK} strokeWidth={7} />
      ))}
      {/* sliding glass doors */}
      <rect x={560} y={1080} width={400} height={420} fill="#fff3bf" stroke={INK} strokeWidth={9} />
      <rect x={560 - open * 190} y={1080} width={200} height={420} fill="#a5d8ff" stroke={INK} strokeWidth={8} opacity={0.9} />
      <rect x={760 + open * 190} y={1080} width={200} height={420} fill="#a5d8ff" stroke={INK} strokeWidth={8} opacity={0.9} />
      {/* pavement */}
      <rect x={-200} y={1500} width={W + 400} height={H - 1500} fill="#ced4da" />
      <rect x={-200} y={1500} width={W + 400} height={14} fill={INK} opacity={0.25} />
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d={`M${-200 + i * 200} 1500 L${-260 + i * 220} ${H}`} stroke="#adb5bd" strokeWidth={5} />
      ))}
    </>
  );
};

/** A proper dining table seen slightly from above: wooden top in perspective with a runner, plates with food, a dal bowl
 *  with steam, roti basket, glasses; a tablecloth hangs to the floor with a scalloped hem (hides the diners' legs). */
export const DinnerTableNice: React.FC<{ y?: number; night?: boolean }> = ({ y = 1440, night }) => {
  const frame = useCurrentFrame();
  const plates = [150, 400, 680, 930];
  const foods = ["#f59f00", "#e8590c", "#82c91e", "#f59f00"];
  const front = y + 150;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      {/* floor under the table */}
      <rect x={-700} y={front + 280} width={W + 1400} height={900} fill={night ? "#2a1a2e" : "#8a5a3b"} />
      {/* hanging cloth with scalloped hem */}
      <path
        d={`M-700 ${front} L${W + 700} ${front} L${W + 700} ${front + 260} ${Array.from({ length: 22 })
          .map((_, i) => `Q${W + 700 - i * 110 - 55} ${front + 300} ${W + 700 - (i + 1) * 110} ${front + 260}`)
          .join(" ")} Z`}
        fill={night ? "#e9dcc6" : "#f8f0e3"}
        stroke={INK}
        strokeWidth={9}
      />
      {[-80, 260, 600, 940].map((x) => (
        <path key={x} d={`M${x} ${front + 10} Q${x + 20} ${front + 140} ${x - 10} ${front + 250}`} fill="none" stroke="#c9b79c" strokeWidth={8} />
      ))}
      {/* table top in perspective (wood) */}
      <path d={`M-120 ${y} L${W + 120} ${y} L${W + 420} ${front} L-420 ${front} Z`} fill="#7a4a2c" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <path d={`M-420 ${front} L${W + 420} ${front} L${W + 420} ${front + 26} L-420 ${front + 26} Z`} fill="#5c3520" stroke={INK} strokeWidth={8} />
      {/* runner */}
      <path d={`M380 ${y} L700 ${y} L760 ${front} L320 ${front} Z`} fill="#c2255c" opacity={0.85} />
      {/* plates with food */}
      {plates.map((x, i) => (
        <g key={x}>
          <ellipse cx={x} cy={y + 80} rx={100} ry={34} fill="#fff" stroke={INK} strokeWidth={7} />
          <ellipse cx={x} cy={y + 76} rx={60} ry={18} fill={foods[i]} />
          <path d={`M${x + 120} ${y + 60} L${x + 128} ${y + 110}`} stroke="#adb5bd" strokeWidth={7} strokeLinecap="round" />
          {/* glass */}
          <path d={`M${x - 150} ${y + 30} L${x - 120} ${y + 30} L${x - 124} ${y + 90} L${x - 146} ${y + 90} Z`} fill="#d0ebff" stroke={INK} strokeWidth={5} opacity={0.9} />
        </g>
      ))}
      {/* dal bowl + roti basket in the middle */}
      <g transform={`translate(540 ${y + 60})`}>
        <path d="M-70 0 Q0 70 70 0 Z" fill="#f2c94c" stroke={INK} strokeWidth={7} />
        <ellipse cx={0} cy={0} rx={70} ry={16} fill="#f59f00" stroke={INK} strokeWidth={6} />
        {[0, 1, 2].map((i) => {
          const t = ((frame + i * 14) % 42) / 42;
          return <path key={i} d={`M${-20 + i * 20} ${-10 - t * 110} q14 -20 0 -40`} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.7 * (1 - t)} />;
        })}
      </g>
      <g transform={`translate(270 ${y + 40})`}>
        <path d="M-60 0 L60 0 L45 40 L-45 40 Z" fill="#c98a4b" stroke={INK} strokeWidth={6} />
        <ellipse cx={0} cy={-6} rx={50} ry={14} fill="#f3d9a4" stroke={INK} strokeWidth={5} />
      </g>
    </svg>
  );
};
