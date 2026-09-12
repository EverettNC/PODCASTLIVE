import { audioEngine } from "../avatar/audio-engine";
import { loadBook, tapeOf } from "../studio/book-tape";
import { useStudio } from "../studio-store";
import { HOLD_MS, SEAT, type Seat } from "./cuebook.ts";
import { frameAt, mergeVisemeTrack, mouthFrames, type MouthFrame, type VisemeTrack } from "./envelope.ts";
import { createShow, type ShowEvent } from "./interlock.ts";
import { appendShowEvent } from "./showlog-rpc.ts";

let playing: { seat: Seat; frames: MouthFrame[] } | null = null;

function sink(e: ShowEvent) {
  const s = useStudio.getState();
  useStudio.setState({ phase: show.phase, killed: show.killed });
  if (e.kind === "clock_started") {
    useStudio.setState({ rolledAt: Date.now() });
    s.pushLog("system", "Disclaimer complete. Clock running.");
  } else if (e.kind === "line_spoken") s.pushLog("talent", e.text ?? "");
  else if (e.kind === "line_dropped") s.pushLog("system", `Line dropped, kill switch engaged: ${e.text}`);
  else if (e.kind === "refused") s.pushLog("system", `Refused: ${e.detail}`);
  else if (e.kind === "kill") s.pushLog("system", "Kill switch engaged. Brandon is muted and at rest.");
  else if (e.kind === "release") s.pushLog("system", "Kill switch released.");
  void appendShowEvent({ data: e }).catch((err: unknown) => {
    s.setError(`Show log failed: ${err instanceof Error ? err.message : String(err)}`);
  });
}

/** The one interlock for the whole floor. */
export const show = createShow(sink);

export const isKilled = () => show.killed;

/** Mouth drive for the seat that is speaking right now, measured from its audio. Null = at rest. */
export function liveMouth(seat: Seat): MouthFrame | null {
  if (playing?.seat !== seat || !audioEngine.playing) return null;
  if (show.killed && seat === "talent") return null;
  return frameAt(playing.frames, audioEngine.playbackTime());
}

/** STANDBY: every take decoded, then silent. Mouth timing is measured from each take as it plays. */
export async function standby() {
  await loadBook();
  show.standby();
}

export async function playTake(seat: Seat, buf: AudioBuffer, lipsync?: VisemeTrack) {
  const frames = mouthFrames(buf.getChannelData(0), buf.sampleRate);
  playing = { seat, frames: lipsync ? mergeVisemeTrack(frames, lipsync) : frames };
  try {
    await audioEngine.playBuffer(buf);
  } finally {
    playing = null;
  }
}

/** Play the cue on program to completion and tell the interlock how much actually played. */
export async function playCurrent(alive: () => boolean) {
  const c = show.current();
  if (!c) return;
  const s = useStudio.getState();
  s.programBeat(c.id);

  if (c.owner === "BLACK" || c.owner === "TITLE") {
    const hold = HOLD_MS[c.owner];
    await wait(hold, alive);
    if (alive() && show.current()?.id === c.id) show.complete(c.id, hold, hold);
    return;
  }

  const buf = tapeOf(c.id);
  if (!buf) throw new Error(`stage tts: no take for cue ${c.n} ${c.label}. Nothing moves without audio.`);
  if (c.owner === "BRANDON") {
    if (show.killed) return show.drop(); // logged as line_dropped; the show moves on without him
    show.spoke(c.text); // the take is his line
  }
  s.setLine(buf.duration * 1000, c.text);
  const t0 = audioEngine.ctx?.currentTime ?? 0;
  await playTake(SEAT[c.owner]!, buf); // spoken cues always have a seat
  const played = ((audioEngine.ctx?.currentTime ?? t0) - t0) * 1000;
  s.clearLine();
  if (!alive() || show.current()?.id !== c.id) return; // stopped, or the operator jumped
  show.complete(c.id, played, buf.duration * 1000);
}

/** Operator jump. Rehearsal moves freely; on air it goes through the interlock. */
export function jumpTo(cueId: string) {
  const s = useStudio.getState();
  if (show.phase === "standby") {
    s.setBeat(cueId);
    return;
  }
  try {
    show.jumpTo(cueId);
    audioEngine.stopPlayback();
    s.clearLine();
    s.programBeat(cueId);
  } catch (err) {
    s.setError(err instanceof Error ? err.message : String(err));
  }
}

export function engageKill() {
  show.kill();
  audioEngine.setVolume(0);
}

export function releaseKill() {
  show.release();
  audioEngine.setVolume(useStudio.getState().volume);
}

function wait(ms: number, alive: () => boolean) {
  return new Promise<void>((resolve) => {
    const t0 = Date.now();
    const tick = () => {
      if (!alive() || Date.now() - t0 >= ms) resolve();
      else window.setTimeout(tick, 40);
    };
    tick();
  });
}
