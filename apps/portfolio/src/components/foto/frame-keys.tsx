"use client";
import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { DIR_KEY } from "./frame-fx";

// ← and → step through the roll, Esc goes back to the contact sheet.
// A layout effect, so the keys work from the first painted frame; a passive
// effect can land after the page is already on screen.
export function FrameKeys({
  prev,
  next,
  back,
}: {
  prev?: string;
  next?: string;
  back: string;
}) {
  const router = useRouter();
  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const target =
        e.key === "ArrowLeft"
          ? prev
          : e.key === "ArrowRight"
            ? next
            : e.key === "Escape"
              ? back
              : undefined;
      if (target) {
        if (e.key !== "Escape") {
          try {
            sessionStorage.setItem(DIR_KEY, e.key === "ArrowLeft" ? "-1" : "1");
          } catch {}
        }
        router.push(target);
      }
    };
    // a horizontal swipe steps through the roll on touch screens
    let sx = 0;
    let sy = 0;
    const down = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    };
    const up = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
      const target = dx < 0 ? next : prev;
      if (!target) return;
      try {
        sessionStorage.setItem(DIR_KEY, dx < 0 ? "1" : "-1");
      } catch {}
      router.push(target);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", down, { passive: true });
    window.addEventListener("touchend", up, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", down);
      window.removeEventListener("touchend", up);
    };
  }, [prev, next, back, router]);
  return null;
}
