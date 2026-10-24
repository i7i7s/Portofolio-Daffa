"use client";
import { useTranslations } from "next-intl";
export default function ErrorPage({ reset }: { reset: () => void }) {
  const t = useTranslations();
  return (
    <main id="main" className="empty">
      <h1>{t("error")}</h1>
      <button className="button" onClick={reset}>
        {t("retry")}
      </button>
    </main>
  );
}
