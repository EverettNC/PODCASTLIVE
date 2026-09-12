/**
 * Stage 3, RESPONSE: Brandon's reply to a live address, from a local Ollama
 * model. $OLLAMA_URL (default http://127.0.0.1:11434) and $OLLAMA_MODEL
 * (default llama3.1). Nothing leaves the machine. Every failure names itself.
 */
export type ChatTurn = { role: "user" | "assistant"; content: string };
export type Reply =
  | { ok: true; text: string }
  | { ok: false; error: "offline" | "no-model" | "busy" | "empty"; detail: string };

const MAX_REPLY_TOKENS = 220;
const MAX_CUE = 1200;
const MAX_HISTORY = 8;

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

const ollama = () => ({
  url: (process.env.OLLAMA_URL ?? "http://127.0.0.1:11434").replace(/\/$/, ""),
  model: process.env.OLLAMA_MODEL ?? "llama3.1",
});
const msg = (err: unknown) => (err instanceof Error ? err.message : String(err));

/** Is Ollama up, and is the model pulled? Says exactly which is missing. */
export async function brainStatus(fetchImpl = fetch): Promise<{ ready: boolean; model: string; detail: string }> {
  const { url, model } = ollama();
  try {
    const res = await fetchImpl(`${url}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { ready: false, model, detail: `Ollama at ${url} answered HTTP ${res.status}` };
    const { models = [] } = (await res.json()) as { models?: { name: string }[] };
    if (models.some((m) => m.name === model || m.name.split(":")[0] === model)) {
      return { ready: true, model, detail: `Ollama at ${url}, model ${model}` };
    }
    return { ready: false, model, detail: `Ollama at ${url} has no model ${model}. Run: ollama pull ${model}` };
  } catch (err) {
    return { ready: false, model, detail: `Ollama not reachable at ${url} (${msg(err)}). Run: ollama serve` };
  }
}

export async function ask(cue: string, history: ChatTurn[] = [], fetchImpl = fetch): Promise<Reply> {
  const { url, model } = ollama();
  const line = cue.trim().slice(0, MAX_CUE);
  if (!line) return { ok: false, error: "empty", detail: "empty cue" };
  const messages = [
    { role: "system", content: HOST_SYSTEM },
    ...history.slice(-MAX_HISTORY).map((t) => ({ role: t.role, content: t.content.slice(0, MAX_CUE) })),
    { role: "user", content: line },
  ];
  let res: Response;
  try {
    res = await fetchImpl(`${url}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, stream: false, messages, options: { num_predict: MAX_REPLY_TOKENS, temperature: 0.8 } }),
      signal: AbortSignal.timeout(30000),
    });
  } catch (err) {
    return { ok: false, error: "offline", detail: `Ollama not reachable at ${url} (${msg(err)}). Run: ollama serve` };
  }
  if (res.status === 404) return { ok: false, error: "no-model", detail: `model ${model} is not pulled. Run: ollama pull ${model}` };
  if (!res.ok) return { ok: false, error: "busy", detail: `Ollama HTTP ${res.status}: ${(await res.text()).slice(0, 200)}` };
  const body = (await res.json()) as { message?: { content?: string } };
  const text = (body.message?.content ?? "").trim();
  return text ? { ok: true, text } : { ok: false, error: "empty", detail: `${model} returned no text` };
}
