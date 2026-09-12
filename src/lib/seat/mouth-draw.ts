import type { FaceRig, Rgb } from "../avatar/landmarks.ts";
import { SHAPES, visemeFor } from "./visemes.ts";

export type Box = { dx: number; dy: number; dw: number; dh: number };

const rgb = (c: Rgb, a = 1) => `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${a})`;

/**
 * The swappable mouth region. A skin patch in the plate's own colour covers
 * the painted mouth, then cavity, teeth and lips are drawn from the rig.
 * Puppet, on purpose. Same call renders live (browser) and pre-render (skia).
 */
export function drawMouth(
  ctx: CanvasRenderingContext2D,
  box: Box,
  rig: FaceRig,
  viseme: string,
  open: number,
) {
  const s = SHAPES[visemeFor(viseme)];
  const cx = box.dx + rig.mouth.cx * box.dw;
  const cy = box.dy + rig.mouth.cy * box.dh;
  const rx0 = rig.mouth.rx * box.dw;
  const ry0 = rig.mouth.ry * box.dh;
  const rx = rx0 * s.width;
  const gap = ry0 * (0.15 + Math.min(1, Math.max(0, open)) * s.jaw * 2.2);

  // Cover only the plate's painted lips, in the plate's own colour, feathered out.
  const skin = sampleSkin(ctx, cx, cy, rx0) ?? rig.skin;
  const patch = ctx.createRadialGradient(cx, cy, rx0 * 0.7, cx, cy, rx0 * 1.35);
  patch.addColorStop(0, rgb(skin, 0.9));
  patch.addColorStop(1, rgb(skin, 0));
  ctx.fillStyle = patch;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx0 * 1.35, Math.max(gap, ry0) * 1.3 + ry0 * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  if (gap > 0.5) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy + gap * 0.15, rx * (1 - s.round * 0.25), gap, 0, 0, Math.PI * 2);
    ctx.clip(); // teeth can only exist inside the cavity
    ctx.fillStyle = rgb(rig.cavity);
    ctx.fillRect(cx - rx * 2, cy - gap * 2, rx * 4, gap * 4);
    if (s.teethTop > 0) {
      ctx.fillStyle = rgb(rig.teeth);
      ctx.fillRect(cx - rx, cy - gap * 0.85, rx * 2, Math.min(gap * 0.5, ry0 * 0.9) * s.teethTop);
    }
    if (s.teethBottom > 0) {
      const h = Math.min(gap * 0.4, ry0 * 0.7) * s.teethBottom;
      ctx.fillStyle = rgb(rig.teeth, 0.9);
      ctx.fillRect(cx - rx, cy + gap * 1.15 - h, rx * 2, h);
    }
    ctx.restore();
  }

  ctx.strokeStyle = rgb(rig.lip);
  ctx.lineWidth = Math.max(2, ry0 * 0.55 + s.press * ry0 * 0.45);
  ctx.lineJoin = "round";
  // Lips hug the cavity: a thin lens when closed, an outline of the opening when open.
  const lipY = gap * 1.05 + ry0 * 0.12;
  ctx.beginPath();
  ctx.moveTo(cx - rx, cy);
  ctx.quadraticCurveTo(cx, cy - lipY - ry0 * 0.25 * (1 - s.round), cx + rx, cy);
  ctx.quadraticCurveTo(cx, cy + lipY + ry0 * 0.15, cx - rx, cy);
  ctx.closePath();
  ctx.stroke();

  if (s.bite > 0) {
    ctx.fillStyle = rgb(rig.teeth);
    ctx.fillRect(cx - rx * 0.6, cy - ry0 * 0.35, rx * 1.2, ry0 * 0.5 * s.bite);
  }
}

/** The plate's lit skin beside the mouth, averaged from both cheeks, in device pixels. */
function sampleSkin(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx0: number): Rgb | null {
  const m = ctx.getTransform();
  let r = 0;
  let g = 0;
  let b = 0;
  try {
    for (const x of [cx - rx0 * 2.2, cx + rx0 * 2.2]) {
      const d = ctx.getImageData(Math.round(m.a * x + m.c * cy + m.e), Math.round(m.b * x + m.d * cy + m.f), 1, 1).data;
      r += d[0];
      g += d[1];
      b += d[2];
    }
  } catch {
    return null; // a cross-origin plate taints the canvas: use the rig's colour instead
  }
  return { r: r / 2, g: g / 2, b: b / 2 };
}
