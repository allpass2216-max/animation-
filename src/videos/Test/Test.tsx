import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { FONT_FAMILY } from "../../lib/fonts";

export const TEST_DURATION = 150; // 5 s at 30 fps

export const Test: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Moving gradient: hue rotates and angle sweeps from frame 0.
  const hue = (frame * 2) % 360;
  const angle = 135 + Math.sin(frame / 20) * 40;
  const bg = `linear-gradient(${angle}deg, hsl(${hue},85%,55%), hsl(${(hue + 80) % 360},80%,45%) 55%, hsl(${(hue + 160) % 360},75%,30%))`;

  // Title pops in from frame 0 (already on screen, already moving) with a spring overshoot, then breathes.
  const popStart = 0;
  const pop = spring({ frame: frame - popStart, fps, config: { damping: 9, stiffness: 160, mass: 0.7 } });
  const breathe = 1 + Math.sin((frame - popStart) / 8) * 0.025;
  const scale = interpolate(pop, [0, 1], [0.35, 1]) * breathe;
  const rotate = interpolate(pop, [0, 1], [-12, -3]);

  return (
    <AbsoluteFill style={{ background: bg }}>
      {/* soft light + vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.25), transparent 55%), radial-gradient(circle, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 300 }}>
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 150,
            lineHeight: 1.05,
            textAlign: "center",
            color: "#FFE14D",
            WebkitTextStroke: "14px #1a1030",
            paintOrder: "stroke fill",
            textShadow: "0 12px 0 #1a1030",
            transform: `scale(${scale}) rotate(${rotate}deg)`,
          }}
        >
          STUDIO
          <br />
          READY!
        </div>
      </AbsoluteFill>
      <Sequence from={popStart}>
        <Audio src={staticFile("sfx/pop.wav")} volume={0.3} />
      </Sequence>
    </AbsoluteFill>
  );
};
