import { createServerFn } from "@tanstack/react-start";
import type { ShowEvent } from "./interlock.ts";

export const SHOW_LOG_PATH = "show/ep01.showlog.jsonl";

/** Append one show event to the on-disk log. The handler runs on the server; a failed disk write throws to the caller. */
export const appendShowEvent = createServerFn({ method: "POST" })
  .validator((e: ShowEvent) => e)
  .handler(async ({ data }) => {
    const { openShowLog } = await import("./showlog.ts");
    openShowLog(SHOW_LOG_PATH)(data);
    return { ok: true as const };
  });
