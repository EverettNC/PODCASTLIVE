import { stopSpeaking } from "@/lib/speak";
import { lineDurationMs } from "@/lib/avatar/mouth";
import { CAMERA } from "@/lib/studio/camera";
import { RUNDOWN, type Beat } from "@/lib/studio/show";
import { startRecording, stopRecording } from "@/lib/studio/record";
import { useStudio } from "@/lib/studio-store";

function sleep(ms: number, alive: () => boolean) {
  return new Promise<void>((resolve) => {
    const t0 = Date.now();
    const tick = () => {
      if (!alive() || Date.now() - t0 >= ms) {
        resolve();
        return;
      }
      window.setTimeout(tick, 40);
    };
    window.setTimeout(tick, Math.min(40, ms));
  });
}

function spoken(beat: Beat) {
  return (
    beat.speaker === "everett" ||
    beat.speaker === "patty" ||
    beat.speaker === "talent"
  );
}

export async function playEpisode() {
  const store = useStudio.getState();
  const gen = store.rollGen + 1;
  try {
    stopSpeaking();
  } catch {
    /* keep rolling */
  }
  store.rollEpisode(gen);
  const alive = () => {
    const s = useStudio.getState();
    return s.rolling && s.rollGen === gen;
  };

  void startRecording().catch(() => {});

  try {
    store.pushLog("system", "Rolling. Picture first. Every line.");
    store.takeIntro();
    await sleep(1100, alive);
    if (!alive()) return;
    store.takeShow();
    await sleep(500, alive);
    if (!alive()) return;

    for (const beat of RUNDOWN) {
      if (!alive()) return;
      if (!spoken(beat)) continue;
      const cue = CAMERA.find((c) => c.beatId === beat.id);
      store.setBeat(beat.id);

      const shot =
        cue?.shot ??
        (beat.speaker === "patty" ? "patty" : beat.speaker === "talent" ? "talent" : "lead");
      store.setShot(shot, "cut");

      const dur = lineDurationMs(beat.text);
      store.setLine(dur, beat.text);
      await sleep(dur, alive);
      store.clearLine();
      if (!alive()) return;
    }

    if (!alive()) return;
    store.setShot("two", "scan");
    await sleep(1200, alive);
    if (!alive()) return;
    store.takeIntro();
    store.setBeat("out");
    await sleep(2200, alive);
    if (!alive()) return;
    store.takeBlack();
  } catch (err) {
    const s = useStudio.getState();
    s.setError(err instanceof Error ? err.message : "Roll hit a wall. Floor is still up.");
  } finally {
    const url = await stopRecording().catch(() => null);
    const s = useStudio.getState();
    if (s.rollGen === gen) {
      s.finishRoll(url);
    }
  }
}

export function stopEpisode() {
  try {
    stopSpeaking();
  } catch {
    /* */
  }
  const s = useStudio.getState();
  s.clearLine();
  s.finishRoll(null);
}
