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
import { Preloader, Cursor, ScrollProgress } from "./fx";
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
      const duration = language ? motion.language : motion.wipe;
      gsap.fromTo(
        overlay.current,
        { yPercent: -100, visibility: "visible" },
        {
          yPercent: 0,
          duration,
          ease: "power4.inOut",
          onComplete: () => router.push(url.pathname + url.search + url.hash),
        },
      );
      gsap.fromTo(
        overlay.current!.querySelector("span"),
        { rotation: -180, scale: 0.3 },
        { rotation: 0, scale: 1, duration: duration + 0.2, ease: motion.expo },
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
          ease: "power4.inOut",
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
      <div className="page-clip">{children}</div>
      <ScrollProgress />
      <Cursor />
      <Preloader />
      <div ref={overlay} className="page-wipe" aria-hidden="true">
        <span>✳</span>
      </div>
    </>
  );
}

const dim = "#8a847c";

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
      mm.add(
        {
          ok: "(prefers-reduced-motion: no-preference)",
          wide: "(min-width: 1024px)",
          tablet: "(min-width: 768px)",
          fine: "(pointer: fine)",
        },
        (context) => {
          const { ok, wide, tablet, fine } = context.conditions!;
          if (!ok) return;
          const q = gsap.utils.selector(root);
          const d = tablet ? motion.distance : motion.mobileDistance;
          const splits: SplitText[] = [];
          const cleanups: (() => void)[] = [];
          const split = (el: Element, vars: SplitText.Vars) => {
            const s = SplitText.create(el, vars);
            splits.push(s);
            return s;
          };

          if (hero) {
            const intro = gsap.timeline({
              paused: true,
              defaults: { ease: motion.expo },
            });
            q("[data-split-chars]").forEach((el) =>
              intro.from(
                split(el, { type: "chars", mask: "chars" }).chars,
                { yPercent: 115, duration: motion.intro, stagger: 0.035 },
                0,
              ),
            );
            q("[data-intro-title]").forEach((el) =>
              intro.from(
                split(el, { type: "words", mask: "words" }).words,
                { yPercent: 110, duration: motion.intro, stagger: 0.05 },
                0.25,
              ),
            );
            intro
              .from(
                q("[data-hero-fade]"),
                { y: 30, opacity: 0, duration: 0.9, stagger: 0.08 },
                0.45,
              )
              .from(
                q("[data-collage]"),
                {
                  y: 220,
                  rotation: (i) => [-16, 12, -8][i % 3],
                  scale: 0.75,
                  opacity: 0,
                  duration: 1.3,
                  stagger: 0.12,
                  ease: "back.out(1.1)",
                },
                0.2,
              )
              .from(
                q("[data-sticker]"),
                {
                  scale: 0,
                  rotation: -45,
                  duration: 0.9,
                  stagger: 0.1,
                  ease: "back.out(2.2)",
                },
                0.65,
              )
              .from(
                q("[data-ribbon]"),
                { scaleX: 0, duration: 0.9, transformOrigin: "0% 50%" },
                0.55,
              )
              .call(() =>
                context.add(() =>
                  q("[data-float]").forEach((el, i) =>
                    gsap.to(el, {
                      y: -14,
                      duration: 2.2 + i * 0.4,
                      ease: "sine.inOut",
                      yoyo: true,
                      repeat: -1,
                    }),
                  ),
                ),
              );
            const start = () => {
              document.documentElement.classList.add("hero-ready");
              intro.play();
            };
            if (document.documentElement.classList.contains("is-preloading")) {
              document.addEventListener("portfolio:intro", start, {
                once: true,
              });
              cleanups.push(() =>
                document.removeEventListener("portfolio:intro", start),
              );
            } else start();

            const scene = q(".hero")[0] as HTMLElement | undefined;
            q(".hero [data-speed]").forEach((el) =>
              gsap.to(el, {
                y: () => -Number(el.getAttribute("data-speed")) * 220,
                ease: "none",
                scrollTrigger: {
                  trigger: scene,
                  start: "top top",
                  end: "bottom top",
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              }),
            );
            if (fine && scene) {
              const movers = q("[data-depth]").map((el) => ({
                depth: Number(el.getAttribute("data-depth")),
                x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
                y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
              }));
              const move = (e: PointerEvent) => {
                const nx = e.clientX / innerWidth - 0.5;
                const ny = e.clientY / innerHeight - 0.5;
                movers.forEach((m) => {
                  m.x(nx * m.depth * 70);
                  m.y(ny * m.depth * 50);
                });
              };
              scene.addEventListener("pointermove", move);
              cleanups.push(() =>
                scene.removeEventListener("pointermove", move),
              );
            }
          } else {
            q("[data-page-title]").forEach((el) =>
              gsap.from(
                split(el, { type: "words,chars", mask: "words" }).chars,
                {
                  yPercent: 115,
                  duration: motion.intro,
                  stagger: 0.025,
                  ease: motion.expo,
                },
              ),
            );
          }

          if (wide)
            q("[data-horizontal]").forEach((section) => {
              const track = section.querySelector<HTMLElement>("[data-track]");
              if (!track) return;
              section.classList.add("is-horizontal");
              const distance = () =>
                Math.max(0, track.scrollWidth - track.clientWidth);
              const scrollTrigger = {
                trigger: section,
                start: "top top",
                end: () => "+=" + distance(),
                invalidateOnRefresh: true,
              };
              gsap.to(track, {
                x: () => -distance(),
                ease: "none",
                scrollTrigger: {
                  ...scrollTrigger,
                  pin: true,
                  scrub: 0.8,
                  anticipatePin: 1,
                },
              });
              gsap.fromTo(
                section.querySelector("[data-track-progress]"),
                { scaleX: 0 },
                {
                  scaleX: 1,
                  ease: "none",
                  scrollTrigger: { ...scrollTrigger, scrub: true },
                },
              );
              gsap.from(track.children, {
                x: 260,
                rotation: 4,
                opacity: 0,
                duration: 1.2,
                stagger: 0.12,
                ease: motion.expo,
                scrollTrigger: {
                  trigger: section,
                  start: "top 70%",
                  once: true,
                },
              });
              cleanups.push(() => section.classList.remove("is-horizontal"));
            });

          q("[data-split]").forEach((el) =>
            splits.push(
              SplitText.create(el, {
                type: "lines,words,chars",
                mask: "lines",
                autoSplit: true,
                onSplit: (self) =>
                  gsap.from(self.chars, {
                    yPercent: 110,
                    duration: 1,
                    stagger: 0.018,
                    ease: motion.expo,
                    scrollTrigger: {
                      trigger: el,
                      start: "top 88%",
                      once: true,
                    },
                  }),
              }),
            ),
          );
          q("[data-fill]").forEach((el) =>
            gsap.fromTo(
              split(el, { type: "words" }).words,
              { color: dim },
              {
                color: "#171717",
                stagger: 0.1,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                  end: "bottom 45%",
                  scrub: true,
                },
              },
            ),
          );

          q("[data-reveal]").forEach((el) => {
            if (el.closest(".is-horizontal [data-track]")) return;
            const style = el.getAttribute("data-reveal");
            const once = (start: string) => ({
              trigger: el,
              start,
              once: true,
            });
            if (style === "line")
              gsap.from(el, {
                scaleX: 0,
                transformOrigin: "left",
                duration: 1.2,
                ease: motion.expo,
                scrollTrigger: once("top 93%"),
              });
            else if (style === "media") {
              gsap.from(el, {
                clipPath: "inset(22% 8% 22% 8%)",
                y: d,
                duration: 1.2,
                ease: motion.expo,
                clearProps: "clipPath",
                scrollTrigger: once("top 92%"),
              });
              const img = el.querySelector("img");
              if (img)
                gsap.from(img, {
                  scale: 1.3,
                  duration: 1.5,
                  ease: motion.expo,
                  clearProps: "scale",
                  scrollTrigger: once("top 92%"),
                });
            } else if (style === "caption")
              gsap.from(el, {
                x: tablet ? -30 : 0,
                opacity: 0,
                duration: 0.7,
                ease: motion.ease,
                scrollTrigger: once("top 96%"),
              });
            else
              gsap.from(el, {
                y: d,
                opacity: 0,
                duration: 0.9,
                ease: motion.expo,
                scrollTrigger: once("top 94%"),
              });
          });

          if (tablet)
            q("[data-fan]").forEach((grid) => {
              const items = Array.from(grid.children) as HTMLElement[];
              items.forEach((item, i) =>
                gsap.from(item, {
                  x: () =>
                    (grid.offsetWidth / 2 -
                      (item.offsetLeft + item.offsetWidth / 2)) *
                    0.9,
                  y: 140,
                  rotation: [-9, 5, 12][i % 3],
                  scale: 0.85,
                  ease: "none",
                  scrollTrigger: {
                    trigger: grid,
                    start: "top 95%",
                    end: "top 30%",
                    scrub: 1,
                    invalidateOnRefresh: true,
                  },
                }),
              );
            });
          q("[data-drift]").forEach((el) =>
            gsap.fromTo(
              el,
              { xPercent: 8 },
              {
                xPercent: -18,
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
          q(".story h2,.story figure,.process-diagram").forEach((el) =>
            gsap.from(el, {
              y: d,
              opacity: 0,
              duration: 0.9,
              ease: motion.expo,
              scrollTrigger: { trigger: el, start: "top 95%", once: true },
            }),
          );
          if (tablet && fine)
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
          ScrollTrigger.sort();
          return () => {
            cleanups.forEach((c) => c());
            splits.forEach((s) => s.revert());
          };
        },
      );
      return () => mm.revert();
    },
    { scope: root, dependencies: [path], revertOnUpdate: true },
  );
  return <div ref={root}>{children}</div>;
}
