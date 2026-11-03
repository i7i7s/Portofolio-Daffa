import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import localFont from "next/font/local";
import { site } from "@/lib/foto/catalog";
import { FotoShell } from "@/components/foto/shell";
import "./foto.css";

const archivo = localFont({
  src: "../../fonts/archivo-latin-wdth-normal.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  display: "swap",
});
const plex = localFont({
  src: "../../fonts/ibm-plex-mono-latin-400-normal.woff2",
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

// Runs before paint. "js" keeps the develop effect from hiding photos for
// visitors without JavaScript. "motion-ok" lets the CSS hold back the hero
// until its entrance plays, and "is-intro" covers the landing page with the
// shutter once per visit. Everything falls back to visible after 5 seconds.
const boot = `var h=document.documentElement;h.classList.add("js");try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){h.classList.add("motion-ok");if(location.pathname==="/foto/"&&!sessionStorage.getItem("foto-intro")){h.classList.add("is-intro");setTimeout(function(){h.classList.remove("is-intro");window.dispatchEvent(new Event("foto:intro-done"))},5000)}}}catch(e){}`;

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
        <FotoShell title={site.title} />
        <a className="skip" href="#isi">
          Langsung ke isi
        </a>
        <header className="masthead">
          <Link href="/foto/" className="wordmark">
            <span className="aperture" aria-hidden="true" />
            {site.title}
            <small className="mono">{site.name}</small>
          </Link>
          <nav aria-label="Navigasi utama">
            <Link href="/foto/#rol">Lembar kontak</Link>
            <Link href="/id/">Portofolio ↗</Link>
          </nav>
        </header>
        {children}
        <footer className="colophon mono">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>Dibuat dengan Next.js dan GSAP</span>
          <Link href="/id/">Kembali ke portofolio ↗</Link>
        </footer>
      </body>
    </html>
  );
}
