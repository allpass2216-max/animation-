// AiCrore2 (Part 2): the answer to "2,000 se 50 crore?" — A, bank + cyber police; steps; why (money mule); viewer comment;
// twist (the AI ran off with his ₹2,000); teaser (parcel + OTP).
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
import { FONT_FAMILY } from "../../lib/fonts";
import {
  Camera,
  Chip,
  dropBounce,
  Dust,
  Grain,
  H,
  INK,
  makeCue,
  popSpring,
  SoftLight,
  Sparkles,
  Vignette,
  W,
  WordsFile,
} from "../../lib/reel";
import { FollowButton } from "../../lib/ui";
import { Foreground, Layer, Rays } from "../../lib/world";
import {
  BalanceScreen,
  CallScreen,
  CyberCell,
  HostelRoom,
  MoneyOut,
  Phone,
  ShadyGuy,
} from "../AiCrore/screens";
import wordsData from "./words.json";

const data = wordsData as unknown as WordsFile;
const cue = makeCue(data);
export const AICRORE2_DURATION =
  data.words[data.words.length - 1].endFrame + 60; // ends 2 s after the voice

const F = {
  pachaas: cue(5, "pachaas"),
  crore: cue(6, "crore"),
  caller: cue(9, "caller"),
  shaam: cue(11, "shaam"),
  sahi: cue(15, "Sahi"),
  jawab: cue(18, "Jawab"),
  A: cue(21, "A"),
  turant: cue(22, "turant"),
  bank: cue(23, "bank"),
  police: cue(26, "police"),
  batao: cue(28, "batao"),
  s3: cue(29, "Pehla"),
  d1: cue(30, "ek"),
  d9: cue(31, "nau"),
  d3: cue(32, "teen"),
  d0: cue(33, "zero"),
  call: cue(35, "call"),
  site: cue(37, "cybercrime"),
  s4: cue(42, "Doosra"),
  bank2: cue(43, "bank"),
  freeze: cue(48, "freeze"),
  s5: cue(50, "Teesra"),
  chhuo: cue(53, "chhuo"),
  bhejo: cue(55, "bhejo"),
  shots: cue(57, "screenshots"),
  s6: cue(59, "Isliye"),
  money: cue(62, "money"),
  jaal: cue(65, "jaal"),
  chori: cue(67, "chori"),
  naam: cue(71, "naam"),
  phanste: cue(75, "phanste"),
  s7: cue(78, "Ek"),
  sahi2: cue(82, "sahi"),
  dekho: cue(84, "dekho"),
  s8: cue(85, "Account"),
  bach: cue(87, "bach"),
  doHazaar: cue(92, "do"),
  ai: cue(95, "AI"),
  bhaag: cue(97, "bhaag"),
  s9: cue(99, "Tumhare"),
  comment: cue(104, "Comment"),
  s10: cue(106, "Agli"),
  parcel: cue(111, "parcel"),
  otp: cue(115, "OTP"),
  follow: cue(116, "Follow"),
  handle: cue(118, "@rehanfact"),
};
const END = AICRORE2_DURATION;
const inRange = (f: number, a: number, b: number) => f >= a && f < b;
const UI = { fontFamily: FONT_FAMILY, fontWeight: 800 as const };

// The viewer comment shown on "dekho". The user pastes a REAL comment here; never invent one.
// null = fallback card asking viewers to comment (no fake username).
type ViewerComment = { user: string; text: string } | null;
const VIEWER_COMMENT = null as ViewerComment;

// Ishaan, same rapper look as Part 1: black hoodie, red snapback, gold chain, shades
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
  poses: Cue<PoseName>[];
  exprs: Cue<Expr>[];
  shades: Cue<boolean>[];
  holding?: Cue<"none" | "phone">[];
  hops?: number[];
  sweat?: Cue<boolean>[];
  look?: Cue<number>[];
}> = ({ x = 290, y = 1740, scale = 0.92, look = [{ f: 0, v: 1 }], ...rest }) => (
  <Character {...ISHAAN} x={x} y={y} scale={scale} look={look} {...rest} />
);

// ---------------- phone screens ----------------
const DialScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const digits = [F.d1, F.d9, F.d3, F.d0].filter((f) => frame >= f).length;
  const typed = "1930".slice(0, digits);
  const calling = frame >= F.call;
  const site = frame >= F.site;
  return (
    <div
      style={{
        ...UI,
        position: "absolute",
        inset: 0,
        background: calling ? "#ebfbee" : "#f8f9fa",
        color: INK,
        textAlign: "center",
        paddingTop: 80,
      }}
    >
      <div style={{ fontSize: 28, color: "#868e96" }}>
        {calling ? "CALLING…" : "DIAL"}
      </div>
      <div style={{ fontSize: 120, letterSpacing: 8, marginTop: 10 }}>
        {typed || " "}
      </div>
      <div style={{ fontSize: 30, color: "#2b8a3e", height: 40 }}>
        {calling ? "CYBER CRIME HELPLINE" : ""}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          padding: "26px 40px",
        }}
      >
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""].map(
          (k, i) => {
            const idx = "1930".indexOf(k);
            const hit =
              k !== "" &&
              idx >= 0 &&
              idx < digits &&
              frame - [F.d1, F.d9, F.d3, F.d0][idx] < 6;
            return (
              <div
                key={i}
                style={{
                  height: 70,
                  borderRadius: 35,
                  fontSize: 40,
                  lineHeight: "70px",
                  background: k === "" ? "transparent" : hit ? "#4263eb" : "#e9ecef",
                  color: hit ? "#fff" : INK,
                  transform: `scale(${hit ? 1.12 : 1})`,
                }}
              >
                {k}
              </div>
            );
          },
        )}
      </div>
      {site && (
        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 40,
            padding: "14px 10px",
            borderRadius: 20,
            background: "#fff",
            border: `5px solid ${INK}`,
            fontSize: 28,
            transform: `scale(${popSpring(frame, F.site)})`,
          }}
        >
          cybercrime.gov.in
        </div>
      )}
    </div>
  );
};

