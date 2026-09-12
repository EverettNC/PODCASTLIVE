import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { GlobalFonts, createCanvas, loadImage, type Image } from "@napi-rs/canvas";
import { drawBlink, fitCover } from "../avatar/draw.ts";
import { TALENT_RIG } from "../avatar/landmarks.ts";
import { SHOW } from "../studio/show.ts";
import { decodePcm, ffmpegPath, wavBytes } from "./audio-node.ts";
import { DISCLAIMER_CUES, cueById, type Cue, type Owner } from "./cuebook.ts";
import { frameAt, mergeVisemeTrack, mouthFrames, type MouthFrame, type VisemeTrack } from "./envelope.ts";
import { drawMouth } from "./mouth-draw.ts";

const HOLD_SEC: Partial<Record<Owner, number>> = { BLACK: 1.5, TITLE: 4.5 }; // script: "Hold 4-5 seconds"
const BRANDON_PLATE = "public/avatar/host.jpg";

export type RenderOpts = {
  cueIds: string[];
  outPath: string;
  root?: string;
  fps?: number;
  width?: number;
  height?: number;
  /** Voice SDK phoneme timing per cue id, when a take came from the mill. */
  lipsync?: Record<string, VisemeTrack>;
};
export type Segment = { cue: Cue; start: number; end: number; frames: MouthFrame[]; seed: number };
export type RenderResult = {
  out: string;
  fps: number;
  width: number;
  height: number;
  durationSec: number;
  disclaimerEndSec: number;
  captions: "burned-in, sentence timing proportional to text length within each cue";
  cues: { id: string; owner: Owner; startSec: number; endSec: number }[];
};

/**
 * Script + speaker assignment in, playable file out. The disclaimer block leads
 * every render; it is not an option. Captions are burned in. Only the rendered
 * seat gets the rig: Everett and Patty are people, so their lines play over
 * black with captions, as the script stages the cold open. A spoken cue with
 * no audio is refused: nothing moves without audio first.
 */
export async function prerender(o: RenderOpts): Promise<RenderResult> {
  const root = o.root ?? process.cwd();
  const fps = o.fps ?? 30;
  const W = o.width ?? 1280;
  const H = o.height ?? 720;
  const sr = 16000;
  const wanted = o.cueIds.map(cueById);
  const cues = [...DISCLAIMER_CUES, ...wanted.filter((c) => !DISCLAIMER_CUES.includes(c))];

  ensureFont();
  const backdrop = await loadImage(join(root, "public/backdrop/stage.png"));
  const titleCard = await loadImage(join(root, "public/backdrop/intro.png"));
  const brandon = await loadImage(join(root, BRANDON_PLATE));

  const segs: Segment[] = [];
  const pcm: Float32Array[] = [];
  let t = 0;
  for (const [i, c] of cues.entries()) {
    let samples: Float32Array;
    if (c.owner === "BLACK" || c.owner === "TITLE") {
      samples = new Float32Array(Math.round((HOLD_SEC[c.owner] ?? 1) * sr));
    } else {
      const file = join(root, "public/audio/book", `${c.id}.mp3`);
      if (!existsSync(file)) throw new Error(`stage tts: no audio for cue ${c.n} ${c.id}; nothing moves without audio`);
      samples = decodePcm(file, sr);
    }
    let frames = c.owner === "BRANDON" ? mouthFrames(samples, sr, fps) : [];
    const track = o.lipsync?.[c.id];
    if (track) frames = mergeVisemeTrack(frames, track, fps);
    const end = t + samples.length / sr;
    segs.push({ cue: c, start: t, end, frames, seed: i + 1 });
    pcm.push(samples);
    t = end;
  }

  mkdirSync(dirname(o.outPath), { recursive: true });
  const wavPath = `${o.outPath}.wav`;
  writeFileSync(wavPath, wavBytes(concat(pcm), sr));

  const canvas = createCanvas(W, H);
  // skia's 2D context matches the subset the rig calls
  const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D;
  const ff = spawn(ffmpegPath(), [
    "-y", "-v", "error",
    "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${W}x${H}`, "-r", String(fps), "-i", "pipe:0",
    "-i", wavPath,
    "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart",
    o.outPath,
  ]);
  let stderr = "";
  ff.stderr.on("data", (d) => (stderr += d));
  const exit = once(ff, "close");

  const nFrames = Math.ceil(t * fps);
  for (let i = 0; i < nFrames; i++) {
    const tSec = i / fps;
    const seg = segs.find((s) => tSec >= s.start && tSec < s.end) ?? segs[segs.length - 1];
    drawFrame(ctx, W, H, backdrop, titleCard, brandon, seg, tSec - seg.start, fps);
    const px = ctx.getImageData(0, 0, W, H).data;
    if (!ff.stdin.write(Buffer.from(px.buffer, px.byteOffset, px.byteLength))) await once(ff.stdin, "drain");
  }
  ff.stdin.end();
  const [code] = (await exit) as [number];
  if (code !== 0) throw new Error(`stage video out: ffmpeg exited ${code}: ${stderr}`);

  const result: RenderResult = {
    out: o.outPath,
    fps,
    width: W,
    height: H,
    durationSec: t,
    disclaimerEndSec: segs[DISCLAIMER_CUES.length - 1].end,
    captions: "burned-in, sentence timing proportional to text length within each cue",
    cues: segs.map((s) => ({ id: s.cue.id, owner: s.cue.owner, startSec: s.start, endSec: s.end })),
  };
  writeFileSync(`${o.outPath}.cues.json`, JSON.stringify(result, null, 2));
  return result;
}

