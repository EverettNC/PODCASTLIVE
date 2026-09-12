import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { BuildBay } from "@/components/studio/BuildBay";
import { DashboardBay } from "@/components/studio/DashboardBay";
import { StudioBoundary } from "@/components/studio/StudioBoundary";
import { TopBar } from "@/components/studio/TopBar";
import { hydrateStudio, useStudio } from "@/lib/studio-store";
import { getAiStatus } from "@/lib/seat/brain-rpc.ts";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const setAiReady = useStudio((s) => s.setAiReady);
  const bay = useStudio((s) => s.bay);

  useEffect(() => {
    hydrateStudio();
    void getAiStatus()
      .then((s) => {
        setAiReady(s.ready);
        useStudio.getState().pushLog("system", s.ready ? `Brandon's model: ${s.detail}.` : `Brandon cannot answer live. ${s.detail}`);
      })
      .catch((err: unknown) => {
        setAiReady(false);
        useStudio.getState().pushLog("system", `Brandon's model check failed: ${err instanceof Error ? err.message : String(err)}`);
      });
    const onErr = () => useStudio.getState().setError("A take failed. The floor is still up.");
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onErr);
    return () => {
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onErr);
    };
  }, [setAiReady]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg">
      <TopBar />
      <StudioBoundary>
        {bay === "build" ? <BuildBay /> : <DashboardBay />}
      </StudioBoundary>
    </div>
  );
}
