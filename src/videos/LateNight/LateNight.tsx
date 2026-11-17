// LateNight (Part 1): "Raat 1 baje" — mother shouts, son was out 6 hours; where was he? (A-D, as recorded).
// Every cue frame comes from ./words.json (measured word times). Never hard-code times here.
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Character, Extra } from "../../lib/Character";
import { Camera, Chip, Dust, Grain, H, INK, makeCue, popSpring, SoftLight, Sparkles, Vignette, W, WordsFile } from "../../lib/reel";
import { FollowButton, Tiles } from "../../lib/ui";
import { Foreground, Layer, Rays, SignText } from "../../lib/world";
import { Bike, Door, Interior, NightSky, OfficeDesk, Party, PillStrip, PocketBill, ShopRow, StreetLamp, WallClock } from "./night";
import wordsData from "./words.json";

const data = wordsData as unknown as WordsFile;
const cue = makeCue(data);
export const LATENIGHT_DURATION = data.words[data.words.length - 1].endFrame + 60; // ends 2 s after the voice

const F = {
  kabir: cue(3, "Kabir"),
  chillaayi: cue(7, "chillaayi"),
  jaa: cue(8, "jaa"),
  wapas: cue(9, "wapas"),
  s2: cue(12, "Woh"),
  saat: cue(14, "saat"),
  gayab: cue(17, "gayab"),
  s2b: cue(19, "kuch"),
  nikal: cue(23, "nikal"),
  s3: cue(25, "Clue"),
  dawai: cue(30, "dawai"),
  khatam: cue(33, "khatam"),
  s3b: cue(35, "aur"),
  nau: cue(39, "nau"),
  band: cue(41, "band"),
  s4: cue(44, "Kabir"),
  jeb: cue(46, "jeb"),
  saade: cue(48, "saade"),
  bill: cue(54, "bill"),
  s5: cue(56, "Toh"),
  chhe: cue(58, "chhe"),
  kahan: cue(60, "kahan"),
  A: cue(62, "A"),
  poora: cue(66, "poora"),
  B: cue(71, "B"),
  party: cue(75, "party"),
  C: cue(79, "C"),
  overtime: cue(82, "overtime"),
  D: cue(86, "D"),
  game: cue(90, "game"),
  s7: cue(94, "Gusse"),
  wapas2: cue(98, "wapas"),
  comment: cue(101, "comment"),
  answer: cue(103, "answer"),
  follow: cue(108, "follow"),
  handle: cue(109, "@yourhandle"),
};
const END = LATENIGHT_DURATION;
const inRange = (f: number, a: number, b: number) => f >= a && f < b;

const MOM = { mom: true, skin: "#C98B5E", shirt: "#7b2d6b", hair: "#cfcfd6", pants: "#5a1f4f" } as const;
const KABIR = { skin: "#B97A50", shirt: "#3b5bdb", pants: "#2b2f3a", hair: "#1d1420" } as const;

// ---------------- scenes ----------------
const DoorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const walkIn = interpolate(frame, [F.kabir - 6, F.kabir + 14], [1200, 870], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Camera from={0} to={F.s2} zoom={[1.0, 1.1]} pan={[0, -10]} shakeAt={[F.chillaayi, F.jaa]}>
        <Layer depth={0.2} from={0} drift={-0.4}>
          <Interior />
          <WallClock x={210} y={800} r={86} hours={1 + frame / 30 / 3600} />
        </Layer>
        <Layer depth={0.4} from={0} drift={-0.4}>
          <Door x={600} y={1500} bike />
        </Layer>
        <Character
          {...MOM}
          x={330}
          y={1720}
          scale={0.95}
          poses={[
            { f: 0, v: "hold" },
            { f: F.chillaayi, v: "point" },
          ]}
          exprs={[
            { f: 0, v: "worried" },
            { f: F.kabir, v: "think" },
            { f: F.chillaayi, v: "angry" },
          ]}
          look={[
            { f: 0, v: 0.6 },
            { f: F.kabir, v: 1 },
          ]}
          hops={[F.jaa - 3]}
        />
        <Character
          {...KABIR}
          x={walkIn}
          y={1700}
          scale={0.9}
          flip
          poses={[
            { f: 0, v: "idle" },
            { f: F.chillaayi, v: "idle" },
          ]}
          exprs={[
            { f: 0, v: "smile" },
            { f: F.chillaayi, v: "shock" },
            { f: F.wapas, v: "sad" },
          ]}
          holding={[{ f: 0, v: "helmet" }]}
          look={[{ f: 0, v: 1 }]}
          seed={3}
        />
      </Camera>
      <Foreground side="left" kind="plant" />
    </>
  );
};

