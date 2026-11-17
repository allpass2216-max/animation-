// Big chunky cartoon character: big head, thick outlines, always breathing / blinking / swaying.
// Poses and expressions change on cue frames (from words.json) with a springy blend.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { INK } from "./reel";

export type PoseName =
  | "idle"
  | "hold"
  | "panic"
  | "point"
  | "think"
  | "shrug"
  | "cheer"
  | "wave"
  | "present"
  | "scratch"
  | "tap";
export type Expr = "smile" | "grin" | "wow" | "worried" | "shock" | "think" | "sly";

// [leftShoulder, leftElbow, rightShoulder, rightElbow] in degrees; 0 = arm hanging down, + = outward/up.
const POSES: Record<PoseName, [number, number, number, number]> = {
  idle: [14, -10, 14, -10],
  hold: [12, -8, -12, -78],
  panic: [150, 52, 150, 52],
  point: [14, -10, 112, -4],
  think: [16, -12, -62, 232],
  shrug: [62, 62, 62, 62],
  cheer: [158, 14, 158, 14],
  wave: [14, -10, 138, 34],
  present: [14, -10, 78, 18],
  scratch: [24, -40, 168, 62],
  tap: [14, -10, 56, -6],
};

export type Cue<T> = { f: number; v: T };

const pick = <T,>(cues: Cue<T>[], frame: number) => {
  let cur = cues[0];
  let prev = cues[0];
  for (const c of cues) {
    if (c.f <= frame) {
      prev = cur;
      cur = c;
    }
  }
  return { cur, prev };
};

