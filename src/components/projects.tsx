"use client";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { Project, Locale } from "@/lib/content/schema";
import { gsap, useGSAP, Flip, ScrollTrigger, minimal } from "./motion";
import { motion } from "@/lib/motion/config";
export function ProjectCard({
  project: p,
  index = 0,
  category = "all",
}: {
  project: Project;
  index?: number;
  category?: string;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const root = useRef<HTMLElement>(null);
  const { contextSafe } = useGSAP({ scope: root });
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width:768px) and (pointer:fine)",
        () => {
          gsap.fromTo(
            root.current?.querySelector(".project-scroll") || {},
            { y: -motion.parallax },
            {
              y: motion.parallax,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  const hover = contextSafe((on: boolean) => {
    if (minimal()) return;
    gsap.to(root.current?.querySelector(".project-art") || {}, {
      rotation: on ? 0 : index % 2 ? 2 : -2,
      scale: on ? 1.02 : 1,
      duration: motion.hover,
      overwrite: true,
    });
    gsap.to(root.current?.querySelector(".project-arrow") || {}, {
      x: on ? 4 : 0,
      y: on ? -4 : 0,
      duration: motion.hover,
      overwrite: true,
    });
  });
  return (
    <article
      ref={root}
      className={`project-card project-${p.slug}`}
      data-flip-id={p.slug}
      onPointerEnter={() => hover(true)}
      onPointerLeave={() => hover(false)}
      onFocus={() => hover(true)}
      onBlur={() => hover(false)}
    >
      <Link
        className="project-link"
        href={`/${locale}/projects/${p.slug}/${category === "all" ? "" : `?category=${category}`}`}
      >
        <div data-parallax className="project-scroll">
          <div
            className="project-art"
            style={{ transform: `rotate(${index % 2 ? 2 : -2}deg)` }}
          >
            <Image
              src={p.cover}
              alt={p.alt[locale]}
              width={1200}
              height={850}
              sizes="(max-width:767px) 92vw, (max-width:1100px) 60vw, 800px"
            />
            <span className="media-label">
              {p.sample ? t("sample") : p.year}
            </span>
          </div>
        </div>
        <div className="project-caption">
          <span className="project-number mono">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="eyebrow">
              {p.categories.map((c) => t(c)).join(" / ")}
            </p>
            <h3>{p.title[locale]}</h3>
            <p className="project-summary">{p.summary[locale]}</p>
          </div>
          <span className="project-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
      </Link>
    </article>
  );
}
export function ProjectIndex({ projects }: { projects: Project[] }) {
  const t = useTranslations();
  const search = useSearchParams();
  const values = ["all", "web", "uiux", "data", "mobile"];
  const initial = search.get("category") || "all";
  const [category, setCategory] = useState(
    values.includes(initial) ? initial : "all",
  );
  const root = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: root });
  const flip = useRef<gsap.core.Timeline | null>(null);
  useEffect(() => {
    const next = search.get("category") || "all";
    setCategory(
      ["all", "web", "uiux", "data", "mobile"].includes(next) ? next : "all",
    );
  }, [search]);
  useLayoutEffect(() => {
    ScrollTrigger.refresh();
  }, [category]);
  const filter = contextSafe((next: string) => {
    flip.current?.kill();
    const state = Flip.getState(
      root.current?.querySelectorAll(".project-card") || [],
    );
    flushSync(() => setCategory(next));
    const url = new URL(location.href);
    if (next === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.pushState(null, "", url.pathname + url.search);
    if (!minimal())
      flip.current = Flip.from(state, {
        duration: motion.flip,
        ease: "power2.inOut",
        absoluteOnLeave: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: motion.flip },
          ),
        onComplete: () => ScrollTrigger.refresh(),
      });
  });
  const shown = projects.filter(
    (p) =>
      category === "all" ||
      p.categories.includes(category as Project["categories"][number]),
  );
  return (
    <div ref={root}>
      <nav className="filters" aria-label={t("categories")}>
        {values.map((c) => (
          <a
            data-no-transition
            key={c}
            href={c === "all" ? "?" : `?category=${c}`}
            aria-current={category === c ? "true" : undefined}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              filter(c);
            }}
          >
            {t(c)}
            <span>
              {c === "all"
                ? projects.length
                : projects.filter((p) =>
                    p.categories.includes(c as Project["categories"][number]),
                  ).length}
            </span>
          </a>
        ))}
      </nav>
      <div aria-live="polite" className="sr-only">
        {t(category)}: {shown.length}
      </div>
      <div className="project-grid index-grid">
        {shown.map((p, i) => (
          <ProjectCard project={p} index={i} key={p.slug} category={category} />
        ))}
      </div>
      {!shown.length && (
        <div className="empty">
          <span aria-hidden="true">↗</span>
          <h2>{t("emptyProjects")}</h2>
          <p>{t("emptyHint")}</p>
        </div>
      )}
    </div>
  );
}
export function BackToProjects() {
  const t = useTranslations();
  const locale = useLocale();
  const search = useSearchParams();
  const category = search.get("category");
  return (
    <Link
      className="text-link"
      href={`/${locale}/projects/${category ? `?category=${encodeURIComponent(category)}` : ""}`}
    >
      ← {t("back")}
    </Link>
  );
}
