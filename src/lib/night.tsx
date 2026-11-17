// Night-time world pieces for LateNight: sky, interior, door, wall clock, pill strip, shop shutters, bill, bike, party, office, lamp.
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { H, INK, W } from "./reel";
import { SignText } from "./world";

export const NightSky: React.FC<{ top?: string; bottom?: string; moon?: boolean }> = ({ top = "#0b1033", bottom = "#2b3a7a", moon = true }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${top}, ${bottom})` }}>
      <svg width={W} height={H}>
        {Array.from({ length: 40 }).map((_, i) => (
          <circle
            key={i}
            cx={random(`sx${i}`) * W}
            cy={random(`sy${i}`) * 1100}
            r={2 + random(`sr${i}`) * 3}
            fill="#fff"
            opacity={0.4 + 0.5 * Math.abs(Math.sin(frame / 20 + i))}
          />
        ))}
        {moon && (
          <g transform="translate(880 700)">
            <circle r={110} fill="#fff4c2" opacity={0.25} />
            <circle r={78} fill="#fff4c2" stroke={INK} strokeWidth={8} />
            <circle cx={-22} cy={-14} r={14} fill="#f0e2a0" />
            <circle cx={20} cy={22} r={10} fill="#f0e2a0" />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

/** Warm living-room wall with a lamp glow, framed photos and floor. */
export const Interior: React.FC<{ wall?: string; floorY?: number }> = ({ wall = "#c9894f", floorY = 1500 }) => (
  <>
    <rect x={-200} y={0} width={W + 400} height={floorY} fill={wall} />
    <rect x={-200} y={floorY} width={W + 400} height={H - floorY} fill="#7a4b2e" />
    <rect x={-200} y={floorY} width={W + 400} height={16} fill={INK} opacity={0.3} />
    {[
      [140, 980, 120, 90],
      [300, 1000, 90, 120],
    ].map(([x, y, w, h], i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} fill="#f3d9b1" stroke={INK} strokeWidth={8} />
        <circle cx={x + w / 2} cy={y + h / 2 - 8} r={16} fill="#b07a55" />
        <rect x={x + w / 2 - 20} y={y + h / 2 + 10} width={40} height={20} rx={8} fill="#b07a55" />
      </g>
    ))}
  </>
);

/** Open door showing the night lane (and optionally a bike) — warm inside, cool outside. */
export const Door: React.FC<{ x: number; y: number; w?: number; h?: number; bike?: boolean; headlightAt?: number }> = ({
  x,
  y,
  w = 380,
  h = 760,
  bike = true,
  headlightAt,
}) => {
  const frame = useCurrentFrame();
  const beam = headlightAt !== undefined && frame >= headlightAt ? Math.min(1, (frame - headlightAt) / 6) : 0;
  return (
    <g>
      <rect x={x - 18} y={y - h - 18} width={w + 36} height={h + 18} fill="#6b3f22" stroke={INK} strokeWidth={10} />
      <rect x={x} y={y - h} width={w} height={h} fill="#1c2452" />
      <rect x={x} y={y - 260} width={w} height={260} fill="#2a3266" />
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={i} cx={x + 30 + random(`ds${i}`) * (w - 60)} cy={y - h + 40 + random(`dy${i}`) * 300} r={3} fill="#fff" opacity={0.7} />
      ))}
      {bike && (
        <g transform={`translate(${x + w / 2} ${y - 60}) scale(0.55)`}>
          <Bike />
        </g>
      )}
      {beam > 0 && <path d={`M${x + w / 2 + 60} ${y - 110} L${x + w + 300} ${y - 260} L${x + w + 300} ${y + 40} Z`} fill="#fff6c4" opacity={0.35 * beam} />}
      {/* open door leaf */}
      <path d={`M${x} ${y - h} L${x - 120} ${y - h + 40} L${x - 120} ${y - 30} L${x} ${y}`} fill="#8a5530" stroke={INK} strokeWidth={9} />
      <circle cx={x - 95} cy={y - h / 2} r={10} fill="#f6d55c" stroke={INK} strokeWidth={5} />
    </g>
  );
};

/** Motorbike (side view). */
export const Bike: React.FC<{ wheelSpin?: number }> = ({ wheelSpin = 0 }) => (
  <g>
    {[-150, 150].map((wx) => (
      <g key={wx} transform={`translate(${wx} 0) rotate(${wheelSpin})`}>
        <circle r={80} fill="#2b2b33" stroke={INK} strokeWidth={12} />
        <circle r={36} fill="#868e96" stroke={INK} strokeWidth={8} />
        <path d="M-36 0 L36 0 M0 -36 L0 36" stroke={INK} strokeWidth={6} />
      </g>
    ))}
    <path d="M-150 0 L-40 -110 L110 -110 L150 0" fill="none" stroke={INK} strokeWidth={22} strokeLinejoin="round" />
    <path d="M-110 -120 Q-20 -190 100 -140 L80 -100 L-90 -100 Z" fill="#c92a2a" stroke={INK} strokeWidth={10} />
    <rect x={-180} y={-150} width={120} height={36} rx={14} fill="#343a40" stroke={INK} strokeWidth={9} />
    <path d="M110 -110 L150 -230 L200 -240" fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" />
    <circle cx={170} cy={-170} r={26} fill="#fff6c4" stroke={INK} strokeWidth={8} />
  </g>
);

/** Wall clock; hour/minute given in hours (e.g. 1.0 = 1:00). */
export const WallClock: React.FC<{ x: number; y: number; r?: number; hours: number }> = ({ x, y, r = 90, hours }) => {
  const frame = useCurrentFrame();
  const hA = ((hours % 12) / 12) * 360;
  const mA = ((hours % 1) * 360) % 360;
  const sA = (frame % 30) * 12;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 14} fill="#6b3f22" stroke={INK} strokeWidth={10} />
      <circle r={r} fill="#fffaf0" stroke={INK} strokeWidth={6} />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M0 ${-r + 10} L0 ${-r + (i % 3 ? 20 : 30)}`} stroke={INK} strokeWidth={i % 3 ? 5 : 9} transform={`rotate(${i * 30})`} />
      ))}
      <path d={`M0 0 L0 ${-r * 0.5}`} stroke={INK} strokeWidth={12} strokeLinecap="round" transform={`rotate(${hA})`} />
      <path d={`M0 0 L0 ${-r * 0.78}`} stroke={INK} strokeWidth={8} strokeLinecap="round" transform={`rotate(${mA})`} />
      <path d={`M0 10 L0 ${-r * 0.82}`} stroke="#e03131" strokeWidth={4} transform={`rotate(${sA})`} />
      <circle r={9} fill={INK} />
    </g>
  );
};

