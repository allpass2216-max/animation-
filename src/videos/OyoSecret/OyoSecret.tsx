// OyoSecret (Part 1): "2 raaz, 1 dinner" at a hotel — you walk in with your girlfriend, Chachu is the night receptionist.
// Every cue frame comes from ./words.json (measured word times; "A" corrected from the clean_voice pause file).
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Character, Cue, Expr, PoseName } from "../../lib/Character";
import { DinnerRoom, DinnerTable, EyeZap, HomeFront, ParkBench } from "../../lib/family";
import { Camera, Chip, Grain, H, makeCue, popSpring, SoftLight, Vignette, W, WordsFile } from "../../lib/reel";
import { FollowButton, Tiles } from "../../lib/ui";
import { Foreground, Layer, Rays, SignText } from "../../lib/world";
import { Counter, HotelLobby } from "./hotel";
import wordsData from "./words.json";

const data = wordsData as unknown as WordsFile;
const cue = makeCue(data);
export const OYOSECRET_DURATION = data.words[data.words.length - 1].endFrame + 60; // ends 2 s after the voice

const F = {
  das: cue(1, "das"),
  college: cue(3, "college"),
  girlfriend: cue(7, "girlfriend"),
  oyo: cue(10, "OYO"),
  reception: cue(12, "reception"),
  chachu: cue(14, "Chachu"),
  s2: cue(17, "Ghar"),
  office: cue(23, "office"),
  manager: cue(25, "manager"),
  par: cue(27, "par"),
  naukri: cue(29, "naukri"),
  teen: cue(30, "teen"),
  s3: cue(35, "Nazrein"),
  mili: cue(36, "mili"),
  kaha: cue(41, "kaha"),
  tu: cue(42, "tu"),
  main: cue(46, "main"),
  s4: cue(51, "Agle"),
  dadi: cue(55, "Dadi"),
  manager2: cue(59, "manager"),
  pota: cue(62, "pota"),
  topper: cue(64, "topper"),
  s5: cue(65, "Tabhi"),
  poocha: cue(68, "poocha"),
  raat: cue(70, "raat"),
  kahan: cue(71, "kahan"),
  A: cue(73, "A"),
  sachA: cue(76, "sach"),
  B: cue(78, "B"),
  dono: cue(79, "dono"),
  C: cue(84, "C"),
  chup: cue(85, "chup"),
  D: cue(90, "D"),
  chachuD: cue(91, "Chachu"),
  s7: cue(97, "Tum"),
  comment: cue(100, "Comment"),
  answer: cue(102, "answer"),
  follow: cue(107, "follow"),
  handle: cue(109, "@rehanfact"),
};
const END = OYOSECRET_DURATION;
const inRange = (f: number, a: number, b: number) => f >= a && f < b;

// cast
const YOU = { skin: "#B97A50", shirt: "#f8f9fa", pants: "#1b1f3b", hair: "#1d1420", blazer: "#1b1f3b", quiff: true } as const; // smart: navy blazer, white shirt, quiff
const GF = { skin: "#C98B5E", shirt: "#c2255c", pants: "#c98b5e", hair: "#2a1622", longHair: "#2a1622", earrings: true, lipstick: "#e03174", lashes: true, dress: "#c2255c" } as const; // glam: party dress, lipstick, lashes
const CHACHU_DESK = { skin: "#C98B5E", shirt: "#862e9c", pants: "#343a40", hair: "#1d1420", mustache: true, tie: "#ffd43b", cap: "#862e9c" } as const;
const CHACHU = { skin: "#C98B5E", shirt: "#f1f3f5", pants: "#343a40", hair: "#1d1420", mustache: true, tie: "#c92a2a" } as const;
const PAPA = { skin: "#B97A50", shirt: "#e8a33d", pants: "#5c3d2e", hair: "#2a1e22", mustache: true, glasses: true } as const;
const DADI = { mom: true, skin: "#C98B5E", shirt: "#c2255c", pants: "#7a1f4f", hair: "#dee2e6" } as const;

