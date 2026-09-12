import type { ErrorComponentProps } from "@tanstack/react-router";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  const message =
    error instanceof Error && error.message
      ? error.message
      : "The floor stumbled. We're still here.";
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg px-6 text-center text-fg">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-air">
        Recoverable
      </p>
      <h1 className="text-lg font-medium tracking-tight">The picture stumbled</h1>
      <p className="max-w-md text-sm leading-relaxed text-muted">{message}</p>
      <button
        type="button"
        onClick={() => {
          try {
            window.location.assign("/");
          } catch {
            window.location.reload();
          }
        }}
        className="h-12 rounded-full bg-air px-6 text-sm font-medium text-fg"
      >
        Back to the floor
      </button>
    </main>
  );
}
