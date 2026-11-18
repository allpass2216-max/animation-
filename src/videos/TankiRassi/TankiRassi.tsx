// TankiRassi (Part 1): stuck on a 120 ft water tank with a 90 ft rope, a knife, a hook at the top and one on a ledge 60 ft down.
// Every cue frame comes from ./words.json (measured word times). Never hard-code times here.
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Character } from "../../lib/Character";
import { Camera, Chip, Dust, Grain, H, INK, makeCue, SoftLight, Vignette, W, WordsFile } from "../../lib/reel";
import { FollowButton, Tiles } from "../../lib/ui";
import { Rays, SignText } from "../../lib/world";
import { ftY, GROUND, HOOK1, HOOK2, Knife, LEDGE, Measure, NightField, Rope, RopeCoil, RoofCloseup, ROOF, TankDiagram } from "./tank";
import wordsData from "./words.json";

const data = wordsData as unknown as WordsFile;
const cue = makeCue(data);
export const TANKIRASSI_DURATION = data.words[data.words.length - 1].endFrame + 60;

const F = {
  das: cue(1, "das"),
  raju: cue(3, "Raju"),
  bees: cue(6, "bees"),
  phans: cue(11, "phans"),
  s2: cue(13, "Seedhi"),
  toot: cue(14, "toot"),
  subah: cue(16, "subah"),
  s3: cue(21, "Paas"),
  rassi: cue(25, "rassi"),
  chaaku: cue(28, "chaaku"),
  s4: cue(29, "Upar"),
  kunda: cue(31, "kunda"),
  saath: cue(33, "saath"),
  doosra: cue(38, "doosra"),
  s5: cue(39, "Poori"),
  tees: cue(44, "tees"),
  zinda: cue(49, "zinda"),
  utrega: cue(52, "utrega"),
  A: cue(53, "A"),
  loop: cue(57, "loop"),
  double: cue(62, "double"),
  chhajjeA: cue(64, "chhajje"),
  kheench: cue(67, "kheench"),
  neecheA: cue(69, "neeche"),
  B: cue(70, "B"),
  kood: cue(79, "kood"),
  C: cue(81, "C"),
  utro: cue(84, "utro"),
  gaanth: cue(88, "gaanth"),
  D: cue(91, "D"),
  kaat: cue(95, "kaat"),
  lambi: cue(97, "lambi"),
  s7: cue(100, "Comment"),
  answer: cue(102, "answer"),
  follow: cue(107, "follow"),
  handle: cue(109, "@rehanfact"),
};
const END = TANKIRASSI_DURATION;
const inRange = (f: number, a: number, b: number) => f >= a && f < b;

const RAJU = { skin: "#B97A50", shirt: "#2f9e44", pants: "#3b3a52", hair: "#1d1420" } as const;
const SMALL = 0.24; // Raju's scale in the full-height diagram

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
    {children}
  </svg>
);

// ---------------- close-up scenes on the roof ----------------
const RoofScene: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const inventory = frame >= F.s3;
  return (
    <Camera from={from} to={to} zoom={[1.0, 1.08]} pan={[0, -20]} shakeAt={[F.toot]}>
      <NightField horizon={1720} />
      {/* height bar down the right edge (frame 0: how high he is) */}
      {!inventory && (
        <Svg>
          <Measure x={700} y1={900} y2={1700} label="120 FT" />
        </Svg>
      )}
      <RoofCloseup breakAt={F.toot} />
      <Character
        {...RAJU}
        x={inventory ? 330 : 440}
        y={1740}
        scale={0.95}
        poses={
          inventory
            ? [{ f: F.s3, v: "present" }, { f: F.rassi, v: "point" }, { f: F.chaaku, v: "hold" }]
            : [{ f: 0, v: "panic" }, { f: F.raju, v: "scratch" }, { f: F.toot, v: "panic" }, { f: F.subah, v: "think" }]
        }
        exprs={
          inventory
            ? [{ f: F.s3, v: "worried" }, { f: F.rassi, v: "think" }]
            : [{ f: 0, v: "shock" }, { f: F.raju, v: "worried" }, { f: F.toot, v: "shock" }, { f: F.subah, v: "sad" }]
        }
        look={[{ f: 0, v: inventory ? 1 : 0.6 }]}
        sweat={[{ f: 0, v: true }]}
        hops={[F.toot - 3]}
      />
      {inventory && (
        <Svg>
          <RopeCoil x={760} y={1690} s={1.1} />
          <Knife x={860} y={1560} s={1.1} />
        </Svg>
      )}
    </Camera>
  );
};

