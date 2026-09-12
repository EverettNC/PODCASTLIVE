import type { VisemeName } from "../seat/visemes.ts";
import type { MouthPose } from "./mouth";

export type Viseme = "rest" | "closed" | "aa" | "oh" | "ee" | VisemeName;

export type LipState = {
  open: number;
  viseme: Viseme;
  blink: number;
  swayX: number;
  swayY: number;
  swayRot: number;
  breath: number;
  rms: number;
};

const ATTACK = 0.55;
const RELEASE = 0.28;
const GATE = 0.01;

export function createLipTracker() {
  let envelope = 0;
  let viseme: Viseme = "rest";
  let visemeHold = 0;
  let plosive = 0;
  let blink = 0;
  let nextBlink = 2.4 + Math.random() * 3.2;
  let t = 0;
  let last = performance.now();

  const freq = new Uint8Array(512);
  const time = new Uint8Array(1024);

  function step(
    analyser: AnalyserNode | null,
    speaking: boolean,
    playbackRms = 0,
    script: MouthPose | null = null,
  ): LipState {
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;

    let rms = playbackRms;
    let low = 0;
    let mid = 0;
    let high = 0;
    let flux = 0;

    if (analyser && speaking) {
      analyser.getByteFrequencyData(freq);
      analyser.getByteTimeDomainData(time);
      let sum = 0;
      const n = time.length;
      for (let i = 0; i < n; i++) {
        const v = (time[i] - 128) / 128;
        sum += v * v;
      }
      rms = Math.max(rms, Math.sqrt(sum / n));

      const take = Math.min(freq.length, analyser.frequencyBinCount);
      let l = 0,
        m = 0,
        h = 0,
        lc = 0,
        mc = 0,
        hc = 0,
        all = 0,
        ac = 0;
      for (let i = 1; i < take; i++) {
        const v = freq[i] / 255;
        all += v;
        ac++;
        if (i < 6) {
          l += v;
          lc++;
        } else if (i < 18) {
          m += v;
          mc++;
        } else if (i < 48) {
          h += v;
          hc++;
        }
      }
      low = lc ? l / lc : 0;
      mid = mc ? m / mc : 0;
      high = hc ? h / hc : 0;
      flux = ac ? all / ac : 0;
    }

    const voiced = Math.max(
      rms * 1.85,
      flux,
      script && speaking ? script.open : 0,
    );
    const target =
      voiced > GATE
        ? Math.min(1, Math.max(voiced, script && speaking ? script.open : 0))
        : script && speaking
          ? script.open
          : 0;
    if (target > envelope) envelope += (target - envelope) * Math.min(1, ATTACK + dt * 10);
    else envelope += (target - envelope) * Math.min(1, RELEASE + dt * 3.4);

    if (target > envelope + 0.18 && envelope < 0.5) {
      plosive = 0.05;
    }
    if (plosive > 0) {
      plosive -= dt;
      viseme = "closed";
      visemeHold = 0.035;
    } else if (script && speaking && script.open > 0.05) {
      viseme = script.viseme;
      visemeHold = 0.03;
    } else if (envelope < 0.05) {
      viseme = "rest";
    } else if (visemeHold <= 0) {
      const energy = low + mid + high + 0.0001;
      const round = low / energy;
      const bright = high / energy;
      if (envelope > 0.5 && round > 0.4) viseme = "aa";
      else if (round > 0.36 && bright < 0.3) viseme = "oh";
      else if (bright > 0.32) viseme = "ee";
      else viseme = envelope > 0.38 ? "aa" : "ee";
      visemeHold = 0.04 + Math.random() * 0.03;
    } else {
      visemeHold -= dt;
    }

    nextBlink -= dt;
    if (blink > 0) {
      blink -= dt * 7.5;
      if (blink < 0) blink = 0;
    } else if (nextBlink <= 0) {
      blink = 1;
      nextBlink = 2.2 + Math.random() * 4.4;
    }

    const idle = speaking ? 0.45 : 1;
    return {
      open: envelope,
      viseme,
      blink: Math.min(1, blink),
      swayX: Math.sin(t * 0.72) * 4.2 * idle,
      swayY: Math.sin(t * 0.91 + 0.4) * 2.6 * idle,
      swayRot: Math.sin(t * 0.47) * 0.012 * idle,
      breath: Math.sin(t * 1.15) * 0.008,
      rms: voiced,
    };
  }

  return { step };
}

export { mouthAt as visemeAt } from "./mouth";
