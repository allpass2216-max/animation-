// JaaduRubber: playful "what if" fantasy (no puzzle, no options). Chintu's ₹1 eraser: blue side = big, red side = small.
// Every cue frame comes from ./words.json (measured word times). Never hard-code times here.
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Character, Extra } from "../../lib/Character";
import { Camera, Chip, Dust, Grain, H, INK, makeCue, SoftLight, Vignette, W, WordsFile } from "../../lib/reel";
import { FollowButton } from "../../lib/ui";
import { Auto, Building, FarCity, Foreground, Ground, Layer, Rays, Sky, Stall } from "../../lib/world";
import { ChaiGlass, Confetti, Dustbin, Eraser, Garbage, House, MagicBurst, Mango, SchoolBag, useMorph } from "./props";
import wordsData from "./words.json";

const data = wordsData as unknown as WordsFile;
const cue = makeCue(data);
export const JAADURUBBER_DURATION = data.words[data.words.length - 1].endFrame + 60;

const F = {
  rubber: cue(3, "rubber"),
  chintu: cue(5, "Chintu"),
  badal: cue(8, "badal"),
  s2: cue(10, "Neela"),
  ghisao1: cue(12, "ghisao"),
  badi: cue(14, "badi"),
  laal: cue(15, "laal"),
  chhoti: cue(19, "chhoti"),
  s3: cue(20, "Pehle"),
  ghisi: cue(23, "ghisi"),
  balti: cue(27, "balti"),
  s4: cue(30, "Das"),
  maachis: cue(36, "maachis"),
  s5: cue(40, "Auto"),
  jagah: cue(42, "jagah"),
  chhota1: cue(48, "chhota"),
  baith: cue(53, "baith"),
  s6: cue(55, "Ek"),
  bada1: cue(57, "bada"),
  mohalle: cue(61, "mohalle"),
  khaya: cue(65, "khaya"),
  s7: cue(66, "Kooda"),
  chhota2: cue(69, "chhota"),
  dustbin: cue(71, "dustbin"),
  daal: cue(73, "daal"),
  s8: cue(75, "Aur"),
  maa: cue(76, "maa"),
  khilona: cue(80, "khilona"),
  asli: cue(85, "asli"),
  bana: cue(87, "bana"),
  s9: cue(89, "Agar"),
  bada2: cue(97, "bada"),
  chhota3: cue(101, "chhota"),
  comment: cue(102, "Comment"),
  follow: cue(106, "follow"),
  handle: cue(108, "@rehanfact"),
};
const END = JAADURUBBER_DURATION;
const inRange = (f: number, a: number, b: number) => f >= a && f < b;

const CHINTU = { skin: "#B97A50", shirt: "#f8f9fa", pants: "#1c3d7a", hair: "#1d1420", tie: "#c92a2a" } as const; // school uniform
const MAA = { mom: true, skin: "#C98B5E", shirt: "#e64980", pants: "#a61e4d", hair: "#2a1e22" } as const;

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
    {children}
  </svg>
);

/** Lucknow lane: far city, two building rows, ground. */
const Lane: React.FC<{ from: number; seed: string }> = ({ from, seed }) => (
  <>
    <Sky top="#7fc8ff" bottom="#ffe3b3" />
    <Layer depth={0.2} from={from}>
      <FarCity seed={seed} color="#9c8fb3" />
    </Layer>
    <Layer depth={0.45} from={from}>
      <Building x={-160} w={380} h={720} color="#f4a259" awning="#2a9d8f" />
      <Building x={860} w={380} h={680} color="#e9c46a" awning="#e63946" />
      <Ground road={false} />
    </Layer>
  </>
);

// ---------------- scenes ----------------
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lift = interpolate(frame, [0, F.rubber], [0, -60], { extrapolateRight: "clamp" });
  return (
    <>
      <Camera from={0} to={F.s2} zoom={[1.0, 1.1]} pan={[0, -30]}>
        <Lane from={0} seed="hook" />
        <Svg>
          {/* raddiwala cart */}
          <g transform="translate(800 1580)">
            <rect x={-170} y={-150} width={340} height={110} rx={10} fill="#a0663f" stroke={INK} strokeWidth={8} />
            {[-110, -30, 50, 120].map((px, i) => (
              <rect key={px} x={px - 30} y={-200 - (i % 2) * 20} width={60} height={60} fill={["#dee2e6", "#ffe066", "#a5d8ff", "#ffc9de"][i]} stroke={INK} strokeWidth={5} />
            ))}
            {[-120, 120].map((wx) => (
              <circle key={wx} cx={wx} cy={-20} r={42} fill="#495057" stroke={INK} strokeWidth={8} />
            ))}
          </g>
        </Svg>
        <Extra x={1000} y={1660} s={1.0} shirt="#868e96" seed={12} />
        <Character
          {...CHINTU}
          x={330}
          y={1740}
          scale={0.95}
          poses={[
            { f: 0, v: "present" },
            { f: F.chintu, v: "cheer" },
          ]}
          exprs={[
            { f: 0, v: "wow" },
            { f: F.chintu, v: "grin" },
          ]}
          hops={[F.badal]}
          look={[{ f: 0, v: 1 }]}
        />
        <Svg>
          <Eraser x={640} y={1300 + lift} s={0.9} glow="both" />
          <MagicBurst at={F.badal} x={640} y={1240} />
        </Svg>
      </Camera>
      <Foreground side="left" kind="plant" />
    </>
  );
};

const RulesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pencil = frame < F.laal ? morphAt(frame, F.badi, 1, 2.6) : morphAt(frame, F.chhoti, 2.6, 0.35);
  return (
    <Camera from={F.s2} to={F.s3} zoom={[1.0, 1.06]}>
      <Rays c1={frame < F.laal ? "#1864ab" : "#a61e1e"} c2={frame < F.laal ? "#339af0" : "#ff6b6b"} />
      <Svg>
        <Eraser x={540} y={860} s={2.2} rot={-8} glow={frame < F.laal ? "blue" : "red"} />
        {/* the test pencil grows then shrinks */}
        <g transform={`translate(540 1450) scale(${pencil}) rotate(-30)`}>
          <rect x={-150} y={-22} width={260} height={44} fill="#ffd43b" stroke={INK} strokeWidth={6} />
          <path d="M110 -22 L170 0 L110 22 Z" fill="#f3d9a4" stroke={INK} strokeWidth={6} />
          <rect x={-180} y={-22} width={30} height={44} fill="#ff8787" stroke={INK} strokeWidth={6} />
        </g>
        <MagicBurst at={F.badi} x={540} y={1450} />
        <MagicBurst at={F.chhoti} x={540} y={1450} grow={false} />
      </Svg>
    </Camera>
  );
};
// helper: same as useMorph but safe to call conditionally (pure function of frame)
const morphAt = (frame: number, at: number, from: number, to: number) => {
  const t = Math.max(0, frame - at);
  const p = 1 - Math.exp(-t / 4) * Math.cos(t / 2.2);
  return from + (to - from) * Math.min(1.12, p);
};

const ChaiScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useMorph(F.balti, 1, 4.2);
  return (
    <>
      <Camera from={F.s3} to={F.s4} zoom={[1.0, 1.08]}>
        <Lane from={F.s3} seed="chai" />
        <Layer depth={0.75} from={F.s3}>
          <Stall x={790} y={1560} sign="CHAI" color="#f76707" item="chai" />
        </Layer>
        <Extra x={1010} y={1600} s={1.05} shirt="#495057" seed={21} hopAt={[F.balti + 4]} />
        <Character
          {...CHINTU}
          x={300}
          y={1740}
          scale={0.9}
          poses={[
            { f: F.s3, v: "hold" },
            { f: F.ghisi, v: "point" },
            { f: F.balti, v: "cheer" },
          ]}
          exprs={[
            { f: F.s3, v: "sly" },
            { f: F.balti, v: "grin" },
          ]}
          look={[{ f: 0, v: 1 }]}
          hops={[F.balti]}
        />
        <Svg>
          <ChaiGlass x={610} y={1720} s={s} />
          {frame >= F.ghisi && frame < F.balti && <Eraser x={560} y={1380} s={0.5} glow="blue" />}
          <MagicBurst at={F.balti} x={610} y={1600} />
        </Svg>
      </Camera>
      <Foreground side="right" kind="pole" />
    </>
  );
};

const BagScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useMorph(F.maachis, 1, 0.12);
  const bent = frame < F.maachis;
  return (
    <Camera from={F.s4} to={F.s5} zoom={[1.0, 1.06]}>
      <Lane from={F.s4} seed="school" />
      <Layer depth={0.5} from={F.s4}>
        <Building x={180} w={720} h={760} color="#ffd43b" sign="SCHOOL" signColor="#1971c2" />
      </Layer>
      <Svg>
        <SchoolBag x={bent ? 560 : 640} y={bent ? 1280 : 1440} s={s} />
        <MagicBurst at={F.maachis} x={600} y={1300} grow={false} />
      </Svg>
      <Character
        {...CHINTU}
        x={440}
        y={1740 + (bent ? 20 : 0)}
        scale={0.92}
        poses={bent ? [{ f: F.s4, v: "panic" }] : [{ f: F.maachis, v: "cheer" }]}
        exprs={bent ? [{ f: F.s4, v: "worried" }] : [{ f: F.maachis, v: "grin" }]}
        sweat={[{ f: F.s4, v: bent }]}
        hops={[F.maachis + 4]}
        look={[{ f: 0, v: 1 }]}
      />
      <Dust at={F.maachis + 20} x={440} y={1740} />
    </Camera>
  );
};

const AutoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useMorph(F.chhota1, 0.9, 0.38);
  const small = frame >= F.chhota1;
  const hopIn = interpolate(frame, [F.baith - 14, F.baith], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Camera from={F.s5} to={F.s6} zoom={[1.04, 1.1]}>
      <Lane from={F.s5} seed="auto" />
      <Svg>
        <g transform="translate(560 1660) scale(2.2)">
          <Auto y={0} speed={0} start={450} />
        </g>
        {/* passengers squeezed in */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${420 + i * 70} ${1330 + (i % 2) * 10})`}>
            <circle r={40} fill={["#C98B5E", "#B97A50", "#d9a47a", "#a8724a"][i]} stroke={INK} strokeWidth={6} />
            <circle cx={-12} cy={-4} r={5} fill={INK} />
            <circle cx={12} cy={-4} r={5} fill={INK} />
          </g>
        ))}
      </Svg>
      <Character
        {...CHINTU}
        x={interpolate(hopIn, [0, 1], [230, 600])}
        y={interpolate(hopIn, [0, 1], [1740, 1440]) - Math.sin(hopIn * Math.PI) * 160}
        scale={s}
        poses={[
          { f: F.s5, v: "shrug" },
          { f: F.chhota1, v: "cheer" },
          { f: F.baith, v: "idle" },
        ]}
        exprs={[
          { f: F.s5, v: "worried" },
          { f: F.chhota1, v: "grin" },
        ]}
        look={[{ f: 0, v: 1 }]}
      />
      <Svg>
        <MagicBurst at={F.chhota1} x={230} y={1400} grow={false} />
      </Svg>
      {!small && <Foreground side="left" kind="pole" />}
    </Camera>
  );
};

const MangoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useMorph(F.bada1, 1, 7.5);
  const land = F.bada1 + 10;
  return (
    <Camera from={F.s6} to={F.s7} zoom={[1.0, 1.08]} shakeAt={[land]}>
      <Lane from={F.s6} seed="mango" />
      <Svg>
        <Mango x={720} y={1720} s={s} />
        <MagicBurst at={F.bada1} x={660} y={1500} />
      </Svg>
      <Dust at={land} x={660} y={1720} count={14} spread={1.6} />
      {frame >= F.mohalle &&
        [0, 1, 2, 3].map((i) => (
          <Svg key={i}>
            <Extra x={i < 2 ? 380 + i * 100 : 1000 - (i - 2) * 100} y={1780} s={0.8} shirt={["#ff8787", "#74c0fc", "#ffd43b", "#b197fc"][i]} seed={40 + i} walk={0} hopAt={[F.mohalle + i * 3, F.khaya + i * 2]} flip={i >= 2} />
          </Svg>
        ))}
      <Character
        {...CHINTU}
        x={210}
        y={1760}
        scale={0.72}
        poses={[
          { f: F.s6, v: "point" },
          { f: F.mohalle, v: "cheer" },
        ]}
        exprs={[
          { f: F.s6, v: "sly" },
          { f: F.bada1, v: "wow" },
          { f: F.mohalle, v: "grin" },
        ]}
        look={[{ f: 0, v: 1 }]}
      />
    </Camera>
  );
};

const GarbageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useMorph(F.chhota2, 1, 0.12);
  // after shrinking, the tiny pile is flicked into the dustbin (arc) by "daal"
  const fly = interpolate(frame, [F.dustbin, F.daal], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gx = interpolate(fly, [0, 1], [560, 860]);
  const gy = interpolate(fly, [0, 1], [1700, 1480]) - Math.sin(fly * Math.PI) * 260;
  const clean = frame >= F.chhota2;
  return (
    <Camera from={F.s7} to={F.s8} zoom={[1.0, 1.06]}>
      <Sky top={clean ? "#7fc8ff" : "#a9b18f"} bottom={clean ? "#ffe3b3" : "#d8d2a8"} />
      <Layer depth={0.45} from={F.s7}>
        <Building x={-160} w={380} h={720} color="#e9c46a" />
        <Building x={860} w={380} h={680} color="#f4a259" />
        <Ground road={false} />
      </Layer>
      <Svg>
        {fly < 1 && <Garbage x={gx} y={gy} s={s} />}
        <Dustbin x={860} y={1700} bumpAt={F.daal} />
        <MagicBurst at={F.chhota2} x={560} y={1550} grow={false} />
      </Svg>
      <Character
        {...CHINTU}
        x={240}
        y={1740}
        scale={0.85}
        poses={[
          { f: F.s7, v: "scratch" },
          { f: F.chhota2, v: "point" },
          { f: F.daal, v: "cheer" },
        ]}
        exprs={[
          { f: F.s7, v: "worried" },
          { f: F.chhota2, v: "sly" },
          { f: F.daal, v: "grin" },
        ]}
        hops={[F.daal + 2]}
        look={[{ f: 0, v: 1 }]}
      />
    </Camera>
  );
};

const HouseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = useMorph(F.asli, 0.16, 1.55);
  const onPlot = frame >= F.asli - 10;
  return (
    <>
      <Camera from={F.s8} to={F.s9} zoom={onPlot ? [1.0, 1.06] : [1.1, 1.0]}>
        <Sky top="#ffd8a8" bottom="#fff3bf" />
        <Layer depth={0.2} from={F.s8}>
          <FarCity seed="house" color="#c9a6d6" />
        </Layer>
        <Layer depth={0.45} from={F.s8}>
          <Ground road={false} color="#9ccf6b" />
        </Layer>
        <Svg>
          {!onPlot && (
            <g>
              <rect x={540} y={1300} width={420} height={40} rx={8} fill="#a0663f" stroke={INK} strokeWidth={8} />
              <House x={750} y={1300} s={0.35} />
            </g>
          )}
          {onPlot && <House x={790} y={1520} s={grow * 0.68} />}
          <MagicBurst at={F.asli} x={820} y={1250} />
          <Confetti at={F.bana} />
        </Svg>
        <Character
          {...MAA}
          x={onPlot ? 470 : 320}
          y={1760}
          scale={0.82}
          poses={[
            { f: F.s8, v: "idle" },
            { f: F.bana, v: "present" },
          ]}
          exprs={[
            { f: F.s8, v: "smile" },
            { f: F.asli, v: "wow" },
            { f: F.bana, v: "cry" },
          ]}
          look={[{ f: 0, v: 1 }]}
          seed={6}
        />
        <Character
          {...CHINTU}
          x={onPlot ? 230 : 560}
          y={1780}
          scale={0.7}
          poses={[
            { f: F.s8, v: "present" },
            { f: F.khilona, v: "hold" },
            { f: F.asli, v: "point" },
            { f: F.bana, v: "cheer" },
          ]}
          exprs={[{ f: F.s8, v: "grin" }]}
          hops={[F.bana]}
          look={[{ f: 0, v: 1 }]}
        />
      </Camera>
      <Foreground side="right" kind="plant" />
    </>
  );
};

const OutroScene: React.FC = () => (
  <Camera from={F.s9} to={END} zoom={[1.0, 1.08]}>
    <Rays c1="#5f3dc4" c2="#7950f2" />
    <Svg>
      <Eraser x={540} y={760} s={1.8} glow="both" />
      <MagicBurst at={F.bada2} x={400} y={760} />
      <MagicBurst at={F.chhota3} x={680} y={760} grow={false} />
    </Svg>
    <Character
      {...CHINTU}
      x={540}
      y={1760}
      scale={0.95}
      poses={[
        { f: F.s9, v: "think" },
        { f: F.bada2, v: "cheer" },
        { f: F.chhota3, v: "shrug" },
        { f: F.follow, v: "wave" },
      ]}
      exprs={[
        { f: F.s9, v: "think" },
        { f: F.bada2, v: "grin" },
        { f: F.chhota3, v: "sly" },
        { f: F.follow, v: "grin" },
      ]}
      look={[{ f: 0, v: 0 }]}
    />
  </Camera>
);

// ---------------- sound ----------------
type S = { f: number; s: string; v: number };
const SFX: S[] = [
  { f: 0, s: "whoosh", v: 0.2 },
  { f: 0, s: "sparkle", v: 0.18 },
  { f: F.rubber, s: "pop", v: 0.2 },
  { f: F.badal, s: "sparkle", v: 0.2 },
  { f: F.s2, s: "whoosh", v: 0.2 },
  { f: F.s2, s: "pop", v: 0.2 },
  { f: F.badi, s: "whoosh", v: 0.18 },
  { f: F.badi, s: "pop", v: 0.2 },
  { f: F.chhoti, s: "tick", v: 0.22 },
  { f: F.chhoti, s: "pop", v: 0.2 },
  { f: F.s3, s: "whoosh", v: 0.2 },
  { f: F.ghisi, s: "click", v: 0.2 },
  { f: F.balti, s: "whoosh", v: 0.18 },
  { f: F.balti, s: "splash", v: 0.15 },
  { f: F.balti, s: "pop", v: 0.2 },
  { f: F.s4, s: "whoosh", v: 0.2 },
  { f: F.s4, s: "thud", v: 0.15 },
  { f: F.maachis, s: "tick", v: 0.22 },
  { f: F.maachis, s: "pop", v: 0.2 },
  { f: F.s5, s: "whoosh", v: 0.2 },
  { f: F.jagah, s: "buzzer", v: 0.07 },
  { f: F.chhota1, s: "tick", v: 0.22 },
  { f: F.baith, s: "pop", v: 0.2 },
  { f: F.s6, s: "whoosh", v: 0.2 },
  { f: F.bada1, s: "whoosh", v: 0.18 },
  { f: F.bada1 + 10, s: "thud", v: 0.25 },
  { f: F.mohalle, s: "pop", v: 0.2 },
  { f: F.khaya, s: "sparkle", v: 0.12 },
  { f: F.s7, s: "whoosh", v: 0.2 },
  { f: F.chhota2, s: "tick", v: 0.22 },
  { f: F.chhota2, s: "pop", v: 0.2 },
  { f: F.daal, s: "slam", v: 0.22 },
  { f: F.s8, s: "whoosh", v: 0.2 },
  { f: F.khilona, s: "pop", v: 0.2 },
  { f: F.asli, s: "whoosh", v: 0.2 },
  { f: F.asli, s: "sparkle", v: 0.18 },
  { f: F.bana, s: "ding", v: 0.15 },
  { f: F.s9, s: "whoosh", v: 0.2 },
  { f: F.bada2, s: "pop", v: 0.2 },
  { f: F.chhota3, s: "pop", v: 0.2 },
  { f: F.comment, s: "pop", v: 0.2 },
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

// ---------------- composition ----------------
export const JaaduRubber: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {inRange(frame, 0, F.s2) && <HookScene />}
      {inRange(frame, F.s2, F.s3) && <RulesScene />}
      {inRange(frame, F.s3, F.s4) && <ChaiScene />}
      {inRange(frame, F.s4, F.s5) && <BagScene />}
      {inRange(frame, F.s5, F.s6) && <AutoScene />}
      {inRange(frame, F.s6, F.s7) && <MangoScene />}
      {inRange(frame, F.s7, F.s8) && <GarbageScene />}
      {inRange(frame, F.s8, F.s9) && <HouseScene />}
      {frame >= F.s9 && <OutroScene />}

      <SoftLight />
      <Vignette />

      <Chip text="₹1 KA JAADU" at={0} until={F.s2} y={250} size={110} slam from={1.1} />
      <Chip text="NEELA = BADA" at={F.s2} until={F.laal} y={330} size={96} color="#fff" bg="#1971c2" />
      <Chip text="LAAL = CHHOTA" at={F.laal} until={F.s3} y={330} size={96} color="#fff" bg="#c92a2a" />
      <Chip text="BALTI BHAR CHAI" at={F.balti} until={F.s4} y={330} size={88} />
      <Chip text="10 KG → MAACHIS" at={F.maachis} until={F.s5} y={330} size={88} />
      <Chip text="NO JAGAH? NO PROBLEM" at={F.chhota1} until={F.s6} y={330} size={70} />
      <Chip text="1 AAM, POORA MOHALLA" at={F.mohalle} until={F.s7} y={330} size={72} />
      <Chip text="SAAF MOHALLA" at={F.daal} until={F.s8} y={330} size={96} color="#fff" bg="#2b8a3e" />
      <Chip text="MAA KA GHAR" at={F.bana} until={F.s9} y={330} size={104} />
      <Chip text="TUM KYA BADA KARTE?" at={F.bada2} until={F.comment} y={330} size={76} color="#fff" bg="#1971c2" />
      <Chip text="KYA CHHOTA?" at={F.chhota3} until={F.comment} y={470} size={96} color="#fff" bg="#c92a2a" />
      <Chip text="COMMENT KARO" at={F.comment} y={330} size={92} />
      <FollowButton at={F.follow} tapAt={F.handle} />

      <Grain />

      <Audio src={staticFile("voice/jaadurubber.wav")} volume={1} />
      <Audio src={staticFile("music/loop.wav")} loop volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
