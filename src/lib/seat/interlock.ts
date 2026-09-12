import { CUES, disclaimerOf, type Cue } from "./cuebook.ts";

export type Phase = "standby" | "coldopen" | "rolling" | "done";
export type ShowEventKind =
  | "standby"
  | "roll"
  | "cue_fired"
  | "cue_completed"
  | "clock_started"
  | "line_spoken"
  | "line_dropped"
  | "refused"
  | "kill"
  | "release"
  | "done";
export type ShowEvent = {
  ts: string;
  kind: ShowEventKind;
  cue?: string;
  owner?: string;
  text?: string;
  detail?: string;
};

export class InterlockError extends Error {
  constructor(detail: string) {
    super(`refused: ${detail}`);
    this.name = "InterlockError";
  }
}

export type Show = ReturnType<typeof createShow>;

/**
 * The show's state machine. Every transition is logged through `log`.
 *
 * The disclaimer interlock: `roll()` enters the cold open but does NOT start the
 * clock. The only way to a running clock is `complete()` on the last disclaimer
 * cue with played >= duration. There is no argument, flag, or method that skips
 * that. `advance()` and `jumpTo()` refuse during the cold open. Refusals are
 * logged, then thrown.
 */
export function createShow(
  log: (e: ShowEvent) => void,
  cues: Cue[] = CUES,
  now: () => Date = () => new Date(),
) {
  const lastDisclaimer = disclaimerOf(cues).at(-1)!;
  let phase: Phase = "standby";
  let index = -1;
  let clockStartedAt: Date | null = null;
  let killed = false;
  const completed = new Set<string>();

  const current = () => cues[index] as Cue | undefined;
  const emit = (kind: ShowEventKind, extra: Omit<ShowEvent, "ts" | "kind"> = {}) =>
    log({ ts: now().toISOString(), kind, ...extra });
  const refuse: (detail: string) => never = (detail) => {
    emit("refused", { detail, cue: current()?.id });
    throw new InterlockError(detail);
  };
  const fire = (i: number) => {
    index = i;
    const c = cues[i];
    emit("cue_fired", { cue: c.id, owner: c.owner, text: c.text });
  };
  const next = () => {
    if (index + 1 < cues.length) return fire(index + 1);
    phase = "done";
    emit("done");
  };
  /** His own cue on program, or an explicit address from the operator once the show is rolling. Never while killed. */
  const speakAllowed = (addressed = false) =>
    !killed &&
    (current()?.owner === "BRANDON" ? phase === "coldopen" || phase === "rolling" : addressed && phase === "rolling");

  return {
    get phase() {
      return phase;
    },
    get killed() {
      return killed;
    },
    current,
    completed: () => [...completed],
    clockMs: () => (clockStartedAt ? now().getTime() - clockStartedAt.getTime() : null),

    standby() {
      phase = "standby";
      index = -1;
      clockStartedAt = null;
      killed = false;
      completed.clear();
      emit("standby");
    },

    roll() {
      if (phase !== "standby") refuse(`ROLL from ${phase}; only from standby`);
      phase = "coldopen";
      emit("roll");
      fire(0);
    },

    /** The cue on program finished playing. Shortened = refused. Completing the last disclaimer cue is what starts the clock. */
    complete(cueId: string, playedMs: number, durationMs: number) {
      const c = current();
      if (!c || c.id !== cueId) {
        refuse(`complete ${cueId}: not the cue on program${c ? ` (${c.id} is)` : ""}`);
      }
      if (playedMs + 1 < durationMs) {
        refuse(`complete ${cueId}: played ${Math.round(playedMs)} ms of ${Math.round(durationMs)} ms, shortened`);
      }
      completed.add(cueId);
      emit("cue_completed", { cue: cueId, owner: c.owner });
      if (phase === "coldopen" && cueId === lastDisclaimer.id) {
        phase = "rolling";
        clockStartedAt = now();
        emit("clock_started");
      }
      next();
    },

    /** Operator skip. Never during the disclaimer. */
    advance() {
      if (phase === "coldopen") refuse("advance during the disclaimer; it plays to completion");
      if (phase !== "rolling") refuse(`advance from ${phase}`);
      next();
    },

    jumpTo(cueId: string) {
      if (phase === "coldopen") refuse(`jump to ${cueId} during the disclaimer`);
      if (phase !== "rolling") refuse(`jump from ${phase}`);
      const i = cues.findIndex((c) => c.id === cueId);
      if (i < 0) refuse(`unknown cue ${cueId}`);
      fire(i);
    },

    speakAllowed,

    /** Brandon's line, verbatim as generated. Refused unless his cue is on program and the kill switch is off. */
    spoke(text: string, addressed = false) {
      if (!speakAllowed(addressed)) {
        refuse(`Brandon spoke while not cued${killed ? " (kill switch engaged)" : ""}`);
      }
      emit("line_spoken", { cue: current()!.id, owner: "BRANDON", text });
    },

    /** Kill switch engaged with his cue on program: the line is not spoken, the log says so, the show moves on. */
    drop() {
      const c = current();
      if (!c || c.owner !== "BRANDON" || !killed || phase !== "rolling") {
        refuse(`drop ${c?.id ?? "nothing"}: only Brandon's cue on program, while killed`);
      }
      emit("line_dropped", { cue: c.id, owner: "BRANDON", text: c.text });
      next();
    },

    /** Mute and freeze. Does not change phase or cue; the pipeline stays up. */
    kill() {
      killed = true;
      emit("kill", { cue: current()?.id });
    },
    release() {
      killed = false;
      emit("release", { cue: current()?.id });
    },
  };
}
