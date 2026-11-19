// SajdaRaat: Islamic reminder (no puzzle, no options). Arham's secret late-night chats -> Quran 17:32 -> sajda -> nikah.
// Muslim characters and city, Arabic calligraphy (Amiri). Every cue frame comes from ./words.json.
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Character } from "../../lib/Character";
import { Camera, Chip, Grain, makeCue, SoftLight, Sparkles, Vignette, WordsFile } from "../../lib/reel";
import { FollowButton } from "../../lib/ui";
import { Rays } from "../../lib/world";
import { ChatScreen, Phone } from "../AiCrore/screens";
import { Arabic, CityScene, HeavyHeart, NikahArch, Room, SajdaFigure, StepsPath } from "./world";
import wordsData from "./words.json";

const data = wordsData as unknown as WordsFile;
const cue = makeCue(data);
export const SAJDARAAT_DURATION = data.words[data.words.length - 1].endFrame + 60;

const F = {
  raat: cue(0, "Raat"),
  phone: cue(6, "phone"),
  chupke: cue(7, "chupke"),
  chamka: cue(9, "chamka"),
  s2: cue(10, "Ek"),
  chhupi: cue(13, "chhupi"),
  ghar: cue(15, "ghar"),
  kisi: cue(17, "kisi"),
  s3: cue(21, "Usne"),
  bas: cue(23, "bas"),
  gunaah: cue(30, "gunaah"),
  s4: cue(31, "Par"),
  dil: cue(34, "dil"),
  bhaari: cue(35, "bhaari"),
  namaz: cue(38, "namaz"),
  s5: cue(41, "Phir"),
  quran: cue(45, "Quran"),
  padha: cue(47, "padha"),
  zina: cue(48, "zina"),
  s6: cue(54, "Kareeb"),
  chhoti: cue(60, "chhoti"),
  shuru: cue(63, "shuru"),
  s7: cue(66, "Arham"),
  phone2: cue(68, "phone"),
  rakha: cue(69, "rakha"),
  wuzu: cue(70, "wuzu"),
  sajde: cue(73, "sajde"),
  ro: cue(75, "ro"),
  s8: cue(77, "Agle"),
  ammi: cue(80, "Ammi"),
  nikah: cue(84, "nikah"),
  s9: cue(87, "Allah"),
  chhoda: cue(91, "chhoda"),
  behtar: cue(94, "behtar"),
  s10: cue(98, "Is"),
  share: cue(101, "share"),
  sadqa: cue(103, "sadqa-e-jariya"),
  follow: cue(106, "follow"),
  handle: cue(108, "@rehanfact"),
};
const END = SAJDARAAT_DURATION;
const inRange = (f: number, a: number, b: number) => f >= a && f < b;

const ARHAM = { skin: "#C98B5E", shirt: "#f1f3f5", pants: "#dee2e6", hair: "#1d1420", beard: true } as const; // white kurta
const ARHAM_KUFI = { ...ARHAM, kufi: "#f8f9fa" } as const;
const AMMI = { skin: "#C98B5E", shirt: "#2f6f5e", pants: "#2f6f5e", hair: "#1d1420", dress: "#2f6f5e", hijab: "#e9ecef", glasses: true } as const;
const GIRL = { skin: "#e8b48a", shirt: "#7048e8", pants: "#7048e8", hair: "#2a1622", dress: "#7048e8", hijab: "#d0bfff", lashes: true } as const; // the chat girl (lavender hijab)
const BRIDE = { skin: "#e8b48a", shirt: "#c2255c", pants: "#c2255c", hair: "#2a1622", dress: "#c2255c", hijab: "#fcc2d7", lashes: true, lipstick: "#d6336c" } as const;

// ---------------- scenes ----------------
const NightRoomScene: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = frame >= F.phone ? 0.7 + 0.3 * Math.sin(frame / 3) : 0.4;
  return (
    <Camera from={0} to={F.s2} zoom={[1.0, 1.08]} pan={[0, -20]}>
      <Room phoneGlow={glow} dustyShelf />
      <Character
        {...ARHAM}
        x={420}
        y={1740}
        scale={0.92}
        poses={[
          { f: 0, v: "hold" },
          { f: F.chamka, v: "hold" },
        ]}
        holding={[{ f: 0, v: "phone" }]}
        exprs={[
          { f: 0, v: "sly" },
          { f: F.chamka, v: "wow" },
        ]}
        look={[
          { f: 0, v: 1 },
          { f: F.chupke, v: -1 },
          { f: F.chamka, v: 1 },
        ]}
      />
    </Camera>
  );
};

