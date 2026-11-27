// LightGayi world: Riya's room (tube light, ceiling fan, window, study table, calendar, almirah with a fingerprint locker),
// darkness after the power cut, device cards with battery bars, power bank, a wall clock and a countdown ring.
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "../../lib/fonts";
import { H, INK, popSpring, W } from "../../lib/reel";
import { SignText } from "../../lib/world";

const UI = { fontFamily: FONT_FAMILY, fontWeight: 800 as const };
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    width={W}
    height={H}
  >
    {children}
  </svg>
);

/** Is the tube light on at this frame? Flickers for 8 frames before dying at `cutAt`. */
export const lightOn = (frame: number, cutAt: number) => {
  if (frame < cutAt - 8) return true;
  if (frame >= cutAt) return false;
  return Math.floor((frame - (cutAt - 8)) / 2) % 2 === 1;
};

export const FingerLocker: React.FC<{
  x: number;
  y: number;
  s?: number;
  dead?: boolean;
}> = ({ x, y, s = 1, dead = true }) => {
  const frame = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect
        x={-110}
        y={-130}
        width={220}
        height={260}
        rx={18}
        fill="#495057"
        stroke={INK}
        strokeWidth={9}
      />
      <rect
        x={-90}
        y={-110}
        width={180}
        height={220}
        rx={12}
        fill="#343a40"
        stroke={INK}
        strokeWidth={6}
      />
      <rect
        x={-40}
        y={-80}
        width={80}
        height={110}
        rx={14}
        fill={dead ? "#212529" : "#1c7ed6"}
        stroke={INK}
        strokeWidth={6}
      />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${-22 + i * 2} ${-60 + i * 18} Q0 ${-72 + i * 18} ${22 - i * 2} ${-60 + i * 18}`}
          fill="none"
          stroke={dead ? "#495057" : "#a5d8ff"}
          strokeWidth={4}
        />
      ))}
      <circle
        cx={0}
        cy={60}
        r={14}
        fill={
          dead
            ? Math.floor(frame / 10) % 2
              ? "#e03131"
              : "#5c1010"
            : "#40c057"
        }
        stroke={INK}
        strokeWidth={5}
      />
      <rect
        x={70}
        y={-30}
        width={16}
        height={60}
        rx={6}
        fill="#868e96"
        stroke={INK}
        strokeWidth={4}
      />
    </g>
  );
};

/** Riya's room. `cutAt` = the frame the light dies (fan slows, tube light goes out). */
export const Room: React.FC<{ cutAt: number; bed?: boolean }> = ({
  cutAt,
  bed,
}) => {
  const frame = useCurrentFrame();
  const on = lightOn(frame, cutAt);
  // fan angle: full speed while on, then decays (integral of an exponential slowdown)
  const t = Math.max(0, frame - cutAt);
  const fanAngle =
    Math.min(frame, cutAt) * 24 + 24 * 18 * (1 - Math.exp(-t / 18));
  return (
    <>
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg,#c3e6cb,#a9d6b5 75%)" }}
      />
      <Svg>
        {/* window: night outside; the mohalla's houses and street lamp go dark one by one at the cut */}
        <rect
          x={50}
          y={400}
          width={370}
          height={420}
          fill="#0b1033"
          stroke={INK}
          strokeWidth={10}
        />
        {Array.from({ length: 10 }).map((_, i) => (
          <circle
            key={i}
            cx={70 + random(`ws${i}`) * 330}
            cy={420 + random(`wy${i}`) * 140}
            r={3}
            fill="#fff"
            opacity={0.7}
          />
        ))}
        {[
          { x: 60, w: 110, h: 190 },
          { x: 175, w: 90, h: 250 },
          { x: 270, w: 140, h: 170 },
        ].map((hs, i) => {
          const lit = frame < cutAt - 4 + i * 4;
          return (
            <g key={i}>
              <rect
                x={hs.x}
                y={810 - hs.h}
                width={hs.w}
                height={hs.h}
                fill="#1b2350"
                stroke="#0b1033"
                strokeWidth={3}
              />
              {Array.from({ length: 4 }).map((__, k) => (
                <rect
                  key={k}
                  x={hs.x + 14 + (k % 2) * (hs.w / 2 - 4)}
                  y={830 - hs.h + Math.floor(k / 2) * 60}
                  width={hs.w / 2 - 28}
                  height={34}
                  fill={lit ? "#ffd43b" : "#2b3266"}
                  opacity={lit ? 0.95 : 1}
                />
              ))}
              {lit && (
                <rect
                  x={hs.x}
                  y={810 - hs.h}
                  width={hs.w}
                  height={hs.h}
                  fill="#ffd43b"
                  opacity={0.08}
                />
              )}
            </g>
          );
        })}
        {/* street lamp */}
        <path
          d="M395 810 L395 640 L370 640"
          stroke="#495057"
          strokeWidth={8}
          fill="none"
        />
        <circle
          cx={368}
          cy={648}
          r={12}
          fill={frame < cutAt + 8 ? "#fff3bf" : "#343a40"}
        />
        {frame < cutAt + 8 && (
          <circle cx={368} cy={648} r={40} fill="#fff3bf" opacity={0.3} />
        )}
        <path
          d="M235 400 L235 820 M50 610 L420 610"
          stroke={INK}
          strokeWidth={9}
        />
        {/* tube light */}
        <rect
          x={560}
          y={330}
          width={360}
          height={36}
          rx={18}
          fill={on ? "#fffbe6" : "#868e96"}
          stroke={INK}
          strokeWidth={8}
        />
        {on && (
          <ellipse
            cx={740}
            cy={348}
            rx={320}
            ry={90}
            fill="#fffbe6"
            opacity={0.35}
          />
        )}
        {/* ceiling fan */}
        <g transform="translate(540 120)">
          <path d="M0 -140 L0 0" stroke={INK} strokeWidth={10} />
          <g transform={`rotate(${fanAngle})`}>
            {[0, 120, 240].map((a) => (
              <rect
                key={a}
                x={-14}
                y={-170}
                width={28}
                height={170}
                rx={12}
                fill="#ced4da"
                stroke={INK}
                strokeWidth={6}
                transform={`rotate(${a})`}
              />
            ))}
          </g>
          <circle r={26} fill="#868e96" stroke={INK} strokeWidth={6} />
        </g>
        {/* calendar with tomorrow circled */}
        <g transform="translate(460 470)">
          <rect
            x={0}
            y={0}
            width={180}
            height={200}
            rx={8}
            fill="#fff"
            stroke={INK}
            strokeWidth={7}
          />
          <rect
            x={0}
            y={0}
            width={180}
            height={50}
            rx={8}
            fill="#e03131"
            stroke={INK}
            strokeWidth={7}
          />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x={14 + (i % 4) * 40}
              y={64 + Math.floor(i / 4) * 40}
              width={30}
              height={26}
              fill="#e9ecef"
            />
          ))}
          <circle
            cx={109}
            cy={117}
            r={24}
            fill="none"
            stroke="#e03131"
            strokeWidth={6}
          />
          <text
            x={90}
            y={190}
            fontSize={26}
            textAnchor="middle"
            fill="#e03131"
            fontFamily={FONT_FAMILY}
            fontWeight={800}
          >
            EXAM
          </text>
        </g>
        {/* almirah with the fingerprint locker inside the open top shelf */}
        <rect
          x={700}
          y={520}
          width={330}
          height={800}
          rx={10}
          fill="#8b5e3c"
          stroke={INK}
          strokeWidth={10}
        />
        <rect
          x={725}
          y={545}
          width={280}
          height={330}
          fill="#5c3d24"
          stroke={INK}
          strokeWidth={7}
        />
        <FingerLocker x={865} y={715} s={0.9} />
        <path d="M865 900 L865 1300" stroke={INK} strokeWidth={6} />
        <circle
          cx={845}
          cy={1100}
          r={8}
          fill="#ffd43b"
          stroke={INK}
          strokeWidth={3}
        />
        <circle
          cx={885}
          cy={1100}
          r={8}
          fill="#ffd43b"
          stroke={INK}
          strokeWidth={3}
        />
        {/* floor */}
        <rect x={0} y={1320} width={W} height={H - 1320} fill="#b08968" />
        <rect x={0} y={1320} width={W} height={14} fill={INK} opacity={0.3} />
        {bed && (
          <g>
            {/* bed: headboard on the left, pillow, mattress, legs */}
            <rect
              x={30}
              y={1080}
              width={60}
              height={420}
              rx={14}
              fill="#8b4513"
              stroke={INK}
              strokeWidth={9}
            />
            <rect
              x={60}
              y={1300}
              width={860}
              height={110}
              rx={20}
              fill="#f1f3f5"
              stroke={INK}
              strokeWidth={9}
            />
            <rect
              x={60}
              y={1400}
              width={860}
              height={60}
              fill="#a0522d"
              stroke={INK}
              strokeWidth={8}
            />
            <rect
              x={880}
              y={1400}
              width={30}
              height={150}
              fill="#8b4513"
              stroke={INK}
              strokeWidth={6}
            />
            <rect
              x={90}
              y={1400}
              width={30}
              height={150}
              fill="#8b4513"
              stroke={INK}
              strokeWidth={6}
            />
            <ellipse
              cx={230}
              cy={1290}
              rx={110}
              ry={50}
              fill="#fff"
              stroke={INK}
              strokeWidth={8}
            />
          </g>
        )}
        {!bed && (
          <g>
            {/* study table with books */}
            <rect
              x={30}
              y={1180}
              width={420}
              height={36}
              rx={6}
              fill="#a0522d"
              stroke={INK}
              strokeWidth={8}
            />
            <rect
              x={60}
              y={1216}
              width={24}
              height={200}
              fill="#8b4513"
              stroke={INK}
              strokeWidth={6}
            />
            <rect
              x={400}
              y={1216}
              width={24}
              height={200}
              fill="#8b4513"
              stroke={INK}
              strokeWidth={6}
            />
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={70 + i * 8}
                y={1150 - i * 32}
                width={170}
                height={30}
                rx={4}
                fill={["#4dabf7", "#ff6b6b", "#ffd43b", "#69db7c"][i]}
                stroke={INK}
                strokeWidth={5}
              />
            ))}
          </g>
        )}
      </Svg>
    </>
  );
};

/** Darkness after the power cut: deep blue, with a soft glow where the phone is. */
export const Dark: React.FC<{
  glowX: number;
  glowY: number;
  amount?: number;
}> = ({ glowX, glowY, amount = 1 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at ${glowX}px ${glowY}px, rgba(180,220,255,0) 0px, rgba(10,16,48,${0.55 * amount}) 300px, rgba(5,8,30,${0.78 * amount}) 700px)`,
      pointerEvents: "none",
    }}
  />
);

