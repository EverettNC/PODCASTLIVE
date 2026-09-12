import { useEffect } from "react";
import { ProgramMonitor } from "@/components/studio/AvatarStage";
import { Button } from "@/components/ui/button";
import { jumpTo } from "@/lib/seat/live.ts";
import { runHostCue } from "@/lib/speak";
import { playEpisode, stopEpisode } from "@/lib/studio/director";
import { probeMill } from "@/lib/studio/mill";
import { RUNDOWN, SHOW, type Beat } from "@/lib/studio/show";
import { useStudio } from "@/lib/studio-store";
import { cn } from "@/lib/utils";

export function DashboardBay() {
  const onAir = useStudio((s) => s.onAir);
  const status = useStudio((s) => s.status);
  const shot = useStudio((s) => s.shot);
  const beatId = useStudio((s) => s.beatId);
  const takeBlack = useStudio((s) => s.takeBlack);
  const takeIntro = useStudio((s) => s.takeIntro);
  const takeShow = useStudio((s) => s.takeShow);
  const rolling = useStudio((s) => s.rolling);
  const replayUrl = useStudio((s) => s.replayUrl);
  const error = useStudio((s) => s.error);
  const millUrl = useStudio((s) => s.millUrl);
  const millOk = useStudio((s) => s.millOk);
  const millEngine = useStudio((s) => s.millEngine);
  const setMillStatus = useStudio((s) => s.setMillStatus);
  const setBay = useStudio((s) => s.setBay);
  const setDrive = useStudio((s) => s.setDrive);
  const beat = RUNDOWN.find((b) => b.id === beatId) ?? RUNDOWN[0];
  const idx = RUNDOWN.findIndex((b) => b.id === beat.id);
  const nextBeat = RUNDOWN[idx + 1];
  const busy = status === "thinking" || status === "speaking" || status === "listening";
  const live = onAir || status === "speaking" || status === "listening";

  useEffect(() => {
    if (millOk !== null) return;
    let gone = false;
    void probeMill(millUrl)
      .then((r) => {
        if (!gone) setMillStatus(r.ok, r.engine);
      })
      .catch(() => {
        if (!gone) setMillStatus(false, null);
      });
    return () => {
      gone = true;
    };
  }, [millOk, millUrl, setMillStatus]);

  function playLine() {
    if (beat.speaker !== "talent" || busy) return;
    void runHostCue(beat.text);
  }

  return (
    <main className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(19rem,26rem)]">
      <section className="relative min-h-0 p-3 lg:p-5">
        <ProgramMonitor className="h-full min-h-80" />
      </section>

      <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto border-t border-border p-4 sm:border-t-0 sm:border-l lg:p-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
            Dashboard
          </p>
          <h2 className="mt-1 text-xl font-medium tracking-tight">{SHOW.episodeNum}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">{SHOW.episodeName}</p>
        </div>

        <button
          type="button"
          onClick={() => {
            const s = useStudio.getState();
            if (s.rolling) {
              stopEpisode();
              return;
            }
            void playEpisode().catch((err) => {
              s.setError(err instanceof Error ? err.message : "Roll did not start.");
            });
          }}
          className="h-14 w-full rounded-full bg-air text-base font-medium text-fg"
        >
          {rolling ? "Stop" : "Roll Episode One"}
        </button>
        {error && (
          <p className="text-sm leading-relaxed text-air">{error}</p>
        )}
        {replayUrl && (
          <a
            href={replayUrl}
            download="FNTA-Ep01.webm"
            className="flex h-11 items-center justify-center rounded-full bg-surface-2 text-sm font-medium text-fg no-underline shadow-[var(--shadow-border)]"
          >
            Replay tape
          </a>
        )}

        <div className="flex items-center justify-between rounded-[var(--radius-lg)] bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
          <span
            className={cn(
              "font-mono text-[11px] uppercase tracking-[0.16em]",
              live ? "text-air" : "text-subtle",
            )}
          >
            {live ? "On air" : "Standby"}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            {shotName(shot)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setBay("build")}
          className="flex items-center justify-between rounded-[var(--radius-lg)] bg-surface px-4 py-3 text-left shadow-[var(--shadow-border)]"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
            Mill
          </span>
          <span
            className={cn(
              "font-mono text-[11px] uppercase tracking-[0.14em]",
              millOk ? "text-air" : "text-muted",
            )}
          >
            {millOk ? millEngine || "seated" : "Build · drop a take"}
          </span>
        </button>

        <div className="grid grid-cols-3 gap-2">
          <Seat name="Everett" role="Host" hot={beat.speaker === "everett"} />
          <Seat name="Patty" role="Co-host" hot={beat.speaker === "patty"} />
          <Seat name="Brandon" role="Rendering" hot={beat.speaker === "talent"} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
            Now · {beat.n} {beat.label}
          </p>
          <div className="min-h-36 overflow-y-auto rounded-[var(--radius-lg)] bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
              {speakerLabel(beat)}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-base leading-relaxed text-fg">
              {beat.text}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {beat.speaker === "talent" && (
              <Button className="flex-1" disabled={busy} onClick={playLine}>
                {status === "thinking" ? "Formulating…" : "Cue Brandon"}
              </Button>
            )}
            {beat.speaker === "everett" && (
              <Button className="flex-1" variant="secondary" onClick={() => setDrive("mic")}>
                Arm Everett
              </Button>
            )}
            {beat.speaker === "patty" && (
              <p className="flex-1 self-center text-sm text-muted">Patty is live.</p>
            )}
            {beat.speaker === "black" && (
              <Button className="flex-1" onClick={takeBlack}>
                Over black
              </Button>
            )}
            {beat.speaker === "card" && (
              <Button className="flex-1" onClick={takeIntro}>
                Roll title
              </Button>
            )}
            {beat.speaker === "show" && (
              <Button className="flex-1" onClick={takeShow}>
                Take standing
              </Button>
            )}
            <Button variant="ghost" disabled={!nextBeat} onClick={() => nextBeat && jumpTo(nextBeat.id)}>
              Next
            </Button>
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
            Book
          </p>
          <div className="max-h-48 overflow-y-auto rounded-[var(--radius-lg)] bg-surface p-2 shadow-[var(--shadow-border)]">
            {RUNDOWN.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => jumpTo(b.id)}
                className={cn(
                  "flex w-full items-baseline gap-3 rounded-[var(--radius-md)] px-3 py-2 text-left",
                  b.id === beat.id ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
                )}
              >
                <span className="w-6 shrink-0 font-mono text-[11px] tabular-nums">{b.n}</span>
                <span className="min-w-0 flex-1 truncate text-sm">{b.label}</span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">
                  {speakerLabel(b)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}

function Seat({ name, role, hot }: { name: string; role: string; hot: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] px-3 py-3 shadow-[var(--shadow-border)]",
        hot ? "bg-surface-2" : "bg-surface",
      )}
    >
      <p className="text-sm font-medium text-fg">{name}</p>
      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
        {hot ? "This line" : role}
      </p>
    </div>
  );
}

function speakerLabel(beat: Beat) {
  if (beat.speaker === "everett") return "Everett";
  if (beat.speaker === "patty") return "Patty";
  if (beat.speaker === "talent") return "Brandon";
  if (beat.speaker === "card") return "Title";
  if (beat.speaker === "show") return "Standing";
  return "Black";
}

function shotName(shot: string) {
  if (shot === "black") return "Cold";
  if (shot === "cover") return "Title";
  if (shot === "lead") return "Host iso";
  if (shot === "talent") return "Brandon iso";
  if (shot === "patty") return "Patty iso";
  return "Standing";
}
