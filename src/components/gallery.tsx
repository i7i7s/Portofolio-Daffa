"use client";
import Image from "next/image";
import { trapFocus } from "@/lib/focus";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { Locale, Photo } from "@/lib/content/schema";
import { gsap, useGSAP, minimal } from "./motion";
import { motion } from "@/lib/motion/config";
export function Gallery({
  photos,
  teaser = false,
}: {
  photos: Photo[];
  teaser?: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const image = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const touch = useRef<number | null>(null);
  const current = index === null ? null : photos[index];
  const { contextSafe } = useGSAP({ scope: root });
  useEffect(
    () => () => {
      document.body.style.overflow = "";
      document.dispatchEvent(new Event("portfolio:dialog"));
    },
    [],
  );
  const open = contextSafe((i: number, button: HTMLElement) => {
    trigger.current = button;
    setIndex(i);
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    document.dispatchEvent(new Event("portfolio:dialog"));
    if (!minimal()) {
      const rect = button.getBoundingClientRect();
      const target = image.current?.getBoundingClientRect();
      gsap.fromTo(
        image.current,
        {
          x: target
            ? rect.left + rect.width / 2 - target.left - target.width / 2
            : 0,
          y: target
            ? rect.top + rect.height / 2 - target.top - target.height / 2
            : 25,
          scale: 0.7,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: motion.gallery,
          ease: motion.ease,
          overwrite: true,
        },
      );
    }
  });
  const close = contextSafe(() => {
    const finish = () => {
      dialog.current?.close();
      setIndex(null);
      document.body.style.overflow = "";
      document.dispatchEvent(new Event("portfolio:dialog"));
      trigger.current?.focus();
    };
    if (minimal()) finish();
    else
      gsap.to(image.current, {
        opacity: 0,
        scale: 0.97,
        duration: motion.photo,
        onComplete: finish,
        overwrite: true,
      });
  });
  const change = contextSafe((delta: number) => {
    setIndex((old) =>
      old === null ? 0 : (old + delta + photos.length) % photos.length,
    );
    if (!minimal())
      gsap.fromTo(
        image.current,
        { opacity: 0.4, x: delta * 12 },
        { opacity: 1, x: 0, duration: motion.photo, overwrite: true },
      );
  });
  if (!photos.length)
    return (
      <div className="empty">
        <h2>{t("emptyPhotos")}</h2>
        <p>{t("emptyPhotosHint")}</p>
      </div>
    );
  return (
    <div ref={root}>
      <div
        className={`photo-grid ${teaser ? "teaser" : ""}`}
        data-fan={teaser ? "" : undefined}
      >
        {photos.map((p, i) => (
          <figure key={p.id} data-reveal={teaser ? undefined : "media"}>
            <button
              className="photo-button"
              data-cursor={t("cursorOpen")}
              data-reveal={teaser ? "media" : undefined}
              onClick={(e) => open(i, e.currentTarget)}
              aria-label={`${t("openPhoto")}: ${p.caption?.[locale] || p.alt[locale]}${p.sample ? ` — ${t("sample")}` : ""}`}
            >
              <Image
                src={p.src}
                alt={p.alt[locale]}
                width={p.width}
                height={p.height}
                sizes="(max-width:767px) 90vw, 45vw"
              />
              <span className="photo-open" aria-hidden="true">
                ↗
              </span>
              {p.sample && <span className="media-label">{t("sample")}</span>}
            </button>
            <figcaption data-reveal="caption">
              <span className="mono">0{i + 1}</span> {p.caption?.[locale]}{" "}
              {p.year && <span>{p.year}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="photo-dialog"
        aria-label={t("photoDialog")}
        data-lenis-prevent
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        onKeyDown={(e) => {
          trapFocus(e);
          if (e.key === "ArrowRight") {
            e.preventDefault();
            change(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            change(-1);
          }
        }}
      >
        <button
          autoFocus
          className="dialog-close"
          aria-label={t("close")}
          onClick={close}
        >
          ×
        </button>
        <div
          ref={image}
          className="large-photo"
          onTouchStart={(e) => {
            touch.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touch.current !== null) {
              const delta = e.changedTouches[0].clientX - touch.current;
              if (Math.abs(delta) > 50) change(delta < 0 ? 1 : -1);
            }
            touch.current = null;
          }}
        >
          {current && (
            <Image
              key={current.id}
              src={current.src}
              alt={current.alt[locale]}
              width={current.width}
              height={current.height}
              sizes="(max-width:767px) 95vw, 85vw"
            />
          )}
        </div>
        <div className="photo-controls">
          <button onClick={() => change(-1)} aria-label={t("previous")}>
            ←
          </button>
          <div aria-live="polite">
            <p>{current?.caption?.[locale]}</p>
            <small>
              {t("photoCount", {
                current: (index || 0) + 1,
                total: photos.length,
              })}
            </small>
          </div>
          <button onClick={() => change(1)} aria-label={t("next")}>
            →
          </button>
        </div>
      </dialog>
    </div>
  );
}
