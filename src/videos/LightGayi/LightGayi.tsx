// LightGayi (Part 1): the night before the exam the power goes; Riya's admit card is in a dead fingerprint locker;
// one power bank, one charge: phone 70%, torch 0%, locker 0%. Answer: C (the locker; the phone's flashlight solves the dark).
// Every cue frame comes from ./words.json (measured word times) or ./pauses.json (measured pauses). Never hard-code times.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
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
  SoftLight,
  Vignette,
  WordsFile,
} from "../../lib/reel";
import { FollowButton, Tiles } from "../../lib/ui";
import { CoinRain } from "../AiCrore/screens";
import { HundredNote, PrizeBackdrop } from "../ShaadiChor/world";
import pausesData from "./pauses.json";
import wordsData from "./words.json";
import { BigLocker, Blanket, BusClock, Countdown, Dark, DeviceCard, PowerBank, Room, Zzz } from "./world";

const data = wordsData as unknown as WordsFile;
const cue = makeCue(data);
export const LIGHTGAYI_DURATION = data.words[data.words.length - 1].endFrame + 60; // ends 2 s after the voice

// Where the aligner drifted, the word start is the END of the measured pause just before it (pauses.json).
const pauses = (pausesData as { pauses: { start: number; end: number }[] }).pauses;
const afterPause = (t: number) => Math.round((pauses.find((p) => p.end >= t)?.end ?? t) * 30);

const F = {
  wake: cue(3, "raat"), // she jumps out of bed on "raat"
  light: afterPause(1.5), // pause 1.54-1.67 s, then "light gayi"
  gayi: cue(6, "gayi"),
  admit: cue(8, "admit"),
  band: cue(10, "band"),
  locker: cue(11, "locker"),
  s2: cue(14, "Riya"),
  power: cue(18, "power"),
  sirf: cue(22, "sirf"),
  s3: cue(29, "Phone"),
  sattar: cue(31, "sattar"),
  torch: cue(35, "Torch"),
  finger: cue(38, "fingerprint"),
  s4: cue(42, "Bahar"),
  andhera: cue(44, "andhera"),
  bus: cue(46, "bus"),
  s5: cue(50, "Galat"),
  exam: cue(54, "exam"),
  pehle: cue(57, "pehle"),
  A: afterPause(17.4), // pause 17.49-17.62 s, then "A"
  B: afterPause(18.3), // pause 18.41-18.55 s, then "B"
  C: afterPause(19.3), // pause 19.40-19.54 s, then "C"
  D: afterPause(20.6), // pause 20.81-20.95 s, then "D"
  s7: cue(72, "Sabse"),
  sau: cue(79, "sau"),
  cash: cue(81, "cash"),
  jaldi: cue(83, "jaldi"),
  comment: cue(84, "comment"),
  s8: cue(86, "Answer"),
  follow: cue(91, "follow"),
  handle: cue(93, "@rehanfact"),
};
const END = LIGHTGAYI_DURATION;
const inRange = (f: number, a: number, b: number) => f >= a && f < b;

const RIYA = {
  skin: "#C68B59",
  shirt: "#a5d8ff",
  pants: "#1c3d7a",
  longHair: "#1d1420",
  hair: "#1d1420",
  lashes: true,
  earrings: true,
  seed: 6,
} as const;
const Riya: React.FC<{
  x: number;
  y?: number;
  scale?: number;
  poses: Cue<PoseName>[];
  exprs: Cue<Expr>[];
  hops?: number[];
  sweat?: Cue<boolean>[];
  holding?: Cue<"none" | "phone">[];
  look?: Cue<number>[];
  turn?: number;
}> = ({ y = 1760, scale = 0.92, ...p }) => <Character {...RIYA} y={y} scale={scale} {...p} />;

// the three device cards, laid out across the middle of the frame
const CARDS = [
  { kind: "phone" as const, x: 200, label: "PHONE", pct: 70 },
  { kind: "torch" as const, x: 540, label: "TORCH", pct: 0 },
  { kind: "locker" as const, x: 880, label: "LOCKER", pct: 0 },
];

