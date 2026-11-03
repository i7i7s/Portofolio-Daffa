"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LineFrame } from "@/lib/foto/catalog";

const MAX_CARDS = 24;
const TAU = Math.PI * 2;
const TILT = (21 * Math.PI) / 180; // how far the ring leans back
const SIN = Math.sin(TILT);
const COS = Math.cos(TILT);
const AUTO = 0.4; // prints per second the ring turns by itself
const SLOW = 0.3; // share of that speed kept while a print is hovered
const GROW = 0.38; // a hovered print gets this much bigger
const LIFT = 0.16; // and comes forward by this share of the radius
const GRACE = 160; // ms the hover holds after the pointer slips into a gap
const REACH = 2.5; // how many prints away the neighbours still step aside

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const wrap = (a: number) => ((((a + Math.PI) % TAU) + TAU) % TAU) - Math.PI;

// A ring of prints that turns on its own and can be dragged. A print under the
// mouse stays on the ring and keeps travelling with it, but turns to face the
// viewer, grows and steps forward while its neighbours make room. Everything
// is computed per frame and written straight to each card's transform.
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
      spawn: reduce.matches ? 1 : 0,
      hold: document.documentElement.classList.contains("is-intro"),
      lastY: window.scrollY,
      hover: -1,
      ptr: null as null | { x: number; y: number }, // last real mouse position
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
    const ang = new Float32Array(cards.length);

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

    // Where print i sits around the ring, 0 at the front. While the ring flies
    // in, the prints fan out from a point a little behind the front.
    const angle = (i: number, sp: number) =>
      wrap((i - (st.pos - (1 - sp) * n * 0.45)) * step);

    const render = () => {
      const sp = 1 - Math.pow(1 - st.spawn, 3);
      const Re = R * (0.35 + 0.65 * sp);
      const push = ((GROW * 0.5 + 0.06) * cardW) / Re; // as an angle
      let hot = 0;

      for (let i = 0; i < n; i++) {
        ang[i] = angle(i, sp);
        hot = Math.max(hot, st.amt[i]);
      }

      for (let i = 0; i < n; i++) {
        // neighbours of a hovered print slide along the ring to make room
        let a = ang[i];
        for (let j = 0; j < n; j++) {
          if (j === i || st.amt[j] < 0.001) continue;
          const da = wrap(ang[i] - ang[j]);
          const k = 1 - Math.abs(da) / (step * REACH);
          if (k > 0) a += Math.sign(da) * push * st.amt[j] * k;
        }

        const h = st.amt[i];
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        // ring: tilted back so the far side sits higher on screen
        const x = Re * sa;
        const y = SIN * Re * ca;
        const z = COS * Re * ca + LIFT * R * h;
        // prints on the far side turn to face the viewer, never mirrored
        const face = Math.abs(a) > Math.PI / 2 ? a - Math.sign(a) * Math.PI : a;
        const rotY = lerp(face, 0, h);
        const rotX = lerp(-TILT, 0, h);

        const depth = 0.3 + 0.7 * Math.pow((ca + 1) / 2, 0.9);
        const opacity = lerp(depth, 1, h) * sp;
        const scale = (0.6 + 0.4 * sp) * (1 + GROW * h);

        const c = cards[i];
        c.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,${z.toFixed(2)}px) rotateX(${rotX.toFixed(4)}rad) rotateY(${rotY.toFixed(4)}rad) scale(${scale.toFixed(4)})`;
        c.style.opacity = opacity.toFixed(3);
        // only the near half can be pointed at
        const live = ca > 0.05;
        if (live !== st.live[i]) {
          st.live[i] = live;
          c.style.pointerEvents = live ? "auto" : "none";
        }
      }
      title.style.opacity = (1 - 0.8 * hot).toFixed(3);
    };

    const setHover = (i: number) => {
      if (st.leave) clearTimeout(st.leave);
      st.leave = 0;
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

    const frame = (now: number) => {
      st.raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - st.last) / 1000 || 0.016);
      st.last = now;
      const instant = reduce.matches;

      if (st.spawn < 1 && !st.hold) {
        st.spawn = instant ? 1 : Math.min(1, st.spawn + dt / 1.0);
        if (st.spawn === 1) stage.dataset.settled = "true";
      }

      // The ring keeps moving under a resting cursor, so look again each frame
      // at what the pointer is over. A hover also ends once its print has
      // travelled round to the back.
      if (st.ptr && !st.drag) {
        const i = cardAt(document.elementFromPoint(st.ptr.x, st.ptr.y));
        if (i >= 0 && i < n) setHover(i);
        else leaveSoon();
      }
      if (st.hover >= 0) {
        const sp = 1 - Math.pow(1 - st.spawn, 3);
        if (Math.cos(angle(st.hover, sp)) < 0.15) setHover(-1);
      }

      const k = instant ? 1 : 1 - Math.exp(-dt * 11);
      for (let i = 0; i < n; i++)
        st.amt[i] += ((st.hover === i ? 1 : 0) - st.amt[i]) * k;

      if (!st.drag) {
        const paused =
          document.documentElement.classList.contains("motion-paused");
        const auto = instant || paused ? 0 : AUTO * (st.hover >= 0 ? SLOW : 1);
        st.vel += (auto - st.vel) * (1 - Math.exp(-dt * 4));
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

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      st.ptr = { x: e.clientX, y: e.clientY };
    };
    const release = () => {
      st.hold = false;
    };
    // Scrolling the page gives the ring a push, so it feels connected to it.
    const onScroll = () => {
      const dy = window.scrollY - st.lastY;
      st.lastY = window.scrollY;
      if (reduce.matches || st.drag || !st.visible) return;
      st.vel = clamp(st.vel + dy * 0.004, -3.5, 3.5);
    };
    const onLeave = () => {
      st.ptr = null;
      leaveSoon();
    };

    // Dragging: one pixel under the pointer is one pixel of travel.
    const dragScale = () => persp / (persp - R * COS);
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
      if (e.pointerType === "mouse") st.ptr = { x: e.clientX, y: e.clientY };
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
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("click", onClick, true);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("foto:intro-done", release);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("foto:intro-done", release);
      window.removeEventListener("scroll", onScroll);
      halt();
      if (st.leave) clearTimeout(st.leave);
      io.disconnect();
      ro.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
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
    </section>
  );
}
