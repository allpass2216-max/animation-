// ShopSpot (Part 1): "50,000 rupees, 4 spots, 1 winner" — where should Arjun open his xerox shop?
// Every cue frame comes from ./words.json (measured word times). Never hard-code times here.
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Character, Cue, Expr, Extra, PoseName } from "../../lib/Character";
import { FONT_FAMILY } from "../../lib/fonts";
import { Camera, Chip, dropBounce, Dust, Grain, H, INK, makeCue, popSpring, SoftLight, Sparkles, Vignette, W, WordsFile } from "../../lib/reel";
import wordsData from "./words.json";
import { Auto, Building, FarCity, Flash, FlyingPapers, Foreground, Ground, Layer, Rays, Signpost, SignText, Sky, Stall, XeroxMachine } from "./world";

const data = wordsData as unknown as WordsFile;
const cue = makeCue(data);
const lastWordEnd = data.words[data.words.length - 1].endFrame;
export const SHOPSPOT_DURATION = lastWordEnd + 60; // ends 2 s after the voice

// ---- cue frames (word index, expected word) ----
const F = {
  pachaas: cue(4, "pachaas"),
  galat: cue(9, "galat"),
  doob: cue(12, "doob"),
  s2: cue(14, "Woh"),
  xerox: cue(15, "xerox"),
  photo: cue(17, "photo"),
  kholna: cue(20, "kholna"),
  s3: cue(23, "Smart"),
  jahan3: cue(29, "jahan"),
  zarurat: cue(30, "zarurat"),
  s4a: cue(35, "Hospital"),
  dawai: cue(38, "dawai"),
  s4b: cue(39, "station"),
  chai: cue(42, "chai"),
  s4c: cue(43, "school"),
  pen: cue(46, "pen"),
  s5: cue(47, "Toh"),
  kahan: cue(51, "kahan"),
  A: cue(53, "A"),
  jahanA: cue(58, "jahan"),
  line: cue(62, "line"),
  B: cue(66, "B"),
  sabse: cue(72, "sabse"),
  bheed: cue(74, "bheed"),
  C: cue(76, "C"),
  kyunkiC: cue(83, "kyunki"),
  customer: cue(84, "customer"),
  aate: cue(86, "aate"),
  D: cue(88, "D"),
  kyunkiD: cue(92, "kyunki"),
  kiraya: cue(94, "kiraya"),
  zero: cue(95, "zero"),
  s7: cue(97, "Comment"),
  answer2: cue(101, "answer"),
  follow: cue(106, "follow"),
  handle: cue(108, "@yourhandle"),
};
const END = SHOPSPOT_DURATION;
const LAND_DOOB = F.doob + 11; // money bundle falls 350 px: sqrt(2*350/5200) s = 11 frames

const inRange = (f: number, a: number, b: number) => f >= a && f < b;

// ---------------- scenes ----------------
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fall = dropBounce(frame, F.doob, 350);
  return (
    <>
      <Camera from={0} to={F.s2} zoom={[1.0, 1.1]} pan={[30, -20]} shakeAt={[0, LAND_DOOB]}>
        <Sky top="#7fc8ff" bottom="#ffe3b3" />
        <Layer depth={0.2} from={0}>
          <FarCity seed="hook" color="#7d8fb3" />
        </Layer>
        <Layer depth={0.5} from={0}>
          <Building x={-150} w={360} h={760} color="#f4a259" sign="KIRANA" awning="#e63946" />
          <Building x={830} w={380} h={700} color="#8ecae6" sign="MOBILE" awning="#2a9d8f" />
          <Ground />
          <Auto y={1470} speed={7} start={200} />
          <Auto y={1500} speed={-5} start={900} color="#9be564" flip />
        </Layer>
        <Layer depth={0.8} from={0}>
          <Signpost x={800} y={1640} wobbleAt={F.galat} />
        </Layer>
        <Character
          x={390}
          y={1660}
          scale={0.95}
          poses={[
            { f: 0, v: "hold" },
            { f: F.galat, v: "point" },
            { f: F.doob, v: "panic" },
          ]}
          exprs={[
            { f: 0, v: "wow" },
            { f: F.pachaas, v: "grin" },
            { f: F.galat, v: "worried" },
            { f: F.doob, v: "shock" },
          ]}
          look={[
            { f: 0, v: 0 },
            { f: F.galat, v: 1 },
            { f: F.doob, v: -0.5 },
          ]}
          money={[
            { f: 0, v: true },
            { f: F.doob, v: false },
          ]}
          hops={[F.pachaas - 4]}
        />
        {/* the money bundle drops with gravity when he panics */}
        {frame >= F.doob && (
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
            <g transform={`translate(330 ${1640 + fall.y}) scale(${1 + fall.squash * 0.25} ${1 - fall.squash * 0.3}) rotate(${Math.min(1, (frame - F.doob) / 10) * 70})`}>
              <rect x={-70} y={-60} width={140} height={84} rx={10} fill="#7ccf7a" stroke={INK} strokeWidth={8} />
              <rect x={-14} y={-60} width={28} height={84} fill="#f6d55c" stroke={INK} strokeWidth={6} />
            </g>
          </svg>
        )}
        <Dust at={LAND_DOOB} x={330} y={1640} />
        <Sparkles at={F.pachaas} x={360} y={1290} />
      </Camera>
      <Foreground side="left" kind="plant" />
    </>
  );
};

