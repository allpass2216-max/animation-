// LightGayi world: Riya's room (tube light, ceiling fan, window, study table, calendar, almirah with a fingerprint locker),
// darkness after the power cut, device cards with battery bars, power bank, a wall clock and a countdown ring.
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "../../lib/fonts";
import { H, INK, popSpring, W } from "../../lib/reel";
import { SignText } from "../../lib/world";

const UI = { fontFamily: FONT_FAMILY, fontWeight: 800 as const };
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
    {children}
  </svg>
);

/** Is the tube light on at this frame? Flickers for 8 frames before dying at `cutAt`. */
export const lightOn = (frame: number, cutAt: number) => {
  if (frame < cutAt - 8) return true;
  if (frame >= cutAt) return false;
  return Math.floor((frame - (cutAt - 8)) / 2) % 2 === 1;
};

export const FingerLocker: React.FC<{ x: number; y: number; s?: number; dead?: boolean }> = ({ x, y, s = 1, dead = true }) => {
  const frame = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-110} y={-130} width={220} height={260} rx={18} fill="#495057" stroke={INK} strokeWidth={9} />
      <rect x={-90} y={-110} width={180} height={220} rx={12} fill="#343a40" stroke={INK} strokeWidth={6} />
      <rect x={-40} y={-80} width={80} height={110} rx={14} fill={dead ? "#212529" : "#1c7ed6"} stroke={INK} strokeWidth={6} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${-22 + i * 2} ${-60 + i * 18} Q0 ${-72 + i * 18} ${22 - i * 2} ${-60 + i * 18}`} fill="none" stroke={dead ? "#495057" : "#a5d8ff"} strokeWidth={4} />
      ))}
      <circle cx={0} cy={60} r={14} fill={dead ? (Math.floor(frame / 10) % 2 ? "#e03131" : "#5c1010") : "#40c057"} stroke={INK} strokeWidth={5} />
      <rect x={70} y={-30} width={16} height={60} rx={6} fill="#868e96" stroke={INK} strokeWidth={4} />
    </g>
  );
};

/** Riya's room. `cutAt` = the frame the light dies (fan slows, tube light goes out). */
export const Room: React.FC<{ cutAt: number }> = ({ cutAt }) => {
  const frame = useCurrentFrame();
  const on = lightOn(frame, cutAt);
  // fan angle: full speed while on, then decays (integral of an exponential slowdown)
  const t = Math.max(0, frame - cutAt);
  const fanAngle = Math.min(frame, cutAt) * 24 + (24 * 18) * (1 - Math.exp(-t / 18));
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#c3e6cb,#a9d6b5 75%)" }} />
      <Svg>
        {/* window: night outside, stars, the next houses dark too */}
        <rect x={70} y={420} width={300} height={360} fill="#0b1033" stroke={INK} strokeWidth={10} />
        {Array.from({ length: 10 }).map((_, i) => (
          <circle key={i} cx={90 + random(`ws${i}`) * 260} cy={440 + random(`wy${i}`) * 180} r={3} fill="#fff" opacity={0.7} />
        ))}
        <path d="M70 700 L130 640 L190 680 L250 620 L370 690 L370 780 L70 780Z" fill="#141a3d" />
        <path d="M220 420 L220 780 M70 600 L370 600" stroke={INK} strokeWidth={9} />
        {/* tube light */}
        <rect x={560} y={330} width={360} height={36} rx={18} fill={on ? "#fffbe6" : "#868e96"} stroke={INK} strokeWidth={8} />
        {on && <ellipse cx={740} cy={348} rx={320} ry={90} fill="#fffbe6" opacity={0.35} />}
        {/* ceiling fan */}
        <g transform="translate(540 120)">
          <path d="M0 -140 L0 0" stroke={INK} strokeWidth={10} />
          <g transform={`rotate(${fanAngle})`}>
            {[0, 120, 240].map((a) => (
              <rect key={a} x={-14} y={-170} width={28} height={170} rx={12} fill="#ced4da" stroke={INK} strokeWidth={6} transform={`rotate(${a})`} />
            ))}
          </g>
          <circle r={26} fill="#868e96" stroke={INK} strokeWidth={6} />
        </g>
        {/* calendar with tomorrow circled */}
        <g transform="translate(460 470)">
          <rect x={0} y={0} width={180} height={200} rx={8} fill="#fff" stroke={INK} strokeWidth={7} />
          <rect x={0} y={0} width={180} height={50} rx={8} fill="#e03131" stroke={INK} strokeWidth={7} />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={14 + (i % 4) * 40} y={64 + Math.floor(i / 4) * 40} width={30} height={26} fill="#e9ecef" />
          ))}
          <circle cx={109} cy={117} r={24} fill="none" stroke="#e03131" strokeWidth={6} />
          <text x={90} y={190} fontSize={26} textAnchor="middle" fill="#e03131" fontFamily={FONT_FAMILY} fontWeight={800}>
            EXAM
          </text>
        </g>
        {/* almirah with the fingerprint locker inside the open top shelf */}
        <rect x={700} y={520} width={330} height={800} rx={10} fill="#8b5e3c" stroke={INK} strokeWidth={10} />
        <rect x={725} y={545} width={280} height={330} fill="#5c3d24" stroke={INK} strokeWidth={7} />
        <FingerLocker x={865} y={715} s={0.9} />
        <path d="M865 900 L865 1300" stroke={INK} strokeWidth={6} />
        <circle cx={845} cy={1100} r={8} fill="#ffd43b" stroke={INK} strokeWidth={3} />
        <circle cx={885} cy={1100} r={8} fill="#ffd43b" stroke={INK} strokeWidth={3} />
        {/* floor */}
        <rect x={0} y={1320} width={W} height={H - 1320} fill="#b08968" />
        <rect x={0} y={1320} width={W} height={14} fill={INK} opacity={0.3} />
        {/* study table with books */}
        <rect x={30} y={1180} width={420} height={36} rx={6} fill="#a0522d" stroke={INK} strokeWidth={8} />
        <rect x={60} y={1216} width={24} height={200} fill="#8b4513" stroke={INK} strokeWidth={6} />
        <rect x={400} y={1216} width={24} height={200} fill="#8b4513" stroke={INK} strokeWidth={6} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={70 + i * 8} y={1150 - i * 32} width={170} height={30} rx={4} fill={["#4dabf7", "#ff6b6b", "#ffd43b", "#69db7c"][i]} stroke={INK} strokeWidth={5} />
        ))}
      </Svg>
    </>
  );
};

/** Darkness after the power cut: deep blue, with a soft glow where the phone is. */
export const Dark: React.FC<{ glowX: number; glowY: number; amount?: number }> = ({ glowX, glowY, amount = 1 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at ${glowX}px ${glowY}px, rgba(180,220,255,0) 0px, rgba(10,16,48,${0.55 * amount}) 300px, rgba(5,8,30,${0.78 * amount}) 700px)`,
      pointerEvents: "none",
    }}
  />
);

