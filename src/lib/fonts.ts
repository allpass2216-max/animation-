import { continueRender, delayRender, staticFile } from "remotion";

// Poppins 700 + 800 from public/fonts, loaded with the FontFace API.
// Rendering waits (delayRender) until both faces are ready.
export const FONT_FAMILY = "Poppins";

export const ARABIC_FONT = "Amiri";

const weights = [
  { family: FONT_FAMILY, weight: "700", file: "fonts/Poppins-700.woff2" },
  { family: FONT_FAMILY, weight: "800", file: "fonts/Poppins-800.woff2" },
  { family: "Amiri", weight: "400", file: "fonts/Amiri-400.woff2" },
  { family: "Amiri", weight: "700", file: "fonts/Amiri-700.woff2" },
];

let loaded = false;

export const loadFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("Loading Poppins 700/800");
  Promise.all(
    weights.map(async ({ family, weight, file }) => {
      const face = new FontFace(family, `url('${staticFile(file)}') format('woff2')`, {
        weight,
        style: "normal",
      });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error("Font load failed", err);
      continueRender(handle);
    });
};

loadFonts();