// ---------------- scenes ----------------
const RoomScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dark = frame >= F.light ? Math.min(1, (frame - F.light) / 4) : 0;
  // asleep on the bed (lying, head on the pillow) -> jumps up on "raat" -> stands in front of the bed
  const w = interpolate(frame, [F.wake, F.wake + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) });
  const feetX = 860 + (520 - 860) * w;
  const feetY = 1310 + (1760 - 1310) * w - Math.sin(Math.min(1, w) * Math.PI) * 120;
  const rot = -90 * (1 - w);
  return (
    <>
      <Camera from={0} to={F.s2} zoom={[1.0, 1.08]} pan={[0, -20]} shakeAt={[F.wake, F.light]}>
        <Room cutAt={F.light} bed />
        {/* once she jumps up, the blanket falls BEHIND her so it never crosses her face */}
        {frame >= F.wake && <Blanket offAt={F.wake} />}
        <AbsoluteFill style={{ transform: `rotate(${rot}deg)`, transformOrigin: `${feetX}px ${feetY}px` }}>
          <Riya
            x={feetX}
            y={feetY}
            scale={0.78}
            poses={[
              { f: 0, v: "idle" },
              { f: F.wake, v: "shrug" },
              { f: F.light, v: "shrug" },
              { f: F.admit, v: "point" },
            ]}
            exprs={[
              { f: 0, v: "sleep" },
              { f: F.wake, v: "wow" },
              { f: F.light, v: "shock" },
              { f: F.admit, v: "worried" },
            ]}
            holding={[
              { f: 0, v: "none" },
              { f: F.admit, v: "phone" },
            ]}
            hops={[F.light]}
            look={[
              { f: 0, v: 0 },
              { f: F.light, v: -1 },
              { f: F.admit, v: 1 },
            ]}
            sweat={[{ f: F.gayi, v: true }]}
          />
        </AbsoluteFill>
        {frame < F.wake && <Blanket offAt={F.wake} />}
        <Zzz x={260} y={1100} until={F.wake} />
      </Camera>
      {dark > 0 && <Dark glowX={560} glowY={1250} amount={dark} />}
    </>
  );
};

// Riya walks right up to the huge safe (three-quarter view towards it: her face stays visible, never her back) and
// tugs the wheel: it doesn't budge.
const LockerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const walk = interpolate(frame, [F.admit, F.admit + 14], [120, 330], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  const tugs = [F.band, F.band + 12, F.locker + 4];
  return (
    <>
      <Camera from={F.admit} to={F.s2} zoom={[1.0, 1.06]} pan={[0, -20]} shakeAt={[F.band]}>
        <Room cutAt={-100} />
        <BigLocker tugAt={tugs} />
        <Riya
          x={walk}
          y={1780}
          scale={0.8}
          turn={0.6}
          poses={[
            { f: F.admit, v: "idle" },
            { f: F.admit + 12, v: "point" },
            { f: F.band, v: "present" },
            { f: F.locker, v: "shrug" },
          ]}
          exprs={[
            { f: F.admit, v: "worried" },
            { f: F.band, v: "angry" },
            { f: F.locker, v: "cry" },
          ]}
          hops={[F.admit + 2, F.admit + 9]}
          sweat={[{ f: F.band, v: true }]}
        />
      </Camera>
      <Dark glowX={420} glowY={1100} amount={0.7} />
    </>
  );
};

const BankScene: React.FC = () => (
  <>
    <Camera from={F.s2} to={F.s3} zoom={[1.06, 1.14]}>
      <Room cutAt={-100} />
      <Riya
        x={360}
        poses={[
          { f: F.s2, v: "hold" },
          { f: F.power, v: "present" },
          { f: F.sirf, v: "point" },
        ]}
        exprs={[
          { f: F.s2, v: "think" },
          { f: F.power, v: "smile" },
          { f: F.sirf, v: "worried" },
        ]}
        holding={[
          { f: F.s2, v: "phone" },
          { f: F.power, v: "none" },
        ]}
        look={[{ f: 0, v: 1 }]}
      />
    </Camera>
    <Dark glowX={780} glowY={820} />
    <PowerBank x={800} y={800} at={F.power} s={1.2} />
  </>
);

