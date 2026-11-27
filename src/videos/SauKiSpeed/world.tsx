// SauKiSpeed world (house style v2): bright highway to a vanishing point with fields + hills, the driver's POV frame
// (dashboard, wheel, hands, mirror + marigold garland), the car interior for in-car shots, and our own goat + buffalo.
import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { H, INK, W } from "../../lib/reel";

export const VP = { x: 540, y: 860 }; // vanishing point

const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }} width={W} height={H}>
    {children}
  </svg>
);

/** Perspective helper: t in 0..1 from the horizon (0) to the bottom of the frame (1). */
export const persp = (t: number) => ({ y: VP.y + (H - VP.y) * t * t, s: t * t });

/** The highway scene. `speed` scales how fast the dashes rush toward the camera. */
export const Highway: React.FC<{ speed?: number }> = ({ speed = 1 }) => {
  const frame = useCurrentFrame();
  const roadL = (t: number) => VP.x - (40 + 700 * t * t);
  const roadR = (t: number) => VP.x + (40 + 700 * t * t);
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#5fb3f5 0%,#a5d8ff 45%,#d0ebff 60%)" }} />
      <Svg>
        {/* clouds drift */}
        {[0, 1, 2, 3].map((i) => {
          const x = ((i * 330 + frame * 0.4) % 1400) - 200;
          return (
            <g key={i} transform={`translate(${x} ${180 + (i % 2) * 140})`} opacity={0.95}>
              <ellipse cx={0} cy={0} rx={150} ry={50} fill="#fff" />
              <ellipse cx={70} cy={-34} rx={90} ry={60} fill="#fff" />
              <ellipse cx={-60} cy={-20} rx={70} ry={44} fill="#fff" />
            </g>
          );
        })}
        {/* far hills */}
        <path d={`M-20 ${VP.y} Q150 700 330 800 Q520 660 760 790 Q920 690 1100 780 L1100 ${VP.y} Z`} fill="#7aa6d8" />
        <path d={`M-20 ${VP.y} Q250 760 480 830 Q700 760 1100 820 L1100 ${VP.y} Z`} fill="#6c97c9" />
        {/* fields: green + mustard bands */}
        <rect x={0} y={VP.y} width={W} height={H - VP.y} fill="#7cc35a" />
        {[0, 1, 2, 3, 4].map((i) => {
          const t0 = 0.08 + i * 0.2;
          const t1 = t0 + 0.1;
          return (
            <path
              key={i}
              d={`M0 ${persp(t0).y} L${roadL(t0)} ${persp(t0).y} L${roadL(t1)} ${persp(t1).y} L0 ${persp(t1).y} Z M${roadR(t0)} ${persp(t0).y} L${W} ${persp(t0).y} L${W} ${persp(t1).y} L${roadR(t1)} ${persp(t1).y} Z`}
              fill="#f2cf3b"
            />
          );
        })}
        {/* trees + huts on the horizon */}
        {[90, 210, 830, 960].map((tx, i) => (
          <g key={i} transform={`translate(${tx} ${VP.y - 6})`}>
            <rect x={-6} y={-60} width={12} height={60} fill="#6b4423" />
            <circle cx={0} cy={-78} r={34} fill="#2f9e44" stroke={INK} strokeWidth={4} />
          </g>
        ))}
        <path d={`M300 ${VP.y} l24 -24 l24 24 Z`} fill="#c0644a" stroke={INK} strokeWidth={3} />
        {/* road */}
        <path d={`M${VP.x - 40} ${VP.y} L${VP.x + 40} ${VP.y} L${roadR(1) + 200} ${H} L${roadL(1) - 200} ${H} Z`} fill="#8a8f98" stroke={INK} strokeWidth={4} />
        <path d={`M${VP.x - 36} ${VP.y} L${roadL(1) - 150} ${H}`} stroke="#ffd43b" strokeWidth={14} />
        <path d={`M${VP.x + 36} ${VP.y} L${roadR(1) + 150} ${H}`} stroke="#ffd43b" strokeWidth={14} />
        {/* centre dashes rushing toward the camera */}
        {Array.from({ length: 9 }).map((_, i) => {
          const t = (i / 9 + frame * 0.012 * speed) % 1;
          const a = persp(t);
          const b = persp(Math.min(1, t + 0.05));
          const w = 4 + 26 * t;
          return <path key={i} d={`M${VP.x} ${a.y} L${VP.x} ${b.y}`} stroke="#fff" strokeWidth={w} />;
        })}
        {/* verge bushes passing by */}
        {Array.from({ length: 6 }).map((_, i) => {
          const t = (i / 6 + frame * 0.012 * speed + 0.03) % 1;
          const a = persp(t);
          const r = 10 + 90 * t * t;
          return (
            <g key={i}>
              <circle cx={roadL(t) - r - 30 * t} cy={a.y - r * 0.6} r={r} fill={random(`b${i}`) > 0.5 ? "#2f9e44" : "#c2255c"} stroke={INK} strokeWidth={3} opacity={0.95} />
              <circle cx={roadR(t) + r + 30 * t} cy={a.y - r * 0.6} r={r} fill="#37b24d" stroke={INK} strokeWidth={3} />
            </g>
          );
        })}
      </Svg>
    </>
  );
};

