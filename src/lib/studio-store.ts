import { create } from "zustand";
import { DEFAULT_LOOK, lookById } from "@/lib/studio/looks";
import { DEFAULT_MILL } from "@/lib/studio/mill";
import { DEFAULT_INTRO, DEFAULT_SHOW } from "@/lib/studio/sets";
import { APOLOGY_COPY, RUNDOWN, SHOW } from "@/lib/studio/show";
import { DEFAULT_VOICE } from "@/lib/studio/voices";
import type { ChatTurn } from "@/lib/seat/brain.ts";
import type { Phase } from "@/lib/seat/interlock.ts";

export type RuntimeStatus = "idle" | "listening" | "thinking" | "speaking";
export type DriveMode = "book" | "talent" | "copy" | "mic";
export type Bay = "floor" | "build";
export type Shot = "black" | "two" | "lead" | "talent" | "patty" | "cover";
export type CamMove = "cut" | "scan" | "dump";
export type Caption = { id: number; text: string };
export type LogRole = "producer" | "talent" | "system";

const LS_KEY = "fnta-ep01";
const DEFAULT_EPISODE = `${SHOW.episodeNum} — ${SHOW.episodeName}`;

let hydrated = false;

function migrateShot(raw?: string): Shot {
  if (raw === "host") return "talent";
  if (raw === "cohost") return "lead";
  if (
    raw === "lead" ||
    raw === "talent" ||
    raw === "cover" ||
    raw === "two" ||
    raw === "black" ||
    raw === "patty"
  ) {
    return raw;
  }
  return "two";
}

type Persist = {
  lookId: string;
  shot: Shot;
  episode: string;
  millUrl: string;
};

function readPersist(): Persist {
  const fallback: Persist = {
    lookId: DEFAULT_LOOK,
    shot: "cover",
    episode: DEFAULT_EPISODE,
    millUrl: DEFAULT_MILL,
  };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return fallback;
    const p = JSON.parse(raw) as Partial<Persist> & { shot?: string };
    return {
      lookId: p.lookId || DEFAULT_LOOK,
      shot: migrateShot(p.shot),
      episode: typeof p.episode === "string" ? p.episode : DEFAULT_EPISODE,
      millUrl: typeof p.millUrl === "string" && p.millUrl.trim() ? p.millUrl : DEFAULT_MILL,
    };
  } catch {
    return fallback;
  }
}

function writePersist(s: Persist) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    /* quota / private mode */
  }
}

type StudioState = {
  onAir: boolean;
  status: RuntimeStatus;
  drive: DriveMode;
  bay: Bay;
  shot: Shot;
  camMove: CamMove;
  lookId: string;
  talentUrl: string | null;
  leadUrl: string | null;
  pattyUrl: string | null;
  introUrl: string | null;
  showUrl: string | null;
  episode: string;
  voice: string;
  volume: number;
  lipGain: number;
  captions: boolean;
  caption: Caption | null;
  lineStarted: number;
  lineDur: number;
  cue: string;
  copy: string;
  beatId: string;
  history: ChatTurn[];
  log: { id: number; role: LogRole; text: string }[];
  aiReady: boolean | null;
  error: string | null;
  rolledAt: number | null;
  rollGen: number;
  rolling: boolean;
  replayUrl: string | null;
  millUrl: string;
  millOk: boolean | null;
  millEngine: string | null;
  expressBeat: Record<string, string>;
  phase: Phase;
  killed: boolean;
  programBeat: (id: string) => void;
  setMillUrl: (v: string) => void;
  setMillStatus: (ok: boolean | null, engine: string | null) => void;
  plugExpress: (beatId: string, url: string | null) => void;
  setOnAir: (v: boolean) => void;
  setStatus: (s: RuntimeStatus) => void;
  setDrive: (d: DriveMode) => void;
  setBay: (b: Bay) => void;
  setShot: (s: Shot, move?: CamMove) => void;
  setLookId: (id: string) => void;
  plugTalent: (url: string | null) => void;
  plugLead: (url: string | null) => void;
  plugPatty: (url: string | null) => void;
  plugIntro: (url: string | null) => void;
  plugShow: (url: string | null) => void;
  takeIntro: () => void;
  takeShow: () => void;
  takeBlack: () => void;
  rollEpisode: (gen?: number) => void;
  finishRoll: (url: string | null) => void;
  setEpisode: (v: string) => void;
  setVoice: (v: string) => void;
  setVolume: (v: number) => void;
  setLipGain: (v: number) => void;
  setCaptions: (v: boolean) => void;
  setCaption: (text: string | null) => void;
  setLine: (durMs: number, text: string) => void;
  clearLine: () => void;
  setCue: (v: string) => void;
  setCopy: (v: string) => void;
  setBeat: (id: string) => void;
  pushLog: (role: LogRole, text: string) => void;
  pushHistory: (turn: ChatTurn) => void;
  setAiReady: (v: boolean) => void;
  setError: (v: string | null) => void;
  clearError: () => void;
};