const WaitScene: React.FC = () => {
  const frame = useCurrentFrame();
  // clock spins from 7 PM to 1 AM during this shot (time-lapse)
  const hours = interpolate(frame, [F.s2, F.s2b - 4], [7, 13], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Camera from={F.s2} to={F.s2b} zoom={[1.05, 1.0]}>
      <Layer depth={0.2} from={F.s2} drift={0.4}>
        <Interior wall="#8a5d3b" />
        {/* window with the night outside */}
        <rect x={620} y={720} width={340} height={420} fill="#1c2452" stroke={INK} strokeWidth={10} />
        <path d="M790 720 L790 1140 M620 930 L960 930" stroke={INK} strokeWidth={10} />
      </Layer>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
        <WallClock x={360} y={820} r={150} hours={hours} />
      </svg>
      <Character
        {...MOM}
        x={720}
        y={1720}
        scale={0.9}
        flip
        poses={[{ f: F.s2, v: "hold" }]}
        holding={[{ f: F.s2, v: "phone" }]}
        exprs={[
          { f: F.s2, v: "worried" },
          { f: F.gayab, v: "sad" },
        ]}
        look={[
          { f: F.s2, v: 1 },
          { f: F.s2 + 20, v: -1 },
        ]}
      />
    </Camera>
  );
};

const LeaveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [F.nikal, F.nikal + 18], [540, 1250], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Camera from={F.s2b} to={F.s3} zoom={[1.1, 1.0]} pan={[20, 0]}>
      <NightSky moon={false} />
      <Layer depth={0.3} from={F.s2b}>
        <rect x={-200} y={760} width={560} height={720} fill="#2f2b4a" stroke={INK} strokeWidth={9} />
        <rect x={60} y={940} width={240} height={540} fill="#ffd27a" />
        <rect x={-200} y={1480} width={W + 400} height={H} fill="#3a3550" />
      </Layer>
      <Layer depth={0.6} from={F.s2b}>
        <StreetLamp x={860} y={1560} />
        <g transform={`translate(${780 + Math.max(0, frame - F.nikal) * 14} 1640) scale(0.9)`}>
          <Bike wheelSpin={Math.max(0, frame - F.nikal) * 20} />
        </g>
      </Layer>
      <Character
        {...KABIR}
        x={out}
        y={1720}
        scale={0.95}
        flip={frame >= F.nikal}
        poses={[{ f: F.s2b, v: "idle" }]}
        exprs={[{ f: F.s2b, v: "sad" }]}
        holding={[{ f: F.s2b, v: "helmet" }]}
        look={[{ f: F.s2b, v: -0.6 }]}
        seed={3}
      />
    </Camera>
  );
};

const PillScene: React.FC = () => (
  <Camera from={F.s3} to={F.s3b} zoom={[1.0, 1.12]} panY={[0, -30]}>
    <Layer depth={0.2} from={F.s3} drift={0.4}>
      <Interior wall="#7d5236" floorY={1350} />
    </Layer>
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      <rect x={-20} y={1300} width={W + 40} height={60} fill="#a0663f" stroke={INK} strokeWidth={9} />
      <PillStrip x={330} y={1180} s={1.0} emptyAt={F.s3 - 40} shakeAt={F.khatam} />
    </svg>
    <Character
      {...MOM}
      x={790}
      y={1760}
      scale={0.9}
      flip
      poses={[
        { f: F.s3, v: "think" },
        { f: F.khatam, v: "scratch" },
      ]}
      exprs={[
        { f: F.s3, v: "worried" },
        { f: F.khatam, v: "sad" },
      ]}
      look={[{ f: F.s3, v: 1 }]}
    />
  </Camera>
);

const ShutterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const clock9 = popSpring(frame, F.nau);
  return (
    <>
      <Camera from={F.s3b} to={F.s4} zoom={[1.0, 1.08]} pan={[30, -10]} shakeAt={[F.band]}>
        <NightSky moon={false} />
        <Layer depth={0.4} from={F.s3b}>
          <ShopRow y={1450} closeAt={F.band} />
          <rect x={-200} y={1450} width={W + 400} height={H} fill="#34304a" />
        </Layer>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
          <g transform={`translate(800 1540) scale(${clock9})`}>
            <rect x={-150} y={-80} width={300} height={140} rx={20} fill="#212529" stroke={INK} strokeWidth={9} />
            <SignText x={0} y={22} size={86} text="9:00" fill="#ff6b6b" stroke="#212529" />
          </g>
        </svg>
        <Dust at={F.band} x={420} y={1450} color="#adb5bd" />
      </Camera>
      <Foreground side="left" kind="pole" />
    </>
  );
};

