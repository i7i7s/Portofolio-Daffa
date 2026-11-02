"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LineFrame } from "@/lib/catalog";

const MAX_CARDS = 24;
const TAU = Math.PI * 2;
const TILT = (21 * Math.PI) / 180; // how far the ring leans back
const SIN = Math.sin(TILT);
const COS = Math.cos(TILT);
const AUTO = 0.4; // prints per second the ring turns by itself
const GROW = 0.38; // a hovered print gets this much bigger
const LIFT = 0.16; // and comes forward by this share of the radius
const GRACE = 160; // ms the line holds after the pointer slips into a gap

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const wrap = (a: number) => ((((a + Math.PI) % TAU) + TAU) % TAU) - Math.PI;

// A ring of prints that turns on its own and can be dragged. When the mouse
// is over a print the ring unrolls into a straight row around that print,
// which grows and steps forward. Everything is computed per frame (cards sit
// at "world" positions), because CSS transitions between a ring and a row
// cut across the middle instead of unrolling.
export function Orbit({
  frames,
  children,
  heading: Heading = "h2",
}: {
  frames: LineFrame[];
  children: ReactNode;
  heading?: "h1" | "h2";
}) {
  const items = frames.slice(0, MAX_CARDS);
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const title = titleRef.current;
    if (!stage || !title) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let n = cards.length;
    let step = TAU / n;
    let R = 400;
    let cardW = 120;
    let persp = 1440;

    const st = {
      pos: 0, // which print is at the front, in prints
      vel: 0, // prints per second
      t: 0, // 0 = ring, 1 = straight row
      spawn: reduce.matches ? 1 : 0,
      hover: -1,
      shift: { x: 0, y: 0, z: 0 }, // where the row sits, latched on hover
      drag: null as null | {
        id: number;
        lx: number;
        lt: number;
        moved: number;
      },
      dragged: false,
      visible: false,
      raf: 0,
      last: 0,
      leave: 0 as ReturnType<typeof setTimeout> | 0,
      amt: new Float32Array(cards.length), // per-print hover amount
      live: cards.map(() => true),
    };
    const rowX = new Float32Array(cards.length);
    const hov = new Float32Array(cards.length);

    const measure = () => {
      const w = stage.clientWidth;
      const narrow = w < 700;
      n = Math.min(cards.length, narrow ? 10 : MAX_CARDS);
      step = TAU / n;
      R = clamp(w * (narrow ? 0.44 : 0.34), 100, 560);
      cardW = R * step * 0.8;
      persp = R * 4.4;
      stage.style.setProperty("--card-w", `${cardW}px`);
      stage.style.perspective = `${persp}px`;
      cards.forEach((c, i) => {
        c.style.display = i < n ? "" : "none";
      });
      if (st.hover >= n) st.hover = -1;
    };

    // The screen-space ring position of print i, used to latch the row.
    const angle = (i: number, sp: number) =>
      wrap((i - (st.pos - (1 - sp) * n * 0.45)) * step);

    const render = () => {
      const e = smooth(st.t);
      const sp = 1 - Math.pow(1 - st.spawn, 3);
      const Re = R * (0.35 + 0.65 * sp);
      const push = (GROW * 0.5 + 0.06) * cardW;

      for (let i = 0; i < n; i++) {
        rowX[i] = Re * angle(i, sp) + st.shift.x;
        hov[i] = st.amt[i] * e;
      }

      for (let i = 0; i < n; i++) {
        const a = angle(i, sp);
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        // ring: tilted back so the far side sits higher on screen
        const rx = Re * sa;
        const ry = SIN * Re * ca;
        const rz = COS * Re * ca;
        let x = lerp(rx, rowX[i], e);
        const y = lerp(ry, st.shift.y, e);
        let z = lerp(rz, st.shift.z, e);
        // prints on the far side turn to face the viewer, never mirrored
        const face = Math.abs(a) > Math.PI / 2 ? a - Math.sign(a) * Math.PI : a;
        const rotY = lerp(face, 0, e);
        const rotX = lerp(-TILT, 0, e);

        // neighbours of a hovered print step aside to make room
        let nudge = 0;
        for (let j = 0; j < n; j++)
          if (j !== i && hov[j] > 0.001)
            nudge += Math.sign(rowX[i] - rowX[j]) * push * hov[j];
        x += nudge;
        z += LIFT * R * hov[i];

        const depth = 0.3 + 0.7 * Math.pow((ca + 1) / 2, 0.9);
        const opacity = lerp(depth, 1, e) * sp;
        const scale = (0.6 + 0.4 * sp) * (1 + GROW * hov[i]);

        const c = cards[i];
        c.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,${z.toFixed(2)}px) rotateX(${rotX.toFixed(4)}rad) rotateY(${rotY.toFixed(4)}rad) scale(${scale.toFixed(4)})`;
        c.style.opacity = opacity.toFixed(3);
        // only the near half can be pointed at until the ring is a row
        const live = ca > 0.05 || e > 0.5;
        if (live !== st.live[i]) {
          st.live[i] = live;
          c.style.pointerEvents = live ? "auto" : "none";
        }
      }
      title.style.opacity = (1 - 0.8 * e).toFixed(3);
    };

    const frame = (now: number) => {
      st.raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - st.last) / 1000 || 0.016);
      st.last = now;
      const instant = reduce.matches;

      if (st.spawn < 1) {
        st.spawn = instant ? 1 : Math.min(1, st.spawn + dt / 1.6);
        if (st.spawn === 1) stage.dataset.settled = "true";
      }

      const want = st.hover >= 0 ? 1 : 0;
      st.t +=
        (want - st.t) * (instant ? 1 : 1 - Math.exp(-dt * (want ? 6.5 : 4.2)));
      if (Math.abs(want - st.t) < 0.0005) st.t = want;

      const k = instant ? 1 : 1 - Math.exp(-dt * 11);
      for (let i = 0; i < n; i++)
        st.amt[i] += ((st.hover === i ? 1 : 0) - st.amt[i]) * k;

      if (!st.drag) {
        const auto = instant ? 0 : AUTO * (1 - st.t);
        st.vel += (auto - st.vel) * (1 - Math.exp(-dt * (want ? 8 : 2.2)));
        st.pos += st.vel * dt;
      }
      render();
    };

    const run = () => {
      if (st.raf || !st.visible || document.hidden) return;
      st.last = performance.now();
      st.raf = requestAnimationFrame(frame);
    };
    const halt = () => {
      cancelAnimationFrame(st.raf);
      st.raf = 0;
    };

    // Hover is decided from real pointer moves only. Cards sliding under a
    // resting cursor must not flip the ring back and forth.
    const setHover = (i: number) => {
      if (st.leave) clearTimeout(st.leave);
      st.leave = 0;
      if (st.hover === i) return;
      if (smooth(st.t) < 0.02) {
        const sp = 1 - Math.pow(1 - st.spawn, 3);
        const a = angle(i, sp);
        const Re = R * (0.35 + 0.65 * sp);
        st.shift.x = Re * Math.sin(a) - Re * a;
        st.shift.y = SIN * Re * Math.cos(a);
        st.shift.z = COS * Re * Math.cos(a);
      }
      st.hover = i;
    };
    const leaveSoon = () => {
      if (st.leave || st.hover < 0) return;
      st.leave = setTimeout(() => {
        st.hover = -1;
        st.leave = 0;
      }, GRACE);
    };
    const cardAt = (el: Element | null) => {
      const card = el?.closest?.("[data-orbit-i]") as HTMLElement | null;
      return card ? Number(card.dataset.orbitI) : -1;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || st.drag) return;
      const i = cardAt(e.target as Element);
      if (i >= 0 && i < n) setHover(i);
      else leaveSoon();
    };

    // Dragging: one pixel under the pointer is one pixel of travel.
    const dragScale = () => {
      const front = persp / (persp - R * COS);
      const row = persp / (persp - Math.max(st.shift.z, 0));
      return lerp(front, row, smooth(st.t));
    };
    const onDragMove = (e: PointerEvent) => {
      const d = st.drag;
      if (!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.lx;
      d.moved += Math.abs(dx);
      const dpos = -dx / (R * step * dragScale());
      st.pos += dpos;
      const dt = (e.timeStamp - d.lt) / 1000;
      if (dt > 0) st.vel = lerp(st.vel, clamp(dpos / dt, -8, 8), 0.5);
      d.lx = e.clientX;
      d.lt = e.timeStamp;
    };
    const onUp = (e: PointerEvent) => {
      const d = st.drag;
      if (!d || e.pointerId !== d.id) return;
      window.removeEventListener("pointermove", onDragMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      st.dragged = d.moved > 6;
      st.drag = null;
      stage.classList.remove("is-dragging");
      if (reduce.matches) st.vel = 0;
      if (e.pointerType === "mouse") {
        const i = cardAt(document.elementFromPoint(e.clientX, e.clientY));
        if (i >= 0 && i < n) setHover(i);
        else leaveSoon();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      st.dragged = false;
      st.vel = 0;
      st.drag = { id: e.pointerId, lx: e.clientX, lt: e.timeStamp, moved: 0 };
      stage.classList.add("is-dragging");
      window.addEventListener("pointermove", onDragMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    };
    // A drag that ends over a print must not open it.
    const onClick = (e: MouseEvent) => {
      if (!st.dragged) return;
      e.preventDefault();
      e.stopPropagation();
      st.dragged = false;
    };

    const io = new IntersectionObserver(([entry]) => {
      st.visible = entry.isIntersecting;
      if (st.visible) run();
      else halt();
    });
    const ro = new ResizeObserver(() => {
      measure();
      render();
    });
    const onVisibility = () => (document.hidden ? halt() : run());

    measure();
    render();
    stage.dataset.ready = "true";
    if (st.spawn === 1) stage.dataset.settled = "true";
    io.observe(stage);
    ro.observe(stage);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", leaveSoon);
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("click", onClick, true);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      halt();
      if (st.leave) clearTimeout(st.leave);
      io.disconnect();
      ro.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", leaveSoon);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("click", onClick, true);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onDragMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      delete stage.dataset.ready;
      delete stage.dataset.settled;
    };
  }, [items.length]);

  return (
    <section className="orbit" aria-labelledby="orbit-title">
      <div className="orbit-stage" ref={stageRef}>
        <div className="orbit-world">
          <Heading id="orbit-title" className="orbit-title" ref={titleRef}>
            {children}
          </Heading>
          {/* The same photos are linked from the contact sheets below, so the
              ring stays out of the tab order and the accessibility tree. */}
          <div className="orbit-cards" aria-hidden="true">
            {items.map((f, i) => (
              <Link
                key={f.href}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                href={f.href}
                prefetch={false}
                tabIndex={-1}
                draggable={false}
                data-orbit-i={i}
                className="orbit-card"
              >
                <Image
                  src={f.src}
                  alt=""
                  fill
                  sizes="(max-width: 700px) 140px, 280px"
                  placeholder="blur"
                  blurDataURL={f.blur}
                  draggable={false}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <p className="orbit-hints mono">
        <span>Seret untuk memutar</span>
        <span className="orbit-hover-hint">
          Arahkan kursor ke satu foto, lingkarannya meluruskan diri
        </span>
      </p>
    </section>
  );
}
