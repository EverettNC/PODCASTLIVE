import { createFileRoute } from "@tanstack/react-router";
import { normalizeMillUrl } from "@/lib/studio/mill";

export const Route = createFileRoute("/api/mill")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: { millUrl?: unknown };
        try {
          payload = (await request.json()) as { millUrl?: unknown };
        } catch {
          return Response.json({ ok: false, error: "bad-request" }, { status: 400 });
        }
        const millUrl = normalizeMillUrl(
          typeof payload.millUrl === "string" ? payload.millUrl : "",
        );
        if (!millUrl) {
          return Response.json({ ok: false, engine: "none" });
        }
        try {
          const res = await fetch(`${millUrl}/status`, {
            signal: AbortSignal.timeout(4000),
          });
          if (!res.ok) {
            return Response.json({ ok: false, engine: "none" });
          }
          const data = (await res.json().catch(() => ({}))) as {
            engine?: unknown;
            status?: unknown;
          };
          const engine =
            typeof data.engine === "string"
              ? data.engine
              : typeof data.status === "string"
                ? data.status
                : "christman_mill";
          return Response.json({ ok: true, engine });
        } catch {
          return Response.json({ ok: false, engine: "none" });
        }
      },
    },
  },
});