/** Battery bar that fills to pct; red and blinking at 0. */
const Battery: React.FC<{ x: number; y: number; pct: number; at: number }> = ({
  x,
  y,
  pct,
  at,
}) => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [at, at + 12], [0, pct], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blink = pct === 0 && Math.floor(frame / 8) % 2 === 0;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x={-80}
        y={-34}
        width={160}
        height={68}
        rx={12}
        fill={pct === 0 ? (blink ? "#e03131" : "#ffc9c9") : "#f1f3f5"}
        stroke={INK}
        strokeWidth={7}
      />
      <rect x={80} y={-14} width={14} height={28} rx={4} fill={INK} />
      {pct > 0 && (
        <rect
          x={-72}
          y={-26}
          width={(144 * fill) / 100}
          height={52}
          rx={8}
          fill="#40c057"
        />
      )}
      <text
        x={0}
        y={-50}
        fontSize={44}
        textAnchor="middle"
        fill={INK}
        fontFamily={FONT_FAMILY}
        fontWeight={800}
      >
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
        <rect
          x={-150}
          y={-230}
          width={300}
          height={460}
          rx={30}
          fill={hot ? "#fff3bf" : "#f8f9fa"}
          stroke={hot ? "#f08c00" : INK}
          strokeWidth={hot ? 12 : 9}
        />
        <SignText
          x={0}
          y={-180}
          size={40}
          text={label}
          fill={INK}
          stroke="#f8f9fa"
        />
        {kind === "phone" && (
          <g transform="translate(0 -40) rotate(-12)">
            <rect
              x={-55}
              y={-100}
              width={110}
              height={200}
              rx={18}
              fill="#1c3d7a"
              stroke={INK}
              strokeWidth={8}
            />
            <rect
              x={-42}
              y={-84}
              width={84}
              height={160}
              rx={8}
              fill="#74c0fc"
            />
            <path
              d="M-30 -70 L20 -84"
              stroke="#fff"
              strokeWidth={8}
              opacity={0.6}
            />
          </g>
        )}
        {kind === "torch" && (
          <g transform="translate(0 -40) rotate(-30)">
            <rect
              x={-26}
              y={-30}
              width={52}
              height={150}
              rx={14}
              fill="#343a40"
              stroke={INK}
              strokeWidth={8}
            />
            <path
              d="M-26 -30 L-46 -100 L46 -100 L26 -30 Z"
              fill="#495057"
              stroke={INK}
              strokeWidth={8}
              strokeLinejoin="round"
            />
            <ellipse
              cx={0}
              cy={-100}
              rx={46}
              ry={14}
              fill="#ced4da"
              stroke={INK}
              strokeWidth={6}
            />
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
export const PowerBank: React.FC<{
  x: number;
  y: number;
  at: number;
  s?: number;
}> = ({ x, y, at, s = 1 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = popSpring(frame, at);
  return (
    <Svg>
      <g
        transform={`translate(${x} ${y + Math.sin(frame / 9) * 8}) scale(${p * s}) rotate(-8)`}
      >
        <rect
          x={-120}
          y={-70}
          width={240}
          height={140}
          rx={26}
          fill="#3b5bdb"
          stroke={INK}
          strokeWidth={9}
        />
        <circle
          cx={0}
          cy={0}
          r={36}
          fill="none"
          stroke="#a5d8ff"
          strokeWidth={6}
        />
        <path
          d="M-8 -20 L10 -2 L-6 2 L8 22"
          fill="none"
          stroke="#ffd43b"
          strokeWidth={7}
          strokeLinejoin="round"
        />
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={i}
            cx={-80 + i * 14}
            cy={48}
            r={5}
            fill={i < 4 ? "#69db7c" : "#495057"}
          />
        ))}
        <path
          d="M120 0 Q190 0 200 70"
          fill="none"
          stroke={INK}
          strokeWidth={14}
          strokeLinecap="round"
        />
        <path
          d="M120 0 Q190 0 200 70"
          fill="none"
          stroke="#f8f9fa"
          strokeWidth={7}
          strokeLinecap="round"
        />
      </g>
    </Svg>
  );
};

