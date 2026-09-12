import { createFileRoute } from "@tanstack/react-router";
import { normalizeMillUrl } from "@/lib/studio/mill";

const MAX_CHARS = 100000;
const TIMEOUT = 40000; // XTTS on a CPU can take a while on a long line

type MillTake = { audio: ArrayBuffer; lipsync?: unknown };

async function millTake(
  millUrl: string,
  text: string,
  being: string,
  reference: string,
): Promise<MillTake | { error: string }> {
  const body = JSON.stringify({
    text,
    being,
    lang: "en",
    reference_audio_path: reference || undefined,
    emotion_params: { emotion: "neutral" },
  });
  const headers = { "Content-Type": "application/json" };
  const abs = (u: string) => (/^https?:\/\//i.test(u) ? u : `${millUrl}${u.startsWith("/") ? u : `/${u}`}`);
  let last = "no response";
  for (const path of ["/generate", "/speak"]) {
    try {
      const res = await fetch(`${millUrl}${path}`, { method: "POST", headers, body, signal: AbortSignal.timeout(TIMEOUT) });
      if (res.status === 404) continue;
      const type = (res.headers.get("content-type") || "").toLowerCase();
      if (!res.ok) {
        last = type.includes("json") ? JSON.stringify(await res.json().catch(() => ({ status: res.status }))) : `HTTP ${res.status}`;
        continue;
      }
      if (type.includes("audio/") || type.includes("octet-stream")) return { audio: await res.arrayBuffer() };
      const data = (await res.json().catch(() => null)) as {
        audio_url?: unknown;
        wav?: unknown;
        audio?: unknown;
        lipsync_url?: unknown;
      } | null;
      if (!data) continue;
      const rel =
        (typeof data.audio_url === "string" && data.audio_url) ||
        (typeof data.wav === "string" && data.wav) ||
        (typeof data.audio === "string" && data.audio) ||
        "";
      if (!rel) continue;
      const audioRes = await fetch(abs(rel), { signal: AbortSignal.timeout(TIMEOUT) });
      if (!audioRes.ok) continue;
      const audio = await audioRes.arrayBuffer();
      let lipsync: unknown;
      if (typeof data.lipsync_url === "string") {
        const lr = await fetch(abs(data.lipsync_url), { signal: AbortSignal.timeout(TIMEOUT) });
        if (lr.ok) lipsync = await lr.json();
      }
      return { audio, lipsync };
    } catch (err) {
      last = err instanceof Error ? err.message : String(err);
      continue;
    }
  }
  return { error: last };
}

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: { text?: unknown; being?: unknown; millUrl?: unknown; reference?: unknown };
        try {
          payload = (await request.json()) as typeof payload;
        } catch {
          return Response.json({ error: "Bad request." }, { status: 400 });
        }

        const text = typeof payload.text === "string" ? payload.text.trim() : "";
        const being = typeof payload.being === "string" ? payload.being.trim() : "everett";
        const reference = typeof payload.reference === "string" ? payload.reference.trim() : "";
        const millUrl = normalizeMillUrl(typeof payload.millUrl === "string" ? payload.millUrl : "");
        if (!text) return Response.json({ error: "Nothing to speak." }, { status: 400 });
        if (text.length > MAX_CHARS) {
          return Response.json({ error: `Keep it under ${MAX_CHARS} characters per take.` }, { status: 400 });
        }
        if (!millUrl) return Response.json({ error: "mill-missing", detail: "no mill URL" }, { status: 503 });

        const take = await millTake(millUrl, text, being, reference);
        if ("error" in take) {
          return Response.json({ error: "mill-missing", detail: take.error }, { status: 503 });
        }
        if (take.audio.byteLength <= 64) {
          return Response.json({ error: "mill-empty", detail: "the mill returned no audio" }, { status: 503 });
        }
        if (take.lipsync) {
          return Response.json({ wav: Buffer.from(take.audio).toString("base64"), lipsync: take.lipsync });
        }
        return new Response(take.audio, {
          headers: { "Content-Type": "audio/wav", "Cache-Control": "no-store", "X-Mill": "christman" },
        });
      },
    },
  },
});
