// ShaadiChor world pieces: wedding dressing room, lineup hall, halwai kitchen, mehendi corner, photo stage, rooftop (chhat),
// plus small props (marigold strings, fairy lights, coins, ₹100 note, magnifier, share plane).
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "../../lib/fonts";
import { NightSky } from "../../lib/night";
import { H, INK, popSpring, W } from "../../lib/reel";
import { SignText } from "../../lib/world";

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
    {children}
  </svg>
);

/** Hanging marigold strings (genda) across the top. */
export const Marigolds: React.FC<{ y?: number; n?: number; blur?: number }> = ({ y = 0, n = 9, blur = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, filter: blur ? `blur(${blur}px)` : undefined }} width={W} height={H}>
      {Array.from({ length: n }).map((_, i) => {
        const x = 40 + i * (1000 / (n - 1));
        const len = 6 + (i % 3) * 2;
        const sw = Math.sin(frame / 25 + i) * 6;
        return (
          <g key={i}>
            {Array.from({ length: len }).map((__, k) => (
              <circle key={k} cx={x + sw * (k / len)} cy={y + 20 + k * 38} r={20} fill={k % 2 ? "#ff922b" : "#fcc419"} stroke={INK} strokeWidth={4} />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

/** Twinkling fairy lights along a curve. */
export const FairyLights: React.FC<{ y: number; sag?: number }> = ({ y, sag = 80 }) => {
  const frame = useCurrentFrame();
  return (
    <Svg>
      <path d={`M-20 ${y} Q540 ${y + sag * 2} 1100 ${y}`} fill="none" stroke="#2b2118" strokeWidth={4} />
      {Array.from({ length: 22 }).map((_, i) => {
        const t = i / 21;
        const x = -20 + 1120 * t;
        const yy = y + sag * 2 * 2 * t * (1 - t);
        const on = 0.5 + 0.5 * Math.sin(frame / 5 + i * 1.3);
        const c = ["#ffd43b", "#ff8787", "#74c0fc", "#8ce99a"][i % 4];
        return (
          <g key={i}>
            <circle cx={x} cy={yy + 10} r={18} fill={c} opacity={0.25 * on} />
            <circle cx={x} cy={yy + 10} r={8} fill={c} opacity={0.5 + 0.5 * on} />
          </g>
        );
      })}
    </Svg>
  );
};

/** Bride's dressing room: maroon wall, mirror with bulbs, dressing table with an open (empty) jewellery box. */
export const DressingRoom: React.FC<{ boxGlowAt: number }> = ({ boxGlowAt }) => {
  const frame = useCurrentFrame();
  const glow = frame >= boxGlowAt ? 0.5 + 0.5 * Math.sin((frame - boxGlowAt) / 3) : 0;
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#6b1d3a,#9c2f4f 70%)" }} />
      <Svg>
        {/* wall pattern */}
        {Array.from({ length: 6 }).map((_, i) => (
          <path key={i} d={`M${i * 200} 0 L${i * 200} 1300`} stroke="#82264a" strokeWidth={30} />
        ))}
        {/* mirror with bulbs */}
        <rect x={620} y={560} width={360} height={520} rx={40} fill="#d0ebff" stroke="#c9a227" strokeWidth={22} />
        <path d="M660 640 L760 600 M660 720 L820 640" stroke="#fff" strokeWidth={14} opacity={0.6} />
        {Array.from({ length: 12 }).map((_, i) => {
          const bx = i < 6 ? 640 + i * 64 : i < 9 ? 600 : 1000;
          const by = i < 6 ? 548 : 640 + ((i - 6) % 3) * 170;
          return <circle key={i} cx={bx} cy={by} r={14} fill="#fff3bf" stroke={INK} strokeWidth={4} opacity={0.8 + 0.2 * Math.sin(frame / 4 + i)} />;
        })}
        {/* floor */}
        <rect x={0} y={1300} width={W} height={H - 1300} fill="#7a3b2a" />
        <rect x={0} y={1300} width={W} height={14} fill={INK} opacity={0.3} />
        {/* dressing table */}
        <rect x={580} y={1100} width={440} height={60} rx={10} fill="#a0522d" stroke={INK} strokeWidth={9} />
        <rect x={610} y={1160} width={380} height={240} fill="#8b4513" stroke={INK} strokeWidth={9} />
        <circle cx={800} cy={1280} r={10} fill="#ffd43b" stroke={INK} strokeWidth={4} />
        {/* open jewellery box, empty, with a glowing outline where the haar was */}
        <g transform="translate(860 1100)">
          <path d="M-80 -10 L-70 -110 L70 -110 L80 -10 Z" fill="#c92a2a" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
          <rect x={-90} y={-14} width={180} height={18} rx={4} fill="#e03131" stroke={INK} strokeWidth={6} />
          <path d="M-90 -14 L-80 -62 L80 -62 L90 -14" fill="#5c0f1f" stroke={INK} strokeWidth={6} />
          <path d="M-50 -30 Q0 10 50 -30" fill="none" stroke="#ffd43b" strokeWidth={6} strokeDasharray="8 8" opacity={glow} />
        </g>
        {/* lipstick + perfume */}
        <rect x={640} y={1050} width={20} height={50} rx={6} fill="#c2255c" stroke={INK} strokeWidth={4} />
        <path d="M700 1100 L700 1040 Q720 1020 740 1040 L740 1100 Z" fill="#b197fc" stroke={INK} strokeWidth={5} />
      </Svg>
    </>
  );
};

/** Wedding house hall where the inspector lines everyone up: cream wall, red+gold drapes, height marks behind the line. */
export const LineupHall: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#f3e0c2,#e9cfa6 70%)" }} />
    <Svg>
      {Array.from({ length: 7 }).map((_, i) => (
        <path key={i} d={`M${-60 + i * 180} 0 Q${30 + i * 180} 260 ${120 + i * 180} 0`} fill={i % 2 ? "#c92a2a" : "#f2c94c"} stroke={INK} strokeWidth={6} />
      ))}
      {/* height board */}
      <rect x={40} y={700} width={1000} height={620} rx={10} fill="#e3d3b4" stroke={INK} strokeWidth={6} opacity={0.8} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <path d={`M40 ${760 + i * 100} L1040 ${760 + i * 100}`} stroke={INK} strokeWidth={4} opacity={0.35} />
          <SignText x={80} y={772 + i * 100} size={30} text={`${7 - i}'`} fill="#6b4423" stroke="#e3d3b4" />
        </g>
      ))}
      <rect x={0} y={1320} width={W} height={H - 1320} fill="#b0644a" />
      <rect x={0} y={1320} width={W} height={14} fill={INK} opacity={0.3} />
      {/* the line on the floor */}
      <rect x={60} y={1700} width={960} height={14} rx={7} fill="#fff3bf" opacity={0.8} />
    </Svg>
  </>
);

/** Halwai kitchen: tiled wall, stove with a kadhai of jalebis, steam. */
export const Kitchen: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: "#fff3d6" }} />
      <Svg>
        {Array.from({ length: 10 }).map((_, r) =>
          Array.from({ length: 8 }).map((__, c) => (
            <rect key={`${r}${c}`} x={c * 140} y={300 + r * 100} width={140} height={100} fill={(r + c) % 2 ? "#e7f5ff" : "#d0ebff"} stroke="#a5d8ff" strokeWidth={3} />
          )),
        )}
        {/* steel utensils on a shelf */}
        <rect x={60} y={520} width={420} height={20} fill="#868e96" stroke={INK} strokeWidth={5} />
        {[100, 200, 300, 400].map((ux, i) => (
          <ellipse key={i} cx={ux} cy={490} rx={40 + (i % 2) * 10} ry={30} fill="#dee2e6" stroke={INK} strokeWidth={6} />
        ))}
        <rect x={0} y={1300} width={W} height={H - 1300} fill="#a87447" />
        {/* stove + kadhai */}
        <rect x={640} y={1150} width={380} height={160} rx={14} fill="#495057" stroke={INK} strokeWidth={8} />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${760 + i * 40} 1150 q-10 ${-30 - Math.sin(frame / 3 + i) * 10} 0 -50 q10 20 0 50`} fill="#ff922b" stroke={INK} strokeWidth={3} />
        ))}
        <path d="M660 1090 Q830 1210 1000 1090 Z" fill="#343a40" stroke={INK} strokeWidth={9} />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={740 + i * 60} cy={1100} r={20} fill="none" stroke="#f08c00" strokeWidth={10} />
        ))}
        {[0, 1, 2].map((i) => {
          const t = ((frame + i * 20) % 60) / 60;
          return <circle key={i} cx={780 + i * 50 + Math.sin(t * 6) * 10} cy={1060 - t * 260} r={30 + t * 30} fill="#fff" opacity={0.5 * (1 - t)} />;
        })}
      </Svg>
    </>
  );
};

/** Mehendi corner: haldi-yellow wall, cushions, flowers, a mehendi cone. */
export const MehendiCorner: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#ffd43b,#fab005)" }} />
    <Svg>
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={100 + i * 220} cy={420} r={70} fill="none" stroke="#e67700" strokeWidth={10} opacity={0.5} />
      ))}
      <rect x={0} y={1300} width={W} height={H - 1300} fill="#2f9e44" />
      {[120, 900].map((cx, i) => (
        <ellipse key={i} cx={cx} cy={1260} rx={150} ry={70} fill={i ? "#e64980" : "#7048e8"} stroke={INK} strokeWidth={8} />
      ))}
      <g transform="translate(930 1150) rotate(30)">
        <path d="M0 0 L-24 -120 L24 -120 Z" fill="#2b8a3e" stroke={INK} strokeWidth={6} />
      </g>
    </Svg>
  </>
);

/** Photo stage: flower backdrop, a studio umbrella light; flashes on given frames. */
export const PhotoStage: React.FC<{ flashAt: number[] }> = ({ flashAt }) => {
  const frame = useCurrentFrame();
  const flash = flashAt.reduce((m, f) => Math.max(m, frame >= f && frame < f + 6 ? 1 - (frame - f) / 6 : 0), 0);
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#3b1f4f,#5f3dc4)" }} />
      <Svg>
        {Array.from({ length: 30 }).map((_, i) => (
          <circle key={i} cx={random(`pf${i}`) * W} cy={200 + random(`pg${i}`) * 900} r={18 + random(`ph${i}`) * 16} fill={["#ffa8a8", "#ffd43b", "#fff"][i % 3]} opacity={0.6} />
        ))}
        {/* umbrella light */}
        <g transform="translate(900 700)">
          <path d="M0 0 L0 620" stroke={INK} strokeWidth={14} />
          <path d="M-140 -40 Q0 -180 140 -40 Z" fill="#f8f9fa" stroke={INK} strokeWidth={8} />
          <circle cx={0} cy={-30} r={20} fill="#fff3bf" stroke={INK} strokeWidth={5} />
        </g>
        <rect x={0} y={1300} width={W} height={H - 1300} fill="#3b2a55" />
      </Svg>
      <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.8 }} />
    </>
  );
};

/** Rooftop at night: water tank, clothesline, wedding lights on the next house. */
export const Chhat: React.FC = () => (
  <>
    <NightSky top="#0b1033" bottom="#33407e" moon />
    <FairyLights y={900} sag={40} />
    <Svg>
      <rect x={60} y={980} width={220} height={260} rx={30} fill="#343a40" stroke={INK} strokeWidth={8} />
      <rect x={80} y={950} width={180} height={40} rx={10} fill="#495057" stroke={INK} strokeWidth={6} />
      <path d="M300 1080 L1080 1040" stroke="#ced4da" strokeWidth={4} />
      {[420, 560, 720].map((cx, i) => (
        <rect key={i} x={cx} y={1072 - i * 6} width={90} height={120} fill={["#ff8787", "#74c0fc", "#ffd43b"][i]} stroke={INK} strokeWidth={5} />
      ))}
      <rect x={0} y={1300} width={W} height={H - 1300} fill="#5c5f70" />
      <rect x={0} y={1260} width={W} height={50} fill="#868e96" stroke={INK} strokeWidth={6} />
    </Svg>
  </>
);

/** Spotlight cone from the top onto x. */
export const Spot: React.FC<{ x: number; on: boolean }> = ({ x, on }) =>
  on ? (
    <Svg>
      <path d={`M${x - 40} 0 L${x - 200} 1760 L${x + 200} 1760 L${x + 40} 0 Z`} fill="#fff3bf" opacity={0.22} />
      <ellipse cx={x} cy={1770} rx={200} ry={40} fill="#fff3bf" opacity={0.35} />
    </Svg>
  ) : null;

/** Magnifying glass sweeping across the lineup (hint, never stopping on anyone). */
export const Magnifier: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame > to) return null;
  const t = interpolate(frame, [from, to], [0, 1]);
  const x = 120 + 860 * t;
  const y = 1600 + Math.sin(t * Math.PI * 3) * 30; // chest level: never over a face
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) rotate(-30)`}>
        <path d="M0 80 L0 220" stroke={INK} strokeWidth={30} strokeLinecap="round" />
        <path d="M0 80 L0 220" stroke="#8b4513" strokeWidth={18} strokeLinecap="round" />
        <circle r={80} fill="#d0ebff" opacity={0.25} stroke={INK} strokeWidth={14} />
        <circle r={80} fill="none" stroke="#c9a227" strokeWidth={6} />
      </g>
    </Svg>
  );
};

