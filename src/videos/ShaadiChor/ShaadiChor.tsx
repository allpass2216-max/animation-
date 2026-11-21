// ShaadiChor (Part 1): the dulhan's haar is stolen on the wedding night; Inspector Rana lines up 4 suspects.
// Clue: photographer Vicky says his RIGHT (daayan) hand is broken; in the lineup his plaster is on his LEFT arm. Answer: C.
// Every cue frame comes from ./words.json (measured word times) or ./pauses.json (measured pauses). Never hard-code times.
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
  Grain,
  makeCue,
  popSpring,
  SoftLight,
  Sparkles,
  Vignette,
  WordsFile,
} from "../../lib/reel";
import { FollowButton, Tiles } from "../../lib/ui";
import { CoinRain } from "../AiCrore/screens";
import pausesData from "./pauses.json";
import wordsData from "./words.json";
import {
  Chhat,
  DressingRoom,
  FairyLights,
  HundredNote,
  Kitchen,
  LineupHall,
  Magnifier,
  Marigolds,
  MehendiCorner,
  PhotoStage,
  PrizeBackdrop,
  SharePlane,
  Spot,
} from "./world";

const data = wordsData as unknown as WordsFile;
const cue = makeCue(data);
export const SHAADICHOR_DURATION = data.words[data.words.length - 1].endFrame + 60; // ends 2 s after the voice

// Where the aligner drifted (the recognizer heard little in a few spans), the word start is the END of the measured pause
// just before it: afterPause(seconds) returns the first pause end at or after that time, in frames.
const pauses = (pausesData as { pauses: { start: number; end: number }[] }).pauses;
const afterPause = (t: number) => Math.round((pauses.find((p) => p.end >= t)?.end ?? t) * 30);

const F = {
  dulhan: afterPause(1.0), // "Shaadi ki raat" is 0-0.99 s, then a pause, then "dulhan"
  haar: cue(5, "haar"),
  gayab: cue(6, "gayab"),
  chor: afterPause(2.5), // pause 2.38-2.64 s, then "chor isi kamre"
  s2: cue(12, "Inspector"),
  rana: cue(13, "Rana"),
  chaaron: cue(15, "chaaron"),
  line: cue(17, "line"),
  s3: cue(21, "Halwai"),
  ramesh: cue(22, "Ramesh"),
  kitchen: cue(27, "kitchen"),
  s4: cue(30, "Cousin"),
  neha: cue(31, "Neha"),
  mehendi: cue(34, "mehendi"),
  s5: cue(38, "Photographer"),
  vicky: cue(39, "Vicky"),
  daayan: cue(42, "daayan"),
  toota: cue(44, "toota"),
  churaunga: cue(48, "churaunga"),
  s6: cue(49, "Kamla"),
  chhat: cue(54, "chhat"),
  s7: afterPause(16.4), // "Tabhi" right after "...par thi"
  muskuraya: cue(59, "muskuraya"),
  dhyan: afterPause(17.9), // pause 17.96-18.10 s, then "dhyan se dekho"
  ek: afterPause(18.9), // pause 18.95-19.09 s, then "ek ne khud ko pakadwa diya"
  A: afterPause(20.5), // pause 20.55-20.69 s, then "A"
  B: afterPause(21.5),
  C: afterPause(22.4),
  D: afterPause(23.55),
  s9: cue(78, "Sahi"),
  sau: cue(83, "sau"),
  cash: cue(85, "cash"),
  comment: cue(87, "comment"),
  dost: cue(90, "dost"),
  share: cue(92, "share"),
  s10: cue(96, "Winner"),
  part: cue(99, "part"),
  answer: cue(102, "answer"),
  follow: cue(107, "follow"),
  handle: cue(109, "@rehanfact"),
};
const END = SHAADICHOR_DURATION;
const inRange = (f: number, a: number, b: number) => f >= a && f < b;

