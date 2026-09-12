import { createFileRoute } from "@tanstack/react-router";
import { normalizeMillUrl } from "@/lib/studio/mill";

const MAX_CHARS = 100000;

async function millAudio(
  millUrl: string,
  text: string,
  being: string,
  reference: string,
): Promise<ArrayBuffer | null> {
  const body = JSON.stringify({
    text,
    being,
    lang: "en",
    reference_audio_path: reference || undefined,
    emotion_params: { emotion: "neutral" },
  });
  const headers = { "Content-Type": "application/json" };
  const paths = ["/generate", "/speak", "/"];
  for (const path of paths) {
    try {
      const res = await fetch(`${millUrl}${path === "/" ? "/generate" : path}`, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(12000),
      });
      if (res.status === 404) continue;
      if (!res.ok) continue;
      const type = (res.headers.get("content-type") || "").toLowerCase();
      if (type.includes("audio/") || type.includes("octet-stream")) {
        return await res.arrayBuffer();
      }
      const data = (await res.json().catch(() => null)) as {
        audio_url?: unknown;
        wav?: unknown;
        audio?: unknown;
      } | null;
      if (!data) continue;
      const rel =
        (typeof data.audio_url === "string" && data.audio_url) ||
        (typeof data.wav === "string" && data.wav) ||
        (typeof data.audio === "string" && data.audio) ||
        "";
      if (!rel) continue;
      const url = /^https?:\/\//i.test(rel)
        ? rel
        : `${millUrl}${rel.startsWith("/") ? rel : `/${rel}`}`;
      const audioRes = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (!audioRes.ok) continue;
      return await audioRes.arrayBuffer();
    } catch {
      continue;
    }
  }
  return null;
}

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: {
          text?: unknown;
          voice?: unknown;
          being?: unknown;
          millUrl?: unknown;
          reference?: unknown;
        };
        try {
          payload = (await request.json()) as typeof payload;
        } catch {
          return Response.json({ error: "Bad request." }, { status: 400 });
        }

        const text = typeof payload.text === "string" ? payload.text.trim() : "";
        const being = typeof payload.being === "string" ? payload.being.trim() : "everett";
        const reference =
          typeof payload.reference === "string" ? payload.reference.trim() : "";
        const millUrl = normalizeMillUrl(
          typeof payload.millUrl === "string"
            ? payload.millUrl
            : "",
        );
        if (!text) return Response.json({ error: "Nothing to speak." }, { status: 400 });
        if (text.length > MAX_CHARS) {
          return Response.json(
            { error: `Keep it under ${MAX_CHARS} characters per take.` },
            { status: 400 },
          );
        }

        if (millUrl) {
          const mill = await millAudio(millUrl, text, being, reference);
          if (mill && mill.byteLength > 64) {
            return new Response(mill, {
              headers: {
                "Content-Type": "audio/wav",
                "Cache-Control": "no-store",
                "X-Mill": "christman",
              },
            });
          }
        }

        return Response.json(
          { error: "mill-missing", engine: "none" },
          { status: 503 },
        );
      },
    },
  },
});