const DEFAULT_COPY = APOLOGY_COPY;
let nextId = 1;

/** During the disclaimer nothing cuts away from it. */
const CUT_REFUSED = "Refused: the disclaimer plays to completion before any cut.";

function persistSlice(s: StudioState): Persist {
  return {
    lookId: s.lookId,
    shot: s.shot,
    episode: s.episode,
    millUrl: s.millUrl,
  };
}

export const useStudio = create<StudioState>((set, get) => ({
  onAir: false,
  status: "idle",
  drive: "book",
  bay: "floor",
  shot: "cover",
  camMove: "cut" as CamMove,
  lookId: DEFAULT_LOOK,
  talentUrl: null,
  leadUrl: null,
  pattyUrl: null,
  introUrl: null,
  showUrl: null,
  episode: DEFAULT_EPISODE,
  voice: DEFAULT_VOICE,
  volume: 1,
  lipGain: 1.55,
  captions: true,
  caption: null,
  lineStarted: 0,
  lineDur: 0,
  cue: "",
  copy: DEFAULT_COPY,
  beatId: RUNDOWN[0]?.id ?? "cold",
  history: [],
  log: [
    {
      id: 0,
      role: "system",
      text: "Ep 01 is loaded. Cold open over black, title card, then the standing set.",
    },
  ],
  aiReady: null,
  error: null,
  rolledAt: null,
  rollGen: 0,
  rolling: false,
  replayUrl: null,
  millUrl: DEFAULT_MILL,
  millOk: null,
  millEngine: null,
  expressBeat: {},
  phase: "standby",
  killed: false,
  setMillUrl: (millUrl) => {
    set({ millUrl, millOk: null, millEngine: null });
    writePersist(persistSlice(get()));
  },
  setMillStatus: (millOk, millEngine) => set({ millOk, millEngine }),
  plugExpress: (beatId, url) => {
    const next = { ...get().expressBeat };
    const prev = next[beatId];
    if (url === null) {
      delete next[beatId];
      if (prev) {
        try {
          URL.revokeObjectURL(prev);
        } catch {
          /* */
        }
      }
    } else {
      if (prev && prev !== url) {
        try {
          URL.revokeObjectURL(prev);
        } catch {
          /* */
        }
      }
      next[beatId] = url;
    }
    set({ expressBeat: next });
  },
  setOnAir: (onAir) => set({ onAir }),
  setStatus: (status) => set({ status }),
  setDrive: (drive) => set({ drive }),
  setBay: (bay) => set({ bay }),
  setShot: (shot, move = "cut") => {
    if (get().phase === "coldopen") return set({ error: CUT_REFUSED });
    set({ shot, camMove: move });
    writePersist(persistSlice(get()));
  },
  setLookId: (lookId) => {
    set({ lookId });
    writePersist(persistSlice(get()));
  },
  plugTalent: (talentUrl) => {
    set({ talentUrl, lookId: talentUrl ? "custom" : DEFAULT_LOOK });
    writePersist(persistSlice(get()));
  },
  plugLead: (leadUrl) => set({ leadUrl }),
  plugPatty: (pattyUrl) => set({ pattyUrl }),
  plugIntro: (introUrl) => set({ introUrl }),
  plugShow: (showUrl) => set({ showUrl }),
  takeIntro: () => {
    if (get().phase === "coldopen") return set({ error: CUT_REFUSED });
    set({ shot: "cover", bay: "floor" });
    writePersist(persistSlice(get()));
    get().pushLog("system", "Title card on program.");
  },
  takeShow: () => {
    if (get().phase === "coldopen") return set({ error: CUT_REFUSED });
    set({ shot: "two", camMove: "scan", bay: "floor" });
    writePersist(persistSlice(get()));
    get().pushLog("system", "Cam A. Three at the desk.");
  },
  takeBlack: () => {
    if (get().phase === "coldopen") return set({ error: CUT_REFUSED });
    set({ shot: "black", bay: "floor" });
    writePersist(persistSlice(get()));
    get().pushLog("system", "Cold open. Over black.");
  },
  rollEpisode: (gen) => {
    const next = gen ?? get().rollGen + 1;
    const prev = get().replayUrl;
    if (prev) {
      try {
        URL.revokeObjectURL(prev);
      } catch {
        /* */
      }
    }
    set({
      onAir: true,
      rolling: true,
      rolledAt: null, // the clock starts when the interlock says the disclaimer has played
      rollGen: next,
      drive: "book",
      bay: "floor",
      shot: "black",
      beatId: "cold",
      caption: null,
      error: null,
      status: "idle",
      replayUrl: null,
    });
    get().pushLog("system", "Episode One is rolling.");
  },
  /** Stop, or the roll ran out. The clock stops, and the generation moves on so anything still in flight bails. */
  finishRoll: (url) => {
    set({
      rolling: false,
      onAir: false,
      status: "idle",
      replayUrl: url,
      caption: null,
      lineStarted: 0,
      lineDur: 0,
      rolledAt: null,
      rollGen: get().rollGen + 1,
    });
    get().pushLog("system", url ? "Tape is in. Replay is ready." : "Roll complete.");
  },
  setEpisode: (episode) => {
    set({ episode });
    writePersist(persistSlice(get()));
  },
  setVoice: (voice) => set({ voice }),
  setVolume: (volume) => set({ volume }),
  setLipGain: (lipGain) => set({ lipGain }),
  setCaptions: (captions) => set({ captions }),
  setCaption: (text) =>
    set({ caption: text ? { id: nextId++, text } : null }),
  setLine: (durMs, text) =>
    set({
      lineStarted: Date.now(),
      lineDur: durMs,
      caption: text ? { id: nextId++, text } : null,
      status: "speaking",
      onAir: true,
    }),
  clearLine: () =>
    set({
      lineStarted: 0,
      lineDur: 0,
      caption: null,
      status: "idle",
    }),
  setCue: (cue) => set({ cue }),
  setCopy: (copy) => set({ copy }),
  /** The cue on program, as decided by the interlock. */
  programBeat: (beatId) => {
    const beat = RUNDOWN.find((b) => b.id === beatId);
    if (!beat) return;
    const patch: Partial<StudioState> = { beatId };
    if (beat.speaker === "black") patch.shot = "black";
    if (beat.speaker === "card") patch.shot = "cover";
    if (beat.speaker === "show") patch.shot = "two";
    if (beat.speaker === "talent") patch.cue = beat.text;
    if (beat.speaker === "everett" || beat.speaker === "patty") patch.copy = beat.text;
    set(patch);
    writePersist(persistSlice(get()));
  },
  /** Rehearsal only. On air, cues move through the interlock (seat/live.ts jumpTo). */
  setBeat: (beatId) => {
    if (get().phase !== "standby") return set({ error: "Refused: while the show is on, cues move through the interlock." });
    get().programBeat(beatId);
  },
  pushLog: (role, text) =>
    set((s) => ({
      log: [...s.log, { id: nextId++, role, text }].slice(-24),
    })),
  pushHistory: (turn) =>
    set((s) => ({ history: [...s.history, turn].slice(-8) })),
  setAiReady: (aiReady) => set({ aiReady }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export function talentStillSrc(s: Pick<StudioState, "lookId" | "talentUrl">) {
  if (s.lookId === "custom" && s.talentUrl) return s.talentUrl;
  return lookById(s.lookId).src;
}

export function leadStillSrc(s: Pick<StudioState, "leadUrl">) {
  return s.leadUrl || "/avatar/cohost.jpg";
}

export function pattyStillSrc(s: Pick<StudioState, "pattyUrl">) {
  return s.pattyUrl || "/avatar/patty.jpg";
}

export function introBackdropSrc(s: Pick<StudioState, "introUrl">) {
  return s.introUrl || DEFAULT_INTRO;
}

export function showBackdropSrc(s: Pick<StudioState, "showUrl">) {
  return s.showUrl || DEFAULT_SHOW;
}

export function hydrateStudio() {
  if (hydrated) return;
  hydrated = true;
  try {
    const p = readPersist();
    const live = useStudio.getState().onAir;
    if (live) return;
    useStudio.setState({
      lookId: p.lookId,
      shot: p.shot,
      episode: p.episode,
      millUrl: p.millUrl,
    });
  } catch {
    /* keep defaults */
  }
}
