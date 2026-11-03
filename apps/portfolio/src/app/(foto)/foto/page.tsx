import { ContactSheet } from "@/components/foto/contact-sheet";
import { HomeFx } from "@/components/foto/home-fx";
import { Orbit } from "@/components/foto/orbit";
import { RollIndex, type RollItem } from "@/components/foto/roll-index";
import {
  allFrames,
  exifLine,
  rollNumber,
  rolls,
  site,
} from "@/lib/foto/catalog";

// Deal photos onto the ring one roll at a time so neighbours mix series.
const longest = Math.max(...rolls.map((r) => r.frames.length));
const dealt = Array.from({ length: longest }, (_, i) =>
  rolls.map((r) =>
    allFrames.find((f) => f.roll === r.id && f.slug === r.frames[i]?.slug),
  ),
)
  .flat()
  .filter((f) => f !== undefined);

// What rolls past on the film band: stock, place and a real exposure per roll.
const bandItems = rolls.flatMap((r) => [
  r.stock,
  `${r.place} ${r.year}`,
  exifLine(r.frames[0].exif).slice(0, 3).join(" · "),
]);

const rollItems: RollItem[] = rolls.map((r) => {
  const cover = r.frames.find((f) => f.mark === "keep") ?? r.frames[0];
  return {
    id: r.id,
    number: rollNumber(r.id),
    title: r.title,
    place: r.place,
    year: r.year,
    cover: { src: cover.src, blur: cover.blur },
  };
});

export default function Home() {
  const frames = allFrames.length;
  const keeps = allFrames.filter((f) => f.mark === "keep").length;
  return (
    <main id="isi">
      <section className="hero">
        <p className="mono hero-edge">
          <span className="hero-hint">
            Seret foto untuk memutar
            <span className="orbit-hover-hint">
              , arahkan kursor untuk membesarkan
            </span>
          </span>
          <span>
            <b data-count={rolls.length}>{rolls.length}</b> rol ·{" "}
            <b data-count={frames}>{frames}</b> frame ·{" "}
            <b data-count={keeps}>{keeps}</b> pilihan
          </span>
        </p>
      </section>
      <Orbit frames={dealt} heading="h1">
        {site.title}
      </Orbit>
      <div className="hero-foot">
        <p className="intro">{site.intro}</p>
        <div className="hero-actions">
          <a className="to-rolls" href="#rol">
            Lihat semua rol ↓
          </a>
          <p className="mono hint">Klik atau ketuk foto untuk membukanya.</p>
        </div>
      </div>
      <div className="band" aria-hidden="true">
        <div className="band-track">
          {[0, 1].map((half) => (
            <div className="band-half" key={half}>
              {[0, 1].flatMap((rep) =>
                bandItems.map((text, i) => (
                  <span className="mono" key={`${rep}-${i}`}>
                    ▸ {text}
                  </span>
                )),
              )}
            </div>
          ))}
        </div>
      </div>
      <section id="rol" className="rolls" aria-labelledby="rol-t">
        <div className="rolls-head">
          <p className="mono">Lembar kontak</p>
          <h2 id="rol-t">Semua rol</h2>
          <RollIndex rolls={rollItems} />
        </div>
        {rolls.map((r) => (
          <ContactSheet key={r.id} roll={r} number={rollNumber(r.id)} />
        ))}
      </section>
      <HomeFx frames={frames} />
    </main>
  );
}
