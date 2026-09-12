import { spawnSync } from "node:child_process";

let found: string | null = null;

/** $FFMPEG, then ffmpeg on PATH, then the static binary imageio-ffmpeg installs. Loud if none. */
export function ffmpegPath(): string {
  if (found) return found;
  const fromPython = spawnSync("python3", ["-c", "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"], {
    encoding: "utf8",
  });
  const candidates = [process.env.FFMPEG, "ffmpeg", fromPython.status === 0 ? fromPython.stdout.trim() : ""];
  for (const c of candidates) {
    if (c && spawnSync(c, ["-version"]).status === 0) return (found = c);
  }
  throw new Error("ffmpeg not found: install it or set FFMPEG=/path/to/ffmpeg");
}

/** Any audio file to mono float samples at `sampleRate`. */
export function decodePcm(file: string, sampleRate = 16000): Float32Array {
  const r = spawnSync(
    ffmpegPath(),
    ["-v", "error", "-i", file, "-f", "s16le", "-ac", "1", "-ar", String(sampleRate), "pipe:1"],
    { maxBuffer: 1 << 30 },
  );
  if (r.status !== 0) throw new Error(`ffmpeg could not decode ${file}: ${r.stderr?.toString()}`);
  const bytes = r.stdout.buffer.slice(r.stdout.byteOffset, r.stdout.byteOffset + r.stdout.length);
  const i16 = new Int16Array(bytes);
  const out = new Float32Array(i16.length);
  for (let i = 0; i < i16.length; i++) out[i] = i16[i] / 32768;
  return out;
}

/** 16-bit PCM WAV bytes. */
export function wavBytes(samples: Float32Array, sampleRate: number): Buffer {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32767), i * 2);
  }
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write("WAVE", 8);
  h.write("fmt ", 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(sampleRate, 24);
  h.writeUInt32LE(sampleRate * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}
