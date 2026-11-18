// Japanese TV anime ("cel") style character: thin dark outlines, two-tone cel shading with hard shadow edges,
// big shiny eyes, spiky hair with a highlight band. Same props as Character (drop-in via <CharStyle value="anime">),
// same coordinates: feet at (x, y), head centre ~700 px above the feet at scale 1.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { Cue, Expr, PoseName } from "./Character";

const LINE = "#2a1d24";
const LW = 5;

const POSES: Record<PoseName, [number, number, number, number]> = {
  idle: [10, -8, 10, -8],
  hold: [10, -8, -12, -80],
  panic: [150, 50, 150, 50],
  point: [10, -8, 108, -4],
  think: [14, -10, -60, 230],
  shrug: [62, 62, 62, 62],
  cheer: [158, 14, 158, 14],
  wave: [10, -8, 138, 34],
  present: [10, -8, 80, 18],
  scratch: [22, -40, 168, 62],
  tap: [10, -8, 56, -6],
};

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

/** Darker cel-shadow tone of a hex colour. */
const shade = (hex: string, k = 0.78) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const c = (v: number) => Math.round(v * k);
  return `rgb(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)})`;
};
/** Lighter tint (hair highlight). */
const tint = (hex: string, k = 0.45) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const c = (v: number) => Math.round(v + (255 - v) * k);
  return `rgb(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)})`;
};

export type AnimeProps = {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  poses: Cue<PoseName>[];
  exprs: Cue<Expr>[];
  look?: Cue<number>[];
  hops?: number[];
  holding?: Cue<string>[];
  shades?: Cue<boolean>[];
  sweat?: Cue<boolean>[];
  chain?: boolean;
  tie?: string;
  glasses?: boolean;
  turn?: number;
  skin?: string;
  shirt?: string;
  pants?: string;
  hair?: string;
  iris?: string;
  seed?: number;
};

