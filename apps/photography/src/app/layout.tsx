import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import localFont from "next/font/local";
import { site } from "@/lib/catalog";
import "./globals.css";

const archivo = localFont({
  src: "../fonts/archivo-latin-wdth-normal.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  display: "swap",
});
const plex = localFont({
  src: "../fonts/ibm-plex-mono-latin-400-normal.woff2",
  variable: "--font-plex",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.title} · ${site.name}`,
    template: `%s · ${site.title}`,
  },
  description: site.intro,
};

// Marks the document as scripted before paint so the "develop" effect never
// hides photos for visitors without JavaScript.
const boot = `document.documentElement.classList.add("js")`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="id"
      className={`${archivo.variable} ${plex.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a className="skip" href="#isi">
          Langsung ke isi
        </a>
        <header className="masthead">
          <Link href="/" className="wordmark">
            <span className="aperture" aria-hidden="true" />
            {site.title}
            <small className="mono">{site.name}</small>
          </Link>
          <nav aria-label="Navigasi utama">
            <Link href="/#rol">Lembar kontak</Link>
            <a href={site.portfolioUrl}>Portofolio ↗</a>
          </nav>
        </header>
        {children}
        <footer className="colophon mono">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>Dibuat dengan Next.js, tanpa library animasi</span>
          <a href={site.portfolioUrl}>Kembali ke portofolio ↗</a>
        </footer>
      </body>
    </html>
  );
}
