import { Link } from "@tanstack/react-router";
import { Airplay, Mic, Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { audioEngine } from "@/lib/avatar/audio-engine";
import {
  postBrandonLine,
  runHostCue,
  speakText,
  stopSpeaking,
} from "@/lib/speak";
import { jumpTo } from "@/lib/seat/live.ts";
import { RUNDOWN, type Beat } from "@/lib/studio/show";
import { useStudio } from "@/lib/studio-store";
import { cn } from "@/lib/utils";
import { VOICES } from "@/lib/studio/voices";

export function Deck() {
  const voice = useStudio((s) => s.voice);
  const setVoice = useStudio((s) => s.setVoice);
  const volume = useStudio((s) => s.volume);
  const setVolume = useStudio((s) => s.setVolume);
  const lipGain = useStudio((s) => s.lipGain);
  const setLipGain = useStudio((s) => s.setLipGain);
  const captions = useStudio((s) => s.captions);
  const setCaptions = useStudio((s) => s.setCaptions);
  const onAir = useStudio((s) => s.onAir);
  const setOnAir = useStudio((s) => s.setOnAir);
  const status = useStudio((s) => s.status);
  const error = useStudio((s) => s.error);
  const shot = useStudio((s) => s.shot);
  const takeIntro = useStudio((s) => s.takeIntro);
  const takeShow = useStudio((s) => s.takeShow);
  const takeBlack = useStudio((s) => s.takeBlack);
  const live = onAir || status === "speaking" || status === "listening";

  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume]);

  return (
    <aside className="min-h-0 overflow-y-auto overscroll-contain border-t border-border">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-4 px-4 py-4 sm:px-8 sm:py-5 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
              Floor
            </p>
            <h2 className="mt-1 text-lg font-medium tracking-tight">Control</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-full bg-surface p-1 shadow-[var(--shadow-border)]">
              <button
                type="button"
                onClick={takeBlack}
                className={cn(
                  "h-10 rounded-full px-3 text-sm font-medium transition-colors duration-150 sm:px-4",
                  shot === "black" ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
                )}
              >
                Cold
              </button>
              <button
                type="button"
                onClick={takeIntro}
                className={cn(
                  "h-10 rounded-full px-3 text-sm font-medium transition-colors duration-150 sm:px-4",
                  shot === "cover" ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
                )}
              >
                Title
              </button>
              <button
                type="button"
                onClick={takeShow}
                className={cn(
                  "h-10 rounded-full px-3 text-sm font-medium transition-colors duration-150 sm:px-4",
                  shot === "two" || shot === "lead" || shot === "talent" || shot === "patty"
                    ? "bg-surface-2 text-fg"
                    : "text-muted hover:text-fg",
                )}
              >
                Standing
              </button>
            </div>
            <button
              type="button"
              onClick={() => setOnAir(!live)}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full px-4 text-[11px] font-medium uppercase tracking-[0.14em] transition-opacity duration-150",
                live
                  ? "bg-air text-fg"
                  : "bg-surface-2 text-muted shadow-[var(--shadow-border)]",
              )}
            >
              <span className={cn("size-1.5 rounded-full", live ? "bg-fg" : "bg-subtle")} />
              {live ? "On air" : "Standby"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,22rem)]">
          <div className="flex min-w-0 flex-col gap-4">
            <RundownPanel />
            <TalentPanel />
            <div className="grid gap-4 sm:grid-cols-2">
              <MicPanel />
              <CopyPanel />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {error && (
              <p className="text-sm text-air" role="alert">
                {error}
              </p>
            )}

            <label className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
                Voice
              </span>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="h-11 rounded-[var(--radius-md)] bg-surface px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} — {v.note}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
                Output
                <span className="tabular-nums text-muted">{Math.round(volume * 100)}</span>
              </span>
              <span className="flex items-center gap-2">
                <Volume2 className="size-4 text-subtle" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </span>
            </label>

            <label className="flex flex-col gap-2">
              <span className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
                Lip gain
                <span className="tabular-nums text-muted">{lipGain.toFixed(1)}</span>
              </span>
              <input
                type="range"
                min={0.4}
                max={2}
                step={0.05}
                value={lipGain}
                onChange={(e) => setLipGain(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </label>

            <div className="flex items-center justify-between gap-3">
              <label className="flex h-11 items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={captions}
                  onChange={(e) => setCaptions(e.target.checked)}
                  className="size-4 accent-accent"
                />
                Captions
              </label>
              <Button asChild variant="outline" size="sm">
                <Link to="/out">
                  <Airplay />
                  Program out
                </Link>
              </Button>
            </div>

            {status === "speaking" && (
              <Button variant="secondary" onClick={stopSpeaking}>
                <Square className="size-3.5 fill-current" />
                Stop take
              </Button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

function RundownPanel() {
  const beatId = useStudio((s) => s.beatId);
  const status = useStudio((s) => s.status);
  const beat = RUNDOWN.find((b) => b.id === beatId) ?? RUNDOWN[0];
  const busy = status === "thinking" || status === "speaking" || status === "listening";
  const idx = RUNDOWN.findIndex((b) => b.id === beat.id);

  function playLine() {
    if (beat.speaker !== "talent" || busy) return;
    void runHostCue(beat.text);
  }

  function next() {
    const n = RUNDOWN[idx + 1];
    if (n) jumpTo(n.id);
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {RUNDOWN.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => jumpTo(b.id)}
            className={cn(
              "h-8 shrink-0 rounded-full px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-150",
              b.id === beat.id
                ? "bg-surface-2 text-fg shadow-[var(--shadow-border)]"
                : "text-muted hover:text-fg",
            )}
          >
            {b.n} {b.label}
          </button>
        ))}
      </div>
      <div className="max-h-40 overflow-y-auto rounded-[var(--radius-lg)] bg-surface px-4 py-3 shadow-[var(--shadow-border)] sm:max-h-48">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
          {speakerLabel(beat)}
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-fg">
          {beat.text}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {beat.speaker === "talent" && (
          <Button className="flex-1" disabled={busy} onClick={playLine}>
            {status === "thinking" ? "Formulating…" : "Cue Brandon"}
          </Button>
        )}
        {beat.speaker === "everett" && (
          <Button className="flex-1" variant="secondary" onClick={() => useStudio.getState().setDrive("mic")}>
            Arm Everett
          </Button>
        )}
        {beat.speaker === "patty" && (
          <p className="flex-1 self-center text-sm text-muted">
            Patty — live. She's in the room.
          </p>
        )}
        {beat.speaker === "black" && (
          <Button className="flex-1" onClick={() => useStudio.getState().takeBlack()}>
            Over black
          </Button>
        )}
        {beat.speaker === "card" && (
          <Button className="flex-1" onClick={() => useStudio.getState().takeIntro()}>
            Roll title
          </Button>
        )}
        {beat.speaker === "show" && (
          <Button className="flex-1" onClick={() => useStudio.getState().takeShow()}>
            Take standing
          </Button>
        )}
        <Button variant="ghost" disabled={!RUNDOWN[idx + 1]} onClick={next}>
          Next
        </Button>
      </div>
    </div>
  );
}

function speakerLabel(beat: Beat) {
  if (beat.speaker === "everett") return "Everett";
  if (beat.speaker === "patty") return "Patty";
  if (beat.speaker === "talent") return "Brandon";
  if (beat.speaker === "card") return "Title card";
  if (beat.speaker === "show") return "Standing";
  return "Over black";
}

function TalentPanel() {
  const cue = useStudio((s) => s.cue);
  const setCue = useStudio((s) => s.setCue);
  const status = useStudio((s) => s.status);
  const log = useStudio((s) => s.log);
  const scroller = useRef<HTMLDivElement>(null);
  const busy = status === "thinking" || status === "speaking" || status === "listening";

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <div
        ref={scroller}
        className="max-h-28 overflow-y-auto rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:max-h-40"
      >
        <ul className="flex flex-col gap-3">
          {log.map((row) => (
            <li key={row.id} className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
                {row.role === "producer"
                  ? "Cue"
                  : row.role === "talent"
                    ? "Brandon"
                    : "Floor"}
              </span>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  row.role === "system" ? "text-muted" : "text-fg",
                )}
              >
                {row.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const line = cue.trim();
          if (!line || busy) return;
          setCue("");
          void runHostCue(line);
        }}
      >
        <textarea
          value={cue}
          onChange={(e) => setCue(e.target.value)}
          placeholder="Cue Brandon — a question, a toss, a note."
          rows={3}
          className="w-full resize-none rounded-[var(--radius-md)] bg-surface px-3 py-2.5 text-sm text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-accent/40"
        />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={busy}>
            {status === "thinking" ? "Formulating…" : "Send cue"}
          </Button>
          <HoldToTalk disabled={busy} />
        </div>
      </form>
      <LineIn />
    </div>
  );
}