const BillScene: React.FC = () => (
  <Camera from={F.s4} to={F.s5} zoom={[1.0, 1.06]}>
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#14183a,#2b3a7a)" }} />
    <PocketBill outAt={F.jeb} stampAt={F.bill} />
    <Sparkles at={F.saade} x={300} y={1000} r={200} />
  </Camera>
);

const RehookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const hours = interpolate(frame, [F.chhe, F.kahan], [7, 13], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Camera from={F.s5} to={F.A} zoom={[1.0, 1.12]} shakeAt={[F.kahan]}>
      <Rays c1="#1b1f4b" c2="#3b2f7a" />
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
        <WallClock x={250} y={1000} r={120} hours={hours} />
        {[
          { x: 870, y: 900, d: 0 },
          { x: 160, y: 1350, d: 8 },
          { x: 920, y: 1300, d: 14 },
        ].map((q, i) => {
          const p = popSpring(frame, F.s5 + q.d);
          return (
            <g key={i} transform={`translate(${q.x} ${q.y + Math.sin((frame + i * 9) / 8) * 14}) scale(${p}) rotate(${Math.sin((frame + i * 5) / 10) * 12})`}>
              <SignText x={0} y={50} size={170} text="?" fill="#fff" />
            </g>
          );
        })}
      </svg>
      <Character
        {...MOM}
        x={600}
        y={1720}
        scale={0.95}
        poses={[{ f: F.s5, v: "scratch" }]}
        exprs={[
          { f: F.s5, v: "worried" },
          { f: F.kahan, v: "shock" },
        ]}
        look={[
          { f: F.s5, v: -0.8 },
          { f: F.chhe, v: 0.8 },
          { f: F.kahan, v: 0 },
        ]}
        hops={[F.kahan - 3]}
      />
    </Camera>
  );
};

const OptionScene: React.FC<{ opt: "A" | "B" | "C" | "D"; from: number; to: number; beat: number }> = ({ opt, from, to, beat }) => {
  const frame = useCurrentFrame();
  const punched = frame >= beat;
  return (
    <>
      <Camera from={punched ? beat : from} to={punched ? to : beat} zoom={punched ? [1.1, 1.16] : [1.0, 1.04]} panY={punched ? [40, 50] : [0, 0]}>
        {opt === "A" && (
          <>
            <NightSky />
            <Layer depth={0.9} from={from} drift={-3}>
              <ShopRow y={1450} closeAt={-100} />
              <g transform="translate(1200 0)">
                <ShopRow y={1450} closeAt={-100} />
              </g>
              <rect x={-200} y={1450} width={3000} height={H} fill="#34304a" />
            </Layer>
          </>
        )}
        {opt === "B" && <Party flashAt={F.party} />}
        {opt === "C" && <OfficeDesk pileAt={F.overtime} />}
        {opt === "D" && (
          <>
            <NightSky />
            <Layer depth={0.4} from={from}>
              <rect x={-200} y={1450} width={W + 400} height={H} fill="#34304a" />
              <StreetLamp x={260} y={1560} />
              <rect x={420} y={1500} width={420} height={40} rx={10} fill="#8a5530" stroke={INK} strokeWidth={8} />
              <path d="M450 1540 L450 1640 M810 1540 L810 1640" stroke={INK} strokeWidth={14} />
            </Layer>
          </>
        )}
        {opt === "A" && (
          <g>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
              <g transform={`translate(330 ${1700 - Math.abs(Math.sin(frame / 3)) * 6}) scale(0.95)`}>
                <Bike wheelSpin={frame * 24} />
              </g>
            </svg>
          </g>
        )}
        {opt === "B" && (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
            {[0, 1, 2].map((i) => (
              <Extra key={i} x={120 + i * 170} y={1660 + (i % 2) * 30} s={1.05} shirt={["#ff8787", "#ffd43b", "#63e6be"][i]} seed={i + 30} hopAt={[F.party + i * 3, F.party + 14 + i * 3]} />
            ))}
          </svg>
        )}
        <Character
          {...KABIR}
          x={opt === "A" ? 760 : opt === "D" ? 640 : 760}
          y={1720}
          scale={0.85}
          flip
          poses={
            opt === "A"
              ? [{ f: from, v: "point" }, { f: F.poora, v: "scratch" }]
              : opt === "B"
                ? [{ f: from, v: "wave" }, { f: F.party, v: "cheer" }]
                : opt === "C"
                  ? [{ f: from, v: "think" }, { f: F.overtime, v: "shrug" }]
                  : [{ f: from, v: "hold" }]
          }
          exprs={
            opt === "A"
              ? [{ f: from, v: "worried" }]
              : opt === "B"
                ? [{ f: from, v: "grin" }]
                : opt === "C"
                  ? [{ f: from, v: "sad" }]
                  : [{ f: from, v: "sly" }, { f: F.game, v: "grin" }]
          }
          holding={[{ f: from, v: opt === "D" ? "phone" : "none" }]}
          hops={opt === "B" ? [F.party] : []}
          look={[{ f: from, v: opt === "D" ? -0.6 : 0.8 }]}
          seed={opt.charCodeAt(0)}
        />
        {opt === "B" && <Sparkles at={F.party} x={540} y={900} r={260} />}
        {opt === "C" && <Dust at={F.overtime + 8} x={130} y={1450} color="#e9ecef" />}
        {opt === "D" && <Sparkles at={F.game} x={640} y={1300} r={120} />}
      </Camera>
      {(opt === "A" || opt === "D") && <Foreground side="right" kind="pole" />}
    </>
  );
};

