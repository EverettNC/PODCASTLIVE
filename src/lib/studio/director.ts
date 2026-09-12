import { InterlockError } from "@/lib/seat/interlock.ts";
import { playCurrent, show, standby } from "@/lib/seat/live.ts";
import { stopSpeaking } from "@/lib/speak";
import { CAMERA } from "@/lib/studio/camera";
import { startRecording, stopRecording } from "@/lib/studio/record";
import { useStudio } from "@/lib/studio-store";

/** ROLL: standby, then the cold open plays to completion before the clock starts, then every cue with its real audio. */
export async function playEpisode() {
  const store = useStudio.getState();
  const gen = store.rollGen + 1;
  stopSpeaking();
  store.pushLog("system", "Standby. Loading every take.");
  await standby();
  show.roll();
  store.rollEpisode(gen);
  const alive = () => {
    const s = useStudio.getState();
    return s.rolling && s.rollGen === gen;
  };

  void startRecording().catch(() => {});

  try {
    store.pushLog("system", "Rolling. Disclaimer first. The clock starts when it has played.");
    while (alive() && show.phase !== "done") {
      const c = show.current()!;
      if (c.owner === "EVERETT" || c.owner === "PATTY" || c.owner === "BRANDON") {
        const cue = CAMERA.find((x) => x.beatId === c.id);
        store.setShot(cue?.shot ?? (c.owner === "PATTY" ? "patty" : c.owner === "BRANDON" ? "talent" : "lead"), "cut");
      } else if (c.owner === "TITLE") {
        store.setShot(c.id === "title" ? "cover" : "two", c.id === "title" ? "cut" : "scan");
      } else {
        store.setShot("black", "cut");
      }
      try {
        await playCurrent(alive);
      } catch (err) {
        if (err instanceof InterlockError && show.killed && c.owner === "BRANDON") {
          show.advance(); // his line is dropped, logged, and the show moves on
          continue;
        }
        throw err;
      }
    }
    if (alive()) store.takeBlack();
  } catch (err) {
    useStudio.getState().setError(err instanceof Error ? err.message : "Roll hit a wall. Floor is still up.");
  } finally {
    const url = await stopRecording().catch(() => null);
    const s = useStudio.getState();
    if (s.rollGen === gen) {
      s.finishRoll(url);
      if (show.phase !== "standby") show.standby();
    }
  }
}

export function stopEpisode() {
  stopSpeaking();
  const s = useStudio.getState();
  s.clearLine();
  s.finishRoll(null);
  show.standby();
}
