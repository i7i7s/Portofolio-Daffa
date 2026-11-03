"use client";
import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  MOTION_OK,
  afterIntro,
} from "./gsap";

const all = <T extends HTMLElement = HTMLElement>(
  sel: string,
  root?: ParentNode,
) => gsap.utils.toArray<T>(sel, root);

// Film edge numbering, same as the sheets: 1, 1A, 2, 2A …
const edge = (i: number) => `${Math.floor(i / 2) + 1}${i % 2 ? "A" : ""}`;

// Every animation on the landing page. The markup is plain server HTML; this
// finds it by class, plays it in, and puts it all back on unmount.
export function HomeFx({ frames }: { frames: number }) {
  const counter = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const stops: (() => void)[] = [];

      // Title: the letters come up out of the developer one by one.
      const title = document.querySelector<HTMLElement>(".orbit-title");
      if (title) {
        // words stay whole so "CAHAYA" never breaks across two lines
        const split = SplitText.create(title, {
          type: "words,chars",
          aria: "auto",
        });
        gsap.set(title, { visibility: "visible" });
        gsap.set(split.chars, { autoAlpha: 0 });
        stops.push(
          afterIntro(() => {
            gsap.fromTo(
              split.chars,
              { autoAlpha: 0, y: 48, scale: 1.3, filter: "blur(18px)" },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 1.1,
                ease: "power3.out",
                stagger: { each: 0.05, from: "random" },
                clearProps: "filter,transform",
              },
            );
          }),
        );
      }

      // Hero numbers tick up, the intro line and hints settle in.
      stops.push(
        afterIntro(() => {
          all("[data-count]").forEach((el) => {
            const to = Number(el.dataset.count);
            const n = { v: 0 };
            el.textContent = "0";
            gsap.to(n, {
              v: to,
              duration: 1.5,
              delay: 0.6,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = String(Math.round(n.v));
              },
            });
          });
          gsap.to(".hero-foot > *, .hero-edge", {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            delay: 0.9,
          });
        }),
      );
      gsap.set(".hero-foot > *, .hero-edge", { y: 22 });

      // The ring sinks back and shrinks as the page scrolls over it.
      gsap.to(".orbit-world", {
        scale: 0.84,
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: ".orbit-stage",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Film band: rolls past on its own and speeds up with the scroll.
      const track = document.querySelector<HTMLElement>(".band-track");
      if (track) {
        const run = gsap.to(track, {
          xPercent: -50,
          duration: 46,
          ease: "none",
          repeat: -1,
        });
        let boost = 1;
        const tick = () => {
          boost += (1 - boost) * 0.05;
          run.timeScale(boost);
        };
        gsap.ticker.add(tick);
        stops.push(() => gsap.ticker.remove(tick));
        ScrollTrigger.create({
          trigger: track.parentElement,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? run.play() : run.pause()),
        });
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            boost = Math.max(
              boost,
              1 + Math.min(Math.abs(self.getVelocity()) / 260, 9),
            );
          },
        });
      }

      // Sheet index.
      const head = document.querySelector<HTMLElement>(".rolls-head h2");
      if (head) {
        const split = SplitText.create(head, {
          type: "chars",
          mask: "chars",
          aria: "auto",
        });
        gsap.from(split.chars, {
          yPercent: 110,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.04,
          scrollTrigger: { trigger: head, start: "top 85%", once: true },
        });
      }
      gsap.from(".roll-index li", {
        autoAlpha: 0,
        x: -28,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: ".roll-index", start: "top 88%", once: true },
      });

      // Each roll: title words rise, the strip slides out of its sleeve, the
      // frames drop on one after another and the grease pencil marks are drawn.
      all(".roll").forEach((roll) => {
        const h3 = roll.querySelector<HTMLElement>(".roll-head h3");
        if (h3) {
          const split = SplitText.create(h3, {
            type: "words",
            mask: "words",
            aria: "auto",
          });
          gsap.from(split.words, {
            yPercent: 115,
            duration: 0.8,
            ease: "power4.out",
            stagger: 0.07,
            scrollTrigger: { trigger: h3, start: "top 88%", once: true },
          });
        }
        gsap.from(roll.querySelectorAll(".roll-head > :not(h3)"), {
          autoAlpha: 0,
          y: 12,
          duration: 0.6,
          stagger: 0.08,
          scrollTrigger: { trigger: roll, start: "top 88%", once: true },
        });

        all(".strip", roll).forEach((strip) => {
          gsap.fromTo(
            strip,
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              ease: "none",
              scrollTrigger: {
                trigger: strip,
                start: "top 96%",
                end: "top 62%",
                scrub: 0.4,
              },
            },
          );
          const once = { trigger: strip, start: "top 80%", once: true };
          gsap.from(strip.querySelectorAll(".frames li"), {
            autoAlpha: 0,
            y: 36,
            rotate: () => gsap.utils.random(-3.5, 3.5),
            scale: 0.93,
            duration: 0.7,
            ease: "back.out(1.7)",
            stagger: 0.08,
            clearProps: "all",
            scrollTrigger: once,
          });
          gsap.fromTo(
            strip.querySelectorAll(
              ".is-keep .grease ellipse, .is-reject .grease path",
            ),
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: 0.7,
              ease: "power2.inOut",
              stagger: 0.2,
              delay: 0.9,
              scrollTrigger: once,
            },
          );
          all(".edge", strip).forEach((el, i) =>
            gsap.fromTo(
              el,
              { x: i ? -36 : 36 },
              {
                x: i ? 36 : -36,
                ease: "none",
                scrollTrigger: {
                  trigger: strip,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            ),
          );
        });
      });

      // Frame counter in the corner follows the scroll like film advancing.
      const num = counter.current?.querySelector("b");
      if (num) {
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            num.textContent = edge(Math.round(self.progress * (frames - 1)));
          },
        });
      }

      // Late-loading fonts and photos move things; keep the triggers true.
      let timer: ReturnType<typeof setTimeout> | undefined;
      const refresh = () => {
        clearTimeout(timer);
        timer = setTimeout(() => ScrollTrigger.refresh(), 150);
      };
      document.fonts.ready.then(refresh);
      document.addEventListener("load", refresh, true);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("load", refresh, true);
        stops.forEach((stop) => stop());
      };
    });
  }, []);

  return (
    <div className="fx-counter mono" ref={counter} aria-hidden="true">
      ▸ <b>1</b>
    </div>
  );
}
