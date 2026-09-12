import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { decodePcm, ffmpegPath } from "./audio-node.ts";
import { CUES, DISCLAIMER_CUES } from "./cuebook.ts";
import { mouthFrames } from "./envelope.ts";
import { InterlockError, createShow, type ShowEvent } from "./interlock.ts";
import { modelReport } from "./models.ts";
import { prerender } from "./prerender.ts";
import { openShowLog, readShowLog } from "./showlog.ts";

const ROOT = join(import.meta.dirname, "..", "..", "..");
const brandonCues = CUES.filter((c) => c.owner === "BRANDON");
const refuses = (fn: () => void) => assert.throws(fn, InterlockError);

test("AC-1: ROLL refuses to start the clock with the disclaimer skipped or shortened", () => {
  const log: ShowEvent[] = [];
  const show = createShow((e) => log.push(e));
  show.roll();
  assert.equal(show.phase, "coldopen");
  assert.equal(show.clockMs(), null, "clock must not start on ROLL");

  // Every bypass attempt is refused and logged.
  refuses(() => show.advance());
  refuses(() => show.jumpTo("s1-e1"));
  refuses(() => show.roll());
  refuses(() => show.spoke("anything"));
  refuses(() => show.spoke("addressed during the disclaimer", true));
  show.complete("cold", 0, 0);
  refuses(() => show.complete("cold-e1", 20_000, 49_080)); // shortened
  refuses(() => show.complete("cold-p1", 5_000, 5_000)); // out of order
  assert.equal(show.phase, "coldopen");
  assert.equal(show.clockMs(), null);
  assert.equal(log.filter((e) => e.kind === "refused").length, 7);

  // Played to completion, in order: the clock starts on the last disclaimer cue.
  show.complete("cold-e1", 49_080, 49_080);
  show.complete("cold-p1", 5_000, 5_000);
  show.complete("cold-e2", 4_000, 4_000);
  assert.equal(show.phase, "rolling");
  assert.notEqual(show.clockMs(), null);
  assert.equal(show.current()?.owner, "TITLE");
  assert.deepEqual(show.completed(), DISCLAIMER_CUES.map((c) => c.id));
});

test("FR-4: Brandon speaks only when his cue is on program", () => {
  const show = createShow(() => {});
  refuses(() => show.spoke("hello")); // standby
  show.roll();
  for (const c of DISCLAIMER_CUES) show.complete(c.id, 1000, 1000);
  assert.equal(show.current()?.owner, "TITLE");
  refuses(() => show.spoke("hello")); // not his cue
  show.jumpTo(brandonCues[0].id);
  assert.ok(show.speakAllowed());
  show.spoke("a line");
  show.jumpTo("s1-e1"); // Everett's cue
  refuses(() => show.spoke("an interjection"));
  show.spoke("an answer to a direct address", true);
  show.kill();
  refuses(() => show.spoke("addressed, but killed", true));
});

test("AC-4: kill switch mutes and freezes immediately, pipeline survives", () => {
  const log: ShowEvent[] = [];
  const show = createShow((e) => log.push(e));
  show.roll();
  for (const c of DISCLAIMER_CUES) show.complete(c.id, 1000, 1000);
  show.jumpTo(brandonCues[0].id);
  assert.ok(show.speakAllowed());
  show.kill(); // mid-sentence: synchronous, so it takes effect before the next frame is drawn
  assert.equal(show.speakAllowed(), false);
  assert.ok(show.killed);
  refuses(() => show.spoke("still talking"));
  assert.equal(show.phase, "rolling", "phase untouched");
  assert.equal(show.current()?.id, brandonCues[0].id, "cue untouched");
  assert.notEqual(show.clockMs(), null, "clock untouched");
  show.release();
  assert.ok(show.speakAllowed());
  assert.deepEqual(log.filter((e) => e.kind === "kill" || e.kind === "release").map((e) => e.kind), ["kill", "release"]);
});