const BoardScene: React.FC<{ from: number; to: number; hot?: number }> = ({ from, to, hot = -1 }) => {
  const at = [F.s3, F.torch, F.finger];
  const batt = [F.sattar, F.torch, F.finger];
  return (
    <>
      <Camera from={from} to={to} zoom={[1.0, 1.05]}>
        <Room cutAt={-100} />
      </Camera>
      <Dark glowX={540} glowY={900} amount={0.9} />
      {CARDS.map((c, i) => (
        <DeviceCard
          key={c.kind}
          x={c.x}
          y={940}
          kind={c.kind}
          pct={c.pct}
          at={Math.min(at[i], from)}
          batteryAt={Math.min(batt[i], from)}
          label={c.label}
          hot={hot === i}
        />
      ))}
      <Riya
        x={200}
        y={1800}
        scale={0.62}
        poses={[
          { f: from, v: "point" },
          { f: F.torch, v: "shrug" },
          { f: F.finger, v: "shrug" },
        ]}
        exprs={[
          { f: from, v: "smile" },
          { f: F.torch, v: "worried" },
          { f: F.finger, v: "shock" },
        ]}
        holding={[{ f: 0, v: "phone" }]}
        sweat={[{ f: F.torch, v: true }]}
      />
      <PowerBank x={760} y={1560} at={from} s={0.8} />
    </>
  );
};

const NightScene: React.FC = () => (
  <>
    <Camera from={F.s4} to={F.s5} zoom={[1.15, 1.25]} panY={[-80, -80]} pan={[120, 140]}>
      <Room cutAt={-100} />
      <Riya
        x={420}
        poses={[
          { f: F.s4, v: "idle" },
          { f: F.andhera, v: "shrug" },
          { f: F.bus, v: "point" },
        ]}
        exprs={[
          { f: F.s4, v: "worried" },
          { f: F.bus, v: "shock" },
        ]}
        holding={[{ f: 0, v: "phone" }]}
        look={[{ f: 0, v: -1 }]}
        sweat={[{ f: F.bus, v: true }]}
      />
    </Camera>
    <Dark glowX={520} glowY={1100} />
    <BusClock x={760} y={640} at={F.bus} />
  </>
);

const PanicScene: React.FC = () => (
  <>
    <Camera from={F.s5} to={F.A} zoom={[1.0, 1.1]} shakeAt={[F.s5, F.exam]}>
      <Room cutAt={-100} />
      <Riya
        x={540}
        y={1800}
        poses={[
          { f: F.s5, v: "shrug" },
          { f: F.pehle, v: "shrug" },
        ]}
        exprs={[
          { f: F.s5, v: "shock" },
          { f: F.exam, v: "cry" },
          { f: F.pehle, v: "think" },
        ]}
        sweat={[{ f: F.s5, v: true }]}
        hops={[F.exam]}
      />
    </Camera>
    <Dark glowX={540} glowY={1150} amount={0.8} />
  </>
);

const OptionsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const hot = frame >= F.D ? -1 : frame >= F.C ? 2 : frame >= F.B ? 1 : 0;
  const at = [F.s3, F.torch, F.finger];
  return (
    <>
      <Camera from={F.A} to={F.s7} zoom={[1.0, 1.04]}>
        <Room cutAt={-100} />
      </Camera>
      <Dark glowX={540} glowY={1000} amount={0.9} />
      {CARDS.map((c, i) => (
        <DeviceCard
          key={c.kind}
          x={c.x}
          y={1040}
          kind={c.kind}
          pct={c.pct}
          at={Math.min(at[i], F.A)}
          batteryAt={-100}
          label={c.label}
          hot={hot === i || (frame >= F.D && Math.floor(frame / 6) % 3 === i)}
        />
      ))}
      <Riya
        x={200}
        y={1820}
        scale={0.6}
        poses={[
          { f: F.A, v: "point" },
          { f: F.B, v: "think" },
          { f: F.C, v: "point" },
          { f: F.D, v: "shrug" },
        ]}
        exprs={[
          { f: F.A, v: "think" },
          { f: F.C, v: "wow" },
          { f: F.D, v: "worried" },
        ]}
        holding={[{ f: 0, v: "phone" }]}
      />
      <PowerBank x={760} y={1600} at={F.A} s={0.7} />
    </>
  );
};