const OutroScene: React.FC = () => (
  <>
    <Camera from={F.s7} to={END} zoom={[1.08, 1.0]} pan={[0, 10]}>
      <Layer depth={0.2} from={F.s7} drift={-0.3}>
        <Interior wall="#7d5236" />
        <WallClock x={210} y={800} r={86} hours={1.4} />
      </Layer>
      <Layer depth={0.4} from={F.s7} drift={-0.3}>
        <Door x={600} y={1500} bike={false} />
      </Layer>
      <Character
        {...MOM}
        x={420}
        y={1720}
        scale={0.95}
        poses={[
          { f: F.s7, v: "hold" },
          { f: F.wapas2, v: "think" },
        ]}
        exprs={[
          { f: F.s7, v: "sad" },
          { f: F.wapas2, v: "cry" },
        ]}
        look={[{ f: F.s7, v: 1 }]}
      />
    </Camera>
    <Foreground side="left" kind="plant" />
  </>
);

// ---------------- sound ----------------
type S = { f: number; s: string; v: number };
const SFX: S[] = [
  { f: 0, s: "tick", v: 0.25 },
  { f: 15, s: "tick", v: 0.2 },
  { f: F.kabir, s: "whoosh", v: 0.1 },
  { f: F.chillaayi, s: "slam", v: 0.2 },
  { f: F.jaa, s: "slam", v: 0.25 },
  { f: F.jaa, s: "pop", v: 0.2 },
  { f: F.s2, s: "whoosh", v: 0.2 },
  { f: F.saat, s: "pop", v: 0.2 },
  { f: F.saat + 10, s: "tick", v: 0.2 },
  { f: F.saat + 25, s: "tick", v: 0.2 },
  { f: F.s2b, s: "whoosh", v: 0.2 },
  { f: F.s2b, s: "pop", v: 0.18 },
  { f: F.nikal, s: "whoosh", v: 0.25 },
  { f: F.s3, s: "whoosh", v: 0.2 },
  { f: F.s3, s: "pop", v: 0.2 },
  { f: F.dawai, s: "pop", v: 0.2 },
  { f: F.khatam, s: "buzzer", v: 0.08 },
  { f: F.s3b, s: "whoosh", v: 0.2 },
  { f: F.s3b, s: "pop", v: 0.18 },
  { f: F.nau, s: "ding", v: 0.15 },
  { f: F.band, s: "slam", v: 0.25 },
  { f: F.s4, s: "whoosh", v: 0.2 },
  { f: F.s4, s: "pop", v: 0.18 },
  { f: F.jeb, s: "whoosh", v: 0.15 },
  { f: F.saade, s: "pop", v: 0.22 },
  { f: F.bill, s: "thud", v: 0.25 },
  { f: F.s5, s: "whoosh", v: 0.22 },
  { f: F.chhe, s: "pop", v: 0.2 },
  { f: F.kahan, s: "slam", v: 0.28 },
  { f: F.A, s: "whoosh", v: 0.2 },
  { f: F.A + 8, s: "thud", v: 0.2 },
  { f: F.poora, s: "whoosh", v: 0.12 },
  { f: F.B, s: "whoosh", v: 0.2 },
  { f: F.B + 8, s: "thud", v: 0.2 },
  { f: F.party, s: "sparkle", v: 0.15 },
  { f: F.C, s: "whoosh", v: 0.2 },
  { f: F.C + 8, s: "thud", v: 0.2 },
  { f: F.overtime + 8, s: "thud", v: 0.2 },
  { f: F.D, s: "whoosh", v: 0.2 },
  { f: F.D + 8, s: "thud", v: 0.2 },
  { f: F.game, s: "click", v: 0.25 },
  { f: F.s7, s: "whoosh", v: 0.2 },
  { f: F.s7, s: "pop", v: 0.18 },
  { f: F.wapas2, s: "pop", v: 0.2 },
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
  { k: "A", t: "DAWAI DHOONDH RAHA", c: "#ff6b6b", f: F.A },
  { k: "B", t: "DOSTON KI PARTY", c: "#4dabf7", f: F.B },
  { k: "C", t: "OFFICE OVERTIME", c: "#51cf66", f: F.C },
  { k: "D", t: "GAME KHEL RAHA", c: "#fcc419", f: F.D },
];

