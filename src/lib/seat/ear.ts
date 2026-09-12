/**
 * Stage 2, ASR: THE FILAMENT's ear, local Vosk on door 4850 (EverettNC/THEFILAMENT).
 * $FILAMENT_EAR_URL overrides the door. Nothing leaves the machine. An empty ear
 * stays empty: no invented speech, and every failure names itself.
 */
export type Heard =
  | { ok: true; text: string; note?: string }
  | { ok: false; error: "unseated" | "offline" | "bad-tape" | "busy"; detail: string };

const earUrl = () => (process.env.FILAMENT_EAR_URL ?? "http://127.0.0.1:4850").replace(/\/$/, "");
const msg = (err: unknown) => (err instanceof Error ? err.message : String(err));

/** Is the ear up, and is Vosk seated with its model? Says exactly which is missing. */
export async function earStatus(fetchImpl = fetch): Promise<{ ready: boolean; detail: string }> {
  const url = earUrl();
  try {
    const res = await fetchImpl(`${url}/health`, { signal: AbortSignal.timeout(3000) });
    const body = (await res.json()) as { seated?: boolean; model?: string | null; error?: string | null };
    if (res.ok && body.seated) return { ready: true, detail: `Filament ear at ${url}, Vosk seated (${body.model})` };
    return { ready: false, detail: body.error ?? `Filament ear at ${url} answered HTTP ${res.status}` };
  } catch (err) {
    return { ready: false, detail: `Filament ear not reachable at ${url} (${msg(err)}). Run: python3 ear/vosk_ear.py in THEFILAMENT` };
  }
}

/** One tape in, its words out. Any container ffmpeg reads; the ear decodes it. */
export async function hear(tape: Blob, fetchImpl = fetch): Promise<Heard> {
  const url = earUrl();
  const form = new FormData();
  form.append("file", tape, "tape");
  let res: Response;
  try {
    res = await fetchImpl(`${url}/stt`, { method: "POST", body: form, signal: AbortSignal.timeout(30000) });
  } catch (err) {
    return { ok: false, error: "offline", detail: `Filament ear not reachable at ${url} (${msg(err)})` };
  }
  const body = (await res.json().catch(() => ({}))) as { ok?: boolean; seated?: boolean; text?: string; note?: string; error?: string | null };
  if (res.status === 503 || body.seated === false) return { ok: false, error: "unseated", detail: body.error ?? "Vosk is not seated" };
  if (res.status === 400) return { ok: false, error: "bad-tape", detail: body.error ?? "the ear could not read that tape" };
  if (!res.ok || !body.ok) return { ok: false, error: "busy", detail: body.error ?? `Filament ear HTTP ${res.status}` };
  return { ok: true, text: (body.text ?? "").trim(), note: body.note };
}
