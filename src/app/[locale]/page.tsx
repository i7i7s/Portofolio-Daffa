import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { profile, projects, photos, preview } from "@/lib/content";
import type { Locale } from "@/lib/content/schema";
import { pageMetadata } from "@/lib/metadata";
import { Choreography } from "@/components/motion";
import { Magnetic, Marquee, RotatingBadge, WordRotator } from "@/components/fx";
import { ProjectCard } from "@/components/projects";
import { Interests } from "@/components/interests";
import { Gallery } from "@/components/gallery";
import { Contact } from "@/components/contact";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata(locale, t("portfolio"), t("metaDescription"));
}
export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const selected = projects.filter((p) => p.featured).slice(0, 4);
  const photoSelection = photos.filter((p) => p.featured).slice(0, 3);
  const stack = [
    ...selected.slice(0, 1).map((p) => ({
      src: p.cover,
      width: 1200,
      height: 850,
      label: p.sample ? t("sample") : p.title[locale],
    })),
    ...photoSelection.slice(0, 2).map((p) => ({
      src: p.src,
      width: p.width,
      height: p.height,
      label: p.caption?.[locale] || t("photography"),
    })),
  ];
  const lines = (text: string) =>
    text.split("\n").map((line, i) => (
      <Fragment key={i}>
        {i > 0 && <br />}
        {line}
      </Fragment>
    ));
  return (
    <main id="main">
      <Choreography hero>
        <section id="top" className="hero">
          <div className="edition-row mono" data-hero-fade>
            <span>{t("edition")}</span>
            <span>{t("student")}</span>
          </div>
          <div className="hero-name-row">
            <p data-hero-fade>{t("hello")}</p>
            <h1 data-split-chars>
              {profile.name}
              <span className="orange-dot">.</span>
            </h1>
            <span className="hero-ribbon mono" data-ribbon aria-hidden="true">
              {t("ribbon")}
            </span>
            <span className="hero-pill" data-sticker aria-hidden="true">
              <span data-float>{t("sticker")}</span>
            </span>
            <span className="name-spark" data-sticker aria-hidden="true">
              ✳
            </span>
          </div>
          <div className="hero-body">
            <div className="hero-copy">
              <h2 data-intro-title>
                {t("heroLine")}
                <br />
                <em>{t("heroAccent")}</em>
              </h2>
              <p className="rotator-line" data-hero-fade>
                <span className="mono">{t("exploring")}</span>
                <WordRotator
                  words={["web", "uiux", "data", "mobile"].map((f) => t(f))}
                />
              </p>
              <p data-hero-fade>{t("heroIntro")}</p>
              <div data-hero-fade>
                <Magnetic>
                  <Link
                    className="button primary"
                    href={`/${locale}/projects/`}
                  >
                    {t("viewWork")}
                    <span>↗</span>
                  </Link>
                </Magnetic>
              </div>
            </div>
            <div className="hero-stack" aria-hidden="true">
              {stack.map((card, i) => (
                <div
                  key={card.src}
                  className={`stack-card stack-${i}`}
                  data-speed={[0.35, 0.8, 0.55][i]}
                >
                  <div className="stack-depth" data-depth={[0.6, 1.2, 0.9][i]}>
                    <div className="stack-inner" data-collage>
                      <Image
                        src={card.src}
                        alt=""
                        width={card.width}
                        height={card.height}
                        priority={i === 0}
                        fetchPriority={i === 0 ? "high" : undefined}
                        sizes="(max-width:767px) 55vw, 420px"
                      />
                      <small className="mono">{card.label}</small>
                    </div>
                  </div>
                </div>
              ))}
              <span className="hero-badge" data-sticker>
                <RotatingBadge text="CODE & CURIOSITY ✳ CODE & CURIOSITY ✳ " />
              </span>
              <span className="hero-note mono" data-hero-fade>
                {t("creativeNote")}
              </span>
            </div>
          </div>
          <div className="hero-tapes">
            <Marquee
              className="tape tape-accent"
              items={[
                t("web"),
                t("uiux"),
                t("data"),
                t("mobile"),
                t("photography"),
              ]}
            />
            <Marquee
              className="tape tape-ink"
              reverse
              items={[t("heroLine") + " " + t("heroAccent"), t("creativeNote")]}
            />
          </div>
          <div className="hero-bottom mono">
            <span>{t("scroll")} ↓</span>
            <span>01 — 05</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </section>
        <section id="work" className="section work-section" data-horizontal>
          <div className="editorial-line" data-reveal="line" />
          <div className="section-heading">
            <p className="eyebrow">01 / {t("work")}</p>
            <h2 data-split>
              {t("selected")}
              <span className="orange-dot">.</span>
            </h2>
            <Link href={`/${locale}/projects/`} className="text-link">
              {t("allProjects")} ↗
            </Link>
          </div>
          <div className="selected-layout">
            <aside>
              <p data-reveal="caption">{t("selectedIntro")}</p>
              <RotatingBadge
                className="aside-badge"
                text={`${t("visualIndex")} ✳ ${t("visualIndex")} ✳ `}
                center="✳"
              />
              <p className="mono aside-note">
                {t("visualIndex")}
                <br />
                WEB / UI / DATA / MOBILE
              </p>
            </aside>
            <div className="selected-wrap">
              <div className="project-grid selected-grid" data-track>
                {selected.map((p, i) => (
                  <div key={p.slug} data-reveal="media">
                    <ProjectCard project={p} index={i} />
                  </div>
                ))}
                {!selected.length && (
                  <div className="empty">
                    <h3>{t("emptyProjects")}</h3>
                    <p>{t("emptyHint")}</p>
                  </div>
                )}
              </div>
              <span className="track-progress" aria-hidden="true">
                <span data-track-progress />
              </span>
            </div>
          </div>
        </section>
        <section id="about" className="section about-section">
          <div className="editorial-line" data-reveal="line" />
          <div className="about-grid">
            <div>
              <p className="eyebrow">02 / {t("aboutLabel")}</p>
              <h2 className="display-heading" data-fill>
                {lines(t("aboutTitle"))}
              </h2>
            </div>
            <div className="about-copy">
              {profile.photo && (
                <Image
                  className="profile-photo"
                  data-reveal="media"
                  src={profile.photo.src}
                  alt={profile.photo.alt[locale]}
                  width={profile.photo.width}
                  height={profile.photo.height}
                  sizes="(max-width:767px) 90vw, 35vw"
                />
              )}
              <span className="about-asterisk" aria-hidden="true">
                ✳
              </span>
              <p data-reveal>{profile.bio[locale]}</p>
              <p className="mono">{t("student")}</p>
              {profile.education.length > 0 && (
                <div className="profile-history">
                  <h3>{t("education")}</h3>
                  <ul>
                    {profile.education.map((entry, i) => (
                      <li key={i}>{entry[locale]}</li>
                    ))}
                  </ul>
                </div>
              )}
              {profile.experience.length > 0 && (
                <div className="profile-history">
                  <h3>{t("experience")}</h3>
                  <ul>
                    {profile.experience.map((entry, i) => (
                      <li key={i}>{entry[locale]}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="interests-heading">
            <h3 data-split>{t("interests")}</h3>
            <p>{t("interestsIntro")}</p>
          </div>
          <Interests />
          {profile.skills.length > 0 ? (
            <p className="skills-list">{profile.skills.join(" / ")}</p>
          ) : (
            <p className="skills-note">{t("skillsPending")}</p>
          )}
        </section>
        <section id="photography" className="section photo-section">
          <div className="editorial-line" data-reveal="line" />
          <div className="section-heading">
            <p className="eyebrow">03 / {t("photography")}</p>
            <h2 data-split>{t("photoTitle")}</h2>
            <Link className="text-link" href={`/${locale}/photography/`}>
              {t("openGallery")} ↗
            </Link>
          </div>
          <div className="photo-intro">
            <p data-reveal="caption">{t("photoIntro")}</p>
          </div>
          {photoSelection.some((p) => p.sample) && (
            <p className="sample-note">{t("photoSample")}</p>
          )}
          <div className="photo-stage">
            <svg
              className="outline-word"
              data-drift
              viewBox="0 0 1000 200"
              aria-hidden="true"
            >
              <text x="0" y="165">
                {t("galleryWord")}
              </text>
            </svg>
            <Gallery photos={photoSelection} teaser />
          </div>
        </section>
        <section id="contact" className="section contact-section">
          <div className="editorial-line" data-reveal="line" />
          <p className="eyebrow">04 / {t("contact")}</p>
          <h2 className="display-heading" data-split>
            {lines(t("contactTitle"))}
            <span className="orange-dot">↗</span>
          </h2>
          <Marquee
            className="tape tape-accent contact-tape"
            items={[t("contactMarquee")]}
          />
          <Contact
            email={profile.email}
            preview={preview}
            cv={profile.cv}
            socials={profile.socials}
          />
        </section>
      </Choreography>
    </main>
  );
}