/** Battery bar that fills to pct; red and blinking at 0. */
const Battery: React.FC<{ x: number; y: number; pct: number; at: number }> = ({ x, y, pct, at }) => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [at, at + 12], [0, pct], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blink = pct === 0 && Math.floor(frame / 8) % 2 === 0;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-80} y={-34} width={160} height={68} rx={12} fill={pct === 0 ? (blink ? "#e03131" : "#ffc9c9") : "#f1f3f5"} stroke={INK} strokeWidth={7} />
      <rect x={80} y={-14} width={14} height={28} rx={4} fill={INK} />
      {pct > 0 && <rect x={-72} y={-26} width={(144 * fill) / 100} height={52} rx={8} fill="#40c057" />}
      <text x={0} y={-50} fontSize={44} textAnchor="middle" fill={INK} fontFamily={FONT_FAMILY} fontWeight={800}>
        {`${Math.round(fill)}%`}
      </text>
    </g>
  );
};

/** One device card (icon + label + battery). */
export const DeviceCard: React.FC<{
  x: number;
  y: number;
  kind: "phone" | "torch" | "locker";
  pct: number;
  at: number;
  batteryAt: number;
  hot?: boolean;
  label: string;
}> = ({ x, y, kind, pct, at, batteryAt, hot, label }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = popSpring(frame, at);
  const glow = hot ? 1 + Math.sin(frame / 4) * 0.03 : 1;
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) scale(${p * glow})`}>
        <rect x={-150} y={-230} width={300} height={460} rx={30} fill={hot ? "#fff3bf" : "#f8f9fa"} stroke={hot ? "#f08c00" : INK} strokeWidth={hot ? 12 : 9} />
        <SignText x={0} y={-180} size={40} text={label} fill={INK} stroke="#f8f9fa" />
        {kind === "phone" && (
          <g transform="translate(0 -40) rotate(-12)">
            <rect x={-55} y={-100} width={110} height={200} rx={18} fill="#1c3d7a" stroke={INK} strokeWidth={8} />
            <rect x={-42} y={-84} width={84} height={160} rx={8} fill="#74c0fc" />
            <path d="M-30 -70 L20 -84" stroke="#fff" strokeWidth={8} opacity={0.6} />
          </g>
        )}
        {kind === "torch" && (
          <g transform="translate(0 -40) rotate(-30)">
            <rect x={-26} y={-30} width={52} height={150} rx={14} fill="#343a40" stroke={INK} strokeWidth={8} />
            <path d="M-26 -30 L-46 -100 L46 -100 L26 -30 Z" fill="#495057" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
            <ellipse cx={0} cy={-100} rx={46} ry={14} fill="#ced4da" stroke={INK} strokeWidth={6} />
            <rect x={-10} y={10} width={20} height={30} rx={4} fill="#868e96" />
          </g>
        )}
        {kind === "locker" && <FingerLocker x={0} y={-40} s={0.62} />}
        <Battery x={0} y={150} pct={pct} at={batteryAt} />
      </g>
    </Svg>
  );
};

/** Power bank with a cable; `at` pops it in. */
export const PowerBank: React.FC<{ x: number; y: number; at: number; s?: number }> = ({ x, y, at, s = 1 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = popSpring(frame, at);
  return (
    <Svg>
      <g transform={`translate(${x} ${y + Math.sin(frame / 9) * 8}) scale(${p * s}) rotate(-8)`}>
        <rect x={-120} y={-70} width={240} height={140} rx={26} fill="#3b5bdb" stroke={INK} strokeWidth={9} />
        <circle cx={0} cy={0} r={36} fill="none" stroke="#a5d8ff" strokeWidth={6} />
        <path d="M-8 -20 L10 -2 L-6 2 L8 22" fill="none" stroke="#ffd43b" strokeWidth={7} strokeLinejoin="round" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={-80 + i * 14} cy={48} r={5} fill={i < 4 ? "#69db7c" : "#495057"} />
        ))}
        <path d="M120 0 Q190 0 200 70" fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" />
        <path d="M120 0 Q190 0 200 70" fill="none" stroke="#f8f9fa" strokeWidth={7} strokeLinecap="round" />
      </g>
    </Svg>
  );
};

/** Wall clock showing ~6:00 (the bus), ticking. */
export const BusClock: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = popSpring(frame, at);
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) scale(${p})`}>
        <circle r={110} fill="#fff" stroke={INK} strokeWidth={10} />
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d="M0 -92 L0 -78" stroke={INK} strokeWidth={6} transform={`rotate(${i * 30})`} />
        ))}
        <path d="M0 0 L0 -70" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <path d="M0 0 L0 54" stroke={INK} strokeWidth={12} strokeLinecap="round" />
        <path d="M0 0 L0 -84" stroke="#e03131" strokeWidth={4} transform={`rotate(${(frame - at) * 6})`} />
        <circle r={10} fill={INK} />
        <text x={0} y={160} fontSize={44} textAnchor="middle" fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke" fontFamily={FONT_FAMILY} fontWeight={800}>
          BUS 6 AM
        </text>
      </g>
    </Svg>
  );
};

/** 5-4-3-2-1 countdown ring (the "jaldi" timer). */
export const Countdown: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = (frame - at) / 30;
  const n = Math.max(1, 5 - Math.floor(t * 2));
  const frac = (t * 2) % 1;
  const r = 80;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ ...UI, position: "absolute", left: x - 100, top: y - 100, width: 200, height: 200, transform: `scale(${popSpring(frame, at)})` }}>
      <svg width={200} height={200}>
        <circle cx={100} cy={100} r={90} fill="#ffd43b" stroke={INK} strokeWidth={9} />
        <circle cx={100} cy={100} r={r} fill="none" stroke="#e8590c" strokeWidth={14} strokeDasharray={`${c * (1 - frac)} ${c}`} transform="rotate(-90 100 100)" />
        <text x={100} y={128} fontSize={84} textAnchor="middle" fill={INK} fontFamily={FONT_FAMILY} fontWeight={800}>
          {n}
        </text>
      </svg>
    </div>
  );
};
