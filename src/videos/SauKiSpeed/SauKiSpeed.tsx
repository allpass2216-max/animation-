// SauKiSpeed (Part 1, HOUSE STYLE v2): Sharma ji at 100 km/h; a goat, a buffalo and a selfie boy on the road; the family
// pulls different ways. Clue on the HUD: 150 m (a car at 100 km/h stops in ~84 m). Answer: D, kisi ko nahi (brake).
// Every cue frame comes from ./words.json (measured word times) or ./pauses.json (measured pauses). Never hard-code times.
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Character, Cue, Expr, PoseName } from "../../lib/Character";
import { Camera, Chip, Grain, makeCue, SoftLight, Vignette, WordsFile } from "../../lib/reel";
import {
  CountdownBadge,
  CtaStrip,
  Hud,
  KaraokeCaptions,
  OptionList,
  Pill,
  ProfileCard,
  QuestionBanner,
  ShareBubble,
} from "../../lib/style2";
import pausesData from "./pauses.json";
import wordsData from "./words.json";
import { Buffalo, CarInterior, DoorFront, Goat, Highway, persp, PovFrame, VP } from "./world";

const data = wordsData as unknown as WordsFile;
const cue = makeCue(data);
export const SAUKISPEED_DURATION = data.words[data.words.length - 1].endFrame + 60; // ends 2 s after the voice

// Where the aligner drifted, the word start is the END of the measured pause just before it (pauses.json).
const pauses = (pausesData as { pauses: { start: number; end: number }[] }).pauses;
const afterPause = (t: number) => Math.round((pauses.find((p) => p.end >= t)?.end ?? t) * 30);

const F = {
  saamne: cue(6, "saamne"),
  teen: cue(9, "teen"),
  s2: cue(11, "Ek"),
  bhains: cue(14, "bhains"),
  boy: cue(15, "aur"),
  selfie: cue(19, "selfie"),
  s3: cue(22, "Mummy"),
  bhainsM: cue(24, "bhains"),
  gaon: cue(29, "gaon"),
  s4: cue(32, "Pinki"),
  cute: cue(36, "cute"),
  s5: cue(38, "Aur"),
  chillaya: cue(40, "chillaya"),
  viral: cue(43, "viral"),
  s6: cue(45, "Papa"),
  kaanp: cue(48, "kaanp"),
  clue: afterPause(16.75), // pause 16.71-16.84 s, then "ek clue screen pe hai"
  dhyan: cue(55, "dhyan"),
  A: afterPause(18.4), // pause 18.40-18.54 s, then "A"
  B: cue(61, "B"),
  C: cue(67, "C"),
  D: cue(72, "D"),
  s8: cue(76, "Comment"),
  sabse: cue(82, "sabse"),
  s9: cue(91, "Sau"),
  bhejo: cue(99, "bhejo"),
  answer: cue(100, "answer"),
  follow: cue(105, "follow"),
  handle: cue(107, "@rehanfact"),
};
const END = SAUKISPEED_DURATION;
const inRange = (f: number, a: number, b: number) => f >= a && f < b;

// ---------------- characters (ours) ----------------
type Act = {
  x: number;
  y?: number;
  scale?: number;
  poses: Cue<PoseName>[];
  exprs: Cue<Expr>[];
  hops?: number[];
  sweat?: Cue<boolean>[];
  holding?: Cue<"none" | "phone">[];
  look?: Cue<number>[];
  shades?: Cue<boolean>[];
};
const mk =
  (base: object) =>
  ({ y = 1930, scale = 1.15, ...p }: Act) => <Character {...base} y={y} scale={scale} {...p} />;
const Papa = mk({ skin: "#B97A50", shirt: "#4c6ef5", pants: "#343a40", hair: "#1d1420", mustache: true, seatbelt: true, seed: 1 });
const Mummy = mk({
  skin: "#C68B59",
  shirt: "#e64980",
  pants: "#c2255c",
  hair: "#1d1420",
  longHair: "#1d1420",
  lipstick: "#c2255c",
  lashes: true,
  earrings: true,
  bindi: true,
  seatbelt: true,
  seed: 3,
});
const Pinki = mk({ skin: "#D9A066", shirt: "#fcc419", pants: "#f76707", hair: "#2b1a12", longHair: "#2b1a12", lashes: true, seatbelt: true, seed: 5 });
const SelfieBoy = mk({ skin: "#C68B59", shirt: "#12b886", pants: "#343a40", hair: "#1d1420", hood: "#0ca678", quiff: true, seed: 8 });