export const Character: React.FC<{
  x: number; // feet centre, screen px
  y: number;
  scale?: number;
  flip?: boolean;
  poses: Cue<PoseName>[];
  exprs: Cue<Expr>[];
  look?: Cue<number>[]; // pupil x offset -1..1
  hops?: number[]; // frames where he does a small jump
  money?: Cue<boolean>[];
  skin?: string;
  shirt?: string;
  pants?: string;
  hair?: string;
  seed?: number;
}> = ({
  x,
  y,
  scale = 1,
  flip,
  poses,
  exprs,
  look = [{ f: 0, v: 0 }],
  hops = [],
  money = [{ f: 0, v: false }],
  skin = "#C98B5E",
  shirt = "#FF7A3D",
  pants = "#2B3A67",
  hair = "#1d1420",
  seed = 0,
}) => {
  const frame = useCurrentFrame();

  // pose blend
  const { cur, prev } = pick(poses, frame);
  const bt = interpolate(frame - cur.f, [0, 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });
  const a = POSES[prev.v].map((p, i) => p + (POSES[cur.v][i] - p) * bt);
  if (cur.v === "wave") a[3] += Math.sin((frame - cur.f) / 3) * 26;
  if (cur.v === "panic") {
    a[1] += Math.sin(frame / 2.2) * 6;
    a[3] -= Math.sin(frame / 2.2) * 6;
  }
  if (cur.v === "scratch") a[3] += Math.sin(frame / 2) * 10;

  const expr = pick(exprs, frame).cur.v;
  const lookX = pick(look, frame).cur.v;
  const hasMoney = pick(money, frame).cur.v;

  // idle life
  const breathe = Math.sin((frame + seed * 13) / 14);
  const sway = Math.sin((frame + seed * 7) / 26) * 1.6;
  const blinkPhase = (frame + 40 + seed * 31) % 96; // never blinking on frame 0
  const blink = blinkPhase < 4 ? 1 - Math.abs(blinkPhase - 2) / 2 : 0;

  // hop with squash & stretch
  let hopY = 0;
  let squash = 0;
  for (const h of hops) {
    const t = frame - h;
    if (t >= 0 && t < 4) squash = Math.max(squash, Math.sin((t / 4) * Math.PI) * 0.6); // anticipation squash
    if (t >= 4 && t < 16) hopY = Math.min(hopY, -Math.sin(((t - 4) / 12) * Math.PI) * 70);
    if (t >= 16 && t < 21) squash = Math.max(squash, Math.sin(((t - 16) / 5) * Math.PI) * 0.8); // landing squash
  }
  const sy = 1 - squash * 0.12 + (hopY < -20 ? 0.04 : 0);
  const sx = 1 + squash * 0.1 - (hopY < -20 ? 0.03 : 0);

  const arm = (side: -1 | 1, sh: number, el: number) => {
    const sxp = side * 112;
    const syp = -478;
    const r1 = (sh * Math.PI) / 180;
    const r2 = ((sh + el) * Math.PI) / 180;
    const ex = sxp + side * Math.sin(r1) * 120;
    const ey = syp + Math.cos(r1) * 120;
    const hx = ex + side * Math.sin(r2) * 118;
    const hy = ey + Math.cos(r2) * 118;
    return { d: `M${sxp} ${syp} L${ex} ${ey} L${hx} ${hy}`, hx, hy };
  };
  const L = arm(-1, a[0], a[1]);
  const R = arm(1, a[2], a[3]);

  const eyeOpen = expr === "wow" || expr === "shock" ? 1.25 : 1;
  const eyeRy = 44 * eyeOpen * (1 - blink * 0.92);
  const pupilX = lookX * 12;
  const happyEyes = expr === "grin" || expr === "sly";

  const mouth = (() => {
    switch (expr) {
      case "grin":
        return <path d="M-62 -612 Q0 -540 62 -612 Z" fill="#7a1f2b" stroke={INK} strokeWidth={9} strokeLinejoin="round" />;
      case "wow":
        return <ellipse cx={0} cy={-600} rx={26} ry={34 + Math.sin(frame / 3) * 3} fill="#7a1f2b" stroke={INK} strokeWidth={9} />;
      case "shock":
        return <path d="M-40 -580 Q0 -660 40 -580 Q0 -560 -40 -580Z" fill="#7a1f2b" stroke={INK} strokeWidth={9} />;
      case "worried":
        return <path d="M-46 -596 Q-23 -616 0 -598 Q23 -580 46 -600" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />;
      case "think":
        return <path d="M-30 -600 L34 -608" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />;
      case "sly":
        return <path d="M-40 -606 Q10 -580 48 -616" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />;
      default:
        return <path d="M-48 -612 Q0 -566 48 -612" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />;
    }
  })();
  const browY = expr === "worried" || expr === "shock" ? -6 : expr === "wow" ? -16 : 0;
  const browTilt = expr === "worried" ? 14 : expr === "think" || expr === "sly" ? -8 : 0;

  const Money = ({ hx, hy }: { hx: number; hy: number }) => (
    <g transform={`translate(${hx} ${hy - 10}) rotate(-12)`}>
      <rect x={-70} y={-44} width={140} height={84} rx={10} fill="#7ccf7a" stroke={INK} strokeWidth={8} />
      <rect x={-70} y={-30} width={140} height={84} rx={10} fill="#8fe08c" stroke={INK} strokeWidth={8} />
      <rect x={-14} y={-30} width={28} height={84} fill="#f6d55c" stroke={INK} strokeWidth={6} />
      <circle cx={-42} cy={12} r={12} fill="none" stroke="#3f8f3d" strokeWidth={5} />
    </g>
  );

  return (
    <svg
      style={{ position: "absolute", left: x - 300 * scale, top: y - 980 * scale, overflow: "visible" }}
      width={600 * scale}
      height={1000 * scale}
      viewBox="-300 -980 600 1000"
    >
      <g transform={`translate(0 ${hopY}) ${flip ? "scale(-1 1)" : ""} rotate(${sway}) scale(${sx} ${sy})`}>
        {/* shadow */}
        <ellipse cx={0} cy={6 - hopY} rx={170 + hopY * 0.6} ry={26} fill="rgba(0,0,0,0.25)" />
        {/* legs */}
        <path d="M-58 -250 L-66 -40" stroke={INK} strokeWidth={84} strokeLinecap="round" />
        <path d="M58 -250 L66 -40" stroke={INK} strokeWidth={84} strokeLinecap="round" />
        <path d="M-58 -250 L-66 -40" stroke={pants} strokeWidth={66} strokeLinecap="round" />
        <path d="M58 -250 L66 -40" stroke={pants} strokeWidth={66} strokeLinecap="round" />
        <ellipse cx={-80} cy={-16} rx={66} ry={34} fill="#3a2a2a" stroke={INK} strokeWidth={9} />
        <ellipse cx={80} cy={-16} rx={66} ry={34} fill="#3a2a2a" stroke={INK} strokeWidth={9} />
        {/* torso (breathes) */}
        <g transform={`translate(0 -250) scale(${1 + breathe * 0.012} ${1 + breathe * 0.025}) translate(0 250)`}>
          <path
            d="M-150 -470 Q-160 -520 -100 -530 L100 -530 Q160 -520 150 -470 L140 -260 Q140 -220 100 -220 L-100 -220 Q-140 -220 -140 -260 Z"
            fill={shirt}
            stroke={INK}
            strokeWidth={10}
          />
          <path d="M-40 -530 L0 -470 L40 -530" fill="#fff3e0" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
          <path d="M0 -470 L0 -240" stroke={INK} strokeWidth={5} opacity={0.35} />
        </g>
        {/* left arm (behind props) */}
        <path d={L.d} fill="none" stroke={INK} strokeWidth={60} strokeLinecap="round" strokeLinejoin="round" />
        <path d={L.d} fill="none" stroke={shirt} strokeWidth={44} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={L.hx} cy={L.hy} r={31} fill={skin} stroke={INK} strokeWidth={9} />
        {/* head (bobs with breath) */}
        <g transform={`translate(0 ${breathe * 4})`}>
          <rect x={-40} y={-560} width={80} height={60} fill={skin} stroke={INK} strokeWidth={9} />
          <circle cx={-172} cy={-690} r={36} fill={skin} stroke={INK} strokeWidth={9} />
          <circle cx={172} cy={-690} r={36} fill={skin} stroke={INK} strokeWidth={9} />
          <circle cx={0} cy={-700} r={175} fill={skin} stroke={INK} strokeWidth={11} />
          {/* hair */}
          <path
            d="M-176 -700 Q-190 -860 -40 -880 Q60 -930 150 -840 Q200 -790 178 -700 Q150 -770 90 -790 Q20 -760 -40 -800 Q-110 -770 -140 -720 Z"
            fill={hair}
            stroke={INK}
            strokeWidth={10}
            strokeLinejoin="round"
          />
          <path d="M-20 -880 Q-10 -930 30 -925" fill="none" stroke={hair} strokeWidth={16} strokeLinecap="round" />
          {/* brows */}
          <g transform={`translate(0 ${browY})`}>
            <path d={`M-100 ${-782 + browTilt} L-30 ${-790 - browTilt * 0.4}`} stroke={INK} strokeWidth={14} strokeLinecap="round" />
            <path d={`M30 ${-790 - browTilt * 0.4} L100 ${-782 + browTilt}`} stroke={INK} strokeWidth={14} strokeLinecap="round" />
          </g>
          {/* eyes */}
          {happyEyes ? (
            <>
              <path d="M-96 -712 Q-64 -752 -32 -712" fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />
              <path d="M32 -712 Q64 -752 96 -712" fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx={-64} cy={-718} rx={36} ry={eyeRy} fill="#fff" stroke={INK} strokeWidth={8} />
              <ellipse cx={64} cy={-718} rx={36} ry={eyeRy} fill="#fff" stroke={INK} strokeWidth={8} />
              {blink < 0.6 && (
                <>
                  <circle cx={-60 + pupilX} cy={-712} r={expr === "shock" ? 12 : 17} fill={INK} />
                  <circle cx={68 + pupilX} cy={-712} r={expr === "shock" ? 12 : 17} fill={INK} />
                  <circle cx={-54 + pupilX} cy={-720} r={5} fill="#fff" />
                  <circle cx={74 + pupilX} cy={-720} r={5} fill="#fff" />
                </>
              )}
            </>
          )}
          {/* nose, cheeks, mouth */}
          <path d="M-8 -676 Q12 -650 -6 -640" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
          <ellipse cx={-110} cy={-640} rx={26} ry={14} fill="#e9716b" opacity={0.45} />
          <ellipse cx={110} cy={-640} rx={26} ry={14} fill="#e9716b" opacity={0.45} />
          {mouth}
          {(expr === "shock" || expr === "worried") && (
            <path
              d={`M150 -780 q12 ${24 + Math.sin(frame / 4) * 4} 0 34 q-12 -10 0 -34`}
              fill="#8fd3ff"
              stroke={INK}
              strokeWidth={6}
            />
          )}
        </g>
        {/* right arm in front */}
        <path d={R.d} fill="none" stroke={INK} strokeWidth={60} strokeLinecap="round" strokeLinejoin="round" />
        <path d={R.d} fill="none" stroke={shirt} strokeWidth={44} strokeLinecap="round" strokeLinejoin="round" />
        {hasMoney && <Money hx={R.hx} hy={R.hy} />}
        <circle cx={R.hx} cy={R.hy} r={31} fill={skin} stroke={INK} strokeWidth={9} />
      </g>
    </svg>
  );
};

