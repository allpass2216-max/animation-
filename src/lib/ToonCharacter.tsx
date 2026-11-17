// "Toon" style character: big round light head, small dot eyes, thick expressive eyebrows, thin stick arms and legs
// with ball hands, a simple tapered body or long dress, soft cel shading. Same props as Character (drop-in swap),
// same coordinate system: feet at (x, y), head centre ~700 px above the feet at scale 1.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { Cue, Expr, PoseName } from "./Character";
import { INK } from "./reel";

const POSES: Record<PoseName, [number, number, number, number]> = {
  idle: [12, -8, 12, -8],
  hold: [12, -8, -14, -80],
  panic: [150, 50, 150, 50],
  point: [12, -8, 108, -4],
  think: [14, -10, -60, 230],
  shrug: [64, 64, 64, 64],
  cheer: [160, 14, 160, 14],
  wave: [12, -8, 140, 34],
  present: [12, -8, 80, 18],
  scratch: [22, -40, 168, 64],
  tap: [12, -8, 56, -6],
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

/** Light, slightly warm head colour derived from the skin tone (the reference style uses very light round heads). */
const toonSkin = (skin: string) => {
  const n = parseInt(skin.replace("#", ""), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.62);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `rgb(${r},${g},${b})`;
};

export type ToonProps = {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  poses: Cue<PoseName>[];
  exprs: Cue<Expr>[];
  look?: Cue<number>[];
  hops?: number[];
  holding?: Cue<string>[];
  mustache?: boolean;
  cap?: string;
  longHair?: string;
  lipstick?: string;
  lashes?: boolean;
  dress?: string;
  blazer?: string;
  quiff?: boolean;
  earrings?: boolean;
  tie?: string;
  glasses?: boolean;
  sweat?: Cue<boolean>[];
  mom?: boolean;
  skin?: string;
  shirt?: string;
  pants?: string;
  hair?: string;
  seed?: number;
};

export const ToonCharacter: React.FC<ToonProps> = ({
  x,
  y,
  scale = 1,
  flip,
  poses,
  exprs,
  look = [{ f: 0, v: 0 }],
  hops = [],
  holding = [{ f: 0, v: "none" }],
  mustache = false,
  cap,
  longHair,
  lipstick,
  lashes = false,
  dress,
  blazer,
  quiff = false,
  earrings = false,
  tie,
  glasses = false,
  sweat = [{ f: 0, v: false }],
  mom = false,
  skin = "#C98B5E",
  shirt = "#FF7A3D",
  pants = "#2B3A67",
  hair = "#1d1420",
  seed = 0,
}) => {
  const frame = useCurrentFrame();
  const head = toonSkin(skin);
  const LW = 7; // line width of the outlines

  // pose blend
  const { cur, prev } = pick(poses, frame);
  const bt = interpolate(frame - cur.f, [0, 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });
  const a = POSES[prev.v].map((p, i) => p + (POSES[cur.v][i] - p) * bt);
  if (cur.v === "wave") a[3] += Math.sin((frame - cur.f) / 3) * 26;
  if (cur.v === "panic") {
    a[1] += Math.sin(frame / 2.2) * 6;
    a[3] -= Math.sin(frame / 2.2) * 6;
  }
  if (cur.v === "point") a[2] += Math.sin(frame / 3) * 4; // jabbing finger

  const expr = pick(exprs, frame).cur.v;
  const lookX = pick(look, frame).cur.v;
  const held = pick(holding, frame).cur.v;
  const sweating = sweat[0].f <= frame && pick(sweat, frame).cur.v;

  // life: breathing, sway, blink
  const breathe = Math.sin((frame + seed * 13) / 14);
  const sway = Math.sin((frame + seed * 7) / 26) * 1.5;
  const blinkPhase = (frame + 40 + seed * 31) % 96;
  const blink = blinkPhase < 4 ? 1 - Math.abs(blinkPhase - 2) / 2 : 0;

  // hop with squash & stretch
  let hopY = 0;
  let squash = 0;
  for (const h of hops) {
    const t = frame - h;
    if (t >= 0 && t < 4) squash = Math.max(squash, Math.sin((t / 4) * Math.PI) * 0.6);
    if (t >= 4 && t < 16) hopY = Math.min(hopY, -Math.sin(((t - 4) / 12) * Math.PI) * 70);
    if (t >= 16 && t < 21) squash = Math.max(squash, Math.sin(((t - 16) / 5) * Math.PI) * 0.8);
  }
  const sy = 1 - squash * 0.1 + (hopY < -20 ? 0.04 : 0);
  const sx = 1 + squash * 0.08 - (hopY < -20 ? 0.03 : 0);

  const long = !!dress || mom;
  const bodyTop = -500;
  const bodyBottom = long ? -12 : -250;
  const arm = (side: -1 | 1, sh: number, el: number) => {
    const sxp = side * 78;
    const syp = -470;
    const r1 = (sh * Math.PI) / 180;
    const r2 = ((sh + el) * Math.PI) / 180;
    const ex = sxp + side * Math.sin(r1) * 115;
    const ey = syp + Math.cos(r1) * 115;
    const hx = ex + side * Math.sin(r2) * 110;
    const hy = ey + Math.cos(r2) * 110;
    return { d: `M${sxp} ${syp} L${ex} ${ey} L${hx} ${hy}`, hx, hy };
  };
  const L = arm(-1, a[0], a[1]);
  const R = arm(1, a[2], a[3]);
  const sleeve = blazer ?? (long ? dress ?? shirt : shirt);

  // ----- face -----
  const eyeOpen = expr === "wow" || expr === "shock" ? 1.35 : 1;
  const eyeRy = 19 * eyeOpen * (1 - blink * 0.9);
  const px = lookX * 9;
  const happy = expr === "grin" || expr === "sly";
  const browTilt = { angry: -26, worried: 18, sad: 18, cry: 18, think: -10, sly: -14, shock: 6, wow: 4 }[expr as string] ?? 0;
  const browY = { angry: 14, shock: -18, wow: -22, worried: -6 }[expr as string] ?? 0;
  const mouthCol = "#5c1a26";
  const mouth = (() => {
    switch (expr) {
      case "grin":
        return <path d="M-40 -628 Q0 -584 40 -628 Z" fill={mouthCol} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />;
      case "wow":
        return <ellipse cx={0} cy={-615} rx={16} ry={22 + Math.sin(frame / 3) * 2} fill={mouthCol} stroke={INK} strokeWidth={LW} />;
      case "shock":
        return <ellipse cx={0} cy={-612} rx={26} ry={30} fill={mouthCol} stroke={INK} strokeWidth={LW} />;
      case "angry":
        return <path d={`M-32 -606 Q0 ${-640 + Math.sin(frame / 2) * 4} 32 -606 Q0 -596 -32 -606Z`} fill={mouthCol} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />;
      case "worried":
        return <path d="M-26 -614 Q-13 -626 0 -614 Q13 -602 26 -616" fill="none" stroke={INK} strokeWidth={LW} strokeLinecap="round" />;
      case "sad":
      case "cry":
        return <path d="M-26 -606 Q0 -630 26 -606" fill="none" stroke={INK} strokeWidth={LW} strokeLinecap="round" />;
      case "think":
        return <ellipse cx={8} cy={-616} rx={7} ry={6} fill={INK} />;
      case "sly":
        return <path d="M-24 -618 Q8 -604 30 -628" fill="none" stroke={INK} strokeWidth={LW} strokeLinecap="round" />;
      default:
        return <path d="M-26 -624 Q0 -604 26 -624" fill="none" stroke={INK} strokeWidth={LW} strokeLinecap="round" />;
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
        {/* soft ground shadow */}
        <ellipse cx={0} cy={4 - hopY} rx={150 + hopY * 0.5} ry={20} fill="rgba(0,0,0,0.28)" />

        {/* legs (thin sticks) + shoes, hidden by a long dress */}
        {!long && (
          <g>
            <path d="M-40 -260 L-46 -24" stroke={INK} strokeWidth={22} strokeLinecap="round" />
            <path d="M40 -260 L46 -24" stroke={INK} strokeWidth={22} strokeLinecap="round" />
            <path d="M-40 -260 L-46 -24" stroke={pants} strokeWidth={10} strokeLinecap="round" />
            <path d="M40 -260 L46 -24" stroke={pants} strokeWidth={10} strokeLinecap="round" />
            <ellipse cx={-56} cy={-14} rx={42} ry={18} fill="#2b2028" stroke={INK} strokeWidth={LW} />
            <ellipse cx={56} cy={-14} rx={42} ry={18} fill="#2b2028" stroke={INK} strokeWidth={LW} />
          </g>
        )}

        {/* long hair behind */}
        {longHair && (
          <path
            d={`M-170 -720 Q-185 -900 0 -905 Q185 -900 170 -720 L${190 + Math.sin(frame / 12) * 4} -470 Q100 -440 90 -520 L-90 -520 Q-100 -440 ${-190 + Math.sin(frame / 12) * 4} -470 Z`}
            fill={longHair}
            stroke={INK}
            strokeWidth={LW}
            strokeLinejoin="round"
          />
        )}

        {/* left arm behind the body */}
        <path d={L.d} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
        <path d={L.d} fill="none" stroke={sleeve} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={L.hx} cy={L.hy} r={17} fill={head} stroke={INK} strokeWidth={LW} />

        {/* body: tapered capsule, or long dress/kurta to the floor; breathes */}
        <g transform={`translate(0 ${bodyBottom}) scale(${1 + breathe * 0.012} ${1 + breathe * 0.02}) translate(0 ${-bodyBottom})`}>
          {long ? (
            <path
              d={`M-78 ${bodyTop} Q-96 ${bodyTop - 24} -60 ${bodyTop - 30} L60 ${bodyTop - 30} Q96 ${bodyTop - 24} 78 ${bodyTop} L${150 + Math.sin(frame / 9) * 5} ${bodyBottom} L${-150 - Math.sin(frame / 9) * 5} ${bodyBottom} Z`}
              fill={dress ?? shirt}
              stroke={INK}
              strokeWidth={LW}
              strokeLinejoin="round"
            />
          ) : (
            <path
              d={`M-82 ${bodyTop} Q-100 ${bodyTop - 28} -60 ${bodyTop - 32} L60 ${bodyTop - 32} Q100 ${bodyTop - 28} 82 ${bodyTop} L96 ${bodyBottom - 30} Q96 ${bodyBottom} 60 ${bodyBottom} L-60 ${bodyBottom} Q-96 ${bodyBottom} -96 ${bodyBottom - 30} Z`}
              fill={shirt}
              stroke={INK}
              strokeWidth={LW}
              strokeLinejoin="round"
            />
          )}
          {/* cel-shade: darker right side */}
          <path
            d={long ? `M20 ${bodyTop - 30} L60 ${bodyTop - 30} Q96 ${bodyTop - 24} 78 ${bodyTop} L150 ${bodyBottom} L60 ${bodyBottom} Z` : `M30 ${bodyTop - 32} L60 ${bodyTop - 32} Q100 ${bodyTop - 28} 82 ${bodyTop} L96 ${bodyBottom - 30} Q96 ${bodyBottom} 60 ${bodyBottom} L40 ${bodyBottom} Z`}
            fill="#000"
            opacity={0.14}
          />
          {/* buttons */}
          {!blazer &&
            [0, 1, 2].map((i) => <circle key={i} cx={0} cy={bodyTop + 10 + i * 60} r={6} fill="#fff" opacity={0.7} stroke={INK} strokeWidth={3} />)}
          {blazer && (
            <g>
              <path d={`M-82 ${bodyTop} Q-100 ${bodyTop - 28} -60 ${bodyTop - 32} L-22 ${bodyTop - 32} L-8 ${bodyBottom} L-60 ${bodyBottom} Q-96 ${bodyBottom} -96 ${bodyBottom - 30} Z`} fill={blazer} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
              <path d={`M82 ${bodyTop} Q100 ${bodyTop - 28} 60 ${bodyTop - 32} L22 ${bodyTop - 32} L8 ${bodyBottom} L60 ${bodyBottom} Q96 ${bodyBottom} 96 ${bodyBottom - 30} Z`} fill={blazer} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
              <path d={`M-22 ${bodyTop - 32} L-48 ${bodyTop + 60} L-14 ${bodyTop + 40}`} fill="none" stroke={INK} strokeWidth={5} />
              <path d={`M22 ${bodyTop - 32} L48 ${bodyTop + 60} L14 ${bodyTop + 40}`} fill="none" stroke={INK} strokeWidth={5} />
            </g>
          )}
          {tie && <path d={`M-12 ${bodyTop - 30} L12 ${bodyTop - 30} L16 ${bodyTop + 110} L0 ${bodyTop + 132} L-16 ${bodyTop + 110} Z`} fill={tie} stroke={INK} strokeWidth={5} strokeLinejoin="round" />}
          {mom && <path d={`M-90 ${bodyTop - 20} Q0 ${bodyTop + 120} 120 ${bodyTop + 60} L130 ${bodyTop + 300}`} fill="none" stroke="#f1e7ff" strokeWidth={26} strokeLinecap="round" opacity={0.9} />}
        </g>

        {/* neck */}
        <rect x={-18} y={-548} width={36} height={30} fill={head} stroke={INK} strokeWidth={LW} />

        {/* head */}
        <g transform={`translate(0 ${breathe * 3})`}>
          {mom && <circle cx={0} cy={-890} r={52} fill={hair} stroke={INK} strokeWidth={LW} />}
          <circle cx={0} cy={-700} r={170} fill={head} stroke={INK} strokeWidth={LW + 1} />
          {/* cel-shade on the head */}
          <path d="M60 -858 A170 170 0 0 1 60 -542 A200 200 0 0 0 60 -858Z" fill="#000" opacity={0.07} />

          {/* hair: side-swept fringe / quiff / bun line */}
          {!cap && !longHair && (
            <path
              d={quiff ? "M-150 -770 Q-140 -900 10 -905 Q150 -900 160 -790 Q140 -840 60 -860 Q90 -820 20 -810 Q-60 -850 -150 -770Z" : "M-160 -760 Q-150 -880 0 -872 Q150 -880 160 -760 Q120 -820 40 -830 Q-60 -815 -160 -760Z"}
              fill={hair}
              stroke={INK}
              strokeWidth={LW}
              strokeLinejoin="round"
            />
          )}
          {longHair && <path d="M-150 -770 Q-120 -880 20 -872 Q150 -870 160 -770 Q100 -830 -10 -820 Q-80 -800 -150 -770Z" fill={longHair} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />}
          {mom && <path d="M-160 -740 Q-150 -880 0 -872 Q150 -880 160 -740 Q100 -820 0 -824 Q-100 -820 -160 -740Z" fill={hair} stroke={INK} strokeWidth={LW} />}
          {cap && (
            <g>
              <path d="M-160 -770 Q-150 -900 0 -905 Q150 -900 160 -770 Z" fill={cap} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
              <path d="M100 -780 Q230 -790 250 -755 Q200 -742 100 -760 Z" fill={cap} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
              <rect x={-44} y={-862} width={88} height={36} rx={8} fill="#fff" stroke={INK} strokeWidth={4} />
            </g>
          )}

          {/* eyebrows: thick, carry most of the emotion */}
          <g transform={`translate(0 ${browY})`}>
            <path d={`M-92 ${-764 + browTilt * 0.6} L-28 ${-764 - browTilt * 0.6}`} stroke={hair} strokeWidth={18} strokeLinecap="round" />
            <path d={`M28 ${-764 - browTilt * 0.6} L92 ${-764 + browTilt * 0.6}`} stroke={hair} strokeWidth={18} strokeLinecap="round" />
          </g>

          {/* eyes: small dots (happy = arcs) */}
          {happy ? (
            <g fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round">
              <path d="M-78 -712 Q-60 -734 -42 -712" />
              <path d="M42 -712 Q60 -734 78 -712" />
            </g>
          ) : (
            <g>
              {(expr === "shock" || expr === "wow") && (
                <>
                  <circle cx={-60} cy={-716} r={30} fill="#fff" stroke={INK} strokeWidth={5} />
                  <circle cx={60} cy={-716} r={30} fill="#fff" stroke={INK} strokeWidth={5} />
                </>
              )}
              <ellipse cx={-60 + px} cy={-716} rx={expr === "shock" ? 9 : 13} ry={expr === "shock" ? 10 : eyeRy} fill={INK} />
              <ellipse cx={60 + px} cy={-716} rx={expr === "shock" ? 9 : 13} ry={expr === "shock" ? 10 : eyeRy} fill={INK} />
              {lashes &&
                [-1, 1].map((sd) => (
                  <path key={sd} d={`M${sd * 74} -730 L${sd * 94} -748`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
                ))}
            </g>
          )}
          {glasses && (
            <g fill="none" stroke={INK} strokeWidth={6}>
              <circle cx={-60} cy={-716} r={40} />
              <circle cx={60} cy={-716} r={40} />
              <path d="M-20 -716 L20 -716" />
            </g>
          )}

          {/* nose dot, cheeks, moustache, mouth */}
          <ellipse cx={4} cy={-662} rx={7} ry={5} fill={INK} opacity={0.75} />
          <ellipse cx={-104} cy={-650} rx={22} ry={11} fill="#ff8fa3" opacity={expr === "angry" ? 0.75 : 0.35} />
          <ellipse cx={104} cy={-650} rx={22} ry={11} fill="#ff8fa3" opacity={expr === "angry" ? 0.75 : 0.35} />
          {mustache && <path d="M-56 -640 Q-28 -664 0 -646 Q28 -664 56 -640 Q28 -628 0 -634 Q-28 -628 -56 -640Z" fill="#2a1e22" stroke={INK} strokeWidth={4} />}
          {lipstick && React.cloneElement(mouth, { stroke: lipstick, strokeWidth: 14 })}
          {mouth}
          {earrings && (
            <g fill="none" stroke="#ffd43b" strokeWidth={6}>
              <circle cx={-168} cy={-640} r={16} />
              <circle cx={168} cy={-640} r={16} />
            </g>
          )}

          {/* sweat drop (big, like the reference style) */}
          {sweating && (
            <path
              d={`M128 ${-800 + ((frame % 24) / 24) * 30} q20 38 0 54 q-20 -16 0 -54`}
              fill="#74c0fc"
              stroke={INK}
              strokeWidth={5}
            />
          )}
          {/* anger: vein + steam puffs */}
          {expr === "angry" && (
            <g>
              <g transform="translate(-112 -826)" stroke="#e03131" strokeWidth={9} strokeLinecap="round" fill="none">
                <path d="M-22 -6 Q-6 -6 -6 -22 M6 -22 Q6 -6 22 -6 M22 6 Q6 6 6 22 M-6 22 Q-6 6 -22 6" />
              </g>
              {[-1, 1].map((sd) => {
                const t = ((frame + (sd > 0 ? 10 : 0)) % 20) / 20;
                return <circle key={sd} cx={sd * (140 + t * 36)} cy={-870 - t * 80} r={14 + t * 18} fill="#fff" stroke={INK} strokeWidth={4} opacity={1 - t} />;
              })}
            </g>
          )}
          {expr === "cry" &&
            [-60, 60].map((tx, i) => {
              const tt = ((frame + i * 11) % 30) / 30;
              return <path key={tx} d={`M${tx} ${-690 + tt * 90} q8 14 0 20 q-8 -6 0 -20`} fill="#74c0fc" opacity={1 - tt * 0.6} />;
            })}
        </g>

        {/* right arm in front + prop */}
        <path d={R.d} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
        <path d={R.d} fill="none" stroke={sleeve} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        {held === "purse" && (
          <g transform={`translate(${R.hx} ${R.hy}) rotate(${Math.sin(frame / 8) * 8})`}>
            <path d="M-26 8 Q0 -40 26 8" fill="none" stroke="#ffd43b" strokeWidth={5} />
            <rect x={-44} y={8} width={88} height={60} rx={14} fill="#f783ac" stroke={INK} strokeWidth={LW} />
          </g>
        )}
        {held === "bag" && (
          <g transform={`translate(${R.hx} ${R.hy + 10})`}>
            <rect x={-60} y={0} width={120} height={84} rx={10} fill="#6b3f22" stroke={INK} strokeWidth={LW} />
            <path d="M-20 0 Q0 -26 20 0" fill="none" stroke={INK} strokeWidth={6} />
          </g>
        )}
        {held === "phone" && (
          <g transform={`translate(${R.hx - 6} ${R.hy - 30}) rotate(-8)`}>
            <rect x={-30} y={-54} width={60} height={108} rx={10} fill="#222" stroke={INK} strokeWidth={LW} />
          </g>
        )}
        <circle cx={R.hx} cy={R.hy} r={17} fill={head} stroke={INK} strokeWidth={LW} />
      </g>
    </svg>
  );
};
