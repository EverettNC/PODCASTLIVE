import { useEffect, useRef } from "react";
import { audioEngine } from "@/lib/avatar/audio-engine";
import { drawCoverImage, drawTalent, fitCover, type DrawMapping } from "@/lib/avatar/draw";
import { LEAD_RIG, PATTY_RIG, TALENT_RIG, type FaceRig } from "@/lib/avatar/landmarks";
import { createLipTracker, type LipState } from "@/lib/avatar/lip-sync";
import { isKilled, liveMouth } from "@/lib/seat/live.ts";
import { playEpisode } from "@/lib/studio/director";
import { programBus } from "@/lib/studio/program-bus";
import { RUNDOWN, SHOW } from "@/lib/studio/show";
import {
  introBackdropSrc,
  showBackdropSrc,
  useStudio,
  type Shot,
} from "@/lib/studio-store";
import { cn } from "@/lib/utils";

const REST: LipState = {
  open: 0,
  viseme: "rest",
  blink: 0,
  swayX: 0,
  swayY: 0,
  swayRot: 0,
  breath: 0,
  rms: 0,
};

function loadVideo(src: string) {
  const v = document.createElement("video");
  v.muted = true;
  v.loop = true;
  v.playsInline = true;
  v.preload = "auto";
  v.crossOrigin = "anonymous";
  v.setAttribute("playsinline", "true");
  v.src = src;
  const kick = () => {
    v.play().catch(() => {});
  };
  v.addEventListener("canplay", kick);
  v.addEventListener("loadeddata", kick);
  v.load();
  return v;
}

function plateSource(
  talk: HTMLVideoElement | null,
  idle: HTMLVideoElement | null,
  img: HTMLImageElement,
  talking: boolean,
  preferStill = false,
): CanvasImageSource | null {
  const ready = (v: HTMLVideoElement | null) =>
    Boolean(v && v.readyState >= 2 && v.videoWidth > 1);
  if (talking && ready(talk)) return talk;
  if (!talking && preferStill && img.complete && img.naturalWidth > 1) return img;
  if (ready(idle)) return idle;
  if (img.complete && img.naturalWidth > 1) return img;
  return null;
}

function loadImage(src: string) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onerror = () => {
    img.removeAttribute("src");
  };
  try {
    img.src = src;
  } catch {
    /* */
  }
  return img;
}

function sourceSize(src: CanvasImageSource) {
  if (src instanceof HTMLVideoElement) return { w: src.videoWidth, h: src.videoHeight };
  if (src instanceof HTMLImageElement) return { w: src.naturalWidth, h: src.naturalHeight };
  return { w: 0, h: 0 };
}

function seatFor(beatId: string): "lead" | "patty" | "talent" | null {
  const beat = RUNDOWN.find((b) => b.id === beatId);
  if (!beat) return null;
  if (beat.speaker === "everett") return "lead";
  if (beat.speaker === "patty") return "patty";
  if (beat.speaker === "talent") return "talent";
  return null;
}

