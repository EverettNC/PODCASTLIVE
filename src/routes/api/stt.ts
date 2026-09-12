import { createFileRoute } from "@tanstack/react-router";
import { earStatus, hear } from "@/lib/seat/ear.ts";

/** The floor's ear: GET is the seat check, POST carries one tape to THE FILAMENT. No cloud, no key. */
export const Route = createFileRoute("/api/stt")({
  server: {
    handlers: {
      GET: async () => Response.json(await earStatus()),
      POST: async ({ request }) => {
        const tape = await request.blob();
        if (tape.size < 64) return Response.json({ ok: false, error: "bad-tape", detail: "no tape reached the ear" }, { status: 400 });
        const heard = await hear(tape);
        return Response.json(heard, { status: heard.ok ? 200 : 503 });
      },
    },
  },
});
