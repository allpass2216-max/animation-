// AiCrore pieces: hostel room, a big phone with screens (balance counter, bank alert, transfer list, chat, call),
// coin rain with gravity, cyber-police building, money flowing out, trash bin.
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "../../lib/fonts";
import { H, INK, W } from "../../lib/reel";
import { SignText } from "../../lib/world";

const UI = { fontFamily: FONT_FAMILY, fontWeight: 800 as const };

/** Hostel room: night (blue) or morning (warm sun through the window). */
export const HostelRoom: React.FC<{ morning?: boolean }> = ({ morning }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <rect x={-200} y={0} width={W + 400} height={H} fill={morning ? "#ffe0b3" : "#28305e"} />
      {/* window */}
      <rect x={60} y={300} width={300} height={360} fill={morning ? "#a5d8ff" : "#0b1033"} stroke={INK} strokeWidth={10} />
      <path d="M210 300 L210 660 M60 480 L360 480" stroke={INK} strokeWidth={9} />
      {morning ? <circle cx={300} cy={380} r={46} fill="#ffd43b" /> : <circle cx={120} cy={360} r={26} fill="#fff4c2" />}
      {/* ceiling fan */}
      <g transform="translate(700 120)">
        <path d="M0 -120 L0 0" stroke={INK} strokeWidth={10} />
        <g transform={`rotate(${frame * 25})`}>
          {[0, 120, 240].map((a) => (
            <rect key={a} x={-12} y={-150} width={24} height={150} rx={10} fill="#ced4da" stroke={INK} strokeWidth={6} transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r={22} fill="#868e96" stroke={INK} strokeWidth={6} />
      </g>
      {/* poster */}
      <rect x={-120} y={760} width={160} height={220} fill={morning ? "#e599f7" : "#5f3dc4"} stroke={INK} strokeWidth={8} transform="rotate(-4 -40 870)" />
      {/* floor + bed edge */}
      <rect x={-200} y={1500} width={W + 400} height={H} fill={morning ? "#c08552" : "#3a2f4a"} />
      <rect x={-200} y={1500} width={W + 400} height={14} fill={INK} opacity={0.3} />
      {/* phone glow at night */}
      {!morning && <ellipse cx={720} cy={1100} rx={420} ry={520} fill="#74c0fc" opacity={0.12} />}
    </>
  );
};

/** Big floating phone (screen-space), with its screen content as children. */
export const Phone: React.FC<{ x?: number; y?: number; w?: number; h?: number; buzzAt?: number; children: React.ReactNode }> = ({
  x = 520,
  y = 700,
  w = 440,
  h = 800,
  buzzAt,
  children,
}) => {
  const frame = useCurrentFrame();
  const buzz = buzzAt !== undefined && frame >= buzzAt && frame < buzzAt + 14 ? Math.sin((frame - buzzAt) * 3) * 8 : 0;
  const float = Math.sin(frame / 15) * 6;
  return (
    <div
      style={{
        position: "absolute",
        left: x + buzz,
        top: y + float,
        width: w,
        height: h,
        borderRadius: 54,
        background: "#111827",
        border: `10px solid ${INK}`,
        boxShadow: `0 16px 0 ${INK}, 0 0 80px rgba(116,192,252,0.45)`,
        transform: `rotate(${3 + buzz * 0.3}deg)`,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 18, top: 18, right: 18, bottom: 18, borderRadius: 38, background: "#f8f9fa", overflow: "hidden" }}>{children}</div>
      <div style={{ position: "absolute", left: "50%", top: 22, width: 90, height: 18, marginLeft: -45, borderRadius: 9, background: "#111827" }} />
    </div>
  );
};

const inr = (n: number) => {
  // Indian digit grouping: 50,00,00,000
  const s = Math.round(n).toString();
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${rest},${last3}`;
};

/** Balance screen: counts from `fromAmt` to `toAmt` between frames a..b (ease-in, accelerating like a jackpot). */
export const BalanceScreen: React.FC<{ a: number; b: number; fromAmt: number; toAmt: number; label: string; alertAt?: number }> = ({
  a,
  b,
  fromAmt,
  toAmt,
  label,
  alertAt,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const amt = fromAmt * Math.pow(toAmt / fromAmt, t * t);
  const alert = alertAt !== undefined && frame >= alertAt ? interpolate(frame - alertAt, [0, 8], [-200, 0], { extrapolateRight: "clamp" }) : null;
  return (
    <div style={{ ...UI, position: "absolute", inset: 0, padding: "70px 26px", color: INK }}>
      <div style={{ fontSize: 30, color: "#868e96" }}>{label}</div>
      <div style={{ fontSize: 30, marginTop: 30, color: "#495057" }}>BALANCE</div>
      <div style={{ fontSize: inr(amt).length > 8 ? 44 : 60, marginTop: 6, color: t >= 1 ? "#2b8a3e" : INK }}>₹{inr(amt)}</div>
      <div style={{ marginTop: 40, height: 14, borderRadius: 7, background: "#e9ecef" }}>
        <div style={{ width: `${Math.max(4, t * 100)}%`, height: 14, borderRadius: 7, background: "#40c057" }} />
      </div>
      {alert !== null && (
        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            top: 360 + alert,
            padding: "18px 20px",
            borderRadius: 24,
            background: "#ebfbee",
            border: `6px solid ${INK}`,
            boxShadow: `0 8px 0 ${INK}`,
          }}
        >
          <div style={{ fontSize: 26, color: "#2b8a3e" }}>BANK ALERT</div>
          <div style={{ fontSize: 44, marginTop: 4 }}>+₹50,00,00,000</div>
          <div style={{ fontSize: 24, color: "#495057" }}>CREDITED TO YOUR A/C</div>
        </div>
      )}
    </div>
  );
};

/** Transfer list scrolling fast: +₹2,00,000 rows from unknown accounts, with a running count. */
export const TxScreen: React.FC<{ a: number; countTo: number }> = ({ a, countTo }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - a);
  const count = Math.min(countTo, Math.round(interpolate(t, [0, 40], [0, countTo], { extrapolateRight: "clamp" }) ** 1));
  const scroll = (t * 26) % 90;
  return (
    <div style={{ ...UI, position: "absolute", inset: 0, color: INK }}>
      <div style={{ padding: "64px 24px 12px", background: "#fff", borderBottom: `5px solid ${INK}` }}>
        <div style={{ fontSize: 26, color: "#868e96" }}>TRANSFERS TODAY</div>
        <div style={{ fontSize: 58 }}>{inr(count)}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 210 - scroll }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0 22px", height: 90, alignItems: "center", borderBottom: "3px solid #dee2e6" }}>
            <div style={{ fontSize: 22, color: "#868e96" }}>
              A/C XX{Math.floor(1000 + random(`acc${i + Math.floor(t / 4)}`) * 8999)}
              <div style={{ fontSize: 18, color: "#e03131" }}>UNKNOWN</div>
            </div>
            <div style={{ fontSize: 30, color: "#2b8a3e" }}>+₹2,00,000</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/** AI chat screen: bubbles appear on their frames. */
export const ChatScreen: React.FC<{ msgs: { f: number; text: string; me?: boolean; red?: boolean }[]; title?: string; dark?: boolean }> = ({ msgs, title = "AI MONEY BOT · ONLINE", dark }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...UI, position: "absolute", inset: 0, background: dark ? "#1b1f3b" : "#f1f3f5", padding: "60px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 26, color: dark ? "#adb5bd" : "#495057", textAlign: "center", marginBottom: 6 }}>{title}</div>
      {msgs.map((m, i) => {
        if (frame < m.f) return null;
        const p = Math.min(1, (frame - m.f) / 6);
        return (
          <div
            key={i}
            style={{
              alignSelf: m.me ? "flex-end" : "flex-start",
              maxWidth: "86%",
              padding: "14px 18px",
              borderRadius: 24,
              fontSize: dark ? 40 : 30,
              lineHeight: 1.15,
              color: m.me ? "#fff" : m.red ? "#fff" : INK,
              background: m.me ? "#4263eb" : m.red ? "#e03131" : "#fff",
              border: `5px solid ${INK}`,
              transform: `scale(${0.6 + 0.4 * p})`,
              transformOrigin: m.me ? "100% 50%" : "0% 50%",
              opacity: p,
            }}
          >
            {m.text}
          </div>
        );
      })}
    </div>
  );
};

/** Incoming call: unknown number with pulsing rings. */
export const CallScreen: React.FC<{ a: number }> = ({ a }) => {
  const frame = useCurrentFrame();
  const t = frame - a;
  return (
    <div style={{ ...UI, position: "absolute", inset: 0, background: "#2b0a12", color: "#fff", textAlign: "center", paddingTop: 110 }}>
      <svg width={360} height={300} style={{ display: "block", margin: "0 auto" }}>
        {[0, 1, 2].map((i) => {
          const r = 60 + (((t + i * 10) % 30) / 30) * 100;
          return <circle key={i} cx={180} cy={150} r={r} fill="none" stroke="#ff8787" strokeWidth={6} opacity={1 - (r - 60) / 100} />;
        })}
        <circle cx={180} cy={150} r={60} fill="#495057" stroke={INK} strokeWidth={7} />
        <text x={180} y={175} fontSize={70} fill="#fff" textAnchor="middle" fontFamily={FONT_FAMILY} fontWeight={800}>
          ?
        </text>
      </svg>
      <div style={{ fontSize: 40 }}>UNKNOWN</div>
      <div style={{ fontSize: 26, color: "#ffa8a8", marginTop: 8 }}>CALLING…</div>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 120 }}>
        <div style={{ width: 90, height: 90, borderRadius: 45, background: "#e03131", border: `6px solid ${INK}` }} />
        <div style={{ width: 90, height: 90, borderRadius: 45, background: "#2f9e44", border: `6px solid ${INK}` }} />
      </div>
    </div>
  );
};

/** Coins raining with gravity and bouncing once on the floor. */
export const CoinRain: React.FC<{ at: number; floorY?: number; count?: number }> = ({ at, floorY = 1700, count = 18 }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / 30;
  if (t < 0) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      {Array.from({ length: count }).map((_, i) => {
        const delay = random(`cd${i}`) * 0.6;
        const tt = t - delay;
        if (tt < 0) return null;
        const x0 = 60 + random(`cx${i}`) * 960;
        const g = 2600;
        let y = -80 + 0.5 * g * tt * tt;
        const tLand = Math.sqrt((2 * (floorY + 80)) / g);
        if (tt > tLand) {
          const tb = tt - tLand;
          const v = g * tLand * 0.3;
          y = floorY - Math.max(0, v * tb - 0.5 * g * tb * tb);
        }
        const spin = Math.cos(tt * 12 + i);
        return (
          <g key={i} transform={`translate(${x0 + Math.sin(tt * 3 + i) * 20} ${y})`}>
            <ellipse rx={30 * Math.abs(spin) + 4} ry={30} fill="#ffd43b" stroke={INK} strokeWidth={6} />
            {Math.abs(spin) > 0.4 && <text x={0} y={11} fontSize={32} textAnchor="middle" fill="#8a6d1d" fontFamily={FONT_FAMILY} fontWeight={800}>₹</text>}
          </g>
        );
      })}
    </svg>
  );
};

/** Cyber police station + bank (option A). */
export const CyberCell: React.FC = () => (
  <>
    <rect x={-200} y={0} width={W + 400} height={H} fill="#a5d8ff" />
    <rect x={-40} y={600} width={600} height={900} fill="#dee2e6" stroke={INK} strokeWidth={10} />
    <rect x={20} y={640} width={480} height={110} rx={14} fill="#1864ab" stroke={INK} strokeWidth={9} />
    <SignText x={260} y={718} size={58} text="CYBER CELL" />
    <rect x={540} y={700} width={560} height={800} fill="#fff3bf" stroke={INK} strokeWidth={10} />
    <rect x={560} y={740} width={420} height={100} rx={14} fill="#2b8a3e" stroke={INK} strokeWidth={9} />
    <SignText x={770} y={810} size={62} text="BANK" />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={30 + i * 160} y={820} width={110} height={130} rx={8} fill="#e7f5ff" stroke={INK} strokeWidth={7} />
    ))}
    <rect x={-200} y={1500} width={W + 400} height={H} fill="#ced4da" />
    <rect x={-200} y={1500} width={W + 400} height={14} fill={INK} opacity={0.25} />
  </>
);

/** Money notes flying out of the phone towards a shady figure (option B). */
export const MoneyOut: React.FC<{ at: number; from: [number, number]; to: [number, number] }> = ({ at, from, to }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      {Array.from({ length: 8 }).map((_, i) => {
        const p = (((t + i * 5) % 30) / 30);
        const x = from[0] + (to[0] - from[0]) * p;
        const y = from[1] + (to[1] - from[1]) * p - Math.sin(p * Math.PI) * 90;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${p * 360})`} opacity={1 - p * 0.3}>
            <rect x={-40} y={-22} width={80} height={44} rx={6} fill="#8fe08c" stroke={INK} strokeWidth={5} />
            <circle r={10} fill="none" stroke="#2b8a3e" strokeWidth={4} />
          </g>
        );
      })}
    </svg>
  );
};