test("AC-6: a full run-through logs every cue and every Brandon line, append-only, on disk", () => {
  const dir = mkdtempSync(join(tmpdir(), "seat-"));
  const path = join(dir, "show", "ep01.showlog.jsonl");
  const show = createShow(openShowLog(path));
  show.roll();
  while (show.phase !== "done") {
    const c = show.current()!;
    if (c.owner === "BRANDON") show.spoke(c.text);
    show.complete(c.id, 1000, 1000);
  }
  const before = readShowLog(path);
  const fired = before.filter((e) => e.kind === "cue_fired").map((e) => e.cue);
  assert.deepEqual(fired, CUES.map((c) => c.id), "every cue fired, in order");
  const spoken = before.filter((e) => e.kind === "line_spoken").map((e) => e.text);
  assert.deepEqual(spoken, brandonCues.map((c) => c.text), "every Brandon line, verbatim");
  assert.ok(before.every((e) => !Number.isNaN(Date.parse(e.ts))), "every entry timestamped");

  createShow(openShowLog(path)).standby(); // a later session appends
  const after = readShowLog(path);
  assert.equal(after.length, before.length + 1);
  assert.deepEqual(after.slice(0, before.length), before, "earlier entries untouched");
});

test("stage 4->5: mouth frames come from the audio, not the text", () => {
  const pcm = decodePcm(join(ROOT, "public/audio/book/f1-b1.mp3"));
  const frames = mouthFrames(pcm, 16000, 30);
  assert.equal(frames.length, Math.floor(pcm.length / (16000 / 30)));
  assert.ok(frames.slice(0, 3).every((f) => f.open < 0.05), "silence before the line reads as rest");
  assert.ok(frames.filter((f) => f.open > 0.15).length > 100, "the line opens the mouth");
  assert.ok(new Set(frames.map((f) => f.viseme)).size >= 4, "several shapes, not one");
});

test("AC-8: with no Hugging Face token the report names what is missing and never fetches", () => {
  const saved = { HF_TOKEN: process.env.HF_TOKEN, HUGGING_FACE_HUB_TOKEN: process.env.HUGGING_FACE_HUB_TOKEN };
  delete process.env.HF_TOKEN;
  delete process.env.HUGGING_FACE_HUB_TOKEN;
  const fetchSaved = globalThis.fetch;
  globalThis.fetch = () => {
    throw new Error("network used");
  };
  try {
    const r = modelReport(ROOT);
    assert.equal(r.token, false);
    assert.ok(r.models.length >= 5);
    for (const m of r.models) assert.equal(typeof m.present, "boolean");
    assert.ok(r.models.some((m) => !m.present), "this box is missing at least one model and says so");
  } finally {
    globalThis.fetch = fetchSaved;
    Object.assign(process.env, saved);
  }
});

test("AC-5 + AC-7: a pre-rendered segment writes a playable file, disclaimer first, with no network", async () => {
  const dir = mkdtempSync(join(tmpdir(), "seat-"));
  const out = join(dir, "f1-b1.mp4");
  const fetchSaved = globalThis.fetch;
  globalThis.fetch = () => {
    throw new Error("network used");
  };
  try {
    const r = await prerender({ cueIds: ["f1-b1"], outPath: out, root: ROOT, width: 640, height: 360 });
    assert.ok(existsSync(out) && statSync(out).size > 100_000, "file on disk");
    assert.deepEqual(r.cues.slice(0, DISCLAIMER_CUES.length).map((c) => c.id), DISCLAIMER_CUES.map((c) => c.id));
    assert.equal(r.cues[DISCLAIMER_CUES.length].id, "f1-b1");
    assert.equal(r.cues[DISCLAIMER_CUES.length].startSec, r.disclaimerEndSec, "the segment starts only after the disclaimer ends");
    const probe = spawnSync(ffmpegPath(), ["-i", out], { encoding: "utf8" }).stderr;
    assert.match(probe, /Video: h264/);
    assert.match(probe, /Audio: aac/);
    const m = probe.match(/Duration: (\d+):(\d+):([\d.]+)/)!;
    const dur = Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
    assert.ok(Math.abs(dur - r.durationSec) < 0.5, `duration ${dur} vs ${r.durationSec}`);
  } finally {
    globalThis.fetch = fetchSaved;
  }
});
