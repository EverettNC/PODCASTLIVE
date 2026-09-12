import type { FaceRig } from "./landmarks";
import type { LipState } from "./lip-sync";
import { drawMouth, rgb } from "../seat/mouth-draw.ts";

export type DrawMapping = {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
};

// DOM guards: the same functions draw the pre-render under Node, where no element classes exist.
const isVideo = (src: CanvasImageSource): src is HTMLVideoElement =>
  typeof HTMLVideoElement !== "undefined" && src instanceof HTMLVideoElement;
const isImage = (src: CanvasImageSource): src is HTMLImageElement =>
  typeof HTMLImageElement !== "undefined" && src instanceof HTMLImageElement;

function sourceSize(src: CanvasImageSource) {
  if (isVideo(src)) return { w: src.videoWidth, h: src.videoHeight };
  if (isImage(src)) return { w: src.naturalWidth, h: src.naturalHeight };
  const { width, height } = src as { width: number; height: number }; // canvas or skia image
  return { w: width, h: height };
}

export function fitCover(
  canvasW: number,
  canvasH: number,
  imgW: number,
  imgH: number,
  lockTop = false,
  pad = 1,
): DrawMapping {
  const scale = Math.max(canvasW / imgW, canvasH / imgH) * pad;
  const dw = imgW * scale;
  const dh = imgH * scale;
  const dx = (canvasW - dw) / 2;
  const dy = lockTop ? 0 : (canvasH - dh) / 2; // lockTop keeps the head: the top edge stays in frame, the crop comes off the bottom
  return { dx, dy, dw, dh };
}

export function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const { w: iw, h: ih } = sourceSize(img);
  if (iw < 2 || ih < 2) return;
  const scale = Math.max(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  try {
    ctx.drawImage(img, dx, dy, dw, dh);
  } catch {
    /* */
  }
}

function ellipse(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), 0, 0, Math.PI * 2);
}

export function drawTalent(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  map: DrawMapping,
  lip: LipState,
  lipGain: number,
  rig: FaceRig,
) {
  const { dx, dy, dw, dh } = map;
  const { w: iw, h: ih } = sourceSize(img);
  if (iw < 2 || ih < 2 || dw < 1 || dh < 1) return;

  ctx.save();
  ctx.translate(dx + dw / 2 + lip.swayX, dy + dh / 2 + lip.swayY);
  ctx.rotate(lip.swayRot);
  const s = 1 + lip.breath;
  ctx.scale(s, s);
  ctx.translate(-(dx + dw / 2), -(dy + dh / 2));

  try {
    ctx.drawImage(img, dx, dy, dw, dh);
  } catch {
    ctx.restore();
    return;
  }

  if (!isVideo(img)) {
    // Only the rendered seat gets a drawn mouth. Everett and Patty are people.
    if (rig.id === "talent") drawMouth(ctx, map, rig, lip.viseme, lip.open * lipGain);
    if (lip.blink > 0.04) drawBlink(ctx, dx, dy, dw, dh, lip.blink, rig);
  }

  ctx.restore();
}

export function drawBlink(
  ctx: CanvasRenderingContext2D,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  amount: number,
  rig: FaceRig,
) {
  const a = Math.min(1, amount * 1.4);
  const { lid } = rig;
  for (const eye of [rig.leftEye, rig.rightEye]) {
    const x = dx + eye.cx * dw;
    const y = dy + eye.cy * dh;
    const rx = eye.rx * dw;
    const ry = eye.ry * dh * (0.35 + a * 0.85);
    ctx.fillStyle = rgb(lid, 0.55 + a * 0.4);
    ellipse(ctx, x, y - ry * 0.15, rx * 1.15, ry);
    ctx.fill();
  }
}