/** Wall clock showing ~6:00 (the bus), ticking. */
export const BusClock: React.FC<{ x: number; y: number; at: number }> = ({
  x,
  y,
  at,
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = popSpring(frame, at);
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) scale(${p})`}>
        <circle r={110} fill="#fff" stroke={INK} strokeWidth={10} />
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={i}
            d="M0 -92 L0 -78"
            stroke={INK}
            strokeWidth={6}
            transform={`rotate(${i * 30})`}
          />
        ))}
        <path
          d="M0 0 L0 -70"
          stroke={INK}
          strokeWidth={9}
          strokeLinecap="round"
        />
        <path
          d="M0 0 L0 54"
          stroke={INK}
          strokeWidth={12}
          strokeLinecap="round"
        />
        <path
          d="M0 0 L0 -84"
          stroke="#e03131"
          strokeWidth={4}
          transform={`rotate(${(frame - at) * 6})`}
        />
        <circle r={10} fill={INK} />
        <text
          x={0}
          y={160}
          fontSize={44}
          textAnchor="middle"
          fill="#fff"
          stroke={INK}
          strokeWidth={8}
          paintOrder="stroke"
          fontFamily={FONT_FAMILY}
          fontWeight={800}
        >
          BUS 6 AM
        </text>
      </g>
    </Svg>
  );
};

/** 5-4-3-2-1 countdown ring (the "jaldi" timer). */
export const Countdown: React.FC<{ x: number; y: number; at: number }> = ({
  x,
  y,
  at,
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = (frame - at) / 30;
  const n = Math.max(1, 5 - Math.floor(t * 2));
  const frac = (t * 2) % 1;
  const r = 80;
  const c = 2 * Math.PI * r;
  return (
    <div
      style={{
        ...UI,
        position: "absolute",
        left: x - 100,
        top: y - 100,
        width: 200,
        height: 200,
        transform: `scale(${popSpring(frame, at)})`,
      }}
    >
      <svg width={200} height={200}>
        <circle
          cx={100}
          cy={100}
          r={90}
          fill="#ffd43b"
          stroke={INK}
          strokeWidth={9}
        />
        <circle
          cx={100}
          cy={100}
          r={r}
          fill="none"
          stroke="#e8590c"
          strokeWidth={14}
          strokeDasharray={`${c * (1 - frac)} ${c}`}
          transform="rotate(-90 100 100)"
        />
        <text
          x={100}
          y={128}
          fontSize={84}
          textAnchor="middle"
          fill={INK}
          fontFamily={FONT_FAMILY}
          fontWeight={800}
        >
          {n}
        </text>
      </svg>
    </div>
  );
};

/** Blanket over the sleeping girl; flies off to the right (with gravity) when she jumps up at `offAt`. */
export const Blanket: React.FC<{ offAt: number }> = ({ offAt }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, (frame - offAt) / 30);
  if (t > 1.2) return null;
  const x = t * 700;
  const y = -t * 300 + 0.5 * 2400 * t * t;
  return (
    <Svg>
      <g transform={`translate(${x} ${y}) rotate(${t * 70} 620 1300)`}>
        <path
          d="M470 1220 Q700 1180 920 1230 L930 1420 Q700 1440 460 1420 Z"
          fill="#9775fa"
          stroke={INK}
          strokeWidth={9}
          strokeLinejoin="round"
        />
        {[540, 660, 780, 880].map((cx) => (
          <circle
            key={cx}
            cx={cx}
            cy={1330}
            r={22}
            fill="#e5dbff"
            opacity={0.8}
          />
        ))}
      </g>
    </Svg>
  );
};

/** Floating "Z z z" while asleep. */
export const Zzz: React.FC<{ x: number; y: number; until: number }> = ({
  x,
  y,
  until,
}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  return (
    <Svg>
      {[0, 1, 2].map((i) => {
        const t = ((frame + i * 10) % 30) / 30;
        return (
          <text
            key={i}
            x={x + t * 60 + i * 10}
            y={y - t * 120}
            fontSize={50 + i * 14}
            fill="#fff"
            stroke={INK}
            strokeWidth={8}
            paintOrder="stroke"
            opacity={1 - t}
            fontFamily={FONT_FAMILY}
            fontWeight={800}
          >
            Z
          </text>
        );
      })}
    </Svg>
  );
};

/** Huge steel safe filling the right side: thick door, rivets, a spoked wheel handle, three heavy bolts, crossed chains
 *  with a giant padlock and a dead fingerprint pad. `tugAt` frames make the wheel jerk (it never turns far: it's stuck). */
export const BigLocker: React.FC<{ tugAt: number[] }> = ({ tugAt }) => {
  const frame = useCurrentFrame();
  const tug = tugAt.reduce((m, f) => {
    const t = frame - f;
    return t >= 0 && t < 10 ? m + Math.sin(t * 2.2) * (10 - t) * 0.9 : m;
  }, 0);
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <Svg>
      <g transform={`translate(${tug * 0.4} 0)`}>
        {/* body + shadow */}
        <ellipse cx={810} cy={1745} rx={330} ry={40} fill={INK} opacity={0.35} />
        <rect x={500} y={430} width={600} height={1320} rx={30} fill="#3d4450" stroke={INK} strokeWidth={14} />
        <rect x={540} y={470} width={540} height={1240} rx={20} fill="#535b68" stroke={INK} strokeWidth={10} />
        {/* rivets */}
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i}>
            <circle cx={565} cy={510 + i * 100} r={10} fill="#868e96" stroke={INK} strokeWidth={4} />
            <circle cx={1055} cy={510 + i * 100} r={10} fill="#868e96" stroke={INK} strokeWidth={4} />
          </g>
        ))}
        {/* three heavy bolts sticking into the frame */}
        {[700, 1050, 1400].map((by) => (
          <g key={by}>
            <rect x={470} y={by - 26} width={110} height={52} rx={10} fill="#adb5bd" stroke={INK} strokeWidth={8} />
            <rect x={455} y={by - 34} width={30} height={68} rx={6} fill="#495057" stroke={INK} strokeWidth={6} />
          </g>
        ))}
        {/* spoked wheel handle (jerks a little, never turns) */}
        <g transform={`translate(810 1000) rotate(${tug * 1.5})`}>
          <circle r={130} fill="none" stroke={INK} strokeWidth={30} />
          <circle r={130} fill="none" stroke="#ced4da" strokeWidth={16} />
          {[0, 60, 120].map((a) => (
            <path key={a} d="M-130 0 L130 0" stroke={INK} strokeWidth={22} transform={`rotate(${a})`} />
          ))}
          {[0, 60, 120].map((a) => (
            <path key={`i${a}`} d="M-126 0 L126 0" stroke="#adb5bd" strokeWidth={10} transform={`rotate(${a})`} />
          ))}
          <circle r={44} fill="#868e96" stroke={INK} strokeWidth={10} />
        </g>
        {/* fingerprint pad, dead (red blink, 0%) */}
        <rect x={720} y={590} width={180} height={230} rx={22} fill="#212529" stroke={INK} strokeWidth={9} />
        <rect x={755} y={620} width={110} height={130} rx={16} fill="#111" stroke="#495057" strokeWidth={4} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${785 + i * 3} ${645 + i * 22} Q810 ${630 + i * 22} ${835 - i * 3} ${645 + i * 22}`} fill="none" stroke="#343a40" strokeWidth={5} />
        ))}
        <circle cx={810} cy={785} r={14} fill={blink ? "#e03131" : "#5c1010"} stroke={INK} strokeWidth={4} />
        {/* crossed chains + giant padlock */}
        {[-1, 1].map((sd) => (
          <g key={sd}>
            {Array.from({ length: 11 }).map((_, k) => {
              const t = k / 10;
              const cx = 540 + 540 * (sd > 0 ? t : 1 - t);
              const cy = 1150 + 420 * t;
              return <ellipse key={k} cx={cx} cy={cy} rx={34} ry={18} fill="none" stroke={INK} strokeWidth={16} transform={`rotate(${sd * 38} ${cx} ${cy})`} />;
            })}
            {Array.from({ length: 11 }).map((_, k) => {
              const t = k / 10;
              const cx = 540 + 540 * (sd > 0 ? t : 1 - t);
              const cy = 1150 + 420 * t;
              return <ellipse key={`h${k}`} cx={cx} cy={cy} rx={34} ry={18} fill="none" stroke="#adb5bd" strokeWidth={7} transform={`rotate(${sd * 38} ${cx} ${cy})`} />;
            })}
          </g>
        ))}
        <g transform={`translate(810 ${1430 + Math.abs(tug) * 1.2})`}>
          <path d="M-60 -40 L-60 -100 Q-60 -170 0 -170 Q60 -170 60 -100 L60 -40" fill="none" stroke={INK} strokeWidth={34} />
          <path d="M-60 -40 L-60 -100 Q-60 -170 0 -170 Q60 -170 60 -100 L60 -40" fill="none" stroke="#adb5bd" strokeWidth={18} />
          <rect x={-110} y={-50} width={220} height={190} rx={26} fill="#f2c94c" stroke={INK} strokeWidth={12} />
          <circle cx={0} cy={30} r={22} fill={INK} />
          <rect x={-8} y={36} width={16} height={56} rx={6} fill={INK} />
        </g>
        <text x={810} y={545} fontSize={44} textAnchor="middle" fill="#ced4da" stroke={INK} strokeWidth={6} paintOrder="stroke" fontFamily={FONT_FAMILY} fontWeight={800}>
          SAFE
        </text>
      </g>
    </Svg>
  );
};
