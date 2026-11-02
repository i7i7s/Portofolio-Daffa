import Link from "next/link";
import { ContactSheet } from "@/components/contact-sheet";
import { Orbit } from "@/components/orbit";
import { allFrames, rollNumber, rolls, site } from "@/lib/catalog";

// Deal photos onto the ring one roll at a time so neighbours mix series.
const longest = Math.max(...rolls.map((r) => r.frames.length));
const dealt = Array.from({ length: longest }, (_, i) =>
  rolls.map((r) =>
    allFrames.find((f) => f.roll === r.id && f.slug === r.frames[i]?.slug),
  ),
)
  .flat()
  .filter((f) => f !== undefined);

export default function Home() {
  const frames = allFrames.length;
  const keeps = allFrames.filter((f) => f.mark === "keep").length;
  return (
    <main id="isi">
      <section className="hero">
        <p className="mono hero-edge">
          <span>Arsip foto · {site.name}</span>
          <span>
            {rolls.length} rol · {frames} frame · {keeps} dipilih
          </span>
        </p>
      </section>
      <Orbit frames={dealt} heading="h1">
        {site.title}
      </Orbit>
      <div className="hero-foot">
        <p className="intro">{site.intro}</p>
        <p className="mono hint">Klik atau ketuk foto untuk membukanya.</p>
      </div>
      <section id="rol" className="rolls" aria-labelledby="rol-t">
        <div className="rolls-head">
          <p className="mono">Lembar kontak</p>
          <h2 id="rol-t">Semua rol</h2>
          <ol className="roll-index">
            {rolls.map((r) => (
              <li key={r.id}>
                <Link href={`#${r.id}`}>
                  <span className="mono">ROL {rollNumber(r.id)}</span>
                  {r.title}
                  <span className="mono">
                    {r.place} · {r.year}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
        {rolls.map((r) => (
          <ContactSheet key={r.id} roll={r} number={rollNumber(r.id)} />
        ))}
      </section>
    </main>
  );
}
