import { readFile } from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { projects } from "@/lib/content";
import type { Locale } from "@/lib/content/schema";
import { pageMetadata } from "@/lib/metadata";
import { Choreography } from "@/components/motion";
import { BackToProjects } from "@/components/projects";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) {
    const t = await getTranslations({ locale });
    return {
      ...pageMetadata(
        locale,
        t("notFound"),
        t("notFoundText"),
        `projects/${slug}/`,
      ),
      robots: { index: false, follow: false },
    };
  }
  return pageMetadata(
    locale,
    p.title[locale],
    p.summary[locale],
    `projects/${slug}/`,
  );
}
function ProcessDiagram({ steps = "" }: { steps: string }) {
  const labels = steps.split("|");
  return (
    <div className="process-diagram">
      {labels.map((l, i) => (
        <div key={l}>
          <span className="mono">0{i + 1}</span>
          <b>{l}</b>
          {i < labels.length - 1 && <span aria-hidden="true">→</span>}
        </div>
      ))}
    </div>
  );
}
export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  const t = await getTranslations();
  const source = await readFile(
    path.join(process.cwd(), "content/projects", p.slug, `${locale}.mdx`),
    "utf8",
  );
  return (
    <main id="main">
      <Choreography>
        <section className="detail-intro" id="top">
          <Suspense>
            <BackToProjects />
          </Suspense>
          <p className="eyebrow">{p.categories.map((c) => t(c)).join(" / ")}</p>
          <h1 data-page-title>{p.title[locale]}</h1>
          <p className="detail-summary">{p.summary[locale]}</p>
          {p.sample && <p className="sample-note">{t("sampleNotice")}</p>}
          <Image
            className="detail-cover"
            data-reveal="media"
            src={p.cover}
            alt={p.alt[locale]}
            width={1200}
            height={850}
            priority
            sizes="92vw"
          />
        </section>
        <div className="story-grid">
          <aside className="project-facts">
            <dl>
              <dt>{t("categories")}</dt>
              <dd>{p.categories.map((c) => t(c)).join(" / ")}</dd>
              {p.year && (
                <>
                  <dt>{t("year")}</dt>
                  <dd>{p.year}</dd>
                </>
              )}
              {p.role && (
                <>
                  <dt>{t("role")}</dt>
                  <dd>{p.role[locale]}</dd>
                </>
              )}
              {p.tools.length > 0 && (
                <>
                  <dt>{t("tools")}</dt>
                  <dd>{p.tools.join(", ")}</dd>
                </>
              )}
            </dl>
          </aside>
          <article className="story">
            <MDXRemote
              source={source}
              components={{
                ProcessDiagram,
                img: (props) => (
                  <Image
                    {...props}
                    src={props.src || ""}
                    alt={props.alt || ""}
                    width={1200}
                    height={850}
                    sizes="(max-width:767px) 90vw, 65vw"
                  />
                ),
              }}
            />
            {p.media.map((m) => (
              <figure key={m.src}>
                <Image
                  src={m.src}
                  alt={m.alt[locale]}
                  width={m.width}
                  height={m.height}
                  sizes="70vw"
                />
              </figure>
            ))}
            <div className="project-links">
              {Object.entries(p.links).map(([label, url]) => (
                <a
                  key={label}
                  className="button"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t(label)} ↗
                </a>
              ))}
            </div>
            <Suspense>
              <BackToProjects />
            </Suspense>
          </article>
        </div>
      </Choreography>
    </main>
  );
}
