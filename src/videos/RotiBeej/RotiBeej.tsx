// RotiBeej (Part 1): same salary 30,000; Rohan spends it all, Kunal puts 3,000/month in a SIP. At 12% a year, 10 years later?
// Every cue frame comes from ./words.json (measured word times; "A" corrected from the clean_voice pause file).
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Character, Extra } from "../../lib/Character";
import { Mall } from "../../lib/family";
import { Party } from "../../lib/night";
import { Camera, Chip, Grain, H, makeCue, SoftLight, Sparkles, Vignette, W, WordsFile } from "../../lib/reel";
import { FollowButton, Tiles } from "../../lib/ui";
import { Foreground, Layer, Rays } from "../../lib/world";
import { BeejPot, EmptyPlate, NoteFlutter, NoteStack, OfficeFront, Parcels, SimpleRoom, YearCounter } from "./pieces";
import wordsData from "./words.json";

const data = wordsData as unknown as WordsFile;
const cue = makeCue(data);
export const ROTIBEEJ_DURATION = data.words[data.words.length - 1].endFrame + 60; // ends 2 s after the voice

const F = {
  kunal: cue(2, "Kunal"),
  naukri: cue(6, "naukri"),
  salary: cue(10, "salary"),
  tees: cue(11, "tees"),
  s2: cue(13, "Rohan"),
  uda: cue(17, "uda"),
  phone: cue(20, "phone"),
  party: cue(21, "party"),
  online: cue(22, "online"),
  s3: cue(24, "Kunal"),
  teen: cue(28, "teen"),
  sip: cue(32, "SIP"),
  baaki: cue(34, "baaki"),
  s4: cue(38, "Dost"),
  hanse: cue(39, "hanse"),
  crorepati: cue(44, "crorepati"),
  s5: cue(46, "Har"),
  baarah: cue(48, "baarah"),
  das: cue(53, "das"),
  kitne: cue(59, "kitne"),
  A: cue(61, "A"),
  B: cue(65, "B"),
  C: cue(71, "C"),
  D: cue(75, "D"),
  crore: cue(78, "crore"),
  s7: cue(79, "Tum"),
  roti: cue(82, "roti"),
  beej: cue(89, "beej"),
  comment: cue(94, "Comment"),
  answer: cue(96, "answer"),
  follow: cue(101, "follow"),
  handle: cue(103, "@rehanfact"),
};
const END = ROTIBEEJ_DURATION;
const inRange = (f: number, a: number, b: number) => f >= a && f < b;
const PARTY_CUT = F.party; // hard cut from the mall to the party on "party"

// cast
const ROHAN = { skin: "#5c3a24", shirt: "#e8590c", pants: "#343a40", hair: "#140d10", chain: true, turn: 0.75 } as const; // flashy, deep brown skin, 3/4 view
const KUNAL = { skin: "#f6d3b3", shirt: "#a5d8ff", pants: "#2b3a67", hair: "#1d1420", tie: "#1864ab", glasses: true, quiff: true, turn: 0.75 } as const; // neat, fair skin, 3/4 view

// ---------------- scenes ----------------
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const walk = interpolate(frame, [0, 40], [-50, 0], { extrapolateRight: "clamp" });
  return (
    <>
      <Camera from={0} to={F.s2} zoom={[1.0, 1.08]} pan={[0, -20]}>
        <Layer depth={0.3} from={0} drift={-0.3}>
          <OfficeFront />
        </Layer>
        <BeejPot x={960} y={1720} s={0.45} fill={0.25} coinsAt={[4, F.tees]} />
        <Character
          {...ROHAN}
          x={250 + walk}
          y={1740}
          scale={0.88}
          poses={[
            { f: 0, v: "cheer" },
            { f: F.kunal, v: "point" },
            { f: F.salary, v: "cheer" },
          ]}
          exprs={[{ f: 0, v: "grin" }]}
          shades={[{ f: 0, v: true }]}
          hops={[F.salary]}
          look={[{ f: 0, v: 1 }]}
        />
        <Character
          {...KUNAL}
          x={720 - walk}
          y={1740}
          scale={0.88}
          flip
          poses={[
            { f: 0, v: "present" },
            { f: F.salary, v: "hold" },
          ]}
          exprs={[
            { f: 0, v: "smile" },
            { f: F.tees, v: "grin" },
          ]}
          look={[{ f: 0, v: 1 }]}
          seed={4}
        />
        <NoteFlutter at={0} x={330} y={1380} count={8} />
        <Sparkles at={F.tees} x={540} y={760} r={180} />
      </Camera>
      <Foreground side="left" kind="plant" />
    </>
  );
};

