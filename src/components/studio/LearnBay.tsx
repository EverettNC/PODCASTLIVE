import { Button } from "@/components/ui/button";
import { LEAD_RIG, TALENT_RIG } from "@/lib/avatar/landmarks";
import { DRIVES, FOUR_PIECES, SAMPLE_CUE } from "@/lib/studio/guide";
import { leadStillSrc, talentStillSrc, useStudio } from "@/lib/studio-store";

export function LearnBay() {
  const setBay = useStudio((s) => s.setBay);
  const setDrive = useStudio((s) => s.setDrive);
  const setCue = useStudio((s) => s.setCue);
  const setShot = useStudio((s) => s.setShot);
  const lookId = useStudio((s) => s.lookId);
  const talentUrl = useStudio((s) => s.talentUrl);
  const leadUrl = useStudio((s) => s.leadUrl);
  const talentSrc = talentStillSrc({ lookId, talentUrl });
  const leadSrc = leadStillSrc({ leadUrl });

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
        <header className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
            How it works
          </p>
          <h1 className="mt-4 font-display text-4xl tracking-tight text-fg sm:text-5xl md:text-6xl">
            A live talking head is four pieces. None of them are locked.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Everett is the lead host. Patty sits center. Brandon sits camera
            right — he's a rendering. He speaks when you cue him. Open the floor
            and try it — no account, no key to paste, no waiting on permission.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                setShot("two");
                setDrive("talent");
                setCue(SAMPLE_CUE);
                setBay("floor");
              }}
            >
              Open the floor
            </Button>
            <Button variant="secondary" onClick={() => setBay("cover")}>
              See the cover
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 overflow-hidden rounded-[var(--radius-xl)] sm:gap-4">
          <figure className="relative overflow-hidden rounded-[var(--radius-lg)] bg-surface">
            <img
              src={leadSrc}
              alt=""
              className="aspect-[4/5] w-full object-cover object-[50%_12%] sm:aspect-[5/4]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/70 to-transparent px-4 pb-4 pt-10">
              <p className="text-sm font-medium text-fg">{LEAD_RIG.name}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                {LEAD_RIG.role} · camera left
              </p>
            </figcaption>
          </figure>
          <figure className="relative overflow-hidden rounded-[var(--radius-lg)] bg-surface">
            <img
              src={talentSrc}
              alt=""
              className="aspect-[4/5] w-full object-cover object-[50%_18%] sm:aspect-[5/4]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/70 to-transparent px-4 pb-4 pt-10">
              <p className="text-sm font-medium text-fg">{TALENT_RIG.name}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                {TALENT_RIG.role} · camera right
              </p>
            </figcaption>
          </figure>
        </section>

        <section className="flex flex-col gap-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
              The live path
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight">Four things</h2>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
              Depends which of the two you’re building. For live — mouth moving
              while someone talks on air — you need all four. Pre-rendered
              segments need less: script, generate the audio, run it through an
              image-to-video tool, drop the clip on a timeline. This studio is
              the live one.
            </p>
          </div>
          <ol className="grid gap-8 sm:grid-cols-2">
            {FOUR_PIECES.map((piece) => (
              <li key={piece.id} className="flex flex-col gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
                  {piece.num}
                </p>
                <h3 className="text-xl font-medium tracking-tight">{piece.title}</h3>
                <p className="text-base leading-relaxed text-muted">{piece.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
              On the floor
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight">Three drives</h2>
          </div>
          <ul className="grid gap-6 sm:grid-cols-3">
            {DRIVES.map((d) => (
              <li
                key={d.id}
                className="flex flex-col gap-3 rounded-[var(--radius-xl)] bg-surface px-5 py-6 shadow-[var(--shadow-border)]"
              >
                <h3 className="text-lg font-medium tracking-tight">{d.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{d.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-6 border-t border-border pt-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
            Also open
          </p>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium tracking-tight">Build</h3>
              <p className="mt-2 text-base leading-relaxed text-muted">
                Two plates: intro backdrop for the open, show backdrop for the
                set. Drop your own. Roll intro, then take the show — it cuts.
                Wardrobe and stills sit on top of those plates.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium tracking-tight">Cover</h3>
              <p className="mt-2 text-base leading-relaxed text-muted">
                The intro. Christman lead, co-host right, sitting on the intro
                plate. Roll it, then take the show.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-[var(--radius-xl)] bg-surface px-6 py-8 shadow-[var(--shadow-border)] sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
            Try it
          </p>
          <p className="max-w-2xl text-lg leading-relaxed text-fg">
            Cue the co-host: “{SAMPLE_CUE}” Watch program. Then arm the mic and
            take the floor yourself.
          </p>
          <Button
            onClick={() => {
              setShot("two");
              setDrive("talent");
              setCue(SAMPLE_CUE);
              setBay("floor");
            }}
          >
            Take that cue to the floor
          </Button>
        </section>
      </div>
    </div>
  );
}
