// AiCrore (Part 1): "2,000 se 50 crore?" — an AI app fills Ishaan's account; a caller wants it forwarded (money mule).
// Every cue frame comes from ./words.json (measured word times). Never hard-code times here.
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
import { Party } from "../../lib/night";
import {
  Camera,
  Chip,
  Grain,
  H,
  makeCue,
  popSpring,
  SoftLight,
  Sparkles,
  Vignette,
  W,
  WordsFile,
} from "../../lib/reel";
import { FollowButton, Tiles } from "../../lib/ui";
import { Foreground, Layer, Rays, SignText } from "../../lib/world";
import {
  BalanceScreen,
  CallScreen,
  ChatScreen,
  CoinRain,
  CyberCell,
  HostelRoom,
  MoneyOut,
  Phone,
  ShadyGuy,
  TrashDrop,
  TxScreen,
} from "./screens";
import wordsData from "./words.json";

const data = wordsData as unknown as WordsFile;
const cue = makeCue(data);
export const AICRORE_DURATION = data.words[data.words.length - 1].endFrame + 60; // ends 2 s after the voice

const F = {
  baarah: cue(1, "baarah"),
  ishaan: cue(3, "Ishaan"),
  doHazaar: cue(5, "do"),
  ai: cue(9, "AI"),
  likha: cue(14, "likha"),
  mujhe: cue(15, "mujhe"),
  s2: cue(19, "Subah"),
  phone: cue(22, "phone"),
  pachaas: cue(26, "pachaas"),
  crore: cue(27, "crore"),
  s3: cue(28, "Dhaai"),
  hazaar: cue(29, "hazaar"),
  anjaan: cue(36, "anjaan"),
  s4: cue(39, "AI"),
  ho: cue(42, "ho"),
  kisi: cue(44, "kisi"),
  s5: cue(48, "Tabhi"),
  paisa: cue(52, "paisa"),
  shaam: cue(55, "shaam"),
  das: cue(62, "das"),
  A: cue(65, "A"),
  police: cue(70, "police"),
  B: cue(73, "B"),
  wapas: cue(77, "wapas"),
  C: cue(80, "C"),
  del: cue(82, "delete"),
  chup: cue(85, "chup"),
  D: cue(87, "D"),
  party: cue(91, "party"),
  s7: cue(93, "Tum"),
  comment: cue(99, "Comment"),
  answer: cue(101, "answer"),
  follow: cue(106, "follow"),
  handle: cue(108, "@yourhandle"),
};
const END = AICRORE_DURATION;
const inRange = (f: number, a: number, b: number) => f >= a && f < b;

// Ishaan, rapper style: black hoodie, red snapback, gold chain, shades
const ISHAAN = {
  skin: "#B97A50",
  shirt: "#212529",
  pants: "#495057",
  hair: "#1d1420",
  cap: "#e03131",
  chain: true,
  hood: "#343a40",
} as const;

const Ishaan: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  flip?: boolean;
  poses: Cue<PoseName>[];
  exprs: Cue<Expr>[];
  shades: Cue<boolean>[];
  holding?: Cue<"none" | "phone">[];
  hops?: number[];
  sweat?: Cue<boolean>[];
  look?: Cue<number>[];
}> = ({ x = 290, y = 1740, scale = 0.92, ...rest }) => (
  <Character {...ISHAAN} x={x} y={y} scale={scale} {...rest} />
);

