/**
 * Brandon's line-in. A live seat (Opus, open on Everett's machine during the
 * show) reads the latest address at GET /api/brandon/cue and answers at
 * POST /api/brandon/line. The floor opens the cue and takes the line.
 * One process, in memory: the floor and the seat share this file's state.
 * A line with no open address is refused: he speaks only when addressed.
 */
export type Cue = { id: number; text: string; at: number };
export type Line = { cueId: number; text: string };

export const LIVE_SEAT_MS = 60_000; // a seat that has not read the cue in a minute is not in the chair

let cue: Cue | null = null;
let line: Line | null = null;
let seenAt = 0;
let nextId = 1;

export const liveSeatPresent = (now = Date.now()) => now - seenAt < LIVE_SEAT_MS;

/** The operator addresses Brandon. Any unanswered earlier address is dropped. */
export function openCue(text: string, now = Date.now()): Cue {
  cue = { id: nextId++, text, at: now };
  line = null;
  return cue;
}

/** The live seat reads the address. Reading is how the seat shows it is in the chair. */
export function readCue(now = Date.now()) {
  seenAt = now;
  return { cue, answered: line !== null };
}

/** The live seat answers. Refused unless an address is open and unanswered. */
export function postLine(text: string): { ok: true; cueId: number } | { ok: false; error: string } {
  const t = text.trim();
  if (!t) return { ok: false, error: "empty line" };
  if (!cue) return { ok: false, error: "no address is open; Brandon speaks only when addressed" };
  if (line) return { ok: false, error: `address ${cue.id} is already answered` };
  line = { cueId: cue.id, text: t };
  return { ok: true, cueId: cue.id };
}

/** The floor takes the answer, once. */
export function takeLine(): Line | null {
  const l = line;
  line = null;
  if (l) cue = null;
  return l;
}

export function closeCue() {
  cue = null;
  line = null;
}
