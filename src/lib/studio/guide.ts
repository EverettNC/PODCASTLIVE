export const FOUR_PIECES = [
  {
    id: "runtime",
    num: "01",
    title: "Avatar runtime",
    body: "A still image. Audio moves the mouth. That is the core. No mocap suit, no camera on a face — the picture talks because the voice is loud.",
  },
  {
    id: "voice",
    num: "02",
    title: "Voice",
    body: "Christman-Sound. Voice Creation Center. Express wav first, then the mill on your box. No paid key in this app. Build has the drop. Seat the mill at http://127.0.0.1:1930 or drop a take on the line.",
  },
  {
    id: "route",
    num: "03",
    title: "Audio route",
    body: "That speech feeds the runtime. Three drives on the floor: cue the co-host, read copy, or put Christman’s mic on his still. Pick one. Watch program.",
  },
  {
    id: "program",
    num: "04",
    title: "Program out",
    body: "A clean camera view. Share it, or drop it in as a browser source. Intro plate first, then the show set. Christman lead left, co-host right.",
  },
] as const;

export const DRIVES = [
  {
    id: "book",
    title: "Rundown",
    body: "Episode one, in order. Cold open over black. Title card. Standing set. Tap a co-host line to put it on his mouth.",
  },
  {
    id: "talent",
    title: "Cue Brandon",
    body: "Type a question or a toss. He answers in a short take, speaks it, lips move. That’s the live path: text, then voice, then the mouth.",
  },
  {
    id: "copy",
    title: "Read copy",
    body: "Paste a bumper or a script. Generate the audio, run it through the still. No thinking. He just reads.",
  },
  {
    id: "mic",
    title: "Mic · host",
    body: "Arm the mic. Christman’s still tracks that audio. You’re the lead. The co-host stays idle.",
  },
] as const;

export const SAMPLE_CUE = "In one sentence, welcome listeners back to the show.";
