"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP);
export { gsap, ScrollTrigger, SplitText, useGSAP };

// Everything animated on the photo side sits behind this query; visitors who
// ask for reduced motion get the finished page with no hidden start states.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

// The shutter intro on /foto/ tells the page when it is safe to start its own
// entrance, so the orbit and the title do not play under the black overlay.
export const INTRO_DONE = "foto:intro-done";

export const afterIntro = (run: () => void) => {
  const html = document.documentElement;
  if (!html.classList.contains("is-intro")) {
    run();
    return () => {};
  }
  const go = () => run();
  window.addEventListener(INTRO_DONE, go, { once: true });
  return () => window.removeEventListener(INTRO_DONE, go);
};
