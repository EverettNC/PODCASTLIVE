import { createServerFn } from "@tanstack/react-start";
import type { ChatTurn } from "./brain.ts";

/** The floor asks the server; the server asks the local Ollama. The browser never talks to a model. */
export const getAiStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { brainStatus } = await import("./brain.ts");
  return brainStatus();
});

export const askHost = createServerFn({ method: "POST" })
  .validator((input: { cue: string; history?: ChatTurn[] }) => input)
  .handler(async ({ data }) => {
    const { ask } = await import("./brain.ts");
    return ask(data.cue, data.history);
  });