const ShopScene: React.FC = () => (
  <>
    <Camera from={F.s2} to={F.s3} zoom={[1.08, 1.0]} pan={[-30, 10]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#ffe8c2,#f6c98f)" }} />
      <Layer depth={0.3} from={F.s2} drift={0.6}>
        {/* back wall shelves */}
        {[700, 900].map((y) => (
          <g key={y}>
            <rect x={-100} y={y} width={1300} height={24} fill="#a8774b" stroke={INK} strokeWidth={8} />
            {Array.from({ length: 9 }).map((_, i) => (
              <rect key={i} x={-60 + i * 140} y={y - 110} width={70 + (i % 3) * 14} height={110} fill={["#4dabf7", "#ff8787", "#ffd43b", "#69db7c"][i % 4]} stroke={INK} strokeWidth={6} />
            ))}
          </g>
        ))}
        <rect x={-200} y={1300} width={W + 400} height={H} fill="#d9a066" />
        <rect x={-200} y={1300} width={W + 400} height={16} fill={INK} opacity={0.25} />
      </Layer>
      <Layer depth={0.7} from={F.s2} drift={0.6}>
        <XeroxMachine x={260} y={1560} s={1.05} printAt={F.xerox} />
        {/* photo camera on tripod */}
        <g transform="translate(860 1100)">
          <path d="M0 40 L-80 460 M0 40 L80 460 M0 40 L0 470" stroke={INK} strokeWidth={14} />
          <rect x={-90} y={-60} width={180} height={110} rx={16} fill="#3b3f4c" stroke={INK} strokeWidth={9} />
          <circle cx={0} cy={-5} r={36} fill="#9bd0ff" stroke={INK} strokeWidth={9} />
          <rect x={40} y={-84} width={40} height={24} rx={5} fill="#ddd" stroke={INK} strokeWidth={6} />
        </g>
      </Layer>
      <FlyingPapers at={F.xerox + 4} x={300} y={1300} floorY={1700} />
      <Character
        x={560}
        y={1700}
        scale={0.95}
        poses={[
          { f: F.s2, v: "present" },
          { f: F.xerox, v: "think" },
          { f: F.photo, v: "point" },
          { f: F.kholna, v: "cheer" },
        ]}
        flip
        exprs={[
          { f: F.s2, v: "smile" },
          { f: F.photo, v: "wow" },
          { f: F.kholna, v: "grin" },
        ]}
        look={[{ f: F.s2, v: 0.6 }]}
        hops={[F.kholna]}
      />
      <Dust at={F.kholna + 16} x={560} y={1700} />
    </Camera>
    <Flash at={F.photo} />
  </>
);

const ThinkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const bulb = popSpring(frame, F.s3);
  const close = frame >= F.jahan3;
  return (
    <Camera from={F.s3} to={F.s4a} zoom={close ? [1.35, 1.42] : [1.0, 1.08]} panY={close ? [180, 200] : [0, 20]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#5b4bb7,#9a6fd8)" }} />
      <Layer depth={0.3} from={F.s3}>
        {Array.from({ length: 18 }).map((_, i) => (
          <circle key={i} cx={(i * 197) % 1400 - 150} cy={(i * 311) % 1200 + 150} r={6 + (i % 4) * 4} fill="#fff" opacity={0.35} />
        ))}
        <rect x={-200} y={1500} width={W + 400} height={H} fill="#3f2f8a" />
      </Layer>
      <Character
        x={540}
        y={1720}
        scale={1.0}
        poses={[{ f: F.s3, v: "think" }]}
        exprs={[
          { f: F.s3, v: "think" },
          { f: F.jahan3, v: "sly" },
          { f: F.zarurat, v: "grin" },
        ]}
        look={[{ f: F.s3, v: 0.8 }]}
      />
      {/* light bulb idea */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
        <g transform={`translate(${540 + 210} ${760}) scale(${bulb}) rotate(${Math.sin(frame / 6) * 6})`}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <path key={i} d="M0 -150 L0 -190" stroke="#ffe066" strokeWidth={12} strokeLinecap="round" transform={`rotate(${i * 45})`} opacity={0.6 + Math.sin(frame / 3 + i) * 0.4} />
          ))}
          <circle r={90} fill="#ffe066" stroke={INK} strokeWidth={10} />
          <rect x={-40} y={80} width={80} height={60} rx={10} fill="#adb5bd" stroke={INK} strokeWidth={9} />
          <path d="M-30 20 Q0 -40 30 20" fill="none" stroke="#e8590c" strokeWidth={9} />
        </g>
      </svg>
      <Sparkles at={F.zarurat} x={750} y={760} r={150} />
    </Camera>
  );
};