/** Readable sweet (innocent) messages popping in on the phone, then her side: she is smiling at her phone too. */
const PhoneScene: React.FC = () => {
  const frame = useCurrentFrame();
  const herSide = frame >= F.ghar;
  const step = Math.max(6, Math.floor((F.ghar - F.s2 - 4) / 5));
  const msgs = [
    { f: F.s2 + 2, text: "Khana khaya? 🙂" },
    { f: F.s2 + 2 + step, text: "Haan, tumne?", me: true },
    { f: F.s2 + 2 + step * 2, text: "Tumse baat karke achha lagta hai ☺️" },
    { f: F.s2 + 2 + step * 3, text: "Mujhe bhi ❤️", me: true },
    { f: F.s2 + 2 + step * 4, text: "Good night 🌙" },
  ];
  return (
    <Camera from={herSide ? F.ghar : F.s2} to={herSide ? F.s3 : F.ghar} zoom={[1.0, 1.06]}>
      <Room phoneGlow={0.8} wallColor={herSide ? "#4a2a52" : undefined} />
      {herSide ? (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
            {/* floating hearts from her phone */}
            {[0, 1, 2, 3].map((i) => {
              const t = ((frame - F.ghar + i * 9) % 36) / 36;
              return (
                <path
                  key={i}
                  d="M0 14 C-34 -8 -22 -36 0 -20 C22 -36 34 -8 0 14Z"
                  fill="#ff8fab"
                  stroke="#1b1430"
                  strokeWidth={4}
                  opacity={1 - t}
                  transform={`translate(${700 + Math.sin(t * 6 + i) * 60} ${1200 - t * 420}) scale(${1.6 + t * 1.2})`}
                />
              );
            })}
          </svg>
          <Character
            {...GIRL}
            x={540}
            y={1760}
            scale={0.92}
            poses={[{ f: F.ghar, v: "hold" }]}
            holding={[{ f: 0, v: "phone" }]}
            exprs={[
              { f: F.ghar, v: "grin" },
              { f: F.kisi, v: "sly" },
            ]}
            look={[{ f: 0, v: 1 }]}
            hops={[F.ghar + 2]}
            seed={8}
          />
        </>
      ) : (
        <Phone x={190} y={520} w={700} h={1000} buzzAt={F.s2}>
          <ChatScreen msgs={msgs} title="2:00 AM · ONLINE" dark />
        </Phone>
      )}
    </Camera>
  );
};

const ThinkScene: React.FC = () => (
  <Camera from={F.s3} to={F.s4} zoom={[1.02, 1.1]}>
    <Room phoneGlow={0.6} />
    <Character
      {...ARHAM}
      x={460}
      y={1740}
      scale={0.95}
      poses={[
        { f: F.s3, v: "think" },
        { f: F.bas, v: "shrug" },
      ]}
      holding={[{ f: 0, v: "phone" }]}
      exprs={[
        { f: F.s3, v: "think" },
        { f: F.bas, v: "sly" },
      ]}
      look={[{ f: 0, v: 1 }]}
    />
  </Camera>
);

