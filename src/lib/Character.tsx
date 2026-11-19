// Big chunky cartoon character: big head, thick outlines, always breathing / blinking / swaying.
// Poses and expressions change on cue frames (from words.json) with a springy blend.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { INK } from "./reel";
import { ToonCharacter, ToonProps } from "./ToonCharacter";
import { AnimeCharacter, AnimeProps } from "./AnimeCharacter";

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
export type Expr =
  | "smile"
  | "grin"
  | "wow"
  | "worried"
  | "shock"
  | "think"
  | "sly"
  | "angry"
  | "sad"
  | "cry";

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

const ChunkyCharacter: React.FC<{
  x: number; // feet centre, screen px
  y: number;
  scale?: number;
  flip?: boolean;
  poses: Cue<PoseName>[];
  exprs: Cue<Expr>[];
  look?: Cue<number>[]; // pupil x offset -1..1
  hops?: number[]; // frames where he does a small jump
  money?: Cue<boolean>[];
  holding?: Cue<"none" | "bag" | "phone" | "helmet" | "icecream" | "purse">[]; // prop in the right hand
  mustache?: boolean;
  turn?: number; // 0 = facing camera, 0.5..0.9 = three-quarter view towards local +x (flip mirrors it)
  backpack?: string; // school/tuition bag colour (worn on the back, straps in front)
  cap?: string; // snapback cap colour (brim to the side)
  longHair?: string; // long hair falling to the shoulders (colour)
  hijab?: string; // hijab colour: frames the face, covers hair + ears, drapes to the shoulders
  kufi?: string; // prayer cap colour
  beard?: boolean; // short beard
  lipstick?: string; // lip colour (outlines the mouth in every expression)
  lashes?: boolean;
  dress?: string; // flared knee-length dress over the legs
  blazer?: string; // open blazer over the shirt, with lapels
  quiff?: boolean; // styled quiff hairstyle
  earrings?: boolean;
  chain?: boolean; // thick gold chain
  hood?: string; // hoodie hood colour (behind the neck)
  shades?: Cue<boolean>[]; // sunglasses on (true) / pushed up on the cap (false)
  tie?: string; // tie colour
  glasses?: boolean;
  sweat?: Cue<boolean>[];
  mom?: boolean; // mother variant: grey bun, dupatta, glasses, long kurta/saree
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
  holding = [{ f: 0, v: "none" }],
  mom = false,
  mustache = false,
  turn = 0,
  backpack,
  cap,
  longHair,
  hijab,
  kufi,
  beard = false,
  lipstick,
  lashes = false,
  dress,
  blazer,
  quiff = false,
  earrings = false,
  chain = false,
  hood,
  shades = [{ f: 0, v: false }],
  tie,
  glasses = false,
  sweat = [{ f: 0, v: false }],
  skin = "#C98B5E",
  shirt = "#FF7A3D",
  pants = "#2B3A67",
  hair = "#1d1420",
  seed = 0,
}) => {
  const frame = useCurrentFrame();

  // pose blend
  const { cur, prev } = pick(poses, frame);
  const bt = interpolate(frame - cur.f, [0, 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.6)),
  });
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
  const held = pick(holding, frame).cur.v;
  const sweating = sweat[0].f <= frame && pick(sweat, frame).cur.v; // no sweat before the first cue
  const shadesOn = shades[0].f <= frame && pick(shades, frame).cur.v;

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
    if (t >= 0 && t < 4)
      squash = Math.max(squash, Math.sin((t / 4) * Math.PI) * 0.6); // anticipation squash
    if (t >= 4 && t < 16)
      hopY = Math.min(hopY, -Math.sin(((t - 4) / 12) * Math.PI) * 70);
    if (t >= 16 && t < 21)
      squash = Math.max(squash, Math.sin(((t - 16) / 5) * Math.PI) * 0.8); // landing squash
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
        return (
          <path
            d="M-62 -612 Q0 -540 62 -612 Z"
            fill="#7a1f2b"
            stroke={INK}
            strokeWidth={9}
            strokeLinejoin="round"
          />
        );
      case "wow":
        return (
          <ellipse
            cx={0}
            cy={-600}
            rx={26}
            ry={34 + Math.sin(frame / 3) * 3}
            fill="#7a1f2b"
            stroke={INK}
            strokeWidth={9}
          />
        );
      case "shock":
        return (
          <path
            d="M-40 -580 Q0 -660 40 -580 Q0 -560 -40 -580Z"
            fill="#7a1f2b"
            stroke={INK}
            strokeWidth={9}
          />
        );
      case "worried":
        return (
          <path
            d="M-46 -596 Q-23 -616 0 -598 Q23 -580 46 -600"
            fill="none"
            stroke={INK}
            strokeWidth={10}
            strokeLinecap="round"
          />
        );
      case "think":
        return (
          <path
            d="M-30 -600 L34 -608"
            fill="none"
            stroke={INK}
            strokeWidth={10}
            strokeLinecap="round"
          />
        );
      case "angry":
        return (
          <path
            d={`M-58 -600 Q0 ${-640 + Math.sin(frame / 2) * 6} 58 -600 Q0 -560 -58 -600Z`}
            fill="#7a1f2b"
            stroke={INK}
            strokeWidth={9}
            strokeLinejoin="round"
          />
        );
      case "sad":
      case "cry":
        return (
          <path
            d="M-44 -588 Q0 -628 44 -588"
            fill="none"
            stroke={INK}
            strokeWidth={10}
            strokeLinecap="round"
          />
        );
      case "sly":
        return (
          <path
            d="M-40 -606 Q10 -580 48 -616"
            fill="none"
            stroke={INK}
            strokeWidth={10}
            strokeLinecap="round"
          />
        );
      default:
        return (
          <path
            d="M-48 -612 Q0 -566 48 -612"
            fill="none"
            stroke={INK}
            strokeWidth={10}
            strokeLinecap="round"
          />
        );
    }
  })();
  const browY =
    expr === "worried" || expr === "shock"
      ? -6
      : expr === "wow"
        ? -16
        : expr === "angry"
          ? 10
          : 0;
  const browTilt =
    expr === "worried" || expr === "sad" || expr === "cry"
      ? 14
      : expr === "think" || expr === "sly"
        ? -8
        : expr === "angry"
          ? -18
          : 0;

  const Money = ({ hx, hy }: { hx: number; hy: number }) => (
    <g transform={`translate(${hx} ${hy - 10}) rotate(-12)`}>
      <rect
        x={-70}
        y={-44}
        width={140}
        height={84}
        rx={10}
        fill="#7ccf7a"
        stroke={INK}
        strokeWidth={8}
      />
      <rect
        x={-70}
        y={-30}
        width={140}
        height={84}
        rx={10}
        fill="#8fe08c"
        stroke={INK}
        strokeWidth={8}
      />
      <rect
        x={-14}
        y={-30}
        width={28}
        height={84}
        fill="#f6d55c"
        stroke={INK}
        strokeWidth={6}
      />
      <circle
        cx={-42}
        cy={12}
        r={12}
        fill="none"
        stroke="#3f8f3d"
        strokeWidth={5}
      />
    </g>
  );

  return (
    <svg
      style={{
        position: "absolute",
        left: x - 300 * scale,
        top: y - 980 * scale,
        overflow: "visible",
      }}
      width={600 * scale}
      height={1000 * scale}
      viewBox="-300 -980 600 1000"
    >
      <g
        transform={`translate(0 ${hopY}) ${flip ? "scale(-1 1)" : ""} rotate(${sway}) scale(${sx} ${sy})`}
      >
        {/* shadow */}
        <ellipse
          cx={0}
          cy={6 - hopY}
          rx={170 + hopY * 0.6}
          ry={26}
          fill="rgba(0,0,0,0.25)"
        />
        {mom && (
          <path
            d="M-150 -300 L-190 -20 Q0 10 190 -20 L150 -300 Z"
            fill={shirt}
            stroke={INK}
            strokeWidth={10}
            strokeLinejoin="round"
          />
        )}
        {/* legs */}
        <path
          d="M-58 -250 L-66 -40"
          stroke={INK}
          strokeWidth={84}
          strokeLinecap="round"
        />
        <path
          d="M58 -250 L66 -40"
          stroke={INK}
          strokeWidth={84}
          strokeLinecap="round"
        />
        <path
          d="M-58 -250 L-66 -40"
          stroke={pants}
          strokeWidth={66}
          strokeLinecap="round"
        />
        <path
          d="M58 -250 L66 -40"
          stroke={pants}
          strokeWidth={66}
          strokeLinecap="round"
        />
        <ellipse
          cx={-80}
          cy={-16}
          rx={66}
          ry={34}
          fill="#3a2a2a"
          stroke={INK}
          strokeWidth={9}
        />
        <ellipse
          cx={80}
          cy={-16}
          rx={66}
          ry={34}
          fill="#3a2a2a"
          stroke={INK}
          strokeWidth={9}
        />
        {dress && (
          <g transform={`translate(0 ${breathe * 2})`}>
            <path
              d={`M-130 -330 L${-200 - Math.sin(frame / 9) * 6} -130 Q0 -95 ${200 + Math.sin(frame / 9) * 6} -130 L130 -330 Z`}
              fill={dress}
              stroke={INK}
              strokeWidth={10}
              strokeLinejoin="round"
            />
            <path
              d="M-110 -170 Q0 -150 110 -170"
              fill="none"
              stroke="#fff"
              strokeWidth={5}
              opacity={0.35}
            />
          </g>
        )}
        {/* backpack behind the body: peeks out at both sides and above the shoulders */}
        {backpack && (
          <g transform={`translate(0 ${breathe * 3})`}>
            <rect
              x={-188}
              y={-560}
              width={376}
              height={330}
              rx={46}
              fill={backpack}
              stroke={INK}
              strokeWidth={10}
            />
            <path
              d="M-50 -560 Q0 -610 50 -560"
              fill="none"
              stroke={INK}
              strokeWidth={12}
            />
            <rect
              x={-188}
              y={-420}
              width={40}
              height={120}
              rx={12}
              fill={backpack}
              stroke={INK}
              strokeWidth={7}
            />
            <rect
              x={148}
              y={-420}
              width={40}
              height={120}
              rx={12}
              fill={backpack}
              stroke={INK}
              strokeWidth={7}
            />
          </g>
        )}
        {hood && (
          <path
            d="M-150 -500 Q-170 -600 0 -610 Q170 -600 150 -500 Q80 -540 0 -540 Q-80 -540 -150 -500Z"
            fill={hood}
            stroke={INK}
            strokeWidth={10}
          />
        )}
        {/* torso (breathes) */}
        <g
          transform={`translate(0 -250) scale(${1 + breathe * 0.012} ${1 + breathe * 0.025}) translate(0 250)`}
        >
          <path
            d="M-150 -470 Q-160 -520 -100 -530 L100 -530 Q160 -520 150 -470 L140 -260 Q140 -220 100 -220 L-100 -220 Q-140 -220 -140 -260 Z"
            fill={shirt}
            stroke={INK}
            strokeWidth={10}
          />
          <path
            d="M-40 -530 L0 -470 L40 -530"
            fill="#fff3e0"
            stroke={INK}
            strokeWidth={8}
            strokeLinejoin="round"
          />
          <path
            d="M0 -470 L0 -240"
            stroke={INK}
            strokeWidth={5}
            opacity={0.35}
          />
          {tie && (
            <path
              d="M-16 -490 L16 -490 L22 -330 L0 -300 L-22 -330 Z"
              fill={tie}
              stroke={INK}
              strokeWidth={7}
              strokeLinejoin="round"
            />
          )}
        </g>
        {blazer && (
          <g
            transform={`translate(0 -250) scale(${1 + breathe * 0.012} ${1 + breathe * 0.025}) translate(0 250)`}
          >
            <path
              d="M-150 -470 Q-160 -520 -100 -530 L-40 -530 L-10 -240 L-100 -220 Q-140 -220 -140 -260 Z"
              fill={blazer}
              stroke={INK}
              strokeWidth={10}
              strokeLinejoin="round"
            />
            <path
              d="M150 -470 Q160 -520 100 -530 L40 -530 L10 -240 L100 -220 Q140 -220 140 -260 Z"
              fill={blazer}
              stroke={INK}
              strokeWidth={10}
              strokeLinejoin="round"
            />
            <path
              d="M-40 -530 L-75 -420 L-30 -440"
              fill="none"
              stroke={INK}
              strokeWidth={7}
              strokeLinejoin="round"
            />
            <path
              d="M40 -530 L75 -420 L30 -440"
              fill="none"
              stroke={INK}
              strokeWidth={7}
              strokeLinejoin="round"
            />
            <path
              d="M-110 -360 L-60 -360"
              stroke="#fff"
              strokeWidth={8}
              opacity={0.6}
            />
            <circle
              cx={-22}
              cy={-300}
              r={9}
              fill="#ced4da"
              stroke={INK}
              strokeWidth={4}
            />
          </g>
        )}
        {backpack && (
          <g fill="none" strokeLinecap="round">
            <path d="M-92 -528 L-112 -300" stroke={INK} strokeWidth={30} />
            <path d="M92 -528 L112 -300" stroke={INK} strokeWidth={30} />
            <path d="M-92 -528 L-112 -300" stroke={backpack} strokeWidth={18} />
            <path d="M92 -528 L112 -300" stroke={backpack} strokeWidth={18} />
            <rect
              x={-124}
              y={-400}
              width={26}
              height={18}
              rx={4}
              fill="#adb5bd"
              stroke={INK}
              strokeWidth={5}
            />
            <rect
              x={98}
              y={-400}
              width={26}
              height={18}
              rx={4}
              fill="#adb5bd"
              stroke={INK}
              strokeWidth={5}
            />
          </g>
        )}
        {chain && (
          <g>
            <path
              d="M-70 -525 Q0 -380 70 -525"
              fill="none"
              stroke="#8a6d1d"
              strokeWidth={22}
            />
            <path
              d="M-70 -525 Q0 -380 70 -525"
              fill="none"
              stroke="#ffd43b"
              strokeWidth={14}
              strokeDasharray="10 6"
            />
            <circle
              cx={0}
              cy={-430 + Math.sin(frame / 6) * 3}
              r={30}
              fill="#ffd43b"
              stroke={INK}
              strokeWidth={8}
            />
            <path
              d={`M-12 ${-440 + Math.sin(frame / 6) * 3} L12 ${-440 + Math.sin(frame / 6) * 3} M-12 ${-420 + Math.sin(frame / 6) * 3} L12 ${-420 + Math.sin(frame / 6) * 3}`}
              stroke="#8a6d1d"
              strokeWidth={6}
            />
          </g>
        )}
        {/* left arm (behind props) */}
        <path
          d={L.d}
          fill="none"
          stroke={INK}
          strokeWidth={60}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={L.d}
          fill="none"
          stroke={blazer ?? shirt}
          strokeWidth={44}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={L.hx}
          cy={L.hy}
          r={31}
          fill={skin}
          stroke={INK}
          strokeWidth={9}
        />
        {/* head (bobs with breath) */}
        <g transform={`translate(0 ${breathe * 4})`}>
          {hijab && (
            <path
              d={`M-215 -640 Q-232 -925 0 -930 Q232 -925 215 -640 L${255 + Math.sin(frame / 14) * 4} -430 Q0 -395 ${-255 + Math.sin(frame / 14) * 4} -430 Z`}
              fill={hijab}
              stroke={INK}
              strokeWidth={10}
              strokeLinejoin="round"
            />
          )}
          {longHair && !hijab && (
            <path
              d={`M-190 -720 Q-210 -900 0 -905 Q210 -900 190 -720 L${215 + Math.sin(frame / 12) * 4} -470 Q120 -440 110 -520 L-110 -520 Q-120 -440 ${-215 + Math.sin(frame / 12) * 4} -470 Z`}
              fill={longHair}
              stroke={INK}
              strokeWidth={10}
              strokeLinejoin="round"
            />
          )}
          <rect
            x={-40}
            y={-560}
            width={80}
            height={60}
            fill={skin}
            stroke={INK}
            strokeWidth={9}
          />
          {!hijab && turn < 0.6 && (
            <circle
              cx={-172}
              cy={-690}
              r={36}
              fill={skin}
              stroke={INK}
              strokeWidth={9}
            />
          )}
          {!hijab && (
            <circle
              cx={172 - turn * 40}
              cy={-690}
              r={36}
              fill={skin}
              stroke={INK}
              strokeWidth={9}
            />
          )}
          <circle
            cx={0}
            cy={-700}
            r={175}
            fill={skin}
            stroke={INK}
            strokeWidth={11}
          />
          {/* three-quarter view: soft shade on the far side of the face */}
          {turn > 0 && (
            <path
              d={`M-60 -870 A175 175 0 0 0 -60 -530 A${175 + turn * 120} 175 0 0 1 -60 -870Z`}
              fill="#000"
              opacity={0.08 + turn * 0.06}
            />
          )}
          {mom && !hijab && (
            <circle
              cx={0}
              cy={-880}
              r={62}
              fill={hair}
              stroke={INK}
              strokeWidth={10}
            />
          )}
          {hijab && (
            <g>
              {/* front frame of the hijab around the face (even-odd hole for the face) */}
              <path
                fillRule="evenodd"
                d="M-205 -700 Q-210 -912 0 -918 Q210 -912 205 -700 Q205 -560 150 -515 L-150 -515 Q-205 -560 -205 -700 Z M-152 -688 A152 168 0 1 0 152 -688 A152 168 0 1 0 -152 -688 Z"
                fill={hijab}
                stroke={INK}
                strokeWidth={10}
                strokeLinejoin="round"
              />
              <path
                d="M-150 -760 Q0 -900 150 -760"
                fill="none"
                stroke="#fff"
                strokeWidth={8}
                opacity={0.25}
                strokeLinecap="round"
              />
              <circle
                cx={150}
                cy={-560}
                r={11}
                fill="#ffd43b"
                stroke={INK}
                strokeWidth={4}
              />
            </g>
          )}
          {/* hair */}
          {!hijab && (
            <path
              d="M-176 -700 Q-190 -860 -40 -880 Q60 -930 150 -840 Q200 -790 178 -700 Q150 -770 90 -790 Q20 -760 -40 -800 Q-110 -770 -140 -720 Z"
              fill={hair}
              stroke={INK}
              strokeWidth={10}
              strokeLinejoin="round"
            />
          )}
          {!hijab && (
            <path
              d="M-20 -880 Q-10 -930 30 -925"
              fill="none"
              stroke={hair}
              strokeWidth={16}
              strokeLinecap="round"
            />
          )}
          {kufi && (
            <g>
              <path
                d="M-158 -800 Q-150 -915 0 -920 Q150 -915 158 -800 Q0 -828 -158 -800Z"
                fill={kufi}
                stroke={INK}
                strokeWidth={9}
                strokeLinejoin="round"
              />
              {[-110, -55, 0, 55, 110].map((kx) => (
                <circle
                  key={kx}
                  cx={kx}
                  cy={-848}
                  r={6}
                  fill="#c9a227"
                  opacity={0.7}
                />
              ))}
            </g>
          )}
          {beard && (
            <path
              d="M-150 -640 Q-140 -520 0 -505 Q140 -520 150 -640 Q120 -570 60 -585 Q0 -560 -60 -585 Q-120 -570 -150 -640Z"
              fill={hair}
              stroke={INK}
              strokeWidth={8}
              strokeLinejoin="round"
            />
          )}
          {mom && (
            <path
              d="M-200 -640 Q-215 -900 0 -910 Q215 -900 200 -640 L230 -420 L170 -430 Q185 -700 150 -800 Q0 -880 -150 -800 Q-185 -700 -170 -430 L-230 -420 Z"
              fill="#f1e7ff"
              stroke={INK}
              strokeWidth={10}
              strokeLinejoin="round"
              opacity={0.96}
            />
          )}
          {quiff && !cap && (
            <path
              d="M-120 -830 Q-90 -960 60 -950 Q160 -940 150 -860 Q110 -900 40 -880 Q-40 -860 -120 -830Z"
              fill={hair}
              stroke={INK}
              strokeWidth={10}
              strokeLinejoin="round"
            />
          )}
          {cap && (
            <g>
              <path
                d="M-182 -742 Q-180 -930 0 -935 Q180 -930 182 -742 Z"
                fill={cap}
                stroke={INK}
                strokeWidth={10}
                strokeLinejoin="round"
              />
              <path
                d="M110 -760 Q260 -770 300 -730 Q240 -715 110 -735 Z"
                fill={cap}
                stroke={INK}
                strokeWidth={9}
                strokeLinejoin="round"
              />
              <rect
                x={-60}
                y={-860}
                width={120}
                height={50}
                rx={10}
                fill="#fff"
                stroke={INK}
                strokeWidth={6}
              />
              <path d="M-40 -835 L40 -835" stroke={INK} strokeWidth={8} />
              {!shadesOn && shades.some((c) => c.v) && (
                <g transform="translate(0 -790)">
                  <rect
                    x={-120}
                    y={-24}
                    width={100}
                    height={48}
                    rx={18}
                    fill="#212529"
                    stroke={INK}
                    strokeWidth={7}
                  />
                  <rect
                    x={20}
                    y={-24}
                    width={100}
                    height={48}
                    rx={18}
                    fill="#212529"
                    stroke={INK}
                    strokeWidth={7}
                  />
                </g>
              )}
            </g>
          )}
          {earrings && (
            <g>
              <circle
                cx={-176}
                cy={-640}
                r={16}
                fill="#ffd43b"
                stroke={INK}
                strokeWidth={6}
              />
              <circle
                cx={176}
                cy={-640}
                r={16}
                fill="#ffd43b"
                stroke={INK}
                strokeWidth={6}
              />
            </g>
          )}
          <g
            transform={`translate(${turn * 55} 0) translate(0 -700) scale(${1 - turn * 0.16} 1) translate(0 700)`}
          >
            {/* brows */}
            <g transform={`translate(0 ${browY})`}>
              <path
                d={`M-100 ${-782 + browTilt} L-30 ${-790 - browTilt * 0.4}`}
                stroke={INK}
                strokeWidth={14}
                strokeLinecap="round"
              />
              <path
                d={`M30 ${-790 - browTilt * 0.4} L100 ${-782 + browTilt}`}
                stroke={INK}
                strokeWidth={14}
                strokeLinecap="round"
              />
            </g>
            {/* eyes */}
            {happyEyes ? (
              <>
                <path
                  d="M-96 -712 Q-64 -752 -32 -712"
                  fill="none"
                  stroke={INK}
                  strokeWidth={11}
                  strokeLinecap="round"
                />
                <path
                  d="M32 -712 Q64 -752 96 -712"
                  fill="none"
                  stroke={INK}
                  strokeWidth={11}
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                {lashes &&
                  [-1, 1].map((sd) => (
                    <g
                      key={sd}
                      stroke={INK}
                      strokeWidth={7}
                      strokeLinecap="round"
                    >
                      <path
                        d={`M${sd * 92} ${-718 - eyeRy * 0.6} L${sd * 112} ${-718 - eyeRy * 0.95}`}
                      />
                      <path
                        d={`M${sd * 80} ${-718 - eyeRy * 0.85} L${sd * 94} ${-718 - eyeRy * 1.25}`}
                      />
                    </g>
                  ))}
                <ellipse
                  cx={-64}
                  cy={-718}
                  rx={36}
                  ry={eyeRy}
                  fill="#fff"
                  stroke={INK}
                  strokeWidth={8}
                />
                <ellipse
                  cx={64}
                  cy={-718}
                  rx={36}
                  ry={eyeRy}
                  fill="#fff"
                  stroke={INK}
                  strokeWidth={8}
                />
                {blink < 0.6 && (
                  <>
                    <circle
                      cx={-60 + pupilX}
                      cy={-712}
                      r={expr === "shock" ? 12 : 17}
                      fill={INK}
                    />
                    <circle
                      cx={68 + pupilX}
                      cy={-712}
                      r={expr === "shock" ? 12 : 17}
                      fill={INK}
                    />
                    <circle cx={-54 + pupilX} cy={-720} r={5} fill="#fff" />
                    <circle cx={74 + pupilX} cy={-720} r={5} fill="#fff" />
                  </>
                )}
              </>
            )}
            {shadesOn && (
              <g>
                <path d="M-130 -745 L130 -745" stroke={INK} strokeWidth={10} />
                <rect
                  x={-128}
                  y={-750}
                  width={112}
                  height={66}
                  rx={22}
                  fill="#212529"
                  stroke={INK}
                  strokeWidth={8}
                />
                <rect
                  x={16}
                  y={-750}
                  width={112}
                  height={66}
                  rx={22}
                  fill="#212529"
                  stroke={INK}
                  strokeWidth={8}
                />
                <path
                  d="M-110 -735 L-80 -735 M34 -735 L64 -735"
                  stroke="#868e96"
                  strokeWidth={6}
                  strokeLinecap="round"
                />
              </g>
            )}
            {mustache && (
              <path
                d="M-62 -632 Q-30 -660 0 -640 Q30 -660 62 -632 Q30 -618 0 -628 Q-30 -618 -62 -632Z"
                fill="#2a1e22"
                stroke={INK}
                strokeWidth={6}
              />
            )}
            {sweating &&
              [0, 1].map((i) => {
                const tt = ((frame + i * 13) % 26) / 26;
                return (
                  <path
                    key={i}
                    d={`M${130 + i * 26} ${-770 + tt * 90} q12 22 0 32 q-12 -10 0 -32`}
                    fill="#8fd3ff"
                    stroke={INK}
                    strokeWidth={5}
                    opacity={1 - tt * 0.5}
                  />
                );
              })}
            {(mom || glasses) && (
              <g fill="none" stroke={INK} strokeWidth={8}>
                <circle cx={-64} cy={-716} r={50} />
                <circle cx={64} cy={-716} r={50} />
                <path d="M-14 -720 L14 -720" />
              </g>
            )}
            {/* nose, cheeks, mouth */}
            <path
              d="M-8 -676 Q12 -650 -6 -640"
              fill="none"
              stroke={INK}
              strokeWidth={8}
              strokeLinecap="round"
            />
            <ellipse
              cx={-110}
              cy={-640}
              rx={26}
              ry={14}
              fill="#e9716b"
              opacity={0.45}
            />
            <ellipse
              cx={110}
              cy={-640}
              rx={26}
              ry={14}
              fill="#e9716b"
              opacity={0.45}
            />
            {lipstick && (
              <g style={{ filter: "none" }}>
                {React.cloneElement(mouth, {
                  stroke: lipstick,
                  strokeWidth: 22,
                })}
              </g>
            )}
            {mouth}
          </g>
          {expr === "angry" && (
            <g>
              <circle cx={0} cy={-700} r={170} fill="#e03131" opacity={0.22} />
              {/* anger vein */}
              <g
                transform="translate(-120 -830)"
                stroke="#e03131"
                strokeWidth={11}
                strokeLinecap="round"
                fill="none"
              >
                <path d="M-26 -8 Q-8 -8 -8 -26 M8 -26 Q8 -8 26 -8 M26 8 Q8 8 8 26 M-8 26 Q-8 8 -26 8" />
              </g>
              {/* steam puffs from the head */}
              {[-1, 1].map((sd) => {
                const t = ((frame + (sd > 0 ? 10 : 0)) % 20) / 20;
                return (
                  <circle
                    key={sd}
                    cx={sd * (150 + t * 40)}
                    cy={-880 - t * 90}
                    r={18 + t * 22}
                    fill="#fff"
                    stroke={INK}
                    strokeWidth={5}
                    opacity={1 - t}
                  />
                );
              })}
            </g>
          )}
          {expr === "cry" &&
            [-64, 64].map((tx, i) => {
              const tt = ((frame + i * 11) % 30) / 30;
              return (
                <path
                  key={tx}
                  d={`M${tx} ${-670 + tt * 110} q10 18 0 26 q-10 -8 0 -26`}
                  fill="#8fd3ff"
                  stroke={INK}
                  strokeWidth={5}
                  opacity={1 - tt * 0.6}
                />
              );
            })}
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
        <path
          d={R.d}
          fill="none"
          stroke={INK}
          strokeWidth={60}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={R.d}
          fill="none"
          stroke={blazer ?? shirt}
          strokeWidth={44}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {hasMoney && <Money hx={R.hx} hy={R.hy} />}
        {held === "bag" && (
          <g
            transform={`translate(${R.hx} ${R.hy + 20}) rotate(${Math.sin(frame / 8) * 6})`}
          >
            <path
              d="M-26 -10 Q0 -60 26 -10"
              fill="none"
              stroke={INK}
              strokeWidth={7}
            />
            <path
              d="M-56 -14 L56 -14 L48 110 L-48 110 Z"
              fill="#f8f9fa"
              stroke={INK}
              strokeWidth={8}
              strokeLinejoin="round"
            />
            <rect x={-18} y={30} width={36} height={36} fill="#2fb36b" />
            <rect x={-6} y={18} width={12} height={60} fill="#fff" />
            <rect x={-30} y={42} width={60} height={12} fill="#fff" />
          </g>
        )}
        {held === "phone" && (
          <g transform={`translate(${R.hx - 10} ${R.hy - 40}) rotate(-8)`}>
            <rect
              x={-40}
              y={-70}
              width={80}
              height={140}
              rx={14}
              fill="#222"
              stroke={INK}
              strokeWidth={8}
            />
            <rect
              x={-30}
              y={-56}
              width={60}
              height={108}
              rx={6}
              fill={`hsl(${(frame * 12) % 360},80%,60%)`}
            />
          </g>
        )}
        {held === "icecream" && (
          <g transform={`translate(${R.hx} ${R.hy - 30})`}>
            <path
              d="M-34 0 L34 0 L0 110 Z"
              fill="#e8b46a"
              stroke={INK}
              strokeWidth={8}
              strokeLinejoin="round"
            />
            <path
              d="M-20 20 L20 60 M20 20 L-10 80"
              stroke="#c98a4b"
              strokeWidth={5}
            />
            <circle
              cx={0}
              cy={-26}
              r={42}
              fill="#ffc9de"
              stroke={INK}
              strokeWidth={8}
            />
            <circle
              cx={-10}
              cy={-70}
              r={28}
              fill="#8b5a3c"
              stroke={INK}
              strokeWidth={7}
            />
          </g>
        )}
        {held === "purse" && (
          <g
            transform={`translate(${R.hx} ${R.hy}) rotate(${Math.sin(frame / 8) * 8})`}
          >
            <path
              d="M-34 10 Q0 -50 34 10"
              fill="none"
              stroke="#ffd43b"
              strokeWidth={6}
            />
            <rect
              x={-56}
              y={10}
              width={112}
              height={78}
              rx={18}
              fill="#f783ac"
              stroke={INK}
              strokeWidth={8}
            />
            <circle
              cx={0}
              cy={44}
              r={9}
              fill="#ffd43b"
              stroke={INK}
              strokeWidth={4}
            />
          </g>
        )}
        {held === "helmet" && (
          <g transform={`translate(${R.hx} ${R.hy + 50})`}>
            <path
              d="M-80 0 Q-80 -110 0 -110 Q80 -110 80 0 Z"
              fill="#e03131"
              stroke={INK}
              strokeWidth={9}
            />
            <rect
              x={-84}
              y={-8}
              width={168}
              height={22}
              rx={10}
              fill="#343a40"
              stroke={INK}
              strokeWidth={7}
            />
          </g>
        )}
        <circle
          cx={R.hx}
          cy={R.hy}
          r={31}
          fill={skin}
          stroke={INK}
          strokeWidth={9}
        />
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
}> = ({
  x,
  y,
  s = 1,
  shirt,
  skin = "#B97A50",
  seed,
  paper,
  bag,
  walk = 0,
  t0 = 0,
  flip,
  hopAt = [],
}) => {
  const frame = useCurrentFrame();
  const bob = walk
    ? Math.abs(Math.sin((frame + seed * 5) / 4)) * -10
    : Math.sin((frame + seed * 9) / 15) * 3;
  let hop = 0;
  for (const h of hopAt) {
    const t = frame - h;
    if (t >= 0 && t < 10)
      hop = Math.min(hop, -Math.sin((t / 10) * Math.PI) * 40);
  }
  const span = 1500; // walkers wrap around so they stay in view
  const px = walk
    ? ((((x + 250 + walk * (frame - t0)) % span) + span) % span) - 250
    : x;
  const legSwing = walk ? Math.sin((frame + seed * 5) / 4) * 14 : 0;
  return (
    <g
      transform={`translate(${px} ${y + bob + hop}) scale(${flip ? -s : s} ${s})`}
    >
      <ellipse
        cx={0}
        cy={4 - bob - hop}
        rx={60}
        ry={12}
        fill="rgba(0,0,0,0.2)"
      />
      <path
        d={`M-20 -90 L${-24 - legSwing} 0 M20 -90 L${24 + legSwing} 0`}
        stroke={INK}
        strokeWidth={30}
        strokeLinecap="round"
      />
      <path
        d={`M-20 -90 L${-24 - legSwing} 0 M20 -90 L${24 + legSwing} 0`}
        stroke="#384057"
        strokeWidth={18}
        strokeLinecap="round"
      />
      <rect
        x={-52}
        y={-200}
        width={104}
        height={120}
        rx={30}
        fill={shirt}
        stroke={INK}
        strokeWidth={7}
      />
      <circle
        cx={0}
        cy={-250}
        r={58}
        fill={skin}
        stroke={INK}
        strokeWidth={7}
      />
      <path
        d="M-58 -260 Q-50 -320 0 -314 Q50 -320 58 -260 Q30 -290 0 -284 Q-30 -290 -58 -260Z"
        fill="#20161c"
        stroke={INK}
        strokeWidth={5}
      />
      <circle cx={-20} cy={-252} r={7} fill={INK} />
      <circle cx={20} cy={-252} r={7} fill={INK} />
      <path
        d="M-16 -226 Q0 -214 16 -226"
        fill="none"
        stroke={INK}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {paper && (
        <g
          transform={`translate(54 -150) rotate(${Math.sin((frame + seed * 3) / 5) * 8})`}
        >
          <rect
            x={-22}
            y={-40}
            width={52}
            height={66}
            fill="#fff"
            stroke={INK}
            strokeWidth={5}
          />
          <path
            d="M-12 -24 L20 -24 M-12 -10 L20 -10 M-12 4 L12 4"
            stroke="#8a8aa0"
            strokeWidth={4}
          />
        </g>
      )}
      {bag && (
        <g transform="translate(62 -110)">
          <path
            d="M-18 -30 Q0 -60 18 -30"
            fill="none"
            stroke={INK}
            strokeWidth={5}
          />
          <rect
            x={-30}
            y={-30}
            width={60}
            height={64}
            rx={6}
            fill={bag}
            stroke={INK}
            strokeWidth={6}
          />
        </g>
      )}
    </g>
  );
};

/** Which drawing style characters use. Wrap a video in <CharStyle.Provider value="toon"> for the round-head toon style. */
export const CharStyle = React.createContext<"chunky" | "toon" | "anime">(
  "chunky",
);

type CharacterProps = React.ComponentProps<typeof ChunkyCharacter>;
export const Character: React.FC<CharacterProps> = (props) => {
  const style = React.useContext(CharStyle);
  if (style === "anime") return <AnimeCharacter {...(props as AnimeProps)} />;
  return style === "toon" ? (
    <ToonCharacter {...(props as ToonProps)} />
  ) : (
    <ChunkyCharacter {...props} />
  );
};