// ---------------- scenes ----------------
const MidnightScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Camera from={0} to={F.s2} zoom={[1.0, 1.08]} pan={[0, -20]}>
        <Layer depth={0.3} from={0} drift={-0.3}>
          <HostelRoom />
        </Layer>
        <Ishaan
          poses={[
            { f: 0, v: "cheer" },
            { f: F.doHazaar, v: "point" },
            { f: F.likha, v: "hold" },
            { f: F.mujhe, v: "cheer" },
          ]}
          exprs={[
            { f: 0, v: "grin" },
            { f: F.likha, v: "sly" },
            { f: F.mujhe, v: "grin" },
          ]}
          shades={[{ f: 0, v: true }]}
          holding={[
            { f: 0, v: "none" },
            { f: F.likha, v: "phone" },
            { f: F.mujhe, v: "none" },
          ]}
          hops={[F.mujhe]}
          look={[{ f: 0, v: 1 }]}
        />
      </Camera>
      {frame < F.likha ? (
        <Phone>
          <BalanceScreen
            a={F.doHazaar}
            b={F.doHazaar + 1}
            fromAmt={2000}
            toAmt={2000}
            label="AI MONEY BOT"
          />
        </Phone>
      ) : (
        <Phone>
          <ChatScreen
            msgs={[{ f: F.likha, text: "MUJHE AMEER BANA DE", me: true }]}
          />
        </Phone>
      )}
    </>
  );
};

const MorningScene: React.FC = () => (
  <>
    <Camera from={F.s2} to={F.s3} zoom={[1.0, 1.1]} shakeAt={[F.pachaas]}>
      <Layer depth={0.3} from={F.s2} drift={-0.3}>
        <HostelRoom morning />
      </Layer>
      <Ishaan
        poses={[
          { f: F.s2, v: "idle" },
          { f: F.phone, v: "scratch" },
          { f: F.pachaas, v: "panic" },
          { f: F.crore, v: "cheer" },
        ]}
        exprs={[
          { f: F.s2, v: "think" },
          { f: F.pachaas, v: "shock" },
          { f: F.crore, v: "grin" },
        ]}
        shades={[
          { f: F.s2, v: false },
          { f: F.crore, v: true },
        ]}
        hops={[F.crore]}
        look={[{ f: 0, v: 1 }]}
      />
      <CoinRain at={F.crore} />
    </Camera>
    <Phone buzzAt={F.phone}>
      <BalanceScreen
        a={F.phone}
        b={F.crore}
        fromAmt={2000}
        toAmt={500000000}
        label="MY BANK"
        alertAt={F.pachaas}
      />
    </Phone>
  </>
);

const TxScene: React.FC = () => (
  <>
    <Camera from={F.s3} to={F.s4} zoom={[1.06, 1.0]}>
      <Layer depth={0.3} from={F.s3} drift={-0.3}>
        <HostelRoom morning />
      </Layer>
      <Ishaan
        poses={[
          { f: F.s3, v: "point" },
          { f: F.anjaan, v: "think" },
        ]}
        exprs={[
          { f: F.s3, v: "wow" },
          { f: F.anjaan, v: "worried" },
        ]}
        shades={[
          { f: F.s3, v: true },
          { f: F.hazaar + 10, v: false },
        ]}
        sweat={[{ f: F.anjaan, v: true }]}
        look={[{ f: 0, v: 1 }]}
      />
    </Camera>
    <Phone>
      <TxScreen a={F.s3} countTo={2500} />
    </Phone>
  </>
);

const ChatScene: React.FC = () => (
  <>
    <Camera from={F.s4} to={F.s5} zoom={[1.0, 1.08]}>
      <Layer depth={0.3} from={F.s4} drift={-0.3}>
        <HostelRoom />
      </Layer>
      <Ishaan
        poses={[
          { f: F.s4, v: "hold" },
          { f: F.kisi, v: "panic" },
        ]}
        exprs={[
          { f: F.s4, v: "worried" },
          { f: F.kisi, v: "shock" },
        ]}
        shades={[{ f: F.s4, v: false }]}
        holding={[
          { f: F.s4, v: "phone" },
          { f: F.kisi, v: "none" },
        ]}
        sweat={[{ f: F.s4, v: true }]}
        look={[{ f: 0, v: 1 }]}
      />
    </Camera>
    <Phone>
      <ChatScreen
        msgs={[
          { f: F.s4 - 30, text: "MUJHE AMEER BANA DE", me: true },
          { f: F.ho, text: "HO GAYA." },
          { f: F.kisi, text: "KISI KO MAT BATANA.", red: true },
        ]}
      />
    </Phone>
  </>
);

