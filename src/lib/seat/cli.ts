import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { parseArgs } from "node:util";
import { CUES, renderCueBook } from "./cuebook.ts";
import { modelReport, renderModelReport } from "./models.ts";
import { prerender } from "./prerender.ts";

const usage = `seat: cuebook [--out show/ep01.cuebook.txt] | models | prerender --cues id,id [--out show/renders/NAME.mp4]`;
const {
  positionals: [cmd],
  values,
} = parseArgs({ allowPositionals: true, options: { cues: { type: "string" }, out: { type: "string" } } });

switch (cmd) {
  case "cuebook": {
    const out = values.out ?? "show/ep01.cuebook.txt";
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, renderCueBook());
    console.log(`cue book written: ${out}, ${CUES.length} cues`);
    break;
  }
  case "models":
    console.log(renderModelReport(modelReport()));
    break;
  case "prerender": {
    const cues = (values.cues ?? "").split(",").filter(Boolean);
    if (!cues.length) {
      console.error(usage);
      process.exit(2);
    }
    const out = values.out ?? `show/renders/${cues.join("+")}.mp4`;
    const r = await prerender({ cueIds: cues, outPath: out });
    console.log(JSON.stringify(r, null, 2));
    break;
  }
  default:
    console.error(usage);
    process.exit(2);
}