// ---------------- diagram scenes (full height) ----------------
const Diagram: React.FC<{ from: number; to: number; children?: React.ReactNode; glow1?: boolean; glow2?: boolean; bar?: boolean; shakeAt?: number[] }> = ({
  from,
  to,
  children,
  glow1,
  glow2,
  bar,
  shakeAt = [],
}) => (
  <Camera from={from} to={to} zoom={[1.0, 1.03]} shakeAt={shakeAt}>
    <NightField horizon={GROUND} />
    <TankDiagram glow1={glow1} glow2={glow2} bar={bar} />
    {children}
  </Camera>
);

const HooksScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Diagram from={F.s4} to={F.s5} glow1={frame >= F.kunda && frame < F.saath} glow2={frame >= F.saath}>
      <Character {...RAJU} x={400} y={ROOF - 4} scale={SMALL} poses={[{ f: F.s4, v: "point" }]} exprs={[{ f: F.s4, v: "think" }]} look={[{ f: 0, v: 1 }]} />
      {frame >= F.saath && (
        <Svg>
          <Measure x={720} y1={ROOF} y2={LEDGE} label="60 FT" />
        </Svg>
      )}
    </Diagram>
  );
};

/** Naive try: whole 90 ft rope from the top -> 30 ft short. */
const FailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const ropeEnd = ftY(90);
  const slide = interpolate(frame, [F.s5, F.tees - 4], [ROOF + 60, ropeEnd + 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Diagram from={F.s5} to={F.A} bar={false} shakeAt={[F.zinda]}>
      <Svg>
        <Rope x={HOOK1[0] + 14} y1={HOOK1[1] + 14} y2={ropeEnd} />
        {frame >= F.tees && <Measure x={760} y1={ropeEnd + 40} y2={GROUND} label="30 FT" red />}
      </Svg>
      <Character
        {...RAJU}
        x={HOOK1[0] + 14}
        y={slide + 230}
        scale={SMALL}
        poses={[{ f: F.s5, v: "cheer" }]}
        exprs={[
          { f: F.s5, v: "worried" },
          { f: F.tees, v: "shock" },
        ]}
        sweat={[{ f: F.tees, v: true }]}
        look={[{ f: 0, v: 0 }]}
      />
    </Diagram>
  );
};

