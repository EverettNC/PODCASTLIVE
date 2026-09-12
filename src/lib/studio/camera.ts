import { RUNDOWN, type Beat, type BeatSpeaker } from "./show";

/**
 * From Now Till Always — camera bible.
 *
 * This is not live. The show is processed in advance: voices first, then
 * mouths, then the camera. When it rolls, the switcher already knows the
 * shot. Two cameras on the floor:
 *
 *   CAM A  — three-shot. All three at the desk. Headphones. Mics. The room.
 *   CAM B  — iso. Whoever is talking. Scan / punch onto that seat.
 *
 * Rules:
 *   1. After the title, we sit on CAM A. Establish the desk.
 *   2. When someone talks, we scan onto them (CAM B). Hold while they talk.
 *   3. When the next person talks, we punch to that iso. Live switcher.
 *   4. New section, or every few punches: dump back to CAM A, then scan in.
 *   5. Close: CAM A, then the last lines punch, then the card.
 *
 * Mouths are driven by the baked tape, not by a live mic.
 */

export type CamShot = "two" | "lead" | "patty" | "talent";
export type CamMove = "cut" | "scan" | "dump";

export type CamCue = {
  beatId: string;
  shot: CamShot;
  move: CamMove;
  /** Sit on the three-shot this many ms before scanning in. */
  holdWideMs: number;
};

function seatShot(speaker: BeatSpeaker): CamShot {
  if (speaker === "patty") return "patty";
  if (speaker === "talent") return "talent";
  return "lead";
}

function spoken(beat: Beat) {
  return beat.speaker === "everett" || beat.speaker === "patty" || beat.speaker === "talent";
}

function sectionOf(id: string) {
  return id.split("-")[0] ?? id;
}

export function planCamera(rundown: Beat[] = RUNDOWN): CamCue[] {
  const cues: CamCue[] = [];
  let prevSection = "";
  let prevSpeaker: BeatSpeaker | null = null;
  let punches = 0;

  for (const beat of rundown) {
    if (!spoken(beat)) continue;
    const section = sectionOf(beat.id);
    const newSection = section !== prevSection;
    let move: CamMove = "cut";
    let holdWideMs = 0;
    const shot = seatShot(beat.speaker);

    if (newSection) {
      move = "scan";
      holdWideMs =
        section === "cold" || section === "s1" || section === "close" ? 1400 : 900;
      punches = 0;
    } else if (punches >= 3 && beat.speaker !== prevSpeaker) {
      move = "dump";
      holdWideMs = 1100;
      punches = 0;
    } else if (prevSpeaker && beat.speaker !== prevSpeaker) {
      move = "cut";
    } else {
      move = "cut";
    }

    punches += 1;
    prevSpeaker = beat.speaker;
    prevSection = section;
    cues.push({ beatId: beat.id, shot, move, holdWideMs });
  }

  return cues;
}

export const CAMERA = planCamera();

export function cueFor(beatId: string) {
  return CAMERA.find((c) => c.beatId === beatId) ?? null;
}