const SpendScene: React.FC = () => {
  const frame = useCurrentFrame();
  const party = frame >= PARTY_CUT;
  return (
    <Camera from={party ? PARTY_CUT : F.s2} to={party ? F.s3 : PARTY_CUT} zoom={party ? [1.02, 1.1] : [1.08, 1.0]} shakeAt={party ? [PARTY_CUT] : []}>
      {party ? (
        <Party flashAt={F.party} />
      ) : (
        <Layer depth={0.3} from={F.s2} drift={-0.4}>
          <Mall />
        </Layer>
      )}
      <Character
        {...ROHAN}
        x={460}
        y={1740}
        scale={0.95}
        poses={
          party
            ? [{ f: PARTY_CUT, v: "cheer" }, { f: F.online, v: "point" }]
            : [{ f: F.s2, v: "wave" }, { f: F.uda, v: "cheer" }, { f: F.phone, v: "hold" }]
        }
        exprs={party ? [{ f: PARTY_CUT, v: "grin" }] : [{ f: F.s2, v: "grin" }, { f: F.phone, v: "wow" }]}
        holding={party ? [{ f: PARTY_CUT, v: "none" }] : [{ f: F.s2, v: "none" }, { f: F.phone, v: "phone" }]}
        shades={[{ f: F.s2, v: true }]}
        hops={party ? [PARTY_CUT, F.online] : [F.uda]}
        look={[{ f: 0, v: 1 }]}
      />
      {!party && <NoteFlutter at={F.uda} x={560} y={1380} count={10} />}
      {party && <Parcels at={F.online} x={850} floorY={1720} />}
    </Camera>
  );
};

const SaveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [F.s3, F.baaki], [0.15, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Camera from={F.s3} to={F.s4} zoom={[1.0, 1.08]} pan={[0, -20]}>
        <Layer depth={0.3} from={F.s3} drift={-0.3}>
          <SimpleRoom />
        </Layer>
        <BeejPot x={780} y={1720} s={1.0} fill={fill} coinsAt={[F.teen, F.sip]} sproutAt={F.sip} />
        <Character
          {...KUNAL}
          x={330}
          y={1740}
          scale={0.92}
          poses={[
            { f: F.s3, v: "idle" },
            { f: F.teen, v: "present" },
            { f: F.baaki, v: "cheer" },
          ]}
          exprs={[
            { f: F.s3, v: "smile" },
            { f: F.sip, v: "grin" },
          ]}
          look={[{ f: 0, v: 1 }]}
          seed={4}
        />
        <Sparkles at={F.sip} x={780} y={1380} r={160} />
      </Camera>
      <Foreground side="left" kind="plant" />
    </>
  );
};

