import type { NextConfig } from "next";

const config: NextConfig = {
  trailingSlash: true,
  devIndicators: false,
  images: { formats: ["image/avif", "image/webp"] },
};
export default config;
