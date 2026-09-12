import { Button } from "@/components/ui/button";
import { introBackdropSrc, useStudio } from "@/lib/studio-store";
import { SHOW } from "@/lib/studio/show";
import { cn } from "@/lib/utils";

export function CoverStage({
  className,
  clean = false,
}: {
  className?: string;
  clean?: boolean;
}) {
  const introUrl = useStudio((s) => s.introUrl);
  const introSrc = introBackdropSrc({ introUrl });

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-bg",
        clean ? "h-full w-full" : "h-full min-h-64 w-full rounded-[var(--radius-xl)]",
        className,
      )}
    >
      <img
        key={introSrc}
        src={introSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!clean && (
        <span className="pointer-events-none absolute left-5 top-5 font-mono text-[11px] uppercase tracking-[0.16em] text-fg/70 sm:left-7 sm:top-7">
          Title card
        </span>
      )}
    </div>
  );
}

export function CoverBay() {
  const takeIntro = useStudio((s) => s.takeIntro);
  const takeShow = useStudio((s) => s.takeShow);
  const takeBlack = useStudio((s) => s.takeBlack);
  const setBay = useStudio((s) => s.setBay);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <CoverStage clean className="min-h-0 flex-1" />
      <div className="flex flex-col gap-4 border-t border-border px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-6">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
            {SHOW.episodeNum}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Hold 4–5 seconds. Then take the standing set. Cold open is over
            black, before this.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={takeBlack}>
            Cold open
          </Button>
          <Button onClick={takeIntro}>Roll title</Button>
          <Button variant="secondary" onClick={takeShow}>
            Take show
          </Button>
          <Button variant="ghost" onClick={() => setBay("build")}>
            Build
          </Button>
        </div>
      </div>
    </div>
  );
}