const CallScene: React.FC = () => (
  <>
    <Camera from={F.s5} to={F.A} zoom={[1.0, 1.12]} shakeAt={[F.paisa, F.das]}>
      <Rays c1="#3b0a14" c2="#7a1225" />
      <Ishaan
        poses={[
          { f: F.s5, v: "idle" },
          { f: F.paisa, v: "panic" },
          { f: F.das, v: "think" },
        ]}
        exprs={[
          { f: F.s5, v: "worried" },
          { f: F.paisa, v: "shock" },
          { f: F.das, v: "worried" },
        ]}
        shades={[{ f: F.s5, v: false }]}
        sweat={[{ f: F.s5, v: true }]}
        hops={[F.paisa - 3]}
        look={[{ f: 0, v: 1 }]}
      />
    </Camera>
    <Phone buzzAt={F.s5}>
      <CallScreen a={F.s5} />
    </Phone>
  </>
);

const OptionScene: React.FC<{
  opt: "A" | "B" | "C" | "D";
  from: number;
  to: number;
}> = ({ opt, from, to }) => {
  const beat =
    opt === "A"
      ? F.police
      : opt === "B"
        ? F.wapas
        : opt === "C"
          ? F.del
          : F.party;
  const frame = useCurrentFrame();
  const punched = frame >= beat;
  return (
    <>
      <Camera
        from={punched ? beat : from}
        to={punched ? to : beat}
        zoom={punched ? [1.08, 1.14] : [1.0, 1.04]}
        panY={punched ? [40, 50] : [0, 0]}
      >
        {opt === "A" && (
          <Layer depth={0.3} from={from} drift={-0.3}>
            <CyberCell />
          </Layer>
        )}
        {opt === "B" && <Rays c1="#212529" c2="#343a40" />}
        {opt === "C" && (
          <Layer depth={0.3} from={from} drift={-0.3}>
            <HostelRoom />
          </Layer>
        )}
        {opt === "D" && <Party flashAt={F.party} />}
        {opt === "B" && (
          <svg
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              overflow: "visible",
            }}
            width={W}
            height={H}
          >
            <ShadyGuy x={860} y={1740} />
          </svg>
        )}
        <Ishaan
          x={opt === "B" ? 280 : opt === "C" ? 300 : 420}
          poses={
            opt === "A"
              ? [
                  { f: from, v: "hold" },
                  { f: F.police, v: "point" },
                ]
              : opt === "B"
                ? [
                    { f: from, v: "hold" },
                    { f: F.wapas, v: "present" },
                  ]
                : opt === "C"
                  ? [
                      { f: from, v: "point" },
                      { f: F.chup, v: "think" },
                    ]
                  : [
                      { f: from, v: "wave" },
                      { f: F.party, v: "cheer" },
                    ]
          }
          exprs={
            opt === "A"
              ? [
                  { f: from, v: "worried" },
                  { f: F.police, v: "smile" },
                ]
              : opt === "B"
                ? [
                    { f: from, v: "worried" },
                    { f: F.wapas, v: "sad" },
                  ]
                : opt === "C"
                  ? [{ f: from, v: "sly" }]
                  : [{ f: from, v: "grin" }]
          }
          shades={[{ f: from, v: opt === "D" }]}
          holding={[
            { f: from, v: opt === "A" || opt === "B" ? "phone" : "none" },
          ]}
          hops={opt === "D" ? [F.party] : []}
          look={[{ f: from, v: 1 }]}
        />
        {opt === "B" && (
          <MoneyOut at={F.wapas} from={[480, 1400]} to={[820, 1330]} />
        )}
        {opt === "C" && <TrashDrop at={F.del} x={790} y={1460} />}
        {opt === "D" && <CoinRain at={F.party} count={14} />}
        {opt === "A" && <Sparkles at={F.police} x={180} y={760} r={180} />}
      </Camera>
      {(opt === "A" || opt === "C") && <Foreground side="right" kind="plant" />}
    </>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Camera from={F.s7} to={END} zoom={[1.0, 1.05]}>
      <Layer depth={0.3} from={F.s7} drift={-0.3}>
        <HostelRoom />
      </Layer>
      <svg
        style={{ position: "absolute", left: 0, top: 0 }}
        width={W}
        height={H}
      >
        {[
          { x: 180, y: 1180, d: 0 },
          { x: 900, y: 1150, d: 6 },
        ].map((q, i) => (
          <g
            key={i}
            transform={`translate(${q.x} ${q.y + Math.sin((frame + i * 9) / 8) * 14}) scale(${popSpring(frame, F.s7 + q.d)})`}
          >
            <SignText x={0} y={50} size={150} text="?" fill="#fff" />
          </g>
        ))}
      </svg>
      <Ishaan
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
        shades={[
          { f: F.s7, v: false },
          { f: F.follow, v: true },
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
  { f: 0, s: "sparkle", v: 0.15 },
  { f: F.baarah, s: "tick", v: 0.2 },
  { f: F.doHazaar, s: "pop", v: 0.2 },
  { f: F.likha, s: "click", v: 0.22 },
  { f: F.mujhe, s: "pop", v: 0.2 },
  { f: F.s2, s: "whoosh", v: 0.2 },
  { f: F.s2, s: "pop", v: 0.18 },
  { f: F.phone, s: "buzzer", v: 0.06 },
  { f: F.pachaas, s: "slam", v: 0.22 },
  { f: F.pachaas, s: "pop", v: 0.2 },
  { f: F.crore, s: "sparkle", v: 0.2 },
  { f: F.crore + 18, s: "thud", v: 0.1 },
  { f: F.s3, s: "whoosh", v: 0.2 },
  { f: F.hazaar, s: "pop", v: 0.2 },
  { f: F.hazaar + 6, s: "tick", v: 0.15 },
  { f: F.hazaar + 14, s: "tick", v: 0.15 },
  { f: F.anjaan, s: "pop", v: 0.2 },
  { f: F.s4, s: "whoosh", v: 0.2 },
  { f: F.ho, s: "ding", v: 0.15 },
  { f: F.kisi, s: "pop", v: 0.22 },
  { f: F.s5, s: "whoosh", v: 0.22 },
  { f: F.s5, s: "buzzer", v: 0.08 },
  { f: F.paisa, s: "slam", v: 0.26 },
  { f: F.shaam, s: "tick", v: 0.2 },
  { f: F.das, s: "slam", v: 0.22 },
  { f: F.A, s: "whoosh", v: 0.2 },
  { f: F.A + 8, s: "thud", v: 0.2 },
  { f: F.police, s: "ding", v: 0.12 },
  { f: F.B, s: "whoosh", v: 0.2 },
  { f: F.B + 8, s: "thud", v: 0.2 },
  { f: F.wapas, s: "whoosh", v: 0.15 },
  { f: F.C, s: "whoosh", v: 0.2 },
  { f: F.C + 8, s: "thud", v: 0.2 },
  { f: F.del + 9, s: "thud", v: 0.2 },
  { f: F.D, s: "whoosh", v: 0.2 },
  { f: F.D + 8, s: "thud", v: 0.2 },
  { f: F.party, s: "sparkle", v: 0.18 },
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
  for (
    let f = Math.max(0, l.startFrame - 3);
    f <= Math.min(END, l.endFrame + 3);
    f++
  )
    speaking[f] = 1;
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
  const fadeOut = interpolate(f, [END - 20, END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (0.18 - 0.08 * (s / n)) * fadeOut;
};

const TILES = [
  { k: "A", t: "BANK + CYBER POLICE", c: "#ff6b6b", f: F.A },
  { k: "B", t: "WAPAS BHEJ DO", c: "#4dabf7", f: F.B },
  { k: "C", t: "DELETE, CHUP RAHO", c: "#51cf66", f: F.C },
  { k: "D", t: "PARTY KARO", c: "#fcc419", f: F.D },
];

// ---------------- composition ----------------
export const AiCrore: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {inRange(frame, 0, F.s2) && <MidnightScene />}
      {inRange(frame, F.s2, F.s3) && <MorningScene />}
      {inRange(frame, F.s3, F.s4) && <TxScene />}
      {inRange(frame, F.s4, F.s5) && <ChatScene />}
      {inRange(frame, F.s5, F.A) && <CallScene />}
      {inRange(frame, F.A, F.B) && <OptionScene opt="A" from={F.A} to={F.B} />}
      {inRange(frame, F.B, F.C) && <OptionScene opt="B" from={F.B} to={F.C} />}
      {inRange(frame, F.C, F.D) && <OptionScene opt="C" from={F.C} to={F.D} />}
      {inRange(frame, F.D, F.s7) && (
        <OptionScene opt="D" from={F.D} to={F.s7} />
      )}
      {frame >= F.s7 && <OutroScene />}

      <SoftLight />
      <Vignette />

      {/* TEXT */}
      <Chip
        text="2,000 SE 50 CRORE?"
        at={0}
        until={F.s2}
        y={250}
        size={84}
        slam
        from={1.08}
      />
      <Chip
        text="12:00 AM"
        at={F.baarah}
        until={F.likha}
        y={400}
        size={80}
        color="#fff"
      />
      <Chip
        text="AI APP"
        at={F.ai}
        until={F.likha}
        y={520}
        size={76}
        color="#fff"
        bg="#7048e8"
      />
      <Chip
        text="6:00 AM"
        at={F.s2}
        until={F.pachaas}
        y={330}
        size={96}
        color="#fff"
      />
      <Chip
        text="50 CRORE CREDITED"
        at={F.pachaas}
        until={F.s3}
        y={330}
        size={80}
        slam
      />
      <Chip
        text="2,500 TRANSFERS"
        at={F.hazaar}
        until={F.anjaan}
        y={330}
        size={88}
      />
      <Chip
        text="ANJAAN ACCOUNTS"
        at={F.anjaan}
        until={F.s4}
        y={330}
        size={84}
        color="#ff6b6b"
      />
      <Chip
        text="KISI KO MAT BATANA"
        at={F.kisi}
        until={F.s5}
        y={330}
        size={76}
        color="#ff6b6b"
      />
      <Chip
        text="UNKNOWN CALL"
        at={F.s5}
        until={F.paisa}
        y={330}
        size={88}
        color="#fff"
      />
      <Chip
        text="PAISA HUMARA HAI"
        at={F.paisa}
        until={F.A}
        y={330}
        size={84}
        color="#ff6b6b"
        slam
      />
      <Chip
        text="SHAAM TAK BHEJO"
        at={F.shaam}
        until={F.das}
        y={480}
        size={76}
        color="#fff"
      />
      <Chip
        text="10% TUMHARA"
        at={F.das}
        until={F.A}
        y={480}
        size={96}
        slam
        rotate={3}
      />
      <Tiles tiles={TILES} until={F.s7} outroAt={F.comment} />
      <Chip
        text="TUM KYA KARTE?"
        at={F.s7}
        until={F.comment}
        y={400}
        size={92}
      />
      <Chip
        text="COMMENT KARO"
        at={F.comment}
        until={F.answer}
        y={720}
        size={84}
      />
      <Chip
        text="ANSWER NEXT REEL"
        at={F.answer}
        y={720}
        size={76}
        color="#fff"
        bg="#7048e8"
      />
      <FollowButton at={F.follow} tapAt={F.handle} />

      <Grain />

      <Audio src={staticFile("voice/aicrore.wav")} volume={1} />
      <Audio src={staticFile("music/loop.wav")} loop volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
