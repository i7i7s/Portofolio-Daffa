"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP, MOTION_OK } from "./gsap";

export type RollItem = {
  id: string;
  number: string;
  title: string;
  place: string;
  year: number;
  cover: { src: string; blur: string };
};

// The list of rolls. With a mouse, hovering a row slides a print of that
// roll's cover in beside the cursor.
export function RollIndex({ rolls }: { rolls: RollItem[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const peek = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const box = wrap.current;
        const print = peek.current;
        if (!box || !print) return;
        const shots = gsap.utils.toArray<HTMLElement>(".roll-peek-img", print);
        gsap.set(print, {
          xPercent: -108,
          yPercent: -50,
          autoAlpha: 0,
          scale: 0.86,
          rotate: -5,
        });
        gsap.set(shots, { autoAlpha: 0 });
        const qx = gsap.quickTo(print, "x", { duration: 0.35, ease: "power3" });
        const qy = gsap.quickTo(print, "y", { duration: 0.35, ease: "power3" });
        let current = -1;

        const show = (i: number) => {
          if (i === current) return;
          const first = current < 0;
          current = i;
          shots.forEach((s, k) =>
            gsap.to(s, {
              autoAlpha: k === i ? 1 : 0,
              scale: k === i ? 1 : 1.12,
              duration: 0.35,
              ease: "power2.out",
              overwrite: true,
            }),
          );
          gsap.to(print, {
            autoAlpha: 1,
            scale: 1,
            rotate: first ? 3 : gsap.utils.random(-4, 4),
            duration: 0.45,
            ease: "back.out(1.8)",
            overwrite: "auto",
          });
        };
        const hide = () => {
          current = -1;
          gsap.to(print, {
            autoAlpha: 0,
            scale: 0.86,
            duration: 0.25,
            overwrite: "auto",
          });
        };
        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          const r = box.getBoundingClientRect();
          qx(e.clientX - r.left);
          qy(e.clientY - r.top);
          const row = (e.target as Element).closest<HTMLElement>("[data-roll]");
          if (row) show(Number(row.dataset.roll));
          else if (current >= 0) hide();
        };
        box.addEventListener("pointermove", onMove);
        box.addEventListener("pointerleave", hide);
        return () => {
          box.removeEventListener("pointermove", onMove);
          box.removeEventListener("pointerleave", hide);
        };
      });
    },
    { scope: wrap },
  );

  return (
    <div className="roll-index-wrap" ref={wrap}>
      <ol className="roll-index">
        {rolls.map((r, i) => (
          <li key={r.id}>
            <Link href={`#${r.id}`} data-roll={i}>
              <span className="mono">ROL {r.number}</span>
              {r.title}
              <span className="mono">
                {r.place} · {r.year}
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="roll-peek" ref={peek} aria-hidden="true">
        {rolls.map((r) => (
          <span className="roll-peek-img" key={r.id}>
            <Image
              src={r.cover.src}
              alt=""
              fill
              sizes="220px"
              placeholder="blur"
              blurDataURL={r.cover.blur}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
