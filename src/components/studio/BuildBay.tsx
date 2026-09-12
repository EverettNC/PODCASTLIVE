import { ImagePlus } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import { ProgramMonitor } from "@/components/studio/AvatarStage";
import { Button } from "@/components/ui/button";
import { HOST_LOOKS } from "@/lib/studio/looks";
import { probeMill, type MillSeat } from "@/lib/studio/mill";
import { RUNDOWN } from "@/lib/studio/show";
import {
  introBackdropSrc,
  showBackdropSrc,
  useStudio,
  type Shot,
} from "@/lib/studio-store";
import { cn } from "@/lib/utils";

const SHOTS: { id: Shot; label: string }[] = [
  { id: "black", label: "Cold" },
  { id: "cover", label: "Title" },
  { id: "two", label: "Standing" },
  { id: "lead", label: "Host iso" },
  { id: "talent", label: "Brandon iso" },
  { id: "patty", label: "Patty iso" },
];

export function BuildBay() {
  const lookId = useStudio((s) => s.lookId);
  const setLookId = useStudio((s) => s.setLookId);
  const shot = useStudio((s) => s.shot);
  const setShot = useStudio((s) => s.setShot);
  const takeIntro = useStudio((s) => s.takeIntro);
  const takeShow = useStudio((s) => s.takeShow);
  const talentUrl = useStudio((s) => s.talentUrl);
  const plugTalent = useStudio((s) => s.plugTalent);
  const plugLead = useStudio((s) => s.plugLead);
  const plugPatty = useStudio((s) => s.plugPatty);
  const plugIntro = useStudio((s) => s.plugIntro);
  const plugShowSet = useStudio((s) => s.plugShow);
  const leadUrl = useStudio((s) => s.leadUrl);
  const pattyUrl = useStudio((s) => s.pattyUrl);
  const introUrl = useStudio((s) => s.introUrl);
  const showUrl = useStudio((s) => s.showUrl);
  const episode = useStudio((s) => s.episode);
  const setEpisode = useStudio((s) => s.setEpisode);
  const pushLog = useStudio((s) => s.pushLog);
  const introSrc = introBackdropSrc({ introUrl });
  const showSrc = showBackdropSrc({ showUrl });

  function pickLook(id: string) {
    setLookId(id);
    const look = HOST_LOOKS.find((l) => l.id === id);
    pushLog("system", `Co-host look · ${look?.name ?? id}.`);
  }

  function onFile(
    file: File | undefined,
    slot: "talent" | "lead" | "patty" | "intro" | "show",
  ) {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    if (slot === "talent") {
      if (talentUrl) URL.revokeObjectURL(talentUrl);
      plugTalent(url);
      pushLog("system", "Plugged a custom co-host still.");
    } else if (slot === "lead") {
      if (leadUrl) URL.revokeObjectURL(leadUrl);
      plugLead(url);
      pushLog("system", "Plugged a custom host still.");
    } else if (slot === "patty") {
      if (pattyUrl) URL.revokeObjectURL(pattyUrl);
      plugPatty(url);
      pushLog("system", "Plugged a custom Patty still.");
    } else if (slot === "intro") {
      if (introUrl) URL.revokeObjectURL(introUrl);
      plugIntro(url);
      setShot("cover");
      pushLog("system", "Plugged the intro backdrop.");
    } else {
      if (showUrl) URL.revokeObjectURL(showUrl);
      plugShowSet(url);
      setShot("two");
      pushLog("system", "Plugged the show backdrop.");
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <section className="relative h-[30vh] shrink-0 p-3 sm:h-[34vh] sm:p-5 lg:px-10 lg:pt-6 lg:pb-3">
        <ProgramMonitor />
      </section>

      <aside className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-border">
        <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-6 px-5 py-5 sm:px-8 sm:py-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
                Build
              </p>
              <h2 className="mt-1 text-xl font-medium tracking-tight">Studio</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Voice mill first. Then plates. No paid key.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={takeIntro}>Roll intro</Button>
              <Button variant="secondary" onClick={takeShow}>
                Take show
              </Button>
            </div>
          </div>

          <MillRack />

          <section className="flex flex-col gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
              Sets
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SetSlot
                label="Intro backdrop"
                hint={introUrl ? "Custom plugged" : "Ep 01 title card"}
                src={introSrc}
                active={shot === "cover"}
                onPreview={() => setShot("cover")}
                onFile={(file) => onFile(file, "intro")}
              />
              <SetSlot
                label="Show backdrop"
                hint={showUrl ? "Custom plugged" : "Honesty above all else"}
                src={showSrc}
                active={shot !== "cover"}
                onPreview={() => setShot("two")}
                onFile={(file) => onFile(file, "show")}
              />
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
              Shot
            </p>
            <div className="grid grid-cols-3 gap-1 rounded-[var(--radius-lg)] bg-surface p-1 shadow-[var(--shadow-border)] sm:grid-cols-6">
              {SHOTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setShot(s.id)}
                  className={cn(
                    "h-11 rounded-[var(--radius-md)] text-sm font-medium transition-colors duration-150",
                    shot === s.id ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
              Co-host wardrobe
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {HOST_LOOKS.map((look) => {
                const on = lookId === look.id;
                return (
                  <button
                    key={look.id}
                    type="button"
                    onClick={() => pickLook(look.id)}
                    className={cn(
                      "group overflow-hidden rounded-[var(--radius-lg)] text-left transition-opacity duration-150",
                      on
                        ? "shadow-[var(--shadow-border-hover)] ring-1 ring-fg"
                        : "shadow-[var(--shadow-border)] opacity-80 hover:opacity-100",
                    )}
                  >
                    <img
                      src={look.thumb}
                      alt=""
                      className="aspect-[5/4] w-full object-cover object-[50%_18%]"
                    />
                    <span className="flex items-baseline justify-between gap-1 bg-surface-2 px-3 py-2">
                      <span className="text-sm font-medium text-fg">{look.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">
                        {look.note}
                      </span>
                    </span>
                  </button>
                );
              })}
              {talentUrl && (
                <button
                  type="button"
                  onClick={() => setLookId("custom")}
                  className={cn(
                    "overflow-hidden rounded-[var(--radius-lg)] text-left",
                    lookId === "custom"
                      ? "shadow-[var(--shadow-border-hover)]"
                      : "shadow-[var(--shadow-border)]",
                  )}
                >
                  <img
                    src={talentUrl}
                    alt=""
                    className="aspect-[5/4] w-full object-cover object-[50%_18%]"
                  />
                  <span className="flex bg-surface-2 px-3 py-2 text-sm font-medium">
                    Plug
                  </span>
                </button>
              )}
            </div>
          </section>

          <div className="grid gap-6 pb-8 md:grid-cols-[1fr_minmax(16rem,22rem)]">
            <section className="flex flex-col gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
                Talent stills
              </p>
              <div className="grid grid-cols-3 gap-3">
                <DropSlot
                  label="Everett"
                  hint={leadUrl ? "Custom plugged" : "Lead host"}
                  onFile={(file) => onFile(file, "lead")}
                />
                <DropSlot
                  label="Patty"
                  hint={pattyUrl ? "Custom plugged" : "Co-host"}
                  onFile={(file) => onFile(file, "patty")}
                />
                <DropSlot
                  label="Brandon"
                  hint="Outfit or new face"
                  onFile={(file) => onFile(file, "talent")}
                />
              </div>
            </section>

            <label className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
                Episode
              </span>
              <input
                value={episode}
                onChange={(e) => setEpisode(e.target.value)}
                className="h-11 rounded-[var(--radius-md)] bg-surface px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-accent/40"
              />
            </label>
          </div>
        </div>
      </aside>
    </div>
  );
}

function MillRack() {
  const millUrl = useStudio((s) => s.millUrl);
  const setMillUrl = useStudio((s) => s.setMillUrl);
  const millOk = useStudio((s) => s.millOk);
  const millEngine = useStudio((s) => s.millEngine);
  const setMillStatus = useStudio((s) => s.setMillStatus);
  const millPath = useStudio((s) => s.millPath);
  const setMillPath = useStudio((s) => s.setMillPath);
  const beatId = useStudio((s) => s.beatId);
  const expressBeat = useStudio((s) => s.expressBeat);
  const plugExpress = useStudio((s) => s.plugExpress);
  const pushLog = useStudio((s) => s.pushLog);
  const [draft, setDraft] = useState(millUrl);
  const [busy, setBusy] = useState(false);
  const beat = RUNDOWN.find((b) => b.id === beatId);
  const lineSeated = Boolean(beatId && expressBeat[beatId]);

  useEffect(() => {
    setDraft(millUrl);
  }, [millUrl]);

  async function seatMill(url = draft) {
    setBusy(true);
    setMillUrl(url);
    try {
      const result = await probeMill(url);
      setMillStatus(result.ok, result.engine);
      pushLog(
        "system",
        result.ok
          ? `Mill seated · ${result.engine ?? "christman"}.`
          : "Mill not on this box yet. Drop a take anyway.",
      );
    } catch {
      setMillStatus(false, null);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void seatMill(millUrl);
    // seat once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onAudio(file: File | undefined, seat?: MillSeat) {
    if (!file) return;
    if (file.name.toLowerCase().endsWith(".json")) {
      void file.text().then((raw) => {
        try {
          const pack = JSON.parse(raw) as { being_name?: string; notes?: string };
          const being = (pack.being_name || "").toLowerCase();
          const which: MillSeat =
            being === "patty" ? "patty" : being === "brandon" || being === "cletus" ? "talent" : "everett";
          pushLog("system", `Pack · ${pack.being_name ?? file.name}. Path the mill can read, below.`);
          if (seat) setMillPath(seat, millPath[seat]);
          else setMillPath(which, millPath[which]);
        } catch {
          pushLog("system", "That pack file did not read.");
        }
      });
      return;
    }
    const audio = file.type.startsWith("audio/") || /\.(wav|mp3|m4a|ogg|webm)$/i.test(file.name);
    if (!audio) {
      pushLog("system", "Drop a wav, an mp3, or a pack json.");
      return;
    }
    const url = URL.createObjectURL(file);
    const target = beatId || RUNDOWN[0]?.id;
    if (target) plugExpress(target, url);
    pushLog(
      "system",
      seat
        ? `Express · ${seat} · ${file.name}`
        : `Express on this line · ${file.name}`,
    );
  }

  const millLabel =
    millOk === true
      ? millEngine || "christman mill"
      : millOk === false
        ? "mill missing"
        : "waiting";

  return (
    <section className="flex flex-col gap-4 rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
            Voice mill
          </p>
          <h3 className="mt-1 text-lg font-medium tracking-tight">Christman-Sound</h3>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
            Voice Creation Center. Express first, then the mill. No paid key. Ever.
          </p>
        </div>
        <span
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.16em]",
            millOk ? "text-air" : "text-subtle",
          )}
        >
          {millLabel}
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            if (draft.trim() !== millUrl) void seatMill(draft);
          }}
          spellCheck={false}
          placeholder="http://127.0.0.1:5000"
          className="h-11 min-w-0 flex-1 rounded-[var(--radius-md)] bg-bg px-3 font-mono text-sm text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-accent/40"
        />
        <Button disabled={busy} onClick={() => void seatMill(draft)}>
          {busy ? "Seating…" : "Seat mill"}
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {(["everett", "patty", "talent"] as const).map((seat) => (
          <label key={seat} className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
              {seat === "talent" ? "Brandon path" : `${seat} path`}
            </span>
            <input
              value={millPath[seat]}
              onChange={(e) => setMillPath(seat, e.target.value)}
              spellCheck={false}
              placeholder="reference.wav on the mill"
              className="h-10 rounded-[var(--radius-md)] bg-bg px-3 font-mono text-xs text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-accent/40"
            />
          </label>
        ))}
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
          Drop a take
        </p>
        <p className="mt-1 text-sm text-muted">
          Wav or pack json. Express plays first. Current line: {beat?.n ?? "—"}{" "}
          {beat?.label ?? ""}
          {lineSeated ? " · seated" : ""}.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <AudioDrop
            label="This line"
            hint={lineSeated ? "Take seated" : "Drop the wav for the line on the dashboard"}
            wide
            onFile={(file) => onAudio(file)}
          />
          <AudioDrop
            label="Everett"
            hint="Express / pack"
            onFile={(file) => onAudio(file, "everett")}
          />
          <AudioDrop
            label="Patty"
            hint="Express / pack"
            onFile={(file) => onAudio(file, "patty")}
          />
          <AudioDrop
            label="Brandon"
            hint="Express / pack"
            onFile={(file) => onAudio(file, "talent")}
          />
        </div>
      </div>
    </section>
  );
}