const StallScene: React.FC<{
  from: number;
  to: number;
  land: "hospital" | "station" | "school";
  action: number;
}> = ({ from, to, land, action }) => {
  const frame = useCurrentFrame();
  const bump = popSpring(frame, action, 30, 7);
  return (
    <>
      <Camera from={from} to={to} zoom={[1.1, 1.0]} pan={[-20, 20]}>
        <Sky top={land === "station" ? "#ffb385" : "#8fd3ff"} bottom="#fff1d0" />
        <Layer depth={0.2} from={from}>
          <FarCity seed={land} color={land === "school" ? "#88a07d" : "#8a94b8"} />
        </Layer>
        <Layer depth={0.5} from={from}>
          {land === "hospital" && (
            <g>
              <Building x={-120} w={620} h={900} color="#f8f9fa" sign="HOSPITAL" signColor="#e03131" />
              <g transform="translate(190 420)">
                <rect x={-30} y={-90} width={60} height={180} fill="#e03131" stroke={INK} strokeWidth={8} />
                <rect x={-90} y={-30} width={180} height={60} fill="#e03131" stroke={INK} strokeWidth={8} />
              </g>
            </g>
          )}
          {land === "station" && (
            <g>
              <rect x={-200} y={760} width={W + 400} height={440} fill="#c0504d" stroke={INK} strokeWidth={10} />
              {Array.from({ length: 7 }).map((_, i) => (
                <rect key={i} x={-150 + i * 200} y={830} width={140} height={110} rx={12} fill="#ffe8a3" stroke={INK} strokeWidth={8} />
              ))}
              <rect x={-200} y={1000} width={W + 400} height={30} fill="#ffd43b" stroke={INK} strokeWidth={6} />
              <rect x={60} y={560} width={420} height={110} rx={14} fill="#ffd43b" stroke={INK} strokeWidth={9} />
              <SignText x={270} y={640} size={64} text="STATION" fill={INK} stroke="#ffd43b" />
            </g>
          )}
          {land === "school" && (
            <g>
              <Building x={-140} w={660} h={820} color="#ffd43b" sign="SCHOOL" signColor="#1971c2" />
              <circle cx={190} cy={330} r={46} fill="#fff" stroke={INK} strokeWidth={8} />
              <path d="M190 330 L190 300 M190 330 L212 340" stroke={INK} strokeWidth={7} strokeLinecap="round" />
            </g>
          )}
          <Ground road={false} color={land === "station" ? "#b8a58c" : "#cdb89a"} />
        </Layer>
        <Layer depth={0.75} from={from}>
          <g transform={`translate(0 ${-bump * 0 + (1 - Math.min(1, bump)) * 0})`}>
            <Stall
              x={330}
              y={1560}
              sign={land === "hospital" ? "DAWAI" : land === "station" ? "CHAI" : "PEN"}
              color={land === "hospital" ? "#20c997" : land === "station" ? "#f76707" : "#7048e8"}
              item={land === "hospital" ? "pills" : land === "station" ? "chai" : "pens"}
            />
          </g>
          {land === "hospital" && <Extra x={-60} y={1600} s={1.2} shirt="#74c0fc" seed={3} walk={2.5} t0={from} />}
          {land === "station" && <Extra x={-80} y={1610} s={1.2} shirt="#ffa8a8" seed={5} walk={2} t0={from} paper />}
          {land === "school" && <Extra x={-60} y={1620} s={1.0} shirt="#ffe066" seed={7} walk={3} t0={from} bag="#4dabf7" />}
        </Layer>
        <Character
          x={790}
          y={1700}
          scale={0.88}
          flip
          poses={[
            { f: from, v: "present" },
            { f: action, v: "point" },
          ]}
          exprs={[
            { f: from, v: "smile" },
            { f: action, v: "grin" },
          ]}
          look={[{ f: from, v: 0.8 }]}
          hops={land === "school" ? [action] : []}
          seed={land.length}
        />
        <Sparkles at={action} x={330} y={1360} r={130} />
      </Camera>
      <Foreground side="right" kind="pole" />
    </>
  );
};

const RehookScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Camera from={F.s5} to={F.A} zoom={[1.0, 1.12]} shakeAt={[F.kahan]}>
      <Rays c1="#e8590c" c2="#ffa94d" />
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
        {[
          { x: 200, y: 900, d: 0 },
          { x: 860, y: 820, d: 6 },
          { x: 150, y: 1350, d: 12 },
          { x: 900, y: 1300, d: 18 },
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
        x={540}
        y={1700}
        scale={1.0}
        poses={[{ f: F.s5, v: "scratch" }]}
        exprs={[
          { f: F.s5, v: "worried" },
          { f: F.kahan, v: "shock" },
        ]}
        look={[
          { f: F.s5, v: -0.8 },
          { f: F.s5 + 15, v: 0.8 },
          { f: F.kahan, v: 0 },
        ]}
        hops={[F.kahan - 3]}
      />
    </Camera>
  );
};

// ---- option scenes (A-D) ----
const OptionScene: React.FC<{ opt: "A" | "B" | "C" | "D"; from: number; to: number }> = ({ opt, from, to }) => {
  const frame = useCurrentFrame();
  const beat = opt === "A" ? F.jahanA : opt === "B" ? F.sabse : opt === "C" ? F.kyunkiC : F.kyunkiD;
  const punched = frame >= beat;
  const poses: Cue<PoseName>[] =
    opt === "A"
      ? [{ f: from, v: "present" }, { f: F.line, v: "point" }]
      : opt === "B"
        ? [{ f: from, v: "present" }, { f: F.bheed, v: "panic" }]
        : opt === "C"
          ? [{ f: from, v: "present" }, { f: F.kyunkiC, v: "shrug" }]
          : [{ f: from, v: "idle" }, { f: F.zero, v: "cheer" }];
  const exprs: Cue<Expr>[] =
    opt === "A"
      ? [{ f: from, v: "smile" }, { f: F.line, v: "wow" }]
      : opt === "B"
        ? [{ f: from, v: "wow" }, { f: F.bheed, v: "shock" }]
        : opt === "C"
          ? [{ f: from, v: "smile" }, { f: F.customer, v: "worried" }]
          : [{ f: from, v: "smile" }, { f: F.kiraya, v: "wow" }, { f: F.zero, v: "grin" }];
  return (
    <>
      <Camera from={punched ? beat : from} to={punched ? to : beat} zoom={punched ? [1.12, 1.18] : [1.0, 1.04]} pan={punched ? (opt === "C" ? [30, 20] : [-40, -60]) : [0, -10]} panY={punched ? [60, 70] : [0, 0]}>
        <Sky top={opt === "D" ? "#b8c1ec" : "#8fd3ff"} bottom="#fff1d0" />
        <Layer depth={0.2} from={from}>
          <FarCity seed={`opt${opt}`} color="#8a94b8" baseY={1180} />
        </Layer>
        <Layer depth={0.5} from={from}>
          {opt === "A" && (
            <>
              <Building x={-40} w={820} h={640} color="#f1e3c6" sign="RTO OFFICE" signColor="#364fc7" />
              <rect x={-160} y={560} width={900} height={40} fill="#e8d5ad" stroke={INK} strokeWidth={8} />
              <rect x={60} y={1150} width={460} height={40} fill="#e8d5ad" stroke={INK} strokeWidth={7} />
            </>
          )}
          {opt === "B" && (
            <>
              <rect x={-180} y={420} width={1300} height={770} fill="#a5d8ff" stroke={INK} strokeWidth={10} />
              {Array.from({ length: 6 }).map((_, i) => (
                <rect key={i} x={-160 + i * 215} y={440} width={195} height={730} fill="#d0ebff" stroke={INK} strokeWidth={7} opacity={0.9} />
              ))}
              <rect x={150} y={800} width={620} height={110} rx={18} fill="#c2255c" stroke={INK} strokeWidth={10} />
              <SignText x={460} y={880} size={72} text="CITY MALL" />
            </>
          )}
          {opt === "C" && (
            <>
              <Building x={-40} w={480} h={700} color="#ffd8a8" sign="XEROX" awning="#1c7ed6" />
              <Building x={480} w={520} h={700} color="#d3f9d8" sign="XEROX" awning="#e8590c" signColor="#2b8a3e" />
              <SignText x={740} y={760} size={44} text="NEW" fill="#fff" />
            </>
          )}
          {opt === "D" && (
            <>
              <rect x={-200} y={300} width={420} height={900} fill="#e9c46a" stroke={INK} strokeWidth={10} />
              <rect x={860} y={260} width={420} height={940} fill="#f4a261" stroke={INK} strokeWidth={10} />
              <path d="M220 520 Q540 600 860 500" fill="none" stroke={INK} strokeWidth={5} />
              {[300, 420, 560, 700].map((cx, i) => (
                <rect key={cx} x={cx} y={548 + Math.sin(i) * 10 + Math.sin((frame + i * 7) / 10) * 4} width={70} height={90} fill={["#ff8787", "#74c0fc", "#ffd43b", "#b197fc"][i]} stroke={INK} strokeWidth={6} />
              ))}
              <Building x={260} w={560} h={560} color="#ced4da" sign="XEROX" awning="#868e96" signColor="#495057" windows={false} />
            </>
          )}
          <Ground road={opt === "B"} color={opt === "D" ? "#b5a48a" : "#cdb89a"} />
        </Layer>
        <Layer depth={0.75} from={from}>
          {opt === "A" &&
            [0, 1, 2, 3, 4].map((i) => (
              <Extra key={i} x={60 + i * 120 + (frame >= F.line ? 14 : 0)} y={1560 + (i % 2) * 20} s={0.95} shirt={["#ff8787", "#74c0fc", "#ffd43b", "#b197fc", "#63e6be"][i]} seed={i} paper hopAt={[F.line + i * 2]} />
            ))}
          {opt === "B" &&
            Array.from({ length: frame >= F.bheed ? 9 : 5 }).map((_, i) => (
              <Extra
                key={i}
                x={-100 + ((i * 173) % 1100)}
                y={1450 + (i % 3) * 90}
                s={0.9}
                shirt={["#ff8787", "#74c0fc", "#ffd43b", "#b197fc", "#63e6be", "#ffa94d"][i % 6]}
                seed={i + 10}
                walk={i % 2 ? 2.4 : -2.2}
                t0={from}
                flip={i % 2 === 0}
                bag={["#e64980", "#7950f2", "#12b886"][i % 3]}
              />
            ))}
          {opt === "C" &&
            [0, 1, 2].map((i) => (
              <Extra
                key={i}
                x={(frame >= F.aate ? 110 + i * 105 : 420 + i * 150) + (frame >= F.aate ? 0 : -(frame - from) * 0.4)}
                y={1580 + (i % 2) * 20}
                s={0.95}
                shirt={["#ffa8a8", "#a5d8ff", "#ffe066"][i]}
                seed={i + 20}
                paper
                flip
                hopAt={[F.aate + i * 3]}
              />
            ))}
          {opt === "D" && (
            <g transform={`translate(330 1700)`}>
              {/* sleeping dog, breathing */}
              <ellipse cx={0} cy={-40} rx={110} ry={50 + Math.sin(frame / 10) * 4} fill="#c08552" stroke={INK} strokeWidth={8} />
              <circle cx={-100} cy={-60} r={42} fill="#c08552" stroke={INK} strokeWidth={8} />
              <path d="M-120 -64 L-90 -64" stroke={INK} strokeWidth={6} strokeLinecap="round" />
              <SignText x={-60} y={-130 - ((frame % 40) / 40) * 40} size={40} text="Z" fill="#fff" />
            </g>
          )}
        </Layer>
        <Character
          x={opt === "D" ? 600 : 750}
          y={1700}
          scale={0.82}
          flip
          poses={poses}
          exprs={exprs}
          look={[{ f: from, v: 0.8 }]}
          hops={opt === "D" ? [F.zero] : opt === "A" ? [F.line] : []}
          seed={opt.charCodeAt(0)}
        />
        {opt === "D" && <Dust at={F.zero + 16} x={600} y={1700} />}
        {opt === "A" && <Dust at={F.line + 16} x={750} y={1700} />}
      </Camera>
      <Foreground side={opt === "B" ? "left" : "right"} kind="pole" />
    </>
  );
};