/** Shady caller silhouette with a hood (option B target). */
export const ShadyGuy: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y + Math.sin(frame / 10) * 4})`}>
      <path d="M-140 0 L-110 -380 Q0 -460 110 -380 L140 0 Z" fill="#212529" stroke={INK} strokeWidth={10} />
      <circle cx={0} cy={-470} r={110} fill="#212529" stroke={INK} strokeWidth={10} />
      <ellipse cx={-38} cy={-470} rx={22} ry={12} fill="#ff6b6b" />
      <ellipse cx={38} cy={-470} rx={22} ry={12} fill="#ff6b6b" />
      <path d="M-40 -420 Q0 -400 40 -420" fill="none" stroke="#ff6b6b" strokeWidth={8} strokeLinecap="round" />
    </g>
  );
};

/** Trash bin the app icon drops into (option C). */
export const TrashDrop: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / 30;
  const iconY = t < 0 ? -420 : Math.min(-420 + 0.5 * 3000 * t * t, -80);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      <g transform={`translate(${x} ${y})`}>
        {iconY < -90 && (
          <g transform={`translate(0 ${iconY}) rotate(${t * 200})`}>
            <rect x={-60} y={-60} width={120} height={120} rx={28} fill="#7048e8" stroke={INK} strokeWidth={8} />
            <text x={0} y={18} fontSize={52} textAnchor="middle" fill="#fff" fontFamily={FONT_FAMILY} fontWeight={800}>
              AI
            </text>
          </g>
        )}
        <path d="M-120 -60 L120 -60 L95 200 L-95 200 Z" fill="#868e96" stroke={INK} strokeWidth={10} />
        <rect x={-140} y={-90} width={280} height={36} rx={10} fill="#adb5bd" stroke={INK} strokeWidth={9} transform={t > 0.3 ? `rotate(-18 -140 -72)` : ""} />
        {[-50, 0, 50].map((lx) => (
          <path key={lx} d={`M${lx} -20 L${lx * 0.85} 170`} stroke={INK} strokeWidth={8} />
        ))}
      </g>
    </svg>
  );
};
