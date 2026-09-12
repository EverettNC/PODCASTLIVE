export class AudioEngine {
  ctx: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  master: GainNode | null = null;
  source: AudioBufferSourceNode | null = null;
  buffer: AudioBuffer | null = null;
  startedAt = 0;
  micSource: MediaStreamAudioSourceNode | null = null;
  micStream: MediaStream | null = null;
  playing = false;
  dest: MediaStreamAudioDestinationNode | null = null;

  async ensure() {
    try {
      if (this.ctx) {
        if (this.ctx.state === "suspended") await this.ctx.resume();
        return;
      }
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.48;
      const master = ctx.createGain();
      master.gain.value = 1;
      analyser.connect(master);
      master.connect(ctx.destination);
      const dest = ctx.createMediaStreamDestination();
      master.connect(dest);
      this.ctx = ctx;
      this.analyser = analyser;
      this.master = master;
      this.dest = dest;
      if (ctx.state === "suspended") await ctx.resume();
    } catch {
      /* autoplay / restricted context — lips still move via script RMS */
    }
  }

  tap(): MediaStream | null {
    return this.dest?.stream ?? null;
  }

  setVolume(v: number) {
    if (this.master) this.master.gain.value = v;
  }

  playbackTime(): number {
    if (!this.playing || !this.ctx) return 0;
    return Math.max(0, this.ctx.currentTime - this.startedAt);
  }

  async playBuffer(audio: AudioBuffer): Promise<void> {
    await this.ensure();
    if (!this.ctx || !this.analyser) return;
    this.stopPlayback();
    const src = this.ctx.createBufferSource();
    src.buffer = audio;
    src.connect(this.analyser);
    this.source = src;
    this.buffer = audio;
    this.playing = true;
    this.startedAt = this.ctx.currentTime;
    const cap = audio.duration * 1000 + 800;
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        if (this.source === src) {
          this.playing = false;
          this.source = null;
          this.buffer = null;
        }
        resolve();
      };
      src.onended = finish;
      try {
        src.start();
      } catch {
        finish();
        return;
      }
      window.setTimeout(finish, cap);
    });
  }

  stopPlayback() {
    if (this.source) {
      try {
        this.source.stop();
      } catch {
        /* already stopped */
      }
      this.source.disconnect();
      this.source = null;
    }
    this.buffer = null;
    this.playing = false;
  }

  async startMic(): Promise<MediaStream> {
    await this.ensure();
    if (!this.ctx || !this.analyser) throw new Error("Mic could not start");
    this.stopMic();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
    });
    const src = this.ctx.createMediaStreamSource(stream);
    src.connect(this.analyser);
    this.micSource = src;
    this.micStream = stream;
    return stream;
  }

  stopMic() {
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
    if (this.micStream) {
      for (const track of this.micStream.getTracks()) track.stop();
      this.micStream = null;
    }
  }

  dispose() {
    this.stopPlayback();
    this.stopMic();
    void this.ctx?.close();
    this.ctx = null;
    this.analyser = null;
    this.master = null;
  }
}

export const audioEngine = new AudioEngine();