/** Restless, guilty: he paces the dark room under a rain cloud, tears and sweat, phone dimming; then turns away from the azan. */
const HeavyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const indoors = frame < F.namaz;
  // pacing back and forth (indoors), facing the way he walks
  const ph = (frame - F.s4) / 16;
  const px = indoors ? 420 + Math.sin(ph) * 150 : 300;
  const facingLeft = indoors && Math.cos(ph) < 0;
  const bob = indoors ? Math.abs(Math.sin(ph * 2.2)) * -8 : 0;
  const headY = 1760 - 0.9 * 700; // head centre at this scale
  const flash = indoors && (frame - F.s4) % 37 < 2;
  return (
    <Camera from={F.s4} to={F.s5} zoom={[1.0, 1.06]} shakeAt={[F.bhaari + 10]}>
      {indoors ? <Room phoneGlow={0.25} lanternOn={false} /> : <CityScene mood="night" />}
      {indoors && <HeavyHeart at={F.bhaari} x={840} floor={1600} />}
      {!indoors && (
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
          {/* azan sound waves from the minaret, unanswered */}
          {[0, 1, 2].map((i) => {
            const r = 40 + (((frame - F.namaz) * 4 + i * 60) % 180);
            return <circle key={i} cx={760} cy={900} r={r} fill="none" stroke="#ffd77a" strokeWidth={5} opacity={1 - r / 220} />;
          })}
        </svg>
      )}
      <Character
        {...ARHAM}
        x={px}
        y={1760 + bob}
        scale={0.9}
        flip={facingLeft}
        poses={
          indoors
            ? [
                { f: F.s4, v: "hold" },
                { f: F.dil, v: "scratch" },
                { f: F.bhaari, v: "panic" },
                { f: F.bhaari + 24, v: "shrug" },
              ]
            : [{ f: F.namaz, v: "idle" }]
        }
        holding={indoors ? [{ f: 0, v: "phone" }, { f: F.dil, v: "none" }] : [{ f: 0, v: "none" }]}
        exprs={[
          { f: F.s4, v: "worried" },
          { f: F.dil, v: "sad" },
          { f: F.bhaari, v: "cry" },
          { f: F.namaz, v: "cry" },
        ]}
        sweat={[{ f: F.s4, v: true }]}
        look={[{ f: 0, v: indoors ? 0 : -1 }]}
      />
      {/* dark rain cloud following his head, with lightning flicker; thought bubble */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1080} height={1920}>
        <g transform={`translate(${px} ${headY - 310 + bob})`}>
          {Array.from({ length: 8 }).map((_, i) => {
            const t = ((frame + i * 5) % 20) / 20;
            return <path key={i} d={`M${-110 + i * 30} ${40 + t * 120} l-6 18`} stroke="#74c0fc" strokeWidth={5} strokeLinecap="round" opacity={0.8 * (1 - t)} />;
          })}
          {flash && <path d="M10 30 L-14 80 L10 80 L-10 130" fill="none" stroke="#ffe066" strokeWidth={8} strokeLinejoin="round" />}
          <ellipse cx={0} cy={0} rx={150} ry={56} fill={flash ? "#6c6f8a" : "#3d4058"} stroke="#1b1430" strokeWidth={7} />
          <ellipse cx={-60} cy={-34} rx={70} ry={52} fill={flash ? "#6c6f8a" : "#3d4058"} stroke="#1b1430" strokeWidth={7} />
          <ellipse cx={50} cy={-44} rx={80} ry={60} fill={flash ? "#6c6f8a" : "#3d4058"} stroke="#1b1430" strokeWidth={7} />
          <ellipse cx={0} cy={6} rx={140} ry={44} fill={flash ? "#6c6f8a" : "#3d4058"} />
        </g>
      </svg>
      {indoors && frame >= F.dil && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1080} height={1920}>
          <g transform={`translate(${Math.min(820, px + 260)} ${headY - 120})`} opacity={Math.min(1, (frame - F.dil) / 6)}>
            <circle cx={-120} cy={70} r={12} fill="#f8f9fa" stroke="#1b1430" strokeWidth={4} />
            <circle cx={-90} cy={40} r={18} fill="#f8f9fa" stroke="#1b1430" strokeWidth={4} />
            <rect x={-110} y={-70} width={230} height={90} rx={40} fill="#f8f9fa" stroke="#1b1430" strokeWidth={5} />
            <text x={5} y={-14} fontSize={30} textAnchor="middle" fill="#1b1430" fontFamily="Poppins" fontWeight={800}>
              YEH THEEK
            </text>
            <text x={5} y={16} fontSize={30} textAnchor="middle" fill="#1b1430" fontFamily="Poppins" fontWeight={800}>
              NAHI...
            </text>
          </g>
        </svg>
      )}
    </Camera>
  );
};

