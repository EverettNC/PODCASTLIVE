import { createFileRoute } from "@tanstack/react-router";
import { liveSeatPresent, openCue, readCue } from "@/lib/seat/line.ts";

/** The address to Brandon. The floor POSTs it; the live seat GETs it, and GETting is how the seat shows it is in the chair. */
export const Route = createFileRoute("/api/brandon/cue")({
  server: {
    handlers: {
      GET: async () => Response.json(readCue()),
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as { text?: unknown };
        const text = typeof body.text === "string" ? body.text.trim() : "";
        if (!text) return Response.json({ ok: false, error: "empty cue" }, { status: 400 });
        return Response.json({ ok: true, cue: openCue(text), liveSeat: liveSeatPresent() });
      },
    },
  },
});