const OptionScene: React.FC<{ opt: "A" | "B" | "C" | "D"; from: number; to: number }> = ({ opt, from, to }) => {
  const frame = useCurrentFrame();
  if (opt === "D") {
    // close-up: cutting the rope never makes it longer
    const cut = frame >= F.kaat;
    return (
      <Camera from={from} to={to} zoom={[1.0, 1.06]}>
        <NightField horizon={1720} />
        <RoofCloseup />
        <Character
          {...RAJU}
          x={330}
          y={1740}
          scale={0.9}
          poses={[{ f: from, v: "hold" }, { f: F.lambi, v: "shrug" }]}
          exprs={[{ f: from, v: "sly" }, { f: F.lambi, v: "think" }]}
          look={[{ f: 0, v: 1 }]}
        />
        <Svg>
          {!cut ? (
            <path d="M640 1400 L960 1400" stroke="#d9a066" strokeWidth={14} strokeDasharray="12 6" />
          ) : (
            <g>
              <path d="M620 1400 L760 1400" stroke="#d9a066" strokeWidth={14} strokeDasharray="12 6" />
              <path d="M820 1430 L960 1430" stroke="#d9a066" strokeWidth={14} strokeDasharray="12 6" />
            </g>
          )}
          <Knife x={790} y={cut ? 1360 : 1330 + Math.sin(frame / 2) * 20} rot={-70} />
          {frame >= F.lambi &&
            [0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${620 + i * 160} ${1250 + Math.sin((frame + i * 9) / 8) * 12})`}>
                <SignText x={0} y={0} size={110} text="?" fill="#fff" />
              </g>
            ))}
        </Svg>
      </Camera>
    );
  }
  if (opt === "A") {
    const loopY = ftY(30);
    const pulled = frame >= F.kheench;
    const down = interpolate(frame, [F.neecheA, F.neecheA + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const ropeFall = pulled ? Math.min(LEDGE + 10, loopY + 0.5 * 3200 * ((frame - F.kheench) / 30) ** 2) : 0;
    const rajuY = interpolate(frame, [from, F.chhajjeA], [ROOF + 60, LEDGE], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <Diagram from={from} to={to} bar={false}>
        <Svg>
          {/* 30 ft piece with a loop */}
          {frame >= F.loop && <Rope x={HOOK1[0] + 14} y1={HOOK1[1] + 14} y2={loopY} sway={0.3} />}
          {frame >= F.loop && <circle cx={HOOK1[0] + 14} cy={loopY + 14} r={16} fill="none" stroke="#d9a066" strokeWidth={8} />}
          {frame >= F.loop && <Measure x={760} y1={ROOF} y2={loopY} label="30" />}
          {/* 60 ft piece doubled through the loop -> reaches the ledge */}
          {frame >= F.double && !pulled && (
            <g>
              <Rope x={HOOK1[0] + 6} y1={loopY + 26} y2={LEDGE} sway={0.2} />
              <Rope x={HOOK1[0] + 24} y1={loopY + 26} y2={LEDGE} sway={0.2} />
              <Measure x={760} y1={loopY + 20} y2={LEDGE} label="30 x2" />
            </g>
          )}
          {pulled && <Rope x={HOOK1[0] + 30} y1={ropeFall - 40} y2={ropeFall} sway={0} />}
          {/* second leg: 60 ft from the ledge hook to the ground */}
          {frame >= F.neecheA && (
            <g>
              <Rope x={HOOK2[0] + 14} y1={HOOK2[1] + 14} y2={GROUND} sway={0.4} />
              <Measure x={760} y1={LEDGE} y2={GROUND} label="60 FT" />
            </g>
          )}
        </Svg>
        <Character
          {...RAJU}
          x={frame >= F.neecheA ? HOOK2[0] + 14 : 560}
          y={frame >= F.neecheA ? interpolate(down, [0, 1], [LEDGE + 230, GROUND]) : frame >= F.chhajjeA ? LEDGE : rajuY + 230}
          scale={SMALL}
          poses={[
            { f: from, v: "cheer" },
            { f: F.chhajjeA, v: "idle" },
            { f: F.kheench, v: "point" },
            { f: F.neecheA, v: "cheer" },
          ]}
          exprs={[
            { f: from, v: "think" },
            { f: F.chhajjeA, v: "grin" },
          ]}
          look={[{ f: 0, v: 1 }]}
        />
      </Diagram>
    );
  }
  if (opt === "B") {
    const ropeEnd = ftY(90);
    const t = Math.max(0, frame - F.kood) / 30;
    const fallY = Math.min(GROUND, ropeEnd + 230 + 0.5 * 3200 * t * t);
    const landed = fallY >= GROUND;
    return (
      <Diagram from={from} to={to} bar={false} shakeAt={landed ? [F.kood + 10] : []}>
        <Svg>
          <Rope x={HOOK1[0] + 14} y1={HOOK1[1] + 14} y2={ropeEnd} />
          <Measure x={780} y1={ropeEnd + 40} y2={GROUND} label="30 FT" red />
        </Svg>
        <Character
          {...RAJU}
          x={HOOK1[0] + 14}
          y={frame < F.kood ? ropeEnd + 230 : fallY}
          scale={SMALL}
          poses={[{ f: from, v: "cheer" }, { f: F.kood, v: "panic" }]}
          exprs={[{ f: from, v: "worried" }, { f: F.kood, v: "shock" }, { f: F.kood + 12, v: "cry" }]}
          look={[{ f: 0, v: 0 }]}
        />
        <Dust at={F.kood + 10} x={HOOK1[0] + 14} y={GROUND} />
        {landed && (
          <Svg>
            {[0, 1, 2].map((i) => {
              const a = frame / 6 + (i * Math.PI * 2) / 3;
              return <path key={i} d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4Z" fill="#ffd43b" stroke={INK} strokeWidth={3} transform={`translate(${HOOK1[0] + 14 + Math.cos(a) * 60} ${GROUND - 250 + Math.sin(a) * 20})`} />;
            })}
          </Svg>
        )}
      </Diagram>
    );
  }
  // C: down to the ledge, but the knot is 60 ft above
  const rajuY = interpolate(frame, [from, F.utro + 6], [ROOF + 60, LEDGE], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const onLedge = frame >= F.utro + 6;
  return (
    <Diagram from={from} to={to} bar={false}>
      <Svg>
        <Rope x={HOOK1[0] + 14} y1={HOOK1[1] + 14} y2={ftY(90)} />
        {frame >= F.gaanth && (
          <g>
            <circle cx={HOOK1[0] + 14} cy={HOOK1[1] + 18} r={40 + Math.sin(frame / 3) * 6} fill="none" stroke="#ff6b6b" strokeWidth={7} />
            <SignText x={HOOK1[0] + 120} y={HOOK1[1] + 40} size={90} text="?" fill="#fff" />
            <Measure x={780} y1={ROOF} y2={LEDGE} label="60 FT" red />
          </g>
        )}
      </Svg>
      <Character
        {...RAJU}
        x={onLedge ? 560 : HOOK1[0] + 14}
        y={onLedge ? LEDGE : rajuY + 230}
        scale={SMALL}
        poses={[{ f: from, v: "cheer" }, { f: F.utro + 6, v: "idle" }, { f: F.gaanth, v: "scratch" }]}
        exprs={[{ f: from, v: "think" }, { f: F.gaanth, v: "worried" }]}
        look={[{ f: 0, v: 1 }]}
      />
    </Diagram>
  );
};

const OutroScene: React.FC = () => (
  <Camera from={F.s7} to={END} zoom={[1.0, 1.05]}>
    <NightField horizon={1720} />
    <RoofCloseup />
    <Svg>
      <RopeCoil x={780} y={1690} s={1.0} />
      <Knife x={880} y={1570} s={1.0} />
    </Svg>
    <Character
      {...RAJU}
      x={380}
      y={1740}
      scale={0.95}
      poses={[
        { f: F.s7, v: "think" },
        { f: F.follow, v: "wave" },
      ]}
      exprs={[
        { f: F.s7, v: "think" },
        { f: F.follow, v: "grin" },
      ]}
      look={[{ f: 0, v: 1 }]}
    />
  </Camera>
);

// ---------------- sound ----------------
type S = { f: number; s: string; v: number };
const SFX: S[] = [
  { f: 0, s: "whoosh", v: 0.22 },
  { f: 0, s: "thud", v: 0.15 },
  { f: F.das, s: "tick", v: 0.2 },
  { f: F.bees, s: "pop", v: 0.2 },
  { f: F.phans, s: "slam", v: 0.2 },
  { f: F.toot, s: "slam", v: 0.25 },
  { f: F.toot + 20, s: "whoosh", v: 0.12 },
  { f: F.subah, s: "pop", v: 0.18 },
  { f: F.s3, s: "whoosh", v: 0.2 },
  { f: F.rassi, s: "pop", v: 0.22 },
  { f: F.chaaku, s: "click", v: 0.25 },
  { f: F.s4, s: "whoosh", v: 0.22 },
  { f: F.kunda, s: "ding", v: 0.15 },
  { f: F.saath, s: "pop", v: 0.2 },
  { f: F.doosra, s: "ding", v: 0.15 },
  { f: F.s5, s: "whoosh", v: 0.22 },
  { f: F.tees, s: "buzzer", v: 0.08 },
  { f: F.zinda, s: "slam", v: 0.26 },
  { f: F.A, s: "whoosh", v: 0.2 },
  { f: F.A + 8, s: "thud", v: 0.2 },
  { f: F.loop, s: "pop", v: 0.18 },
  { f: F.double, s: "pop", v: 0.18 },
  { f: F.kheench, s: "whoosh", v: 0.15 },
  { f: F.neecheA, s: "sparkle", v: 0.15 },
  { f: F.B, s: "whoosh", v: 0.2 },
  { f: F.B + 8, s: "thud", v: 0.2 },
  { f: F.kood + 10, s: "thud", v: 0.25 },
  { f: F.C, s: "whoosh", v: 0.2 },
  { f: F.C + 8, s: "thud", v: 0.2 },
  { f: F.gaanth, s: "buzzer", v: 0.08 },
  { f: F.D, s: "whoosh", v: 0.2 },
  { f: F.D + 8, s: "thud", v: 0.2 },
  { f: F.kaat, s: "click", v: 0.25 },
  { f: F.s7, s: "whoosh", v: 0.2 },
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
  { k: "A", t: "LOOP + DOUBLE", c: "#ff6b6b", f: F.A },
  { k: "B", t: "30 FEET KOODO", c: "#4dabf7", f: F.B },
  { k: "C", t: "GAANTH KHOLO", c: "#51cf66", f: F.C },
  { k: "D", t: "RASSI LAMBI KARO", c: "#fcc419", f: F.D },
];

// ---------------- composition ----------------
export const TankiRassi: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {inRange(frame, 0, F.s4) && <RoofScene from={frame < F.s3 ? 0 : F.s3} to={frame < F.s3 ? F.s3 : F.s4} />}
      {inRange(frame, F.s4, F.s5) && <HooksScene />}
      {inRange(frame, F.s5, F.A) && <FailScene />}
      {inRange(frame, F.A, F.B) && <OptionScene opt="A" from={F.A} to={F.B} />}
      {inRange(frame, F.B, F.C) && <OptionScene opt="B" from={F.B} to={F.C} />}
      {inRange(frame, F.C, F.D) && <OptionScene opt="C" from={F.C} to={F.D} />}
      {inRange(frame, F.D, F.s7) && <OptionScene opt="D" from={F.D} to={F.s7} />}
      {frame >= F.s7 && <OutroScene />}
      {inRange(frame, F.zinda, F.A) && (
        <AbsoluteFill style={{ opacity: 0.35, mixBlendMode: "screen" }}>
          <Rays c1="#000" c2="#c92a2a" />
        </AbsoluteFill>
      )}

      <SoftLight x="80%" y="12%" color="rgba(255,244,194,0.18)" />
      <Vignette />

      <Chip text="120 FEET, 1 RAAT" at={0} until={F.s2} y={250} size={96} slam from={1.1} />
      <Chip text="RAAT 10 BAJE" at={F.das} until={F.s2} y={400} size={76} color="#fff" />
      <Chip text="SEEDHI TOOT GAYI" at={F.toot} until={F.s3} y={330} size={84} color="#ff6b6b" slam />
      <Chip text="SUBAH TAK AKELA" at={F.subah} until={F.s3} y={480} size={76} color="#fff" />
      <Chip text="RASSI: 90 FEET" at={F.rassi} until={F.s4} y={330} size={88} />
      <Chip text="CHAAKU: 1" at={F.chaaku} until={F.s4} y={480} size={88} color="#fff" />
      <Chip text="KUNDA #1: UPAR" at={F.kunda} until={F.s5} y={300} size={80} />
      <Chip text="KUNDA #2" at={F.saath} until={F.s5} y={440} size={80} color="#fff" />
      <Chip text="60 FT NEECHE" at={F.doosra} until={F.s5} y={570} size={72} color="#fff" bg="#1971c2" />
      <Chip text="30 FEET HAWA MEIN!" at={F.tees} until={F.zinda} y={330} size={76} color="#ff6b6b" />
      <Chip text="ZINDA KAISE?" at={F.zinda} until={F.A} y={400} size={110} slam rotate={-3} />
      <Tiles tiles={TILES} until={F.s7} outroAt={F.s7} />
      <Chip text="ANSWER NEXT REEL" at={F.answer} y={720} size={76} color="#fff" bg="#7048e8" />
      <FollowButton at={F.follow} tapAt={F.handle} />

      <Grain />

      <Audio src={staticFile("voice/tankirassi.wav")} volume={1} />
      <Audio src={staticFile("music/loop.wav")} loop volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

