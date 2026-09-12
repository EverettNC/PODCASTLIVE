import { createFileRoute } from "@tanstack/react-router";
import { maskKeys, readKeys, writeKey } from "@/lib/seat/keys.ts";

const LOOPBACK = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** The key drop. GET shows which keys exist, masked. POST sets one, from this machine only. */
export const Route = createFileRoute("/api/keys")({
  server: {
    handlers: {
      GET: async () => Response.json(maskKeys(readKeys())),
      POST: async ({ request }) => {
        if (!LOOPBACK.has(new URL(request.url).hostname)) {
          return Response.json({ error: "keys are dropped from the studio machine only" }, { status: 403 });
        }
        const body = (await request.json().catch(() => ({}))) as { name?: unknown; value?: unknown };
        if (typeof body.name !== "string" || typeof body.value !== "string") {
          return Response.json({ error: "name and value" }, { status: 400 });
        }
        try {
          return Response.json(maskKeys(writeKey(body.name, body.value)));
        } catch (err) {
          return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 400 });
        }
      },
    },
  },
});
