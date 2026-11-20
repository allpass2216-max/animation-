// FreeEditor: tech-tip / free-tool reveal (no puzzle, no options). "Stop paying for video editing apps: Kdenlive is free + open source."
// Pastel hostel desk, a big laptop whose screen changes per point, numbered feature cards, Sahil presenting. Cues from ./words.json.
import React from "react";
import { AbsoluteFill, Audio, interpolate, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Character } from "../../lib/Character";
import { FONT_FAMILY } from "../../lib/fonts";
import { Camera, Chip, dropBounce, Grain, INK, makeCue, popSpring, SoftLight, Sparkles, Vignette, WordsFile } from "../../lib/reel";
import { FollowButton } from "../../lib/ui";
import wordsData from "./words.json";

const data = wordsData as unknown as WordsFile;
const cue = makeCue(data);
export const FREEEDITOR_DURATION = data.words[data.words.length - 1].endFrame + 60;
const W = 1080;
const H = 1920;

const F = {
  paise: cue(7, "paise"),
  band: cue(9, "band"),
  s2: cue(11, "Kyunki"),
  free: cue(13, "free"),
  kden: cue(18, "Kdenlive"),
  open: cue(21, "open"),
  s3: cue(23, "Laptop"),
  win: cue(27, "Windows"),
  mac: cue(28, "Mac"),
  linux: cue(29, "Linux"),
  s4: cue(32, "Multi"),
  titles: cue(35, "titles"),
  trans: cue(36, "transitions"),
  effects: cue(37, "effects"),
  s5: cue(40, "Aur"),
  watermark: cue(45, "watermark"),
  subs: cue(48, "subscription"),
  s6: cue(50, "Export"),
  mp4: cue(52, "MP4"),
  four: cue(56, "four"),
  s7: cue(59, "Sahil"),
  reels: cue(66, "reels"),
  rupaya: cue(70, "rupaya"),
  s8: cue(74, "Toh"),
  save: cue(79, "save"),
  s9: cue(82, "Download"),
  comment: cue(86, "comment"),
  edit: cue(89, "EDIT"),
  s10: cue(93, "Aur"),
  follow: cue(94, "follow"),
  handle: cue(96, "@rehanfact"),
};
const END = FREEEDITOR_DURATION;
const inRange = (f: number, a: number, b: number) => f >= a && f < b;
const UI: React.CSSProperties = { fontFamily: FONT_FAMILY, fontWeight: 800 };
const SAHIL = { skin: "#C98B5E", shirt: "#7048e8", pants: "#2b3a67", hair: "#1d1420", hood: "#5f3dc4" } as const;

// ---------------- world ----------------
/** Pastel desk room with soft blurred floating icons (depth). */
const Desk: React.FC = () => {
  const frame = useCurrentFrame();
  const icons = ["🎬", "🎵", "✨", "📱", "🎞️", "💡"];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(160deg, #fdf0e6 0%, #f3e8ff 45%, #e6f0ff 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 20% 15%, rgba(255,190,150,0.5), transparent 40%), radial-gradient(circle at 85% 70%, rgba(170,190,255,0.45), transparent 45%)" }} />
      {/* far: floating icons, blurred */}
      {icons.map((ic, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 60 + random(`ix${i}`) * 940,
            top: 120 + random(`iy${i}`) * 1500 + Math.sin(frame / 30 + i) * 18,
            fontSize: 70 + random(`is${i}`) * 40,
            filter: `blur(${3 + (i % 3) * 2}px)`,
            opacity: 0.55,
          }}
        >
          {ic}
        </div>
      ))}
      {/* desk */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
        <rect x={-50} y={1480} width={W + 100} height={500} fill="#e0c3a0" />
        <rect x={-50} y={1480} width={W + 100} height={26} fill="#c9a27a" />
        <rect x={-50} y={1506} width={W + 100} height={10} fill={INK} opacity={0.15} />
      </svg>
    </AbsoluteFill>
  );
};

