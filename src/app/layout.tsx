import type { ReactNode } from "react";
import localFont from "next/font/local";
import { getLocale } from "next-intl/server";
import { MotionRoot } from "@/components/motion";
import "./globals.css";
const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  variable: "--font-manrope",
  display: "swap",
});
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={manrope.variable}>
      <body>
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
