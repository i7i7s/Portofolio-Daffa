"use client";
import { gsap, SplitText, useGSAP, MOTION_OK } from "./gsap";

export const DIR_KEY = "foto-dir";

// The viewfinder coming alive: shutter opens, the lens hunts and locks focus,
// the readout counts in, and the caption settles. Stepping to another frame
// with the keys or the links slides the new print in from that side.
export function FrameFx() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const page = document.querySelector<HTMLElement>(".vf-page");
      if (!page) return;
      const q = <T extends HTMLElement = HTMLElement>(sel: string) =>
        gsap.utils.toArray<T>(sel, page);

      let dir = 0;
      try {
        dir = Number(sessionStorage.getItem(DIR_KEY)) || 0;
        sessionStorage.removeItem(DIR_KEY);
      } catch {}
      const mark = (e: Event) => {
        const a = (e.target as Element).closest<HTMLElement>("[data-dir]");
        if (!a) return;
        try {
          sessionStorage.setItem(DIR_KEY, a.dataset.dir!);
        } catch {}
      };
      page.addEventListener("click", mark);

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // exposure: the blades part and a white flash burns off
      tl.to(q(".shutter i"), {
        scaleY: 0,
        duration: 0.55,
        ease: "power3.inOut",
      })
        .fromTo(
          ".shutter-flash",
          { autoAlpha: 0.85 },
          { autoAlpha: 0, duration: 0.5, ease: "power2.out" },
          0,
        )
        // focus pull on the print, from the side we came from
        .fromTo(
          q(".vf-photo img"),
          { filter: "blur(18px) saturate(0.5)", scale: 1.06, x: dir * 70 },
          {
            filter: "blur(0px) saturate(1)",
            scale: 1,
            x: 0,
            duration: 1.15,
            clearProps: "filter,transform",
          },
          0.1,
        )
        .fromTo(
          q(".corner"),
          { autoAlpha: 0, scale: 1.4 },
          {
            autoAlpha: 0.85,
            scale: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "back.out(2.2)",
          },
          0.15,
        );

      // autofocus hunts across the frame, then locks on and blinks green
      const af = q(".af");
      if (af.length) {
        const hunt = gsap.timeline();
        hunt
          .set(af, { autoAlpha: 1, borderColor: "#f4f4f2", scale: 2.4 })
          .to(af, { x: -90, y: 30, scale: 1.7, duration: 0.2 })
          .to(af, { x: 70, y: -40, scale: 1.3, duration: 0.2 })
          .to(af, { x: -20, y: 14, scale: 1.1, duration: 0.18 })
          .to(af, { x: 0, y: 0, scale: 1, duration: 0.16 })
          .to(af, { borderColor: "#9df07a", duration: 0.05 })
          .to(af, { autoAlpha: 0, duration: 0.07, repeat: 3, yoyo: true })
          .to(af, { autoAlpha: 0, duration: 0.2 });
        tl.add(hunt, 0.25);
      }

      // readout: digits spin before settling on the real values
      const readout = [...q(".vf-hud span:not(.rec)"), ...q(".vf-top span")];
      readout.forEach((el, i) => {
        const text = el.textContent ?? "";
        tl.from(
          el,
          {
            duration: 0.8,
            scrambleText: { text, chars: "0123456789", speed: 0.55 },
          },
          0.55 + i * 0.07,
        );
      });

      // caption block
      tl.fromTo(
        ".vf-meta",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.01 },
        0.3,
      );
      const h1 = page.querySelector<HTMLElement>(".vf-title h1");
      if (h1) {
        const split = SplitText.create(h1, {
          type: "words",
          mask: "words",
          aria: "auto",
        });
        tl.from(
          split.words,
          { yPercent: 115, duration: 0.8, stagger: 0.06, ease: "power4.out" },
          0.4,
        );
      }
      tl.from(
        ".vf-title > :not(h1), .vf-specs > *, .vf-nav > *, .keys",
        {
          autoAlpha: 0,
          y: 16,
          duration: 0.6,
          stagger: 0.05,
        },
        0.55,
      );

      return () => page.removeEventListener("click", mark);
    });
  }, []);

  return null;
}
