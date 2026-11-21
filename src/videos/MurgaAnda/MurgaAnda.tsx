// MurgaAnda (Part 1): Sonu's laal murga "lays" an egg on the wall between Sonu's and Monu's houses. Whose egg? (Answer: D)
// Every cue frame comes from ./words.json (measured word times). Never hard-code times here.
// NOTE: the user's recording starts at "Sonu aur Monu padosi hain" (the hook line and "Indore ke ek mohalle mein" were not
// recorded), so the title chip carries the hook from frame 0.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Character, Cue, Expr, PoseName } from "../../lib/Character";
import {
  Camera,
  Chip,
  Dust,
  Grain,
  H,
  INK,
  makeCue,
  popSpring,
  Sparkles,
  Vignette,
  W,
  WordsFile,
} from "../../lib/reel";
import { FollowButton, Tiles } from "../../lib/ui";
import { NightSky } from "../../lib/night";
import { Foreground, Layer, SignText } from "../../lib/world";
import wordsData from "./words.json";

const data = wordsData as unknown as WordsFile;
const cue = makeCue(data);
export const MURGAANDA_DURATION =
  data.words[data.words.length - 1].endFrame + 60; // ends 2 s after the voice

const F = {
  sonu: cue(0, "Sonu"),
  monu: cue(2, "Monu"),
  padosi: cue(3, "padosi"),
  s2: cue(5, "Dono"),
  beech: cue(8, "beech"),
  chhoti: cue(10, "chhoti"),
  deewar: cue(12, "deewar"),
  s3: cue(14, "Ek"),
  sonu2: cue(16, "Sonu"),
  murga: cue(19, "murga"),
  chadha: cue(22, "chadha"),
  anda: cue(26, "anda"),
  s4: cue(29, "Anda"),
  monu2: cue(30, "Monu"),
  gira: cue(33, "gira"),
  lad: cue(36, "lad"),
  kiska: cue(39, "kiska"),
  s5: cue(40, "Poora"),
  mohalla: cue(41, "mohalla"),
  jama: cue(42, "jama"),
  faisla: cue(46, "faisla"),
  // "A" is spoken in the gap between the pauses at 15.25 s and 15.60 s (voice/murgaanda_clean.pauses.json);
  // the aligner put it at the start of that pause, so it is moved 8 frames later onto the word.
  A: cue(51, "A") + 8,
  murgaA: cue(55, "murga"),
  B: cue(58, "B"),
  taraf: cue(64, "taraf"),
  C: cue(66, "C"),
  aadha: cue(67, "aadha"),
  D: cue(71, "D"),
  kisi: cue(72, "kisi"),
  s7: cue(75, "Dhyan"),
  comment: cue(78, "comment"),
  answer: cue(80, "answer"),
  follow: cue(85, "follow"),
  handle: cue(87, "@rehanfact"),
};
const END = MURGAANDA_DURATION;
const inRange = (f: number, a: number, b: number) => f >= a && f < b;

// ---------------- positions ----------------
const WALL = { x0: 450, x1: 630, top: 1080, base: 1310 };
const EGG_ON_WALL = { x: 612, y: WALL.top - 26 };
const EGG_GROUND = { x: 660, y: WALL.base + 40 };

// ---------------- characters ----------------
// Village elders: grey hair, white mustache, wrinkles; Sonu in an orange pagdi, Monu in a white Gandhi topi + glasses.
const SONU = {
  skin: "#C68B59",
  shirt: "#f1f3f5",
  pants: "#f8f9fa",
  hair: "#ced4da",
  mustache: true,
  mustacheColor: "#f8f9fa",
  pagdi: "#f08c00",
  wrinkles: true,
  seed: 3,
} as const;
const MONU = {
  skin: "#8D5A3B",
  shirt: "#c5a572",
  pants: "#f1f3f5",
  hair: "#dee2e6",
  beard: true,
  mustache: true,
  mustacheColor: "#f8f9fa",
  glasses: true,
  topi: "#f8f9fa",
  wrinkles: true,
  seed: 8,
} as const;
type Act = {
  poses: Cue<PoseName>[];
  exprs: Cue<Expr>[];
  hops?: number[];
  sweat?: Cue<boolean>[];
};
const Sonu: React.FC<Act> = (p) => (
  <Character {...SONU} x={190} y={1800} scale={0.7} look={[{ f: 0, v: 1 }]} {...p} />
);
const Monu: React.FC<Act> = (p) => (
  <Character {...MONU} x={890} y={1800} scale={0.7} flip look={[{ f: 0, v: 1 }]} {...p} />
);