// ---------------- characters (dressed for their jobs) ----------------
const DULHAN = {
  skin: "#D9A066",
  shirt: "#c92a2a",
  dress: "#c92a2a",
  pants: "#a61e4d",
  longHair: "#1d1420",
  hair: "#1d1420",
  lipstick: "#c2255c",
  lashes: true,
  earrings: true,
  bindi: true,
  veil: "#e8590c",
  mehendi: true,
  seed: 2,
} as const;
const INSPECTOR = {
  skin: "#B97A50",
  shirt: "#b59f6b",
  pants: "#a08a55",
  hair: "#1d1420",
  mustache: true,
  policeCap: true,
  police: true,
  seed: 5,
} as const;
const RAMESH = {
  skin: "#8D5A3B",
  shirt: "#f8f9fa",
  pants: "#f1f3f5",
  hair: "#2b2118",
  mustache: true,
  topi: "#f8f9fa",
  apron: "#ffd8a8",
  seed: 7,
} as const;
const NEHA = {
  skin: "#E0A370",
  shirt: "#f783ac",
  dress: "#fcc419",
  pants: "#e64980",
  longHair: "#2b1a12",
  hair: "#2b1a12",
  lipstick: "#d6336c",
  lashes: true,
  earrings: true,
  bindi: true,
  mehendi: true,
  seed: 4,
} as const;
const VICKY = {
  skin: "#C68B59",
  shirt: "#364fc7",
  pants: "#343a40",
  hair: "#1d1420",
  quiff: true,
  beard: true,
  camera: true,
  seed: 9,
} as const;
const KAMLA = {
  skin: "#9c6644",
  shirt: "#2f9e44",
  pants: "#2b8a3e",
  hair: "#868e96",
  mom: true,
  seed: 11,
} as const;

type Act = {
  x: number;
  y?: number;
  scale?: number;
  flip?: boolean;
  poses: Cue<PoseName>[];
  exprs: Cue<Expr>[];
  hops?: number[];
  look?: Cue<number>[];
  sweat?: Cue<boolean>[];
  holding?: Cue<"none" | "phone" | "ladle" | "broom">[];
};
const mk =
  (base: object, extra: object = {}) =>
  ({ y = 1760, scale = 0.92, ...p }: Act) => <Character {...base} {...extra} y={y} scale={scale} {...p} />;
const Dulhan = mk(DULHAN);
const Inspector = mk(INSPECTOR);
const Ramesh = mk(RAMESH);
const Neha = mk(NEHA);
const VickyCloseUp = mk(VICKY, { sling: "right" }); // what he SAYS: his right arm
const VickyLineup = mk(VICKY, { sling: "left" }); // the slip: plaster on the LEFT arm
const Kamla = mk(KAMLA);

// ---------------- scenes ----------------
const BrideScene: React.FC = () => {
  const frame = useCurrentFrame();
  const neck = { x: 360, y: 1760 - 470 * 0.95 };
  const missing = frame >= F.haar;
  return (
    <>
      <Camera from={0} to={F.s2} zoom={[1.0, 1.1]} pan={[0, -20]} shakeAt={[F.gayab, F.chor]}>
        <DressingRoom boxGlowAt={F.chor} />
        <FairyLights y={150} />
        <Dulhan
          x={360}
          scale={0.95}
          poses={[
            { f: 0, v: "hold" },
            { f: F.haar, v: "idle" },
            { f: F.haar + 4, v: "hold" },
            { f: F.gayab, v: "panic" },
          ]}
          exprs={[
            { f: 0, v: "smile" },
            { f: F.haar, v: "worried" },
            { f: F.gayab, v: "shock" },
          ]}
          look={[
            { f: 0, v: 1 },
            { f: F.gayab, v: -1 },
            { f: F.chor, v: 1 },
          ]}
          hops={[F.gayab]}
        />
        {missing && (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
            <path
              d={`M${neck.x - 74} ${neck.y - 50} Q${neck.x} ${neck.y + 70} ${neck.x + 74} ${neck.y - 50}`}
              fill="none"
              stroke="#ffd43b"
              strokeWidth={8}
              strokeDasharray="14 12"
              opacity={0.5 + 0.5 * Math.sin(frame / 3)}
            />
          </svg>
        )}
        {frame < F.haar && <Sparkles at={4} x={760} y={800} r={160} />}
      </Camera>
      <Marigolds y={-60} blur={4} />
    </>
  );
};

const InspectorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const walkX = interpolate(frame, [F.s2, F.rana], [900, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineup = [
    { C: Ramesh, x: 560, holding: "ladle" as const },
    { C: Neha, x: 700 },
    { C: VickyLineup, x: 840 },
    { C: Kamla, x: 980, holding: "broom" as const },
  ];
  return (
    <>
      <Camera from={F.s2} to={F.s3} zoom={[1.0, 1.06]}>
        <LineupHall />
        {lineup.map((s, i) =>
          frame >= F.chaaron + i * 3 ? (
            <s.C
              key={i}
              x={s.x}
              y={1640}
              scale={0.4 * Math.min(1, popSpring(frame, F.chaaron + i * 3))}
              poses={[{ f: 0, v: "idle" }]}
              exprs={[{ f: 0, v: "worried" }]}
              holding={[{ f: 0, v: s.holding ?? "none" }]}
            />
          ) : null,
        )}
        <Inspector
          x={walkX}
          y={1800}
          scale={0.9}
          poses={[
            { f: F.s2, v: "wave" },
            { f: F.rana, v: "idle" },
            { f: F.chaaron, v: "point" },
          ]}
          exprs={[
            { f: F.s2, v: "think" },
            { f: F.rana, v: "sly" },
          ]}
          hops={[F.s2 + 6, F.s2 + 18]}
        />
      </Camera>
      <Marigolds y={-120} n={6} blur={4} />
    </>
  );
};

const SuspectScene: React.FC<{
  from: number;
  to: number;
  bg: React.ReactNode;
  children: React.ReactNode;
}> = ({ from, to, bg, children }) => (
  <Camera from={from} to={to} zoom={[1.0, 1.07]} panY={[0, 20]}>
    {bg}
    {children}
  </Camera>
);

const LineupScene: React.FC<{ from: number; to: number; spot?: boolean }> = ({ from, to, spot }) => {
  const frame = useCurrentFrame();
  const xs = [140, 400, 670, 940];
  const active = spot ? [F.A, F.B, F.C, F.D].filter((f) => frame >= f).length - 1 : -1;
  return (
    <Camera from={from} to={to} zoom={[1.0, 1.04]}>
      <LineupHall />
      {xs.map((x, i) => (
        <Spot key={i} x={x} on={i === active} />
      ))}
      <Ramesh
        x={xs[0]}
        y={1770}
        scale={0.66}
        poses={[{ f: 0, v: "idle" }]}
        exprs={[{ f: 0, v: active === 0 ? "worried" : "smile" }]}
        holding={[{ f: 0, v: "ladle" }]}
        hops={spot ? [F.A] : []}
      />
      <Neha
        x={xs[1]}
        y={1770}
        scale={0.66}
        poses={[{ f: 0, v: "idle" }]}
        exprs={[{ f: 0, v: active === 1 ? "worried" : "smile" }]}
        hops={spot ? [F.B] : []}
      />
      <VickyLineup
        x={xs[2]}
        y={1770}
        scale={0.66}
        poses={[{ f: 0, v: "idle" }]}
        exprs={[{ f: 0, v: active === 2 ? "worried" : "sly" }]}
        hops={spot ? [F.C] : []}
      />
      <Kamla
        x={xs[3]}
        y={1770}
        scale={0.66}
        poses={[{ f: 0, v: "idle" }]}
        exprs={[{ f: 0, v: active === 3 ? "worried" : "smile" }]}
        holding={[{ f: 0, v: "broom" }]}
        hops={spot ? [F.D] : []}
      />
      {!spot && <Magnifier from={F.ek} to={F.A - 2} />}
    </Camera>
  );
};

const PrizeScene: React.FC = () => (
  <Camera from={F.s9} to={F.s10} zoom={[1.0, 1.06]}>
    <PrizeBackdrop from={F.s9} />
    <HundredNote at={F.sau} x={600} y={1000} />
    <CoinRain at={F.cash} floorY={1760} count={16} />
    <SharePlane at={F.share} />
    <Inspector
      x={230}
      y={1800}
      scale={0.85}
      poses={[
        { f: F.s9, v: "present" },
        { f: F.sau, v: "cheer" },
        { f: F.comment, v: "point" },
        { f: F.dost, v: "wave" },
      ]}
      exprs={[
        { f: F.s9, v: "smile" },
        { f: F.sau, v: "grin" },
      ]}
      hops={[F.sau]}
    />
  </Camera>
);

// ---------------- sound ----------------
type S = { f: number; s: string; v: number };
const SFX: S[] = [
  { f: 0, s: "whoosh", v: 0.2 },
  { f: 0, s: "sparkle", v: 0.15 },
  { f: F.haar, s: "tick", v: 0.2 },
  { f: F.gayab, s: "slam", v: 0.24 },
  { f: F.chor, s: "thud", v: 0.2 },
  { f: F.s2, s: "whoosh", v: 0.2 },
  { f: F.s2 + 6, s: "thud", v: 0.12 },
  { f: F.s2 + 18, s: "thud", v: 0.12 },
  { f: F.rana, s: "pop", v: 0.2 },
  { f: F.chaaron, s: "pop", v: 0.15 },
  { f: F.chaaron + 3, s: "pop", v: 0.15 },
  { f: F.chaaron + 6, s: "pop", v: 0.15 },
  { f: F.chaaron + 9, s: "pop", v: 0.15 },
  { f: F.s3, s: "whoosh", v: 0.2 },
  { f: F.ramesh, s: "pop", v: 0.2 },
  { f: F.kitchen, s: "splash", v: 0.1 },
  { f: F.s4, s: "whoosh", v: 0.2 },
  { f: F.neha, s: "pop", v: 0.2 },
  { f: F.mehendi, s: "sparkle", v: 0.15 },
  { f: F.s5, s: "whoosh", v: 0.2 },
  { f: F.vicky, s: "click", v: 0.3 },
  { f: F.daayan, s: "pop", v: 0.2 },
  { f: F.toota, s: "thud", v: 0.15 },
  { f: F.churaunga, s: "click", v: 0.25 },
  { f: F.s6, s: "whoosh", v: 0.2 },
  { f: F.s6, s: "pop", v: 0.2 },
  { f: F.chhat, s: "tick", v: 0.15 },
  { f: F.s7, s: "whoosh", v: 0.2 },
  { f: F.muskuraya, s: "ding", v: 0.15 },
  { f: F.dhyan, s: "whoosh", v: 0.22 },
  { f: F.dhyan, s: "slam", v: 0.24 },
  { f: F.ek, s: "whoosh", v: 0.12 },
  { f: F.A, s: "thud", v: 0.2 },
  { f: F.B, s: "thud", v: 0.2 },
  { f: F.C, s: "thud", v: 0.2 },
  { f: F.D, s: "thud", v: 0.2 },
  { f: F.s9, s: "whoosh", v: 0.22 },
  { f: F.sau, s: "pop", v: 0.24 },
  { f: F.cash, s: "sparkle", v: 0.2 },
  { f: F.comment, s: "pop", v: 0.2 },
  { f: F.share, s: "whoosh", v: 0.18 },
  { f: F.s10, s: "whoosh", v: 0.2 },
  { f: F.s10, s: "pop", v: 0.2 },
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
  { k: "A", t: "RAMESH", c: "#ff6b6b", f: F.A },
  { k: "B", t: "NEHA", c: "#4dabf7", f: F.B },
  { k: "C", t: "VICKY", c: "#51cf66", f: F.C },
  { k: "D", t: "KAMLA BAI", c: "#fcc419", f: F.D },
];

// ---------------- composition ----------------
export const ShaadiChor: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {inRange(frame, 0, F.s2) && <BrideScene />}
      {inRange(frame, F.s2, F.s3) && <InspectorScene />}
      {inRange(frame, F.s3, F.s4) && (
        <SuspectScene from={F.s3} to={F.s4} bg={<Kitchen />}>
          <Ramesh
            x={400}
            poses={[
              { f: F.s3, v: "wave" },
              { f: F.ramesh, v: "present" },
              { f: F.kitchen, v: "point" },
            ]}
            exprs={[
              { f: F.s3, v: "smile" },
              { f: F.kitchen, v: "grin" },
            ]}
            holding={[{ f: 0, v: "ladle" }]}
            hops={[F.ramesh]}
          />
        </SuspectScene>
      )}
      {inRange(frame, F.s4, F.s5) && (
        <SuspectScene from={F.s4} to={F.s5} bg={<MehendiCorner />}>
          <Neha
            x={480}
            poses={[
              { f: F.s4, v: "wave" },
              { f: F.mehendi, v: "cheer" },
            ]}
            exprs={[
              { f: F.s4, v: "smile" },
              { f: F.mehendi, v: "grin" },
            ]}
            hops={[F.neha]}
          />
          <Sparkles at={F.mehendi} x={480} y={1100} r={260} />
        </SuspectScene>
      )}
      {inRange(frame, F.s5, F.s6) && (
        <SuspectScene from={F.s5} to={F.s6} bg={<PhotoStage flashAt={[F.vicky, F.churaunga]} />}>
          <VickyCloseUp
            x={440}
            poses={[
              { f: F.s5, v: "idle" },
              { f: F.daayan, v: "point" },
              { f: F.churaunga, v: "shrug" },
            ]}
            exprs={[
              { f: F.s5, v: "smile" },
              { f: F.daayan, v: "sad" },
              { f: F.churaunga, v: "sly" },
            ]}
            look={[{ f: 0, v: -1 }]}
          />
        </SuspectScene>
      )}
      {inRange(frame, F.s6, F.s7) && (
        <SuspectScene from={F.s6} to={F.s7} bg={<Chhat />}>
          <Kamla
            x={480}
            poses={[
              { f: F.s6, v: "idle" },
              { f: F.chhat, v: "point" },
            ]}
            exprs={[
              { f: F.s6, v: "worried" },
              { f: F.chhat, v: "smile" },
            ]}
            holding={[{ f: 0, v: "broom" }]}
          />
        </SuspectScene>
      )}
      {inRange(frame, F.s7, F.dhyan) && (
        <Camera from={F.s7} to={F.dhyan} zoom={[1.1, 1.2]} panY={[60, 80]}>
          <LineupHall />
          <Inspector
            x={540}
            scale={1.0}
            poses={[
              { f: F.s7, v: "idle" },
              { f: F.muskuraya, v: "present" },
            ]}
            exprs={[
              { f: F.s7, v: "think" },
              { f: F.muskuraya, v: "sly" },
            ]}
            look={[{ f: 0, v: 0 }]}
          />
        </Camera>
      )}
      {inRange(frame, F.dhyan, F.A) && <LineupScene from={F.dhyan} to={F.A} />}
      {inRange(frame, F.A, F.s9) && <LineupScene from={F.A} to={F.s9} spot />}
      {inRange(frame, F.s9, F.s10) && <PrizeScene />}
      {frame >= F.s10 && (
        <Camera from={F.s10} to={END} zoom={[1.0, 1.05]}>
          <LineupHall />
          <Inspector
            x={240}
            y={1850}
            scale={0.8}
            poses={[
              { f: F.s10, v: "present" },
              { f: F.answer, v: "point" },
              { f: F.follow, v: "wave" },
            ]}
            exprs={[
              { f: F.s10, v: "smile" },
              { f: F.answer, v: "sly" },
              { f: F.follow, v: "grin" },
            ]}
            hops={[F.s10]}
          />
        </Camera>
      )}

      <SoftLight />
      <Vignette />

      {/* TEXT */}
      <Chip text="HAAR GAYAB!" at={0} until={F.s2} y={250} size={120} slam from={1.08} />
      <Chip text="SHAADI KI RAAT" at={0} until={F.gayab} y={400} size={64} color="#fff" bg="#c92a2a" />
      <Chip text="CHOR ISI KAMRE MEIN" at={F.chor} until={F.s2} y={400} size={70} color="#fff" />
      <Chip text="INSPECTOR RANA" at={F.rana} until={F.chaaron} y={330} size={84} />
      <Chip text="4 SUSPECTS" at={F.chaaron} until={F.s3} y={330} size={100} color="#fff" bg="#1864ab" />
      <Chip text="RAMESH · HALWAI" at={F.ramesh} until={F.s4} y={300} size={76} />
      <Chip text="KITCHEN MEIN THA" at={F.kitchen} until={F.s4} y={430} size={70} color="#fff" bg="#e8590c" />
      <Chip text="NEHA · COUSIN" at={F.neha} until={F.s5} y={300} size={80} color="#fff" />
      <Chip text="MEHENDI LAGWA RAHI" at={F.mehendi} until={F.s5} y={430} size={66} color="#fff" bg="#2b8a3e" />
      <Chip text="VICKY · PHOTOGRAPHER" at={F.vicky} until={F.s6} y={300} size={66} />
      <Chip text="DAAYAN HAATH TOOTA" at={F.daayan} until={F.s6} y={430} size={70} color="#fff" bg="#c92a2a" />
      <Chip text="KAMLA BAI" at={F.s6} until={F.s7} y={300} size={90} />
      <Chip text="CHHAT PAR THI" at={F.chhat} until={F.s7} y={430} size={76} color="#fff" bg="#5f3dc4" />
      <Chip text="DHYAN SE DEKHO!" at={F.dhyan} until={F.A} y={420} size={100} slam rotate={3} />
      <Tiles tiles={TILES} until={F.s9} outroAt={F.answer} />
      <Chip text="₹100 CASH PRIZE" at={F.sau} until={F.s10} y={330} size={100} slam />
      <Chip text="COMMENT KARO" at={F.comment} until={F.dost} y={520} size={80} color="#fff" bg="#e8590c" />
      <Chip text="DOST KO SHARE KARO" at={F.dost} until={F.s10} y={520} size={68} color="#fff" bg="#1971c2" />
      <Chip text="WINNER PART 2 MEIN" at={F.s10} until={F.answer} y={400} size={80} />
      <Chip text="ANSWER NEXT REEL" at={F.answer} y={720} size={76} color="#fff" bg="#7048e8" />
      <FollowButton at={F.follow} tapAt={F.handle} x={90} y={840} enter="below" />

      <Grain />

      <Audio src={staticFile("voice/shaadichor.wav")} volume={1} />
      <Audio src={staticFile("music/loop.wav")} loop volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
