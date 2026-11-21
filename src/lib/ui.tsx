// Shared reel UI: A-D answer tiles (stacked at the top) and a Follow button with a finger tap.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "./fonts";
import { dropBounce, H, INK, popSpring, Sparkles, W } from "./reel";

export type Tile = { k: string; t: string; c: string; f: number };

/** Tiles drop in on their letter's word; the current one is highlighted. From `outroAt` all show a pulsing "?". */
export const Tiles: React.FC<{ tiles: Tile[]; until: number; outroAt?: number; top?: number }> = ({ tiles, until, outroAt = 1e9, top = 190 }) => {
  const frame = useCurrentFrame();
  const outro = frame >= outroAt;
  if (frame < tiles[0].f || (frame >= until && !outro)) return null;
  return (
    <>
      {tiles.map((tile, i) => {
        const showAt = outro ? outroAt + i * 3 : tile.f;
        if (frame < showAt) return null;
        const drop = dropBounce(frame, showAt, 260);
        const next = tiles[i + 1]?.f ?? until;
        const active = !outro && frame < next;
        return (
          <div
            key={tile.k}
            style={{
              position: "absolute",
              left: 70,
              top: top + i * 108 + drop.y,
              width: 860,
              height: 92,
              transform: `scale(${(active ? 1.04 : 0.96) * (1 + drop.squash * 0.06)}, ${1 - drop.squash * 0.12})`,
              transformOrigin: "50% 100%",
              background: active || outro ? "#fffaf0" : "#e9e2d4",
              border: `8px solid ${INK}`,
              borderRadius: 28,
              boxShadow: `0 10px 0 ${INK}`,
              display: "flex",
              alignItems: "center",
              opacity: active || outro ? 1 : 0.8,
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                marginLeft: 8,
                borderRadius: 35,
                background: tile.c,
                border: `7px solid ${INK}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 46,
                color: "#fff",
                WebkitTextStroke: `9px ${INK}`,
                paintOrder: "stroke fill",
              }}
            >
              {tile.k}
            </div>
            <div style={{ marginLeft: 26, fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 50, color: INK, letterSpacing: 1 }}>{tile.t}</div>
            {outro && (
              <div
                style={{
                  position: "absolute",
                  right: 26,
                  fontFamily: FONT_FAMILY,
                  fontWeight: 800,
                  fontSize: 64,
                  color: tile.c,
                  WebkitTextStroke: `9px ${INK}`,
                  paintOrder: "stroke fill",
                  transform: `scale(${1 + Math.sin((frame + i * 6) / 5) * 0.12})`,
                }}
              >
                ?
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

/** "+ FOLLOW" pops in at `at`; a finger slides in and taps it on `tapAt`, and it turns into "FOLLOWING". */
/** `enter`: where the finger slides in from ("right" = bottom-right corner, default; "below" = straight up from the bottom,
 *  for scenes where a character stands on the right and the finger must not cross a face). */
export const FollowButton: React.FC<{ at: number; tapAt: number; x?: number; y?: number; enter?: "right" | "below" }> = ({
  at,
  tapAt,
  x = 90,
  y = 1380,
  enter = "right",
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = popSpring(frame, at);
  const tapped = frame >= tapAt;
  const press = frame >= tapAt && frame < tapAt + 5 ? 0.9 : 1;
  const tx = x + 470;
  const ty = y + 100;
  const fx = interpolate(frame, [at + 4, tapAt - 2], [enter === "below" ? tx : W + 100, tx], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fy = interpolate(frame, [at + 4, tapAt - 2, tapAt, tapAt + 6], [enter === "below" ? H + 60 : H - 220, ty + 20, ty, ty + 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 560,
          height: 130,
          transform: `scale(${p * press})`,
          background: tapped ? "#adb5bd" : "#f03e3e",
          border: `9px solid ${INK}`,
          borderRadius: 70,
          boxShadow: `0 12px 0 ${INK}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 64,
          color: "#fff",
          WebkitTextStroke: `10px ${INK}`,
          paintOrder: "stroke fill",
        }}
      >
        {tapped ? "FOLLOWING" : "+ FOLLOW"}
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
        <g transform={`translate(${fx} ${fy}) rotate(-20)`}>
          <rect x={-28} y={0} width={56} height={150} rx={28} fill="#e0a77a" stroke={INK} strokeWidth={9} />
          <rect x={-60} y={90} width={120} height={150} rx={40} fill="#e0a77a" stroke={INK} strokeWidth={9} />
          <rect x={-70} y={220} width={140} height={120} fill="#3b5bdb" stroke={INK} strokeWidth={9} />
        </g>
      </svg>
      <Sparkles at={tapAt} x={x + 280} y={y + 60} r={180} />
    </>
  );
};
