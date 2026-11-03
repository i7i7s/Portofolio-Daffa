import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/content/schema";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; rest: string[] }>;
}) {
  const { locale, rest } = await params;
  const t = await getTranslations({ locale });
  return {
    ...pageMetadata(
      locale,
      t("notFound"),
      t("notFoundText"),
      rest.join("/") + "/",
    ),
    robots: { index: false, follow: false },
  };
}
export default function CatchAll() {
  notFound();
}
