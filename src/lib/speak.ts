import { audioEngine } from "@/lib/avatar/audio-engine";
import type { VisemeTrack } from "@/lib/seat/envelope.ts";
import { CUES, SEAT, type Seat } from "@/lib/seat/cuebook.ts";
import { playTake, show } from "@/lib/seat/live.ts";
import { SEAT_VOICE } from "@/lib/studio/book";
import { beingFor, type MillSeat } from "@/lib/studio/mill";
import { useStudio } from "@/lib/studio-store";
import { settle } from "@/lib/studio/hard";
import { splitTakes } from "@/lib/text";
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
  const reference = store.millPath[millSeat(seat)];
  let heard = false;

  try {
    for (const take of takes) {
      if (useStudio.getState().status !== "speaking") break;
      store.setCaption(take);
      const got = await synthesize(take, voice, being, reference);
      if (useStudio.getState().status !== "speaking") break;
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
  // A local model on a laptop can take a while on a long cue; the cap matches the server's own timeout.
  const result = await settle(
    askHost({ data: { cue: line, history: useStudio.getState().history } }).catch((err: unknown) => ({
      ok: false as const,
      error: "offline" as const,
      detail: err instanceof Error ? err.message : String(err),
    })),
    30000,
    { ok: false as const, error: "busy" as const, detail: "no reply within 30 s" },
  );
  if (!result.ok) {
    store.setStatus("idle");
    store.setError(`Brandon's model is ${result.error}: ${result.detail}. He says nothing.`);
    return;
  }
  // speakText puts the line through the interlock; only a line he actually said joins his history.
  if (await speakText(result.text, SEAT_VOICE.talent)) store.pushHistory({ role: "assistant", content: result.text });
}

export function stopSpeaking() {
  audioEngine.stopPlayback();
  const store = useStudio.getState();
  store.setStatus("idle");
  store.setCaption(null);
}
