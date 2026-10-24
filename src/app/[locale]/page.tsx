import Link from "next/link";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { profile, projects, photos, preview } from "@/lib/content";
import type { Locale } from "@/lib/content/schema";
import { pageMetadata } from "@/lib/metadata";
import { Choreography } from "@/components/motion";
import { Mascot } from "@/components/mascot";
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
  return (
    <main id="main">
      <Choreography hero>
        <section id="top" className="hero">
          <div className="edition-row mono">
            <span>{t("edition")}</span>
            <span>{t("student")}</span>
          </div>
          <div className="hero-name-row">
            <p>{t("hello")}</p>
            <h1 data-intro-title>
              {profile.name}
              <span className="orange-dot">.</span>
            </h1>
            <span className="name-spark" aria-hidden="true">
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
              <p>{t("heroIntro")}</p>
              <Link className="button primary" href={`/${locale}/projects/`}>
                {t("viewWork")}
                <span>↗</span>
              </Link>
              <div className="interest-tags mono">
                <span>WEB DEV</span>
                <span>UI/UX</span>
                <span>DATA</span>
                <span>MOBILE</span>
              </div>
            </div>
            <div className="hero-collage">
              <div className="collage-grid" aria-hidden="true" />
              <div className="hero-window" data-collage>
                {selected[0] ? (
                  <Image
                    src={selected[0].cover}
                    alt={selected[0].alt[locale]}
                    width={1200}
                    height={850}
                    priority
                    fetchPriority="high"
                    sizes="(max-width:767px) 70vw, 500px"
                  />
                ) : (
                  <div className="abstract-window" aria-hidden="true">
                    <span>○ ○ ○</span>
                    <b>{"{ }"}</b>
                  </div>
                )}
                <small className="mono">
                  {selected[0]?.sample ? t("sample") : t("visualIndex")}
                </small>
              </div>
              <div className="hero-character" data-collage>
                <Mascot priority />
                <span className="character-caption mono">
                  {t("creativeNote")}
                </span>
              </div>
              <span className="hero-sticker" data-sticker aria-hidden="true">
                &lt; / &gt;<small>CODE & CURIOSITY</small>
              </span>
              <span className="orbit-note" data-collage aria-hidden="true">
                ↗
              </span>
            </div>
          </div>
          <div className="hero-bottom mono">
            <span>{t("scroll")} ↓</span>
            <span>01 — 05</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </section>
        <section id="work" className="section work-section">
          <div className="editorial-line" data-reveal="line" />
          <div className="section-heading">
            <p className="eyebrow">01 / {t("work")}</p>
            <h2 data-reveal>
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
              <span className="aside-star" aria-hidden="true">
                ✳
              </span>
              <p className="mono aside-note">
                {t("visualIndex")}
                <br />
                WEB / UI / DATA / MOBILE
              </p>
            </aside>
            <div className="project-grid selected-grid">
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
          </div>
        </section>
        <section id="about" className="section about-section">
          <div className="editorial-line" data-reveal="line" />
          <div className="about-grid">
            <div>
              <p className="eyebrow">02 / {t("aboutLabel")}</p>
              <h2 className="display-heading" data-reveal>
                {t("aboutTitle")}
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
            <h3 data-reveal>{t("interests")}</h3>
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
            <h2 data-reveal>{t("photoTitle")}</h2>
            <Link className="text-link" href={`/${locale}/photography/`}>
              {t("openGallery")} ↗
            </Link>
          </div>
          <div className="photo-intro">
            <p data-reveal="caption">{t("photoIntro")}</p>
            <Mascot pose="shooting" className="photo-mascot" />
          </div>
          {photoSelection.some((p) => p.sample) && (
            <p className="sample-note">{t("photoSample")}</p>
          )}
          <Gallery photos={photoSelection} teaser />
        </section>
        <section id="contact" className="section contact-section">
          <div className="editorial-line" data-reveal="line" />
          <p className="eyebrow">04 / {t("contact")}</p>
          <h2 className="display-heading" data-reveal>
            {t("contactTitle")}
            <span className="orange-dot">↗</span>
          </h2>
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
