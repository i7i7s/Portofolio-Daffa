"use client";
import { useId, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./motion";
import { motion } from "@/lib/motion/config";

const fine = "(prefers-reduced-motion: no-preference) and (pointer: fine)";

// Counts to 100 and lifts like a curtain on the first visit of a session.
// The inline script in the root layout decides whether it runs at all.
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const html = document.documentElement;
      if (!html.classList.contains("is-preloading")) return;
      try {
        sessionStorage.setItem("portfolio-intro", "seen");
      } catch {}
      const count = root.current?.querySelector(".preloader-count");
      const value = { n: 0 };
      const tl = gsap.timeline({
        onComplete: () => html.classList.remove("is-preloading"),
      });
      tl.to(value, {
        n: 100,
        duration: motion.preload,
        ease: "power2.inOut",
        onUpdate: () => {
          if (count)
            count.textContent = String(Math.round(value.n)).padStart(3, "0");
        },
      })
        .to(
          ".preloader-bar",
          { scaleX: 1, duration: motion.preload, ease: "power2.inOut" },
          0,
        )
        .to(".preloader-star", { rotation: 270, duration: motion.preload }, 0)
        .to(root.current, {
          yPercent: -100,
          duration: 0.7,
          ease: "power4.inOut",
        })
        .call(
          () => document.dispatchEvent(new Event("portfolio:intro")),
          [],
          "<0.25",
        );
      // The class stays on purpose: a re-run (Strict Mode) restarts the count.
      return () => tl.kill();
    },
    { scope: root },
  );
  return (
    <div ref={root} className="preloader" aria-hidden="true">
      <span className="preloader-star">✳</span>
      <span className="preloader-count">000</span>
      <span className="preloader-bar" />
    </div>
  );
}

// A soft dot that trails the mouse and grows into a label over [data-cursor].
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(fine, () => {
      const el = dot.current!;
      const label = el.querySelector("span")!;
      gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
      let shown = false;
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        xTo(e.clientX);
        yTo(e.clientY);
        if (!shown) {
          shown = true;
          gsap.set(el, { x: e.clientX, y: e.clientY });
          gsap.to(el, { autoAlpha: 1, duration: 0.2 });
        }
        const target = (e.target as Element).closest?.(
          "[data-cursor],a,button,summary",
        );
        const text = target?.getAttribute("data-cursor") || "";
        label.textContent = text;
        el.classList.toggle("is-label", !!text);
        el.classList.toggle("is-link", !!target && !text);
      };
      const hide = () => {
        shown = false;
        gsap.to(el, { autoAlpha: 0, duration: 0.2 });
      };
      document.addEventListener("pointermove", move);
      document.documentElement.addEventListener("pointerleave", hide);
      return () => {
        document.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", hide);
      };
    });
    return () => mm.revert();
  });
  return (
    <div ref={dot} className="cursor" aria-hidden="true">
      <span />
    </div>
  );
}

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      },
    );
  });
  return <div ref={bar} className="scroll-progress" aria-hidden="true" />;
}

// Endless strip whose speed and direction follow the scroll velocity.
export function Marquee({
  items,
  reverse = false,
  className = "",
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loop = gsap.fromTo(
          ".marquee-track",
          { xPercent: 0 },
          {
            xPercent: -50,
            duration: motion.marquee,
            ease: "none",
            repeat: -1,
          },
        );
        // Start deep inside the loop so a negative timeScale never hits 0.
        loop.totalTime(motion.marquee * 400);
        const base = reverse ? -1 : 1;
        loop.timeScale(base);
        let ramp: gsap.core.Timeline | undefined;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6);
            ramp?.kill();
            ramp = gsap
              .timeline()
              .to(loop, {
                timeScale: base * self.direction * boost,
                duration: 0.15,
              })
              .to(loop, {
                timeScale: base * self.direction,
                duration: 0.9,
                ease: "power2.out",
              });
          },
        });
        return () => {
          ramp?.kill();
          st.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  const repeat = Math.max(3, Math.ceil(10 / items.length));
  const row = Array.from({ length: repeat }, () => items).flat();
  return (
    <div ref={root} className={`marquee ${className}`} aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-copy" key={copy}>
            {row.map((item, i) => (
              <span key={i}>
                {item}
                <b>✳</b>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RotatingBadge({
  text,
  className = "",
  center = "↗",
}: {
  text: string;
  className?: string;
  center?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <span className={`rotating-badge ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <defs>
          <path
            id={`badge-${id}`}
            d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"
          />
        </defs>
        <text>
          <textPath href={`#badge-${id}`} textLength="452">
            {text}
          </textPath>
        </text>
      </svg>
      <b>{center}</b>
    </span>
  );
}

// Pulls its child toward the pointer and springs back on leave.
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const root = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(fine, () => {
        const el = root.current!;
        const ease = { duration: 0.6, ease: "elastic.out(1, 0.45)" };
        const xTo = gsap.quickTo(el, "x", ease);
        const yTo = gsap.quickTo(el, "y", ease);
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <span ref={root} className={`magnetic ${className}`}>
      {children}
    </span>
  );
}

// Swaps one word after another; screen readers get the full list once.
export function WordRotator({ words }: { words: string[] }) {
  const root = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = Array.from(
          root.current!.querySelectorAll<HTMLElement>(".rotator-word"),
        );
        gsap.set(items, { yPercent: 110, visibility: "visible" });
        gsap.set(items[0], { yPercent: 0 });
        const tl = gsap.timeline({ repeat: -1, delay: 1.6 });
        const off = { immediateRender: false };
        items.forEach((item, i) => {
          const next = items[(i + 1) % items.length];
          tl.fromTo(
            item,
            { yPercent: 0 },
            { yPercent: -110, duration: 0.55, ease: "power3.in", ...off },
          )
            .fromTo(
              next,
              { yPercent: 110 },
              { yPercent: 0, duration: 0.7, ease: "back.out(1.6)", ...off },
              "<0.25",
            )
            .to({}, { duration: 1.3 });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <span ref={root} className="rotator">
      <span className="sr-only">{words.join(", ")}</span>
      <span className="rotator-window" aria-hidden="true">
        {words.map((w, i) => (
          <span key={w} className={`rotator-word tone-${i % 4}`}>
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}
