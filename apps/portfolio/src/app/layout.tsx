import type { ReactNode } from "react";
import localFont from "next/font/local";
import { getLocale } from "next-intl/server";
import { MotionRoot } from "@/components/motion";
import "./globals.css";
const manrope = localFont({
  src: "../fonts/manrope-latin-wght-normal.woff2",
  variable: "--font-manrope",
  display: "swap",
});
// Runs before paint: hides the hero until its intro starts and decides
// whether the session preloader plays. Falls back to visible after 4s.
const bootMotion = `try{var h=document.documentElement;if(!matchMedia("(prefers-reduced-motion: reduce)").matches){h.classList.add("motion-ok");if(!sessionStorage.getItem("portfolio-intro"))h.classList.add("is-preloading");setTimeout(function(){h.classList.add("hero-ready");h.classList.remove("is-preloading")},4000)}}catch(e){}`;
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={manrope.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootMotion }} />
      </head>
      <body>
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
