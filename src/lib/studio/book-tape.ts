import { RUNDOWN } from "./show";
import { audioEngine } from "@/lib/avatar/audio-engine";

const tapes = new Map<string, AudioBuffer>();
let loading: Promise<void> | null = null;

function spoken(id: string, speaker: string) {
  return speaker === "everett" || speaker === "patty" || speaker === "talent";
}

export function tapeOf(beatId: string) {
  return tapes.get(beatId) ?? null;
}

export function bookReady() {
  return tapes.size > 0;
}

/** Decode every book take up front so mouths and voices are seated before we roll. */
export async function loadBook() {
  if (tapes.size >= 20) return;
  if (loading) return loading;
  loading = (async () => {
    await audioEngine.ensure();
    const ctx = audioEngine.ctx;
    if (!ctx) return;
    const jobs = RUNDOWN.filter((b) => spoken(b.id, b.speaker)).map(async (b) => {
      if (tapes.has(b.id)) return;
      try {
        const res = await fetch(`/audio/book/${b.id}.mp3`);
        if (!res.ok) return;
        const data = await res.arrayBuffer();
        if (data.byteLength < 64) return;
        const buf = await ctx.decodeAudioData(data.slice(0));
        tapes.set(b.id, buf);
      } catch {
        /* skip a missing take — mill can still sit later */
      }
    });
    await Promise.all(jobs);
  })();
  try {
    await loading;
  } finally {
    loading = null;
  }
}
