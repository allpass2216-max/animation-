#!/usr/bin/env node
// Render a list of frames of a composition and tile them into one contact-sheet PNG (4 per row).
// Bundles once and reuses one browser, so it is much faster than calling `remotion still` per frame.
//
// Usage:
//   tools/stills <CompositionId> <frames> [--out out/contact.png] [--cols 4] [--width 360] [--props '{"a":1}']
//   <frames>: comma list of frame numbers or seconds, e.g. "0,15,2.5s,90"
//             or "words:12" = 12 frames spread over the word starts in public/words.json (+3 frames)
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const BROWSER =
  process.env.REMOTION_BROWSER ??
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const out = path.resolve(opt("out", path.join(ROOT, "out", "contact.png")));
const cols = Number(opt("cols", 4));
const tileW = Number(opt("width", 360));
const inputProps = JSON.parse(opt("props", "{}"));
const [compId, frameSpec] = args;
if (!compId || !frameSpec) {
  console.error("usage: tools/stills <CompositionId> <frames|words:N> [--out file.png] [--cols 4] [--width 360]");
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "stills-"));
try {
  console.log("Bundling…");
  const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src", "index.ts"), publicDir: path.join(ROOT, "public") });
  const browser = await openBrowser("chrome", { browserExecutable: fs.existsSync(BROWSER) ? BROWSER : null });
  const comp = await selectComposition({ serveUrl, id: compId, inputProps, puppeteerInstance: browser });
  const fps = comp.fps;

  let frames;
  if (frameSpec.startsWith("words:")) {
    const n = Number(frameSpec.split(":")[1] || 12);
    const words = JSON.parse(fs.readFileSync(path.join(ROOT, "public", "words.json"), "utf8")).words ?? [];
    if (!words.length) throw new Error("public/words.json has no words");
    frames = Array.from({ length: Math.min(n, words.length) }, (_, i) =>
      Math.round(words[Math.round((i * (words.length - 1)) / Math.max(1, n - 1))].start * fps) + 3);
  } else {
    frames = frameSpec.split(",").map((s) => s.trim()).filter(Boolean)
      .map((s) => (s.endsWith("s") ? Math.round(parseFloat(s) * fps) : parseInt(s, 10)));
  }
  frames = frames.map((f) => Math.max(0, Math.min(comp.durationInFrames - 1, f)));

  const font = (() => {
    try { return execFileSync("fc-match", ["-f", "%{file}", "DejaVu Sans:bold"]).toString().trim(); } catch { return ""; }
  })();
  const tiles = [];
  for (const [i, frame] of frames.entries()) {
    const png = path.join(tmp, `raw_${i}.png`);
    await renderStill({ composition: comp, serveUrl, frame, output: png, inputProps, puppeteerInstance: browser });
    const tile = path.join(tmp, `tile_${String(i).padStart(3, "0")}.png`);
    const label = `f${frame}  ${(frame / fps).toFixed(2)}s`;
    const draw = font
      ? `,drawtext=fontfile=${font}:text='${label}':x=8:y=8:fontsize=${Math.round(tileW / 14)}:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=6`
      : "";
    execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", png, "-vf", `scale=${tileW}:-2${draw},pad=iw+8:ih+8:4:4:color=0x111111`, tile]);
    tiles.push(tile);
    console.log(`  still ${i + 1}/${frames.length}: frame ${frame}`);
  }
  await browser.close({ silent: true });

  const rows = Math.ceil(tiles.length / cols);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-framerate", "1", "-i", path.join(tmp, "tile_%03d.png"),
    "-vf", `tile=${cols}x${rows}:color=0x111111`, "-frames:v", "1", out]);
  console.log(`Contact sheet (${tiles.length} stills, ${cols} per row): ${path.relative(process.cwd(), out)}`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