// ---------------- scenes ----------------
/** Lobby: the couple walks in; at "reception" the bell dings, at "Chachu" the receptionist turns round — it's Chachu. */
const LobbyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const walk = interpolate(frame, [0, F.reception], [-40, 0], { extrapolateRight: "clamp" });
  const bob = frame < F.reception ? Math.abs(Math.sin(frame / 3.4)) * -8 : 0;
  const turned = frame >= F.chachu;
  return (
    <>
      <Camera from={0} to={F.s2} zoom={turned ? [1.08, 1.12] : [1.0, 1.06]} pan={turned ? [0, -30] : [10, -10]} shakeAt={[F.chachu]}>
        <Layer depth={0.3} from={0} drift={-0.3}>
          <HotelLobby />
        </Layer>
        <Character
          {...CHACHU_DESK}
          x={810}
          y={1700}
          scale={0.85}
          flip={!turned}
          poses={[
            { f: 0, v: "point" },
            { f: F.chachu, v: "panic" },
          ]}
          exprs={[
            { f: 0, v: "think" },
            { f: F.chachu, v: "shock" },
          ]}
          look={[
            { f: 0, v: 1 },
            { f: F.chachu, v: -1 },
          ]}
          sweat={[{ f: F.chachu + 6, v: true }]}
          seed={5}
        />
        <Counter x={600} dingAt={F.reception} />
        <Character
          {...GF}
          x={200 + walk}
          y={1740 + bob}
          scale={0.82}
          holding={[{ f: 0, v: "purse" }, { f: F.chachu, v: "none" }]}
          poses={[
            { f: 0, v: "hold" },
            { f: F.chachu, v: "panic" },
          ]}
          exprs={[
            { f: 0, v: "grin" },
            { f: F.chachu, v: "wow" },
          ]}
          look={[{ f: 0, v: 1 }]}
          seed={7}
        />
        <Character
          {...YOU}
          x={480 + walk}
          y={1750 + bob}
          scale={0.88}
          poses={[
            { f: 0, v: "idle" },
            { f: F.oyo, v: "present" },
            { f: F.chachu, v: "panic" },
          ]}
          exprs={[
            { f: 0, v: "grin" },
            { f: F.chachu, v: "shock" },
          ]}
          look={[{ f: 0, v: 1 }]}
          sweat={[{ f: F.chachu + 4, v: true }]}
          hops={[F.chachu - 2]}
        />
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
      <Character {...DADI} x={240} y={1720} scale={0.85} poses={[{ f: F.s2, v: "wave" }, { f: F.manager, v: "cheer" }]} exprs={[{ f: F.s2, v: "grin" }]} look={[{ f: 0, v: 1 }]} />
      <Character
        {...CHACHU}
        x={walkOut}
        y={1720 - Math.abs(Math.sin(frame / 3.5)) * 6}
        scale={0.9}
        poses={[{ f: F.s2, v: "wave" }]}
        exprs={[{ f: F.s2, v: "smile" }]}
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
  <>
    <Camera from={F.s3} to={F.s4} zoom={[1.25, 1.38]} panY={[220, 270]} shakeAt={[F.mili]}>
      <Layer depth={0.3} from={F.s3} drift={-0.3}>
        <HotelLobby />
      </Layer>
      <Character
        {...CHACHU_DESK}
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
      <Counter x={610} />
      <Character
        {...YOU}
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
      <EyeZap at={F.mili} x1={390} x2={700} y={1060} />
    </Camera>
  </>
);

type Diner = { who: typeof YOU | typeof CHACHU | typeof PAPA | typeof DADI; x: number; row?: "front" | "back"; poses: Cue<PoseName>[]; exprs: Cue<Expr>[]; flip?: boolean; sweat?: Cue<boolean>[]; hops?: number[]; seed: number };
const X = { you: 150, dadi: 400, papa: 680, chachu: 930 };

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
    <Camera from={from} to={to} zoom={zoom} pan={[panX, panX]} panY={[panY, panY]} shakeAt={shakeAt}>
      <Layer depth={0.2} from={from} drift={-0.3}>
        <DinnerRoom dim={dim} />
      </Layer>
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
  );
};

const DinnerIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const diners: Diner[] = [
    { who: YOU, x: X.you, poses: [{ f: F.s4, v: "idle" }, { f: F.pota, v: "panic" }], exprs: [{ f: F.s4, v: "smile" }, { f: F.pota, v: "shock" }], sweat: [{ f: F.pota, v: true }], seed: 1 },
    { who: DADI, row: "back", x: X.dadi, poses: [{ f: F.s4, v: "idle" }, { f: F.dadi, v: "cheer" }], exprs: [{ f: F.s4, v: "smile" }, { f: F.dadi, v: "grin" }], seed: 2 },
    { who: PAPA, row: "back", x: X.papa, poses: [{ f: F.s4, v: "idle" }, { f: F.dadi, v: "present" }], exprs: [{ f: F.s4, v: "smile" }, { f: F.dadi, v: "grin" }], seed: 3 },
    { who: CHACHU, x: X.chachu, flip: true, poses: [{ f: F.s4, v: "idle" }, { f: F.manager2, v: "think" }], exprs: [{ f: F.s4, v: "smile" }, { f: F.manager2, v: "worried" }], sweat: [{ f: F.manager2, v: true }], seed: 4 },
  ];
  if (frame < F.dadi) return <DinnerScene from={F.s4} to={F.dadi} zoom={[1.0, 1.06]} diners={diners} />;
  if (frame < F.pota) return <DinnerScene from={F.dadi} to={F.pota} zoom={[1.4, 1.46]} focus={620} diners={diners} />;
  return <DinnerScene from={F.pota} to={F.s5} zoom={[1.5, 1.6]} focus={300} diners={diners} shakeAt={[F.pota]} />;
};

