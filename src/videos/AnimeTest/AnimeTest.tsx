// Style test: Japanese TV anime look. Thin dark outlines, two-tone cel shading (hard shadow edges), big shiny eyes,
// spiky hair with a highlight band, painted afternoon room (soft clouds, light rays, wooden floor).
// Beat: Kunal holds his salary slip -> it slips (frame SLIP) -> quick zoom on his face, speed lines, sweat drop, red "!?".
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "../../lib/fonts";

export const ANIMETEST_DURATION = 90;
const W = 1080;
const H = 1920;
const LINE = "#2a1d24"; // thin dark outline
const SLIP = 30;
const ZOOM = 38;

// palette: base + hard shadow tone
const SKIN = ["#ffe0c8", "#f2b99a"];
const HAIR = ["#2b3a67", "#1b2547"];
const SHIRT = ["#f8f9fa", "#c9d3e6"];
const TIE = ["#1c7ed6", "#14559a"];
const IRIS = ["#5b3a29", "#c98a4b"];

/** Painted afternoon room: warm gradient walls, big window with soft clouds, god rays, wooden floor with plank shading. */
const AfternoonRoom: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6dcb8" />
            <stop offset="1" stopColor="#e9c193" />
          </linearGradient>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7cc3f5" />
            <stop offset="1" stopColor="#ffe2b8" />
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b9773f" />
            <stop offset="1" stopColor="#8a5226" />
          </linearGradient>
          <linearGradient id="ray" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff6dc" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff6dc" stopOpacity="0" />
          </linearGradient>
          <filter id="soft">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        <rect width={W} height={H} fill="url(#wall)" />
        {/* window with painted sky and soft clouds */}
        <rect x={110} y={260} width={520} height={640} fill="url(#sky)" stroke={LINE} strokeWidth={5} />
        <g filter="url(#soft)">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${200 + i * 160 + ((frame * 0.3 + i * 50) % 80)} ${380 + i * 110})`}>
              <ellipse rx={110} ry={38} fill="#fff" opacity={0.95} />
              <ellipse cx={60} cy={-22} rx={70} ry={42} fill="#fff" opacity={0.95} />
              <ellipse cx={-50} cy={-12} rx={60} ry={34} fill="#fff8ee" />
            </g>
          ))}
        </g>
        <path d="M370 260 L370 900 M110 580 L630 580" stroke="#8a5a3b" strokeWidth={14} />
        <rect x={110} y={260} width={520} height={640} fill="none" stroke="#8a5a3b" strokeWidth={22} />
        {/* wall shadow band (hard edge, cel style) */}
        <path d="M680 0 L1080 0 L1080 1350 L760 1350 Z" fill="#d7a878" opacity={0.55} />
        {/* floor */}
        <rect x={0} y={1350} width={W} height={H - 1350} fill="url(#floor)" />
        {Array.from({ length: 9 }).map((_, i) => (
          <path key={i} d={`M${-200 + i * 170} ${H} L${300 + i * 70} 1350`} stroke="#6f3f1c" strokeWidth={4} opacity={0.6} />
        ))}
        <rect x={0} y={1340} width={W} height={18} fill="#6f3f1c" />
        {/* god rays from the window onto the floor */}
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${150 + i * 170} 300 L${330 + i * 170} 300 L${760 + i * 120} 1700 L${520 + i * 120} 1700 Z`}
            fill="url(#ray)"
            opacity={0.45 + Math.sin(frame / 20 + i) * 0.08}
          />
        ))}
        {/* sunlit patch on the floor */}
        <path d="M450 1480 L1000 1480 L1080 1760 L520 1760 Z" fill="#ffd8a0" opacity={0.35} />
        {/* dust motes in the light */}
        {Array.from({ length: 18 }).map((_, i) => (
          <circle
            key={i}
            cx={300 + random(`dx${i}`) * 600 + Math.sin(frame / 25 + i) * 14}
            cy={500 + random(`dy${i}`) * 1000 - ((frame * 0.6) % 60)}
            r={2 + random(`dr${i}`) * 3}
            fill="#fff8e0"
            opacity={0.7}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/** Anime character (Kunal) in a local 1000x1600 box: head centre (500, 420). `surprised` switches the face. */
const AnimeKunal: React.FC<{ surprised: boolean; armUp: number }> = ({ surprised, armUp }) => {
  const frame = useCurrentFrame();
  const blink = !surprised && frame % 80 > 76;
  const breathe = Math.sin(frame / 12) * 4;
  const eye = (cx: number) => (
    <g>
      {/* white */}
      <path d={`M${cx - 62} 430 Q${cx} ${surprised ? 330 : 360} ${cx + 62} 430 Q${cx} ${surprised ? 520 : 500} ${cx - 62} 430 Z`} fill="#fff" stroke={LINE} strokeWidth={4} />
      {!blink && (
        <g>
          {/* iris: two tones, hard edge */}
          <ellipse cx={cx} cy={438} rx={surprised ? 30 : 40} ry={surprised ? 38 : 52} fill={IRIS[0]} stroke={LINE} strokeWidth={3} />
          <path d={`M${cx - (surprised ? 30 : 40)} 448 Q${cx} ${surprised ? 490 : 505} ${cx + (surprised ? 30 : 40)} 448 Q${cx} 470 ${cx - (surprised ? 30 : 40)} 448Z`} fill={IRIS[1]} />
          <ellipse cx={cx} cy={438} rx={surprised ? 12 : 18} ry={surprised ? 16 : 24} fill="#1a0f12" />
          {/* shine */}
          <ellipse cx={cx - 14} cy={414} rx={12} ry={15} fill="#fff" />
          <circle cx={cx + 14} cy={460} r={6} fill="#fff" />
        </g>
      )}
      {/* thick upper lash line */}
      <path d={`M${cx - 70} ${surprised ? 420 : 428} Q${cx} ${surprised ? 318 : 352} ${cx + 70} ${surprised ? 412 : 422}`} fill="none" stroke={LINE} strokeWidth={blink ? 6 : 12} strokeLinecap="round" />
    </g>
  );
  return (
    <svg viewBox="0 0 1000 1600" width={1000} height={1600} style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${breathe})`}>
        {/* body: shirt with hard cel shadow, tie */}
        {/* legs: navy trousers (two-tone) + shoes */}
        <path d="M330 1140 L670 1140 L650 1540 L530 1540 L500 1220 L470 1540 L350 1540 Z" fill="#2b3a67" stroke={LINE} strokeWidth={4} strokeLinejoin="round" />
        <path d="M560 1140 L670 1140 L650 1540 L580 1540 Z" fill="#1b2547" />
        <path d="M330 1530 L480 1530 Q500 1590 440 1595 L320 1595 Q300 1560 330 1530Z" fill="#3b2a24" stroke={LINE} strokeWidth={4} />
        <path d="M520 1530 L670 1530 Q700 1560 680 1595 L560 1595 Q500 1590 520 1530Z" fill="#3b2a24" stroke={LINE} strokeWidth={4} />
        {/* left arm hanging */}
        <path d="M300 740 L230 1060 L268 1072 L340 790 Z" fill={SHIRT[0]} stroke={LINE} strokeWidth={4} />
        <circle cx={248} cy={1080} r={32} fill={SKIN[0]} stroke={LINE} strokeWidth={4} />
        {/* shirt torso */}
        <path d="M290 720 Q500 660 710 720 L690 1160 L310 1160 Z" fill={SHIRT[0]} stroke={LINE} strokeWidth={4} />
        <path d="M560 690 Q640 700 710 720 L690 1160 L590 1160 Z" fill={SHIRT[1]} />
        <path d="M440 690 L500 760 L560 690" fill="none" stroke={LINE} strokeWidth={4} />
        <path d="M485 760 L515 760 L530 1000 L500 1040 L470 1000 Z" fill={TIE[0]} stroke={LINE} strokeWidth={3} />
        <path d="M500 760 L515 760 L530 1000 L500 1040 Z" fill={TIE[1]} />
        {/* neck */}
        <path d="M455 600 L545 600 L550 700 Q500 730 450 700 Z" fill={SKIN[0]} stroke={LINE} strokeWidth={4} />
        <path d="M455 600 L545 600 L548 650 Q500 670 455 640 Z" fill={SKIN[1]} />
        {/* face: anime shape with pointed chin, two-tone */}
        <path d="M300 380 Q300 230 500 220 Q700 230 700 380 Q700 520 600 600 Q540 650 500 655 Q460 650 400 600 Q300 520 300 380 Z" fill={SKIN[0]} stroke={LINE} strokeWidth={4} />
        <path d="M610 300 Q700 340 700 380 Q700 520 600 600 Q560 632 530 645 Q620 520 610 300 Z" fill={SKIN[1]} />
        {/* ears */}
        <path d="M300 400 Q262 410 270 450 Q280 488 312 480" fill={SKIN[0]} stroke={LINE} strokeWidth={4} />
        <path d="M700 400 Q738 410 730 450 Q720 488 688 480" fill={SKIN[1]} stroke={LINE} strokeWidth={4} />
        {/* eyes, brows, nose, mouth, blush */}
        {eye(410)}
        {eye(590)}
        <path d={surprised ? "M340 318 Q400 280 460 300" : "M345 338 Q400 316 455 330"} fill="none" stroke={HAIR[1]} strokeWidth={9} strokeLinecap="round" />
        <path d={surprised ? "M540 300 Q600 280 660 318" : "M545 330 Q600 316 655 338"} fill="none" stroke={HAIR[1]} strokeWidth={9} strokeLinecap="round" />
        <path d="M505 500 L495 528" stroke="#c98a6a" strokeWidth={4} strokeLinecap="round" />
        {surprised ? (
          <ellipse cx={500} cy={582} rx={20} ry={26} fill="#7a2b36" stroke={LINE} strokeWidth={3} />
        ) : (
          <path d="M470 578 Q500 596 530 578" fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" />
        )}
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${350 + i * 16} 530 L${340 + i * 16} 548`} stroke="#ff8f8f" strokeWidth={4} strokeLinecap="round" />
        ))}
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${618 + i * 16} 530 L${608 + i * 16} 548`} stroke="#ff8f8f" strokeWidth={4} strokeLinecap="round" />
        ))}
        {/* spiky hair: base, hard shadow tone, highlight band */}
        <path
          d="M270 420 L250 300 L300 320 L290 220 L360 260 L380 160 L440 230 L500 130 L550 225 L630 150 L640 250 L720 220 L700 320 L750 310 L720 420 Q700 330 640 300 L600 360 L570 290 L520 350 L480 290 L430 360 L400 300 L340 380 Q310 360 300 430 Z"
          fill={HAIR[0]}
          stroke={LINE}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path d="M600 260 L630 150 L640 250 L720 220 L700 320 L750 310 L720 420 Q700 330 640 300 L600 360 Z" fill={HAIR[1]} />
        <path d="M330 270 Q450 205 610 235 Q470 230 345 290 Z" fill="#8fa3e0" opacity={0.9} />
        <path d="M380 245 Q430 228 470 230" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
        {/* glasses (thin) */}
        <g fill="none" stroke={LINE} strokeWidth={4} opacity={0.9}>
          <rect x={335} y={385} width={150} height={110} rx={30} />
          <rect x={515} y={385} width={150} height={110} rx={30} />
          <path d="M485 430 L515 430" />
        </g>
        {/* right arm: up holding the slip, or flung out */}
        <g transform={`rotate(${-armUp} 700 760)`}>
          <path d="M690 740 L830 960 L800 980 L660 790 Z" fill={SHIRT[0]} stroke={LINE} strokeWidth={4} />
          <circle cx={825} cy={975} r={34} fill={SKIN[0]} stroke={LINE} strokeWidth={4} />
        </g>
      </g>
    </svg>
  );
};

/** Radial speed lines (manga style) around the centre. */
const SpeedLines: React.FC<{ on: number }> = ({ on }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: on }}>
      <svg width={W} height={H}>
        {Array.from({ length: 70 }).map((_, i) => {
          const a = (i / 70) * Math.PI * 2 + random(`sa${i}${Math.floor(frame / 2)}`) * 0.05;
          const r0 = 470 + random(`sr${i}${Math.floor(frame / 2)}`) * 160;
          const w = 3 + random(`sw${i}`) * 9;
          const cx = W / 2;
          const cy = 820;
          return (
            <path
              key={i}
              d={`M${cx + Math.cos(a) * r0} ${cy + Math.sin(a) * r0} L${cx + Math.cos(a + 0.012) * 1500} ${cy + Math.sin(a + 0.012) * 1500} L${cx + Math.cos(a - 0.012) * 1500} ${cy + Math.sin(a - 0.012) * 1500} Z`}
              fill={LINE}
              opacity={0.75}
              strokeWidth={w}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const AnimeTest: React.FC = () => {
  const frame = useCurrentFrame();
  const zoomT = interpolate(frame, [ZOOM, ZOOM + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const surprised = frame >= ZOOM;
  const scale = 0.62 + zoomT * 0.88; // quick zoom on the face
  const ty = 700 + zoomT * 160; // screen y of the head centre: wide 700 -> close-up 860
  const shake = surprised && frame < ZOOM + 8 ? Math.sin(frame * 3) * 10 : 0;
  // slip falls with gravity and flutters
  const t = Math.max(0, frame - SLIP) / 30;
  const slipX = 820 + t * 160 + Math.sin(t * 10) * 30;
  const slipY = 1230 + 0.5 * 1800 * t * t;
  const armUp = frame < SLIP ? 40 : interpolate(frame, [SLIP, SLIP + 6], [40, -10], { extrapolateRight: "clamp" });
  const bang = interpolate(frame, [ZOOM + 2, ZOOM + 8], [2.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + zoomT * 0.25})`, transformOrigin: "50% 40%" }}>
        <AfternoonRoom />
      </AbsoluteFill>
      {surprised && <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 43%, rgba(255,255,255,0) 30%, rgba(255,240,220,0.75) 70%)" }} />}
      {surprised && <SpeedLines on={1} />}
      <div style={{ position: "absolute", left: W / 2 - 500 * scale + shake, top: ty - 420 * scale, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
        <AnimeKunal surprised={surprised} armUp={armUp} />
      </div>
      {/* the salary slip */}
      {!surprised && (
        <div
          style={{
            position: "absolute",
            left: frame < SLIP ? 830 : slipX,
            top: frame < SLIP ? 1180 : slipY,
            width: 170,
            height: 220,
            transform: `rotate(${frame < SLIP ? -8 : t * 400}deg)`,
            background: "#fffdf5",
            border: `4px solid ${LINE}`,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 26,
            color: "#495057",
            padding: 14,
            boxShadow: "8px 8px 0 rgba(0,0,0,0.15)",
          }}
        >
          SALARY SLIP
          <div style={{ marginTop: 18, fontSize: 34, color: "#2b8a3e" }}>₹30,000</div>
        </div>
      )}
      {/* sweat drop + red "!?" */}
      {surprised && (
        <>
          <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
            <g transform={`translate(${W / 2 + 300 + shake} ${700 + ((frame - ZOOM) % 30) * 2})`}>
              <path d="M0 0 Q40 70 0 100 Q-40 70 0 0Z" fill="#a5d8ff" stroke={LINE} strokeWidth={5} />
              <path d="M-8 40 Q-14 64 -4 80" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" />
            </g>
          </svg>
          <div
            style={{
              position: "absolute",
              left: 740,
              top: 150,
              transform: `scale(${bang}) rotate(12deg)`,
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: 210,
              color: "#e03131",
              WebkitTextStroke: `10px #fff`,
              paintOrder: "stroke fill",
              textShadow: "6px 6px 0 #2a1d24",
            }}
          >
            !?
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
