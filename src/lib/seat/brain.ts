import { readKeys } from "./keys.ts";

/**
 * Stage 3, RESPONSE, when no live seat answers. Two brains, picked by the
 * key drop: NVIDIA's catalog when NVIDIA_API_KEY is dropped in (metered,
 * Everett's call), else a local Ollama ($OLLAMA_URL, default
 * http://127.0.0.1:11434; $OLLAMA_MODEL, default llama3.1). Every failure
 * names itself.
 */
export type ChatTurn = { role: "user" | "assistant"; content: string };
export type Reply =
  | { ok: true; text: string; via: string }
  | { ok: false; error: "offline" | "no-model" | "busy" | "empty"; detail: string };
export type Brain = { kind: "nvidia"; key: string; model: string } | { kind: "ollama"; url: string; model: string };

const MAX_REPLY_TOKENS = 220;
const MAX_CUE = 1200;
const MAX_HISTORY = 8;
const NVIDIA = "https://integrate.api.nvidia.com/v1";

export const HOST_SYSTEM = `You are Brandon, the rendered co-host of From Now Till Always. Three regulars sit the desk. Everett Christman is the lead host, camera left. Patty Mette is co-host, camera center — she is a person, software engineer on the core team. You are not a person. You are a rendering in the seat camera right. Everything you say is generated. When Everett disagrees with you, he will say so on air.

Rules:
- Speak as Brandon, co-host of this show, not as an assistant, and not as Everett or Patty.
- 1 to 4 spoken sentences. Short takes. Precise. No filler.
- No markdown, no lists, no bullets, no stage directions, no wrapping quotes.
- No emoji.
- Do not name any AI provider, model, or company.
- Do not claim you checked something unless the cue says you did.
- If the producer sends a scripted line, deliver that line. Do not rewrite an apology or a verbatim passage.
- Toss to Everett or Patty by name. Do not speak as them.`;

export function pickBrain(keys = readKeys()): Brain {
  if (keys.NVIDIA_API_KEY) return { kind: "nvidia", key: keys.NVIDIA_API_KEY, model: keys.NVIDIA_MODEL || "meta/llama-3.1-8b-instruct" };
  return {
    kind: "ollama",
    url: (process.env.OLLAMA_URL ?? "http://127.0.0.1:11434").replace(/\/$/, ""),
    model: process.env.OLLAMA_MODEL ?? "llama3.1",
  };
}

const msg = (err: unknown) => (err instanceof Error ? err.message : String(err));
const label = (b: Brain) => (b.kind === "nvidia" ? `NVIDIA ${b.model}` : `Ollama ${b.model} at ${b.url}`);

/** Is the brain reachable, and is the model there? Says exactly which is missing. */
export async function brainStatus(fetchImpl = fetch, brain = pickBrain()): Promise<{ ready: boolean; model: string; detail: string }> {
  const { model } = brain;
  try {
    if (brain.kind === "nvidia") {
      const res = await fetchImpl(`${NVIDIA}/models`, { headers: { Authorization: `Bearer ${brain.key}` }, signal: AbortSignal.timeout(8000) });
      if (res.status === 401) return { ready: false, model, detail: "NVIDIA rejected the key in the drop" };
      if (!res.ok) return { ready: false, model, detail: `NVIDIA answered HTTP ${res.status}` };
      const { data = [] } = (await res.json()) as { data?: { id: string }[] };
      if (data.some((m) => m.id === model)) return { ready: true, model, detail: `${label(brain)} (key ••••${brain.key.slice(-4)})` };
      return { ready: false, model, detail: `NVIDIA's catalog has no model ${model}; set NVIDIA_MODEL in the key drop` };
    }
    const res = await fetchImpl(`${brain.url}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { ready: false, model, detail: `Ollama at ${brain.url} answered HTTP ${res.status}` };
    const { models = [] } = (await res.json()) as { models?: { name: string }[] };
    if (models.some((m) => m.name === model || m.name.split(":")[0] === model)) return { ready: true, model, detail: label(brain) };
    return { ready: false, model, detail: `Ollama at ${brain.url} has no model ${model}. Run: ollama pull ${model}` };
  } catch (err) {
    return {
      ready: false,
      model,
      detail: brain.kind === "nvidia" ? `NVIDIA not reachable (${msg(err)})` : `Ollama not reachable at ${brain.url} (${msg(err)}). Run: ollama serve`,
    };
  }
}

export async function ask(cue: string, history: ChatTurn[] = [], fetchImpl = fetch, brain = pickBrain()): Promise<Reply> {
  const line = cue.trim().slice(0, MAX_CUE);
  if (!line) return { ok: false, error: "empty", detail: "empty cue" };
  const messages = [
    { role: "system", content: HOST_SYSTEM },
    ...history.slice(-MAX_HISTORY).map((t) => ({ role: t.role, content: t.content.slice(0, MAX_CUE) })),
    { role: "user", content: line },
  ];
  const req: { url: string; headers: Record<string, string>; body: unknown } =
    brain.kind === "nvidia"
      ? {
          url: `${NVIDIA}/chat/completions`,
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${brain.key}` },
          body: { model: brain.model, messages, max_tokens: MAX_REPLY_TOKENS, temperature: 0.8 },
        }
      : {
          url: `${brain.url}/api/chat`,
          headers: { "Content-Type": "application/json" },
          body: { model: brain.model, stream: false, messages, options: { num_predict: MAX_REPLY_TOKENS, temperature: 0.8 } },
        };
  let res: Response;
  try {
    res = await fetchImpl(req.url, { method: "POST", headers: req.headers, body: JSON.stringify(req.body), signal: AbortSignal.timeout(30000) });
  } catch (err) {
    return { ok: false, error: "offline", detail: `${label(brain)} not reachable (${msg(err)})` };
  }
  if (res.status === 401) return { ok: false, error: "busy", detail: "NVIDIA rejected the key in the drop" };
  if (res.status === 404) return { ok: false, error: "no-model", detail: `${label(brain)}: model not found` };
  if (!res.ok) return { ok: false, error: "busy", detail: `${label(brain)} HTTP ${res.status}: ${(await res.text()).slice(0, 200)}` };
  const body = (await res.json()) as { message?: { content?: string }; choices?: { message?: { content?: string } }[] };
  const text = (brain.kind === "nvidia" ? body.choices?.[0]?.message?.content : body.message?.content)?.trim() ?? "";
  return text ? { ok: true, text, via: label(brain) } : { ok: false, error: "empty", detail: `${label(brain)} returned no text` };
}
