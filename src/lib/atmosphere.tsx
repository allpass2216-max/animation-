// Toon-style night atmosphere: cool blue grade, warm top glow, and slow floating light particles (like soft snow/dust).
import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { H, W } from "./reel";

export const ToonNight: React.FC<{ particles?: number }> = ({ particles = 46 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {/* cool night grade (multiply) + warm glow (screen) */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(40,50,140,0.14), rgba(30,20,90,0.05) 60%, rgba(20,10,60,0.16))", mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(255,190,140,0.18), transparent 60%)", mixBlendMode: "screen" }} />
      <AbsoluteFill>
        <svg width={W} height={H}>
          {Array.from({ length: particles }).map((_, i) => {
            const speed = 0.6 + random(`ps${i}`) * 1.4;
            const x0 = random(`px${i}`) * W;
            const y = ((random(`py${i}`) * (H + 100) + frame * speed) % (H + 100)) - 50;
            const x = x0 + Math.sin(frame / (30 + i) + i) * 30;
            const r = 2 + random(`pr${i}`) * 5;
            return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.25 + random(`po${i}`) * 0.5} />;
          })}
        </svg>
      </AbsoluteFill>
    </>
  );
};

/** Anime painted light: soft diagonal light rays + warm bloom + gentle dust in the light. */
export const AnimeLight: React.FC<{ warm?: boolean }> = ({ warm = true }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: warm ? "linear-gradient(160deg, rgba(255,214,150,0.22), rgba(255,180,120,0.04) 55%, rgba(80,60,140,0.12))" : "linear-gradient(160deg, rgba(160,200,255,0.2), rgba(40,40,90,0.15))", mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.55 }}>
        <svg width={W} height={H}>
          <defs>
            <linearGradient id="animeRay" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff4d6" stopOpacity="0.6" />
              <stop offset="1" stopColor="#fff4d6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M${-100 + i * 210} -50 L${30 + i * 210} -50 L${520 + i * 160} ${H} L${330 + i * 160} ${H} Z`}
              fill="url(#animeRay)"
              opacity={0.35 + Math.sin(frame / 25 + i) * 0.1}
            />
          ))}
          {Array.from({ length: 22 }).map((_, i) => (
            <circle
              key={i}
              cx={random(`ax${i}`) * W + Math.sin(frame / 30 + i) * 16}
              cy={((random(`ay${i}`) * H - frame * 0.5) % H + H) % H}
              r={2 + random(`ar${i}`) * 3}
              fill="#fff8e0"
              opacity={0.6}
            />
          ))}
        </svg>
      </AbsoluteFill>
    </>
  );
};

/** Anime surprise beat: radial speed lines + white edge flash + big red "!?" that slams in at `at` for `dur` frames. */
export const AnimeShock: React.FC<{ at: number; dur?: number; cy?: number; textX?: number; textY?: number }> = ({ at, dur = 26, cy = 900, textX = 760, textY = 760 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t >= dur) return null;
  const fade = t > dur - 6 ? (dur - t) / 6 : 1;
  const bang = t < 6 ? 2.2 - (t / 6) * 1.2 : 1;
  return (
    <AbsoluteFill style={{ opacity: fade, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% ${(cy / H) * 100}%, rgba(255,255,255,0) 35%, rgba(255,250,240,0.7) 75%)` }} />
      <svg width={W} height={H}>
        {Array.from({ length: 64 }).map((_, i) => {
          const a = (i / 64) * Math.PI * 2 + random(`ka${i}${Math.floor(frame / 2)}`) * 0.05;
          const r0 = 520 + random(`kr${i}${Math.floor(frame / 2)}`) * 200;
          const cx = W / 2;
          return (
            <path
              key={i}
              d={`M${cx + Math.cos(a) * r0} ${cy + Math.sin(a) * r0} L${cx + Math.cos(a + 0.014) * 1600} ${cy + Math.sin(a + 0.014) * 1600} L${cx + Math.cos(a - 0.014) * 1600} ${cy + Math.sin(a - 0.014) * 1600} Z`}
              fill="#2a1d24"
              opacity={0.7}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: textX,
          top: textY,
          transform: `translate(-50%, -50%) scale(${bang}) rotate(12deg)`,
          fontFamily: "Poppins",
          fontWeight: 800,
          fontSize: 180,
          color: "#e03131",
          WebkitTextStroke: "10px #fff",
          paintOrder: "stroke fill",
          textShadow: "6px 6px 0 #2a1d24",
        }}
      >
        !?
      </div>
    </AbsoluteFill>
  );
};
