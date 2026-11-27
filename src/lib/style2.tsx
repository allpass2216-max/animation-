// HOUSE STYLE v2 UI kit (NOTES.md): karaoke captions, series/name pills, question banner, HUD, A-D option list,
// countdown badge, CTA strips, share bubble, profile card with a Follow tap. Our own design, our own handle.
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "./fonts";
import { INK, popSpring, W, WordsFile } from "./reel";

const UI = { fontFamily: FONT_FAMILY, fontWeight: 800 as const };
const outline = (px: number) => ({ WebkitTextStroke: `${px}px ${INK}`, paintOrder: "stroke fill" as const });

/** Word-by-word captions: 2-3 words at a time from the current line, the spoken word in yellow. Kept above the bottom 300 px. */
export const KaraokeCaptions: React.FC<{ data: WordsFile; y?: number; per?: number; hideFrom?: number[][] }> = ({
  data,
  y = 1470,
  per = 3,
  hideFrom = [],
}) => {
  const frame = useCurrentFrame();
  if (hideFrom.some(([a, b]) => frame >= a && frame < b)) return null;
  const words = data.words;
  let idx = -1;
  for (let i = 0; i < words.length; i++) if (words[i].startFrame <= frame) idx = i;
  if (idx < 0) return null;
  const cur = words[idx];
  if (frame > cur.endFrame + 12) return null;
  const start = idx - (idx % per);
  const group = words.slice(start, start + per);
  const p = popSpring(frame, words[start].startFrame);
  return (
    <div
      style={{
        ...UI,
        position: "absolute",
        left: 60,
        right: 60,
        top: y,
        textAlign: "center",
        fontSize: Math.min(72, Math.floor(1500 / Math.max(1, group.reduce((n, w) => n + w.word.length + 1, 0)))),
        lineHeight: 1.1,
        transform: `scale(${0.85 + 0.15 * p})`,
      }}
    >
      {group.map((w, i) => (
        <span
          key={i}
          style={{
            color: start + i === idx ? "#FFE14D" : "#fff",
            ...outline(14),
            textShadow: `0 6px 0 ${INK}`,
            marginRight: 18,
            textTransform: "uppercase",
          }}
        >
          {w.word.replace(/[^\w@%₹]/g, "")}
        </span>
      ))}
    </div>
  );
};

/** Small rounded pill (series tag / speaker name) at the top-left. */
export const Pill: React.FC<{ text: string; at: number; until?: number; y?: number; bg?: string; icon?: string }> = ({
  text,
  at,
  until = 1e9,
  y = 120,
  bg = "#7048e8",
  icon,
}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  const p = popSpring(frame, at);
  return (
    <div
      style={{
        ...UI,
        position: "absolute",
        left: 40,
        top: y,
        padding: "8px 24px",
        borderRadius: 40,
        background: bg,
        border: `5px solid ${INK}`,
        boxShadow: `0 6px 0 ${INK}`,
        color: "#fff",
        fontSize: 38,
        transform: `scale(${p})`,
        transformOrigin: "0% 50%",
      }}
    >
      {icon ? `${icon} ` : ""}
      {text}
    </div>
  );
};

/** Two-line question banner at the top: line 1 white, line 2 yellow. */
export const QuestionBanner: React.FC<{ l1: string; l2: string; at: number; until?: number; y?: number }> = ({
  l1,
  l2,
  at,
  until = 1e9,
  y = 240,
}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  const p = at <= 0 ? 1 : popSpring(frame, at);
  const wob = Math.sin(frame / 10) * 1;
  return (
    <div style={{ ...UI, position: "absolute", left: 40, right: 40, top: y, textAlign: "center", transform: `scale(${p}) rotate(${wob}deg)` }}>
      <div style={{ fontSize: 76, color: "#fff", ...outline(14), textShadow: `0 7px 0 ${INK}` }}>{l1}</div>
      <div style={{ fontSize: 86, color: "#FFE14D", ...outline(16), textShadow: `0 8px 0 ${INK}` }}>{l2}</div>
    </div>
  );
};

/** HUD at the top-right: speed (red border) + distance (yellow). */
export const Hud: React.FC<{ speed: number; dist: number; until?: number }> = ({ speed, dist, until = 1e9 }) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const box = (bg: string, border: string): React.CSSProperties => ({
    ...UI,
    padding: "6px 18px",
    borderRadius: 14,
    background: bg,
    border: `5px solid ${border}`,
    boxShadow: `0 5px 0 ${INK}`,
    fontSize: 40,
    color: INK,
    textAlign: "right",
    marginBottom: 12,
  });
  return (
    <div style={{ position: "absolute", right: 60, top: 110, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <div style={{ ...box("#fff", "#e03131") }}>
        {Math.round(speed)} <span style={{ fontSize: 26 }}>km/h</span>
      </div>
      <div style={{ ...box("#FFE14D", INK) }}>⚠ {Math.round(dist)} m</div>
    </div>
  );
};

export type Opt = { k: string; t: string; c: string; f: number };
/** A-D option list at the left, each popping on its letter; the current one is bigger. `outroAt`: all show again with "?". */
export const OptionList: React.FC<{ opts: Opt[]; until: number; y?: number; outroAt?: number }> = ({ opts, until, y = 880, outroAt = 1e9 }) => {
  const frame = useCurrentFrame();
  const outro = frame >= outroAt;
  if (frame < opts[0].f || (frame >= until && !outro)) return null;
  return (
    <div style={{ position: "absolute", left: 40, top: y }}>
      {opts.map((o, i) => {
        const at = outro ? outroAt + i * 3 : o.f;
        if (frame < at) return null;
        const next = opts[i + 1]?.f ?? until;
        const active = !outro && frame < next;
        const p = popSpring(frame, at);
        return (
          <div
            key={o.k}
            style={{
              ...UI,
              display: "flex",
              alignItems: "center",
              marginBottom: 16,
              padding: "6px 22px 6px 8px",
              borderRadius: 40,
              background: active ? "#fff" : "#f1f3f5",
              border: `6px solid ${INK}`,
              boxShadow: `0 7px 0 ${INK}`,
              fontSize: active ? 46 : 38,
              color: INK,
              transform: `scale(${p}) translateX(${(1 - p) * -80}px)`,
              transformOrigin: "0% 50%",
              opacity: active || outro ? 1 : 0.85,
            }}
          >
            <span
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                background: o.c,
                border: `5px solid ${INK}`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                ...outline(7),
                marginRight: 14,
                fontSize: 36,
              }}
            >
              {o.k}
            </span>
            {o.t}
            {outro && <span style={{ marginLeft: 14, color: o.c, ...outline(7) }}>?</span>}
          </div>
        );
      })}
    </div>
  );
};