const Lock: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={160 * s} height={190 * s} viewBox="0 0 160 190">
    <path
      d="M40 90 L40 60 Q40 15 80 15 Q120 15 120 60 L120 90"
      fill="none"
      stroke={INK}
      strokeWidth={18}
    />
    <path
      d="M40 90 L40 60 Q40 15 80 15 Q120 15 120 60 L120 90"
      fill="none"
      stroke="#adb5bd"
      strokeWidth={8}
    />
    <rect x={14} y={84} width={132} height={96} rx={18} fill="#fcc419" stroke={INK} strokeWidth={9} />
    <circle cx={80} cy={124} r={14} fill={INK} />
    <rect x={74} y={128} width={12} height={30} rx={5} fill={INK} />
  </svg>
);

const FreezeScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const frozen = frame >= F.freeze;
  const ice = interpolate(frame, [F.freeze, F.freeze + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const d = dropBounce(frame, F.freeze - 6, 420);
  return (
    <div style={{ ...UI, position: "absolute", inset: 0, padding: "70px 26px", color: INK }}>
      <div style={{ fontSize: 30, color: "#868e96" }}>MY BANK · A/C XX4821</div>
      <div style={{ fontSize: 30, marginTop: 30, color: "#495057" }}>BALANCE</div>
      <div style={{ fontSize: 44, marginTop: 6 }}>₹50,00,00,000</div>
      <div
        style={{
          marginTop: 30,
          padding: "16px 18px",
          borderRadius: 20,
          background: frame >= F.bank2 ? "#fff4e6" : "#f1f3f5",
          border: `5px solid ${INK}`,
          fontSize: 28,
        }}
      >
        BANK FRAUD LINE
        <div style={{ fontSize: 22, color: "#868e96" }}>
          {frame >= F.bank2 + 20 ? "CONNECTED · REPORT FRAUD" : "CONNECTING…"}
        </div>
      </div>
      {frozen && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `rgba(165,216,255,${0.75 * ice})`,
              boxShadow: `inset 0 0 80px rgba(255,255,255,${ice})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 470 + d.y,
              textAlign: "center",
              transform: `scale(${1 + d.squash * 0.15}, ${1 - d.squash * 0.2})`,
            }}
          >
            <Lock />
            <div style={{ fontSize: 50, color: "#1864ab" }}>FROZEN</div>
          </div>
        </>
      )}
    </div>
  );
};

const SafeScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const noSend = frame >= F.bhejo;
  const flash = frame >= F.shots && frame < F.shots + 6 ? 1 - (frame - F.shots) / 6 : 0;
  const shots = frame >= F.shots + 4;
  return (
    <div style={{ ...UI, position: "absolute", inset: 0, padding: "70px 26px", color: INK }}>
      <div style={{ fontSize: 30, color: "#868e96" }}>MY BANK</div>
      <div style={{ fontSize: 44, marginTop: 20 }}>₹50,00,00,000</div>
      <div
        style={{
          position: "relative",
          marginTop: 40,
          height: 90,
          borderRadius: 45,
          background: "#4263eb",
          border: `6px solid ${INK}`,
          color: "#fff",
          fontSize: 40,
          lineHeight: "78px",
          textAlign: "center",
          opacity: noSend ? 0.5 : 1,
        }}
      >
        SEND ➜
        {noSend && (
          <svg
            style={{ position: "absolute", left: 0, top: -20 }}
            width={380}
            height={130}
          >
            <path
              d={`M20 20 L${20 + 340 * Math.min(1, (frame - F.bhejo) / 5)} 110`}
              stroke="#e03131"
              strokeWidth={16}
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      {shots && (
        <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
          {["ALERT", "CHAT", "CALL"].map((t, i) => (
            <div
              key={t}
              style={{
                flex: 1,
                height: 150,
                borderRadius: 14,
                background: "#e7f5ff",
                border: `5px solid ${INK}`,
                fontSize: 22,
                paddingTop: 100,
                textAlign: "center",
                transform: `scale(${popSpring(frame, F.shots + 4 + i * 4)}) rotate(${(i - 1) * 4}deg)`,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      )}
      {shots && (
        <div style={{ fontSize: 26, color: "#2b8a3e", marginTop: 16, textAlign: "center" }}>
          ✓ SCREENSHOTS SAVED
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />
    </div>
  );
};

const BotRunScreen: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...UI, position: "absolute", inset: 0, padding: "70px 26px", color: INK }}>
      <div style={{ fontSize: 30, color: "#868e96" }}>MY BANK</div>
      <div style={{ fontSize: 40, marginTop: 20 }}>₹50,00,00,000</div>
      <div
        style={{
          marginTop: 16,
          display: "inline-block",
          padding: "8px 18px",
          borderRadius: 16,
          background: "#d3f9d8",
          border: `5px solid ${INK}`,
          fontSize: 30,
          color: "#2b8a3e",
          transform: `scale(${popSpring(frame, F.bach)})`,
        }}
      >
        SAFE · FROZEN
      </div>
      <div style={{ fontSize: 30, marginTop: 50, color: "#495057" }}>AI MONEY BOT</div>
      <div style={{ fontSize: 56, marginTop: 6, color: frame >= F.bhaag ? "#e03131" : INK }}>
        {frame >= F.bhaag ? "₹0" : "₹2,000"}
      </div>
      {frame >= F.bhaag && (
        <div style={{ fontSize: 26, color: "#e03131" }}>APP NOT FOUND</div>
      )}
    </div>
  );
};

// ---------------- world pieces ----------------
/** The AI bot (purple app icon with legs) grabs the ₹2,000 note and runs off the right edge. */
const BotThief: React.FC<{ grabAt: number; runAt: number }> = ({ grabAt, runAt }) => {
  const frame = useCurrentFrame();
  if (frame < grabAt) return null;
  const p = popSpring(frame, grabAt);
  const run = Math.max(0, frame - runAt);
  const x = 740 + run * run * 0.9 + run * 6;
  const y = 1380 - Math.abs(Math.sin(run / 2.2)) * 40 * (run > 0 ? 1 : 0);
  const leg = Math.sin(frame / (run > 0 ? 1.6 : 6)) * 30;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <g transform={`translate(${x} ${y}) scale(${p}) rotate(${run > 0 ? 12 : 0})`}>
        <path d={`M-30 50 L${-30 - leg} 120`} stroke={INK} strokeWidth={14} strokeLinecap="round" />
        <path d={`M30 50 L${30 + leg} 120`} stroke={INK} strokeWidth={14} strokeLinecap="round" />
        <rect x={-75} y={-90} width={150} height={150} rx={36} fill="#7048e8" stroke={INK} strokeWidth={9} />
        <text x={0} y={-2} fontSize={60} textAnchor="middle" fill="#fff" fontFamily={FONT_FAMILY} fontWeight={800}>
          AI
        </text>
        <ellipse cx={-28} cy={-50} rx={10} ry={12} fill="#fff" />
        <ellipse cx={28} cy={-50} rx={10} ry={12} fill="#fff" />
        <path d="M-20 34 Q0 46 20 34" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" />
        {/* the ₹2,000 note held up */}
        <g transform={`translate(60 -110) rotate(${-14 + Math.sin(frame / 3) * 8})`}>
          <path d="M70 60 L20 100" stroke={INK} strokeWidth={12} strokeLinecap="round" />
          <rect x={-40} y={-30} width={170} height={90} rx={8} fill="#e599f7" stroke={INK} strokeWidth={7} />
          <text x={45} y={28} fontSize={36} textAnchor="middle" fill={INK} fontFamily={FONT_FAMILY} fontWeight={800}>
            ₹2000
          </text>
        </g>
      </g>
      {run > 0 && run < 30 && (
        <g opacity={1 - run / 30}>
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${x - 120 - i * 40} ${1360 + i * 30} l-80 0`} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
          ))}
        </g>
      )}
    </svg>
  );
};

