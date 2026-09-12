import type { FaceRig } from "../avatar/landmarks.ts";
import { RUNDOWN, SHOW, type Beat } from "../studio/show.ts";

export type Owner = "EVERETT" | "PATTY" | "BRANDON" | "BLACK" | "TITLE";
export type Cue = { n: string; id: string; owner: Owner; label: string; text: string };
export type Seat = FaceRig["id"];
/** The plate a spoken cue plays on. Silent cues have no seat. */
export const SEAT: Partial<Record<Owner, Seat>> = { EVERETT: "lead", PATTY: "patty", BRANDON: "talent" };
/** How long a silent cue holds the picture. Script: "Hold 4-5 seconds" for the title. */
export const HOLD_MS = { BLACK: 1500, TITLE: 4500 } as const;

const OWNER: Record<Beat["speaker"], Owner> = {
  everett: "EVERETT",
  patty: "PATTY",
  talent: "BRANDON",
  black: "BLACK",
  card: "TITLE",
  // The standing-set reveal is the second half of the title-card direction in the script.
  show: "TITLE",
};

/** The cue book: the rundown in show.ts, which was taken from FNTA_Ep01_Script.md. Not invented here. */
export const CUES: Cue[] = RUNDOWN.map((b) => ({
  n: b.n,
  id: b.id,
  owner: OWNER[b.speaker],
  label: b.label,
  text: b.text,
}));

/** The disclaimer block: the cold open through the last line before the first TITLE cue. A book without one cannot roll. */
export function disclaimerOf(cues: Cue[]): Cue[] {
  const end = cues.findIndex((c) => c.owner === "TITLE");
  if (end < 1) throw new Error("cue book has no disclaimer block before the first TITLE cue; the interlock has nothing to hold");
  return cues.slice(0, end);
}
export const DISCLAIMER_CUES = disclaimerOf(CUES);

export function cueById(id: string): Cue {
  const c = CUES.find((x) => x.id === id);
  if (!c) throw new Error(`unknown cue: ${id}`);
  return c;
}

/** Plain text, one cue after another. Opens in any editor; reads aloud cleanly. */
export function renderCueBook(): string {
  const first = DISCLAIMER_CUES[0];
  const last = DISCLAIMER_CUES[DISCLAIMER_CUES.length - 1];
  const lines = [
    `${SHOW.title}. ${SHOW.episodeNum}. ${SHOW.episodeName}`,
    `Cue book. ${CUES.length} cues. Generated from the rundown in src/lib/studio/show.ts.`,
    `Cues ${first.n} to ${last.n} are the disclaimer. The clock cannot start until they have played to completion.`,
    "",
  ];
  for (const c of CUES) {
    lines.push(`${c.n}  ${c.owner.padEnd(8)} ${c.label}`);
    for (const p of c.text.split(/\n+/)) lines.push(`    ${p}`);
    lines.push("");
  }
  return lines.join("\n");
}
