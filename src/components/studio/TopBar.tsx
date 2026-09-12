import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SHOW } from "@/lib/studio/show";
import { useStudio, type Bay } from "@/lib/studio-store";
import { cn } from "@/lib/utils";

const BAYS: { id: Bay; label: string }[] = [
  { id: "floor", label: "Dashboard" },
  { id: "build", label: "Build" },
  { id: "cover", label: "Cover" },
  { id: "learn", label: "Learn" },
];

export function TopBar() {
  const [clock, setClock] = useState("00:00:00");
  const onAir = useStudio((s) => s.onAir);
  const status = useStudio((s) => s.status);
  const bay = useStudio((s) => s.bay);
  const setBay = useStudio((s) => s.setBay);
  const rolledAt = useStudio((s) => s.rolledAt);
  const live = onAir || status === "speaking";

  useEffect(() => {
    const tick = () => {
      if (!rolledAt) {
        setClock("00:00:00");
        return;
      }
      const s = Math.max(0, Math.floor((Date.now() - rolledAt) / 1000));
      const hh = String(Math.floor(s / 3600)).padStart(2, "0");
      const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      setClock(`${hh}:${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [rolledAt]);

  return (
    <header className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:h-20 sm:px-8 lg:px-10">
      <Link to="/" className="flex items-baseline gap-3 text-fg no-underline">
        <span className="font-display text-2xl tracking-tight sm:text-3xl">
          {SHOW.title}
        </span>
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-subtle sm:inline">
          {SHOW.episodeNum}
        </span>
      </Link>
      <nav className="flex rounded-full bg-surface p-1 shadow-[var(--shadow-border)]">
        {BAYS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setBay(b.id)}
            className={cn(
              "h-9 rounded-full px-3 text-sm font-medium transition-colors duration-150 sm:px-4",
              bay === b.id ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
            )}
          >
            {b.label}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-4 sm:gap-5">
        <span className="hidden font-mono text-sm tabular-nums text-muted sm:inline">
          {clock}
        </span>
        <span
          className={
            live
              ? "font-mono text-[11px] uppercase tracking-[0.16em] text-air"
              : "font-mono text-[11px] uppercase tracking-[0.16em] text-subtle"
          }
        >
          {live ? "Live" : "Standby"}
        </span>
      </div>
    </header>
  );
}