/** Three sad victims (top left) whose money flows into Ishaan's account. */
const Victims: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      {[0, 1, 2].map((i) => {
        const x = 110 + i * 150;
        const y = 760 + Math.sin((frame + i * 7) / 9) * 6;
        const p = popSpring(frame, F.chori + i * 3);
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${p})`}>
            <path d="M-50 140 Q-50 60 0 60 Q50 60 50 140 Z" fill={["#74c0fc", "#ffa94d", "#b197fc"][i]} stroke={INK} strokeWidth={7} />
            <circle cx={0} cy={20} r={46} fill="#e0a370" stroke={INK} strokeWidth={7} />
            <circle cx={-15} cy={14} r={5} fill={INK} />
            <circle cx={15} cy={14} r={5} fill={INK} />
            <path d="M-14 42 Q0 32 14 42" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
            <path d="M-22 22 q-3 12 0 16" stroke="#4dabf7" strokeWidth={6} strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
};

/** Police siren glow (red/blue) from the top corners. */
const Siren: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const on = Math.floor((frame - at) / 5) % 2 === 0;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 0% 0%, rgba(255,40,60,${on ? 0.55 : 0.1}), transparent 55%), radial-gradient(circle at 100% 0%, rgba(40,110,255,${on ? 0.1 : 0.55}), transparent 55%)`,
      }}
    />
  );
};