/** Big laptop (screen-space). `children` = screen content. */
const Laptop: React.FC<{ children: React.ReactNode; slamAt?: number }> = ({ children, slamAt }) => {
  const frame = useCurrentFrame();
  const t = slamAt !== undefined ? frame - slamAt : -1;
  const lid = t >= 0 && t < 14 ? Math.sin((t / 14) * Math.PI) * 55 : 0; // lid slams half-shut then bounces back
  return (
    <div style={{ position: "absolute", left: 120, top: 520, width: 840, height: 980 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 840,
          height: 560,
          borderRadius: 28,
          background: "#1f2433",
          border: `8px solid ${INK}`,
          boxShadow: `0 14px 0 ${INK}, 0 30px 60px rgba(80,60,140,0.25)`,
          transformOrigin: "50% 100%",
          transform: `perspective(1400px) rotateX(${lid}deg)`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 16, borderRadius: 16, background: "#f8f9fa", overflow: "hidden" }}>{children}</div>
      </div>
      <div style={{ position: "absolute", left: -60, top: 568, width: 960, height: 44, borderRadius: "0 0 30px 30px", background: "#ced4da", border: `8px solid ${INK}` }} />
    </div>
  );
};

/** Numbered feature card (top area). */
const FeatureCard: React.FC<{ n: number; text: string; at: number; until: number }> = ({ n, text, at, until }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  const p = popSpring(frame, at);
  return (
    <div
      style={{
        ...UI,
        position: "absolute",
        left: "50%",
        top: 400,
        transform: `translateX(-50%) scale(${p})`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 28px 12px 14px",
        background: "#fff",
        border: `6px solid ${INK}`,
        borderRadius: 40,
        boxShadow: `0 8px 0 ${INK}`,
        fontSize: 40,
        color: INK,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 54, height: 54, borderRadius: 27, background: "#4263eb", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{n}</span>
      {text}
    </div>
  );
};

/** Pill badge that drops in with a bounce. */
const Badge: React.FC<{ text: string; at: number; x: number; y: number; bg: string; color?: string; size?: number }> = ({ text, at, x, y, bg, color = "#fff", size = 46 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const d = dropBounce(frame, at, 200);
  return (
    <div
      style={{
        ...UI,
        position: "absolute",
        left: x,
        top: y + d.y,
        transform: `translate(-50%, -50%) scale(${1 + d.squash * 0.1}, ${1 - d.squash * 0.15})`,
        padding: "10px 26px",
        borderRadius: 22,
        background: bg,
        color,
        fontSize: size,
        border: `6px solid ${INK}`,
        boxShadow: `0 8px 0 ${INK}`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

// ---------------- screen contents ----------------
const PayPopup: React.FC = () => {
  const frame = useCurrentFrame();
  const b = 1 + Math.abs(Math.sin(frame / 5)) * 0.05;
  return (
    <AbsoluteFill style={{ background: "#e9ecef", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...UI, transform: `scale(${b})`, background: "#fff", border: `6px solid #e03131`, borderRadius: 24, padding: "28px 40px", textAlign: "center", color: INK }}>
        <div style={{ fontSize: 30, color: "#e03131" }}>SUBSCRIPTION ENDED</div>
        <div style={{ fontSize: 64, marginTop: 8 }}>RENEW RS 999</div>
        <div style={{ fontSize: 28, color: "#868e96" }}>/ MONTH</div>
        <div style={{ marginTop: 18, background: "#e03131", color: "#fff", borderRadius: 16, padding: "12px 20px", fontSize: 34 }}>PAY NOW</div>
      </div>
    </AbsoluteFill>
  );
};

/** Generic editor app reveal: icon (film strip + play, NOT the official logo) + name. */
const AppReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const p = popSpring(frame, F.kden);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#e7f5ff,#f3f0ff)", alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${p})`, textAlign: "center" }}>
        <svg width={220} height={220}>
          <rect x={10} y={10} width={200} height={200} rx={48} fill="#1c7ed6" stroke={INK} strokeWidth={8} />
          {[40, 80, 120, 160].map((y) => (
            <g key={y}>
              <rect x={30} y={y} width={18} height={14} rx={3} fill="#fff" />
              <rect x={172} y={y} width={18} height={14} rx={3} fill="#fff" />
            </g>
          ))}
          <path d="M90 70 L150 110 L90 150 Z" fill="#fff" />
        </svg>
        <div style={{ ...UI, fontSize: 70, color: INK, marginTop: 6 }}>Kdenlive</div>
        <div style={{ ...UI, fontSize: 26, color: "#495057" }}>VIDEO EDITOR</div>
      </div>
    </AbsoluteFill>
  );
};

/** Multi-track timeline with clips sliding in; titles / transitions / effects light up on their words. */
const Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const tracks = [
    { c: "#4dabf7", label: "V2" },
    { c: "#9775fa", label: "V1" },
    { c: "#69db7c", label: "A1" },
    { c: "#ffa94d", label: "A2" },
  ];
  const ph = ((frame - F.s4) * 4) % 760;
  return (
    <AbsoluteFill style={{ background: "#212529" }}>
      {/* preview */}
      <div style={{ position: "absolute", left: 40, top: 24, width: 360, height: 210, borderRadius: 10, background: "linear-gradient(135deg,#ff8787,#9775fa)", overflow: "hidden" }}>
        {frame >= F.titles && <div style={{ ...UI, position: "absolute", left: 20, top: 70, fontSize: 40, color: "#fff", WebkitTextStroke: `6px ${INK}`, paintOrder: "stroke fill" }}>MY REEL</div>}
        {frame >= F.trans && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent ${((frame - F.trans) * 6) % 100}%, rgba(255,255,255,0.55) ${(((frame - F.trans) * 6) % 100) + 10}%, transparent ${(((frame - F.trans) * 6) % 100) + 20}%)` }} />}
        {frame >= F.effects && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 30%, rgba(255,240,150,0.6), transparent 50%)" }} />}
      </div>
      {/* tool buttons */}
      {[
        { t: "TITLES", f: F.titles },
        { t: "TRANSITIONS", f: F.trans },
        { t: "EFFECTS", f: F.effects },
      ].map((b, i) => (
        <div key={b.t} style={{ ...UI, position: "absolute", left: 430, top: 30 + i * 70, padding: "8px 18px", borderRadius: 12, fontSize: 26, background: frame >= b.f ? "#4263eb" : "#343a40", color: "#fff", transform: `scale(${frame >= b.f && frame < b.f + 6 ? 1.12 : 1})` }}>
          {b.t}
        </div>
      ))}
      {/* tracks */}
      {tracks.map((tr, i) => (
        <div key={i} style={{ position: "absolute", left: 20, top: 260 + i * 56, right: 20, height: 46, background: "#343a40", borderRadius: 8 }}>
          <div style={{ ...UI, position: "absolute", left: 8, top: 10, fontSize: 20, color: "#adb5bd" }}>{tr.label}</div>
          {[0, 1, 2].map((k) => {
            const inAt = F.s4 + i * 4 + k * 6;
            const x = interpolate(frame, [inAt, inAt + 8], [800, 60 + k * 230 + i * 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return <div key={k} style={{ position: "absolute", left: x, top: 6, width: 200, height: 34, borderRadius: 6, background: tr.c, border: `3px solid ${INK}` }} />;
          })}
        </div>
      ))}
      <div style={{ position: "absolute", left: 60 + ph, top: 250, width: 4, height: 240, background: "#ff6b6b" }} />
    </AbsoluteFill>
  );
};

/** Render / export screen: progress bar fills, MP4 + 4K badges. */
const ExportScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [F.s6, F.four + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#f1f3f5", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...UI, fontSize: 40, color: INK }}>RENDERING… {Math.round(p * 100)}%</div>
      <div style={{ width: 600, height: 34, marginTop: 24, borderRadius: 17, background: "#dee2e6", border: `5px solid ${INK}`, overflow: "hidden" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", background: "linear-gradient(90deg,#4263eb,#9775fa)" }} />
      </div>
      {p >= 1 && <div style={{ ...UI, marginTop: 24, fontSize: 34, color: "#2b8a3e" }}>DONE ✓ my_reel.mp4</div>}
    </AbsoluteFill>
  );
};

/** A week of reels filling a grid. */
const ReelsGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  return (
    <AbsoluteFill style={{ background: "#fff", padding: 24, display: "flex", flexWrap: "wrap", gap: 14, alignContent: "flex-start" }}>
      {days.map((d, i) => {
        const on = frame >= F.s7 + 4 + i * 5;
        return (
          <div
            key={d}
            style={{
              ...UI,
              width: 160,
              height: 205,
              borderRadius: 16,
              border: `5px solid ${INK}`,
              background: on ? `linear-gradient(160deg, hsl(${i * 47},80%,70%), hsl(${i * 47 + 60},75%,55%))` : "#e9ecef",
              color: "#fff",
              fontSize: 28,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: 12,
              transform: `scale(${on ? 1 : 0.85})`,
              WebkitTextStroke: `5px ${INK}`,
              paintOrder: "stroke fill",
            }}
          >
            {d}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Instagram-style comment box with "EDIT" typed on its word. */
const CommentBox: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = "EDIT".slice(0, Math.max(0, Math.min(4, Math.floor((frame - F.edit) / 3) + 1)));
  const sent = frame >= F.edit + 16;
  return (
    <div style={{ ...UI, position: "absolute", left: 140, top: 760, width: 800, padding: "22px 26px", borderRadius: 30, background: "#fff", border: `6px solid ${INK}`, boxShadow: `0 10px 0 ${INK}` }}>
      <div style={{ fontSize: 26, color: "#868e96" }}>Add a comment…</div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
        <div style={{ flex: 1, fontSize: 64, color: "#e03131" }}>
          {frame >= F.edit ? typed : ""}
          <span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0, color: INK }}>|</span>
        </div>
        <div style={{ width: 70, height: 70, borderRadius: 35, background: sent ? "#2b8a3e" : "#4263eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{sent ? "✓" : "➤"}</div>
      </div>
    </div>
  );
};

/** Coins flying out of a wallet (money leaving). */
const CoinsOut: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / 30;
  if (t < 0) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      <g transform="translate(300 1440)">
        <rect x={-80} y={-50} width={160} height={100} rx={16} fill="#8a5530" stroke={INK} strokeWidth={7} />
        <rect x={20} y={-20} width={70} height={40} rx={10} fill="#a0663f" stroke={INK} strokeWidth={6} />
      </g>
      {Array.from({ length: 8 }).map((_, i) => {
        const tt = t - i * 0.06;
        if (tt < 0) return null;
        const vx = -150 + random(`cvx${i}`) * 300;
        const vy = -900 - random(`cvy${i}`) * 300;
        const x = 300 + vx * tt;
        const y = 1400 + vy * tt + 0.5 * 3000 * tt * tt;
        if (y > 1500) return null;
        return <circle key={i} cx={x} cy={y} r={22} fill="#ffd43b" stroke={INK} strokeWidth={5} />;
      })}
    </svg>
  );
};

// ---------------- scenes ----------------
const Presenter: React.FC<{ poses: Parameters<typeof Character>[0]["poses"]; exprs: Parameters<typeof Character>[0]["exprs"]; hops?: number[] }> = ({ poses, exprs, hops }) => (
  <Character {...SAHIL} x={850} y={1830} scale={0.74} flip poses={poses} exprs={exprs} hops={hops} look={[{ f: 0, v: 1 }]} />
);

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const screen =
    frame < F.s2 ? (
      <PayPopup />
    ) : frame < F.s3 ? (
      <AppReveal />
    ) : frame < F.s4 ? (
      <AppReveal />
    ) : frame < F.s5 ? (
      <Timeline />
    ) : frame < F.s6 ? (
      <Timeline />
    ) : frame < F.s7 ? (
      <ExportScreen />
    ) : (
      <ReelsGrid />
    );
  const showLaptop = frame < F.s8;
  return (
    <Camera from={0} to={END} zoom={[1.0, 1.04]}>
      <Desk />
      {showLaptop && <Laptop slamAt={F.band}>{screen}</Laptop>}
      {frame < F.s2 && <CoinsOut at={F.paise} />}
      {/* platforms badges */}
      {inRange(frame, F.s3, F.s4) && (
        <>
          <Badge text="WINDOWS" at={F.win} x={190} y={1240} bg="#1c7ed6" />
          <Badge text="MAC" at={F.mac} x={420} y={1240} bg="#495057" />
          <Badge text="LINUX" at={F.linux} x={590} y={1240} bg="#f59f00" color={INK} />
        </>
      )}
      {/* no watermark / no subscription: stamps crossed out */}
      {inRange(frame, F.s5, F.s6) && (
        <>
          <Badge text="WATERMARK" at={F.watermark} x={540} y={760} bg="#868e96" size={56} />
          {frame >= F.watermark + 6 && (
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
              <path d={`M300 790 L${300 + Math.min(1, (frame - F.watermark - 6) / 6) * 480} 730`} stroke="#e03131" strokeWidth={16} strokeLinecap="round" />
            </svg>
          )}
          <Badge text="RS 999/MONTH" at={F.subs} x={540} y={940} bg="#868e96" size={56} />
          {frame >= F.subs + 6 && (
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
              <path d={`M300 970 L${300 + Math.min(1, (frame - F.subs - 6) / 6) * 480} 910`} stroke="#e03131" strokeWidth={16} strokeLinecap="round" />
            </svg>
          )}
        </>
      )}
      {inRange(frame, F.s6, F.s7) && (
        <>
          <Badge text="MP4" at={F.mp4} x={260} y={1250} bg="#4263eb" size={60} />
          <Badge text="4K" at={F.four} x={500} y={1250} bg="#e64980" size={60} />
        </>
      )}
      {/* save: big bookmark */}
      {inRange(frame, F.s8, F.s9) && (
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
          <g transform={`translate(540 900) scale(${frame >= F.save ? popSpring(frame, F.save) * 1.2 : 0.9})`}>
            <path d="M-120 -170 L120 -170 L120 170 L0 80 L-120 170 Z" fill={frame >= F.save ? "#ffd43b" : "#fff"} stroke={INK} strokeWidth={12} strokeLinejoin="round" />
          </g>
          <Sparkles at={F.save} x={540} y={900} r={220} />
        </svg>
      )}
      {inRange(frame, F.s9, F.s10) && <CommentBox />}
      {/* presenter */}
      <Presenter
        poses={[
          { f: 0, v: "panic" },
          { f: F.band, v: "point" },
          { f: F.s2, v: "present" },
          { f: F.kden, v: "cheer" },
          { f: F.s3, v: "point" },
          { f: F.s4, v: "present" },
          { f: F.s5, v: "cheer" },
          { f: F.s6, v: "point" },
          { f: F.s7, v: "present" },
          { f: F.rupaya, v: "cheer" },
          { f: F.s8, v: "point" },
          { f: F.s9, v: "present" },
          { f: F.s10, v: "wave" },
        ]}
        exprs={[
          { f: 0, v: "shock" },
          { f: F.band, v: "angry" },
          { f: F.s2, v: "sly" },
          { f: F.kden, v: "grin" },
          { f: F.s5, v: "wow" },
          { f: F.s6, v: "grin" },
        ]}
        hops={[F.kden, F.s5 + 4, F.rupaya]}
      />
    </Camera>
  );
};

// ---------------- sound ----------------
type S = { f: number; s: string; v: number };
const SFX: S[] = [
  { f: 0, s: "whoosh", v: 0.2 },
  { f: 0, s: "buzzer", v: 0.07 },
  { f: F.paise, s: "sparkle", v: 0.12 },
  { f: F.band, s: "slam", v: 0.25 },
  { f: F.s2, s: "whoosh", v: 0.2 },
  { f: F.kden, s: "pop", v: 0.22 },
  { f: F.kden, s: "sparkle", v: 0.15 },
  { f: F.open, s: "pop", v: 0.2 },
  { f: F.s3, s: "whoosh", v: 0.2 },
  { f: F.win + 6, s: "thud", v: 0.15 },
  { f: F.mac + 6, s: "thud", v: 0.15 },
  { f: F.linux + 6, s: "thud", v: 0.15 },
  { f: F.s4, s: "whoosh", v: 0.2 },
  { f: F.titles, s: "click", v: 0.2 },
  { f: F.trans, s: "click", v: 0.2 },
  { f: F.effects, s: "click", v: 0.2 },
  { f: F.s5, s: "whoosh", v: 0.2 },
  { f: F.watermark + 6, s: "slam", v: 0.18 },
  { f: F.subs + 6, s: "slam", v: 0.18 },
  { f: F.s6, s: "whoosh", v: 0.2 },
  { f: F.mp4 + 6, s: "thud", v: 0.15 },
  { f: F.four + 6, s: "ding", v: 0.15 },
  { f: F.s7, s: "whoosh", v: 0.2 },
  { f: F.reels, s: "pop", v: 0.18 },
  { f: F.rupaya, s: "sparkle", v: 0.15 },
  { f: F.s8, s: "whoosh", v: 0.2 },
  { f: F.save, s: "pop", v: 0.22 },
  { f: F.s9, s: "whoosh", v: 0.2 },
  { f: F.edit, s: "click", v: 0.15 },
  { f: F.edit + 4, s: "click", v: 0.12 },
  { f: F.edit + 16, s: "ding", v: 0.15 },
  { f: F.s10, s: "whoosh", v: 0.2 },
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
export const FreeEditor: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#fdf0e6" }}>
      <Scene />
      <SoftLight x="20%" y="10%" color="rgba(255,220,180,0.25)" />
      <Vignette />

      <Chip text="PAISE DENA BAND!" at={0} until={F.s2} y={250} size={84} slam from={1.06} color="#ff6b6b" />
      <Chip text="KDENLIVE" at={F.kden} until={F.s3} y={250} size={100} />
      <Chip text="100% FREE + OPEN SOURCE" at={F.open} until={F.s3} y={390} size={56} color="#fff" bg="#2b8a3e" />
      <FeatureCard n={1} text="WINDOWS · MAC · LINUX" at={F.s3} until={F.s4} />
      <FeatureCard n={2} text="MULTI-TRACK TIMELINE" at={F.s4} until={F.s5} />
      <FeatureCard n={3} text="NO WATERMARK" at={F.s5} until={F.s6} />
      <Chip text="NO SUBSCRIPTION" at={F.subs + 8} until={F.s6} y={250} size={80} slam />
      <FeatureCard n={4} text="EXPORT MP4 · 4K" at={F.s6} until={F.s7} />
      <Chip text="RS 0 KHARCH" at={F.rupaya} until={F.s8} y={330} size={110} color="#fff" bg="#2b8a3e" />
      <Chip text="SAVE KARO" at={F.save} until={F.s9} y={330} size={110} />
      <Chip text="LINK DM MEIN" at={F.edit + 16} until={F.s10} y={330} size={96} color="#fff" bg="#4263eb" />
      {frame >= F.s10 && <Chip text="FREE TOOLS" at={F.s10} y={330} size={100} />}
      <FollowButton at={F.follow} tapAt={F.handle} />

      <Grain opacity={0.04} />

      <Audio src={staticFile("voice/freeeditor.wav")} volume={1} />
      <Audio src={staticFile("music/loop.wav")} loop volume={musicVol} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={60}>
          <Audio src={staticFile(`sfx/${s.s}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
