"use client";
import { useState } from "react";
import Image, { type ImageProps } from "next/image";

// Shows a photo the way a print appears in the developer tray: pale paper
// first, then contrast and colour once the file has actually loaded.
export function DevelopImage(props: ImageProps) {
  const [done, setDone] = useState(false);
  return (
    <span className={`develop ${done ? "is-done" : ""}`}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes through props */}
      <Image
        {...props}
        ref={(img) => {
          if (img?.complete && img.naturalWidth) setDone(true);
        }}
        onLoad={() => setDone(true)}
      />
    </span>
  );
}
