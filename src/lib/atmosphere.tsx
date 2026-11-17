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
