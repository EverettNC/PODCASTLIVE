import { audioEngine } from "@/lib/avatar/audio-engine";
import type { VisemeTrack } from "@/lib/seat/envelope.ts";
import { CUES, SEAT, type Seat } from "@/lib/seat/cuebook.ts";
import { playTake, show } from "@/lib/seat/live.ts";
import { SEAT_VOICE } from "@/lib/studio/book";
import { beingFor, type MillSeat } from "@/lib/studio/mill";
import { useStudio } from "@/lib/studio-store";
import { settle } from "@/lib/studio/hard";
import { splitTakes } from "@/lib/text";
import type { Reply } from "@/lib/seat/brain.ts";
import { askHost } from "@/lib/seat/brain-rpc.ts";

export { splitTakes };

type Take = { audio: ArrayBuffer; lipsync?: VisemeTrack };

const millSeat = (s: Seat): MillSeat => (s === "lead" ? "everett" : s);

/** One take from the mill through /api/tts: audio, plus phoneme timing when the mill sent it. */
async function synthesize(text: string, voice: string, being: string, reference: string): Promise<Take> {
  const millUrl = useStudio.getState().millUrl || "";
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice, being, millUrl, reference }),
    signal: AbortSignal.timeout(40000),
  });
  if (!res.ok) throw new Error(`mill ${res.status}`);
  const data = (await res.json()) as { wav: string; lipsync?: VisemeTrack };
  const bin = atob(data.wav);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { audio: bytes.buffer, lipsync: data.lipsync };
}

/**
 * Speak on the seat of the cue on program (Brandon's, when a voice is named).
 * Brandon's seat goes through the interlock first: the line is logged verbatim
 * or refused, whichever panel it came from. Resolves true once a take has played.
 */
export async function speakText(text: string, voiceId?: string): Promise<boolean> {
  const store = useStudio.getState();
  const takes = splitTakes(text);
  if (!takes.length) return false;
  store.clearError();
  const gen = store.rollGen; // Stop moves the generation on; a take dispatched before it must not play after it
  const cue = CUES.find((c) => c.id === store.beatId);
  const seat: Seat = voiceId ? "talent" : ((cue && SEAT[cue.owner]) ?? "talent");
  if (seat === "talent") {
    try {
      show.spoke(text, true);
    } catch (err) {
      store.setStatus("idle");
      store.setError(err instanceof Error ? err.message : String(err));
      return false;
    }
  }
  store.setStatus("speaking");
  store.setOnAir(true);
  audioEngine.setVolume(show.killed ? 0 : store.volume);
  await audioEngine.ensure();

  const voice = voiceId ?? SEAT_VOICE[millSeat(seat)];
  const being = beingFor(millSeat(seat));
  const reference = ""; // the voice server finds each seat's voice in voices/ on its own
  let heard = false;

  try {
    const stale = () => useStudio.getState().status !== "speaking" || useStudio.getState().rollGen !== gen;
    for (const take of takes) {
      if (stale()) break;
      store.setCaption(take);
      const got = await synthesize(take, voice, being, reference);
      if (stale()) break;
      const ctx = audioEngine.ctx;
      if (!ctx) throw new Error("audio context unavailable");
      const buf = await ctx.decodeAudioData(got.audio.slice(0));
      await playTake(seat, buf, got.lipsync);
      heard = true;
    }
  } catch (err) {
    if (!heard) {
      const why = err instanceof Error ? err.message : String(err);
      store.setError(`Take failed: ${why}. If the voice server is down: npm run voice`);
    }
  } finally {
    audioEngine.stopPlayback();
    const current = useStudio.getState();
    if (current.status === "speaking") current.setStatus("idle");
    if (heard) current.setCaption(null);
  }
  return heard;
}

/** The operator addresses Brandon. He answers only if the interlock allows it, and only with a real reply. */
export async function runHostCue(cue: string) {
  const store = useStudio.getState();
  const line = cue.trim();
  if (!line) return;
  store.clearError();
  if (!show.speakAllowed(true)) {
    store.setError(
      show.killed
        ? "Kill switch is engaged. Brandon stays silent."
        : "Brandon speaks only when the show is rolling and he is cued.",
    );
    return;
  }
  store.setStatus("thinking");
  store.pushLog("producer", line);
  store.pushHistory({ role: "user", content: line });
  const gen = store.rollGen;

  // The address goes up for the live seat first. If a seat is in the chair, its line wins; else the in-app brain answers.
  const opened = (await fetch("/api/brandon/cue", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ text: line }) })
    .then((r) => r.json())
    .catch(() => ({ liveSeat: false }))) as { liveSeat: boolean };
  let result: Reply | null = null;
  if (opened.liveSeat) {
    store.pushLog("system", "Live seat is in the chair. Waiting for Brandon's line.");
    result = await waitForLine(LINE_WAIT_MS);
    if (!result) store.pushLog("system", "No line from the live seat in time. The in-app brain answers.");
  }
  // A local model on a laptop can take a while on a long cue; the cap matches the server's own timeout.
  result ??= await settle(
    askHost({ data: { cue: line, history: useStudio.getState().history } }).catch((err: unknown) => ({
      ok: false as const,
      error: "offline" as const,
      detail: err instanceof Error ? err.message : String(err),
    })),
    30000,
    { ok: false as const, error: "busy" as const, detail: "no reply within 30 s" },
  );
  if (useStudio.getState().rollGen !== gen) return store.setStatus("idle"); // Stop was pressed while he was thinking
  if (!result.ok) {
    store.setStatus("idle");
    store.setError(`Brandon's model is ${result.error}: ${result.detail}. He says nothing.`);
    return;
  }
  store.pushLog("system", `Brandon via ${result.via}.`);
  // speakText puts the line through the interlock; only a line he actually said joins his history.
  if (await speakText(result.text, SEAT_VOICE.talent)) store.pushHistory({ role: "assistant", content: result.text });
}

const JSON_HEADERS = { "Content-Type": "application/json" };
const LINE_WAIT_MS = 20000;

/** Poll the line-in until the live seat answers, the wait runs out, or the operator moves on. */
async function waitForLine(ms: number): Promise<Reply | null> {
  const t0 = Date.now();
  while (Date.now() - t0 < ms && useStudio.getState().status === "thinking") {
    const r = (await fetch("/api/brandon/line").then((x) => x.json()).catch(() => ({ line: null }))) as { line: { text: string } | null };
    if (r.line) return { ok: true, text: r.line.text, via: "live seat" };
    await new Promise((res) => window.setTimeout(res, 500));
  }
  return null;
}

/** The operator pastes a line for Brandon. It answers the open address if there is one; else the paste is the address. */
export async function postBrandonLine(text: string) {
  const t = text.trim();
  if (!t) return;
  const r = (await fetch("/api/brandon/line", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ text: t }) })
    .then((x) => x.json())
    .catch(() => ({ ok: false }))) as { ok: boolean };
  if (!r.ok) await speakText(t, SEAT_VOICE.talent);
}

export function stopSpeaking() {
  audioEngine.stopPlayback();
  const store = useStudio.getState();
  store.setStatus("idle");
  store.setCaption(null);
}
