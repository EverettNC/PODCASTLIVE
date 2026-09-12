import type { Viseme } from "./lip-sync";

/** Words per second for the book. Every word in the rundown is spoken. */
const WPS = 2.7;
const CHARS_PER_SEC = 13.2;

export type MouthPose = { open: number; viseme: Viseme };

function visemeForChar(ch: string): MouthPose {
  const c = ch.toLowerCase();
  if (c === " " || c === "\n" || c === "\t") return { open: 0.02, viseme: "rest" };
  if (/[.,!?;:—–\-…"'“”]/.test(c)) return { open: 0.05, viseme: "closed" };
  if ("mbp".includes(c)) return { open: 0.07, viseme: "closed" };
  if ("fv".includes(c)) return { open: 0.2, viseme: "ee" };
  if (c === "w" || c === "q") return { open: 0.36, viseme: "oh" };
  if (c === "o") return { open: 0.78, viseme: "oh" };
  if (c === "a" || c === "u") return { open: 0.7, viseme: "aa" };
  if ("eiy".includes(c)) return { open: 0.46, viseme: "ee" };
  if (c === "l") return { open: 0.3, viseme: "ee" };
  if (c === "r") return { open: 0.34, viseme: "oh" };
  if ("cdgknstxz".includes(c)) return { open: 0.28, viseme: "ee" };
  if ("hj".includes(c)) return { open: 0.4, viseme: "aa" };
  return { open: 0.38, viseme: "aa" };
}

/** Full line, no cap. Duration covers every word. */
export function lineDurationMs(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return 800;
  const words = clean.split(" ").filter(Boolean).length;
  const fromWords = (words / WPS) * 1000;
  const fromChars = (clean.length / CHARS_PER_SEC) * 1000;
  return Math.max(fromWords, fromChars) + 240;
}

/** Mouth pose at time tMs through a full line. Uses every character. */
export function mouthAt(text: string, tMs: number, durMs: number): MouthPose {
  const rest: MouthPose = { open: 0, viseme: "rest" };
  if (durMs <= 0 || tMs < 0 || tMs >= durMs) return rest;
  const chars = Array.from(text);
  if (!chars.length) return rest;
  const u = tMs / durMs;
  const pos = u * chars.length;
  const i = Math.min(chars.length - 1, Math.max(0, Math.floor(pos)));
  const frac = pos - i;
  const a = visemeForChar(chars[i] ?? " ");
  const b = visemeForChar(chars[Math.min(chars.length - 1, i + 1)] ?? " ");
  const wobble = 0.1 * Math.sin(tMs * 0.046 + i * 0.7);
  const open = Math.min(1, Math.max(0, a.open * (1 - frac) + b.open * frac + wobble));
  return { open, viseme: frac > 0.55 ? b.viseme : a.viseme };
}
