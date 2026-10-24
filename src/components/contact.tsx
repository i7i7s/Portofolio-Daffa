"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Mascot } from "./mascot";
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
  const bounce = contextSafe(() => {
    if (!minimal())
      gsap.fromTo(
        root.current?.querySelector(".copy-button") || {},
        { scale: 0.96 },
        { scale: 1, duration: 0.2 },
      );
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
            <button className="copy-button" onClick={copy}>
              {t("copy")} ⧉
            </button>
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
      <Mascot
        pose={status === "copied" ? "success" : "hello"}
        className="contact-mascot"
      />
    </div>
  );
}