/** Blister strip; `empty` pops the pills out one by one up to all-empty. */
export const PillStrip: React.FC<{ x: number; y: number; s?: number; emptyAt: number; shakeAt?: number }> = ({ x, y, s = 1, emptyAt, shakeAt = -1 }) => {
  const frame = useCurrentFrame();
  const shake = frame >= shakeAt && frame < shakeAt + 12 ? Math.sin((frame - shakeAt) * 2.5) * 8 : 0;
  return (
    <g transform={`translate(${x + shake} ${y}) scale(${s}) rotate(-8)`}>
      <rect x={-230} y={-110} width={460} height={220} rx={24} fill="#dee2e6" stroke={INK} strokeWidth={10} />
      {Array.from({ length: 10 }).map((_, i) => {
        const cx = -180 + (i % 5) * 90;
        const cy = i < 5 ? -50 : 50;
        const gone = frame >= emptyAt + i * 2;
        return (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={34} ry={30} fill={gone ? "#c9ced4" : "#f8f9fa"} stroke={INK} strokeWidth={7} />
            {!gone && <ellipse cx={cx} cy={cy} rx={20} ry={16} fill="#ff8787" stroke={INK} strokeWidth={5} />}
            {gone && <path d={`M${cx - 18} ${cy - 10} L${cx + 14} ${cy + 12} M${cx + 10} ${cy - 14} L${cx - 8} ${cy + 6}`} stroke={INK} strokeWidth={4} />}
          </g>
        );
      })}
    </g>
  );
};

