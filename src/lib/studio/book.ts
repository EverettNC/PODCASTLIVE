import { RUNDOWN, type BeatSpeaker } from "@/lib/studio/show";

export const SEAT_VOICE: Record<"everett" | "patty" | "talent", string> = {
  everett: "helix",
  patty: "ursa",
  talent: "orion",
};

export const BOOK_TAPE = "/audio/ep01.mp3";

export function spokenBeats() {
  return RUNDOWN.filter(
    (b) => b.speaker === "everett" || b.speaker === "patty" || b.speaker === "talent",
  );
}

export function expressUrl(beatId: string) {
  return `/audio/book/${beatId}.mp3`;
}

export function voiceFor(speaker: BeatSpeaker) {
  if (speaker === "everett") return SEAT_VOICE.everett;
  if (speaker === "patty") return SEAT_VOICE.patty;
  if (speaker === "talent") return SEAT_VOICE.talent;
  return SEAT_VOICE.talent;
}