const LaughScene: React.FC = () => (
  <Camera from={F.s4} to={F.s5} zoom={[1.0, 1.06]}>
    <Layer depth={0.3} from={F.s4} drift={-0.3}>
      <OfficeFront />
    </Layer>
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <Extra x={70} y={1660} s={1.05} shirt="#ffd43b" seed={31} hopAt={[F.hanse, F.hanse + 12, F.crorepati]} />
      <Extra x={430} y={1640} s={1.0} shirt="#b197fc" seed={32} hopAt={[F.hanse + 4, F.hanse + 16, F.crorepati + 4]} />
    </svg>
    <Character
      {...ROHAN}
      x={260}
      y={1750}
      scale={0.85}
      poses={[
        { f: F.s4, v: "point" },
        { f: F.hanse, v: "cheer" },
        { f: F.crorepati, v: "point" },
      ]}
      exprs={[{ f: F.s4, v: "grin" }]}
      shades={[{ f: F.s4, v: true }]}
      hops={[F.hanse]}
      look={[{ f: 0, v: 1 }]}
    />
    <Character
      {...KUNAL}
      x={800}
      y={1750}
      scale={0.85}
      flip
      poses={[
        { f: F.s4, v: "idle" },
        { f: F.crorepati, v: "shrug" },
      ]}
      exprs={[
        { f: F.s4, v: "smile" },
        { f: F.crorepati, v: "sly" },
      ]}
      look={[{ f: 0, v: 1 }]}
      seed={4}
    />
  </Camera>
);

const RehookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [F.das, F.kitne], [0.55, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const potScale = interpolate(frame, [F.das, F.kitne], [0.75, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Camera from={F.s5} to={F.A} zoom={[1.0, 1.1]} shakeAt={[F.kitne]}>
      <Rays c1="#1b4332" c2="#2d6a4f" />
      <BeejPot x={780} y={1720} s={potScale} fill={fill} sproutAt={F.s5 - 60} coinsAt={[F.baarah, F.das, F.das + 10, F.das + 20, F.das + 30]} />
      {frame >= F.das && <YearCounter a={F.das} b={F.kitne} x={780} y={760} />}
      <Character
        {...KUNAL}
        x={300}
        y={1750}
        scale={0.95}
        poses={[
          { f: F.s5, v: "think" },
          { f: F.kitne, v: "panic" },
        ]}
        exprs={[
          { f: F.s5, v: "think" },
          { f: F.kitne, v: "wow" },
        ]}
        look={[{ f: 0, v: 1 }]}
        hops={[F.kitne - 3]}
        seed={4}
      />
    </Camera>
  );
};

const OPTIONS = {
  A: { n: 7, label: "~7 LAKH", tint: "#8fe08c" },
  B: { n: 4, label: "3.6 LAKH", tint: "#a5d8ff" },
  C: { n: 11, label: "~11 LAKH", tint: "#b2f2bb" },
  D: { n: 18, label: "1 CRORE", tint: "#ffe066" },
} as const;

const OptionScene: React.FC<{ opt: keyof typeof OPTIONS; from: number; to: number }> = ({ opt, from, to }) => {
  const o = OPTIONS[opt];
  return (
    <Camera from={from} to={to} zoom={[1.0, 1.04]}>
      <Layer depth={0.3} from={from} drift={-0.3}>
        <SimpleRoom night />
      </Layer>
      <NoteStack n={o.n} at={from + 4} x={760} floorY={1720} label={o.label} tint={o.tint} />
      <Character
        {...KUNAL}
        x={290}
        y={1750}
        scale={0.9}
        poses={[{ f: from, v: opt === "A" ? "present" : opt === "B" ? "think" : opt === "C" ? "point" : "shrug" }]}
        exprs={[{ f: from, v: opt === "A" ? "grin" : opt === "B" ? "think" : opt === "C" ? "wow" : "shock" }]}
        hops={opt === "D" ? [F.crore] : []}
        look={[{ f: 0, v: 1 }]}
        seed={4}
      />
    </Camera>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Camera from={F.s7} to={END} zoom={[1.0, 1.05]}>
      <Layer depth={0.3} from={F.s7} drift={-0.3}>
        <SimpleRoom night />
      </Layer>
      {/* divider vine */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
        <path d={`M540 1900 Q${520 + Math.sin(frame / 10) * 10} 1400 540 900`} stroke="#2f9e44" strokeWidth={14} fill="none" />
        {[1700, 1500, 1300, 1100].map((y, i) => (
          <ellipse key={y} cx={540 + (i % 2 ? 30 : -30)} cy={y} rx={26} ry={14} fill="#51cf66" stroke="#1b1430" strokeWidth={5} transform={`rotate(${i % 2 ? 30 : -30} ${540 + (i % 2 ? 30 : -30)} ${y})`} />
        ))}
      </svg>
      {frame >= F.roti && <EmptyPlate x={270} y={1700} />}
      <BeejPot x={830} y={1720} s={0.75} fill={0.9} sproutAt={F.beej - 40} />
      <Character
        {...ROHAN}
        x={230}
        y={1650}
        scale={0.72}
        poses={[
          { f: F.s7, v: "idle" },
          { f: F.roti, v: "shrug" },
        ]}
        exprs={[
          { f: F.s7, v: "smile" },
          { f: F.roti, v: "sad" },
        ]}
        shades={[
          { f: F.s7, v: true },
          { f: F.roti, v: false },
        ]}
        look={[{ f: 0, v: 1 }]}
      />
      <Character
        {...KUNAL}
        x={700}
        y={1650}
        scale={0.72}
        flip
        poses={[
          { f: F.s7, v: "idle" },
          { f: F.beej, v: "present" },
          { f: F.follow, v: "wave" },
        ]}
        exprs={[{ f: F.s7, v: "smile" }, { f: F.beej, v: "grin" }]}
        look={[{ f: 0, v: 1 }]}
        seed={4}
      />
      <Sparkles at={F.beej} x={830} y={1330} r={150} />
    </Camera>
  );
};

// ---------------- sound ----------------
type S = { f: number; s: string; v: number };
const SFX: S[] = [
  { f: 0, s: "whoosh", v: 0.2 },
  { f: 4, s: "ding", v: 0.15 },
  { f: F.salary, s: "pop", v: 0.2 },
  { f: F.tees, s: "sparkle", v: 0.15 },
  { f: F.tees, s: "pop", v: 0.2 },
  { f: F.s2, s: "whoosh", v: 0.2 },
  { f: F.uda, s: "pop", v: 0.2 },
  { f: F.uda + 4, s: "whoosh", v: 0.1 },
  { f: F.phone, s: "pop", v: 0.2 },
  { f: F.phone, s: "click", v: 0.2 },
  { f: F.party, s: "whoosh", v: 0.22 },
  { f: F.party, s: "pop", v: 0.2 },
  { f: F.online, s: "pop", v: 0.2 },
  { f: F.online + 9, s: "thud", v: 0.18 },
  { f: F.online + 15, s: "thud", v: 0.14 },
  { f: F.online + 21, s: "thud", v: 0.12 },
  { f: F.s3, s: "whoosh", v: 0.2 },
  { f: F.teen, s: "pop", v: 0.2 },
  { f: F.teen + 13, s: "ding", v: 0.15 },
  { f: F.sip, s: "pop", v: 0.2 },
  { f: F.sip + 13, s: "ding", v: 0.15 },
  { f: F.sip, s: "sparkle", v: 0.12 },
  { f: F.s4, s: "whoosh", v: 0.2 },
  { f: F.crorepati, s: "pop", v: 0.2 },
  { f: F.s5, s: "whoosh", v: 0.22 },
  { f: F.baarah, s: "pop", v: 0.2 },
  { f: F.das, s: "slam", v: 0.22 },
  { f: F.das + 10, s: "tick", v: 0.15 },
  { f: F.das + 20, s: "tick", v: 0.15 },
  { f: F.das + 30, s: "tick", v: 0.15 },
  { f: F.kitne, s: "slam", v: 0.25 },
  { f: F.A, s: "whoosh", v: 0.2 },
  { f: F.A + 8, s: "thud", v: 0.2 },
  { f: F.B, s: "whoosh", v: 0.2 },
  { f: F.B + 8, s: "thud", v: 0.2 },
  { f: F.C, s: "whoosh", v: 0.2 },
  { f: F.C + 8, s: "thud", v: 0.2 },
  { f: F.D, s: "whoosh", v: 0.2 },
  { f: F.D + 8, s: "thud", v: 0.2 },
  { f: F.crore, s: "sparkle", v: 0.15 },
  { f: F.s7, s: "whoosh", v: 0.2 },
  { f: F.roti, s: "pop", v: 0.2 },
  { f: F.beej, s: "sparkle", v: 0.15 },
  { f: F.beej, s: "pop", v: 0.2 },
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
  { k: "A", t: "LAGBHAG 7 LAKH", c: "#ff6b6b", f: F.A },
  { k: "B", t: "SIRF 3.6 LAKH", c: "#4dabf7", f: F.B },
  { k: "C", t: "LAGBHAG 11 LAKH", c: "#51cf66", f: F.C },
  { k: "D", t: "POORE 1 CRORE", c: "#fcc419", f: F.D },
];

// ---------------- composition ----------------
export const RotiBeej: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {inRange(frame, 0, F.s2) && <HookScene />}
      {inRange(frame, F.s2, F.s3) && <SpendScene />}
      {inRange(frame, F.s3, F.s4) && <SaveScene />}
      {inRange(frame, F.s4, F.s5) && <LaughScene />}
      {inRange(frame, F.s5, F.A) && <RehookScene />}
      {inRange(frame, F.A, F.B) && <OptionScene opt="A" from={F.A} to={F.B} />}
      {inRange(frame, F.B, F.C) && <OptionScene opt="B" from={F.B} to={F.C} />}
      {inRange(frame, F.C, F.D) && <OptionScene opt="C" from={F.C} to={F.D} />}
      {inRange(frame, F.D, F.s7) && <OptionScene opt="D" from={F.D} to={F.s7} />}
      {frame >= F.s7 && <OutroScene />}

      <SoftLight />
      <Vignette />

      {/* TEXT */}
      <Chip text="SAME SALARY, 10 SAAL" at={0} until={F.s2} y={250} size={74} slam from={1.08} />
      <Chip text="30,000 / MONTH" at={F.tees} until={F.s2} y={400} size={80} color="#fff" bg="#2b8a3e" />
      <Chip text="SAB KHARCH" at={F.uda} until={F.phone} y={330} size={96} color="#ff6b6b" />
      <Chip text="NAYA PHONE" at={F.phone} until={F.party} y={330} size={96} />
      <Chip text="PARTY" at={F.party} until={F.online} y={330} size={110} color="#fff" />
      <Chip text="ONLINE SHOPPING" at={F.online} until={F.s3} y={330} size={84} />
      <Chip text="SIRF 3,000 SIP" at={F.teen} until={F.sip} y={330} size={88} />
      <Chip text="10% BEEJ" at={F.sip} until={F.s4} y={330} size={100} color="#fff" bg="#2b8a3e" />
      <Chip text="3,000 SE CRORE?" at={F.crorepati} until={F.s5} y={250} size={88} slam rotate={3} />
      <Chip text="12% / SAAL" at={F.baarah} until={F.A} y={330} size={96} color="#fff" />
      <Chip text="10 SAAL BAAD?" at={F.kitne} until={F.A} y={480} size={96} slam rotate={-3} />
      <Tiles tiles={TILES} until={F.s7} outroAt={F.comment} />
      <Chip text="ROTI YA BEEJ?" at={F.s7} until={F.comment} y={420} size={100} />
      <Chip text="COMMENT KARO" at={F.comment} until={F.answer} y={720} size={84} />
      <Chip text="ANSWER NEXT REEL" at={F.answer} y={720} size={76} color="#fff" bg="#7048e8" />
      <FollowButton at={F.follow} tapAt={F.handle} />

      <Grain />

      <Audio src={staticFile("voice/rotibeej.wav")} volume={1} />
      <Audio src={staticFile("music/loop.wav")} loop volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

