// MurgaAnda (Part 1): Sonu's laal murga "lays" an egg on the wall between Sonu's and Monu's houses. Whose egg? (Answer: D)
// Every cue frame comes from ./words.json (measured word times). Never hard-code times here.
// NOTE: the user's recording starts at "Sonu aur Monu padosi hain" (the hook line and "Indore ke ek mohalle mein" were not
// recorded), so the title chip carries the hook from frame 0.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
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
  SoftLight,
  Sparkles,
  Vignette,
  W,
  WordsFile,
} from "../../lib/reel";
import { FollowButton, Tiles } from "../../lib/ui";
import { FarCity, Foreground, Layer, SignText, Sky } from "../../lib/world";
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
const SONU = {
  skin: "#C68B59",
  shirt: "#1c7ed6",
  pants: "#f1f3f5",
  hair: "#2b2118",
  mustache: true,
  seed: 3,
} as const;
const MONU = {
  skin: "#8D5A3B",
  shirt: "#f8f9fa",
  pants: "#495057",
  hair: "#141414",
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

// ---------------- world ----------------
const House: React.FC<{ x: number; w: number; color: string; roof: string; name: string; door: string }> = ({
  x,
  w,
  color,
  roof,
  name,
  door,
}) => (
  <g>
    <rect x={x} y={760} width={w} height={550} fill={color} stroke={INK} strokeWidth={10} />
    <path d={`M${x - 40} 780 L${x + w / 2} 600 L${x + w + 40} 780 Z`} fill={roof} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M${x - 10 + i * (w / 3)} 772 l40 -40`} stroke={INK} strokeWidth={4} opacity={0.3} />
    ))}
    <rect x={x + w / 2 - 110} y={810} width={220} height={74} rx={12} fill="#fff8e7" stroke={INK} strokeWidth={8} />
    <SignText x={x + w / 2} y={866} size={50} text={name} fill={INK} stroke="#fff8e7" />
    <rect x={x + 40} y={950} width={130} height={130} fill="#a5d8ff" stroke={INK} strokeWidth={8} />
    <path d={`M${x + 105} 950 L${x + 105} 1080 M${x + 40} 1015 L${x + 170} 1015`} stroke={INK} strokeWidth={6} />
    <rect x={x + w - 200} y={1000} width={140} height={310} rx={10} fill={door} stroke={INK} strokeWidth={8} />
    <circle cx={x + w - 82} cy={1160} r={9} fill="#ffd43b" stroke={INK} strokeWidth={4} />
  </g>
);

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
          // the top row of bricks bounces in on "chhoti"
          const pop = r === 0 && bricksAt > 0 ? popSpring(frame, bricksAt + c * 2) : 1;
          return (
            <rect
              key={`${r}-${c}`}
              x={bx}
              y={by - (1 - pop) * 60}
              width={60}
              height={rh}
              fill={(r + c) % 2 ? "#c0644a" : "#d9774f"}
              stroke={INK}
              strokeWidth={5}
              opacity={pop}
            />
          );
        }),
      )}
      <rect x={WALL.x0 - 8} y={WALL.top - 14} width={WALL.x1 - WALL.x0 + 16} height={18} rx={6} fill="#adb5bd" stroke={INK} strokeWidth={6} />
    </g>
  );
};

/** Neighbours peek out of windows and over the roofs on "mohalla". */
const Crowd: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const heads = [
    { x: 105, y: 1020, c: "#e0a370", d: 0 },
    { x: 815, y: 1020, c: "#b97a50", d: 3 },
    { x: 60, y: 760, c: "#c68b59", d: 6 },
    { x: 330, y: 700, c: "#8d5a3b", d: 9 },
    { x: 960, y: 740, c: "#e0a370", d: 12 },
    { x: 700, y: 690, c: "#c68b59", d: 15 },
  ];
  return (
    <g>
      {heads.map((h, i) => {
        const p = popSpring(frame, at + h.d);
        const bob = Math.sin((frame + i * 7) / 6) * 4;
        return (
          <g key={i} transform={`translate(${h.x} ${h.y + (1 - p) * 80 + bob})`} opacity={Math.min(1, p * 2)}>
            <circle r={48} fill={h.c} stroke={INK} strokeWidth={7} />
            <path d="M-46 -12 Q0 -70 46 -12" fill="#2b2118" stroke={INK} strokeWidth={6} />
            <circle cx={-15} cy={4} r={7} fill={INK} />
            <circle cx={15} cy={4} r={7} fill={INK} />
            <ellipse cx={0} cy={26} rx={10} ry={12} fill={INK} />
          </g>
        );
      })}
    </g>
  );
};

const Mohalla: React.FC<{ from: number; bricksAt?: number; crowdAt?: number; sunrise?: number }> = ({
  from,
  bricksAt,
  crowdAt = 1e9,
  sunrise,
}) => {
  const frame = useCurrentFrame();
  const sunY = sunrise !== undefined ? interpolate(frame, [sunrise, sunrise + 40], [560, 330], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 300;
  return (
    <>
      <Sky top={sunrise !== undefined ? "#ffb26b" : "#74c0fc"} bottom={sunrise !== undefined ? "#ffe8a3" : "#d0ebff"} />
      <Layer depth={0.12} from={from} drift={-0.5}>
        <circle cx={900} cy={sunY} r={80} fill="#ffd43b" opacity={0.95} />
        <FarCity seed="indore" color="#c9a27e" baseY={1000} />
      </Layer>
      {/* near layer does not drift: the rooster and egg stand on the wall in screen space */}
      <Layer depth={0.3} from={from} drift={0}>
        {/* neem tree behind the wall */}
        <rect x={510} y={620} width={60} height={460} fill="#7a4f2a" stroke={INK} strokeWidth={8} />
        {[
          [540, 560, 170],
          [440, 640, 120],
          [650, 640, 120],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={i ? "#2f9e44" : "#37b24d"} stroke={INK} strokeWidth={8} />
        ))}
        {/* washing line */}
        <path d="M-150 960 Q-60 990 30 960" stroke={INK} strokeWidth={4} fill="none" />
        <rect x={-120} y={965} width={50} height={70} fill="#ff8787" stroke={INK} strokeWidth={4} />
        <House x={-20} w={460} color="#74c0fc" roof="#c0644a" name="SONU" door="#1864ab" />
        <House x={640} w={460} color="#f783ac" roof="#b5523b" name="MONU" door="#a61e4d" />
        <Crowd at={crowdAt} />
        {/* ground */}
        <rect x={-200} y={WALL.base} width={W + 400} height={H - WALL.base} fill="#d8b98a" />
        <rect x={-200} y={WALL.base} width={W + 400} height={14} fill={INK} opacity={0.25} />
        {[60, 300, 760, 980].map((gx, i) => (
          <path key={i} d={`M${gx} ${WALL.base + 60} l-14 -30 M${gx} ${WALL.base + 60} l0 -36 M${gx} ${WALL.base + 60} l14 -30`} stroke="#5c940d" strokeWidth={6} strokeLinecap="round" />
        ))}
        <Wall bricksAt={bricksAt} />
      </Layer>
    </>
  );
};

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
      <Mohalla from={F.s3} sunrise={F.s3} />
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

      <SoftLight />
      <Vignette />

      {/* TEXT */}
      <Chip text="SIRF 1% SAHI!" at={0} until={F.s2} y={250} size={110} slam from={1.08} />
      <Chip text="ANDA KISKA?" at={0} until={F.s2} y={400} size={80} color="#fff" bg="#e8590c" />
      <Chip text="PADOSI" at={F.padosi} until={F.s2} y={540} size={72} color="#fff" />
      <Chip text="BEECH MEIN DEEWAR" at={F.beech} until={F.s3} y={330} size={80} />
      <Chip text="EK SUBAH" at={F.s3} until={F.murga} y={330} size={88} color="#fff" />
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
