"use client";
import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";

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
      if (target) router.push(target);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, back, router]);
  return null;
}