const QuranScene: React.FC = () => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [F.quran, F.padha], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Camera from={F.s5} to={F.s6} zoom={[1.0, 1.1]} shakeAt={[F.zina]}>
      <Room lanternOn />
      {frame >= F.padha && (
        <AbsoluteFill style={{ opacity: 0.35, mixBlendMode: "screen" }}>
          <Rays c1="#000" c2="#c9a227" />
        </AbsoluteFill>
      )}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
        {/* the Quran opens on a rehal (book stand), glowing */}
        <g transform="translate(540 1500)">
          <path d="M-200 60 L0 -20 L200 60 L0 140 Z" fill="#8a5530" stroke="#2a1a08" strokeWidth={8} />
          <path d={`M0 0 L${-180 * open - 20} ${-40 + 20 * open} L${-180 * open - 20} ${-200 + 40 * open} L0 -170 Z`} fill="#fff8e6" stroke="#2a1a08" strokeWidth={6} />
          <path d="M0 0 L200 -20 L200 -180 L0 -170 Z" fill="#2b8a3e" stroke="#2a1a08" strokeWidth={6} />
          {open > 0.6 && <path d="M0 0 L190 -20 L190 -180 L0 -170 Z" fill="#fff8e6" stroke="#2a1a08" strokeWidth={6} />}
          {open > 0.6 && <circle cx={0} cy={-90} r={260} fill="#ffd77a" opacity={0.25} />}
        </g>
      </svg>
      <Character
        {...ARHAM}
        x={250}
        y={1760}
        scale={0.85}
        poses={[
          { f: F.s5, v: "present" },
          { f: F.zina, v: "panic" },
        ]}
        exprs={[
          { f: F.s5, v: "think" },
          { f: F.zina, v: "shock" },
        ]}
        look={[{ f: 0, v: 1 }]}
      />
    </Camera>
  );
};

const PathScene: React.FC = () => (
  <Camera from={F.s6} to={F.s7} zoom={[1.0, 1.06]}>
    <CityScene mood="night" horizon={1100} />
    <StepsPath at={F.chhoti} />
    <Character
      {...ARHAM}
      x={190}
      y={1760}
      scale={0.8}
      poses={[
        { f: F.s6, v: "point" },
        { f: F.shuru, v: "panic" },
      ]}
      exprs={[
        { f: F.s6, v: "worried" },
        { f: F.shuru, v: "shock" },
      ]}
      sweat={[{ f: F.shuru, v: true }]}
      look={[{ f: 0, v: 1 }]}
    />
  </Camera>
);

const SajdaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const stage = frame < F.wuzu ? "phone" : frame < F.sajde ? "wuzu" : "sajda";
  return (
    <Camera from={F.s7} to={F.s8} zoom={stage === "sajda" ? [1.06, 1.12] : [1.0, 1.04]}>
      <Room lanternOn morning={false} />
      {stage === "phone" && (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
            <rect x={600} y={1400} width={340} height={30} rx={8} fill="#8a5530" stroke="#1b1430" strokeWidth={6} />
            {frame >= F.rakha && <rect x={720} y={1380} width={90} height={22} rx={6} fill="#212529" stroke="#1b1430" strokeWidth={5} />}
          </svg>
          <Character
            {...ARHAM}
            x={420}
            y={1760}
            scale={0.9}
            poses={[
              { f: F.s7, v: "hold" },
              { f: F.rakha, v: "present" },
            ]}
            holding={[
              { f: 0, v: "phone" },
              { f: F.rakha, v: "none" },
            ]}
            exprs={[{ f: F.s7, v: "sad" }]}
            look={[{ f: 0, v: 1 }]}
          />
        </>
      )}
      {stage === "wuzu" && (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
            {/* tap + water drops */}
            <path d="M700 1100 L700 1180 L760 1180" fill="none" stroke="#adb5bd" strokeWidth={22} strokeLinecap="round" />
            {Array.from({ length: 10 }).map((_, i) => {
              const t = ((frame + i * 3) % 18) / 18;
              return <ellipse key={i} cx={760 + Math.sin(i) * 8} cy={1200 + t * 300} rx={7} ry={11} fill="#74c0fc" opacity={1 - t * 0.5} />;
            })}
          </svg>
          <Character {...ARHAM_KUFI} x={460} y={1760} scale={0.9} poses={[{ f: F.wuzu, v: "present" }]} exprs={[{ f: F.wuzu, v: "sad" }]} look={[{ f: 0, v: 1 }]} />
        </>
      )}
      {stage === "sajda" && <SajdaFigure x={430} y={1560} at={F.sajde} s={1.6} />}
    </Camera>
  );
};

