import type { Owner } from "@/lib/seat/cuebook.ts";
import { playCurrent, show, standby } from "@/lib/seat/live.ts";
import { stopSpeaking } from "@/lib/speak";
import { CAMERA } from "@/lib/studio/camera";
import { startRecording, stopRecording } from "@/lib/studio/record";
import { useStudio, type Shot } from "@/lib/studio-store";

/** Where the switcher sits when the camera bible has no cue for the beat. */
const SEAT_SHOT: Record<Owner, Shot> = { EVERETT: "lead", PATTY: "patty", BRANDON: "talent", BLACK: "black", TITLE: "cover" };

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
      // The cold open stays over black, as the script stages it. The switcher moves once the clock runs.
      if (show.phase === "rolling") {
        if (c.owner === "TITLE" && c.id !== "title") store.setShot("two", "scan"); // clear to standing
        else store.setShot(CAMERA.find((x) => x.beatId === c.id)?.shot ?? SEAT_SHOT[c.owner], "cut");
      }
      await playCurrent(alive);
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
