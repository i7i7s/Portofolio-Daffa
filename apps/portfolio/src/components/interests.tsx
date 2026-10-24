"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP, minimal } from "./motion";
import { motion } from "@/lib/motion/config";
const fields = ["web", "uiux", "data", "mobile"];
export function Interests() {
  const t = useTranslations();
  const [field, setField] = useState("web");
  const root = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: root });
  const previous = useRef("web");
  useGSAP(
    () => {
      const old = previous.current;
      previous.current = field;
      if (old === field || minimal()) return;
      gsap.fromTo(
        root.current?.querySelector(".frame-shell") || {},
        {
          attr: {
            x: old === "mobile" ? 132 : 20,
            width: old === "mobile" ? 155 : 380,
            rx: old === "mobile" ? 25 : 8,
          },
        },
        {
          attr: {
            x: field === "mobile" ? 132 : 20,
            width: field === "mobile" ? 155 : 380,
            rx: field === "mobile" ? 25 : 8,
          },
          duration: motion.frame,
          ease: motion.ease,
          overwrite: true,
        },
      );
    },
    { scope: root, dependencies: [field] },
  );
  const select = contextSafe((next: string) => {
    if (field === next) return;
    setField(next);
    if (!minimal())
      gsap.fromTo(
        root.current?.querySelector(".interest-frame") || {},
        { scale: 0.96, rotation: -2 },
        {
          scale: 1,
          rotation: 0,
          duration: motion.frame,
          ease: motion.ease,
          overwrite: true,
        },
      );
  });
  return (
    <div className="interests-grid" ref={root}>
      <div className="interest-list" role="tablist" aria-label={t("interests")}>
        {fields.map((f, i) => (
          <button
            key={f}
            role="tab"
            aria-selected={field === f}
            aria-controls="interest-panel"
            id={`tab-${f}`}
            tabIndex={field === f ? 0 : -1}
            onClick={() => select(f)}
            onKeyDown={(e) => {
              if (
                [
                  "ArrowDown",
                  "ArrowRight",
                  "ArrowUp",
                  "ArrowLeft",
                  "Home",
                  "End",
                ].includes(e.key)
              ) {
                e.preventDefault();
                const index =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? 3
                      : (i +
                          (["ArrowDown", "ArrowRight"].includes(e.key)
                            ? 1
                            : 3)) %
                        4;
                select(fields[index]);
                document.getElementById(`tab-${fields[index]}`)?.focus();
              }
            }}
          >
            <span className="mono">0{i + 1}</span>
            <span>{t(f)}</span>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div
        className="interest-panel"
        id="interest-panel"
        role="tabpanel"
        aria-labelledby={`tab-${field}`}
      >
        <div className={`interest-frame ${field}`}>
          <svg viewBox="0 0 420 250" role="img" aria-label={t("frameLabel")}>
            <rect
              className="frame-shell"
              x={field === "mobile" ? 132 : 20}
              y="15"
              width={field === "mobile" ? 155 : 380}
              height="220"
              rx={field === "mobile" ? 25 : 8}
              fill="#faf9f4"
              stroke="#171717"
              strokeWidth="2"
            />
            <g stroke="#171717" strokeWidth="2">
              <path d={field === "mobile" ? "M180 28h60" : "M20 49h380"} />
            </g>
            {field === "web" ? (
              <>
                <rect x="42" y="72" width="150" height="13" fill="#c5d1bd" />
                <rect x="42" y="97" width="115" height="9" fill="#d8d5ce" />
                <rect
                  x="42"
                  y="133"
                  width="85"
                  height="30"
                  rx="15"
                  fill="#f15a24"
                />
                <rect
                  x="223"
                  y="70"
                  width="150"
                  height="136"
                  rx="60"
                  fill="#a1b39b"
                />
              </>
            ) : field === "uiux" ? (
              <g fill="none" stroke="#57534e" strokeWidth="2">
                <rect x="43" y="71" width="130" height="135" />
                <path d="M43 71l130 135M173 71L43 206M202 80h165M202 105h100" />
                <rect x="203" y="140" width="76" height="66" />
                <rect x="293" y="140" width="76" height="66" />
              </g>
            ) : field === "data" ? (
              <>
                <path d="M45 200h325" stroke="#57534e" />
                {[72, 115, 85, 140, 110, 150].map((h, i) => (
                  <rect
                    key={i}
                    x={55 + i * 52}
                    y={200 - h}
                    width="31"
                    height={h}
                    fill={i % 2 ? "#f15a24" : "#a1b39b"}
                  />
                ))}
              </>
            ) : (
              <>
                <rect
                  x="148"
                  y="49"
                  width="123"
                  height="63"
                  rx="8"
                  fill="#cfc9e6"
                />
                <rect
                  x="148"
                  y="125"
                  width="55"
                  height="54"
                  rx="5"
                  fill="#c6d6c5"
                />
                <rect
                  x="215"
                  y="125"
                  width="55"
                  height="54"
                  rx="5"
                  fill="#e9c8b4"
                />
                <rect
                  x="160"
                  y="198"
                  width="100"
                  height="17"
                  rx="8"
                  fill="#171717"
                />
              </>
            )}
          </svg>
        </div>
        <p>{t(`${field}Desc`)}</p>
      </div>
    </div>
  );
}
