import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProgramMonitor } from "@/components/studio/AvatarStage";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/studio-store";
import { speakText, stopSpeaking } from "@/lib/speak";

export const Route = createFileRoute("/out")({ component: ProgramOut });

function ProgramOut() {
  const [chrome, setChrome] = useState(true);
  const copy = useStudio((s) => s.copy);
  const status = useStudio((s) => s.status);
  const setCaptions = useStudio((s) => s.setCaptions);

  useEffect(() => {
    setCaptions(false);
  }, [setCaptions]);

  return (
    <div
      className="relative h-dvh w-full bg-bg"
      onPointerMove={() => setChrome(true)}
    >
      <ProgramMonitor clean />
      <div
        className="absolute inset-x-0 top-0 flex items-start justify-between p-5 transition-opacity duration-200 sm:p-6"
        style={{ opacity: chrome ? 1 : 0 }}
      >
        <Link
          to="/"
          className="rounded-full bg-bg/70 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted no-underline"
        >
          Filament · Program
        </Link>
        <div className="flex gap-2">
          {status === "speaking" ? (
            <Button size="sm" variant="secondary" onClick={stopSpeaking}>
              Cut
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => void speakText(copy)}
            >
              Read copy
            </Button>
          )}
        </div>
      </div>
      <p className="pointer-events-none absolute inset-x-0 bottom-5 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
        Share this view, or add it as a browser source
      </p>
    </div>
  );
}
