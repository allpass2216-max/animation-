// DinnerSecret (Part 1): "2 raaz, 1 dinner" — you bunked coaching, Chachu lost his job; Papa asks the question.
// Every cue frame comes from ./words.json (measured word times). Never hard-code times here.
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Character, Cue, Expr, Extra, PoseName } from "../../lib/Character";
import { Camera, Chip, Dust, Grain, H, INK, makeCue, popSpring, SoftLight, Vignette, W, WordsFile } from "../../lib/reel";
import { FollowButton, Tiles } from "../../lib/ui";
import { Foreground, Layer, Rays, SignText } from "../../lib/world";
import { DinnerRoom, DinnerTable, EyeZap, HomeFront, Mall, MallEntrance, ParkBench } from "./places";
import wordsData from "./words.json";

const data = wordsData as unknown as WordsFile;
const cue = makeCue(data);
export const DINNERSECRET_DURATION = data.words[data.words.length - 1].endFrame + 60; // ends 2 s after the voice

const F = {
  gyaarah: cue(1, "gyaarah"),
  coaching: cue(3, "coaching"),
  mall: cue(7, "mall"),
  chachu: cue(11, "Chachu"),
  khade: cue(12, "khade"),
  s2: cue(14, "Ghar"),
  office: cue(20, "office"),
  par: cue(23, "par"),
  naukri: cue(25, "naukri"),
  teen: cue(26, "teen"),
  s3: cue(31, "Nazrein"),
  mili: cue(32, "mili"),
  kaha: cue(37, "kaha"),
  tu: cue(38, "tu"),
  main: cue(42, "main"),
  s4: cue(47, "Usi"),
  dadi: cue(51, "Dadi"),
  beta: cue(54, "beta"),
  roz: cue(55, "roz"),
  pota: cue(60, "pota"),
  coaching2: cue(62, "coaching"),
  s5: cue(63, "Tabhi"),
  poocha: cue(66, "poocha"),
  coaching3: cue(68, "coaching"),
  kya: cue(70, "kya"),
  A: cue(72, "A"),
  sachA: cue(75, "sach"),
  B: cue(77, "B"),
  dono: cue(78, "dono"),
  C: cue(83, "C"),
  chup: cue(84, "chup"),
  D: cue(89, "D"),
  chachuD: cue(90, "Chachu"),
  chhupao: cue(95, "chhupao"),
  s7: cue(96, "Tum"),
  comment: cue(99, "Comment"),
  answer: cue(101, "answer"),
  follow: cue(106, "follow"),
  handle: cue(108, "@yourhandle"),
};
const END = DINNERSECRET_DURATION;
const inRange = (f: number, a: number, b: number) => f >= a && f < b;
const CUT_IN = F.chachu - 8; // hard cut from the street to inside the mall, just before "Chachu"

// cast
const YOU = { skin: "#B97A50", shirt: "#2f9e44", pants: "#2b3a67", hair: "#1d1420" } as const;
const YOU_BAG = { ...YOU, backpack: "#1c7ed6" } as const; // tuition bag: street, mall, eye-lock
const CHACHU = { skin: "#C98B5E", shirt: "#f1f3f5", pants: "#343a40", hair: "#1d1420", mustache: true, tie: "#c92a2a" } as const;
const PAPA = { skin: "#B97A50", shirt: "#e8a33d", pants: "#5c3d2e", hair: "#2a1e22", mustache: true, glasses: true } as const;
const DADI = { mom: true, skin: "#C98B5E", shirt: "#c2255c", pants: "#7a1f4f", hair: "#dee2e6" } as const;