/** Mystery parcel drops with a bounce; the lid pops and a glowing OTP card rises. */
const Parcel: React.FC<{ at: number; openAt: number }> = ({ at, openAt }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const d = dropBounce(frame, at, 900);
  const open = Math.max(0, frame - openAt);
  const lid = Math.min(1, open / 6);
  const rise = interpolate(open, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const x = 830;
  const y = 1500;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
      <g transform={`translate(${x} ${y + d.y}) scale(${1 + d.squash * 0.15} ${1 - d.squash * 0.2})`}>
        {frame >= openAt && (
          <g transform={`translate(0 ${-200 - 260 * rise}) scale(${0.4 + 0.6 * rise})`}>
            <circle r={150} fill="#ffe066" opacity={0.35 + Math.sin(frame / 4) * 0.1} />
            <rect x={-130} y={-60} width={260} height={120} rx={20} fill="#fff" stroke={INK} strokeWidth={8} />
            <text x={0} y={-14} fontSize={30} textAnchor="middle" fill="#868e96" fontFamily={FONT_FAMILY} fontWeight={800}>
              OTP
            </text>
            <text x={0} y={38} fontSize={56} textAnchor="middle" fill={INK} fontFamily={FONT_FAMILY} fontWeight={800} letterSpacing={6}>
              4 8 1 9
            </text>
          </g>
        )}
        <rect x={-150} y={-200} width={300} height={200} rx={10} fill="#c08552" stroke={INK} strokeWidth={9} />
        <rect x={-24} y={-200} width={48} height={200} fill="#e8c27a" stroke={INK} strokeWidth={5} />
        <text x={-90} y={-70} fontSize={90} textAnchor="middle" fill="#fff" fontFamily={FONT_FAMILY} fontWeight={800} stroke={INK} strokeWidth={6} paintOrder="stroke">
          ?
        </text>
        <g transform={`translate(160 -200) rotate(${110 * lid})`}>
          <rect x={-320} y={-36} width={320} height={40} rx={8} fill="#a9713f" stroke={INK} strokeWidth={8} />
        </g>
      </g>
    </svg>
  );
};

/** Viewer comment card (Instagram-style). Shows VIEWER_COMMENT, or a "your comment here" card when none was given. */
const CommentCard: React.FC<{ at: number; stampAt: number }> = ({ at, stampAt }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = popSpring(frame, at);
  const stamp = frame >= stampAt ? popSpring(frame, stampAt, 30, 12) : 0;
  const c = VIEWER_COMMENT;
  return (
    <div
      style={{
        ...UI,
        position: "absolute",
        left: 80,
        top: 520,
        width: 880,
        padding: "34px 34px 40px",
        borderRadius: 36,
        background: "#fff",
        border: `9px solid ${INK}`,
        boxShadow: `0 14px 0 ${INK}`,
        color: INK,
        transform: `scale(${p}) rotate(-2deg)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            background: "linear-gradient(135deg,#f783ac,#ffa94d)",
            border: `6px solid ${INK}`,
          }}
        />
        <div style={{ fontSize: 40 }}>{c ? c.user : "@AAPKA_NAAM"}</div>
        <div style={{ marginLeft: "auto", fontSize: 50, color: "#e03131" }}>♥</div>
      </div>
      <div style={{ fontSize: 50, marginTop: 20, lineHeight: 1.15 }}>
        {c ? c.text : "AAPKA SAHI COMMENT YAHAN AAYEGA?"}
      </div>
      {frame >= stampAt && (
        <div
          style={{
            position: "absolute",
            right: 30,
            bottom: -60,
            padding: "8px 26px",
            borderRadius: 18,
            border: `8px solid #2b8a3e`,
            color: "#2b8a3e",
            background: "#ebfbee",
            fontSize: 48,
            transform: `rotate(-8deg) scale(${2 - stamp})`,
            opacity: Math.min(1, stamp * 1.5),
          }}
        >
          SAHI JAWAB ✓
        </div>
      )}
    </div>
  );
};