// distance on the HUD: 150 m, creeping down while everyone argues (the reel is in "slow motion"), then holding
const distAt = (f: number) => 150 - 19 * Math.min(1, f / F.A);
const speedAt = (f: number) => 100 + Math.sin(f / 9) * 0.8;

/** The three on the road, far ahead in the POV (scale grows as the camera pushes in). */
const RoadTrio: React.FC<{ t: number }> = ({ t }) => {
  const a = persp(t);
  const s = 0.16 + a.s * 1.3;
  return (
    <>
      <Goat x={VP.x - 150 * s * 4} y={a.y - 240 * s} s={s} />
      <Buffalo x={VP.x + 20 * s} y={a.y - 300 * s} s={s} />
      <Character skin="#C68B59" shirt="#12b886" pants="#343a40" hair="#1d1420" hood="#0ca678" quiff x={VP.x + 170 * s * 4} y={a.y + 20} scale={s * 0.9} poses={[{ f: 0, v: "wave" }]} exprs={[{ f: 0, v: "grin" }]} holding={[{ f: 0, v: "phone" }]} />
    </>
  );
};

const PovScene: React.FC<{ from: number; to: number; t0: number; t1: number; tremble?: boolean }> = ({ from, to, t0, t1, tremble }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, to], [t0, t1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Camera from={from} to={to} zoom={[1.0, 1.04]}>
      <Highway speed={1} />
      <RoadTrio t={t} />
      <PovFrame tremble={tremble} />
    </Camera>
  );
};

