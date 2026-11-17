// Shared building blocks for vertical reels: chips, overlays, camera, physics helpers, word cues.
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "./fonts";

export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const INK = "#1b1430"; // outline colour for everything

// ---------- word cues (from words.json, never guessed) ----------
export type Word = { word: string; startFrame: number; endFrame: number; start: number; end: number };
export type WordsFile = { words: Word[]; lines: { text: string; startFrame: number; endFrame: number }[] };

/** Frame of word #index, checked against the expected text so a changed words.json fails loudly. */
export const makeCue = (data: WordsFile) => (index: number, expect: string) => {
  const w = data.words[index];
  if (!w || w.word.toLowerCase().replace(/[^a-z@]/g, "") !== expect.toLowerCase().replace(/[^a-z@]/g, "")) {
    throw new Error(`Cue mismatch at word ${index}: expected "${expect}", got "${w?.word}"`);
  }
  return w.startFrame;
};

// ---------- motion helpers ----------
export const popSpring = (frame: number, at: number, fps = FPS, damping = 10) =>
  spring({ frame: frame - at, fps, config: { damping, stiffness: 180, mass: 0.6 } });

/** Falling with gravity then bouncing; returns y offset (0 = resting on ground) and squash 0..1. */
export const dropBounce = (frame: number, at: number, height: number) => {
  const t = (frame - at) / FPS;
  if (t < 0) return { y: -height, squash: 0, landed: false };
  const g = 5200; // px/s^2
  const tFall = Math.sqrt((2 * height) / g);
  if (t < tFall) return { y: -height + 0.5 * g * t * t, squash: 0, landed: false };
  // bounces with restitution 0.35
  let v = g * tFall * 0.35;
  let tt = t - tFall;
  while (v > 60) {
    const tb = (2 * v) / g;
    if (tt < tb) {
      const y = -(v * tt - 0.5 * g * tt * tt);
      return { y, squash: tt < 0.06 ? 1 - tt / 0.06 : 0, landed: true };
    }
    tt -= tb;
    v *= 0.35;
  }
  return { y: 0, squash: tt < 0.08 ? 1 - tt / 0.08 : 0, landed: true };
};

export const shake = (frame: number, at: number, amount = 18, dur = 10) => {
  const t = frame - at;
  if (t < 0 || t > dur) return { x: 0, y: 0 };
  const k = 1 - t / dur;
  return { x: Math.sin(t * 2.7) * amount * k, y: Math.cos(t * 3.3) * amount * k };
};

// ---------- camera: smooth move inside a scene ----------
export const Camera: React.FC<{
  from: number;
  to: number;
  zoom: [number, number];
  pan?: [number, number]; // x px start -> end
  panY?: [number, number];
  shakeAt?: number[];
  children: React.ReactNode;
}> = ({ from, to, zoom, pan = [0, 0], panY = [0, 0], shakeAt = [], children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const s = zoom[0] + (zoom[1] - zoom[0]) * t;
  const x = pan[0] + (pan[1] - pan[0]) * t;
  const y = panY[0] + (panY[1] - panY[0]) * t;
  const sh = shakeAt.reduce(
    (acc, f) => {
      const v = shake(frame, f);
      return { x: acc.x + v.x, y: acc.y + v.y };
    },
    { x: 0, y: 0 },
  );
  return (
    <AbsoluteFill style={{ transform: `translate(${x + sh.x}px, ${y + sh.y}px) scale(${s})`, transformOrigin: "50% 60%" }}>
      {children}
    </AbsoluteFill>
  );
};

// ---------- text chip (Roman capitals, Poppins 800, thick dark outline) ----------
export const Chip: React.FC<{
  text: string;
  at: number;
  until?: number;
  x?: number; // centre x
  y: number; // centre y
  size?: number;
  color?: string;
  bg?: string;
  rotate?: number;
  slam?: boolean;
  from?: number; // starting scale override (e.g. 1.12 for a title that must be readable on frame 0)
}> = ({ text, at, until = 99999, x = 500, y, size = 84, color = "#FFE14D", bg, rotate = -2, slam, from }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  const p = popSpring(frame, at, FPS, slam ? 13 : 10);
  const outT = interpolate(frame, [until - 5, until], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const startScale = from ?? (slam ? 1.7 : 0.2);
  const scale = (startScale + (1 - startScale) * p) * (1 + Math.sin((frame - at) / 9) * 0.015);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotate + Math.sin((frame - at) / 14) * 0.8}deg) scale(${scale * outT})`,
        fontFamily: FONT_FAMILY,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.05,
        color,
        whiteSpace: "nowrap",
        textAlign: "center",
        WebkitTextStroke: `${Math.round(size * 0.16)}px ${INK}`,
        paintOrder: "stroke fill",
        textShadow: `0 ${Math.round(size * 0.1)}px 0 ${INK}`,
        padding: bg ? "10px 34px 14px" : 0,
        background: bg,
        borderRadius: 26,
        border: bg ? `8px solid ${INK}` : undefined,
        boxShadow: bg ? `0 10px 0 ${INK}` : undefined,
      }}
    >
      {text}
    </div>
  );
};

// ---------- overlays ----------
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(10,5,25,0.55) 100%)", pointerEvents: "none" }}
  />
);

export const SoftLight: React.FC<{ x?: string; y?: string; color?: string }> = ({ x = "30%", y = "15%", color = "rgba(255,240,200,0.35)" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at ${x} ${y}, ${color}, transparent 60%)`, mixBlendMode: "screen" }} />
);

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width={W} height={H}>
        <filter id={`grain${frame % 6}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 6} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter={`url(#grain${frame % 6})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Dust puff on impact: particles thrown sideways and up, slowing and fading. */
export const Dust: React.FC<{ at: number; x: number; y: number; color?: string; count?: number; spread?: number }> = ({
  at,
  x,
  y,
  color = "#d8c7a8",
  count = 10,
  spread = 1,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 24) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      {Array.from({ length: count }).map((_, i) => {
        const dir = (i % 2 ? 1 : -1) * (0.4 + random(`d${at}${i}`) * 0.9);
        const up = 0.2 + random(`u${at}${i}`) * 0.6;
        const k = 1 - Math.exp(-t / 6);
        const px = x + dir * 170 * spread * k;
        const py = y - up * 80 * spread * k + t * 0.6;
        const r = (14 + random(`r${at}${i}`) * 18) * (0.6 + k);
        return <circle key={i} cx={px} cy={py} r={r} fill={color} opacity={0.75 * (1 - t / 24)} />;
      })}
    </svg>
  );
};

/** Sparkle stars around a point. */
export const Sparkles: React.FC<{ at: number; x: number; y: number; r?: number }> = ({ at, x, y, r = 120 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 22) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2 + 0.3;
        const d = r * (0.5 + t / 30);
        const s = Math.sin((t / 22) * Math.PI) * (14 + (i % 3) * 6);
        const cx = x + Math.cos(a) * d;
        const cy = y + Math.sin(a) * d;
        return (
          <path
            key={i}
            d={`M${cx} ${cy - s} L${cx + s * 0.3} ${cy - s * 0.3} L${cx + s} ${cy} L${cx + s * 0.3} ${cy + s * 0.3} L${cx} ${cy + s} L${cx - s * 0.3} ${cy + s * 0.3} L${cx - s} ${cy} L${cx - s * 0.3} ${cy - s * 0.3}Z`}
            fill="#FFF3A0"
            stroke={INK}
            strokeWidth={3}
          />
        );
      })}
    </svg>
  );
};