/** A-D tiles from Part 1: B, C, D get crossed out, A turns green and grows. */
const AnswerTiles: React.FC<{ at: number; crossAt: number; winAt: number; until: number }> = ({ at, crossAt, winAt, until }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  const tiles = [
    { k: "A", t: "BANK + CYBER POLICE", c: "#ff6b6b" },
    { k: "B", t: "WAPAS BHEJ DO", c: "#4dabf7" },
    { k: "C", t: "DELETE, CHUP RAHO", c: "#51cf66" },
    { k: "D", t: "PARTY KARO", c: "#fcc419" },
  ];
  return (
    <>
      {tiles.map((tile, i) => {
        const showAt = at + i * 2;
        if (frame < showAt) return null;
        const drop = dropBounce(frame, showAt, 260);
        const crossF = crossAt + (i - 1) * 4;
        const crossed = i > 0 && frame >= crossF;
        const win = i === 0 && frame >= winAt;
        const wp = win ? popSpring(frame, winAt) : 0;
        return (
          <div
            key={tile.k}
            style={{
              ...UI,
              position: "absolute",
              left: 70,
              top: 190 + i * 108 + drop.y,
              width: 860,
              height: 92,
              transform: `scale(${(1 + wp * 0.06) * (1 + drop.squash * 0.06)}, ${1 - drop.squash * 0.12})`,
              transformOrigin: "50% 100%",
              background: win ? "#d3f9d8" : crossed ? "#dee2e6" : "#fffaf0",
              border: `8px solid ${win ? "#2b8a3e" : INK}`,
              borderRadius: 28,
              boxShadow: win ? `0 10px 0 ${INK}, 0 0 40px rgba(64,192,87,0.8)` : `0 10px 0 ${INK}`,
              display: "flex",
              alignItems: "center",
              opacity: crossed ? 0.7 : 1,
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
                fontSize: 46,
                color: "#fff",
                WebkitTextStroke: `9px ${INK}`,
                paintOrder: "stroke fill",
              }}
            >
              {tile.k}
            </div>
            <div style={{ marginLeft: 26, fontSize: 50, color: INK }}>{tile.t}</div>
            {win && (
              <div style={{ position: "absolute", right: 30, fontSize: 64, color: "#2b8a3e", transform: `scale(${wp})` }}>✓</div>
            )}
            {crossed && (
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={860} height={92}>
                <path
                  d={`M20 46 L${20 + 800 * Math.min(1, (frame - crossF) / 5)} 46`}
                  stroke="#e03131"
                  strokeWidth={12}
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        );
      })}
      {frame >= winAt && <Sparkles at={winAt} x={480} y={236} r={200} />}
    </>
  );
};

// ---------------- scenes ----------------
const RecapScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Camera from={0} to={F.A} zoom={[1.0, 1.1]} pan={[0, -20]} shakeAt={[F.shaam, F.jawab]}>
        {frame < F.sahi ? (
          <Layer depth={0.3} from={0} drift={-0.3}>
            <HostelRoom morning />
          </Layer>
        ) : (
          <Rays c1="#ffd43b" c2="#ffa94d" />
        )}
        <Ishaan
          poses={[
            { f: 0, v: "shrug" },
            { f: F.crore, v: "cheer" },
            { f: F.caller, v: "hold" },
            { f: F.shaam, v: "panic" },
            { f: F.sahi, v: "think" },
            { f: F.jawab, v: "point" },
          ]}
          exprs={[
            { f: 0, v: "shock" },
            { f: F.crore, v: "grin" },
            { f: F.caller, v: "worried" },
            { f: F.shaam, v: "shock" },
            { f: F.sahi, v: "think" },
            { f: F.jawab, v: "grin" },
          ]}
          shades={[
            { f: 0, v: false },
            { f: F.crore, v: true },
            { f: F.caller, v: false },
            { f: F.jawab, v: true },
          ]}
          holding={[
            { f: 0, v: "none" },
            { f: F.caller, v: "phone" },
            { f: F.sahi, v: "none" },
          ]}
          sweat={[
            { f: 0, v: false },
            { f: F.caller, v: true },
            { f: F.sahi, v: false },
          ]}
          hops={[2, F.crore, F.jawab]}
        />
      </Camera>
      {frame < F.sahi && (
        <Phone buzzAt={frame < F.caller ? 0 : F.caller}>
          {frame < F.caller ? (
            <BalanceScreen
              a={0}
              b={F.crore}
              fromAmt={2000}
              toAmt={500000000}
              label="MY BANK"
              alertAt={F.crore}
            />
          ) : (
            <CallScreen a={F.caller} />
          )}
        </Phone>
      )}
    </>
  );
};

const AnswerScene: React.FC = () => (
  <>
    <Camera from={F.A} to={F.s3} zoom={[1.0, 1.06]} panY={[0, 20]}>
      <Layer depth={0.3} from={F.A} drift={-0.3}>
        <CyberCell />
      </Layer>
      <Ishaan
        x={420}
        poses={[
          { f: F.A, v: "point" },
          { f: F.police, v: "present" },
          { f: F.batao, v: "cheer" },
        ]}
        exprs={[
          { f: F.A, v: "smile" },
          { f: F.batao, v: "grin" },
        ]}
        shades={[{ f: F.A, v: true }]}
        hops={[F.batao]}
      />
    </Camera>
    <Foreground side="right" kind="plant" />
  </>
);

const DialScene: React.FC = () => (
  <>
    <Camera from={F.s3} to={F.s4} zoom={[1.0, 1.08]}>
      <Layer depth={0.3} from={F.s3} drift={-0.3}>
        <HostelRoom morning />
      </Layer>
      <Ishaan
        poses={[
          { f: F.s3, v: "tap" },
          { f: F.call, v: "hold" },
          { f: F.site, v: "point" },
        ]}
        exprs={[
          { f: F.s3, v: "think" },
          { f: F.call, v: "smile" },
        ]}
        shades={[{ f: F.s3, v: false }]}
        holding={[
          { f: F.s3, v: "none" },
          { f: F.call, v: "phone" },
          { f: F.site, v: "none" },
        ]}
      />
    </Camera>
    <Phone>
      <DialScreen />
    </Phone>
  </>
);