/** Row of night shops with shutters; `closeAt` slams the lit MEDICAL shutter down. */
export const ShopRow: React.FC<{ y: number; closeAt?: number; open24?: boolean }> = ({ y, closeAt = 1e9, open24 }) => {
  const frame = useCurrentFrame();
  const shops = ["KIRANA", "MEDICAL", "MOBILE", "CHAI"];
  return (
    <g>
      {shops.map((name, i) => {
        const x = -120 + i * 330;
        const isMed = name === "MEDICAL";
        const t = isMed ? interpolate(frame, [closeAt - 8, closeAt], [0.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
        const lit = isMed && (frame < closeAt || open24);
        return (
          <g key={name}>
            <rect x={x} y={y - 620} width={310} height={620} fill="#3d3a5c" stroke={INK} strokeWidth={9} />
            <rect x={x + 20} y={y - 600} width={270} height={80} rx={10} fill={lit ? "#2fb36b" : "#495057"} stroke={INK} strokeWidth={7} />
            <SignText x={x + 155} y={y - 542} size={44} text={name} fill={lit ? "#fff" : "#ced4da"} />
            <rect x={x + 20} y={y - 500} width={270} height={500} fill={lit ? "#ffe8a3" : "#2b2a40"} />
            <g>
              <rect x={x + 20} y={y - 500} width={270} height={500 * t} fill="#868e96" stroke={INK} strokeWidth={7} />
              {Array.from({ length: Math.floor((500 * t) / 34) }).map((_, k) => (
                <path key={k} d={`M${x + 20} ${y - 500 + k * 34 + 30} L${x + 290} ${y - 500 + k * 34 + 30}`} stroke="#5c636a" strokeWidth={5} />
              ))}
            </g>
          </g>
        );
      })}
    </g>
  );
};

/** Medicine bill pulled out of a jacket pocket. */
export const PocketBill: React.FC<{ outAt: number; stampAt: number }> = ({ outAt, stampAt }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [outAt, outAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ease = 1 - Math.pow(1 - t, 3);
  const stamp = frame >= stampAt ? Math.max(1, 1.6 - (frame - stampAt) * 0.12) : 0;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      {/* jacket */}
      <rect x={0} y={1180} width={W} height={H - 1180} fill="#3b5bdb" />
      <path d="M540 1180 L540 1920" stroke={INK} strokeWidth={10} />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={528} y={1240 + i * 110} width={24} height={60} rx={8} fill="#adb5bd" stroke={INK} strokeWidth={5} />
      ))}
      <rect x={140} y={1440} width={320} height={260} rx={20} fill="#364fc7" stroke={INK} strokeWidth={10} />
      {/* bill */}
      <g transform={`translate(${300} ${1500 - ease * 620}) rotate(${-10 + ease * 8}) scale(${0.6 + ease * 0.5})`}>
        <rect x={-210} y={-300} width={420} height={560} fill="#fffdf5" stroke={INK} strokeWidth={9} />
        <SignText x={0} y={-220} size={50} text="24x7 MEDICAL" fill={INK} stroke="#fffdf5" />
        <path d="M-170 -180 L170 -180" stroke={INK} strokeWidth={5} strokeDasharray="14 10" />
        <SignText x={0} y={-110} size={44} text="BP TABLETS" fill="#495057" stroke="#fffdf5" />
        <SignText x={0} y={-40} size={40} text="x 30" fill="#495057" stroke="#fffdf5" />
        <path d="M-170 10 L170 10" stroke={INK} strokeWidth={5} strokeDasharray="14 10" />
        <SignText x={0} y={110} size={84} text="12:30 AM" fill="#e03131" stroke="#fffdf5" />
        {stamp > 0 && (
          <g transform={`translate(80 200) rotate(-14) scale(${stamp})`}>
            <rect x={-110} y={-44} width={220} height={88} rx={12} fill="none" stroke="#2f9e44" strokeWidth={9} />
            <SignText x={0} y={18} size={48} text="PAID" fill="#2f9e44" stroke="#fffdf5" />
          </g>
        )}
      </g>
      {/* pocket front over the bill bottom */}
      <rect x={140} y={1560} width={320} height={140} rx={20} fill="#4263eb" stroke={INK} strokeWidth={10} />
    </svg>
  );
};

