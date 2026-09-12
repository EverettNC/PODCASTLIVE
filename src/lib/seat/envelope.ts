import { visemeFor, type VisemeName } from "./visemes.ts";

export type MouthFrame = { open: number; viseme: VisemeName };
export const REST_FRAME: MouthFrame = { open: 0, viseme: "rest" };
/** The Voice SDK's phonemes_to_visemes() output: one entry per frame. */
export type VisemeTrack = { time: number; viseme: string }[];

const REF_RMS = 0.2; // full jaw at this RMS on -1..1 audio
const GATE = 0.02;
const ATTACK = 0.6;
const RELEASE = 0.35;

/**
 * Per-frame mouth drive measured from the audio itself: RMS envelope for the jaw,
 * zero-crossing rate and a one-pole low/high split for the shape class.
 * Honest scope: this is amplitude and spectral class, not phonemes. When the
 * Voice SDK's phoneme timing is available, mergeVisemeTrack() overrides the shape.
 */
export function mouthFrames(samples: Float32Array, sampleRate: number, fps = 30): MouthFrame[] {
  const hop = Math.round(sampleRate / fps);
  const n = Math.floor(samples.length / hop);
  const out: MouthFrame[] = [];
  let env = 0;
  let prevRms = 0;
  let held: VisemeName = "rest";
  let candidate: VisemeName = "rest";
  let streak = 0;

  for (let f = 0; f < n; f++) {
    const s = f * hop;
    let sum = 0;
    let zc = 0;
    let lp = samples[s];
    let lowE = 0;
    let highE = 0;
    let prev = samples[s];
    for (let i = s; i < s + hop; i++) {
      const v = samples[i];
      sum += v * v;
      if (v >= 0 !== prev >= 0) zc++;
      lp += (v - lp) * 0.3;
      lowE += lp * lp;
      highE += (v - lp) * (v - lp);
      prev = v;
    }
    const rms = Math.sqrt(sum / hop);
    const zcr = zc / hop;
    const bright = highE / (lowE + highE + 1e-9);
    const target = rms < GATE ? 0 : Math.min(1, Math.pow(rms / REF_RMS, 0.7));
    env += (target - env) * (target > env ? ATTACK : RELEASE);

    let v: VisemeName;
    if (target === 0 && env < 0.05) v = "rest";
    else if (prevRms < GATE && rms > prevRms * 3) v = "PP"; // onset after silence: lips were closed
    else if (zcr > 0.25) v = "SS";
    else if (bright > 0.55) v = "EE";
    else if (bright < 0.2) v = "OH";
    else v = env > 0.55 ? "AA" : "DD";

    // Two frames of agreement before a shape change, except rest and plosives.
    if (v === candidate) streak++;
    else {
      candidate = v;
      streak = 1;
    }
    if (streak >= 2 || v === "rest" || v === "PP") held = v;

    prevRms = rms;
    out.push({ open: env, viseme: held });
  }
  return out;
}

/** Voice SDK phonemes_to_visemes() output, {time, viseme} per frame, decides the shape; the envelope still drives the jaw. */
export function mergeVisemeTrack(frames: MouthFrame[], track: VisemeTrack, fps = 30): MouthFrame[] {
  if (!track.length) return frames;
  let k = 0;
  return frames.map((fr, i) => {
    const t = i / fps;
    while (k + 1 < track.length && track[k + 1].time <= t) k++;
    return { open: fr.open, viseme: fr.open < 0.05 ? "rest" : visemeFor(track[k].viseme) };
  });
}

export function frameAt(frames: MouthFrame[], tSec: number, fps = 30): MouthFrame {
  if (!frames.length) return REST_FRAME;
  const i = Math.min(frames.length - 1, Math.max(0, Math.floor(tSec * fps)));
  return frames[i];
}
