import type { VisemeName } from "../seat/visemes.ts";

export type LipState = {
  open: number;
  viseme: VisemeName;
  blink: number;
  swayX: number;
  swayY: number;
  swayRot: number;
  breath: number;
};

/** Idle body motion at time t (seconds). Speaking damps the sway; a person settles when they talk. */
export function sway(t: number, speaking: boolean) {
  const idle = speaking ? 0.45 : 1;
  return {
    swayX: Math.sin(t * 0.72) * 4.2 * idle,
    swayY: Math.sin(t * 0.91 + 0.4) * 2.6 * idle,
    swayRot: Math.sin(t * 0.47) * 0.012 * idle,
    breath: Math.sin(t * 1.15) * 0.008,
  };
}

/** Blink and sway for one plate. The mouth is not decided here: it is measured from the audio (seat/envelope.ts) or stays at rest. */
export function createIdleMotion() {
  let blink = 0;
  let nextBlink = 2.4 + Math.random() * 3.2;
  let t = 0;
  let last = performance.now();
  return (speaking: boolean): Omit<LipState, "open" | "viseme"> => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    nextBlink -= dt;
    if (blink > 0) blink = Math.max(0, blink - dt * 7.5);
    else if (nextBlink <= 0) {
      blink = 1;
      nextBlink = 2.2 + Math.random() * 4.4;
    }
    return { blink, ...sway(t, speaking) };
  };
}
