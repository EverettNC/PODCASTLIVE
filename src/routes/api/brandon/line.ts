import { createFileRoute } from "@tanstack/react-router";
import { liveSeatPresent, postLine, takeLine } from "@/lib/seat/line.ts";

/** Brandon's line. The live seat POSTs its answer to the open address; the floor GETs it once and speaks it. */
export const Route = createFileRoute("/api/brandon/line")({
  server: {
    handlers: {
      GET: async () => Response.json({ line: takeLine(), liveSeat: liveSeatPresent() }),
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as { text?: unknown };
        const r = postLine(typeof body.text === "string" ? body.text : "");
        return Response.json(r, { status: r.ok ? 200 : 409 });
      },
    },
  },
});
