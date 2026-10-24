import { getTranslations, setRequestLocale } from "next-intl/server";
import { photos } from "@/lib/content";
import type { Locale } from "@/lib/content/schema";
import { pageMetadata } from "@/lib/metadata";
import { Choreography } from "@/components/motion";
import { Gallery } from "@/components/gallery";
import { Mascot } from "@/components/mascot";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata(
    locale,
    t("photography"),
    t("photoIntro"),
    "photography/",
  );
}
export default async function Photography({
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
          <p className="eyebrow">03 / {t("photography")}</p>
          <div className="page-title-row photo-title">
            <h1 data-page-title>{t("photoTitle")}</h1>
            <Mascot pose="shooting" priority />
          </div>
          <p>{t("photoIntro")}</p>
        </section>
        {photos.some((p) => p.sample) && (
          <p className="sample-note">{t("photoSample")}</p>
        )}
        <Gallery photos={photos} />
      </Choreography>
    </main>
  );
}