const PrizeScene: React.FC = () => (
  <>
    <Camera from={F.s7} to={F.s8} zoom={[1.0, 1.06]}>
      <PrizeBackdrop from={F.s7} />
      <HundredNote at={F.sau} x={600} y={1000} />
      <CoinRain at={F.cash} floorY={1760} count={16} />
      <Riya
        x={240}
        y={1800}
        scale={0.85}
        poses={[
          { f: F.s7, v: "present" },
          { f: F.sau, v: "cheer" },
          { f: F.comment, v: "point" },
        ]}
        exprs={[
          { f: F.s7, v: "smile" },
          { f: F.sau, v: "grin" },
        ]}
        hops={[F.sau]}
      />
    </Camera>
    <Countdown x={860} y={1380} at={F.jaldi} />
  </>
);

const OutroScene: React.FC = () => (
  <>
    <Camera from={F.s8} to={END} zoom={[1.0, 1.05]}>
      <Room cutAt={-100} />
      <Riya
        x={250}
        y={1850}
        scale={0.8}
        poses={[
          { f: F.s8, v: "think" },
          { f: F.follow, v: "wave" },
        ]}
        exprs={[
          { f: F.s8, v: "think" },
          { f: F.follow, v: "grin" },
        ]}
        holding={[{ f: 0, v: "phone" }]}
      />
    </Camera>
    <Dark glowX={330} glowY={1350} amount={0.8} />
  </>
);

// ---------------- sound ----------------
type S = { f: number; s: string; v: number };
const SFX: S[] = [
  { f: 0, s: "whoosh", v: 0.2 },
  { f: 0, s: "tick", v: 0.2 },
  { f: F.light - 8, s: "buzzer", v: 0.05 },
  { f: F.light, s: "thud", v: 0.25 },
  { f: F.admit, s: "pop", v: 0.2 },
  { f: F.locker, s: "click", v: 0.22 },
  { f: F.s2, s: "whoosh", v: 0.2 },
  { f: F.power, s: "pop", v: 0.22 },
  { f: F.sirf, s: "ding", v: 0.12 },
  { f: F.s3, s: "whoosh", v: 0.2 },
  { f: F.s3, s: "pop", v: 0.18 },
  { f: F.sattar, s: "sparkle", v: 0.15 },
  { f: F.torch, s: "pop", v: 0.2 },
  { f: F.torch + 4, s: "buzzer", v: 0.05 },
  { f: F.finger, s: "pop", v: 0.2 },
  { f: F.finger + 4, s: "buzzer", v: 0.05 },
  { f: F.s4, s: "whoosh", v: 0.2 },
  { f: F.bus, s: "pop", v: 0.2 },
  { f: F.bus + 6, s: "tick", v: 0.2 },
  { f: F.s5, s: "whoosh", v: 0.22 },
  { f: F.s5, s: "slam", v: 0.26 },
  { f: F.exam, s: "thud", v: 0.2 },
  { f: F.pehle, s: "pop", v: 0.2 },
  { f: F.A, s: "whoosh", v: 0.2 },
  { f: F.A + 8, s: "thud", v: 0.2 },
  { f: F.B + 8, s: "thud", v: 0.2 },
  { f: F.C + 8, s: "thud", v: 0.2 },
  { f: F.D + 8, s: "thud", v: 0.2 },
  { f: F.s7, s: "whoosh", v: 0.22 },
  { f: F.sau, s: "pop", v: 0.24 },
  { f: F.cash, s: "sparkle", v: 0.2 },
  { f: F.jaldi, s: "tick", v: 0.25 },
  { f: F.jaldi + 15, s: "tick", v: 0.25 },
  { f: F.jaldi + 30, s: "tick", v: 0.25 },
  { f: F.comment, s: "pop", v: 0.2 },
  { f: F.s8, s: "whoosh", v: 0.2 },
  { f: F.s8, s: "pop", v: 0.2 },
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
  { k: "A", t: "PHONE", c: "#ff6b6b", f: F.A },
  { k: "B", t: "TORCH", c: "#4dabf7", f: F.B },
  { k: "C", t: "FINGERPRINT LOCKER", c: "#51cf66", f: F.C },
  { k: "D", t: "TEENO THODA THODA", c: "#fcc419", f: F.D },
];

