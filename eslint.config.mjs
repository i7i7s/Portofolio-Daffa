import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
// GSAP contextSafe registers event callbacks; it does not execute them during render.
// React Compiler's static rules cannot infer that third-party higher-order contract.
export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    "test-results/**",
    "playwright-report/**",
    "qa/**",
  ]),
  { rules: { "react-hooks/set-state-in-effect": "off" } },
  {
    files: ["src/components/*.tsx"],
    rules: { "react-hooks/refs": "off", "react-hooks/immutability": "off" },
  },
]);
