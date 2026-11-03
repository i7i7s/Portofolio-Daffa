"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "./motion";

// WCAG 2.2.2: animation that starts on its own needs a way to stop it.
export function PauseMotion() {
  const t = useTranslations();
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      className="motion-toggle mono"
      aria-pressed={paused}
      onClick={() => {
        const next = !paused;
        setPaused(next);
        document.documentElement.classList.toggle("motion-paused", next);
        gsap.globalTimeline.paused(next);
      }}
    >
      {paused ? t("resumeMotion") : t("pauseMotion")}
    </button>
  );
}