function ensureFont() {
  if (GlobalFonts.families.length === 0) GlobalFonts.loadFontsFromDir("/usr/share/fonts");
  if (GlobalFonts.families.length === 0) {
    throw new Error("stage captions: no font is installed; burned-in captions are required, refusing to render");
  }
}

function concat(parts: Float32Array[]): Float32Array {
  const out = new Float32Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  backdrop: Image,
  titleCard: Image,
  brandon: Image,
  seg: Segment,
  tRel: number,
  fps: number,
) {
  const { cue } = seg;
  if (cue.owner === "TITLE") {
    cover(ctx, titleCard, W, H);
    return;
  }
  if (cue.owner !== "BRANDON") {
    drawSlate(ctx, W, H);
    if (cue.owner !== "BLACK") drawCaption(ctx, W, H, captionAt(cue.text, tRel, seg.end - seg.start));
    return;
  }

  cover(ctx, backdrop, W, H);
  const box = fitCover(W, H, brandon.width, brandon.height);
  const fr = frameAt(seg.frames, tRel, fps);
  const idle = fr.open > 0.05 ? 0.45 : 1;
  const swayX = Math.sin(tRel * 0.72) * 4.2 * idle;
  const swayY = Math.sin(tRel * 0.91 + 0.4) * 2.6 * idle;
  const swayRot = Math.sin(tRel * 0.47) * 0.012 * idle;
  const breath = 1 + Math.sin(tRel * 1.15) * 0.008;

  ctx.save();
  ctx.translate(box.dx + box.dw / 2 + swayX, box.dy + box.dh / 2 + swayY);
  ctx.rotate(swayRot);
  ctx.scale(breath, breath);
  ctx.translate(-(box.dx + box.dw / 2), -(box.dy + box.dh / 2));
  ctx.drawImage(brandon as unknown as CanvasImageSource, box.dx, box.dy, box.dw, box.dh);
  drawMouth(ctx, box, TALENT_RIG, fr.viseme, fr.open);
  const blink = blinkAt(tRel, seg.seed);
  if (blink > 0.04) drawBlink(ctx, box.dx, box.dy, box.dw, box.dh, blink, TALENT_RIG);
  ctx.restore();

  drawCaption(ctx, W, H, captionAt(cue.text, tRel, seg.end - seg.start));
}

/** Over black: the show's title, as the cold open is staged. */
function drawSlate(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = "#0c0c0e";
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ecece8";
  ctx.font = `500 ${Math.round(H * 0.058)}px serif`;
  ctx.fillText(SHOW.title, W / 2, H * 0.44);
  ctx.fillStyle = "#9a9a94";
  ctx.font = `500 ${Math.round(H * 0.018)}px monospace`;
  ctx.fillText(SHOW.episodeNum.toUpperCase(), W / 2, H * 0.5);
}

function cover(ctx: CanvasRenderingContext2D, img: Image, W: number, H: number) {
  const b = fitCover(W, H, img.width, img.height);
  ctx.drawImage(img as unknown as CanvasImageSource, b.dx, b.dy, b.dw, b.dh);
}

/** Irregular blinks on a fixed schedule per segment, so a render is repeatable. */
function blinkAt(t: number, seed: number): number {
  let x = seed * 2654435761;
  let next = 1.6;
  for (;;) {
    x = (x * 1664525 + 1013904223) >>> 0;
    const gapS = 2.2 + (x / 4294967296) * 4.4;
    if (t < next) return 0;
    if (t < next + 0.13) return 1 - (t - next) / 0.13;
    next += gapS;
  }
}

function captionAt(text: string, tRel: number, durSec: number): string {
  const parts = text.split(/(?<=[.!?])\s+|\n+/).filter(Boolean);
  const total = parts.reduce((n, p) => n + p.length, 0);
  let acc = 0;
  for (const p of parts) {
    acc += p.length;
    if (tRel < (acc / total) * durSec) return p;
  }
  return parts[parts.length - 1] ?? "";
}

function drawCaption(ctx: CanvasRenderingContext2D, W: number, H: number, text: string) {
  if (!text) return;
  const size = Math.round(H * 0.042);
  ctx.font = `500 ${size}px sans-serif`;
  const maxW = W * 0.84;
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const probe = line ? `${line} ${word}` : word;
    if (ctx.measureText(probe).width > maxW && line) {
      lines.push(line);
      line = word;
    } else line = probe;
  }
  if (line) lines.push(line);
  const lh = size * 1.3;
  const boxH = lines.length * lh + size * 0.9;
  const y0 = H - boxH - H * 0.06;
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  ctx.fillRect(W * 0.06, y0, W * 0.88, boxH);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  lines.forEach((l, i) => ctx.fillText(l, W / 2, y0 + size * 0.45 + i * lh));
  ctx.textBaseline = "alphabetic";
}