function AudioDrop({
  label,
  hint,
  onFile,
  wide,
}: {
  label: string;
  hint: string;
  onFile: (file: File | undefined) => void;
  wide?: boolean;
}) {
  return (
    <label
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onFile(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        "flex min-h-28 cursor-pointer flex-col items-start justify-center gap-1 rounded-[var(--radius-lg)] bg-bg px-4 py-4 text-left shadow-[var(--shadow-border)] transition-opacity duration-150 hover:opacity-90",
        wide && "sm:col-span-1",
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-muted">{hint}</span>
      <input
        type="file"
        accept="audio/*,.wav,.mp3,.m4a,.ogg,.webm,.json,.cvp"
        className="sr-only"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </label>
  );
}

function SetSlot({
  label,
  hint,
  src,
  active,
  onPreview,
  onFile,
}: {
  label: string;
  hint: string;
  src: string;
  active: boolean;
  onPreview: () => void;
  onFile: (file: File | undefined) => void;
}) {
  function onDrop(e: DragEvent) {
    e.preventDefault();
    onFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={cn(
        "overflow-hidden rounded-[var(--radius-lg)]",
        active
          ? "shadow-[var(--shadow-border-hover)] ring-1 ring-fg"
          : "shadow-[var(--shadow-border)]",
      )}
    >
      <button type="button" onClick={onPreview} className="block w-full text-left">
        <img src={src} alt="" className="h-36 w-full object-cover sm:h-44" />
      </button>
      <div className="flex items-center justify-between gap-3 bg-surface-2 px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-fg">{label}</p>
          <p className="truncate text-xs text-muted">{hint}</p>
        </div>
        <label className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-[var(--radius-sm)] bg-surface px-3 text-sm font-medium text-fg shadow-[var(--shadow-border)]">
          <ImagePlus className="size-4" />
          Drop
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}

function DropSlot({
  label,
  hint,
  onFile,
}: {
  label: string;
  hint: string;
  onFile: (file: File | undefined) => void;
}) {
  return (
    <label
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onFile(e.dataTransfer.files?.[0]);
      }}
      className="flex min-h-24 cursor-pointer flex-col items-start justify-center gap-1 rounded-[var(--radius-lg)] bg-surface px-4 py-4 text-left shadow-[var(--shadow-border)] transition-opacity duration-150 hover:opacity-90"
    >
      <span className="inline-flex items-center gap-1.5 text-sm font-medium">
        <ImagePlus className="size-3.5 text-subtle" />
        {label}
      </span>
      <span className="text-xs text-muted">{hint}</span>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </label>
  );
}
