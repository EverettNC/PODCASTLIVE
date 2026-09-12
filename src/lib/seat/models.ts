import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { ffmpegPath } from "./audio-node.ts";

export type ModelStatus = { name: string; role: string; present: boolean; where: string };
export type ModelReport = { token: boolean; models: ModelStatus[] };

/** What the seat can open right now, from disk only. Reports; never downloads. */
export function modelReport(
  root = process.cwd(),
  soundRoot = process.env.CHRISTMAN_SOUND_ROOT ?? join(root, "..", "Christman-Sound"),
): ModelReport {
  const home = homedir();
  const ttsHome = process.env.TTS_HOME ?? join(home, ".local", "share", "tts"); // Coqui's default cache
  const xtts = join(ttsHome, "tts_models--multilingual--multi-dataset--xtts_v2");
  const brandon = [
    join(root, "data", "voice_samples", "brandon"),
    join(root, "data", "voicepacks", "brandon.voicepack"),
    join(soundRoot, "models", "voices", "brandon.wav"),
    join(home, ".christman_ai", "voice_profiles", "brandon", "reference.wav"),
    join(home, ".christman_ai", "voice_profiles", "brandon.wav"),
  ];
  const hasWavs = (dir: string) => existsSync(dir) && readdirSync(dir).some((f) => f.endsWith(".wav"));
  const brandonHit = brandon.find((p) => (p.endsWith("brandon") ? hasWavs(p) : existsSync(p)));
  const runs = (cmd: string, args: string[]) => {
    try {
      return spawnSync(cmd, args).status === 0;
    } catch {
      return false;
    }
  };
  let ffmpeg = "";
  try {
    ffmpeg = ffmpegPath();
  } catch {
    ffmpeg = "";
  }
  const models: ModelStatus[] = [
    { name: "XTTS v2 weights", role: "voice: Christman Voice SDK engine", present: existsSync(join(xtts, "model.pth")), where: xtts },
    { name: "Brandon reference voice", role: "voice identity for the third seat", present: Boolean(brandonHit), where: brandonHit ?? brandon.join(" | ") },
    { name: "Shorty emotion PCA", role: "emotion shaping, optional", present: existsSync(join(soundRoot, "models", "shorty_emotion_pca.pt")), where: join(soundRoot, "models", "shorty_emotion_pca.pt") },
    { name: "Montreal Forced Aligner", role: "phoneme timing, optional; energy fallback otherwise", present: runs("mfa", ["version"]), where: "mfa on PATH" },
    { name: "ffmpeg", role: "pre-render encode and audio decode", present: Boolean(ffmpeg), where: ffmpeg || "$FFMPEG, PATH, or imageio-ffmpeg" },
  ];
  return { token: Boolean(process.env.HF_TOKEN || process.env.HUGGING_FACE_HUB_TOKEN), models };
}

/** Plain text. Reads aloud without symbols. */
export function renderModelReport(r: ModelReport): string {
  const missing = r.models.filter((m) => !m.present);
  const lines = [
    `Hugging Face token: ${r.token ? "present, downloads allowed" : "absent, downloads off; running with what is cached"}`,
    ...r.models.map((m) => `${m.present ? "ready" : "missing"}: ${m.name}. ${m.role}. ${m.where}`),
    missing.length
      ? `${missing.length} of ${r.models.length} unavailable: ${missing.map((m) => m.name).join(", ")}. Continuing with what is present.`
      : "All models present.",
  ];
  return lines.join("\n");
}