// ---------------- world: village at night ----------------
/** Village hut: mud walls, thatched roof, wooden name plank, lantern by the door. */
const Hut: React.FC<{ x: number; w: number; wall: string; door: string; name: string; lanternX: number; art?: boolean }> = ({
  x,
  w,
  wall,
  door,
  name,
  lanternX,
  art,
}) => {
  const frame = useCurrentFrame();
  const flick = 0.5 + Math.sin(frame / 3) * 0.04 + Math.sin(frame / 7.3) * 0.03;
  const roofTop = 610;
  return (
    <g>
      {/* lantern glow on the wall */}
      <circle cx={lanternX} cy={1010} r={230} fill="url(#lanternGlow)" opacity={flick} />
      <rect x={x} y={800} width={w} height={510} fill={wall} stroke={INK} strokeWidth={10} />
      {/* mud plaster patches */}
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx={x + 60 + i * (w / 4)} cy={1180 - (i % 2) * 220} rx={42} ry={22} fill="#000" opacity={0.08} />
      ))}
      {art &&
        [0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${x + 30 + i * 80} 1270 l30 -36 l30 36`} fill="none" stroke="#f1e3c8" strokeWidth={6} opacity={0.75} />
        ))}
      {/* thatched roof */}
      <path d={`M${x - 70} 830 L${x + w / 2} ${roofTop} L${x + w + 70} 830 Q${x + w / 2} 860 ${x - 70} 830 Z`} fill="#8a6a2e" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      {Array.from({ length: 14 }).map((_, i) => {
        const t = (i + 0.5) / 14;
        const bx = x - 70 + (w + 140) * t;
        const by = 830 + Math.sin(t * Math.PI) * 14;
        return <path key={i} d={`M${bx} ${by} L${x + w / 2 + (bx - x - w / 2) * 0.25} ${roofTop + 40}`} stroke="#5c4519" strokeWidth={5} opacity={0.6} />;
      })}
      <path d={`M${x - 70} 830 Q${x + w / 2} 862 ${x + w + 70} 830`} fill="none" stroke="#c9a24a" strokeWidth={8} opacity={0.7} />
      {/* name plank */}
      <rect x={x + w / 2 - 105} y={870} width={210} height={70} rx={8} fill="#6b4423" stroke={INK} strokeWidth={8} />
      <SignText x={x + w / 2} y={924} size={48} text={name} fill="#fff4d6" stroke={INK} />
      {/* small window with warm light */}
      <rect x={x + 50} y={990} width={110} height={100} fill="#ffd27a" opacity={0.85} stroke={INK} strokeWidth={8} />
      <path d={`M${x + 87} 990 L${x + 87} 1090 M${x + 123} 990 L${x + 123} 1090`} stroke={INK} strokeWidth={6} />
      {/* door */}
      <path d={`M${x + w - 200} 1310 L${x + w - 200} 1060 Q${x + w - 130} 1000 ${x + w - 60} 1060 L${x + w - 60} 1310 Z`} fill={door} stroke={INK} strokeWidth={8} />
      <path d={`M${x + w - 130} 1040 L${x + w - 130} 1310`} stroke={INK} strokeWidth={5} opacity={0.5} />
      {/* lantern */}
      <g transform={`translate(${lanternX} 1000)`}>
        <path d="M0 -60 L0 -30" stroke={INK} strokeWidth={5} />
        <rect x={-22} y={-30} width={44} height={56} rx={10} fill="#ffe8a3" stroke={INK} strokeWidth={6} />
        <ellipse cx={0} cy={0} rx={8} ry={14} fill="#ff922b" opacity={flick + 0.3} />
        <rect x={-26} y={22} width={52} height={12} rx={4} fill="#495057" stroke={INK} strokeWidth={5} />
      </g>
    </g>
  );
};

const Wall: React.FC<{ bricksAt?: number }> = ({ bricksAt = -1 }) => {
  const frame = useCurrentFrame();
  const rows = 6;
  const rh = (WALL.base - WALL.top) / rows;
  return (
    <g>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: 3 }).map((__, c) => {
          const off = r % 2 ? -30 : 0;
          const bx = WALL.x0 + off + c * 60 + (r % 2 ? 30 : 0);
          const by = WALL.top + r * rh;
          // the top row of mud bricks bounces in on "chhoti"
          const pop = r === 0 && bricksAt > 0 ? popSpring(frame, bricksAt + c * 2) : 1;
          return (
            <rect
              key={`${r}-${c}`}
              x={bx}
              y={by - (1 - pop) * 60}
              width={60}
              height={rh}
              rx={6}
              fill={(r + c) % 2 ? "#8c5a3a" : "#9c6844"}
              stroke={INK}
              strokeWidth={5}
              opacity={pop}
            />
          );
        }),
      )}
      <rect x={WALL.x0 - 8} y={WALL.top - 14} width={WALL.x1 - WALL.x0 + 16} height={18} rx={8} fill="#b08055" stroke={INK} strokeWidth={6} />
    </g>
  );
};

/** Village neighbours (topi / pagdi) peek out of windows and over the roofs on "mohalla", some with lanterns. */
const Crowd: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const heads = [
    { x: 105, y: 1040, c: "#e0a370", d: 0, cap: "#f8f9fa" },
    { x: 815, y: 1040, c: "#b97a50", d: 3, cap: "#e8590c" },
    { x: 60, y: 780, c: "#c68b59", d: 6, cap: "#f8f9fa" },
    { x: 330, y: 700, c: "#8d5a3b", d: 9, cap: "#fab005" },
    { x: 960, y: 760, c: "#e0a370", d: 12, cap: "#f8f9fa" },
    { x: 700, y: 690, c: "#c68b59", d: 15, cap: "#e03131" },
  ];
  return (
    <g>
      {heads.map((h, i) => {
        const p = popSpring(frame, at + h.d);
        const bob = Math.sin((frame + i * 7) / 6) * 4;
        return (
          <g key={i} transform={`translate(${h.x} ${h.y + (1 - p) * 80 + bob})`} opacity={Math.min(1, p * 2)}>
            <circle r={70} fill="url(#lanternGlow)" opacity={0.5} />
            <circle r={48} fill={h.c} stroke={INK} strokeWidth={7} />
            <path d="M-46 -18 Q0 -78 46 -18 Q0 -30 -46 -18Z" fill={h.cap} stroke={INK} strokeWidth={6} />
            <circle cx={-15} cy={4} r={7} fill={INK} />
            <circle cx={15} cy={4} r={7} fill={INK} />
            <path d="M-18 20 Q0 12 18 20" fill="#f1f3f5" stroke={INK} strokeWidth={4} />
            <ellipse cx={0} cy={30} rx={9} ry={10} fill={INK} />
          </g>
        );
      })}
    </g>
  );
};

/** Fireflies drifting in the night air (screen space). */
const Fireflies: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      {Array.from({ length: 14 }).map((_, i) => {
        const x = (random(`fx${i}`) * W + Math.sin(frame / 25 + i) * 60 + frame * 0.3) % W;
        const y = 900 + random(`fy${i}`) * 700 + Math.cos(frame / 18 + i * 2) * 40;
        const on = 0.3 + 0.7 * Math.max(0, Math.sin(frame / 9 + i * 1.7));
        return (
          <g key={i} opacity={on}>
            <circle cx={x} cy={y} r={14} fill="#d8f5a2" opacity={0.3} />
            <circle cx={x} cy={y} r={5} fill="#f4fce3" />
          </g>
        );
      })}
    </svg>
  );
};

const Mohalla: React.FC<{ from: number; bricksAt?: number; crowdAt?: number; dawn?: boolean }> = ({
  from,
  bricksAt,
  crowdAt = 1e9,
  dawn,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <NightSky top="#070b24" bottom={dawn ? "#45508f" : "#26336e"} moon={false} />
      <Layer depth={0.12} from={from} drift={-0.5}>
        {/* moon */}
        <circle cx={860} cy={300} r={150} fill="#fff4c2" opacity={0.12} />
        <circle cx={860} cy={300} r={74} fill="#fff4c2" stroke={INK} strokeWidth={8} />
        <circle cx={838} cy={286} r={13} fill="#f0e2a0" />
        <circle cx={882} cy={320} r={9} fill="#f0e2a0" />
        {/* far hills, palms, distant hut lights */}
        <path d="M-200 1000 Q100 820 380 960 Q620 840 900 950 Q1100 860 1300 960 L1300 1100 L-200 1100Z" fill="#1d2756" />
        {[60, 420, 980].map((px, i) => (
          <g key={i} transform={`translate(${px} ${960 - i * 10})`}>
            <path d="M0 0 Q10 -150 0 -260" stroke="#141a3d" strokeWidth={16} fill="none" />
            {[-70, -30, 20, 60].map((a) => (
              <path key={a} d={`M0 -260 q${a} -40 ${a * 1.8} 30`} stroke="#141a3d" strokeWidth={14} fill="none" strokeLinecap="round" />
            ))}
          </g>
        ))}
        {[200, 700, 1050].map((lx, i) => (
          <circle key={i} cx={lx} cy={1010 - i * 6} r={6} fill="#ffd27a" opacity={0.6 + 0.3 * Math.sin(frame / 10 + i)} />
        ))}
      </Layer>
      {/* near layer does not drift: the rooster and egg stand on the wall in screen space */}
      <Layer depth={0.3} from={from} drift={0}>
        <defs>
          <radialGradient id="lanternGlow">
            <stop offset="0%" stopColor="#ffcf6e" stopOpacity={0.75} />
            <stop offset="100%" stopColor="#ffcf6e" stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* neem tree behind the wall */}
        <rect x={510} y={620} width={60} height={460} fill="#4a3220" stroke={INK} strokeWidth={8} />
        {[
          [540, 560, 170],
          [440, 640, 120],
          [650, 640, 120],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={i ? "#1e5631" : "#24693b"} stroke={INK} strokeWidth={8} />
        ))}
        {/* haystack behind Sonu's hut */}
        <path d="M-190 1310 Q-150 1060 -60 1060 Q10 1060 30 1310Z" fill="#a88536" stroke={INK} strokeWidth={8} />
        <Hut x={-20} w={460} wall="#a87447" door="#3b5bdb" name="SONU" lanternX={290} />
        <Hut x={640} w={460} wall="#9c5f3c" door="#2b8a3e" name="MONU" lanternX={770} art />
        <Crowd at={crowdAt} />
        {/* village ground: dirt with a cart track */}
        <rect x={-200} y={WALL.base} width={W + 400} height={H - WALL.base} fill="#6e5236" />
        <rect x={-200} y={WALL.base} width={W + 400} height={14} fill={INK} opacity={0.3} />
        <path d={`M-200 ${WALL.base + 200} Q540 ${WALL.base + 140} 1280 ${WALL.base + 210}`} stroke="#5a412a" strokeWidth={26} fill="none" opacity={0.7} />
        {/* matkas by Monu's door */}
        {[1000, 1060].map((mx, i) => (
          <g key={i} transform={`translate(${mx} ${WALL.base - 40 + i * 6})`}>
            <ellipse rx={40} ry={44} fill="#b5523b" stroke={INK} strokeWidth={7} />
            <rect x={-18} y={-58} width={36} height={18} rx={4} fill="#b5523b" stroke={INK} strokeWidth={6} />
          </g>
        ))}
        {[60, 300, 760, 980].map((gx, i) => (
          <path key={i} d={`M${gx} ${WALL.base + 60} l-14 -30 M${gx} ${WALL.base + 60} l0 -36 M${gx} ${WALL.base + 60} l14 -30`} stroke="#3f6212" strokeWidth={6} strokeLinecap="round" />
        ))}
        <Wall bricksAt={bricksAt} />
      </Layer>
    </>
  );
};

/** Moonlight grade over the scene (below the text): cool blue multiply + soft warm lantern pools near the ground. */
const NightGrade: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: "rgba(40,60,140,0.28)", mixBlendMode: "multiply", pointerEvents: "none" }} />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 26% 55%, rgba(255,200,110,0.16), transparent 30%), radial-gradient(circle at 72% 55%, rgba(255,200,110,0.16), transparent 30%)",
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  </>
);

/** Chunky rooster (screen space, inside the camera). Walks, hops/flaps on cues. */
const Rooster: React.FC<{
  path: { f: number; x: number; y: number }[];
  flapAt?: number[];
  scale?: number;
  face?: 1 | -1;
}> = ({ path, flapAt = [], scale = 0.9, face = 1 }) => {
  const frame = useCurrentFrame();
  // position: piecewise between path keys; a jump arc between keys whose y changes
  let x = path[0].x;
  let y = path[0].y;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    if (frame >= a.f && frame < b.f) {
      const t = (frame - a.f) / (b.f - a.f);
      x = a.x + (b.x - a.x) * t;
      y = a.y + (b.y - a.y) * t - (a.y !== b.y ? Math.sin(t * Math.PI) * 120 : 0);
    } else if (frame >= b.f) {
      x = b.x;
      y = b.y;
    }
  }
  const walking = path.some((p, i) => i < path.length - 1 && frame >= p.f && frame < path[i + 1].f && path[i + 1].y === p.y && path[i + 1].x !== p.x);
  const step = walking ? Math.abs(Math.sin(frame / 3)) * 10 : 0;
  const flap = flapAt.some((f) => frame >= f && frame < f + 14);
  const wing = flap ? Math.sin(frame * 1.6) * 40 - 30 : 0;
  const peck = !walking && !flap ? Math.max(0, Math.sin(frame / 7)) * 10 : 0;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <g transform={`translate(${x} ${y - step}) scale(${scale * face} ${scale})`}>
        {/* legs */}
        <path d={`M-10 40 L${-16 + step} 92 M18 40 L${22 - step} 92`} stroke="#f59f00" strokeWidth={9} strokeLinecap="round" />
        <path d="M-30 92 L0 92 M8 92 L38 92" stroke="#f59f00" strokeWidth={8} strokeLinecap="round" />
        {/* tail */}
        {[-40, -15, 10].map((a, i) => (
          <path key={i} d={`M-50 -10 Q-130 ${-90 + i * 30} -110 ${10 + i * 20}`} fill="none" stroke={i === 1 ? "#2b8a3e" : "#1b1430"} strokeWidth={22} strokeLinecap="round" transform={`rotate(${a / 4} -50 -10)`} />
        ))}
        {/* body */}
        <ellipse cx={0} cy={0} rx={70} ry={56} fill="#c2410c" stroke={INK} strokeWidth={8} />
        <path d="M-20 -10 Q20 30 50 -6" fill="none" stroke="#e8590c" strokeWidth={10} />
        {/* wing */}
        <g transform={`rotate(${wing} -10 -10)`}>
          <ellipse cx={-6} cy={6} rx={40} ry={26} fill="#9a3412" stroke={INK} strokeWidth={7} />
        </g>
        {/* neck + head */}
        <g transform={`translate(52 ${-58 + peck}) rotate(${peck})`}>
          <ellipse cx={-10} cy={30} rx={26} ry={36} fill="#f08c00" stroke={INK} strokeWidth={7} />
          <circle cx={0} cy={0} r={34} fill="#e8590c" stroke={INK} strokeWidth={7} />
          {/* comb (the clue: a rooster) */}
          <path d="M-24 -24 q6 -34 18 -10 q8 -36 20 -6 q12 -30 18 6" fill="#e03131" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <path d="M28 -2 L56 8 L28 16 Z" fill="#ffd43b" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d="M22 18 q8 26 -6 26 q-8 -10 2 -24" fill="#e03131" stroke={INK} strokeWidth={5} />
          <circle cx={10} cy={-6} r={8} fill="#fff" stroke={INK} strokeWidth={3} />
          <circle cx={12} cy={-6} r={4} fill={INK} />
        </g>
      </g>
    </svg>
  );
};

const Egg: React.FC<{ x: number; y: number; at?: number; s?: number; split?: number }> = ({ x, y, at = -1e9, s = 1, split = -1 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = at > 0 ? popSpring(frame, at) : 1;
  const gap = split > 0 && frame >= split ? Math.min(1, (frame - split) / 8) * 26 : 0;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <g transform={`translate(${x} ${y}) scale(${p * s})`}>
        <ellipse cx={0} cy={4} rx={40} ry={10} fill={INK} opacity={0.2} transform="translate(0 22)" />
        {gap > 0 ? (
          <>
            <path d="M0 -36 C-34 -36 -30 30 0 30 Z" fill="#fff8e7" stroke={INK} strokeWidth={6} transform={`translate(${-gap} 0)`} />
            <path d="M0 -36 C34 -36 30 30 0 30 Z" fill="#fff8e7" stroke={INK} strokeWidth={6} transform={`translate(${gap} 0)`} />
          </>
        ) : (
          <ellipse cx={0} cy={0} rx={26} ry={34} fill="#fff8e7" stroke={INK} strokeWidth={6} />
        )}
        <ellipse cx={-8} cy={-12} rx={6} ry={10} fill="#fff" />
      </g>
    </svg>
  );
};

/** Egg rolls off the wall top to Monu's side and falls with gravity, bounces once. */
const FallingEgg: React.FC<{ rollAt: number; dropAt: number }> = ({ rollAt, dropAt }) => {
  const frame = useCurrentFrame();
  if (frame < dropAt) {
    const t = interpolate(frame, [rollAt, dropAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return <Egg x={EGG_ON_WALL.x + (WALL.x1 + 10 - EGG_ON_WALL.x) * t} y={EGG_ON_WALL.y} />;
  }
  const t = (frame - dropAt) / 30;
  const g = 3000;
  const fall = EGG_GROUND.y - EGG_ON_WALL.y;
  const tLand = Math.sqrt((2 * fall) / g);
  let y: number;
  let x: number;
  if (t < tLand) {
    y = EGG_ON_WALL.y + 0.5 * g * t * t;
    x = WALL.x1 + 10 + (EGG_GROUND.x - WALL.x1 - 10) * (t / tLand);
  } else {
    const tb = t - tLand;
    const v = g * tLand * 0.25;
    y = EGG_GROUND.y - Math.max(0, v * tb - 0.5 * g * tb * tb);
    x = EGG_GROUND.x;
  }
  return <Egg x={x} y={y} />;
};
const eggLandFrame = (dropAt: number) => dropAt + Math.round(Math.sqrt((2 * (EGG_GROUND.y - EGG_ON_WALL.y)) / 3000) * 30);

/** Arrow from the egg to a character (option A / B). */
const Arrow: React.FC<{ at: number; until: number; to: [number, number]; color: string }> = ({ at, until, to, color }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  const p = Math.min(1, (frame - at) / 8);
  const [x0, y0] = [EGG_GROUND.x, EGG_GROUND.y - 50];
  const x1 = x0 + (to[0] - x0) * p;
  const y1 = y0 + (to[1] - y0) * p;
  const mx = (x0 + x1) / 2;
  const my = Math.min(y0, y1) - 120 * p;
  const ang = Math.atan2(y1 - my, x1 - mx);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      <path d={`M${x0} ${y0} Q${mx} ${my} ${x1} ${y1}`} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" />
      <path d={`M${x0} ${y0} Q${mx} ${my} ${x1} ${y1}`} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" />
      <g transform={`translate(${x1} ${y1}) rotate(${(ang * 180) / Math.PI})`}>
        <path d="M0 0 L-40 -26 L-40 26 Z" fill={color} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      </g>
    </svg>
  );
};

const QMark: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <g transform={`translate(${x} ${y + Math.sin(frame / 6) * 8}) scale(${popSpring(frame, at)})`}>
        <SignText x={0} y={40} size={130} text="?" fill="#ffd43b" />
      </g>
    </svg>
  );
};

// ---------------- scenes ----------------
const ROO_WALL = { x: 510, y: WALL.top - 86 };
const ROO_GROUND_Y = 1400;
const RoosterOnWall = () => <Rooster path={[{ f: 0, ...ROO_WALL }]} />;

const IntroScene: React.FC = () => (
  <>
    <Camera from={0} to={F.s2} zoom={[1.0, 1.06]}>
      <Mohalla from={0} />
      <Rooster
        path={[
          { f: 0, x: 420, y: ROO_GROUND_Y },
          { f: F.s2, x: 540, y: ROO_GROUND_Y },
        ]}
      />
      <Sonu
        poses={[
          { f: 0, v: "wave" },
          { f: F.padosi, v: "present" },
        ]}
        exprs={[{ f: 0, v: "smile" }]}
        hops={[F.sonu]}
      />
      <Monu
        poses={[
          { f: 0, v: "idle" },
          { f: F.monu, v: "wave" },
          { f: F.padosi, v: "present" },
        ]}
        exprs={[
          { f: 0, v: "smile" },
          { f: F.monu, v: "grin" },
        ]}
        hops={[F.monu]}
      />
    </Camera>
    <Foreground side="right" kind="plant" />
  </>
);

const WallScene: React.FC = () => (
  <Camera from={F.s2} to={F.s3} zoom={[1.22, 1.3]} panY={[60, 60]}>
    <Mohalla from={F.s2} bricksAt={F.chhoti} />
    <Rooster
      path={[
        { f: F.s2, x: 540, y: ROO_GROUND_Y },
        { f: F.s3, x: 600, y: ROO_GROUND_Y },
      ]}
    />
    <Sparkles at={F.deewar} x={540} y={WALL.top} r={140} />
    <Sonu
      poses={[
        { f: F.s2, v: "point" },
        { f: F.chhoti, v: "shrug" },
        { f: F.deewar, v: "present" },
      ]}
      exprs={[
        { f: F.s2, v: "smile" },
        { f: F.chhoti, v: "wow" },
      ]}
    />
    <Monu
      poses={[
        { f: F.s2, v: "point" },
        { f: F.chhoti, v: "shrug" },
        { f: F.deewar, v: "present" },
      ]}
      exprs={[
        { f: F.s2, v: "smile" },
        { f: F.chhoti, v: "wow" },
      ]}
    />
  </Camera>
);

const EggScene: React.FC = () => (
  <>
    <Camera from={F.s3} to={F.s4} zoom={[1.0, 1.08]} panY={[0, 30]}>
      <Mohalla from={F.s3} dawn />
      <Rooster
        path={[
          { f: F.s3, x: 480, y: ROO_GROUND_Y },
          { f: F.chadha - 12, x: 480, y: ROO_GROUND_Y },
          { f: F.chadha, ...ROO_WALL },
        ]}
        flapAt={[F.chadha - 12, F.anda - 6]}
      />
      <Dust at={F.chadha} x={ROO_WALL.x} y={WALL.top} color="#e9d8b6" count={8} spread={0.6} />
      <Egg x={EGG_ON_WALL.x} y={EGG_ON_WALL.y} at={F.anda} />
      <Sparkles at={F.anda} x={EGG_ON_WALL.x} y={EGG_ON_WALL.y} r={90} />
      <Sonu
        poses={[
          { f: F.s3, v: "cheer" },
          { f: F.sonu2, v: "present" },
          { f: F.chadha, v: "point" },
          { f: F.anda, v: "cheer" },
        ]}
        exprs={[
          { f: F.s3, v: "smile" },
          { f: F.sonu2, v: "grin" },
          { f: F.anda, v: "wow" },
        ]}
        hops={[F.anda]}
      />
      <Monu
        poses={[
          { f: F.s3, v: "cheer" },
          { f: F.murga, v: "idle" },
          { f: F.chadha, v: "point" },
          { f: F.anda, v: "panic" },
        ]}
        exprs={[
          { f: F.s3, v: "smile" },
          { f: F.murga, v: "think" },
          { f: F.anda, v: "shock" },
        ]}
      />
    </Camera>
  </>
);

const FightScene: React.FC = () => {
  const drop = F.gira - 6;
  return (
    <Camera from={F.s4} to={F.s5} zoom={[1.18, 1.05]} panY={[50, 0]} shakeAt={[F.lad, F.kiska]}>
      <Mohalla from={F.s4} />
      <RoosterOnWall />
      <FallingEgg rollAt={F.s4} dropAt={drop} />
      <Dust at={eggLandFrame(drop)} x={EGG_GROUND.x} y={EGG_GROUND.y + 20} color="#e9d8b6" count={8} spread={0.5} />
      <Sonu
        poses={[
          { f: F.s4, v: "point" },
          { f: F.gira, v: "panic" },
          { f: F.lad, v: "point" },
          { f: F.kiska, v: "shrug" },
        ]}
        exprs={[
          { f: F.s4, v: "wow" },
          { f: F.gira, v: "shock" },
          { f: F.lad, v: "angry" },
        ]}
        hops={[F.lad]}
      />
      <Monu
        poses={[
          { f: F.s4, v: "idle" },
          { f: F.monu2, v: "cheer" },
          { f: F.lad, v: "point" },
          { f: F.kiska, v: "shrug" },
        ]}
        exprs={[
          { f: F.s4, v: "wow" },
          { f: F.monu2, v: "grin" },
          { f: F.lad, v: "angry" },
        ]}
        hops={[F.monu2, F.lad + 4]}
      />
    </Camera>
  );
};

const CrowdScene: React.FC = () => (
  <>
    <Camera from={F.s5} to={F.A} zoom={[1.0, 1.08]}>
      <Mohalla from={F.s5} crowdAt={F.mohalla} />
      <RoosterOnWall />
      <Egg x={EGG_GROUND.x} y={EGG_GROUND.y} />
      <Sonu
        poses={[
          { f: F.s5, v: "panic" },
          { f: F.faisla, v: "point" },
        ]}
        exprs={[
          { f: F.s5, v: "worried" },
          { f: F.faisla, v: "sly" },
        ]}
        sweat={[{ f: F.s5, v: true }]}
      />
      <Monu
        poses={[
          { f: F.s5, v: "panic" },
          { f: F.faisla, v: "point" },
        ]}
        exprs={[
          { f: F.s5, v: "worried" },
          { f: F.faisla, v: "sly" },
        ]}
        sweat={[{ f: F.s5, v: true }]}
      />
    </Camera>
    <Foreground side="right" kind="plant" />
  </>
);

const OptionsScene: React.FC = () => (
  <Camera from={F.A} to={F.s7} zoom={[1.0, 1.04]} panY={[40, 40]}>
    <Mohalla from={F.A} crowdAt={F.A - 30} />
    <Rooster path={[{ f: 0, ...ROO_WALL }]} flapAt={[F.murgaA]} />
    <Egg x={EGG_GROUND.x} y={EGG_GROUND.y} split={F.aadha} />
    <Arrow at={F.A} until={F.B} to={[250, 1530]} color="#ff6b6b" />
    <Arrow at={F.B} until={F.C} to={[820, 1530]} color="#4dabf7" />
    <QMark at={F.kisi} x={EGG_GROUND.x - 120} y={EGG_GROUND.y - 170} />
    <Sonu
      poses={[
        { f: F.A, v: "cheer" },
        { f: F.murgaA, v: "point" },
        { f: F.B, v: "shrug" },
        { f: F.C, v: "present" },
        { f: F.D, v: "idle" },
      ]}
      exprs={[
        { f: F.A, v: "grin" },
        { f: F.B, v: "angry" },
        { f: F.C, v: "think" },
        { f: F.D, v: "think" },
      ]}
      hops={[F.A]}
    />
    <Monu
      poses={[
        { f: F.A, v: "shrug" },
        { f: F.B, v: "cheer" },
        { f: F.taraf, v: "point" },
        { f: F.C, v: "present" },
        { f: F.D, v: "idle" },
      ]}
      exprs={[
        { f: F.A, v: "angry" },
        { f: F.B, v: "grin" },
        { f: F.C, v: "think" },
        { f: F.D, v: "think" },
      ]}
      hops={[F.B]}
    />
  </Camera>
);

const OutroScene: React.FC = () => (
  <Camera from={F.s7} to={END} zoom={[1.04, 1.1]} panY={[40, 40]}>
    <Mohalla from={F.s7} crowdAt={F.s7 - 30} />
    <Rooster path={[{ f: 0, ...ROO_WALL }]} flapAt={[F.follow]} />
    <Egg x={EGG_GROUND.x} y={EGG_GROUND.y} />
    <Sonu
      poses={[
        { f: F.s7, v: "shrug" },
        { f: F.comment, v: "point" },
        { f: F.follow, v: "wave" },
      ]}
      exprs={[
        { f: F.s7, v: "think" },
        { f: F.comment, v: "grin" },
      ]}
    />
    <Monu
      poses={[
        { f: F.s7, v: "shrug" },
        { f: F.answer, v: "cheer" },
      ]}
      exprs={[
        { f: F.s7, v: "think" },
        { f: F.answer, v: "wow" },
      ]}
      hops={[F.answer]}
    />
  </Camera>
);

// ---------------- sound ----------------
type S = { f: number; s: string; v: number };
const SFX: S[] = [
  { f: 0, s: "whoosh", v: 0.2 },
  { f: 0, s: "pop", v: 0.18 },
  { f: F.sonu, s: "pop", v: 0.2 },
  { f: F.monu, s: "pop", v: 0.2 },
  { f: F.s2, s: "whoosh", v: 0.2 },
  { f: F.chhoti, s: "thud", v: 0.15 },
  { f: F.chhoti + 2, s: "thud", v: 0.12 },
  { f: F.deewar, s: "pop", v: 0.2 },
  { f: F.s3, s: "whoosh", v: 0.2 },
  { f: F.s3, s: "sparkle", v: 0.12 },
  { f: F.murga, s: "pop", v: 0.15 },
  { f: F.chadha - 10, s: "whoosh", v: 0.14 },
  { f: F.chadha, s: "thud", v: 0.15 },
  { f: F.anda, s: "pop", v: 0.24 },
  { f: F.anda, s: "sparkle", v: 0.15 },
  { f: F.s4, s: "whoosh", v: 0.2 },
  { f: F.monu2, s: "pop", v: 0.2 },
  { f: F.gira - 6, s: "whoosh", v: 0.12 },
  { f: F.gira + 4, s: "thud", v: 0.2 },
  { f: F.lad, s: "slam", v: 0.22 },
  { f: F.kiska, s: "slam", v: 0.26 },
  { f: F.s5, s: "whoosh", v: 0.2 },
  { f: F.mohalla, s: "pop", v: 0.15 },
  { f: F.jama, s: "pop", v: 0.2 },
  { f: F.faisla, s: "pop", v: 0.22 },
  { f: F.A, s: "whoosh", v: 0.2 },
  { f: F.A + 8, s: "thud", v: 0.2 },
  { f: F.murgaA, s: "whoosh", v: 0.12 },
  { f: F.B, s: "whoosh", v: 0.15 },
  { f: F.B + 8, s: "thud", v: 0.2 },
  { f: F.C, s: "whoosh", v: 0.15 },
  { f: F.C + 8, s: "thud", v: 0.2 },
  { f: F.aadha, s: "click", v: 0.22 },
  { f: F.D, s: "whoosh", v: 0.15 },
  { f: F.D + 8, s: "thud", v: 0.2 },
  { f: F.kisi, s: "pop", v: 0.2 },
  { f: F.s7, s: "whoosh", v: 0.2 },
  { f: F.s7, s: "pop", v: 0.18 },
  { f: F.comment, s: "pop", v: 0.2 },
  { f: F.answer, s: "pop", v: 0.22 },
  { f: F.follow, s: "pop", v: 0.2 },
  { f: F.handle, s: "click", v: 0.3 },
  { f: F.handle, s: "sparkle", v: 0.15 },
];

const speaking = new Float32Array(END + 1);
for (const l of data.lines)
  for (let f = Math.max(0, l.startFrame - 3); f <= Math.min(END, l.endFrame + 3); f++) speaking[f] = 1;
const musicVol = (f: number) => {
  let s = 0;
  let n = 0;
  for (let k = -6; k <= 6; k++) {
    const i = f + k;
    if (i >= 0 && i <= END) {
      s += speaking[i];
      n++;
    }
  }
  const fadeOut = interpolate(f, [END - 20, END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (0.18 - 0.08 * (s / n)) * fadeOut;
};

const TILES = [
  { k: "A", t: "SONU KA", c: "#ff6b6b", f: F.A },
  { k: "B", t: "MONU KA", c: "#4dabf7", f: F.B },
  { k: "C", t: "AADHA AADHA", c: "#51cf66", f: F.C },
  { k: "D", t: "KISI KA NAHI", c: "#fcc419", f: F.D },
];

// ---------------- composition ----------------
export const MurgaAnda: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {inRange(frame, 0, F.s2) && <IntroScene />}
      {inRange(frame, F.s2, F.s3) && <WallScene />}
      {inRange(frame, F.s3, F.s4) && <EggScene />}
      {inRange(frame, F.s4, F.s5) && <FightScene />}
      {inRange(frame, F.s5, F.A) && <CrowdScene />}
      {inRange(frame, F.A, F.s7) && <OptionsScene />}
      {frame >= F.s7 && <OutroScene />}

      <NightGrade />
      <Fireflies />
      <Vignette />

      {/* TEXT */}
      <Chip text="SIRF 1% SAHI!" at={0} until={F.s2} y={250} size={110} slam from={1.08} />
      <Chip text="ANDA KISKA?" at={0} until={F.s2} y={400} size={80} color="#fff" bg="#e8590c" />
      <Chip text="PADOSI" at={F.padosi} until={F.s2} y={540} size={72} color="#fff" />
      <Chip text="BEECH MEIN DEEWAR" at={F.beech} until={F.s3} y={330} size={80} />
      <Chip text="SUBAH 4 BAJE" at={F.s3} until={F.murga} y={330} size={88} color="#fff" />
      <Chip text="LAAL MURGA" at={F.murga} until={F.anda} y={330} size={72} color="#fff" />
      <Chip text="ANDA!" at={F.anda} until={F.s4} y={330} size={120} slam />
      <Chip text="MONU KI TARAF" at={F.monu2} until={F.lad} y={330} size={84} color="#a5d8ff" />
      <Chip text="LADAI!" at={F.lad} until={F.kiska} y={330} size={110} color="#ff6b6b" slam />
      <Chip text="ANDA KISKA?" at={F.kiska} until={F.s5} x={540} y={330} size={96} slam rotate={3} />
      <Chip text="MOHALLA JAMA!" at={F.jama} until={F.faisla} y={330} size={92} />
      <Chip text="TUMHARA FAISLA" at={F.faisla} until={F.A} y={330} size={88} color="#fff" bg="#7048e8" />
      <Tiles tiles={TILES} until={F.s7} outroAt={F.comment} />
      <Chip text="DHYAN SE SOCHO" at={F.s7} until={F.comment} y={400} size={88} />
      <Chip text="COMMENT KARO" at={F.comment} until={F.answer} y={720} size={84} />
      <Chip text="ANSWER NEXT REEL" at={F.answer} y={720} size={76} color="#fff" bg="#7048e8" />
      <FollowButton at={F.follow} tapAt={F.handle} x={90} y={1110} enter="below" />

      <Grain />

      <Audio src={staticFile("voice/murgaanda.wav")} volume={1} />
      <Audio src={staticFile("music/loop.wav")} loop volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