/** Big ₹100 note bouncing in. */
export const HundredNote: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = popSpring(frame, at);
  return (
    <Svg>
      <g transform={`translate(${x} ${y + Math.sin(frame / 8) * 10}) rotate(${-6 + Math.sin(frame / 10) * 3}) scale(${p})`}>
        <rect x={-260} y={-120} width={520} height={240} rx={18} fill="#c5b3f6" stroke={INK} strokeWidth={10} />
        <rect x={-230} y={-92} width={460} height={184} rx={10} fill="none" stroke="#7048e8" strokeWidth={5} />
        <circle cx={-130} cy={0} r={60} fill="#d0bfff" stroke="#7048e8" strokeWidth={5} />
        <text x={80} y={30} fontSize={110} textAnchor="middle" fill="#5f3dc4" fontFamily={FONT_FAMILY} fontWeight={800}>
          ₹100
        </text>
      </g>
    </Svg>
  );
};

/** Paper plane (share) flying across with a dashed trail. */
export const SharePlane: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / 30;
  if (t < 0 || t > 1.4) return null;
  const x = -100 + t * 900;
  const y = 1150 - Math.sin(t * 2.2) * 300;
  return (
    <Svg>
      <path d={`M-100 1150 Q${x / 2} ${y - 200} ${x} ${y}`} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="14 12" opacity={0.7} />
      <g transform={`translate(${x} ${y}) rotate(-20)`}>
        <path d="M-60 -10 L70 -40 L-20 40 Z" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <path d="M-20 40 L-10 0 L70 -40" fill="none" stroke={INK} strokeWidth={5} />
      </g>
    </Svg>
  );
};

/** Party backdrop for the prize: purple with confetti falling (gravity + flutter). */
export const PrizeBackdrop: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const t = (frame - from) / 30;
  return (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #9775fa, #3b1f78 75%)" }} />
      <Svg>
        {Array.from({ length: 40 }).map((_, i) => {
          const d = random(`cf${i}`) * 1.2;
          const tt = Math.max(0, t - d);
          const x = random(`cx${i}`) * W + Math.sin(tt * 4 + i) * 30;
          const y = -40 + 0.5 * 500 * tt * tt;
          return <rect key={i} x={x} y={y % H} width={18} height={28} fill={["#ffd43b", "#ff6b6b", "#69db7c", "#74c0fc"][i % 4]} transform={`rotate(${tt * 300 + i * 20} ${x + 9} ${(y % H) + 14})`} />;
        })}
      </Svg>
    </>
  );
};
