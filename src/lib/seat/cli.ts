import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { CUES, renderCueBook } from "./cuebook.ts";
import { modelReport, renderModelReport } from "./models.ts";
import { prerender } from "./prerender.ts";

const [cmd, ...rest] = process.argv.slice(2);
const arg = (k: string) => {
  const i = rest.indexOf(`--${k}`);
  return i >= 0 ? rest[i + 1] : undefined;
};
const usage = `seat: cuebook [--out show/ep01.cuebook.txt] | models | prerender --cues id,id [--out show/renders/NAME.mp4]`;

switch (cmd) {
  case "cuebook": {
    const out = arg("out") ?? "show/ep01.cuebook.txt";
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, renderCueBook());
    console.log(`cue book written: ${out}, ${CUES.length} cues`);
    break;
  }
  case "models":
    console.log(renderModelReport(modelReport()));
    break;
  case "prerender": {
    const cues = (arg("cues") ?? "").split(",").filter(Boolean);
    if (!cues.length) {
      console.error(usage);
      process.exit(2);
    }
    const out = arg("out") ?? `show/renders/${cues.join("+")}.mp4`;
    const r = await prerender({ cueIds: cues, outPath: out });
    console.log(JSON.stringify(r, null, 2));
    break;
  }
  default:
    console.error(usage);
    process.exit(2);
}
