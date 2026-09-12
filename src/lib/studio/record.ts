import { audioEngine } from "@/lib/avatar/audio-engine";
import { programBus } from "@/lib/studio/program-bus";

function pickMime() {
  const types = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  for (const t of types) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) {
      return t;
    }
  }
  return "";
}

export async function startRecording() {
  try {
    stopRecordingQuiet();
    const canvas = programBus.canvas;
    if (!canvas || typeof MediaRecorder === "undefined") return;
    await audioEngine.ensure();
    const tap = audioEngine.tap();
    const v = canvas.captureStream(30);
    const mixed = new MediaStream([
      ...v.getVideoTracks(),
      ...(tap ? tap.getAudioTracks() : []),
    ]);
    const mime = pickMime();
    const rec = mime
      ? new MediaRecorder(mixed, { mimeType: mime, videoBitsPerSecond: 2_500_000 })
      : new MediaRecorder(mixed);
    programBus.chunks = [];
    rec.ondataavailable = (ev) => {
      if (ev.data && ev.data.size) programBus.chunks.push(ev.data);
    };
    programBus.recorder = rec;
    rec.start(1000);
  } catch {
    programBus.recorder = null;
  }
}

function stopRecordingQuiet() {
  const rec = programBus.recorder;
  programBus.recorder = null;
  if (rec && rec.state !== "inactive") {
    try {
      rec.stop();
    } catch {
      /* already stopped */
    }
  }
}

export function stopRecording(): Promise<string | null> {
  const rec = programBus.recorder;
  if (!rec || rec.state === "inactive") {
    programBus.recorder = null;
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    let settled = false;
    const done = (url: string | null) => {
      if (settled) return;
      settled = true;
      resolve(url);
    };
    rec.onstop = () => {
      programBus.recorder = null;
      try {
        const blob = new Blob(programBus.chunks, { type: rec.mimeType || "video/webm" });
        programBus.chunks = [];
        if (blob.size < 64) {
          done(null);
          return;
        }
        done(URL.createObjectURL(blob));
      } catch {
        done(null);
      }
    };
    try {
      rec.stop();
    } catch {
      done(null);
    }
    window.setTimeout(() => done(null), 4000);
  });
}