const AmmiScene: React.FC = () => (
  <Camera from={F.s8} to={F.s9} zoom={[1.0, 1.06]}>
    <Room morning />
    <Character
      {...AMMI}
      x={800}
      y={1760}
      scale={0.88}
      flip
      poses={[
        { f: F.s8, v: "idle" },
        { f: F.nikah, v: "idle" },
      ]}
      exprs={[
        { f: F.s8, v: "smile" },
        { f: F.ammi, v: "think" },
        { f: F.nikah, v: "cry" },
      ]}
      look={[{ f: 0, v: 1 }]}
      seed={6}
    />
    <Character
      {...ARHAM_KUFI}
      x={300}
      y={1760}
      scale={0.88}
      poses={[
        { f: F.s8, v: "idle" },
        { f: F.ammi, v: "cheer" },
      ]}
      exprs={[
        { f: F.s8, v: "smile" },
        { f: F.nikah, v: "grin" },
      ]}
      look={[{ f: 0, v: 1 }]}
    />
  </Camera>
);

const NikahScene: React.FC = () => (
  <Camera from={F.s9} to={F.s10} zoom={[1.0, 1.06]}>
    <CityScene mood="golden" horizon={1500} />
    <NikahArch />
    <Character
      {...BRIDE}
      x={760}
      y={1760}
      scale={0.82}
      flip
      poses={[
        { f: F.s9, v: "idle" },
        { f: F.behtar, v: "idle" },
      ]}
      exprs={[
        { f: F.s9, v: "smile" },
        { f: F.behtar, v: "grin" },
      ]}
      look={[{ f: 0, v: 1 }]}
      seed={9}
    />
    <Character
      {...ARHAM_KUFI}
      x={320}
      y={1760}
      scale={0.84}
      poses={[
        { f: F.s9, v: "idle" },
        { f: F.behtar, v: "idle" },
      ]}
      exprs={[
        { f: F.s9, v: "smile" },
        { f: F.behtar, v: "grin" },
      ]}
      look={[{ f: 0, v: 1 }]}
    />
    <Sparkles at={F.behtar} x={540} y={820} r={200} />
  </Camera>
);

const OutroScene: React.FC = () => (
  <Camera from={F.s10} to={END} zoom={[1.0, 1.05]}>
    <CityScene mood="night" horizon={1550} />
  </Camera>
);

