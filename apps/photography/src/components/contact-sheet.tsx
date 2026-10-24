import { ViewTransition } from "react";
import Link from "next/link";
import { edgeNumber, frameHref, type Frame, type Roll } from "@/lib/catalog";
import { DevelopImage } from "./develop-image";

const PER_STRIP = 6;

function Mark({ kind }: { kind: Frame["mark"] }) {
  return (
    <svg className="grease" viewBox="0 0 100 70" aria-hidden="true">
      {kind === "reject" ? (
        <path d="M14 10 L86 62 M84 8 L18 64" />
      ) : (
        <ellipse
          cx="50"
          cy="35"
          rx="47"
          ry="32"
          pathLength={1}
          transform="rotate(-3 50 35)"
        />
      )}
    </svg>
  );
}

const markLabel = { keep: " (dipilih)", reject: " (dicoret)" };

export function ContactSheet({ roll, number }: { roll: Roll; number: string }) {
  const strips = Array.from(
    { length: Math.ceil(roll.frames.length / PER_STRIP) },
    (_, s) => roll.frames.slice(s * PER_STRIP, (s + 1) * PER_STRIP),
  );
  const keeps = roll.frames.filter((f) => f.mark === "keep").length;
  return (
    <section className="roll" id={roll.id} aria-labelledby={`${roll.id}-t`}>
      <header className="roll-head">
        <p className="mono">
          ROL {number} · {roll.stock}
        </p>
        <h3 id={`${roll.id}-t`}>{roll.title}</h3>
        <p className="roll-meta">
          {roll.place} · {roll.year} · {roll.frames.length} frame · {keeps}{" "}
          dipilih
        </p>
        {roll.sample && (
          <p className="sample mono">Contoh · ilustrasi, bukan foto asli</p>
        )}
      </header>
      {strips.map((strip, s) => (
        <div className="strip" key={s}>
          <div className="edge mono" aria-hidden="true">
            <span>{roll.stock}</span>
            {strip.map((_, i) => (
              <span key={i}>▸ {edgeNumber(s * PER_STRIP + i)}</span>
            ))}
          </div>
          <ol className="frames">
            {strip.map((f) => (
              <li key={f.slug}>
                <Link
                  href={frameHref(roll.id, f.slug)}
                  className={`frame ${f.mark ? `is-${f.mark}` : ""}`}
                  aria-label={`Frame ${f.slug}: ${f.caption}${f.mark ? markLabel[f.mark] : ""}`}
                >
                  <ViewTransition
                    name={`photo-${roll.id}-${f.slug}`}
                    share="morph"
                    default="none"
                  >
                    <span className="frame-img">
                      <DevelopImage
                        src={f.src}
                        alt=""
                        width={f.width}
                        height={f.height}
                        placeholder="blur"
                        blurDataURL={f.blur}
                        sizes="(max-width: 700px) 46vw, (max-width: 1100px) 30vw, 15vw"
                      />
                    </span>
                  </ViewTransition>
                  <span className="frame-no mono">{f.slug}</span>
                  <Mark kind={f.mark} />
                </Link>
              </li>
            ))}
          </ol>
          <div className="edge mono" aria-hidden="true">
            {strip.map((_, i) => (
              <span key={i}>{edgeNumber(s * PER_STRIP + i)}</span>
            ))}
            <span>
              {roll.id.toUpperCase()} · {roll.year}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