/** Small background person (crowd, queue): chunky, outlined, bobbing. */
export const Extra: React.FC<{
  x: number;
  y: number;
  s?: number;
  shirt: string;
  skin?: string;
  seed: number;
  paper?: boolean;
  bag?: string;
  walk?: number; // walking speed px/frame (0 = standing)
  t0?: number; // frame the walk starts from (scene start)
  flip?: boolean;
  hopAt?: number[];
}> = ({ x, y, s = 1, shirt, skin = "#B97A50", seed, paper, bag, walk = 0, t0 = 0, flip, hopAt = [] }) => {
  const frame = useCurrentFrame();
  const bob = walk ? Math.abs(Math.sin((frame + seed * 5) / 4)) * -10 : Math.sin((frame + seed * 9) / 15) * 3;
  let hop = 0;
  for (const h of hopAt) {
    const t = frame - h;
    if (t >= 0 && t < 10) hop = Math.min(hop, -Math.sin((t / 10) * Math.PI) * 40);
  }
  const span = 1500; // walkers wrap around so they stay in view
  const px = walk ? ((((x + 250 + walk * (frame - t0)) % span) + span) % span) - 250 : x;
  const legSwing = walk ? Math.sin((frame + seed * 5) / 4) * 14 : 0;
  return (
    <g transform={`translate(${px} ${y + bob + hop}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={4 - bob - hop} rx={60} ry={12} fill="rgba(0,0,0,0.2)" />
      <path d={`M-20 -90 L${-24 - legSwing} 0 M20 -90 L${24 + legSwing} 0`} stroke={INK} strokeWidth={30} strokeLinecap="round" />
      <path d={`M-20 -90 L${-24 - legSwing} 0 M20 -90 L${24 + legSwing} 0`} stroke="#384057" strokeWidth={18} strokeLinecap="round" />
      <rect x={-52} y={-200} width={104} height={120} rx={30} fill={shirt} stroke={INK} strokeWidth={7} />
      <circle cx={0} cy={-250} r={58} fill={skin} stroke={INK} strokeWidth={7} />
      <path d="M-58 -260 Q-50 -320 0 -314 Q50 -320 58 -260 Q30 -290 0 -284 Q-30 -290 -58 -260Z" fill="#20161c" stroke={INK} strokeWidth={5} />
      <circle cx={-20} cy={-252} r={7} fill={INK} />
      <circle cx={20} cy={-252} r={7} fill={INK} />
      <path d="M-16 -226 Q0 -214 16 -226" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      {paper && (
        <g transform={`translate(54 -150) rotate(${Math.sin((frame + seed * 3) / 5) * 8})`}>
          <rect x={-22} y={-40} width={52} height={66} fill="#fff" stroke={INK} strokeWidth={5} />
          <path d="M-12 -24 L20 -24 M-12 -10 L20 -10 M-12 4 L12 4" stroke="#8a8aa0" strokeWidth={4} />
        </g>
      )}
      {bag && (
        <g transform="translate(62 -110)">
          <path d="M-18 -30 Q0 -60 18 -30" fill="none" stroke={INK} strokeWidth={5} />
          <rect x={-30} y={-30} width={60} height={64} rx={6} fill={bag} stroke={INK} strokeWidth={6} />
        </g>
      )}
    </g>
  );
};
