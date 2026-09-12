export type FacePoint = { cx: number; cy: number; rx: number; ry: number };
export type Rgb = { r: number; g: number; b: number };

export type FaceRig = {
  id: "lead" | "talent" | "patty";
  name: string;
  role: string;
  src: string;
  width: number;
  height: number;
  eyeY: number;
  mouth: FacePoint;
  leftEye: FacePoint;
  rightEye: FacePoint;
  skin: Rgb;
  lip: Rgb;
  lid: Rgb;
  teeth: Rgb;
  cavity: Rgb;
};

/** Christman — lead host. Bald. Maroon hat with emblem. Never redraw the hat. */
export const LEAD_RIG: FaceRig = {
  id: "lead",
  name: "Everett",
  role: "Host",
  // Measured on cohost.jpg (1500x1600) against a grid: the face sits left of centre and high.
  src: "/avatar/cohost.jpg",
  width: 1500,
  height: 1600,
  eyeY: 0.235,
  mouth: { cx: 0.38, cy: 0.37, rx: 0.045, ry: 0.02 },
  leftEye: { cx: 0.31, cy: 0.235, rx: 0.025, ry: 0.016 },
  rightEye: { cx: 0.43, cy: 0.235, rx: 0.025, ry: 0.016 },
  skin: { r: 168, g: 140, b: 122 },
  lip: { r: 92, g: 58, b: 52 },
  lid: { r: 70, g: 48, b: 42 },
  teeth: { r: 228, g: 216, b: 204 },
  cavity: { r: 18, g: 12, b: 16 },
};

/** Brandon — rendered co-host. Wardrobe, cues, and copy. Camera right. */
export const TALENT_RIG: FaceRig = {
  id: "talent",
  name: "Brandon",
  role: "Co-host",
  src: "/avatar/host.jpg",
  width: 1920,
  height: 1080,
  eyeY: 0.37,
  mouth: { cx: 0.5, cy: 0.445, rx: 0.034, ry: 0.022 },
  leftEye: { cx: 0.46, cy: 0.37, rx: 0.018, ry: 0.016 },
  rightEye: { cx: 0.54, cy: 0.37, rx: 0.018, ry: 0.016 },
  skin: { r: 210, g: 162, b: 132 },
  lip: { r: 132, g: 78, b: 68 },
  lid: { r: 148, g: 108, b: 88 },
  teeth: { r: 232, g: 220, b: 208 },
  cavity: { r: 28, g: 12, b: 10 },
};

/** Patty Mette — co-host, engineering. Camera center. */
export const PATTY_RIG: FaceRig = {
  id: "patty",
  name: "Patty",
  role: "Co-host",
  src: "/avatar/patty.jpg",
  width: 1920,
  height: 1080,
  eyeY: 0.36,
  mouth: { cx: 0.5, cy: 0.43, rx: 0.03, ry: 0.024 },
  leftEye: { cx: 0.46, cy: 0.36, rx: 0.018, ry: 0.016 },
  rightEye: { cx: 0.54, cy: 0.36, rx: 0.018, ry: 0.016 },
  skin: { r: 196, g: 148, b: 118 },
  lip: { r: 148, g: 82, b: 78 },
  lid: { r: 120, g: 88, b: 72 },
  teeth: { r: 236, g: 224, b: 214 },
  cavity: { r: 28, g: 14, b: 16 },
};

export const TALENT = [LEAD_RIG, PATTY_RIG, TALENT_RIG] as const;