/** Countdown badge (12 -> 1 by default), one step per second, top-left. */
export const CountdownBadge: React.FC<{ at: number; from?: number; until?: number }> = ({ at, from = 12, until = 1e9 }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  const n = Math.max(1, from - Math.floor((frame - at) / 30));
  const tick = ((frame - at) % 30) / 30;
  return (
    <div
      style={{
        ...UI,
        position: "absolute",
        left: 40,
        top: 200,
        padding: "6px 22px",
        borderRadius: 18,
        background: n <= 5 ? "#e03131" : INK,
        border: "5px solid #fff",
        color: "#fff",
        fontSize: 50,
        transform: `scale(${1 + (1 - tick) * 0.12})`,
      }}
    >
      {n}
    </div>
  );
};

/** CTA strip (full-width bar). */
export const CtaStrip: React.FC<{ text: string; at: number; until?: number; y: number; bg?: string; color?: string }> = ({
  text,
  at,
  until = 1e9,
  y,
  bg = "#2f9e44",
  color = "#fff",
}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  const p = interpolate(frame, [at, at + 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        ...UI,
        position: "absolute",
        left: 40,
        right: 40,
        top: y,
        padding: "12px 10px",
        textAlign: "center",
        borderRadius: 16,
        background: bg,
        border: `5px solid ${INK}`,
        boxShadow: `0 6px 0 ${INK}`,
        color,
        fontSize: 44,
        transform: `scaleX(${p})`,
      }}
    >
      {text}
    </div>
  );
};

/** White speech bubble (share prompt). */
export const ShareBubble: React.FC<{ text: string; at: number; until?: number; y?: number }> = ({ text, at, until = 1e9, y = 230 }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  const p = popSpring(frame, at);
  return (
    <div
      style={{
        ...UI,
        position: "absolute",
        left: 120,
        right: 120,
        top: y,
        padding: "20px 26px",
        borderRadius: 30,
        background: "#fff",
        border: `6px solid ${INK}`,
        boxShadow: `0 8px 0 ${INK}`,
        color: INK,
        fontSize: 44,
        textAlign: "center",
        transform: `scale(${p}) rotate(-2deg)`,
      }}
    >
      {text}
      <div style={{ position: "absolute", left: 120, bottom: -34, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `34px solid ${INK}` }} />
    </div>
  );
};

/** Our profile card (avatar, handle, tagline) with a FOLLOW button that a finger taps. */
export const ProfileCard: React.FC<{ at: number; tapAt: number; y?: number; handle?: string; tagline?: string }> = ({
  at,
  tapAt,
  y = 300,
  handle = "@rehanfact",
  tagline = "ROZ EK PAHELI · FACTS · KAHANI",
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = popSpring(frame, at);
  const tapped = frame >= tapAt;
  const fx = interpolate(frame, [at + 4, tapAt - 2], [W + 80, 330], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fy = interpolate(frame, [at + 4, tapAt - 2, tapAt, tapAt + 6], [y + 520, y + 250, y + 236, y + 262], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div
        style={{
          ...UI,
          position: "absolute",
          left: 60,
          right: 60,
          top: y,
          padding: 26,
          borderRadius: 30,
          background: "#1b1430",
          border: "6px solid #69db7c",
          boxShadow: `0 10px 0 ${INK}`,
          color: "#fff",
          transform: `scale(${p})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Img src={staticFile("freeeditor/avatar.jpg")} style={{ width: 110, height: 110, borderRadius: 55, border: "5px solid #fff", objectFit: "cover" }} />
          <div>
            <div style={{ fontSize: 54 }}>{handle.toUpperCase()}</div>
            <div style={{ fontSize: 28, color: "#FFE14D" }}>{tagline}</div>
          </div>
        </div>
        <div
          style={{
            marginTop: 22,
            padding: "14px 0",
            borderRadius: 40,
            textAlign: "center",
            fontSize: 50,
            background: tapped ? "#495057" : "#40c057",
            border: `5px solid ${INK}`,
            transform: `scale(${frame >= tapAt && frame < tapAt + 5 ? 0.92 : 1})`,
          }}
        >
          {tapped ? "✓ FOLLOWING" : "+ FOLLOW"}
        </div>
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={1920}>
        <g transform={`translate(${fx} ${fy}) rotate(-20)`}>
          <rect x={-28} y={0} width={56} height={150} rx={28} fill="#e0a77a" stroke={INK} strokeWidth={9} />
          <rect x={-60} y={90} width={120} height={150} rx={40} fill="#e0a77a" stroke={INK} strokeWidth={9} />
          <rect x={-70} y={220} width={140} height={120} fill="#3b5bdb" stroke={INK} strokeWidth={9} />
        </g>
      </svg>
    </>
  );
};
