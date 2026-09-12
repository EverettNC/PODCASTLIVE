import { audioEngine } from "@/lib/avatar/audio-engine";
import type { VisemeTrack } from "@/lib/seat/envelope.ts";
import { playTake, show, type Seat } from "@/lib/seat/live.ts";
import { SEAT_VOICE, voiceFor } from "@/lib/studio/book";
import { beingFor, type MillSeat } from "@/lib/studio/mill";
import { RUNDOWN } from "@/lib/studio/show";
import { useStudio } from "@/lib/studio-store";
import { settle } from "@/lib/studio/hard";
import { splitTakes } from "@/lib/text";
import { askHost } from "@/lib/xai/talk";

export { splitTakes };

export type Take = { audio: ArrayBuffer; lipsync?: VisemeTrack };

function seatOf(speaker: string): MillSeat {
  if (speaker === "patty") return "patty";
  if (speaker === "talent") return "talent";
  return "everett";
}

const rigSeat = (s: MillSeat): Seat => (s === "everett" ? "lead" : s);

/** One take from the mill through /api/tts: audio, plus phoneme timing when the mill sent it. */
export async function synthesize(text: string, voice: string, being: string, reference: string): Promise<Take> {
  const millUrl = useStudio.getState().millUrl || "";
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice, being, millUrl, reference }),
    signal: AbortSignal.timeout(40000),
  });
  if (!res.ok) throw new Error(`mill ${res.status}`);
  if ((res.headers.get("content-type") || "").includes("application/json")) {
    const data = (await res.json()) as { wav: string; lipsync?: VisemeTrack };
    const bin = atob(data.wav);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return { audio: bytes.buffer, lipsync: data.lipsync };
  }
  return { audio: await res.arrayBuffer() };
}

export async function speakText(text: string, voiceId?: string) {
  const store = useStudio.getState();
  const takes = splitTakes(text);
  if (!takes.length) return;
  store.clearError();
  store.setStatus("speaking");
  store.setOnAir(true);
  audioEngine.setVolume(show.killed ? 0 : store.volume);
  await audioEngine.ensure();

  const beat = RUNDOWN.find((b) => b.id === store.beatId);
  const speaker = beat?.speaker ?? "talent";
  const voice = voiceId ?? (beat ? voiceFor(beat.speaker) : store.voice);
  const seat = seatOf(voiceId ? "talent" : speaker);
  const being = beingFor(seat);
  const reference = store.millPath[seat];
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
      await playTake(rigSeat(seat), buf, got.lipsync);
      heard = true;
    }
  } catch (err) {
    if (!heard) {
      const why = err instanceof Error ? err.message : String(err);
      store.setError(`Take failed: ${why}. If the mill is down: python3 -m christman_voice_sdk.mill`);
    }
  } finally {
    audioEngine.stopPlayback();
    const current = useStudio.getState();
    if (current.status === "speaking") current.setStatus("idle");
    if (heard) current.setCaption(null);
  }
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
  const result = await settle(
    askHost({ data: { cue: line, history: useStudio.getState().history } }).catch(() => ({
      ok: false as const,
      error: "offline" as const,
    })),
    9000,
    { ok: false as const, error: "busy" as const },
  );
  if (!result.ok) {
    store.setStatus("idle");
    store.setError(`The seat's model is ${result.error}. Brandon says nothing.`);
    return;
  }
  try {
    show.spoke(result.text, true);
  } catch (err) {
    store.setStatus("idle");
    store.setError(err instanceof Error ? err.message : String(err));
    return;
  }
  store.pushHistory({ role: "assistant", content: result.text });
  await speakText(result.text, SEAT_VOICE.talent);
}

export function stopSpeaking() {
  audioEngine.stopPlayback();
  const store = useStudio.getState();
  store.setStatus("idle");
  store.setCaption(null);
}

type BrowserSpeech = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((ev: {
    results: {
      length: number;
      [i: number]: { isFinal: boolean; 0: { transcript: string } };
    };
  }) => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

/** Browser speech recognition. Hosted by the browser vendor, not local: flagged for replacement by THE FILAMENT. */
export function createSpeechRecognizer(): BrowserSpeech | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => BrowserSpeech;
    webkitSpeechRecognition?: new () => BrowserSpeech;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  return new Ctor();
}
