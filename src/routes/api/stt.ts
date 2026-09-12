import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/stt")({
  server: {
    handlers: {
      POST: async () => {
        return Response.json(
          { error: "Listen is the mill. No paid key in this app." },
          { status: 503 },
        );
      },
    },
  },
});