// ---------------- composition ----------------
export const LightGayi: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {inRange(frame, 0, F.admit) && <RoomScene />}
      {inRange(frame, F.admit, F.s2) && <LockerScene />}
      {inRange(frame, F.s2, F.s3) && <BankScene />}
      {inRange(frame, F.s3, F.s4) && <BoardScene from={F.s3} to={F.s4} />}
      {inRange(frame, F.s4, F.s5) && <NightScene />}
      {inRange(frame, F.s5, F.A) && <PanicScene />}
      {inRange(frame, F.A, F.s7) && <OptionsScene />}
      {inRange(frame, F.s7, F.s8) && <PrizeScene />}
      {frame >= F.s8 && <OutroScene />}

      <SoftLight />
      <Vignette />

      {/* TEXT */}
      <Chip text="EXAM KAL HAI!" at={0} until={F.light} y={250} size={110} slam from={1.08} />
      <Chip text="MOHALLE KI LIGHT GAYI!" at={F.light} until={F.admit} y={250} size={70} color="#fff" slam from={1.15} />
      <Chip text="ADMIT CARD LOCKED" at={F.admit} until={F.s2} y={250} size={70} color="#fff" bg="#c92a2a" />
      <Chip text="KHULEGA HI NAHI!" at={F.band} until={F.s2} y={380} size={76} color="#ff8787" slam from={1.15} />
      <Chip text="1 POWER BANK" at={F.power} until={F.s3} y={300} size={96} color="#fff" bg="#3b5bdb" />
      <Chip text="SIRF 1 CHARGE" at={F.sirf} until={F.s3} y={450} size={84} />
      <Chip text="PHONE 70%" at={F.sattar} until={F.torch} y={330} size={96} color="#8ce99a" />
      <Chip text="TORCH 0%" at={F.torch} until={F.finger} y={330} size={96} color="#ff8787" />
      <Chip text="LOCKER 0%" at={F.finger} until={F.s4} y={330} size={96} color="#ff8787" />
      <Chip text="GHUP ANDHERA" at={F.andhera} until={F.s5} y={330} size={96} color="#fff" />
      <Chip text="GALAT = EXAM GAYA" at={F.s5} until={F.pehle} y={330} size={84} color="#ff6b6b" slam />
      <Chip text="PEHLE KYA?" at={F.pehle} until={F.A} y={330} size={120} slam rotate={3} />
      <Tiles tiles={TILES} until={F.s7} outroAt={F.s8} />
      <Chip text="₹100 CASH PRIZE" at={F.sau} until={F.s8} y={330} size={100} slam />
      <Chip text="SABSE PEHLE COMMENT" at={F.s7} until={F.s8} y={500} size={64} color="#fff" bg="#e8590c" />
      <Chip text="JALDI!" at={F.jaldi} until={F.s8} y={640} size={100} color="#ff6b6b" slam rotate={-4} />
      <Chip text="ANSWER NEXT REEL" at={F.s8} y={720} size={76} color="#fff" bg="#7048e8" />
      <FollowButton at={F.follow} tapAt={F.handle} x={90} y={860} enter="below" />

      <Grain />

      <Audio src={staticFile("voice/lightgayi.wav")} volume={1} />
      <Audio src={staticFile("music/loop.wav")} loop volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
