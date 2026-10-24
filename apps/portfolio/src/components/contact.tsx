"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Magnetic, RotatingBadge } from "./fx";
import { gsap, useGSAP, minimal } from "./motion";
export function Contact({
  email,
  preview,
  cv,
  socials,
}: {
  email: string;
  preview: boolean;
  cv: string;
  socials: { label: string; url: string }[];
}) {
  const t = useTranslations();
  const [status, setStatus] = useState<"idle" | "copied" | "copyFailed">(
    "idle",
  );
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: root });
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  // Squash the button and throw a handful of stars out of it.
  const bounce = contextSafe(() => {
    if (minimal()) return;
    const button = root.current?.querySelector(".copy-button");
    if (!button) return;
    gsap.fromTo(
      button,
      { scale: 0.85 },
      { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" },
    );
    const box = root.current!.getBoundingClientRect();
    const from = button.getBoundingClientRect();
    for (let i = 0; i < 14; i++) {
      const star = document.createElement("span");
      star.className = "burst-star";
      star.textContent = "✳";
      star.setAttribute("aria-hidden", "true");
      root.current!.appendChild(star);
      const angle = (i / 14) * Math.PI * 2;
      const reach = gsap.utils.random(70, 160);
      gsap.set(star, {
        x: from.left - box.left + from.width / 2,
        y: from.top - box.top + from.height / 2,
        xPercent: -50,
        yPercent: -50,
        scale: gsap.utils.random(0.5, 1.3),
      });
      gsap.to(star, {
        x: `+=${Math.cos(angle) * reach}`,
        y: `+=${Math.sin(angle) * reach}`,
        rotation: gsap.utils.random(-220, 220),
        opacity: 0,
        duration: gsap.utils.random(0.7, 1.1),
        ease: "power3.out",
        onComplete: () => star.remove(),
      });
    }
  });
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email || "hello@example.com");
      if (!mounted.current) return;
      setStatus("copied");
      bounce();
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus("idle"), 3500);
    } catch {
      if (mounted.current) setStatus("copyFailed");
    }
  };
  return (
    <div ref={root} className="contact-content">
      <div>
        <p>{t("contactIntro")}</p>
        {email ? (
          <div className="email-row">
            <a href={`mailto:${email}`} className="email-address">
              {email} ↗
            </a>
            <Magnetic>
              <button className="copy-button" onClick={copy}>
                {t("copy")} ⧉
              </button>
            </Magnetic>
          </div>
        ) : (
          <p className="muted">{t("contactMissing")}</p>
        )}
        {!email && preview && (
          <details className="preview-contact">
            <summary>{t("previewContact")}</summary>
            <p>{t("exampleContact")}</p>
            <code>hello@example.com</code>
            <button className="copy-button" onClick={copy}>
              {t("copy")} ⧉
            </button>
          </details>
        )}
        <p className="copy-status" role="status">
          {status !== "idle" ? t(status) : ""}
        </p>
        <div className="socials">
          {cv && (
            <a href={cv} download={cv.startsWith("/")} className="text-link">
              {t("cv")} ↗
            </a>
          )}
          {socials.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              {s.label} ↗
            </a>
          ))}
        </div>
      </div>
      <RotatingBadge
        className={`contact-badge ${status === "copied" ? "is-happy" : ""}`}
        text={`${t("contactMarquee")} ✳ ${t("contactMarquee")} ✳ `}
        center={status === "copied" ? "✓" : "✳"}
      />
    </div>
  );
}