// ---------------- sound ----------------
type S = { f: number; s: string; v: number };
const SFX: S[] = [
  { f: 0, s: "whoosh", v: 0.12 },
  { f: F.phone, s: "buzzer", v: 0.05 },
  { f: F.chamka, s: "click", v: 0.15 },
  { f: F.s2, s: "whoosh", v: 0.12 },
  { f: F.chhupi, s: "pop", v: 0.12 },
  { f: F.ghar, s: "tick", v: 0.12 },
  { f: F.s3, s: "whoosh", v: 0.12 },
  { f: F.gunaah, s: "pop", v: 0.12 },
  { f: F.s4, s: "whoosh", v: 0.12 },
  { f: F.bhaari + 10, s: "thud", v: 0.2 },
  { f: F.namaz, s: "whoosh", v: 0.1 },
  { f: F.s5, s: "whoosh", v: 0.12 },
  { f: F.padha, s: "sparkle", v: 0.12 },
  { f: F.zina, s: "slam", v: 0.15 },
  { f: F.s6, s: "whoosh", v: 0.12 },
  { f: F.chhoti, s: "tick", v: 0.12 },
  { f: F.shuru, s: "pop", v: 0.12 },
  { f: F.s7, s: "whoosh", v: 0.12 },
  { f: F.rakha, s: "click", v: 0.15 },
  { f: F.wuzu, s: "splash", v: 0.12 },
  { f: F.sajde, s: "whoosh", v: 0.08 },
  { f: F.s8, s: "whoosh", v: 0.12 },
  { f: F.nikah, s: "ding", v: 0.12 },
  { f: F.s9, s: "whoosh", v: 0.12 },
  { f: F.behtar, s: "sparkle", v: 0.15 },
  { f: F.s10, s: "whoosh", v: 0.12 },
  { f: F.share, s: "pop", v: 0.15 },
  { f: F.follow, s: "pop", v: 0.15 },
  { f: F.handle, s: "click", v: 0.25 },
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

// ---------------- composition ----------------
export const SajdaRaat: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {inRange(frame, 0, F.s2) && <NightRoomScene />}
      {inRange(frame, F.s2, F.s3) && <PhoneScene />}
      {inRange(frame, F.s3, F.s4) && <ThinkScene />}
      {inRange(frame, F.s4, F.s5) && <HeavyScene />}
      {inRange(frame, F.s5, F.s6) && <QuranScene />}
      {inRange(frame, F.s6, F.s7) && <PathScene />}
      {inRange(frame, F.s7, F.s8) && <SajdaScene />}
      {inRange(frame, F.s8, F.s9) && <AmmiScene />}
      {inRange(frame, F.s9, F.s10) && <NikahScene />}
      {frame >= F.s10 && <OutroScene />}

      <SoftLight x="25%" y="15%" color="rgba(255,215,140,0.18)" />
      <Vignette />

      {/* TEXT (Roman chips) */}
      <Chip text="EK RAAT KA FAISLA" at={0} until={F.s2} y={250} size={86} slam from={1.08} />
      <Chip text="RAAT 2 BAJE" at={F.raat + 10} until={F.s2} y={390} size={72} color="#fff" />
      <Chip text="CHHUPI BAATEIN" at={F.chhupi} until={F.ghar} y={250} size={84} />
      <Chip text="KISI KO PATA NAHI" at={F.ghar} until={F.s3} y={330} size={80} color="#fff" />
      <Chip text="KYA GUNAAH?" at={F.gunaah} until={F.s4} y={330} size={100} color="#fff" />
      <Chip text="DIL BHAARI" at={F.bhaari} until={F.namaz} y={330} size={96} color="#ff8787" />
      <Chip text="NAMAZ CHHOOTI" at={F.namaz} until={F.s5} y={330} size={90} color="#fff" />
      <Chip text="ZINA KE KAREEB BHI NAHI" at={F.zina} until={F.s6} y={640} size={60} color="#ffd77a" />
      <Chip text="SURAH AL-ISRA 17:32" at={F.zina + 6} until={F.s6} y={730} size={40} color="#fff" />
      <Chip text="RAASTA YAHIN SE SHURU" at={F.chhoti} until={F.s7} y={330} size={60} />
      <Chip text="SAJDA" at={F.sajde} until={F.s8} y={330} size={120} color="#ffd77a" />
      <Chip text="HALAL RAASTA: NIKAH" at={F.nikah} until={F.s9} y={330} size={76} color="#fff" bg="#2b8a3e" />
      <Chip text="ALLAH BEHTAR DETA HAI" at={F.behtar} until={F.s10} y={470} size={70} color="#ffd77a" />
      <Chip text="SHARE = SADQA-E-JARIYA" at={F.share} y={560} size={68} color="#fff" bg="#2b8a3e" />

      {/* ARABIC calligraphy */}
      <Arabic text="بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ" at={F.s5} until={F.zina} y={300} size={72} />
      <Arabic text="وَلَا تَقْرَبُوا۟ ٱلزِّنَىٰٓ" at={F.zina} until={F.s6} y={330} size={110} />
      <Arabic text="سُبْحَانَ رَبِّيَ ٱلْأَعْلَىٰ" at={F.sajde + 10} until={F.s8} y={500} size={84} />
      <Arabic text="بَارَكَ ٱللَّٰهُ" at={F.s9} until={F.s10} y={260} size={110} />
      <Arabic text="صَدَقَة جَارِيَة" at={F.s10} y={280} size={120} />
      <FollowButton at={F.follow} tapAt={F.handle} />

      <Grain />

      <Audio src={staticFile("voice/sajdaraat.wav")} volume={1} />
      <Audio src={staticFile("music/hum_loop.wav")} loop volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