/** Driver's POV frame drawn over the highway: A-pillars, roof, mirror + marigold garland, dashboard, wheel, hands. */
export const PovFrame: React.FC<{ shake?: number; tremble?: boolean }> = ({ shake = 0, tremble }) => {
  const frame = useCurrentFrame();
  const sw = Math.sin(frame / 7) * 10;
  const tr = tremble ? Math.sin(frame * 2.3) * 4 : 0;
  return (
    <Svg style={{ transform: `translateY(${shake}px)` }}>
      {/* roof + pillars */}
      <path d="M0 0 L1080 0 L1080 70 Q540 30 0 70 Z" fill="#c92a2a" stroke={INK} strokeWidth={8} />
      <path d="M0 70 L90 70 L0 1500 Z" fill="#a61e1e" stroke={INK} strokeWidth={8} />
      <path d="M1080 70 L990 70 L1080 1500 Z" fill="#a61e1e" stroke={INK} strokeWidth={8} />
      {/* mirror + garland */}
      <rect x={530} y={40} width={20} height={50} fill={INK} />
      <rect x={420} y={80} width={240} height={70} rx={20} fill="#495057" stroke={INK} strokeWidth={8} />
      <rect x={436} y={94} width={208} height={42} rx={12} fill="#a5d8ff" />
      <g transform={`translate(540 150) rotate(${sw})`}>
        {Array.from({ length: 9 }).map((_, i) => {
          const a = (i / 8) * Math.PI;
          return <circle key={i} cx={Math.cos(a) * 46} cy={Math.sin(a) * 110} r={16} fill={i % 2 ? "#ff922b" : "#fcc419"} stroke={INK} strokeWidth={4} />;
        })}
      </g>
      {/* dashboard */}
      <path d="M0 1480 Q540 1380 1080 1480 L1080 1920 L0 1920 Z" fill="#343a40" stroke={INK} strokeWidth={10} />
      <path d="M0 1520 Q540 1430 1080 1520" fill="none" stroke="#c92a2a" strokeWidth={14} />
      <rect x={600} y={1560} width={180} height={90} rx={14} fill="#212529" stroke={INK} strokeWidth={6} />
      {/* steering wheel + hands */}
      <g transform={`translate(${540 + tr} 1820)`}>
        <ellipse cx={0} cy={0} rx={300} ry={250} fill="none" stroke={INK} strokeWidth={60} />
        <ellipse cx={0} cy={0} rx={300} ry={250} fill="none" stroke="#212529" strokeWidth={40} />
        <path d="M-280 40 L-60 60 M280 40 L60 60" stroke="#212529" strokeWidth={44} />
        <circle cx={0} cy={60} r={70} fill="#343a40" stroke={INK} strokeWidth={8} />
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(${sd * 250 + tr * sd} -130) rotate(${sd * 20})`}>
            <rect x={-48} y={-30} width={96} height={120} rx={40} fill="#c68b59" stroke={INK} strokeWidth={8} />
            {[0, 1, 2].map((k) => (
              <path key={k} d={`M${-36 + k * 26} -26 L${-36 + k * 26} 10`} stroke={INK} strokeWidth={4} opacity={0.5} />
            ))}
            <rect x={-44} y={80} width={88} height={160} fill="#4dabf7" stroke={INK} strokeWidth={8} />
          </g>
        ))}
      </g>
    </Svg>
  );
};

/** In-car side view: window with scrolling fields, seat back, door panel. `seat` = where the seat back is. */
export const CarInterior: React.FC<{ seatX?: number; back?: boolean }> = ({ seatX = 540, back }) => {
  const frame = useCurrentFrame();
  const scroll = (frame * 14) % 400;
  return (
    <>
      <AbsoluteFill style={{ background: "#d9c7a7" }} />
      <Svg>
        {/* window with the world rushing by */}
        <clipPath id="win">
          <path d="M60 260 L1020 260 L1020 900 L60 900 Z" />
        </clipPath>
        <g clipPath="url(#win)">
          <rect x={60} y={260} width={960} height={640} fill="#a5d8ff" />
          <path d="M60 640 Q300 560 540 620 Q780 560 1020 620 L1020 900 L60 900Z" fill="#7aa6d8" />
          {Array.from({ length: 6 }).map((_, i) => (
            <g key={i} transform={`translate(${((i * 400 - scroll * 2) % 2400) + 1200} 0)`}>
              <rect x={-1200} y={700} width={400} height={200} fill={i % 2 ? "#7cc35a" : "#f2cf3b"} />
              <rect x={-1100} y={620} width={14} height={90} fill="#6b4423" />
              <circle cx={-1093} cy={600} r={44} fill="#2f9e44" stroke={INK} strokeWidth={4} />
            </g>
          ))}
        </g>
        <path d="M60 260 L1020 260 L1020 900 L60 900 Z" fill="none" stroke="#a61e1e" strokeWidth={26} />
        {/* seat back + headrest */}
        <path d={`M${seatX - 260} 1900 L${seatX - 230} 900 Q${seatX} 840 ${seatX + 230} 900 L${seatX + 260} 1900 Z`} fill={back ? "#b08968" : "#c8a97e"} stroke={INK} strokeWidth={10} />
        <rect x={seatX - 120} y={720} width={240} height={160} rx={50} fill="#c8a97e" stroke={INK} strokeWidth={10} />
        {[0, 1, 2, 3].map((k) => (
          <path key={k} d={`M${seatX - 200 + k * 130} 960 L${seatX - 210 + k * 140} 1880`} stroke="#a67c52" strokeWidth={8} />
        ))}
        {/* embroidered cushion */}
        <g transform={`translate(${seatX + 330} 1250) rotate(8)`}>
          <rect x={-90} y={-90} width={180} height={180} rx={24} fill="#e8590c" stroke={INK} strokeWidth={8} />
          <path d="M0 -60 L60 0 L0 60 L-60 0 Z" fill="#fcc419" stroke={INK} strokeWidth={5} />
          <circle r={18} fill="#c92a2a" />
        </g>
      </Svg>
    </>
  );
};

/** Door panel / dashboard edge in the foreground (crops the seated body; drawn AFTER the character). */
export const DoorFront: React.FC = () => (
  <Svg>
    <path d="M0 1560 Q540 1500 1080 1560 L1080 1920 L0 1920 Z" fill="#a61e1e" stroke={INK} strokeWidth={10} />
    <path d="M0 1620 Q540 1570 1080 1620" fill="none" stroke="#7a1212" strokeWidth={12} />
  </Svg>
);

/** Our goat: white with brown patches, small horns, a beard, big glossy eyes; chews and flicks its ears. */
export const Goat: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const frame = useCurrentFrame();
  const chew = Math.sin(frame / 3) * 4;
  const ear = Math.sin(frame / 11) * 8;
  const blink = (frame + 20) % 90 < 4;
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx={0} cy={300} rx={170} ry={30} fill={INK} opacity={0.2} />
        <path d="M-120 140 L-120 290 M-60 150 L-60 290 M60 150 L60 290 M120 140 L120 290" stroke={INK} strokeWidth={30} strokeLinecap="round" />
        <path d="M-120 140 L-120 290 M-60 150 L-60 290 M60 150 L60 290 M120 140 L120 290" stroke="#f8f9fa" strokeWidth={18} strokeLinecap="round" />
        <ellipse cx={0} cy={110} rx={170} ry={100} fill="#f8f9fa" stroke={INK} strokeWidth={10} />
        <ellipse cx={-60} cy={90} rx={50} ry={34} fill="#c08552" />
        <g transform={`rotate(${-ear} -95 -120)`}>
          <ellipse cx={-130} cy={-110} rx={60} ry={24} fill="#f8f9fa" stroke={INK} strokeWidth={8} />
        </g>
        <g transform={`rotate(${ear} 95 -120)`}>
          <ellipse cx={130} cy={-110} rx={60} ry={24} fill="#f8f9fa" stroke={INK} strokeWidth={8} />
        </g>
        <path d="M-40 -190 Q-60 -260 -90 -250 M40 -190 Q60 -260 90 -250" stroke={INK} strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d="M-40 -190 Q-60 -260 -90 -250 M40 -190 Q60 -260 90 -250" stroke="#adb5bd" strokeWidth={10} fill="none" strokeLinecap="round" />
        <ellipse cx={0} cy={-90} rx={100} ry={120} fill="#f8f9fa" stroke={INK} strokeWidth={10} />
        {[-1, 1].map((sd) => (
          <g key={sd}>
            <ellipse cx={sd * 42} cy={-120} rx={30} ry={blink ? 4 : 36} fill="#fff" stroke={INK} strokeWidth={6} />
            {!blink && <circle cx={sd * 42 + 4} cy={-114} r={18} fill={INK} />}
            {!blink && <circle cx={sd * 42 + 10} cy={-122} r={6} fill="#fff" />}
          </g>
        ))}
        <ellipse cx={0} cy={-20} rx={56} ry={40} fill="#ffc9c9" stroke={INK} strokeWidth={7} />
        <circle cx={-18} cy={-26} r={7} fill={INK} />
        <circle cx={18} cy={-26} r={7} fill={INK} />
        <path d={`M-20 ${6 + chew} Q0 ${16 + chew} 20 ${6 + chew}`} fill="none" stroke={INK} strokeWidth={6} />
        <path d={`M-10 30 L0 ${80 + chew} L10 30`} fill="#ced4da" stroke={INK} strokeWidth={5} />
      </g>
    </Svg>
  );
};

/** Our buffalo: charcoal body, wide curved horns, big nostrils, glossy eyes, a black thread with a bell. */
export const Buffalo: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const frame = useCurrentFrame();
  const ear = Math.sin(frame / 13) * 6;
  const blink = (frame + 55) % 100 < 4;
  const huff = Math.max(0, Math.sin(frame / 9)) * 6;
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx={0} cy={330} rx={240} ry={36} fill={INK} opacity={0.22} />
        <path d="M-150 170 L-150 320 M-70 180 L-70 320 M70 180 L70 320 M150 170 L150 320" stroke={INK} strokeWidth={44} strokeLinecap="round" />
        <path d="M-150 170 L-150 320 M-70 180 L-70 320 M70 180 L70 320 M150 170 L150 320" stroke="#495057" strokeWidth={30} strokeLinecap="round" />
        <ellipse cx={0} cy={130} rx={230} ry={130} fill="#495057" stroke={INK} strokeWidth={10} />
        {/* horns */}
        <path d="M-90 -170 Q-260 -200 -230 -60 Q-220 -120 -110 -130 Z" fill="#ced4da" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        <path d="M90 -170 Q260 -200 230 -60 Q220 -120 110 -130 Z" fill="#ced4da" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        <g transform={`rotate(${-ear} -120 -80)`}>
          <ellipse cx={-170} cy={-70} rx={56} ry={26} fill="#495057" stroke={INK} strokeWidth={8} />
        </g>
        <g transform={`rotate(${ear} 120 -80)`}>
          <ellipse cx={170} cy={-70} rx={56} ry={26} fill="#495057" stroke={INK} strokeWidth={8} />
        </g>
        <path d="M-130 -150 Q0 -200 130 -150 L120 40 Q0 120 -120 40 Z" fill="#5c636e" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        {[-1, 1].map((sd) => (
          <g key={sd}>
            <ellipse cx={sd * 55} cy={-80} rx={32} ry={blink ? 4 : 36} fill="#fff" stroke={INK} strokeWidth={6} />
            {!blink && <circle cx={sd * 55 + 4} cy={-74} r={19} fill={INK} />}
            {!blink && <circle cx={sd * 55 + 10} cy={-82} r={6} fill="#fff" />}
          </g>
        ))}
        <ellipse cx={0} cy={30} rx={90} ry={58} fill="#868e96" stroke={INK} strokeWidth={8} />
        <ellipse cx={-34} cy={30} rx={14 + huff * 0.5} ry={18 + huff} fill={INK} />
        <ellipse cx={34} cy={30} rx={14 + huff * 0.5} ry={18 + huff} fill={INK} />
        <path d="M-100 110 Q0 160 100 110" fill="none" stroke={INK} strokeWidth={6} />
        <circle cx={0} cy={150} r={20} fill="#fcc419" stroke={INK} strokeWidth={6} />
      </g>
    </Svg>
  );
};
