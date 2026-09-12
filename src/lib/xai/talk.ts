import { createServerFn } from "@tanstack/react-start";
import { HOST_SYSTEM } from "./voices";

const MAX_REPLY_TOKENS = 220;
const MAX_CUE = 1200;
const MAX_HISTORY = 8;

export type ChatTurn = { role: "user" | "assistant"; content: string };

export const getAiStatus = createServerFn({ method: "GET" }).handler(async () => {
  return { ready: Boolean(process.env.XAI_API_KEY) };
});

export const askHost = createServerFn({ method: "POST" })
  .validator((input: { cue: string; history?: ChatTurn[] }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "offline" };

    const cue = data.cue.trim().slice(0, MAX_CUE);
    if (!cue) return { ok: false as const, error: "empty" };

    const history = (data.history ?? []).slice(-MAX_HISTORY).map((t) => ({
      role: t.role,
      content: t.content.slice(0, MAX_CUE),
    }));

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: MAX_REPLY_TOKENS,
        temperature: 0.8,
        messages: [
          { role: "system", content: HOST_SYSTEM },
          ...history,
          { role: "user", content: cue },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: "busy" };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = (body.choices?.[0]?.message?.content ?? "").trim();
    if (!text) return { ok: false as const, error: "empty" };
    return { ok: true as const, text };
  });
