export type VisemeName = "rest" | "PP" | "FF" | "TH" | "DD" | "SS" | "AA" | "EE" | "OH" | "OU";

/** Mouth geometry for one shape. `jaw` scales the opening the envelope drives. */
export type MouthShape = {
  jaw: number;
  width: number;
  round: number;
  teethTop: number;
  teethBottom: number;
  press: number;
  bite: number;
};

export const SHAPES: Record<VisemeName, MouthShape> = {
  rest: { jaw: 0.05, width: 1, round: 0, teethTop: 0, teethBottom: 0, press: 0.6, bite: 0 },
  PP: { jaw: 0, width: 0.95, round: 0.1, teethTop: 0, teethBottom: 0, press: 1, bite: 0 },
  FF: { jaw: 0.15, width: 1.05, round: 0, teethTop: 0.9, teethBottom: 0, press: 0.2, bite: 1 },
  TH: { jaw: 0.3, width: 1.05, round: 0, teethTop: 0.8, teethBottom: 0.6, press: 0, bite: 0 },
  DD: { jaw: 0.35, width: 1.1, round: 0, teethTop: 0.9, teethBottom: 0.3, press: 0, bite: 0 },
  SS: { jaw: 0.2, width: 1.2, round: 0, teethTop: 1, teethBottom: 0.9, press: 0, bite: 0 },
  AA: { jaw: 1, width: 1.05, round: 0.2, teethTop: 0.35, teethBottom: 0.15, press: 0, bite: 0 },
  EE: { jaw: 0.5, width: 1.3, round: 0, teethTop: 0.6, teethBottom: 0.25, press: 0, bite: 0 },
  OH: { jaw: 0.8, width: 0.8, round: 0.8, teethTop: 0.2, teethBottom: 0, press: 0, bite: 0 },
  OU: { jaw: 0.4, width: 0.6, round: 1, teethTop: 0, teethBottom: 0, press: 0.1, bite: 0 },
};

/** Accepts the Voice SDK phoneme_labeler labels and the app's older names. */
export function visemeFor(label: string): VisemeName {
  switch (label.toLowerCase()) {
    case "pp":
    case "closed":
      return "PP";
    case "ff":
      return "FF";
    case "th":
      return "TH";
    case "dd":
    case "nn":
    case "kk":
      return "DD";
    case "ss":
    case "ch":
      return "SS";
    case "aa":
      return "AA";
    case "eh":
    case "ih":
    case "ee":
      return "EE";
    case "oh":
      return "OH";
    case "er":
    case "rr":
    case "ou":
      return "OU";
    default:
      return "rest";
  }
}

export function mixShape(a: MouthShape, b: MouthShape, t: number): MouthShape {
  const k = Math.min(1, Math.max(0, t));
  const m = (x: number, y: number) => x + (y - x) * k;
  return {
    jaw: m(a.jaw, b.jaw),
    width: m(a.width, b.width),
    round: m(a.round, b.round),
    teethTop: m(a.teethTop, b.teethTop),
    teethBottom: m(a.teethBottom, b.teethBottom),
    press: m(a.press, b.press),
    bite: m(a.bite, b.bite),
  };
}
