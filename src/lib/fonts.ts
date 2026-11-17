import { continueRender, delayRender, staticFile } from "remotion";

// Poppins 700 + 800 from public/fonts, loaded with the FontFace API.
// Rendering waits (delayRender) until both faces are ready.
export const FONT_FAMILY = "Poppins";

const weights = [
  { weight: "700", file: "fonts/Poppins-700.woff2" },
  { weight: "800", file: "fonts/Poppins-800.woff2" },
];

let loaded = false;

export const loadFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("Loading Poppins 700/800");
  Promise.all(
    weights.map(async ({ weight, file }) => {
      const face = new FontFace(FONT_FAMILY, `url('${staticFile(file)}') format('woff2')`, {
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
