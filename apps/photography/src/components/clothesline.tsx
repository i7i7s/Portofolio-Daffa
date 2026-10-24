"use client";
import { useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LineFrame } from "@/lib/catalog";

const PEGS = 7;

// Prints clipped to a diagonal drying line. Each peg slides down the rope
// on a CSS animation; when it leaves the frame it comes back with a random
// photo nobody else on the line is showing.
export function Clothesline({
  pool,
  children,
}: {
  pool: LineFrame[];
  children?: ReactNode;
}) {
  const count = Math.min(PEGS, pool.length);
  const [shown, setShown] = useState(() =>
    Array.from({ length: count }, (_, i) => i),
  );
  const [paused, setPaused] = useState(false);

  const swap = (slot: number) =>
    setShown((current) => {
      const free = pool.map((_, i) => i).filter((i) => !current.includes(i));
      if (!free.length) return current;
      const next = [...current];
      next[slot] = free[Math.floor(Math.random() * free.length)];
      return next;
    });

  return (
    <section
      className={`line ${paused ? "is-paused" : ""}`}
      aria-label="Jemuran foto"
    >
      {children && <div className="line-note">{children}</div>}
      <div className="line-rope">
        {shown.map((index, slot) => {
          const frame = pool[index];
          return (
            <div
              key={slot}
              className="peg"
              style={
                {
                  "--i": slot,
                  "--sway": `${2.4 + (slot % 3) * 0.55}s`,
                  "--lift": `${(slot % 2) * 14}px`,
                } as CSSProperties
              }
              onAnimationIteration={(e) => {
                if (
                  e.animationName === "travel" &&
                  e.target === e.currentTarget
                )
                  swap(slot);
              }}
            >
              <div className="peg-hang">
                <span className="pin" aria-hidden="true" />
                <Link href={frame.href} className="print">
                  <Image
                    src={frame.src}
                    alt={frame.caption}
                    width={frame.width}
                    height={frame.height}
                    placeholder="blur"
                    blurDataURL={frame.blur}
                    sizes="(max-width: 700px) 130px, 200px"
                    priority={slot < 3}
                  />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="line-toggle"
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? "▶ Lanjutkan jemuran" : "❚❚ Jeda jemuran"}
      </button>
    </section>
  );
}