const FreezeScene: React.FC = () => (
  <>
    <Camera from={F.s4} to={F.s5} zoom={[1.0, 1.08]} shakeAt={[F.freeze]}>
      <Layer depth={0.3} from={F.s4} drift={-0.3}>
        <CyberCell />
      </Layer>
      <Ishaan
        x={270}
        poses={[
          { f: F.s4, v: "hold" },
          { f: F.freeze, v: "present" },
        ]}
        exprs={[
          { f: F.s4, v: "worried" },
          { f: F.freeze, v: "grin" },
        ]}
        shades={[{ f: F.s4, v: false }]}
        holding={[
          { f: F.s4, v: "phone" },
          { f: F.freeze, v: "none" },
        ]}
        hops={[F.freeze + 2]}
      />
    </Camera>
    <Phone>
      <FreezeScreen />
    </Phone>
  </>
);

const DontTouchScene: React.FC = () => (
  <>
    <Camera from={F.s5} to={F.s6} zoom={[1.0, 1.08]}>
      <Layer depth={0.3} from={F.s5} drift={-0.3}>
        <HostelRoom morning />
      </Layer>
      <Ishaan
        poses={[
          { f: F.s5, v: "think" },
          { f: F.chhuo, v: "shrug" },
          { f: F.bhejo, v: "panic" },
          { f: F.shots, v: "tap" },
        ]}
        exprs={[
          { f: F.s5, v: "think" },
          { f: F.chhuo, v: "worried" },
          { f: F.shots, v: "smile" },
        ]}
        shades={[{ f: F.s5, v: false }]}
      />
    </Camera>
    <Phone>
      <SafeScreen />
    </Phone>
  </>
);

const MuleScene: React.FC = () => (
  <>
    <Camera from={F.s6} to={F.s7} zoom={[1.0, 1.1]} shakeAt={[F.s6, F.phanste]}>
      <Rays c1="#2b0a12" c2="#5c1020" />
      <Victims />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
        <ShadyGuy x={870} y={1740} />
      </svg>
      <Ishaan
        x={420}
        poses={[
          { f: F.s6, v: "point" },
          { f: F.money, v: "shrug" },
          { f: F.naam, v: "panic" },
          { f: F.phanste, v: "shrug" },
        ]}
        exprs={[
          { f: F.s6, v: "sly" },
          { f: F.money, v: "worried" },
          { f: F.naam, v: "shock" },
          { f: F.phanste, v: "cry" },
        ]}
        shades={[{ f: F.s6, v: false }]}
        sweat={[{ f: F.naam, v: true }]}
        hops={[F.phanste]}
      />
      <MoneyOut at={F.chori} from={[170, 900]} to={[250, 1400]} />
      <MoneyOut at={F.naam} from={[580, 1420]} to={[840, 1380]} />
    </Camera>
    <Siren at={F.phanste} />
  </>
);

const CommentScene: React.FC = () => (
  <>
    <Camera from={F.s7} to={F.s8} zoom={[1.0, 1.05]}>
      <Layer depth={0.3} from={F.s7} drift={-0.3}>
        <HostelRoom morning />
      </Layer>
      <Ishaan
        x={320}
        y={1760}
        poses={[
          { f: F.s7, v: "present" },
          { f: F.dekho, v: "point" },
        ]}
        exprs={[
          { f: F.s7, v: "smile" },
          { f: F.sahi2, v: "grin" },
        ]}
        shades={[{ f: F.s7, v: true }]}
        hops={[F.sahi2]}
      />
    </Camera>
    <CommentCard at={F.s7 + 2} stampAt={F.sahi2} />
  </>
);

const TwistScene: React.FC = () => (
  <>
    <Camera from={F.s8} to={F.s9} zoom={[1.0, 1.08]} shakeAt={[F.bhaag]}>
      <Layer depth={0.3} from={F.s8} drift={-0.3}>
        <HostelRoom morning />
      </Layer>
      <Ishaan
        x={260}
        poses={[
          { f: F.s8, v: "cheer" },
          { f: F.doHazaar, v: "shrug" },
          { f: F.bhaag, v: "panic" },
        ]}
        exprs={[
          { f: F.s8, v: "grin" },
          { f: F.doHazaar, v: "think" },
          { f: F.ai, v: "shock" },
          { f: F.bhaag, v: "cry" },
        ]}
        shades={[
          { f: F.s8, v: true },
          { f: F.doHazaar, v: false },
        ]}
        hops={[F.bach]}
        look={[
          { f: 0, v: 1 },
          { f: F.bhaag + 6, v: 1 },
        ]}
      />
      <BotThief grabAt={F.ai} runAt={F.bhaag} />
      <Dust at={F.bhaag} x={760} y={1500} />
    </Camera>
    {/* phone sits upper right while the bot runs below it */}
    <Phone y={560} h={700}>
      <BotRunScreen />
    </Phone>
  </>
);

const AskScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Camera from={F.s9} to={F.s10} zoom={[1.0, 1.05]}>
      <Layer depth={0.3} from={F.s9} drift={-0.3}>
        <HostelRoom />
      </Layer>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
        {[0, 1, 2].map((i) => (
          <g
            key={i}
            transform={`translate(${720 + i * 90} ${1080 - i * 70 + Math.sin((frame + i * 9) / 7) * 10}) scale(${popSpring(frame, F.comment + i * 3)})`}
          >
            <rect x={-60} y={-44} width={120} height={88} rx={22} fill="#fff" stroke={INK} strokeWidth={7} />
            <path d="M-20 44 L-36 74 L6 44" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
            {[-26, 0, 26].map((dx) => (
              <circle key={dx} cx={dx} cy={0} r={8} fill={INK} />
            ))}
          </g>
        ))}
      </svg>
      <Ishaan
        x={400}
        poses={[
          { f: F.s9, v: "shrug" },
          { f: F.comment, v: "point" },
        ]}
        exprs={[
          { f: F.s9, v: "sly" },
          { f: F.comment, v: "grin" },
        ]}
        shades={[{ f: F.s9, v: false }]}
      />
    </Camera>
  );
};

const TeaserScene: React.FC = () => (
  <>
    <Camera from={F.s10} to={END} zoom={[1.0, 1.06]} shakeAt={[F.parcel + 8]}>
      <Layer depth={0.3} from={F.s10} drift={-0.3}>
        <HostelRoom />
      </Layer>
      <Ishaan
        x={300}
        poses={[
          { f: F.s10, v: "think" },
          { f: F.parcel, v: "panic" },
          { f: F.otp, v: "point" },
          { f: F.follow, v: "wave" },
        ]}
        exprs={[
          { f: F.s10, v: "sly" },
          { f: F.parcel, v: "wow" },
          { f: F.otp, v: "shock" },
          { f: F.follow, v: "grin" },
        ]}
        shades={[
          { f: F.s10, v: false },
          { f: F.follow, v: true },
        ]}
        hops={[F.parcel + 8]}
      />
      <Parcel at={F.parcel - 4} openAt={F.otp} />
      <Dust at={F.parcel + 8} x={830} y={1500} count={12} />
    </Camera>
  </>
);

