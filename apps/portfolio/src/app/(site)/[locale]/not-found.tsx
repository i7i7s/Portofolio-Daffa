import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations();
  return (
    <main id="main" className="not-found">
      <p className="eyebrow">404</p>
      <span className="big-404">
        4<span>✳</span>4
      </span>
      <h1>{t("notFound")}</h1>
      <p>{t("notFoundText")}</p>
      <Link href={`/${locale}/`} className="button primary">
        {t("home")} ↗
      </Link>
    </main>
  );
}
