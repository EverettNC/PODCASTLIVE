import { christmanLpc, christmanRms, christmanZcr, lpcFormants } from "../../../vendor/CORTI/src/lib/audio/dsp.ts";
import { detectPitchYin } from "../../../vendor/CORTI/src/lib/audio/yin.ts";
import { visemeFor, type VisemeName } from "./visemes.ts";

export type MouthFrame = { open: number; viseme: VisemeName };
export const REST_FRAME: MouthFrame = { open: 0, viseme: "rest" };
/** The Voice SDK's phonemes_to_visemes() output: one entry per frame. */
export type VisemeTrack = { time: number; viseme: string }[];

const ANALYSIS_RATE = 16000; // CORTI's measures run here; higher rates are decimated first
const REF_RMS = 0.2; // full jaw at this RMS on -1..1 audio
const GATE = 0.02;
const ATTACK = 0.6;
const RELEASE = 0.35;

type Measure = { rms: number; zcr: number; f1: number; f2: number };

/**
 * Per-frame mouth drive measured by CORTI (christman_dsp: RMS, ZCR, YIN, LPC).
 * The jaw follows RMS. A frame is voiced only when YIN locks a pitch; no lock,
 * no vowel claimed. A voiced frame's shape comes from its LPC formants judged
 * against the take's own medians: F1 up opens (AA), F2 up spreads (EE), F2
 * down rounds (OH, or OU when F1 is low too). Unvoiced frames sort by zero
 * crossing rate: hiss (SS), lip and teeth friction (FF), else a closed
 * neutral (DD). An onset out of silence is a plosive (PP).
 * Honest scope: acoustic shape classes, not phonemes. When the Voice SDK's
 * phoneme timing is available, mergeVisemeTrack() overrides the shape.
 * Whole-take: the medians need the full buffer, so this runs once per take
 * before it plays. It is not a frame-by-frame analyser for a live microphone.
 */
export function mouthFrames(samples: Float32Array, sampleRate: number, fps = 30): MouthFrame[] {
  const k = Math.max(1, Math.round(sampleRate / ANALYSIS_RATE));
  const x = k > 1 ? decimate(samples, k) : samples;
  const sr = sampleRate / k;
  const hop = Math.round(sr / fps);
  const order = 2 + Math.round(sr / 1000);
  const n = Math.floor(x.length / hop);

  const m: Measure[] = [];
  for (let f = 0; f < n; f++) {
    const frame = x.subarray(f * hop, (f + 1) * hop);
    const rms = christmanRms(frame);
    let f1 = 0;
    let f2 = 0;
    if (rms >= GATE && detectPitchYin(frame, sr)) {
      const formants = lpcFormants(christmanLpc(preEmphasis(frame), order), sr);
      f1 = formants.f1;
      f2 = formants.f2;
    }
    m.push({ rms, zcr: christmanZcr(frame), f1, f2 });
  }
  // LPC peaks flicker frame to frame; a three-frame median steadies the shape without lag worth seeing.
  for (let f = 1; f < n - 1; f++) {
    const tri = [m[f - 1], m[f], m[f + 1]].filter((v) => v.f1 > 0 && v.f2 > 0);
    if (m[f].f1 > 0 && tri.length === 3) {
      m[f] = { ...m[f], f1: quantile(tri.map((v) => v.f1), 0.5), f2: quantile(tri.map((v) => v.f2), 0.5) };
    }
  }

  // The take calibrates itself: shapes are judged against its own quartiles, so a bright or dull voice does not skew them.
  const audible = m.filter((v) => v.rms >= GATE);
  const zcrMid = quantile(audible.map((v) => v.zcr), 0.5);
  const vowels = audible.filter((v) => v.f1 > 0 && v.f2 > 0);
  const f1Lo = quantile(vowels.map((v) => v.f1), 0.25);
  const f1Hi = quantile(vowels.map((v) => v.f1), 0.75);
  const f2Lo = quantile(vowels.map((v) => v.f2), 0.25);
  const f2Hi = quantile(vowels.map((v) => v.f2), 0.75);

  const out: MouthFrame[] = [];
  let env = 0;
  let held: VisemeName = "rest";
  let candidate: VisemeName = "rest";
  let streak = 0;
  for (let f = 0; f < n; f++) {
    const { rms, zcr, f1, f2 } = m[f];
    const target = rms < GATE ? 0 : Math.min(1, Math.pow(rms / REF_RMS, 0.7));
    env += (target - env) * (target > env ? ATTACK : RELEASE);

    let v: VisemeName;
    if (target === 0 && env < 0.05) v = "rest";
    else if (f > 0 && m[f - 1].rms < GATE && rms > m[f - 1].rms * 3) v = "PP"; // onset after silence: lips were closed
    else if (f1 > 0 && f2 > 0) {
      if (f2 < f2Lo) v = f1 < f1Lo ? "OU" : "OH";
      else if (f2 > f2Hi) v = "EE";
      else if (f1 > f1Hi) v = "AA";
      else v = env > 0.3 ? "AA" : "DD";
    } else if (zcr > Math.max(0.25, zcrMid * 2.5)) v = "SS"; // a real /s/ crosses zero a quarter of the time or more
    else if (zcr > Math.max(0.12, zcrMid * 1.5)) v = "FF";
    else v = "DD";

    // Two frames of agreement before a shape change, except rest and plosives.
    if (v === candidate) streak++;
    else {
      candidate = v;
      streak = 1;
    }
    if (streak >= 2 || v === "rest" || v === "PP") held = v;
    out.push({ open: env, viseme: held });
  }
  return out;
}

/** Box average by an integer factor: enough anti-aliasing for envelope and formant work. */
function decimate(x: Float32Array, k: number): Float32Array {
  const out = new Float32Array(Math.floor(x.length / k));
  for (let i = 0; i < out.length; i++) {
    let s = 0;
    for (let j = 0; j < k; j++) s += x[i * k + j];
    out[i] = s / k;
  }
  return out;
}

/** Pre-emphasis and a Hamming window before LPC, so the formant peaks stand up. */
function preEmphasis(frame: Float32Array): Float32Array {
  const y = new Float32Array(frame.length);
  const n = frame.length;
  for (let i = 0; i < n; i++) {
    const w = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (n - 1));
    y[i] = (frame[i] - 0.97 * (i > 0 ? frame[i - 1] : 0)) * w;
  }
  return y;
}

function quantile(v: number[], p: number): number {
  if (!v.length) return 0;
  const s = [...v].sort((a, b) => a - b);
  return s[Math.floor(p * (s.length - 1))];
}

/** Voice SDK phoneme visemes decide the shape; the envelope still drives the jaw. */
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
