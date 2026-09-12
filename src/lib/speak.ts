import { audioEngine } from "@/lib/avatar/audio-engine";
import { SEAT_VOICE, voiceFor } from "@/lib/studio/book";
import { beingFor, type MillSeat } from "@/lib/studio/mill";
import { RUNDOWN } from "@/lib/studio/show";
import { useStudio } from "@/lib/studio-store";
import { settle } from "@/lib/studio/hard";
import { splitTakes } from "@/lib/text";
import { askHost } from "@/lib/xai/talk";

export { splitTakes };

export function localTalentTake(cue: string): string {
  const t = cue.replace(/\s+/g, " ").trim();
  if (!t) return "Christman, over to you.";
  if (t.split(/\s+/).length > 16) return t;
  if (/\?$/.test(t)) {
    return `Christman, that's the question. ${t.replace(/\?$/, ".")} I'll take the first pass.`;
  }
  return `On that — ${t.replace(/[.!?]+$/, "")}. Back to you, Christman.`;
}

function seatOf(speaker: string): MillSeat {
  if (speaker === "patty") return "patty";
  if (speaker === "talent") return "talent";
  return "everett";
}

export async function synthesize(
  text: string,
  voice: string,
  being: string,
  reference: string,
): Promise<ArrayBuffer> {
  const state = useStudio.getState();
  const millUrl = state.millUrl || "";
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), 14000);
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice,
        being,
        millUrl,
        reference,
        millOnly: true,
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error("mill");
    return await res.arrayBuffer();
  } finally {
    window.clearTimeout(timer);
  }
}

async function playExpress(url: string) {
  await audioEngine.playUrl(url);
}

function expressFor(beatId: string | undefined, text: string) {
  const store = useStudio.getState();
  if (beatId && store.expressBeat[beatId]) return store.expressBeat[beatId];
  const want = text.replace(/\s+/g, " ").trim().toLowerCase();
  for (const [id, url] of Object.entries(store.expressBeat)) {
    const beat = RUNDOWN.find((b) => b.id === id);
    if (beat && beat.text.replace(/\s+/g, " ").trim().toLowerCase() === want) {
      return url;
    }
  }
  if (beatId) return `/audio/book/${beatId}.mp3`;
  return null;
}

export async function speakText(text: string, voiceId?: string) {
  const store = useStudio.getState();
  const takes = splitTakes(text);
  if (!takes.length) return;
  store.clearError();
  store.setStatus("speaking");
  store.setOnAir(true);
  audioEngine.setVolume(store.volume);
  await audioEngine.ensure();

  const beat = RUNDOWN.find((b) => b.id === store.beatId);
  const speaker = beat?.speaker ?? "talent";
  const voice = voiceId ?? (beat ? voiceFor(beat.speaker) : store.voice);
  const being = beingFor(voiceId ? "talent" : speaker);
  const seat = seatOf(voiceId ? "talent" : speaker);
  const reference = store.millPath[seat];
  let heard = false;

  try {
    for (const take of takes) {
      if (useStudio.getState().status !== "speaking") break;
      store.setCaption(take);
      const buf = await synthesize(take, voice, being, reference);
      if (useStudio.getState().status !== "speaking") break;
      await audioEngine.playArrayBuffer(buf);
      heard = true;
    }
  } catch {
    if (!heard) {
      store.setError(
        "Christman-Sound is not seated. Start the mill. That is your voice. The fake tape is dead.",
      );
    }
  } finally {
    audioEngine.stopPlayback();
    const current = useStudio.getState();
    if (current.status === "speaking") current.setStatus("idle");
    if (heard) current.setCaption(null);
  }
}

export async function speakBookTape() {
  const store = useStudio.getState();
  store.clearError();
  store.setStatus("speaking");
  store.setOnAir(true);
  audioEngine.setVolume(store.volume);
  await audioEngine.ensure();
  try {
    await playExpress("/audio/ep01.mp3");
  } catch {
    store.setError("Book tape is missing.");
  } finally {
    audioEngine.stopPlayback();
    const current = useStudio.getState();
    if (current.status === "speaking") current.setStatus("idle");
  }
}

export async function runHostCue(cue: string) {
  const store = useStudio.getState();
  const line = cue.trim();
  if (!line) return;
  store.clearError();
  store.setStatus("thinking");
  store.pushLog("producer", line);
  store.pushHistory({ role: "user", content: line });
  let take = localTalentTake(line);
  try {
    const result = await settle(
      askHost({
        data: { cue: line, history: useStudio.getState().history },
      }),
      9000,
      { ok: false as const, error: "busy" as const },
    );
    if (result.ok) take = result.text;
  } catch {
    /* local take */
  }
  store.pushHistory({ role: "assistant", content: take });
  store.pushLog("talent", take);
  await speakText(take, SEAT_VOICE.talent);
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
