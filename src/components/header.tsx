"use client";
import Link from "next/link";
import { trapFocus } from "@/lib/focus";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, minimal } from "./motion";
export function Header({ name }: { name: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const path = usePathname();
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState("");
  const [suffix, setSuffix] = useState("");
  const { contextSafe } = useGSAP({ scope: dialog });
  useEffect(() => {
    const update = () => setSuffix(location.search + location.hash);
    update();
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    const observer = new MutationObserver(update);
    observer.observe(document.querySelector("main") || document.body, {
      childList: true,
      subtree: true,
    });
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
      observer.disconnect();
    };
  }, [path]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  const links = [
    ["work", `/${locale}/projects/`],
    ["about", `/${locale}/#about`],
    ["photography", `/${locale}/photography/`],
    ["contact", `/${locale}/#contact`],
  ];
  const close = () => {
    dialog.current?.close();
    document.body.style.overflow = "";
    document.dispatchEvent(new Event("portfolio:dialog"));
    trigger.current?.focus();
  };
  useEffect(
    () => () => {
      document.body.style.overflow = "";
      document.dispatchEvent(new Event("portfolio:dialog"));
    },
    [],
  );
  const open = contextSafe(() => {
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    document.dispatchEvent(new Event("portfolio:dialog"));
    if (!minimal()) {
      gsap.fromTo(
        dialog.current,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25 },
      );
      gsap.fromTo(
        dialog.current?.querySelectorAll("a") || [],
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, stagger: 0.04 },
      );
    }
  });
  const other = locale === "id" ? "en" : "id";
  const target = path.replace(/^\/(id|en)/, `/${other}`) + suffix;
  return (
    <header className="site-header">
      <Link
        className="wordmark"
        href={`/${locale}/`}
        aria-label={`${name} ${t("portfolio")} — ${t("home")}`}
      >
        <span className="brand-mark" aria-hidden="true">
          ✳
        </span>
        <span>
          {name}
          <small>{t("portfolio")}</small>
        </span>
      </Link>
      <nav className="desktop-nav" aria-label={t("menu")}>
        {links.map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className={
              (path.includes('/projects') ? label==='work' : path.includes('/photography') ? label==='photography' : active===label) ? "active" : ""
            }
          >
            {t(label)}
          </Link>
        ))}
      </nav>
      <div className="header-tools">
        <Link
          href={target}
          hrefLang={other}
          className="language"
          aria-label={`ID / EN: ${t("language")}`}
          onClick={(e) => {
            if (
              e.defaultPrevented ||
              e.metaKey ||
              e.ctrlKey ||
              e.shiftKey ||
              e.altKey
            )
              return;
            e.preventDefault();
            router.push(
              path.replace(/^\/(id|en)/, `/${other}`) +
                location.search +
                location.hash,
            );
          }}
        >
          <span className={locale === "id" ? "chosen" : ""}>ID</span>
          <span>/</span>
          <span className={locale === "en" ? "chosen" : ""}>EN</span>
        </Link>
        <button
          ref={trigger}
          className="menu-button"
          onClick={open}
          aria-label={t("menu")}
        >
          ☰
        </button>
      </div>
      <dialog
        ref={dialog}
        className="menu-dialog"
        onKeyDown={trapFocus}
        aria-label={t("menu")}
        onCancel={close}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <button
          className="dialog-close"
          onClick={close}
          aria-label={t("close")}
        >
          ×
        </button>
        <nav>
          {links.map(([label, href], i) => (
            <Link key={label} href={href} onClick={close}>
              <small>0{i + 1}</small>
              {t(label)} ↗
            </Link>
          ))}
        </nav>
      </dialog>
    </header>
  );
}
