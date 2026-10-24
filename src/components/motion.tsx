"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { motion } from "@/lib/motion/config";
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);
export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
export const minimal = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
declare global {
  interface Window {
    __portfolioMotion?: () => {
      triggers: number;
      tweens: number;
      lenis: boolean;
    };
  }
}

export function MotionRoot({ children }: { children: ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const router = useRouter();
  const pending = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    window.__portfolioMotion = () => ({
      triggers: ScrollTrigger.getAll().length,
      tweens: gsap.globalTimeline.getChildren().length,
      lenis: document.documentElement.classList.contains("lenis"),
    });
    return () => {
      delete window.__portfolioMotion;
    };
  }, []);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference) and (pointer: fine)",
      () => {
        const lenis = new Lenis({
          duration: 0.85,
          smoothWheel: true,
          anchors: true,
          autoRaf: false,
        });
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        const pause = () => {
          if (document.hidden || document.querySelector("dialog[open]"))
            lenis.stop();
          else lenis.start();
        };
        document.addEventListener("visibilitychange", pause);
        document.addEventListener("portfolio:dialog", pause);
        return () => {
          gsap.ticker.remove(tick);
          lenis.off("scroll", ScrollTrigger.update);
          lenis.destroy();
          document.removeEventListener("visibilitychange", pause);
          document.removeEventListener("portfolio:dialog", pause);
        };
      },
    );
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    const resize = new ResizeObserver(refresh);
    if (document.querySelector("main"))
      resize.observe(document.querySelector("main")!);
    let live = true;
    document.fonts.ready.then(() => {
      if (live) refresh();
    });
    document.addEventListener("load", refresh, true);
    return () => {
      live = false;
      clearTimeout(refreshTimer);
      mm.revert();
      resize.disconnect();
      document.removeEventListener("load", refresh, true);
    };
  }, []);
  const { contextSafe } = useGSAP({ scope: overlay });
  useEffect(() => {
    const recover = contextSafe(() => {
      pending.current = false;
      gsap.killTweensOf(overlay.current);
      gsap.set(overlay.current, { yPercent: 100, visibility: "hidden" });
      if (timer.current) clearTimeout(timer.current);
    });
    const click = contextSafe((event: MouseEvent) => {
      const a = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (
        !a ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        a.target === "_blank" ||
        a.hasAttribute("download") ||
        a.dataset.noTransition !== undefined
      )
        return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname)
        return;
      if (a.classList.contains("language")) {
        url.search = location.search;
        url.hash = location.hash;
      }
      if (minimal()) return;
      event.preventDefault();
      pending.current = true;
      if (timer.current) clearTimeout(timer.current);
      gsap.killTweensOf(overlay.current);
      const language =
        url.pathname.split("/")[1] !== location.pathname.split("/")[1];
      gsap.fromTo(
        overlay.current,
        { yPercent: -100, visibility: "visible" },
        {
          yPercent: 0,
          duration: language ? motion.language : motion.wipe,
          ease: motion.ease,
          onComplete: () => router.push(url.pathname + url.search + url.hash),
        },
      );
      timer.current = setTimeout(recover, 2500);
    });
    document.addEventListener("click", click, true);
    const cancel = (event: KeyboardEvent) => {
      if (event.key === "Escape" && pending.current) recover();
    };
    window.addEventListener("keydown", cancel);
    window.addEventListener("popstate", recover);
    window.addEventListener("pageshow", recover);
    return () => {
      document.removeEventListener("click", click, true);
      window.removeEventListener("keydown", cancel);
      window.removeEventListener("popstate", recover);
      window.removeEventListener("pageshow", recover);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [contextSafe, router]);
  useGSAP(
    () => {
      if (pending.current) {
        pending.current = false;
        if (timer.current) clearTimeout(timer.current);
        gsap.to(overlay.current, {
          yPercent: 100,
          duration: minimal() ? 0 : motion.wipe,
          ease: motion.ease,
          overwrite: true,
          onComplete: () => {
            gsap.set(overlay.current, { visibility: "hidden" });
          },
        });
      }
      ScrollTrigger.refresh();
    },
    { dependencies: [path], scope: overlay },
  );
  return (
    <>
      {children}
      <div ref={overlay} className="page-wipe" aria-hidden="true">
        <span>✳</span>
      </div>
    </>
  );
}

export function Choreography({
  children,
  hero = false,
}: {
  children: ReactNode;
  hero?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const path = usePathname();
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const small = window.matchMedia("(max-width:767px)").matches;
        const d = small ? motion.mobileDistance : motion.distance;
        const splits: SplitText[] = [];
        if (hero && !sessionStorage.getItem("portfolio-intro")) {
          sessionStorage.setItem("portfolio-intro", "seen");
          q("[data-intro-title]").forEach((el) =>
            splits.push(
              SplitText.create(el, {
                type: "lines",
                autoSplit: true,
                mask: "lines",
                onSplit: (self) =>
                  gsap.from(self.lines, {
                    yPercent: 105,
                    duration: motion.intro,
                    stagger: motion.stagger,
                    ease: motion.ease,
                  }),
              }),
            ),
          );
          gsap.from(q("[data-collage]"), {
            y: d,
            rotation: 0,
            duration: 0.6,
            stagger: 0.09,
            ease: motion.ease,
          });
          gsap.from(q("[data-sticker]"), {
            scale: 0.8,
            rotation: -12,
            duration: 0.45,
            delay: 0.4,
            ease: "back.out(1.4)",
          });
        } else if (!hero) {
          gsap.from(q("[data-page-title]"), {
            y: d / 2,
            duration: motion.reveal,
            ease: motion.ease,
          });
        }
        q("[data-reveal]").forEach((el) => {
          const style = el.getAttribute("data-reveal");
          if (style === "line")
            gsap.from(el, {
              scaleX: 0,
              transformOrigin: "left",
              duration: 0.6,
              scrollTrigger: { trigger: el, start: "top 93%", once: true },
            });
          else if (style === "media")
            gsap.from(el, {
              clipPath: "inset(0 0 12% 0)",
              y: d,
              duration: 0.55,
              ease: motion.ease,
              scrollTrigger: { trigger: el, start: "top 93%", once: true },
            });
          else if (style === "caption")
            gsap.from(el, {
              x: small ? 0 : -18,
              duration: 0.35,
              scrollTrigger: { trigger: el, start: "top 96%", once: true },
            });
          else
            gsap.from(el, {
              y: d,
              duration: motion.reveal,
              ease: motion.ease,
              scrollTrigger: { trigger: el, start: "top 94%", once: true },
            });
        });
        q(".story h2,.story figure,.process-diagram").forEach((el) =>
          gsap.from(el, {
            y: d,
            duration: motion.reveal,
            scrollTrigger: { trigger: el, start: "top 95%", once: true },
          }),
        );
        if (!small && matchMedia("(pointer:fine)").matches)
          q("[data-section-parallax]").forEach((el) =>
            gsap.fromTo(
              el,
              { y: -motion.parallax },
              {
                y: motion.parallax,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            ),
          );
        return () => splits.forEach((s) => s.revert());
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [path], revertOnUpdate: true },
  );
  return <div ref={root}>{children}</div>;
}
