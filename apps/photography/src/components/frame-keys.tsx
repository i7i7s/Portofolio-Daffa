"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// ← and → step through the roll, Esc goes back to the contact sheet.
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
  useEffect(() => {
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