// ---------------- composition ----------------
export const LateNight: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {inRange(frame, 0, F.s2) && <DoorScene />}
      {inRange(frame, F.s2, F.s2b) && <WaitScene />}
      {inRange(frame, F.s2b, F.s3) && <LeaveScene />}
      {inRange(frame, F.s3, F.s3b) && <PillScene />}
      {inRange(frame, F.s3b, F.s4) && <ShutterScene />}
      {inRange(frame, F.s4, F.s5) && <BillScene />}
      {inRange(frame, F.s5, F.A) && <RehookScene />}
      {inRange(frame, F.A, F.B) && <OptionScene opt="A" from={F.A} to={F.B} beat={F.poora} />}
      {inRange(frame, F.B, F.C) && <OptionScene opt="B" from={F.B} to={F.C} beat={F.party} />}
      {inRange(frame, F.C, F.D) && <OptionScene opt="C" from={F.C} to={F.D} beat={F.overtime} />}
      {inRange(frame, F.D, F.s7) && <OptionScene opt="D" from={F.D} to={F.s7} beat={F.game} />}
      {frame >= F.s7 && <OutroScene />}

      <SoftLight x="25%" y="45%" color="rgba(255,200,120,0.22)" />
      <Vignette />

      {/* TEXT */}
      <Chip text="RAAT 1 BAJE" at={0} until={F.s2} y={250} size={120} slam from={1.12} />
      <Chip text="JAA, WAPAS MAT AANA!" at={F.jaa} until={F.s2} y={420} size={78} color="#ff6b6b" slam />
      <Chip text="7 BAJE SE GAYAB" at={F.saat} until={F.s2b} y={330} size={88} />
      <Chip text="KUCH NAHI BOLA" at={F.s2b} until={F.nikal} y={330} size={88} color="#fff" />
      <Chip text="CHUPCHAAP NIKAL GAYA" at={F.nikal} until={F.s3} y={330} size={62} />
      <Chip text="CLUE 1" at={F.s3} until={F.dawai} y={330} size={110} color="#fff" bg="#e8590c" />
      <Chip text="DAWAI KHATAM" at={F.dawai} until={F.s3b} y={330} size={100} />
      <Chip text="CLUE 2" at={F.s3b} until={F.nau} y={330} size={110} color="#fff" bg="#e8590c" />
      <Chip text="9 BAJE BAND" at={F.nau} until={F.s4} y={330} size={100} />
      <Chip text="CLUE 3" at={F.s4} until={F.saade} y={330} size={110} color="#fff" bg="#e8590c" />
      <Chip text="12:30 KA BILL" at={F.saade} until={F.s5} y={330} size={100} />
      <Chip text="6 GHANTE" at={F.chhe} until={F.A} y={420} size={120} color="#fff" />
      <Chip text="KAHAN THA?" at={F.kahan} until={F.A} y={580} size={120} slam rotate={3} />
      <Tiles tiles={TILES} until={F.s7} outroAt={F.comment} />
      <Chip text="GUSSE KA EK SHABD" at={F.s7} until={F.comment} y={330} size={80} color="#fff" />
      <Chip text="WAPAS NAHI AATA" at={F.wapas2} until={F.comment} y={480} size={80} />
      <Chip text="COMMENT KARO" at={F.comment} until={F.answer} y={720} size={84} />
      <Chip text="ANSWER NEXT REEL" at={F.answer} y={720} size={76} color="#fff" bg="#7048e8" />
      <FollowButton at={F.follow} tapAt={F.handle} />

      <Grain />

      <Audio src={staticFile("voice/latenight.wav")} volume={1} />
      <Audio src={staticFile("music/sad_loop.wav")} loop volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