// ---------------- scenes ----------------
/** Outside: he walks past the coaching centre, eyes it on "coaching", then slips into the mall on "mall". */
const EntryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, F.coaching, F.mall, F.mall + 26, CUT_IN], [190, 400, 400, 760, 780], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const walking = frame < F.coaching || (frame >= F.mall && frame < F.mall + 26);
  const bob = walking ? Math.abs(Math.sin(frame / 3.2)) * -10 : 0;
  // as he goes through the doors he shrinks a little (moving away from camera) and fades into the doorway
  const away = interpolate(frame, [F.mall + 14, CUT_IN], [1, 0.82], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fade = interpolate(frame, [CUT_IN - 8, CUT_IN], [1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Camera from={0} to={CUT_IN} zoom={[1.0, 1.08]} pan={[0, -30]}>
        <Layer depth={0.3} from={0} drift={-0.15}>
          <MallEntrance doorsAt={F.mall + 6} />
        </Layer>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
          <Extra x={950} y={1620} s={0.8} shirt="#ffa8a8" seed={2} walk={-1.8} t0={0} bag="#e64980" />
        </svg>
        <div style={{ opacity: fade }}>
          <Character
            {...YOU_BAG}
            x={x}
            y={1760 + bob - (1 - away) * 160}
            scale={0.92 * away}
            poses={[
              { f: 0, v: "idle" },
              { f: F.coaching, v: "shrug" },
              { f: F.mall, v: "point" },
              { f: F.mall + 14, v: "idle" },
            ]}
            exprs={[
              { f: 0, v: "smile" },
              { f: F.coaching, v: "sly" },
              { f: F.mall, v: "grin" },
            ]}
            look={[
              { f: 0, v: 0.6 },
              { f: F.coaching, v: -1 },
              { f: F.mall, v: 1 },
            ]}
          />
        </div>
      </Camera>
      <Foreground side="left" kind="plant" />
    </>
  );
};

const MallScene: React.FC = () => {
  const frame = useCurrentFrame();
  const chachuX = interpolate(frame, [F.chachu - 8, F.chachu + 4], [1250, 790], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const walk = 0;
  const youX = interpolate(frame, [F.chachu, F.chachu + 8], [380, 330], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // jumps back

  // ice-cream scoop falls with gravity on "khade" and splats
  const t = (frame - F.chachu) / 30;
  const scoopY = t < 0 ? 0 : Math.min(0.5 * 4200 * t * t, 420);
  const splat = scoopY >= 420;
  return (
    <>
      <Camera from={CUT_IN} to={F.s2} zoom={[1.04, 1.12]} pan={[-20, -40]} shakeAt={[F.chachu]}>
        <Layer depth={0.3} from={CUT_IN} drift={-0.5}>
          <Mall />
        </Layer>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
          <Extra x={100} y={1520} s={0.75} shirt="#a5d8ff" seed={4} walk={1.6} t0={CUT_IN} />
        </svg>
        <Character
          {...YOU_BAG}
          x={youX}
          y={1740 + walk}
          scale={0.92}
          poses={[
            { f: 0, v: "hold" },
            { f: F.chachu, v: "panic" },
          ]}
          exprs={[
            { f: 0, v: "grin" },
            { f: F.chachu, v: "shock" },
          ]}
          hops={[F.chachu - 2]}
          holding={[
            { f: 0, v: "icecream" },
            { f: F.chachu, v: "none" },
          ]}
          look={[
            { f: 0, v: 0.3 },
            { f: F.chachu, v: 1 },
          ]}
          sweat={[{ f: F.khade, v: true }]}
        />
        {frame >= F.chachu && (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
            {splat ? (
              <ellipse cx={330} cy={1745} rx={70} ry={18} fill="#ffc9de" stroke={INK} strokeWidth={6} />
            ) : (
              <circle cx={330} cy={1320 + scoopY} r={38} fill="#ffc9de" stroke={INK} strokeWidth={7} />
            )}
          </svg>
        )}
        {splat && <Dust at={F.chachu + 13} x={330} y={1740} color="#ffc9de" count={8} spread={0.6} />}
        {frame >= F.chachu - 8 && (
          <Character
            {...CHACHU}
            x={chachuX}
            y={1740}
            scale={0.92}
            flip
            poses={[{ f: F.chachu - 8, v: "panic" }]}
            exprs={[{ f: F.chachu - 8, v: "shock" }]}
            look={[{ f: 0, v: 1 }]}
            sweat={[{ f: F.chachu, v: true }]}
            seed={5}
          />
        )}
      </Camera>
      <Foreground side="left" kind="plant" />
    </>
  );
};

const OfficeLieScene: React.FC = () => {
  const frame = useCurrentFrame();
  const walkOut = interpolate(frame, [F.office, F.par], [540, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Camera from={F.s2} to={F.par} zoom={[1.06, 1.0]}>
      <Layer depth={0.3} from={F.s2} drift={-0.5}>
        <HomeFront />
      </Layer>
      <Character
        {...DADI}
        x={240}
        y={1720}
        scale={0.85}
        poses={[
          { f: F.s2, v: "wave" },
          { f: F.office, v: "cheer" },
        ]}
        exprs={[{ f: F.s2, v: "grin" }]}
        look={[{ f: 0, v: 1 }]}
      />
      <Character
        {...CHACHU}
        x={walkOut}
        y={1720 - Math.abs(Math.sin(frame / 3.5)) * 6}
        scale={0.9}
        poses={[{ f: F.s2, v: "wave" }]}
        exprs={[{ f: F.s2, v: "smile" }]}
        holding={[{ f: F.s2, v: "bag" }]}
        look={[{ f: 0, v: -1 }]}
        seed={5}
      />
    </Camera>
  );
};

const JoblessScene: React.FC = () => (
  <Camera from={F.par} to={F.s3} zoom={[1.0, 1.1]} panY={[0, -20]}>
    <Layer depth={0.3} from={F.par} drift={0.4}>
      <ParkBench tearAt={F.teen} />
    </Layer>
    <Character
      {...CHACHU}
      x={480}
      y={1720}
      scale={0.9}
      poses={[
        { f: F.par, v: "think" },
        { f: F.teen, v: "shrug" },
      ]}
      exprs={[
        { f: F.par, v: "worried" },
        { f: F.naukri, v: "sad" },
      ]}
      look={[{ f: 0, v: 0.8 }]}
      seed={5}
    />
  </Camera>
);

const LookScene: React.FC = () => (
  <Camera from={F.s3} to={F.s4} zoom={[1.25, 1.4]} panY={[220, 280]} shakeAt={[F.mili]}>
    <Layer depth={0.3} from={F.s3} drift={-0.3}>
      <Mall />
    </Layer>
    <Character
      {...YOU_BAG}
      x={320}
      y={1740}
      scale={0.92}
      poses={[
        { f: F.s3, v: "idle" },
        { f: F.main, v: "think" },
      ]}
      exprs={[
        { f: F.s3, v: "shock" },
        { f: F.tu, v: "worried" },
        { f: F.main, v: "sly" },
      ]}
      look={[{ f: 0, v: 1 }]}
      sweat={[{ f: 0, v: true }]}
    />
    <Character
      {...CHACHU}
      x={770}
      y={1740}
      scale={0.92}
      flip
      poses={[
        { f: F.s3, v: "idle" },
        { f: F.kaha, v: "think" },
      ]}
      exprs={[
        { f: F.s3, v: "shock" },
        { f: F.kaha, v: "sly" },
      ]}
      look={[{ f: 0, v: 1 }]}
      seed={5}
    />
    <EyeZap at={F.mili} x1={390} x2={700} y={1060} />
  </Camera>
);

type Diner = { who: typeof YOU | typeof CHACHU | typeof PAPA | typeof DADI; x: number; row?: "front" | "back"; poses: Cue<PoseName>[]; exprs: Cue<Expr>[]; flip?: boolean; sweat?: Cue<boolean>[]; hops?: number[]; seed: number };

/** Dinner table with the four diners; `focus` frames the camera on one x position. */
const DinnerScene: React.FC<{ from: number; to: number; zoom: [number, number]; focus?: number; diners: Diner[]; dim?: number; shakeAt?: number[] }> = ({
  from,
  to,
  zoom,
  focus = 540,
  diners,
  dim = 0,
  shakeAt = [],
}) => {
  const s = (zoom[0] + zoom[1]) / 2;
  const panX = -(focus - 540) * s;
  const panY = zoom[1] > 1.2 ? 1000 - 1152 - 114 * s : 0;
  return (
    <>
      <Camera from={from} to={to} zoom={zoom} pan={[panX, panX]} panY={[panY, panY]} shakeAt={shakeAt}>
        <Layer depth={0.2} from={from} drift={-0.3}>
          <DinnerRoom dim={dim} />
        </Layer>
        {/* back row first (Dadi, Papa), then the bigger front row at the sides (you, Chachu) */}
        {[...diners]
          .sort((a, b) => (a.row === "back" ? 0 : 1) - (b.row === "back" ? 0 : 1))
          .map((d, i) => (
            <Character
              key={i}
              {...d.who}
              x={d.x}
              y={d.row === "back" ? 1650 : 1740}
              scale={d.row === "back" ? 0.6 : 0.72}
              flip={d.flip}
              poses={d.poses}
              exprs={d.exprs}
              sweat={d.sweat}
              hops={d.hops}
              seed={d.seed}
            />
          ))}
        <DinnerTable />
      </Camera>
    </>
  );
};

const X = { you: 150, dadi: 400, papa: 680, chachu: 930 };

const DinnerIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const diners: Diner[] = [
    { who: YOU, x: X.you, poses: [{ f: F.s4, v: "idle" }, { f: F.pota, v: "panic" }], exprs: [{ f: F.s4, v: "smile" }, { f: F.pota, v: "shock" }], sweat: [{ f: F.pota, v: true }], seed: 1 },
    { who: DADI, row: "back", x: X.dadi, poses: [{ f: F.s4, v: "idle" }, { f: F.dadi, v: "cheer" }], exprs: [{ f: F.s4, v: "smile" }, { f: F.dadi, v: "grin" }], seed: 2 },
    { who: PAPA, row: "back", x: X.papa, poses: [{ f: F.s4, v: "idle" }, { f: F.dadi, v: "present" }], exprs: [{ f: F.s4, v: "smile" }, { f: F.dadi, v: "grin" }], seed: 3 },
    { who: CHACHU, x: X.chachu, flip: true, poses: [{ f: F.s4, v: "idle" }, { f: F.beta, v: "think" }], exprs: [{ f: F.s4, v: "smile" }, { f: F.beta, v: "worried" }], sweat: [{ f: F.beta, v: true }], seed: 4 },
  ];
  if (frame < F.dadi) return <DinnerScene from={F.s4} to={F.dadi} zoom={[1.0, 1.06]} diners={diners} />;
  if (frame < F.pota) return <DinnerScene from={F.dadi} to={F.pota} zoom={[1.4, 1.46]} focus={620} diners={diners} />;
  return <DinnerScene from={F.pota} to={F.s5} zoom={[1.5, 1.6]} focus={300} diners={diners} shakeAt={[F.pota]} />;
};

const PapaAsks: React.FC = () => {
  const frame = useCurrentFrame();
  const onYou = frame >= F.coaching3;
  return onYou ? (
    <Camera from={F.coaching3} to={F.A} zoom={[1.0, 1.15]} shakeAt={[F.kya]}>
      <Rays c1="#5f0f40" c2="#9a031e" />
      <Character {...YOU} x={540} y={1760} scale={1.05} poses={[{ f: 0, v: "panic" }]} exprs={[{ f: 0, v: "shock" }]} sweat={[{ f: 0, v: true }]} hops={[F.kya - 3]} />
    </Camera>
  ) : (
    <DinnerScene
      from={F.s5}
      to={F.coaching3}
      zoom={[1.45, 1.6]}
      focus={X.papa}
      dim={0.25}
      diners={[
        { who: DADI, row: "back", x: X.dadi, poses: [{ f: 0, v: "idle" }], exprs: [{ f: 0, v: "smile" }], seed: 2 },
        { who: PAPA, row: "back", x: X.papa, flip: true, poses: [{ f: 0, v: "idle" }, { f: F.poocha, v: "point" }], exprs: [{ f: 0, v: "think" }, { f: F.poocha, v: "sly" }], seed: 3 },
        { who: CHACHU, x: X.chachu, flip: true, poses: [{ f: 0, v: "idle" }], exprs: [{ f: 0, v: "worried" }], sweat: [{ f: 0, v: true }], seed: 4 },
      ]}
    />
  );
};

const OptionScene: React.FC<{ opt: "A" | "B" | "C" | "D"; from: number; to: number }> = ({ opt, from, to }) => {
  const you: Diner = {
    who: YOU,
    x: X.you,
    poses:
      opt === "A"
        ? [{ f: from, v: "present" }, { f: F.sachA, v: "hold" }]
        : opt === "B"
          ? [{ f: from, v: "point" }, { f: F.dono, v: "shrug" }]
          : opt === "C"
            ? [{ f: from, v: "think" }]
            : [{ f: from, v: "point" }],
    exprs: opt === "A" ? [{ f: from, v: "sad" }] : opt === "B" ? [{ f: from, v: "wow" }] : opt === "C" ? [{ f: from, v: "sly" }] : [{ f: from, v: "sly" }],
    seed: 1,
  };
  const dadi: Diner = { who: DADI, row: "back", x: X.dadi, poses: [{ f: from, v: opt === "B" || opt === "D" ? "panic" : "idle" }], exprs: [{ f: from, v: opt === "A" ? "worried" : opt === "C" ? "smile" : "shock" }], seed: 2 };
  const papa: Diner = { who: PAPA, row: "back", x: X.papa, poses: [{ f: from, v: opt === "C" ? "idle" : "shrug" }], exprs: [{ f: from, v: opt === "A" ? "think" : opt === "C" ? "smile" : "shock" }], seed: 3 };
  const chachu: Diner = {
    who: CHACHU,
    x: X.chachu,
    flip: true,
    poses: [{ f: from, v: opt === "A" ? "idle" : opt === "C" ? "think" : "panic" }],
    exprs: [{ f: from, v: opt === "A" ? "smile" : opt === "C" ? "sly" : opt === "B" ? "shock" : "cry" }],
    sweat: [{ f: from, v: opt !== "A" && opt !== "C" }],
    seed: 4,
  };
  // frame each option on the people it is about
  const shot: Record<string, { zoom: [number, number]; focus: number }> = {
    A: { zoom: [1.45, 1.52], focus: 300 },
    B: { zoom: [1.3, 1.36], focus: 420 },
    C: { zoom: [1.0, 1.05], focus: 540 },
    D: { zoom: [1.45, 1.52], focus: 790 },
  };
  return <DinnerScene from={from} to={to} zoom={shot[opt].zoom} focus={shot[opt].focus} diners={[you, dadi, papa, chachu]} shakeAt={opt === "B" || opt === "D" ? [from + 6] : []} />;
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Camera from={F.s7} to={END} zoom={[1.0, 1.05]}>
      <Layer depth={0.2} from={F.s7} drift={-0.3}>
        <DinnerRoom dim={0.35} />
      </Layer>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
        {[
          { x: 180, y: 1180, d: 0 },
          { x: 900, y: 1150, d: 6 },
        ].map((q, i) => {
          const p = popSpring(frame, F.s7 + q.d);
          return (
            <g key={i} transform={`translate(${q.x} ${q.y + Math.sin((frame + i * 9) / 8) * 14}) scale(${p})`}>
              <SignText x={0} y={50} size={150} text="?" fill="#fff" />
            </g>
          );
        })}
      </svg>
      <Character
        {...YOU}
        x={600}
        y={1760}
        scale={0.95}
        poses={[
          { f: F.s7, v: "scratch" },
          { f: F.follow, v: "wave" },
        ]}
        exprs={[
          { f: F.s7, v: "worried" },
          { f: F.follow, v: "grin" },
        ]}
        look={[
          { f: F.s7, v: -1 },
          { f: F.s7 + 12, v: 1 },
        ]}
      />
    </Camera>
  );
};

// ---------------- sound ----------------
type S = { f: number; s: string; v: number };
const SFX: S[] = [
  { f: 0, s: "whoosh", v: 0.2 },
  { f: 0, s: "pop", v: 0.2 },
  { f: F.gyaarah, s: "pop", v: 0.2 },
  { f: F.coaching, s: "pop", v: 0.2 },
  { f: F.mall + 6, s: "whoosh", v: 0.12 },
  { f: F.chachu - 8, s: "whoosh", v: 0.22 },
  { f: F.chachu, s: "slam", v: 0.25 },
  { f: F.chachu + 13, s: "splash", v: 0.18 },
  { f: F.s2, s: "whoosh", v: 0.2 },
  { f: F.office, s: "ding", v: 0.12 },
  { f: F.par, s: "whoosh", v: 0.2 },
  { f: F.naukri, s: "pop", v: 0.2 },
  { f: F.naukri, s: "buzzer", v: 0.08 },
  { f: F.teen, s: "whoosh", v: 0.12 },
  { f: F.teen, s: "pop", v: 0.2 },
  { f: F.s3, s: "whoosh", v: 0.2 },
  { f: F.mili, s: "slam", v: 0.18 },
  { f: F.tu, s: "pop", v: 0.2 },
  { f: F.main, s: "pop", v: 0.2 },
  { f: F.s4, s: "whoosh", v: 0.2 },
  { f: F.dadi, s: "sparkle", v: 0.12 },
  { f: F.roz, s: "pop", v: 0.2 },
  { f: F.coaching2, s: "pop", v: 0.2 },
  { f: F.s5, s: "whoosh", v: 0.22 },
  { f: F.poocha, s: "tick", v: 0.2 },
  { f: F.coaching3, s: "whoosh", v: 0.22 },
  { f: F.kya, s: "slam", v: 0.28 },
  { f: F.A, s: "whoosh", v: 0.2 },
  { f: F.A + 8, s: "thud", v: 0.2 },
  { f: F.B, s: "whoosh", v: 0.2 },
  { f: F.B + 8, s: "thud", v: 0.2 },
  { f: F.B + 6, s: "buzzer", v: 0.08 },
  { f: F.C, s: "whoosh", v: 0.2 },
  { f: F.C + 8, s: "thud", v: 0.2 },
  { f: F.chup, s: "click", v: 0.2 },
  { f: F.D, s: "whoosh", v: 0.2 },
  { f: F.D + 8, s: "thud", v: 0.2 },
  { f: F.chachuD, s: "slam", v: 0.15 },
  { f: F.s7, s: "whoosh", v: 0.2 },
  { f: F.s7, s: "pop", v: 0.18 },
  { f: F.comment, s: "pop", v: 0.2 },
  { f: F.answer, s: "pop", v: 0.22 },
  { f: F.follow, s: "pop", v: 0.2 },
  { f: F.handle, s: "click", v: 0.3 },
  { f: F.handle, s: "sparkle", v: 0.15 },
];

const speaking = new Float32Array(END + 1);
for (const l of data.lines) for (let f = Math.max(0, l.startFrame - 3); f <= Math.min(END, l.endFrame + 3); f++) speaking[f] = 1;
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
  { k: "A", t: "SIRF APNA SACH", c: "#ff6b6b", f: F.A },
  { k: "B", t: "DONO KA SACH", c: "#4dabf7", f: F.B },
  { k: "C", t: "DONO RAAZ RAKHO", c: "#51cf66", f: F.C },
  { k: "D", t: "CHACHU KA RAAZ", c: "#fcc419", f: F.D },
];

// ---------------- composition ----------------
export const DinnerSecret: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {inRange(frame, 0, CUT_IN) && <EntryScene />}
      {inRange(frame, CUT_IN, F.s2) && <MallScene />}
      {inRange(frame, F.s2, F.par) && <OfficeLieScene />}
      {inRange(frame, F.par, F.s3) && <JoblessScene />}
      {inRange(frame, F.s3, F.s4) && <LookScene />}
      {inRange(frame, F.s4, F.s5) && <DinnerIntro />}
      {inRange(frame, F.s5, F.A) && <PapaAsks />}
      {inRange(frame, F.A, F.B) && <OptionScene opt="A" from={F.A} to={F.B} />}
      {inRange(frame, F.B, F.C) && <OptionScene opt="B" from={F.B} to={F.C} />}
      {inRange(frame, F.C, F.D) && <OptionScene opt="C" from={F.C} to={F.D} />}
      {inRange(frame, F.D, F.s7) && <OptionScene opt="D" from={F.D} to={F.s7} />}
      {frame >= F.s7 && <OutroScene />}

      <SoftLight />
      <Vignette />

      {/* TEXT */}
      <Chip text="2 RAAZ, 1 DINNER" at={0} until={F.s2} y={250} size={96} slam from={1.1} />
      <Chip text="11 BAJE, MALL" at={F.gyaarah} until={F.coaching} y={400} size={80} color="#fff" />
      <Chip text="COACHING BUNK" at={F.coaching} until={F.s2} y={400} size={80} color="#fff" bg="#e8590c" />
      <Chip text="ROZ OFFICE?" at={F.office} until={F.par} y={330} size={96} />
      <Chip text="CHACHU KI NAUKRI" at={F.naukri} until={F.teen} y={330} size={84} />
      <Chip text="3 MAHINE PEHLE GAYI" at={F.teen} until={F.s3} y={330} size={72} color="#ff6b6b" />
      <Chip text="TU KUCH MAT BOLNA" at={F.tu} until={F.main} y={330} size={80} />
      <Chip text="MAIN BHI CHUP" at={F.main} until={F.s4} y={330} size={92} color="#fff" />
      <Chip text="ROZ OFFICE" at={F.roz} until={F.s5} y={330} size={92} />
      <Chip text="ROZ COACHING" at={F.coaching2} until={F.s5} y={470} size={92} color="#fff" />
      <Chip text="AAJ KYA PADHAYA?" at={F.kya} until={F.A} y={420} size={96} slam rotate={-3} />
      <Tiles tiles={TILES} until={F.s7} outroAt={F.comment} />
      <Chip text="TUM KYA KAROGE?" at={F.s7} until={F.comment} y={400} size={92} />
      <Chip text="COMMENT KARO" at={F.comment} until={F.answer} y={720} size={84} />
      <Chip text="ANSWER NEXT REEL" at={F.answer} y={720} size={76} color="#fff" bg="#7048e8" />
      <FollowButton at={F.follow} tapAt={F.handle} />

      <Grain />

      <Audio src={staticFile("voice/dinnersecret.wav")} volume={1} />
      <Audio src={staticFile("music/loop.wav")} loop volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

