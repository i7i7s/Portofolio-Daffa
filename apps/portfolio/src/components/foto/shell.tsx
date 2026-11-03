"use client";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK, INTRO_DONE } from "./gsap";

const INTRO_KEY = "foto-intro";

// Page-wide pieces of the photo side: the shutter opening that plays once per
// visit on the landing page, and an autofocus reticle that follows the mouse.
export function FotoShell({ title }: { title: string }) {
  const iris = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const reticle = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const html = document.documentElement;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      if (!html.classList.contains("is-intro") || !iris.current) return;
      const radius = Math.hypot(innerWidth, innerHeight) / 2 + 40;
      const done = () => {
        html.classList.remove("is-intro");
        try {
          sessionStorage.setItem(INTRO_KEY, "1");
        } catch {}
      };
      const tl = gsap.timeline({ onComplete: done });
      tl.fromTo(
        label.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.2 },
      )
        .to(
          label.current,
          {
            duration: 0.8,
            scrambleText: {
              text: title.toUpperCase(),
              chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ƒ/",
              speed: 0.6,
            },
          },
          0,
        )
        .to(label.current, { autoAlpha: 0, duration: 0.25 }, 1.05)
        .fromTo(
          iris.current,
          { "--r": "0px" },
          { "--r": `${radius}px`, duration: 1.15, ease: "power3.inOut" },
          1.0,
        )
        .call(
          () => {
            window.dispatchEvent(new Event(INTRO_DONE));
          },
          [],
          1.55,
        );
      return () => {
        // an interrupted intro must still release the page
        done();
        window.dispatchEvent(new Event(INTRO_DONE));
      };
    });

    mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
      const el = reticle.current;
      if (!el) return;
      gsap.set(el, { xPercent: -50, yPercent: -50 });
      const qx = gsap.quickTo(el, "x", { duration: 0.3, ease: "power3" });
      const qy = gsap.quickTo(el, "y", { duration: 0.3, ease: "power3" });
      const names: Record<string, string> = { photo: "BUKA", drag: "SERET" };
      const set = (state: string) => {
        if (el.dataset.state === state) return;
        el.dataset.state = state;
        if (tag.current) tag.current.textContent = names[state] ?? "";
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        el.dataset.on = "true";
        qx(e.clientX);
        qy(e.clientY);
        const t = e.target as Element | null;
        if (t?.closest("[data-orbit-i], .frame")) set("photo");
        else if (t?.closest(".orbit-stage")) set("drag");
        else if (t?.closest("a, button")) set("link");
        else set("idle");
      };
      const onLeave = () => delete el.dataset.on;
      const onDown = () => {
        gsap.fromTo(
          el,
          { scale: 0.72 },
          { scale: 1, duration: 0.35, ease: "back.out(3)", overwrite: "auto" },
        );
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerdown", onDown);
      document.documentElement.addEventListener("mouseleave", onLeave);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        delete el.dataset.on;
      };
    });
  }, []);

  return (
    <>
      <div className="fx-iris" ref={iris} aria-hidden="true">
        <span className="fx-iris-ring" />
        <span className="fx-iris-label mono" ref={label}>
          {title}
        </span>
      </div>
      <div
        className="fx-reticle"
        ref={reticle}
        data-state="idle"
        aria-hidden="true"
      >
        <i />
        <i />
        <i />
        <i />
        <span className="fx-reticle-tag mono" ref={tag} />
      </div>
    </>
  );
}