export function ProgramMonitor({
  className,
  clean = false,
}: {
  className?: string;
  clean?: boolean;
}) {
  const shot = useStudio((s) => s.shot);
  const onAir = useStudio((s) => s.onAir);
  const rolling = useStudio((s) => s.rolling);
  const takeBlack = useStudio((s) => s.takeBlack);
  const takeIntro = useStudio((s) => s.takeIntro);
  const takeShow = useStudio((s) => s.takeShow);
  const waiting = !onAir && !rolling && shot === "cover";

  return (
    <div
      className={cn(
        "relative h-full min-h-0 w-full overflow-hidden bg-[#0c0c0e]",
        !clean && "rounded-[var(--radius-xl)]",
        className,
      )}
      style={{ background: "#0c0c0e" }}
    >
      <AvatarStage className="h-full" clean />

      {!clean && waiting && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0c0c0e]/70 p-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            Episode One
          </p>
          <p className="mt-2 max-w-lg text-2xl font-medium tracking-tight text-fg sm:text-3xl">
            I Said No. It Wrote the Report Anyway.
          </p>
          <button
            type="button"
            onClick={() => {
              const s = useStudio.getState();
              void playEpisode().catch((err) => {
                s.setError(err instanceof Error ? err.message : "Roll did not start.");
              });
            }}
            className="mt-8 h-14 min-w-[16rem] rounded-full bg-air px-8 text-base font-medium text-fg"
          >
            Roll Episode One
          </button>
        </div>
      )}

      {!clean && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-center gap-2 p-3 sm:p-4">
          <div className="flex rounded-full bg-bg/80 p-1 shadow-[var(--shadow-border)]">
            <button
              type="button"
              onClick={takeBlack}
              className={cn(
                "h-9 rounded-full px-3 text-sm",
                shot === "black" ? "bg-surface-2 text-fg" : "text-muted",
              )}
            >
              Cold
            </button>
            <button
              type="button"
              onClick={takeIntro}
              className={cn(
                "h-9 rounded-full px-3 text-sm",
                shot === "cover" ? "bg-surface-2 text-fg" : "text-muted",
              )}
            >
              Title
            </button>
            <button
              type="button"
              onClick={takeShow}
              className={cn(
                "h-9 rounded-full px-3 text-sm",
                shot !== "black" && shot !== "cover" ? "bg-surface-2 text-fg" : "text-muted",
              )}
            >
              Desk
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AvatarStage({
  className,
  clean = false,
}: {
  className?: string;
  clean?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onAir = useStudio((s) => s.onAir);
  const status = useStudio((s) => s.status);
  const captions = useStudio((s) => s.captions);
  const caption = useStudio((s) => s.caption);
  const drive = useStudio((s) => s.drive);
  const leadUrl = useStudio((s) => s.leadUrl);
  const pattyUrl = useStudio((s) => s.pattyUrl);
  const talentUrl = useStudio((s) => s.talentUrl);
  const showUrl = useStudio((s) => s.showUrl);
  const introUrl = useStudio((s) => s.introUrl);
  const shot = useStudio((s) => s.shot);
  const rolling = useStudio((s) => s.rolling);
  const backdropSrc = showBackdropSrc({ showUrl });
  const introSrc = introBackdropSrc({ introUrl });
  const live = onAir || rolling || status === "speaking" || status === "listening";
  const hot =
    status === "speaking" || status === "thinking"
      ? seatFor(useStudio.getState().beatId)
      : drive === "mic" && status === "listening"
        ? "lead"
        : null;

  const leadSrc = leadUrl || "/avatar/cohost.jpg";
  const pattySrc = pattyUrl || "/avatar/patty-desk.jpg";
  const talentSrc = talentUrl || "/avatar/brandon-desk.jpg";

  useEffect(() => {
    const talentImg = loadImage(talentSrc);
    const leadImg = loadImage(leadSrc);
    const pattyImg = loadImage(pattySrc);
    const setImg = loadImage(backdropSrc);
    const introImg = loadImage(introSrc);
    const leadIdle = loadVideo("/avatar/live/everett.mp4");
    const leadTalk = loadVideo("/avatar/live/everett-talk.mp4");
    const pattyIdle = loadVideo("/avatar/live/patty.mp4");
    const pattyTalk = loadVideo("/avatar/live/patty-talk.mp4");
    const stageVid = loadVideo("/avatar/live/stage.mp4");
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    programBus.attach(canvas);

    const talentTrack = createLipTracker();
    const leadTrack = createLipTracker();
    const pattyTrack = createLipTracker();
    let raf = 0;
    let running = true;
    let cssW = 1;
    let cssH = 1;
    let lastDraw = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const w = Math.max(2, Math.floor(rect.width));
      const h = Math.max(2, Math.floor(rect.height));
      const bw = Math.floor(w * dpr);
      const bh = Math.floor(h * dpr);
      cssW = w;
      cssH = h;
      if (canvas.width === bw && canvas.height === bh) return;
      canvas.width = bw;
      canvas.height = bh;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const pane = (
      talk: HTMLVideoElement | null,
      idle: HTMLVideoElement | null,
      img: HTMLImageElement,
      tracker: ReturnType<typeof createLipTracker>,
      rig: FaceRig,
      x: number,
      y: number,
      w: number,
      h: number,
      talking: boolean,
      lockTop = false,
      preferStill = false,
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      // Brandon's mouth is measured from the audio that is playing; killed = frozen at rest.
      const mouth = liveMouth(rig.id);
      const frozen = rig.id === "talent" && isKilled();
      const src = plateSource(talk, idle, img, talking || mouth !== null, preferStill);
      const idleLip = tracker.step(null, talking || mouth !== null, 0, null);
      const lip: LipState = frozen ? REST : mouth ? { ...idleLip, open: mouth.open, viseme: mouth.viseme } : idleLip;
      if (src) {
        const { w: iw, h: ih } = sourceSize(src);
        if (iw > 1 && ih > 1) {
          const map: DrawMapping = fitCover(w, h, iw, ih, lockTop, 1);
          map.dx += x;
          map.dy += y;
          const still = !(src instanceof HTMLVideoElement);
          drawTalent(
            ctx,
            src,
            map,
            still ? lip : { ...REST, blink: 0, swayX: 0, swayY: 0, swayRot: 0, breath: 0 },
            useStudio.getState().lipGain,
            rig,
          );
        }
      }
      ctx.restore();
    };

    const drawDesk = () => {
      const y = cssH * 0.72;
      const g = ctx.createLinearGradient(0, y, 0, cssH);
      g.addColorStop(0, "#3a281c");
      g.addColorStop(0.18, "#5a3c28");
      g.addColorStop(1, "#1a120e");
      ctx.fillStyle = g;
      ctx.fillRect(0, y, cssW, cssH - y);
      ctx.fillStyle = "rgba(212,168,96,0.28)";
      ctx.fillRect(0, y, cssW, 3);
    };

    const drawBlack = () => {
      ctx.fillStyle = "#0c0c0e";
      ctx.fillRect(0, 0, cssW, cssH);
      ctx.fillStyle = "#e24b4b";
      ctx.font = "500 11px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText(useStudio.getState().onAir ? "ON AIR" : "STANDBY", cssW / 2, cssH * 0.38);
      ctx.fillStyle = "#ecece8";
      ctx.font = "500 42px Georgia, serif";
      ctx.fillText(SHOW.title, cssW / 2, cssH * 0.5);
      ctx.fillStyle = "#9a9a94";
      ctx.font = "500 12px ui-monospace, monospace";
      ctx.fillText("EPISODE ONE", cssW / 2, cssH * 0.56);
    };

    const drawWide = (leadTalks: boolean, pattyTalks: boolean, talentTalks: boolean) => {
      const stage = plateSource(null, stageVid, setImg, false);
      if (stage) drawCoverImage(ctx, stage, 0, 0, cssW, cssH);
      const deskY = Math.round(cssH * 0.72);
      const headH = Math.max(1, deskY);
      const gap = 4;
      const paneW = Math.max(1, (cssW - gap * 2) / 3);
      pane(leadTalk, leadIdle, leadImg, leadTrack, LEAD_RIG, 0, 0, paneW, headH, leadTalks, true, true);
      pane(pattyTalk, pattyIdle, pattyImg, pattyTrack, PATTY_RIG, paneW + gap, 0, paneW, headH, pattyTalks);
      pane(null, null, talentImg, talentTrack, TALENT_RIG, (paneW + gap) * 2, 0, paneW, headH, talentTalks, false, true);
      drawDesk();
    };

    const drawIso = (
      focus: "lead" | "patty" | "talent",
      leadTalks: boolean,
      pattyTalks: boolean,
      talentTalks: boolean,
    ) => {
      if (focus === "talent") {
        pane(null, null, talentImg, talentTrack, TALENT_RIG, 0, 0, cssW, cssH, talentTalks, false, true);
      } else if (focus === "patty") {
        pane(pattyTalk, pattyIdle, pattyImg, pattyTrack, PATTY_RIG, 0, 0, cssW, cssH, pattyTalks);
      } else {
        pane(leadTalk, leadIdle, leadImg, leadTrack, LEAD_RIG, 0, 0, cssW, cssH, leadTalks, true, true);
      }
    };

    const drawStanding = (state: ReturnType<typeof useStudio.getState>) => {
      const talkingSeat =
        state.status === "speaking" || state.lineDur > 0
          ? seatFor(state.beatId)
          : null;
      const talentTalks = talkingSeat === "talent";
      const leadTalks =
        talkingSeat === "lead" ||
        (state.drive === "mic" && Boolean(audioEngine.micStream));
      const pattyTalks = talkingSeat === "patty";
      const shotNow: Shot = state.shot;

      if (shotNow === "talent") {
        drawIso("talent", leadTalks, pattyTalks, talentTalks);
      } else if (shotNow === "patty") {
        drawIso("patty", leadTalks, pattyTalks, talentTalks);
      } else if (shotNow === "lead") {
        drawIso("lead", leadTalks, pattyTalks, talentTalks);
      } else {
        drawWide(leadTalks, pattyTalks, talentTalks);
      }
    };

    const draw = () => {
      try {
        if (cssW < 2 || cssH < 2) return;
        const state = useStudio.getState();
        ctx.fillStyle = "#0c0c0e";
        ctx.fillRect(0, 0, cssW, cssH);
        if (state.shot === "black") drawBlack();
        else if (state.shot === "cover") {
          if (introImg.complete && introImg.naturalWidth) {
            drawCoverImage(ctx, introImg, 0, 0, cssW, cssH);
          } else {
            drawBlack();
          }
        } else {
          drawStanding(state);
        }
      } catch {
        try {
          ctx.fillStyle = "#0c0c0e";
          ctx.fillRect(0, 0, cssW, cssH);
        } catch {
          /* keep loop */
        }
      }
    };

    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const state = useStudio.getState();
      const talking = state.status === "speaking" || state.lineDur > 0;
      const min = talking ? 33 : 40;
      if (now - lastDraw < min) return;
      lastDraw = now;
      draw();
    };

    raf = requestAnimationFrame(loop);
    const videos = [leadIdle, leadTalk, pattyIdle, pattyTalk, stageVid];
    const kick = () => {
      lastDraw = 0;
      for (const v of videos) v.play().catch(() => {});
      draw();
    };
    talentImg.onload = kick;
    leadImg.onload = kick;
    pattyImg.onload = kick;
    setImg.onload = kick;
    introImg.onload = kick;
    wrap.addEventListener("pointerdown", kick, { once: true });
    kick();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointerdown", kick);
      for (const v of videos) {
        v.pause();
        v.removeAttribute("src");
        v.load();
      }
      if (programBus.canvas === canvas) programBus.attach(null);
    };
  }, [talentSrc, leadSrc, pattySrc, backdropSrc, introSrc, talentUrl, leadUrl, pattyUrl, showUrl]);

  const plates: Array<"lead" | "patty" | "talent"> =
    shot === "black" || shot === "cover"
      ? []
      : shot === "lead"
        ? ["lead"]
        : shot === "talent"
          ? ["talent"]
          : shot === "patty"
            ? ["patty"]
            : ["lead", "patty", "talent"];

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative overflow-hidden bg-[#0c0c0e]",
        clean ? "h-full w-full" : "h-full min-h-64 w-full rounded-[var(--radius-xl)]",
        className,
      )}
      style={{ background: "#0c0c0e" }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {!clean && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6">
          <span
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium tracking-[0.14em] uppercase",
              live ? "bg-air text-fg" : "bg-bg/70 text-muted",
            )}
          >
            <span className={cn("size-1.5 rounded-full", live ? "bg-fg" : "bg-subtle")} />
            {rolling ? "Rolling" : live ? "On air" : "Standby"}
          </span>
        </div>
      )}
      {plates.length > 0 && (
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 gap-2 px-[3%] pb-[3%]",
            plates.length === 3 ? "grid grid-cols-3" : "flex",
          )}
        >
          {plates.includes("lead") && (
            <Nameplate name={LEAD_RIG.name} role={LEAD_RIG.role} hot={hot === "lead"} align="left" />
          )}
          {plates.includes("patty") && (
            <Nameplate name={PATTY_RIG.name} role={PATTY_RIG.role} hot={hot === "patty"} align="left" />
          )}
          {plates.includes("talent") && (
            <Nameplate name={TALENT_RIG.name} role={TALENT_RIG.role} hot={hot === "talent"} align="right" />
          )}
        </div>
      )}
      {captions && caption && (
        <div className="pointer-events-none absolute inset-x-0 bottom-16 p-5 sm:bottom-20 sm:p-8">
          <p className="mx-auto max-w-3xl rounded-[var(--radius-md)] bg-bg/75 px-5 py-3.5 text-center text-sm leading-snug text-fg sm:text-base">
            {caption.text}
          </p>
        </div>
      )}
    </div>
  );
}

function Nameplate({
  name,
  role,
  hot,
  align,
}: {
  name: string;
  role: string;
  hot: boolean;
  align: "left" | "right";
}) {
  return (
    <div className={cn("flex flex-1", align === "right" && "justify-end")}>
      <span
        className={cn(
          "inline-flex items-baseline gap-2 rounded-full px-3 py-1.5",
          hot ? "bg-air text-fg" : "bg-bg/70 text-fg",
        )}
      >
        <span className="text-sm font-medium">{name}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {role}
        </span>
      </span>
    </div>
  );
}