// ---------------- sound ----------------
type S = { f: number; s: string; v: number };
const SFX: S[] = [
  { f: 0, s: "whoosh", v: 0.22 },
  { f: 0, s: "buzzer", v: 0.05 },
  { f: F.saamne, s: "whoosh", v: 0.14 },
  { f: F.teen, s: "slam", v: 0.22 },
  { f: F.s2, s: "whoosh", v: 0.2 },
  { f: F.s2 + 3, s: "pop", v: 0.2 },
  { f: F.bhains, s: "whoosh", v: 0.2 },
  { f: F.bhains + 3, s: "thud", v: 0.18 },
  { f: F.boy, s: "whoosh", v: 0.2 },
  { f: F.selfie, s: "click", v: 0.3 },
  { f: F.s3, s: "whoosh", v: 0.2 },
  { f: F.s3, s: "pop", v: 0.18 },
  { f: F.bhainsM, s: "pop", v: 0.2 },
  { f: F.s4, s: "whoosh", v: 0.2 },
  { f: F.cute, s: "sparkle", v: 0.18 },
  { f: F.s5, s: "whoosh", v: 0.2 },
  { f: F.viral, s: "click", v: 0.3 },
  { f: F.viral, s: "pop", v: 0.18 },
  { f: F.s6, s: "whoosh", v: 0.2 },
  { f: F.kaanp, s: "buzzer", v: 0.06 },
  { f: F.clue, s: "slam", v: 0.26 },
  { f: F.A, s: "whoosh", v: 0.2 },
  { f: F.A, s: "pop", v: 0.2 },
  { f: F.B, s: "pop", v: 0.2 },
  { f: F.C, s: "pop", v: 0.2 },
  { f: F.D, s: "pop", v: 0.2 },
  { f: F.s8, s: "pop", v: 0.2 },
  { f: F.sabse, s: "ding", v: 0.15 },
  { f: F.s9, s: "whoosh", v: 0.2 },
  { f: F.s9, s: "pop", v: 0.2 },
  { f: F.answer, s: "whoosh", v: 0.18 },
  { f: F.follow, s: "pop", v: 0.2 },
  { f: F.handle, s: "click", v: 0.3 },
  { f: F.handle, s: "sparkle", v: 0.15 },
  ...Array.from({ length: 12 }).map((_, i) => ({ f: F.clue + i * 30, s: "tick", v: 0.12 })),
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

const OPTS = [
  { k: "A", t: "BAKRI", c: "#ff6b6b", f: F.A },
  { k: "B", t: "KHET MEIN", c: "#4dabf7", f: F.B },
  { k: "C", t: "HORN, CHALTE RAHO", c: "#51cf66", f: F.C },
  { k: "D", t: "KISI KO NAHI", c: "#fcc419", f: F.D },
];

// ---------------- composition ----------------
export const SauKiSpeed: React.FC = () => {
  const frame = useCurrentFrame();
  const pov = inRange(frame, 0, F.s2) || inRange(frame, F.A, F.s9) || frame >= F.answer;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {inRange(frame, 0, F.s2) && <PovScene from={0} to={F.s2} t0={0.18} t1={0.28} />}
      {inRange(frame, F.s2, F.bhains) && (
        <Camera from={F.s2} to={F.bhains} zoom={[1.0, 1.1]}>
          <Highway speed={0} />
          <Goat x={540} y={1150} s={1.9} />
        </Camera>
      )}
      {inRange(frame, F.bhains, F.boy) && (
        <Camera from={F.bhains} to={F.boy} zoom={[1.0, 1.1]}>
          <Highway speed={0} />
          <Buffalo x={540} y={1120} s={1.6} />
        </Camera>
      )}
      {inRange(frame, F.boy, F.s3) && (
        <Camera from={F.boy} to={F.s3} zoom={[1.0, 1.08]}>
          <Highway speed={0} />
          <Goat x={180} y={1250} s={0.55} />
          <Buffalo x={900} y={1230} s={0.5} />
          <SelfieBoy
            x={540}
            y={1880}
            scale={0.95}
            poses={[
              { f: F.boy, v: "hold" },
              { f: F.selfie, v: "wave" },
            ]}
            exprs={[
              { f: F.boy, v: "smile" },
              { f: F.selfie, v: "grin" },
            ]}
            holding={[{ f: 0, v: "phone" }]}
            hops={[F.selfie]}
          />
        </Camera>
      )}
      {inRange(frame, F.s3, F.s4) && (
        <Camera from={F.s3} to={F.s4} zoom={[1.0, 1.06]}>
          <CarInterior seatX={540} />
          <Mummy
            x={540}
            poses={[
              { f: F.s3, v: "idle" },
              { f: F.bhainsM, v: "point" },
              { f: F.gaon, v: "shrug" },
            ]}
            exprs={[
              { f: F.s3, v: "worried" },
              { f: F.bhainsM, v: "angry" },
            ]}
            look={[{ f: 0, v: -1 }]}
          />
          <DoorFront />
        </Camera>
      )}
      {inRange(frame, F.s4, F.s5) && (
        <Camera from={F.s4} to={F.s5} zoom={[1.0, 1.06]}>
          <CarInterior seatX={540} back />
          <Pinki
            x={540}
            y={1960}
            scale={1.0}
            poses={[
              { f: F.s4, v: "wave" },
              { f: F.cute, v: "cheer" },
            ]}
            exprs={[
              { f: F.s4, v: "smile" },
              { f: F.cute, v: "grin" },
            ]}
            hops={[F.cute]}
          />
          <DoorFront />
        </Camera>
      )}
      {inRange(frame, F.s5, F.s6) && (
        <Camera from={F.s5} to={F.s6} zoom={[1.05, 1.15]}>
          <Highway speed={0} />
          <SelfieBoy
            x={540}
            y={2100}
            scale={1.2}
            poses={[
              { f: F.s5, v: "hold" },
              { f: F.chillaya, v: "wave" },
              { f: F.viral, v: "cheer" },
            ]}
            exprs={[
              { f: F.s5, v: "grin" },
              { f: F.chillaya, v: "wow" },
              { f: F.viral, v: "grin" },
            ]}
            holding={[{ f: 0, v: "phone" }]}
            hops={[F.viral]}
          />
        </Camera>
      )}
      {inRange(frame, F.s6, F.A) && (
        <Camera from={F.s6} to={F.A} zoom={[1.0, 1.1]} shakeAt={[F.clue]}>
          <CarInterior seatX={540} />
          <Papa
            x={540}
            poses={[
              { f: F.s6, v: "hold" },
              { f: F.kaanp, v: "shrug" },
              { f: F.dhyan, v: "point" },
            ]}
            exprs={[
              { f: F.s6, v: "worried" },
              { f: F.kaanp, v: "shock" },
              { f: F.dhyan, v: "think" },
            ]}
            sweat={[{ f: F.s6, v: true }]}
          />
          <DoorFront />
        </Camera>
      )}
      {inRange(frame, F.A, F.s9) && <PovScene from={F.A} to={F.s9} t0={0.28} t1={0.32} tremble />}
      {inRange(frame, F.s9, F.answer) && (
        <Camera from={F.s9} to={F.answer} zoom={[1.0, 1.06]}>
          <CarInterior seatX={330} />
          <Papa x={330} scale={1.0} y={1960} poses={[{ f: F.s9, v: "shrug" }]} exprs={[{ f: F.s9, v: "shock" }]} sweat={[{ f: 0, v: true }]} />
          <Mummy x={770} scale={1.0} y={1960} poses={[{ f: F.s9, v: "point" }]} exprs={[{ f: F.s9, v: "wow" }, { f: F.bhejo, v: "grin" }]} hops={[F.bhejo]} />
          <DoorFront />
        </Camera>
      )}
      {frame >= F.answer && <PovScene from={F.answer} to={END} t0={0.32} t1={0.33} />}

      <SoftLight />
      <Vignette />

      {/* HOUSE STYLE v2 UI */}
      <Pill text="PAHELI #1" at={0} y={40} bg="#2f9e44" />
      {pov && <Hud speed={speedAt(frame)} dist={distAt(frame)} until={F.answer} />}
      <QuestionBanner l1="100 KI SPEED!" l2="AB KYA KAROGE?" at={0} until={F.s2} y={290} />
      <Chip text="TEEN MUSIBAT!" at={F.teen} until={F.s2} y={610} size={84} color="#ff6b6b" slam />
      <Pill text="BAKRI" at={F.s2} until={F.bhains} y={120} bg="#f08c00" />
      <Pill text="BHAINS" at={F.bhains} until={F.boy} y={120} bg="#495057" />
      <Pill text="SELFIE BOY" at={F.boy} until={F.s3} y={120} bg="#0ca678" />
      <Pill text="MUMMY" at={F.s3} until={F.s4} y={120} bg="#d6336c" />
      <Chip text="BHAINS MAT MAARNA!" at={F.bhainsM} until={F.s4} y={380} size={72} color="#fff" bg="#c92a2a" />
      <Pill text="PINKI" at={F.s4} until={F.s5} y={120} bg="#f08c00" />
      <Chip text="BAKRI CUTE HAI!" at={F.cute} until={F.s5} y={380} size={80} />
      <Pill text="SELFIE BOY" at={F.s5} until={F.s6} y={120} bg="#0ca678" />
      <Chip text="VIDEO VIRAL HOGA!" at={F.viral} until={F.s6} y={380} size={76} color="#fff" bg="#7048e8" />
      <Pill text="PAPA" at={F.s6} until={F.A} y={120} bg="#1c7ed6" />
      <Chip text="CLUE SCREEN PE HAI!" at={F.clue} until={F.A} y={380} size={72} slam />
      <CountdownBadge at={F.clue} until={F.s9} />
      <QuestionBanner l1="TUM PAPA HO," l2="KYA KAROGE?" at={F.A} until={F.s8} y={290} />
      {frame < F.answer && <OptionList opts={OPTS} until={F.s9} y={640} outroAt={F.s8} />}
      <CtaStrip text="COMMENT: LETTER + REASON" at={F.s8} until={F.s9} y={300} bg="#fff" color="#1b1430" />
      <CtaStrip text="SABSE PEHLE SAHI = NAAM PART 2" at={F.sabse} until={F.s9} y={400} />
      <ShareBubble text="100 SE KAM NA CHALAANE WALE DOST KO BHEJO!" at={F.s9} until={F.answer} />
      <Chip text="ANSWER NEXT REEL" at={F.answer} y={180} size={76} color="#fff" bg="#7048e8" />
      <ProfileCard at={F.follow} tapAt={F.handle} y={300} />
      <KaraokeCaptions data={data} />

      <Grain />

      <Audio src={staticFile("voice/saukispeed.wav")} volume={1} />
      <Audio src={staticFile("music/loop.wav")} loop volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
