"""The show's voice server, over the Christman Voice SDK. Local only. No hosted TTS. No key.

The show posts {text, being, reference_audio_path?, emotion_params?} to /generate and
gets back a WAV plus phoneme-timed viseme frames at 30 fps. The SDK does the work;
it lives in vendor/Christman-Sound (git submodule) or wherever $CHRISTMAN_SOUND points,
and nothing in it is modified.

Run:  npm run voice        (python3 voice/server.py)
Env:  CHRISTMAN_SOUND (SDK checkout), VOICE_PORT (default 1930), CHRISTMAN_OUTPUT_DIR.

Degrades loudly: /status lists exactly which modules and voices are missing, and
/generate refuses with the same list instead of returning silence.
"""

from __future__ import annotations

import importlib.util
import json
import os
import shutil
import sys
import uuid
import wave
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SDK = Path(os.environ.get("CHRISTMAN_SOUND") or ROOT / "vendor" / "Christman-Sound")
# pygame is on the list because the SDK's synthesis module imports it at load time.
REQUIRED = ("torch", "TTS", "soundfile", "pygame")
BEINGS = ("everett", "patty", "brandon")
OUT = Path(os.environ.get("CHRISTMAN_OUTPUT_DIR", "/tmp/christman_sdk")) / "takes"


def sdk_present() -> bool:
    return (SDK / "christman_voice_sdk" / "__init__.py").is_file()


def missing_modules() -> list[str]:
    return [m for m in REQUIRED if importlib.util.find_spec(m) is None]


def reference_for(being: str) -> dict:
    """Where this being's voice comes from, or why it cannot be found. The show's own voices/ first, then the SDK's search."""
    own = ROOT / "voices" / f"{being}.wav"
    if own.is_file():
        return {"path": str(own), "error": None}
    try:
        from CHRISTMAN_EAR_CANAL.VOICES import resolve_being_reference
    except Exception as exc:  # the resolver itself is broken: say so, do not guess a path
        return {"path": None, "error": f"{type(exc).__name__}: {exc}"}
    path = resolve_being_reference(being)
    return {"path": str(path) if path else None, "error": None if path else "no reference WAV found"}


def status() -> dict:
    missing = missing_modules()
    return {
        "ok": sdk_present() and not missing,
        "engine": "xtts_v2",
        "sdk": str(SDK),
        "sdk_present": sdk_present(),
        "degraded": not sdk_present() or bool(missing),
        "missing": missing,
        "mfa": shutil.which("mfa") is not None,
        "beings": {b: reference_for(b) for b in BEINGS} if sdk_present() else {},
    }


def generate(body: dict) -> tuple[int, dict]:
    text = str(body.get("text") or "").strip()
    being = str(body.get("being") or "brandon").strip().lower()
    if not text:
        return 400, {"error": "empty text", "stage": "tts"}
    if not sdk_present():
        return 503, {"error": "sdk-missing", "stage": "tts", "sdk": str(SDK), "fix": "git submodule update --init"}
    missing = missing_modules()
    if missing:
        return 503, {"error": "degraded", "stage": "tts", "missing": missing}
    ref = body.get("reference_audio_path") or reference_for(being)["path"]
    if not ref:
        return 503, {"error": "no-reference", "stage": "tts", "being": being}

    from christman_voice_sdk.synthesis.voice_synthesis import synthesize_speech

    wav = synthesize_speech(text, body.get("emotion_params") or {}, str(ref))
    if not wav or not Path(wav).is_file():
        return 503, {"error": "synthesis returned no audio", "stage": "tts", "being": being}

    OUT.mkdir(parents=True, exist_ok=True)
    take = uuid.uuid4().hex
    dst = OUT / f"{take}.wav"
    shutil.move(str(wav), dst)
    with wave.open(str(dst), "rb") as w:
        duration = w.getnframes() / w.getframerate()

    from christman_voice_sdk.synthesis.phoneme_labeler import PhonemeLabeler

    labeler = PhonemeLabeler()
    phonemes = labeler.label_audio(dst, text)
    frames = labeler.phonemes_to_visemes(phonemes, fps=30)
    (OUT / f"{take}.lipsync.json").write_text(json.dumps(frames))
    return 200, {
        "audio_url": f"/take/{take}.wav",
        "lipsync_url": f"/take/{take}.lipsync.json",
        "duration": duration,
        "being": being,
        "reference": str(ref),
        "phoneme_source": "mfa" if labeler.mfa_available else "energy",
    }


class Handler(BaseHTTPRequestHandler):
    def _json(self, code: int, obj: dict) -> None:
        data = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/status":
            self._json(200, status())
            return
        if self.path.startswith("/take/"):
            name = Path(self.path[len("/take/"):]).name
            f = OUT / name
            if not f.is_file():
                self._json(404, {"error": "no such take", "take": name})
                return
            data = f.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "audio/wav" if name.endswith(".wav") else "application/json")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        self._json(404, {"error": "not found", "routes": ["/status", "/generate", "/take/<name>"]})

    def do_POST(self) -> None:  # noqa: N802
        if self.path not in ("/generate", "/speak"):
            self._json(404, {"error": "not found"})
            return
        try:
            n = int(self.headers.get("Content-Length") or 0)
            body = json.loads(self.rfile.read(n) or b"{}")
        except (ValueError, json.JSONDecodeError) as exc:
            self._json(400, {"error": f"bad json: {exc}"})
            return
        try:
            code, obj = generate(body)
        except Exception as exc:  # loud: the caller sees the real failure
            code, obj = 500, {"error": f"{type(exc).__name__}: {exc}", "stage": "tts"}
        self._json(code, obj)

    def log_message(self, fmt: str, *args) -> None:
        print(f"[voice] {fmt % args}")


def main() -> None:
    if sdk_present():
        sys.path.insert(0, str(SDK))
    else:
        print(f"[voice] Christman-Sound not found at {SDK}. Run: git submodule update --init", file=sys.stderr)
    port = int(os.environ.get("VOICE_PORT", "1930"))
    print(f"[voice] status: {json.dumps(status())}")
    print(f"[voice] listening on http://127.0.0.1:{port}")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()


if __name__ == "__main__":
    main()
