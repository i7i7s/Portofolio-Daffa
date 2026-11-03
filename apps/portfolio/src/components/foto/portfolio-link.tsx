"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Back to the portfolio in the language the visitor was reading it in. The
// portfolio header leaves the choice in the NEXT_LOCALE cookie.
export function PortfolioLink({
  label,
  className,
}: {
  label: { id: string; en: string };
  className?: string;
}) {
  const [locale, setLocale] = useState<"id" | "en">("id");
  useEffect(() => {
    const m = document.cookie.match(/NEXT_LOCALE=(id|en)/);
    if (m) setLocale(m[1] as "id" | "en");
  }, []);
  return (
    <Link href={`/${locale}/`} className={className} hrefLang={locale}>
      {label[locale]}
    </Link>
  );
}