/** Brandon's line-in: paste what the live seat said, and he says it. Same door the seat posts to. */
function LineIn() {
  const [text, setText] = useState("");
  const status = useStudio((s) => s.status);
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const t = text;
        setText("");
        void postBrandonLine(t);
      }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Brandon's line — paste what the live seat said."
        rows={2}
        className="w-full resize-none rounded-[var(--radius-md)] bg-surface px-3 py-2.5 text-sm text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-accent/40"
      />
      <Button type="submit" variant="secondary" disabled={status === "speaking" || !text.trim()}>
        Brandon says
      </Button>
    </form>
  );
}

function CopyPanel() {
  const copy = useStudio((s) => s.copy);
  const setCopy = useStudio((s) => s.setCopy);
  const status = useStudio((s) => s.status);
  const busy = status === "speaking" || status === "thinking";

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={copy}
        onChange={(e) => setCopy(e.target.value)}
        rows={6}
        className="w-full resize-y rounded-[var(--radius-lg)] bg-surface px-4 py-3 text-sm leading-relaxed text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-accent/40"
      />
      <Button disabled={busy || !copy.trim()} onClick={() => void speakText(copy)}>
        Read on air
      </Button>
    </div>
  );
}

function MicPanel() {
  const [armed, setArmed] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function toggle() {
    setErr(null);
    if (armed) {
      audioEngine.stopMic();
      setArmed(false);
      useStudio.getState().setStatus("idle");
      return;
    }
    try {
      await audioEngine.startMic();
      setArmed(true);
      useStudio.getState().setOnAir(true);
      useStudio.getState().setStatus("listening");
    } catch {
      setErr("Microphone is blocked. Allow access, then arm again.");
    }
  }

  useEffect(() => () => audioEngine.stopMic(), []);

  return (
    <div className="flex flex-col gap-3">
      <Button variant={armed ? "air" : "primary"} onClick={() => void toggle()}>
        <Mic />
        {armed ? "Mic live — tap to cut" : "Arm mic"}
      </Button>
      {err && <p className="text-sm text-air">{err}</p>}
    </div>
  );
}