const PapaAsks: React.FC = () => {
  const frame = useCurrentFrame();
  return frame >= F.raat ? (
    <Camera from={F.raat} to={F.A} zoom={[1.0, 1.15]} shakeAt={[F.kahan]}>
      <Rays c1="#5f0f40" c2="#9a031e" />
      <Character {...YOU} x={540} y={1760} scale={1.05} poses={[{ f: 0, v: "panic" }]} exprs={[{ f: 0, v: "shock" }]} sweat={[{ f: 0, v: true }]} hops={[F.kahan - 3]} />
    </Camera>
  ) : (
    <DinnerScene
      from={F.s5}
      to={F.raat}
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
    poses: opt === "A" ? [{ f: from, v: "present" }, { f: F.sachA, v: "hold" }] : opt === "B" ? [{ f: from, v: "point" }, { f: F.dono, v: "shrug" }] : opt === "C" ? [{ f: from, v: "think" }] : [{ f: from, v: "point" }],
    exprs: [{ f: from, v: opt === "A" ? "sad" : opt === "B" ? "wow" : "sly" }],
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
        ].map((q, i) => (
          <g key={i} transform={`translate(${q.x} ${q.y + Math.sin((frame + i * 9) / 8) * 14}) scale(${popSpring(frame, F.s7 + q.d)})`}>
            <SignText x={0} y={50} size={150} text="?" fill="#fff" />
          </g>
        ))}
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
  { f: F.das, s: "pop", v: 0.2 },
  { f: F.oyo, s: "pop", v: 0.2 },
  { f: F.reception, s: "ding", v: 0.22 },
  { f: F.chachu, s: "slam", v: 0.25 },
  { f: F.s2, s: "whoosh", v: 0.2 },
  { f: F.manager, s: "pop", v: 0.2 },
  { f: F.par, s: "whoosh", v: 0.2 },
  { f: F.naukri, s: "buzzer", v: 0.08 },
  { f: F.teen, s: "whoosh", v: 0.12 },
  { f: F.teen, s: "pop", v: 0.2 },
  { f: F.s3, s: "whoosh", v: 0.2 },
  { f: F.mili, s: "slam", v: 0.18 },
  { f: F.tu, s: "pop", v: 0.2 },
  { f: F.main, s: "pop", v: 0.2 },
  { f: F.s4, s: "whoosh", v: 0.2 },
  { f: F.dadi, s: "whoosh", v: 0.12 },
  { f: F.dadi, s: "sparkle", v: 0.12 },
  { f: F.manager2, s: "pop", v: 0.2 },
  { f: F.pota, s: "whoosh", v: 0.12 },
  { f: F.pota, s: "pop", v: 0.2 },
  { f: F.s5, s: "whoosh", v: 0.22 },
  { f: F.poocha, s: "tick", v: 0.2 },
  { f: F.raat, s: "whoosh", v: 0.22 },
  { f: F.kahan, s: "slam", v: 0.28 },
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
export const OyoSecret: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {inRange(frame, 0, F.s2) && <LobbyScene />}
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
      <Chip text="RAAT 10 BAJE" at={F.das} until={F.oyo} y={400} size={80} color="#fff" />
      <Chip text="OYO KI RECEPTION" at={F.oyo} until={F.s2} y={400} size={76} color="#fff" bg="#e03131" />
      <Chip text="MANAGER CHACHU?" at={F.manager} until={F.par} y={330} size={86} />
      <Chip text="3 MAHINE PEHLE GAYI" at={F.teen} until={F.s3} y={330} size={72} color="#ff6b6b" />
      <Chip text="TU KUCH MAT BOLNA" at={F.tu} until={F.main} y={330} size={80} />
      <Chip text="MAIN BHI CHUP" at={F.main} until={F.s4} y={330} size={92} color="#fff" />
      <Chip text="BETA MANAGER" at={F.manager2} until={F.s5} y={330} size={88} />
      <Chip text="POTA TOPPER" at={F.pota} until={F.s5} y={470} size={88} color="#fff" />
      <Chip text="KAL RAAT KAHAN THE?" at={F.kahan} until={F.A} y={420} size={84} slam rotate={-3} />
      <Tiles tiles={TILES} until={F.s7} outroAt={F.comment} />
      <Chip text="TUM KYA KAROGE?" at={F.s7} until={F.comment} y={400} size={92} />
      <Chip text="COMMENT KARO" at={F.comment} until={F.answer} y={720} size={84} />
      <Chip text="ANSWER NEXT REEL" at={F.answer} y={720} size={76} color="#fff" bg="#7048e8" />
      <FollowButton at={F.follow} tapAt={F.handle} />

      <Grain />

      <Audio src={staticFile("voice/oyosecret.wav")} volume={1} />
      <Audio src={staticFile("music/loop.wav")} loop volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