const OutroScene: React.FC = () => (
  <>
    <Camera from={F.s7} to={END} zoom={[1.0, 1.06]} pan={[0, 10]}>
      <Sky top="#7fc8ff" bottom="#ffe3b3" />
      <Layer depth={0.2} from={F.s7}>
        <FarCity seed="hook" color="#7d8fb3" />
      </Layer>
      <Layer depth={0.5} from={F.s7}>
        <Ground />
        <Auto y={1470} speed={6} start={0} />
      </Layer>
      <Character
        x={790}
        y={1690}
        scale={0.82}
        flip
        poses={[
          { f: F.s7, v: "point" },
          { f: F.answer2, v: "shrug" },
          { f: F.follow, v: "wave" },
        ]}
        exprs={[
          { f: F.s7, v: "grin" },
          { f: F.answer2, v: "sly" },
          { f: F.follow, v: "grin" },
        ]}
        look={[{ f: F.s7, v: -0.8 }]}
        hops={[F.handle + 4]}
      />
    </Camera>
    <Foreground side="left" kind="plant" />
  </>
);

// ---- UI: A-D tiles (screen space, top area) ----
const TILES = [
  { k: "A", t: "RTO OFFICE", c: "#ff6b6b", f: F.A },
  { k: "B", t: "BADA MALL", c: "#4dabf7", f: F.B },
  { k: "C", t: "XEROX KE BAGAL", c: "#51cf66", f: F.C },
  { k: "D", t: "APNI GALI", c: "#fcc419", f: F.D },
];
const Tiles: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < F.A) return null;
  const outro = frame >= F.s7;
  return (
    <>
      {TILES.map((tile, i) => {
        if (frame < tile.f) return null;
        const drop = dropBounce(frame, tile.f, 260);
        const next = TILES[i + 1]?.f ?? F.s7;
        const active = !outro && frame < next;
        const y = 190 + i * 108;
        return (
          <div
            key={tile.k}
            style={{
              position: "absolute",
              left: 70,
              top: y + drop.y,
              width: 860,
              height: 92,
              transform: `scale(${(active ? 1.04 : 0.96) * (1 + drop.squash * 0.06)}, ${1 - drop.squash * 0.12})`,
              transformOrigin: "50% 100%",
              background: active || outro ? "#fffaf0" : "#e9e2d4",
              border: `8px solid ${INK}`,
              borderRadius: 28,
              boxShadow: `0 10px 0 ${INK}`,
              display: "flex",
              alignItems: "center",
              opacity: active || outro ? 1 : 0.8,
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                marginLeft: 8,
                borderRadius: 35,
                background: tile.c,
                border: `7px solid ${INK}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 46,
                color: "#fff",
                WebkitTextStroke: `9px ${INK}`,
                paintOrder: "stroke fill",
              }}
            >
              {tile.k}
            </div>
            <div
              style={{
                marginLeft: 26,
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 54,
                color: INK,
                letterSpacing: 1,
              }}
            >
              {tile.t}
            </div>
            {outro && (
              <div
                style={{
                  position: "absolute",
                  right: 26,
                  fontFamily: FONT_FAMILY,
                  fontWeight: 800,
                  fontSize: 64,
                  color: tile.c,
                  WebkitTextStroke: `9px ${INK}`,
                  paintOrder: "stroke fill",
                  transform: `scale(${1 + Math.sin((frame + i * 6) / 5) * 0.12})`,
                }}
              >
                ?
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

// ---- UI: follow button + tap ----
const FollowButton: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < F.follow) return null;
  const p = popSpring(frame, F.follow);
  const tapped = frame >= F.handle;
  const press = frame >= F.handle && frame < F.handle + 5 ? 0.9 : 1;
  // finger slides in, then taps on the handle word
  const fx = interpolate(frame, [F.follow + 4, F.handle - 2], [W + 100, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fy = interpolate(frame, [F.follow + 4, F.handle - 2, F.handle, F.handle + 6], [1700, 1500, 1480, 1510], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1380,
          width: 560,
          height: 130,
          transform: `scale(${p * press})`,
          transformOrigin: "50% 50%",
          background: tapped ? "#adb5bd" : "#f03e3e",
          border: `9px solid ${INK}`,
          borderRadius: 70,
          boxShadow: `0 12px 0 ${INK}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 64,
          color: "#fff",
          WebkitTextStroke: `10px ${INK}`,
          paintOrder: "stroke fill",
        }}
      >
        {tapped ? "FOLLOWING" : "+ FOLLOW"}
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
        <g transform={`translate(${fx} ${fy}) rotate(-20)`}>
          <rect x={-28} y={0} width={56} height={150} rx={28} fill="#e0a77a" stroke={INK} strokeWidth={9} />
          <rect x={-60} y={90} width={120} height={150} rx={40} fill="#e0a77a" stroke={INK} strokeWidth={9} />
          <rect x={-70} y={220} width={140} height={120} fill="#ff7a3d" stroke={INK} strokeWidth={9} />
        </g>
      </svg>
      <Sparkles at={F.handle} x={370} y={1440} r={180} />
    </>
  );
};

// ---------------- sound ----------------
type S = { f: number; s: string; v: number };
const SFX: S[] = [
  { f: 0, s: "whoosh", v: 0.22 },
  { f: 0, s: "slam", v: 0.22 },
  { f: F.pachaas, s: "sparkle", v: 0.15 },
  { f: F.galat, s: "pop", v: 0.22 },
  { f: F.doob, s: "pop", v: 0.22 },
  { f: F.doob, s: "buzzer", v: 0.1 },
  { f: LAND_DOOB, s: "thud", v: 0.25 },
  { f: F.s2, s: "whoosh", v: 0.2 },
  { f: F.xerox, s: "pop", v: 0.2 },
  { f: F.xerox + 4, s: "whoosh", v: 0.1 },
  { f: F.photo, s: "click", v: 0.3 },
  { f: F.kholna + 16, s: "thud", v: 0.15 },
  { f: F.s3, s: "whoosh", v: 0.2 },
  { f: F.s3, s: "ding", v: 0.18 },
  { f: F.s3, s: "pop", v: 0.2 },
  { f: F.jahan3, s: "whoosh", v: 0.1 },
  { f: F.zarurat, s: "pop", v: 0.22 },
  { f: F.zarurat, s: "sparkle", v: 0.12 },
  { f: F.s4a, s: "whoosh", v: 0.2 },
  { f: F.s4a, s: "pop", v: 0.2 },
  { f: F.dawai, s: "sparkle", v: 0.12 },
  { f: F.s4b, s: "whoosh", v: 0.2 },
  { f: F.s4b, s: "pop", v: 0.2 },
  { f: F.chai, s: "splash", v: 0.1 },
  { f: F.s4c, s: "whoosh", v: 0.2 },
  { f: F.s4c, s: "pop", v: 0.2 },
  { f: F.pen, s: "click", v: 0.2 },
  { f: F.pen + 16, s: "thud", v: 0.12 },
  { f: F.s5, s: "whoosh", v: 0.22 },
  { f: F.s5, s: "pop", v: 0.15 },
  { f: F.kahan, s: "slam", v: 0.28 },
  { f: F.A, s: "whoosh", v: 0.2 },
  { f: F.A + 8, s: "thud", v: 0.2 },
  { f: F.jahanA, s: "whoosh", v: 0.08 },
  { f: F.line, s: "pop", v: 0.2 },
  { f: F.line + 16, s: "thud", v: 0.12 },
  { f: F.B, s: "whoosh", v: 0.2 },
  { f: F.B + 8, s: "thud", v: 0.2 },
  { f: F.sabse, s: "pop", v: 0.2 },
  { f: F.bheed, s: "buzzer", v: 0.08 },
  { f: F.C, s: "whoosh", v: 0.2 },
  { f: F.C + 8, s: "thud", v: 0.2 },
  { f: F.customer, s: "pop", v: 0.2 },
  { f: F.aate, s: "ding", v: 0.12 },
  { f: F.D, s: "whoosh", v: 0.2 },
  { f: F.D + 8, s: "thud", v: 0.2 },
  { f: F.kiraya, s: "pop", v: 0.2 },
  { f: F.zero, s: "sparkle", v: 0.15 },
  { f: F.zero + 16, s: "thud", v: 0.12 },
  { f: F.s7, s: "whoosh", v: 0.22 },
  { f: F.s7, s: "pop", v: 0.2 },
  { f: F.answer2, s: "pop", v: 0.22 },
  { f: F.follow, s: "pop", v: 0.2 },
  { f: F.handle, s: "click", v: 0.3 },
  { f: F.handle, s: "sparkle", v: 0.15 },
];

// music: ~10% while speaking, ~18% in gaps, smoothed
const speaking = new Float32Array(SHOPSPOT_DURATION + 1);
for (const l of data.lines) for (let f = Math.max(0, l.startFrame - 3); f <= Math.min(SHOPSPOT_DURATION, l.endFrame + 3); f++) speaking[f] = 1;
const musicVol = (f: number) => {
  let s = 0;
  let n = 0;
  for (let k = -6; k <= 6; k++) {
    const i = f + k;
    if (i >= 0 && i <= SHOPSPOT_DURATION) {
      s += speaking[i];
      n++;
    }
  }
  const sp = s / n;
  const fadeOut = interpolate(f, [SHOPSPOT_DURATION - 20, SHOPSPOT_DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (0.18 - 0.08 * sp) * fadeOut;
};

// ---------------- composition ----------------
export const ShopSpot: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* WORLD (hard cuts between scenes) */}
      {inRange(frame, 0, F.s2) && <HookScene />}
      {inRange(frame, F.s2, F.s3) && <ShopScene />}
      {inRange(frame, F.s3, F.s4a) && <ThinkScene />}
      {inRange(frame, F.s4a, F.s4b) && <StallScene from={F.s4a} to={F.s4b} land="hospital" action={F.dawai} />}
      {inRange(frame, F.s4b, F.s4c) && <StallScene from={F.s4b} to={F.s4c} land="station" action={F.chai} />}
      {inRange(frame, F.s4c, F.s5) && <StallScene from={F.s4c} to={F.s5} land="school" action={F.pen} />}
      {inRange(frame, F.s5, F.A) && <RehookScene />}
      {inRange(frame, F.A, F.B) && <OptionScene opt="A" from={F.A} to={F.B} />}
      {inRange(frame, F.B, F.C) && <OptionScene opt="B" from={F.B} to={F.C} />}
      {inRange(frame, F.C, F.D) && <OptionScene opt="C" from={F.C} to={F.D} />}
      {inRange(frame, F.D, F.s7) && <OptionScene opt="D" from={F.D} to={F.s7} />}
      {frame >= F.s7 && <OutroScene />}

      <SoftLight />
      <Vignette />

      {/* TEXT (screen space, top area, clear of faces, bottom 300 px and right edge) */}
      <Chip text="50,000 RUPEES" at={0} until={F.s2} y={250} size={110} slam from={1.12} />
      <Chip text="4 SPOTS, 1 WINNER" at={0} until={F.s2} y={395} size={84} color="#fff" rotate={2} slam from={1.1} />
      <Chip text="1 GALAT JAGAH" at={F.galat} until={F.doob} y={560} size={80} color="#ffd8a8" />
      <Chip text="SAB DOOB JAYEGA" at={F.doob} until={F.s2} y={560} size={80} color="#ff6b6b" slam />
      <Chip text="XEROX + PHOTO SHOP" at={F.xerox} until={F.s3} y={330} size={82} />
      <Chip text="SMART LOG" at={F.s3} until={F.zarurat} y={330} size={96} color="#fff" />
      <Chip text="ZARURAT PEHLE SE" at={F.zarurat} until={F.s4a} y={330} size={88} />
      <Chip text="HOSPITAL: DAWAI" at={F.s4a} until={F.s4b} y={330} size={86} />
      <Chip text="STATION: CHAI" at={F.s4b} until={F.s4c} y={330} size={86} />
      <Chip text="SCHOOL: PEN" at={F.s4c} until={F.s5} y={330} size={86} />
      <Chip text="DUKAAN KAHAN" at={F.kahan} until={F.A} y={420} size={110} color="#fff" slam rotate={-4} />
      <Chip text="CHALEGI?" at={F.kahan} until={F.A} y={560} size={120} slam rotate={3} />
      <Tiles />
      <Chip text="LINE MEIN LOG" at={F.line} until={F.B} y={700} size={72} bg="#e8590c" color="#fff" />
      <Chip text="SABSE ZYADA BHEED" at={F.sabse} until={F.C} y={700} size={72} bg="#e8590c" color="#fff" />
      <Chip text="CUSTOMER AATE HAIN" at={F.customer} until={F.D} y={700} size={68} bg="#e8590c" color="#fff" />
      <Chip text="KIRAYA ZERO" at={F.kiraya} until={F.s7} y={700} size={80} bg="#e8590c" color="#fff" />
      <Chip text="COMMENT KARO" at={F.s7} until={F.answer2} y={720} size={84} />
      <Chip text="ANSWER NEXT REEL" at={F.answer2} y={720} size={76} color="#fff" bg="#7048e8" />
      <FollowButton />

      <Grain />

      {/* SOUND: voice on top, music under, sfx on beats */}
      <Audio src={staticFile("voice/shopspot.wav")} volume={1} />
      <Audio src={staticFile("music/loop.wav")} loop volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