/** Hold: the mic records a tape. Release: the tape goes to THE FILAMENT's ear, and the words go to Brandon. */
function HoldToTalk({ disabled }: { disabled: boolean }) {
  const recRef = useRef<MediaRecorder | null>(null);
  const [held, setHeld] = useState(false);
  const [ear, setEar] = useState<{ ready: boolean; detail: string } | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/stt")
      .then((r) => r.json() as Promise<{ ready: boolean; detail: string }>)
      .then((s) => {
        if (!alive) return;
        setEar(s);
        useStudio.getState().pushLog("system", s.ready ? `Ear: ${s.detail}.` : `Hold-to-talk is off. ${s.detail}`);
      })
      .catch((err: unknown) => alive && setEar({ ready: false, detail: err instanceof Error ? err.message : String(err) }));
    return () => {
      alive = false;
    };
  }, []);

  async function deliver(tape: Blob) {
    const store = useStudio.getState();
    store.setStatus("idle");
    if (tape.size < 64) return;
    try {
      const res = await fetch("/api/stt", { method: "POST", headers: { "Content-Type": tape.type || "application/octet-stream" }, body: tape });
      const heard = (await res.json()) as { ok: boolean; text?: string; note?: string; detail?: string };
      if (!heard.ok) return store.setError(`Ear: ${heard.detail}`);
      if (!heard.text) return store.pushLog("system", heard.note ?? "Empty ear stays empty. No invented speech.");
      void runHostCue(heard.text);
    } catch (err) {
      store.setError(`Ear: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  async function start() {
    if (disabled || held) return;
    const store = useStudio.getState();
    const ownsMic = !audioEngine.micStream;
    try {
      const stream = ownsMic ? await audioEngine.startMic() : audioEngine.micStream!;
      const rec = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      rec.onstop = () => {
        if (ownsMic) audioEngine.stopMic();
        void deliver(new Blob(chunks, { type: rec.mimeType }));
      };
      rec.start();
      recRef.current = rec;
      setHeld(true);
      store.setStatus("listening");
    } catch (err) {
      store.setError(`Mic: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  function stop() {
    if (recRef.current?.state === "recording") recRef.current.stop();
    recRef.current = null;
    setHeld(false);
  }

  if (!ear?.ready) {
    return (
      <Button type="button" variant="outline" disabled title={ear?.detail ?? "Checking the ear"}>
        <Mic />
        Hold
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={held ? "air" : "secondary"}
      disabled={disabled}
      onMouseDown={start}
      onMouseUp={stop}
      onMouseLeave={stop}
      onTouchStart={(e) => {
        e.preventDefault();
        start();
      }}
      onTouchEnd={stop}
    >
      <Mic />
      {held ? "Listening" : "Hold"}
    </Button>
  );
}
