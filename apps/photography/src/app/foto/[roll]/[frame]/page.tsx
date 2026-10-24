import { ViewTransition } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FrameKeys } from "@/components/frame-keys";
import {
  edgeNumber,
  exifLine,
  findFrame,
  frameHref,
  rollNumber,
  rolls,
} from "@/lib/catalog";

type Params = { params: Promise<{ roll: string; frame: string }> };

export const dynamicParams = false;
export const generateStaticParams = () =>
  rolls.flatMap((r) => r.frames.map((f) => ({ roll: r.id, frame: f.slug })));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { roll, frame } = await params;
  const found = findFrame(roll, frame);
  return found
    ? {
        title: found.frame.caption,
        description: `${found.roll.title}, ${found.roll.place} ${found.roll.year}`,
      }
    : {};
}

const taken = (iso?: string) => {
  if (!iso) return undefined;
  const [date, time] = iso.split("T");
  const [y, m, d] = date.split("-");
  return `${d}.${m}.${y} ${time ?? ""}`.trim();
};

export default async function FramePage({ params }: Params) {
  const { roll: id, frame: slug } = await params;
  const found = findFrame(id, slug);
  if (!found) notFound();
  const { roll, frame, index } = found;
  const prev = roll.frames[index - 1];
  const next = roll.frames[index + 1];
  const back = `/#${roll.id}`;
  const exif = frame.exif;
  return (
    <main id="isi" className="vf-page">
      <div className="vf">
        <div className="vf-top mono" aria-hidden="true">
          <span>
            {roll.stock} ▸ {edgeNumber(index)}
          </span>
          <span>{taken(exif.taken)}</span>
        </div>
        <div className="vf-window">
          <ViewTransition
            name={`photo-${roll.id}-${frame.slug}`}
            share="morph"
            default="none"
          >
            <div className="vf-photo">
              <Image
                src={frame.src}
                alt={frame.caption}
                width={frame.width}
                height={frame.height}
                placeholder="blur"
                blurDataURL={frame.blur}
                sizes="(max-width: 900px) 100vw, 75vw"
                priority
              />
            </div>
          </ViewTransition>
          <span className="corner c1" aria-hidden="true" />
          <span className="corner c2" aria-hidden="true" />
          <span className="corner c3" aria-hidden="true" />
          <span className="corner c4" aria-hidden="true" />
          <span className="af" aria-hidden="true" />
          <span className="shutter" aria-hidden="true" />
        </div>
        <p className="vf-hud mono">
          <span className="rec">● AF-S</span>
          {exifLine(exif).map((part) => (
            <span key={part}>{part}</span>
          ))}
          <span className="count">
            {frame.slug}/{String(roll.frames.length).padStart(2, "0")}
          </span>
        </p>
      </div>
      <div className="vf-meta">
        <div className="vf-title">
          <p className="mono">
            Rol {rollNumber(roll.id)} · {roll.title}
          </p>
          <h1>{frame.caption}</h1>
          <p>
            {roll.place} · {roll.year}
            {frame.mark === "keep" && <span className="tag keep">Dipilih</span>}
            {frame.mark === "reject" && (
              <span className="tag reject">Dicoret</span>
            )}
          </p>
          {roll.sample && (
            <p className="sample mono">Contoh · ilustrasi, bukan foto asli</p>
          )}
        </div>
        <dl className="vf-specs">
          {exif.camera && (
            <>
              <dt className="mono">Kamera</dt>
              <dd>{exif.camera}</dd>
            </>
          )}
          {exif.lens && (
            <>
              <dt className="mono">Lensa</dt>
              <dd>{exif.lens}</dd>
            </>
          )}
          {exif.taken && (
            <>
              <dt className="mono">Diambil</dt>
              <dd>{taken(exif.taken)}</dd>
            </>
          )}
        </dl>
        <nav className="vf-nav" aria-label="Frame">
          {prev ? (
            <Link href={frameHref(roll.id, prev.slug)}>
              ← Frame {prev.slug}
            </Link>
          ) : (
            <span />
          )}
          <Link href={back} className="to-sheet">
            Lembar kontak
          </Link>
          {next ? (
            <Link href={frameHref(roll.id, next.slug)}>
              Frame {next.slug} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
        <p className="mono keys">← → pindah frame · Esc kembali</p>
      </div>
      <FrameKeys
        prev={prev && frameHref(roll.id, prev.slug)}
        next={next && frameHref(roll.id, next.slug)}
        back={back}
      />
    </main>
  );
}
