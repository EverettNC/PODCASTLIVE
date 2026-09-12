import type { BeatSpeaker } from "@/lib/studio/show";

export type MillSeat = "everett" | "patty" | "talent";

export const DEFAULT_MILL = "http://127.0.0.1:5000";

export const MILL_BEING: Record<MillSeat, string> = {
  everett: "everett",
  patty: "patty",
  talent: "brandon",
};

export function beingFor(speaker: BeatSpeaker | MillSeat | string) {
  if (speaker === "patty") return MILL_BEING.patty;
  if (speaker === "talent" || speaker === "brandon") return MILL_BEING.talent;
  return MILL_BEING.everett;
}

export function seatForBeing(being: string): MillSeat {
  const b = being.trim().toLowerCase();
  if (b === "patty") return "patty";
  if (b === "brandon" || b === "talent" || b === "cletus") return "talent";
  return "everett";
}

export function normalizeMillUrl(raw: string) {
  const t = raw.trim().replace(/\/+$/, "");
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return `http://${t}`;
}

export function phraseKey(text: string) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

export type MillSpeakBody = {
  text: string;
  being: string;
  millUrl?: string;
  reference?: string;
  voice?: string;
};

export async function probeMill(millUrl: string) {
  const res = await fetch("/api/mill", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ millUrl }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    engine?: string;
    error?: string;
  };
  return {
    ok: Boolean(data.ok),
    engine: typeof data.engine === "string" ? data.engine : null,
  };
}
