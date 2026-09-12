export const programBus = {
  canvas: null as HTMLCanvasElement | null,
  recorder: null as MediaRecorder | null,
  chunks: [] as BlobPart[],
  attach(canvas: HTMLCanvasElement | null) {
    this.canvas = canvas;
  },
};