// ---------------- sound ----------------
type S = { f: number; s: string; v: number };
const SFX: S[] = [
  { f: 0, s: "whoosh", v: 0.2 },
  { f: 0, s: "buzzer", v: 0.06 },
  { f: F.crore, s: "sparkle", v: 0.2 },
  { f: F.crore, s: "pop", v: 0.18 },
  { f: F.caller, s: "buzzer", v: 0.08 },
  { f: F.shaam, s: "slam", v: 0.22 },
  { f: F.sahi, s: "whoosh", v: 0.2 },
  { f: F.sahi, s: "pop", v: 0.2 },
  { f: F.jawab, s: "slam", v: 0.26 },
  { f: F.A, s: "whoosh", v: 0.2 },
  { f: F.A + 6, s: "thud", v: 0.18 },
  { f: F.turant, s: "click", v: 0.2 },
  { f: F.turant + 4, s: "click", v: 0.18 },
  { f: F.turant + 8, s: "click", v: 0.18 },
  { f: F.bank, s: "ding", v: 0.18 },
  { f: F.bank, s: "sparkle", v: 0.15 },
  { f: F.s3, s: "whoosh", v: 0.2 },
  { f: F.s3, s: "pop", v: 0.2 },
  { f: F.d1, s: "tick", v: 0.22 },
  { f: F.d9, s: "tick", v: 0.22 },
  { f: F.d3, s: "tick", v: 0.22 },
  { f: F.d0, s: "tick", v: 0.22 },
  { f: F.call, s: "ding", v: 0.15 },
  { f: F.site, s: "pop", v: 0.2 },
  { f: F.s4, s: "whoosh", v: 0.2 },
  { f: F.s4, s: "pop", v: 0.2 },
  { f: F.bank2, s: "buzzer", v: 0.05 },
  { f: F.freeze, s: "slam", v: 0.24 },
  { f: F.freeze + 4, s: "sparkle", v: 0.15 },
  { f: F.s5, s: "whoosh", v: 0.2 },
  { f: F.s5, s: "pop", v: 0.2 },
  { f: F.chhuo, s: "pop", v: 0.2 },
  { f: F.bhejo, s: "slam", v: 0.18 },
  { f: F.shots, s: "click", v: 0.3 },
  { f: F.shots + 4, s: "pop", v: 0.15 },
  { f: F.s6, s: "whoosh", v: 0.22 },
  { f: F.s6, s: "slam", v: 0.26 },
  { f: F.money, s: "pop", v: 0.2 },
  { f: F.chori, s: "whoosh", v: 0.14 },
  { f: F.naam, s: "whoosh", v: 0.14 },
  { f: F.phanste, s: "buzzer", v: 0.1 },
  { f: F.phanste, s: "slam", v: 0.22 },
  { f: F.s7, s: "whoosh", v: 0.2 },
  { f: F.s7 + 2, s: "pop", v: 0.22 },
  { f: F.sahi2, s: "slam", v: 0.2 },
  { f: F.sahi2, s: "ding", v: 0.15 },
  { f: F.s8, s: "whoosh", v: 0.2 },
  { f: F.bach, s: "ding", v: 0.15 },
  { f: F.doHazaar, s: "pop", v: 0.2 },
  { f: F.ai, s: "pop", v: 0.22 },
  { f: F.bhaag, s: "whoosh", v: 0.24 },
  { f: F.bhaag, s: "thud", v: 0.12 },
  { f: F.s9, s: "whoosh", v: 0.2 },
  { f: F.s9, s: "pop", v: 0.2 },
  { f: F.comment, s: "pop", v: 0.2 },
  { f: F.comment + 3, s: "pop", v: 0.15 },
  { f: F.s10, s: "whoosh", v: 0.2 },
  { f: F.s10, s: "pop", v: 0.2 },
  { f: F.parcel + 8, s: "thud", v: 0.28 },
  { f: F.otp, s: "sparkle", v: 0.2 },
  { f: F.otp, s: "pop", v: 0.2 },
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
  const fadeOut = interpolate(f, [END - 20, END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (0.18 - 0.08 * (s / n)) * fadeOut;
};

// ---------------- composition ----------------
export const AiCrore2: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {inRange(frame, 0, F.A) && <RecapScene />}
      {inRange(frame, F.A, F.s3) && <AnswerScene />}
      {inRange(frame, F.s3, F.s4) && <DialScene />}
      {inRange(frame, F.s4, F.s5) && <FreezeScene />}
      {inRange(frame, F.s5, F.s6) && <DontTouchScene />}
      {inRange(frame, F.s6, F.s7) && <MuleScene />}
      {inRange(frame, F.s7, F.s8) && <CommentScene />}
      {inRange(frame, F.s8, F.s9) && <TwistScene />}
      {inRange(frame, F.s9, F.s10) && <AskScene />}
      {frame >= F.s10 && <TeaserScene />}

      <SoftLight />
      <Vignette />

      {/* TEXT */}
      <Chip text="50 CRORE: SAHI JAWAB?" at={0} until={F.caller} x={540} y={250} size={64} slam from={1.08} />
      <Chip text="PART 2" at={0} until={F.caller} y={380} size={64} color="#fff" bg="#7048e8" />
      <Chip text="SHAAM TAK BHEJO!" at={F.shaam} until={F.sahi} y={300} size={80} color="#ff6b6b" slam />
      <Chip text="SAHI KYA THA?" at={F.sahi} until={F.jawab} y={420} size={96} />
      <Chip text="JAWAB YE RAHA!" at={F.jawab} until={F.A} y={420} size={104} slam rotate={-4} />
      <AnswerTiles at={F.A} crossAt={F.turant} winAt={F.bank} until={F.s3} />
      <Chip text="STEP 1: CALL 1930" at={F.s3} until={F.site} y={330} size={84} />
      <Chip text="CYBERCRIME.GOV.IN" at={F.site} until={F.s4} y={330} size={76} color="#fff" bg="#1864ab" />
      <Chip text="STEP 2: BANK" at={F.s4} until={F.freeze} y={330} size={88} />
      <Chip text="ACCOUNT FREEZE" at={F.freeze} until={F.s5} y={330} size={88} color="#a5d8ff" slam />
      <Chip text="STEP 3: MAT CHHUO" at={F.s5} until={F.shots} y={330} size={84} />
      <Chip text="SCREENSHOTS RAKHO" at={F.shots} until={F.s6} y={330} size={80} color="#fff" bg="#2b8a3e" />
      <Chip text="ISLIYE" at={F.s6} until={F.money} y={330} size={130} slam />
      <Chip text="MONEY MULE JAAL" at={F.money} until={F.phanste} y={330} size={88} color="#ff6b6b" />
      <Chip text="CHORI KA PAISA" at={F.chori} until={F.phanste} y={460} size={64} color="#fff" />
      <Chip text="PHANSTE TUM!" at={F.phanste} until={F.s7} y={380} size={110} color="#ff6b6b" slam rotate={3} />
      <Chip text="VIEWER NE PAKDA" at={F.s7} until={F.s8} y={330} size={84} />
      <Chip text="ACCOUNT SAFE" at={F.bach} until={F.doHazaar} y={330} size={88} color="#8ce99a" />
      <Chip text="₹2,000 GAYAB!" at={F.bhaag} until={F.s9} y={330} size={96} color="#ff6b6b" slam />
      <Chip text="KABHI HUA?" at={F.s9} until={F.s10} y={400} size={110} />
      <Chip text="COMMENT KARO" at={F.comment} until={F.s10} y={560} size={84} color="#fff" bg="#7048e8" />
      <Chip text="AGLI PAHELI" at={F.s10} until={F.parcel} y={360} size={104} />
      <Chip text="PARCEL + OTP?" at={F.parcel} y={360} size={96} slam />
      <FollowButton at={F.follow} tapAt={F.handle} />

      <Grain />

      <Audio src={staticFile("voice/aicrore2.wav")} volume={1} />
      <Audio src={staticFile("music/loop.wav")} loop volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