/** Street lamp with a light cone. */
export const StreetLamp: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  const flicker = 0.32 + Math.sin(frame / 3) * 0.02;
  return (
    <g>
      <path d={`M${x + 60} ${y - 700} L${x - 200} ${y} L${x + 320} ${y} Z`} fill="#fff3bf" opacity={flicker} />
      <rect x={x - 14} y={y - 760} width={28} height={760} fill="#495057" stroke={INK} strokeWidth={7} />
      <path d={`M${x} ${y - 740} Q${x + 30} ${y - 790} ${x + 90} ${y - 740}`} fill="none" stroke={INK} strokeWidth={14} />
      <path d={`M${x + 40} ${y - 740} L${x + 140} ${y - 740} L${x + 115} ${y - 705} L${x + 65} ${y - 705} Z`} fill="#fff3bf" stroke={INK} strokeWidth={7} />
    </g>
  );
};

/** Party: disco ball and colour spots. */
export const Party: React.FC<{ flashAt: number }> = ({ flashAt }) => {
  const frame = useCurrentFrame();
  const boost = frame >= flashAt && frame < flashAt + 10 ? 1 : 0;
  return (
    <AbsoluteFill style={{ background: "#1a0b2e" }}>
      <svg width={W} height={H}>
        {["#ff6b6b", "#4dabf7", "#51cf66", "#fcc419", "#cc5de8"].map((c, i) => {
          const a = Math.sin(frame / 10 + i * 1.3) * 30;
          return <path key={i} d="M0 0 L-140 1400 L140 1400 Z" fill={c} opacity={0.22 + boost * 0.2} transform={`translate(${120 + i * 210} 700) rotate(${a})`} />;
        })}
        <g transform={`translate(540 760) rotate(${frame * 3})`}>
          <path d="M0 -240 L0 -100" stroke={INK} strokeWidth={8} />
          <circle r={90} fill="#ced4da" stroke={INK} strokeWidth={9} />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={-80 + (i % 4) * 40} y={-60 + Math.floor(i / 4) * 40} width={30} height={30} fill={i % 3 ? "#f8f9fa" : "#74c0fc"} opacity={0.8} />
          ))}
        </g>
        <rect x={0} y={1500} width={W} height={H - 1500} fill="#2b1a45" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={i * 140} y={1500} width={140} height={140} fill={(i + Math.floor(frame / 8)) % 2 ? "#5f3dc4" : "#3b2a6b"} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/** Night office desk with laptop and a paper pile that drops in at `pileAt`. */
export const OfficeDesk: React.FC<{ pileAt: number }> = ({ pileAt }) => {
  const frame = useCurrentFrame();
  const t = frame - pileAt;
  const fall = t < 0 ? -600 : t < 8 ? -600 + (t / 8) ** 2 * 600 : 0;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      <rect x={0} y={0} width={W} height={H} fill="#1f2a44" />
      {Array.from({ length: 4 }).map((_, i) => (
        <rect key={i} x={60 + i * 260} y={760} width={200} height={300} fill="#2c3e66" stroke={INK} strokeWidth={8} />
      ))}
      <rect x={0} y={1450} width={W} height={60} fill="#8d5a3b" stroke={INK} strokeWidth={9} />
      <rect x={0} y={1510} width={W} height={H} fill="#2a2238" />
      <g transform="translate(300 1450)">
        <rect x={-170} y={-230} width={340} height={220} rx={14} fill="#343a40" stroke={INK} strokeWidth={9} />
        <rect x={-150} y={-212} width={300} height={180} rx={6} fill="#a5d8ff" opacity={0.85 + Math.sin(frame / 4) * 0.1} />
        <rect x={-210} y={-12} width={420} height={24} rx={8} fill="#495057" stroke={INK} strokeWidth={7} />
      </g>
      <g transform={`translate(130 ${1450 + fall})`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={-90 + (i % 2) * 8} y={-40 - i * 36} width={180} height={40} fill="#fff" stroke={INK} strokeWidth={6} />
        ))}
      </g>
    </svg>
  );
};
