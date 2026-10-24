import type { ReactNode } from "react";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getTranslations,
  getMessages,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/header";
import { profile, preview } from "@/lib/content";
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <a className="skip-link" href="#main">
        {t("skip")}
      </a>
      <div className="site-shell">
        <Header name={profile.name} />
        {preview && (
          <div className="preview-bar">
            <span className="status-dot" />
            {t("preview")}
          </div>
        )}
        {children}
        <footer className="site-footer">
          <Link href={`/${locale}/`} className="footer-brand">
            <span>✳</span> {profile.name}
          </Link>
          <p>{t("footer")}</p>
          <a href="#top">{t("top")} ↑</a>
          <small>{t("copyright")} · ID / EN</small>
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}
