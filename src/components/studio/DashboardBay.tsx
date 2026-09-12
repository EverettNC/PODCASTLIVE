import { ProgramMonitor } from "@/components/studio/AvatarStage";
import { Deck } from "@/components/studio/Deck";
import { playEpisode, stopEpisode } from "@/lib/studio/director";
import { useStudio } from "@/lib/studio-store";
import { cn } from "@/lib/utils";

/** The show. The picture, Roll, the state, then the Deck: rundown, cue Brandon, hold to talk, his line-in. */
export function DashboardBay() {
  const rolling = useStudio((s) => s.rolling);
  const phase = useStudio((s) => s.phase);
  const onAir = useStudio((s) => s.onAir);
  const status = useStudio((s) => s.status);
  const error = useStudio((s) => s.error);
  const replayUrl = useStudio((s) => s.replayUrl);
  const state = phase === "coldopen" ? "Disclaimer" : onAir || status === "speaking" ? "On air" : "Standby";

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <section className="relative h-[44vh] shrink-0 p-3 sm:p-5 lg:px-10 lg:pt-6 lg:pb-3">
        <ProgramMonitor className="h-full" />
      </section>

      <div className="flex flex-wrap items-center gap-3 px-5 pb-3 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => {
            const s = useStudio.getState();
            if (s.rolling) return stopEpisode();
            void playEpisode().catch((err) => s.setError(err instanceof Error ? err.message : "Roll did not start."));
          }}
          className={cn("h-12 rounded-full px-6 text-base font-medium text-fg", rolling ? "bg-surface-2 shadow-[var(--shadow-border)]" : "bg-air")}
        >
          {rolling ? "Stop" : "Roll Episode One"}
        </button>
        <span className={cn("font-mono text-[11px] uppercase tracking-[0.16em]", state === "Standby" ? "text-subtle" : "text-air")} aria-live="polite">
          {state}
        </span>
        {replayUrl && (
          <a href={replayUrl} download="FNTA-Ep01.webm" className="text-sm font-medium text-fg underline-offset-4 hover:underline">
            Replay tape
          </a>
        )}
        {error && <p className="basis-full text-sm leading-relaxed text-air">{error}</p>}
      </div>

      <Deck />
    </main>
  );
}
