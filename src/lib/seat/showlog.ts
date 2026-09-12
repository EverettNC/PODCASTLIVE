import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import type { ShowEvent } from "./interlock.ts";

/** One JSON object per line, appended. Nothing in this module truncates or rewrites. */
export function openShowLog(path: string) {
  mkdirSync(dirname(path), { recursive: true });
  return (e: ShowEvent) => {
    appendFileSync(path, JSON.stringify(e) + "\n");
  };
}

export function readShowLog(path: string): ShowEvent[] {
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as ShowEvent);
}