export const AnimeCharacter: React.FC<AnimeProps> = ({
  x,
  y,
  scale = 1,
  flip,
  poses,
  exprs,
  look = [{ f: 0, v: 0 }],
  hops = [],
  holding = [{ f: 0, v: "none" }],
  shades = [{ f: 0, v: false }],
  sweat = [{ f: 0, v: false }],
  chain = false,
  tie,
  glasses = false,
  turn = 0,
  skin = "#f6d3b3",
  shirt = "#ffffff",
  pants = "#2b3a67",
  hair = "#1d1420",
  iris = "#5b3a29",
  seed = 0,
}) => {
  const frame = useCurrentFrame();

  // pose blend
  const { cur, prev } = pick(poses, frame);
  const bt = interpolate(frame - cur.f, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) });
  const a = POSES[prev.v].map((p, i) => p + (POSES[cur.v][i] - p) * bt);
  if (cur.v === "wave") a[3] += Math.sin((frame - cur.f) / 3) * 26;
  if (cur.v === "panic") {
    a[1] += Math.sin(frame / 2.2) * 6;
    a[3] -= Math.sin(frame / 2.2) * 6;
  }

  const expr = pick(exprs, frame).cur.v;
  const lookX = pick(look, frame).cur.v;
  const held = pick(holding, frame).cur.v;
  const shadesOn = shades[0].f <= frame && pick(shades, frame).cur.v;
  const sweating = (sweat[0].f <= frame && pick(sweat, frame).cur.v) || expr === "shock" || expr === "worried";

  // life
  const breathe = Math.sin((frame + seed * 13) / 14);
  const sway = Math.sin((frame + seed * 7) / 26) * 1.2;
  const blinkPhase = (frame + 40 + seed * 31) % 96;
  const blink = blinkPhase < 4;
  let hopY = 0;
  let squash = 0;
  for (const h of hops) {
    const t = frame - h;
    if (t >= 0 && t < 4) squash = Math.max(squash, Math.sin((t / 4) * Math.PI) * 0.5);
    if (t >= 4 && t < 16) hopY = Math.min(hopY, -Math.sin(((t - 4) / 12) * Math.PI) * 70);
    if (t >= 16 && t < 21) squash = Math.max(squash, Math.sin(((t - 16) / 5) * Math.PI) * 0.7);
  }
  const sy = 1 - squash * 0.1;
  const sx = 1 + squash * 0.08;

  const skinS = shade(skin, 0.82);
  const shirtS = shade(shirt, 0.8);
  const pantsS = shade(pants, 0.72);
  const hairS = shade(hair, 0.6);
  const n = parseInt(hair.replace("#", ""), 16);
  const darkHair = ((n >> 16) & 255) + ((n >> 8) & 255) + (n & 255) < 150;
  const hairHi = darkHair ? "#5a6ea8" : tint(hair, 0.5);

  const arm = (side: -1 | 1, sh: number, el: number) => {
    const sxp = side * 105;
    const syp = -470;
    const r1 = (sh * Math.PI) / 180;
    const r2 = ((sh + el) * Math.PI) / 180;
    const ex = sxp + side * Math.sin(r1) * 125;
    const ey = syp + Math.cos(r1) * 125;
    const hx = ex + side * Math.sin(r2) * 120;
    const hy = ey + Math.cos(r2) * 120;
    return { d: `M${sxp} ${syp} L${ex} ${ey} L${hx} ${hy}`, hx, hy };
  };
  const L = arm(-1, a[0], a[1]);
  const R = arm(1, a[2], a[3]);
  const Arm = ({ d, hx, hy, back }: { d: string; hx: number; hy: number; back?: boolean }) => (
    <g>
      <path d={d} fill="none" stroke={LINE} strokeWidth={46 + LW * 2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={back ? shirtS : shirt} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={hx} cy={hy} r={27} fill={skin} stroke={LINE} strokeWidth={LW} />
      <path d={`M${hx - 4} ${hy - 26} A27 27 0 0 1 ${hx + 22} ${hy + 14} Z`} fill={skinS} />
    </g>
  );

  // ----- face (head centre 0,-700; local face box ~ 340 wide) -----
  const fx = turn * 50; // features shift towards the turned side
  const fsx = 1 - turn * 0.16;
  const surprised = expr === "shock" || expr === "wow";
  const happy = expr === "grin" || expr === "sly";
  const irisRx = surprised ? 22 : 30;
  const irisRy = surprised ? 28 : 40;
  const px = lookX * 8;
  const browTilt = { angry: -22, worried: 16, sad: 16, cry: 16, think: -8, sly: -10, shock: 4, wow: 2 }[expr as string] ?? 0;
  const browY = { angry: 10, shock: -18, wow: -20, worried: -6 }[expr as string] ?? 0;

  const Eye = ({ cx }: { cx: number }) => {
    if (happy || blink) {
      return <path d={`M${cx - 44} -716 Q${cx} ${happy ? -752 : -712} ${cx + 44} -716`} fill="none" stroke={LINE} strokeWidth={9} strokeLinecap="round" />;
    }
    return (
      <g>
        <path d={`M${cx - 48} -712 Q${cx} ${surprised ? -790 : -770} ${cx + 48} -712 Q${cx} ${surprised ? -630 : -646} ${cx - 48} -712 Z`} fill="#fff" stroke={LINE} strokeWidth={3} />
        <ellipse cx={cx + px} cy={-706} rx={irisRx} ry={irisRy} fill={iris} stroke={LINE} strokeWidth={3} />
        <path d={`M${cx + px - irisRx} -700 Q${cx + px} ${-706 + irisRy + 4} ${cx + px + irisRx} -700 Q${cx + px} -682 ${cx + px - irisRx} -700Z`} fill={tint(iris, 0.45)} />
        <ellipse cx={cx + px} cy={-706} rx={irisRx * 0.45} ry={irisRy * 0.45} fill="#140c10" />
        <ellipse cx={cx + px - 10} cy={-724} rx={9} ry={12} fill="#fff" />
        <circle cx={cx + px + 10} cy={-690} r={4.5} fill="#fff" />
        <path d={`M${cx - 54} ${surprised ? -722 : -716} Q${cx} ${surprised ? -800 : -778} ${cx + 54} ${surprised ? -726 : -720}`} fill="none" stroke={LINE} strokeWidth={10} strokeLinecap="round" />
      </g>
    );
  };

  const mouth = (() => {
    const c = "#7a2b36";
    switch (expr) {
      case "grin":
        return <path d="M-34 -618 Q0 -580 34 -618 Z" fill={c} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />;
      case "wow":
        return <ellipse cx={0} cy={-610} rx={13} ry={18} fill={c} stroke={LINE} strokeWidth={3} />;
      case "shock":
        return <path d="M-26 -606 Q0 -652 26 -606 Q0 -590 -26 -606Z" fill={c} stroke={LINE} strokeWidth={3} />;
      case "angry":
        return <path d="M-30 -604 L30 -604 L22 -620 L-22 -620 Z" fill="#fff" stroke={LINE} strokeWidth={3} />;
      case "worried":
        return <path d="M-24 -610 Q-10 -620 0 -610 Q12 -600 24 -612" fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" />;
      case "sad":
      case "cry":
        return <path d="M-22 -604 Q0 -622 22 -604" fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" />;
      case "think":
        return <path d="M-14 -610 L18 -614" fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" />;
      case "sly":
        return <path d="M-22 -614 Q6 -602 28 -622" fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" />;
      default:
        return <path d="M-24 -616 Q0 -600 24 -616" fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" />;
    }
  })();

  return (
    <svg
      style={{ position: "absolute", left: x - 300 * scale, top: y - 980 * scale, overflow: "visible" }}
      width={600 * scale}
      height={1000 * scale}
      viewBox="-300 -980 600 1000"
    >
      <g transform={`translate(0 ${hopY}) ${flip ? "scale(-1 1)" : ""} rotate(${sway}) scale(${sx} ${sy})`}>
        {/* ground shadow */}
        <ellipse cx={0} cy={4 - hopY} rx={150 + hopY * 0.5} ry={22} fill="rgba(0,0,0,0.25)" />
        {/* legs: trousers two-tone + shoes */}
        <path d="M-95 -260 L95 -260 L88 -26 L18 -26 L0 -200 L-18 -26 L-88 -26 Z" fill={pants} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M30 -260 L95 -260 L88 -26 L50 -26 Z" fill={pantsS} />
        <path d="M-98 -32 L-10 -32 Q4 4 -30 6 L-104 6 Q-118 -14 -98 -32Z" fill="#3b2a24" stroke={LINE} strokeWidth={LW} />
        <path d="M10 -32 L98 -32 Q118 -14 104 6 L30 6 Q-4 4 10 -32Z" fill="#3b2a24" stroke={LINE} strokeWidth={LW} />
        {/* back arm */}
        <Arm {...L} back />
        {/* torso (breathes): shirt with a hard cel shadow */}
        <g transform={`translate(0 -260) scale(${1 + breathe * 0.01} ${1 + breathe * 0.02}) translate(0 260)`}>
          <path d="M-120 -500 Q0 -540 120 -500 L112 -256 L-112 -256 Z" fill={shirt} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
          <path d="M40 -526 Q90 -514 120 -500 L112 -256 L50 -256 Z" fill={shirtS} />
          <path d="M-36 -528 L0 -484 L36 -528" fill="none" stroke={LINE} strokeWidth={4} />
          {tie && (
            <g>
              <path d="M-12 -486 L12 -486 L20 -330 L0 -306 L-20 -330 Z" fill={tie} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
              <path d="M0 -486 L12 -486 L20 -330 L0 -306 Z" fill={shade(tie, 0.72)} />
            </g>
          )}
          {chain && (
            <g>
              <path d="M-56 -520 Q0 -420 56 -520" fill="none" stroke="#b08a1e" strokeWidth={12} />
              <path d="M-56 -520 Q0 -420 56 -520" fill="none" stroke="#ffd43b" strokeWidth={7} strokeDasharray="8 5" />
              <circle cx={0} cy={-452 + Math.sin(frame / 6) * 2} r={20} fill="#ffd43b" stroke={LINE} strokeWidth={3} />
              <path d={`M-6 ${-460 + Math.sin(frame / 6) * 2} A10 10 0 0 1 10 ${-448 + Math.sin(frame / 6) * 2}`} fill="none" stroke="#fff" strokeWidth={4} />
            </g>
          )}
        </g>
        {/* neck */}
        <path d="M-30 -560 L30 -560 L32 -506 Q0 -490 -32 -506 Z" fill={skin} stroke={LINE} strokeWidth={LW} />
        <path d="M-30 -560 L30 -560 L31 -528 Q0 -516 -30 -534 Z" fill={skinS} />

        {/* head (bobs with breath) */}
        <g transform={`translate(0 ${breathe * 3})`}>
          {/* ears */}
          {turn < 0.6 && <path d="M-160 -720 Q-196 -712 -188 -672 Q-180 -640 -150 -648" fill={skin} stroke={LINE} strokeWidth={LW} />}
          <path d={`M${160 - turn * 30} -720 Q${196 - turn * 30} -712 ${188 - turn * 30} -672 Q${180 - turn * 30} -640 ${150 - turn * 30} -648`} fill={skinS} stroke={LINE} strokeWidth={LW} />
          {/* face: anime shape with a pointed chin, two-tone */}
          <path
            d={`M-165 -730 Q-165 -880 0 -888 Q165 -880 165 -730 Q165 -620 ${80 + fx * 0.6} -560 Q${30 + fx} -524 ${fx * 0.8} -520 Q${-40 + fx * 0.6} -524 -88 -560 Q-165 -620 -165 -730 Z`}
            fill={skin}
            stroke={LINE}
            strokeWidth={LW}
          />
          <path d={turn > 0 ? "M-165 -730 Q-160 -840 -110 -868 Q-140 -720 -60 -548 Q-150 -600 -165 -730Z" : "M100 -846 Q165 -800 165 -730 Q165 -620 80 -560 Q40 -532 20 -526 Q120 -650 100 -846Z"} fill={skinS} />

          {/* features (shift for the three-quarter turn) */}
          <g transform={`translate(${fx} 0) translate(0 -700) scale(${fsx} 1) translate(0 700)`}>
            {/* brows */}
            <g transform={`translate(0 ${browY})`}>
              <path d={`M-104 ${-782 + browTilt * 0.6} Q-70 ${-796 - browTilt * 0.2} -32 ${-786 - browTilt * 0.6}`} fill="none" stroke={hairS} strokeWidth={8} strokeLinecap="round" />
              <path d={`M32 ${-786 - browTilt * 0.6} Q70 ${-796 - browTilt * 0.2} 104 ${-782 + browTilt * 0.6}`} fill="none" stroke={hairS} strokeWidth={8} strokeLinecap="round" />
            </g>
            <Eye cx={-68} />
            <Eye cx={68} />
            {glasses && !shadesOn && (
              <g fill="none" stroke={LINE} strokeWidth={4} opacity={0.9}>
                <rect x={-126} y={-760} width={112} height={92} rx={24} />
                <rect x={14} y={-760} width={112} height={92} rx={24} />
                <path d="M-14 -722 L14 -722" />
              </g>
            )}
            {shadesOn && (
              <g>
                <path d="M-140 -746 L140 -746" stroke={LINE} strokeWidth={8} />
                <path d="M-130 -752 L-14 -752 L-24 -684 Q-70 -664 -120 -690 Z" fill="#1f1a22" stroke={LINE} strokeWidth={4} />
                <path d="M14 -752 L130 -752 L120 -690 Q70 -664 24 -684 Z" fill="#1f1a22" stroke={LINE} strokeWidth={4} />
                <path d="M-110 -742 L-70 -742 M34 -742 L74 -742" stroke="#8a93b0" strokeWidth={6} strokeLinecap="round" />
              </g>
            )}
            {/* nose, blush lines, mouth */}
            <path d="M4 -668 L-6 -646" stroke={skinS} strokeWidth={5} strokeLinecap="round" />
            {[0, 1, 2].map((i) => (
              <path key={`l${i}`} d={`M${-118 + i * 13} -650 L${-126 + i * 13} -636`} stroke="#ff7b8a" strokeWidth={4} strokeLinecap="round" opacity={expr === "angry" ? 1 : 0.7} />
            ))}
            {[0, 1, 2].map((i) => (
              <path key={`r${i}`} d={`M${92 + i * 13} -650 L${84 + i * 13} -636`} stroke="#ff7b8a" strokeWidth={4} strokeLinecap="round" opacity={expr === "angry" ? 1 : 0.7} />
            ))}
            {mouth}
            {expr === "cry" &&
              [-68, 68].map((tx, i) => {
                const tt = ((frame + i * 11) % 24) / 24;
                return <path key={tx} d={`M${tx} ${-670 + tt * 90} q8 16 0 22 q-8 -6 0 -22`} fill="#a5d8ff" stroke={LINE} strokeWidth={2} opacity={1 - tt * 0.6} />;
              })}
          </g>

          {/* spiky hair: base, hard shadow tone, highlight band */}
          <path
            d="M-188 -680 L-208 -800 L-160 -786 L-170 -880 L-104 -846 L-88 -940 L-30 -872 L20 -968 L64 -878 L136 -946 L142 -852 L214 -880 L192 -786 L236 -796 L196 -680 Q186 -770 130 -800 L96 -742 L66 -806 L20 -748 L-16 -806 L-62 -740 L-92 -800 L-150 -722 Q-176 -742 -188 -680 Z"
            fill={hair}
            stroke={LINE}
            strokeWidth={LW}
            strokeLinejoin="round"
          />
          <path d="M100 -840 L136 -946 L142 -852 L214 -880 L192 -786 L236 -796 L196 -680 Q186 -770 130 -800 L96 -742 Z" fill={hairS} />
          <path d="M-130 -850 Q-20 -900 110 -884 Q-10 -886 -122 -836 Z" fill={hairHi} opacity={0.85} />
          <path d="M-90 -868 Q-50 -884 -10 -886" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.8} />

          {/* sweat drop + anger mark */}
          {sweating && (
            <g transform={`translate(${150 - turn * 20} ${-800 + ((frame % 24) / 24) * 26})`}>
              <path d="M0 0 Q26 44 0 62 Q-26 44 0 0Z" fill="#a5d8ff" stroke={LINE} strokeWidth={3} />
              <path d="M-6 26 Q-10 40 -2 50" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
            </g>
          )}
          {expr === "angry" && (
            <g transform="translate(120 -860)" stroke="#e03131" strokeWidth={8} strokeLinecap="round" fill="none">
              <path d="M-20 -6 Q-6 -6 -6 -20 M6 -20 Q6 -6 20 -6 M20 6 Q6 6 6 20 M-6 20 Q-6 6 -20 6" />
            </g>
          )}
        </g>

        {/* front arm + prop */}
        <Arm {...R} />
        {held === "phone" && (
          <g transform={`translate(${R.hx - 6} ${R.hy - 40}) rotate(-8)`}>
            <rect x={-30} y={-56} width={60} height={110} rx={10} fill="#222" stroke={LINE} strokeWidth={4} />
            <rect x={-22} y={-46} width={44} height={88} rx={5} fill="#74c0fc" />
            <path d="M-14 -40 L4 -40" stroke="#fff" strokeWidth={4} />
          </g>
        )}
      </g>
    </svg>
  );
};
