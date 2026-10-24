"use client";
import { useEffect, useRef, useState } from "react";
import Image, { getImageProps } from "next/image";
import manifest from "../../public/images/character/manifest.json";
import { gsap, useGSAP, minimal } from "./motion";
import { motion } from "@/lib/motion/config";
export type Pose = "hello" | "coding" | "shooting" | "reviewing" | "success";
export function Mascot({
  pose = "hello",
  className = "",
  priority = false,
}: {
  pose?: Pose;
  className?: string;
  priority?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(pose);
  const [previous, setPrevious] = useState<Pose | null>(null);
  const [visible, setVisible] = useState(priority);
  const currentRef = useRef(current);
  const { contextSafe } = useGSAP({ scope: root });
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || pose === currentRef.current) return;
    let active = true;
    const img = new window.Image();
    const { props } = getImageProps({
      src:
        "/images/character/" + manifest.poses.find((p) => p.id === pose)!.file,
      alt: "",
      fill: true,
      sizes: "(max-width: 767px) 180px, 300px",
    });
    img.sizes = props.sizes || "";
    img.srcset = props.srcSet || "";
    img.src = props.src;
    const ready = () => {
      if (active) {
        setPrevious(currentRef.current);
        setCurrent(pose);
        currentRef.current = pose;
      }
    };
    img
      .decode()
      .then(ready)
      .catch(() => {
        img.onload = ready;
      });
    return () => {
      active = false;
      img.onload = null;
    };
  }, [pose, visible]);
  useGSAP(
    () => {
      if (!previous) return;
      const images = root.current?.querySelectorAll(".mascot-current");
      gsap.fromTo(
        images || [],
        { opacity: 0 },
        {
          opacity: 1,
          duration: minimal() ? 0 : motion.pose,
          onComplete: () => setPrevious(null),
        },
      );
      gsap.to(root.current?.querySelector(".mascot-old") || {}, {
        opacity: 0,
        duration: minimal() ? 0 : motion.pose,
      });
    },
    { scope: root, dependencies: [current, previous] },
  );
  const src = (p: Pose) =>
    "/images/character/" + manifest.poses.find((x) => x.id === p)!.file;
  return (
    <div
      ref={root}
      data-pose={current}
      className={`mascot ${className}`}
      aria-hidden="true"
      onPointerEnter={contextSafe(() => {
        if (!minimal())
          gsap.fromTo(
            root.current,
            { rotation: -2 },
            { rotation: 0, y: 0, duration: 0.4, ease: "back.out(2)" },
          );
      })}
    >
      {previous && (
        <Image
          className="mascot-old"
          src={src(previous)}
          alt=""
          fill
          sizes="(max-width: 767px) 180px, 300px"
        />
      )}
      {(visible || priority) && (
        <Image
          key={current}
          className="mascot-current"
          src={src(current)}
          alt=""
          fill
          sizes="(max-width: 767px) 180px, 300px"
          priority={priority}
        />
      )}
    </div>
  );
}
