import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { projects } from "@/lib/content";
import type { Locale } from "@/lib/content/schema";
import { pageMetadata } from "@/lib/metadata";
import { Choreography } from "@/components/motion";
import { ProjectIndex } from "@/components/projects";
import { RotatingBadge } from "@/components/fx";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata(locale, t("allProjects"), t("workIntro"), "projects/");
}
export default async function Projects({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <main id="main">
      <Choreography>
        <section className="page-intro" id="top">
          <p className="eyebrow">01 / {t("visualIndex")}</p>
          <div className="page-title-row">
            <h1 data-page-title>
              {t("allProjects")}
              <span className="orange-dot">.</span>
            </h1>
            <RotatingBadge
              className="title-badge"
              text={`${t("visualIndex")} ✳ ${t("visualIndex")} ✳ `}
            />
          </div>
          <p>{t("workIntro")}</p>
        </section>
        <Suspense fallback={<p>{t("loading")}</p>}>
          <ProjectIndex projects={projects} />
        </Suspense>
      </Choreography>
    </main>
  );
}
