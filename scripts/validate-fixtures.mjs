import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
const root = process.cwd();
const temp = mkdtempSync(path.join(tmpdir(), "portfolio-validation-"));
const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const write = (p, value) => {
  const dest = path.join(temp, p);
  mkdirSync(path.dirname(dest), { recursive: true });
  writeFileSync(
    dest,
    typeof value === "string" ? value : JSON.stringify(value),
  );
};
const original = read("content/projects.json"),
  photos = read("content/photography.json");
for (const p of [
  "content/profile.json",
  "content/projects.json",
  "content/photography.json",
  "messages/id.json",
  "messages/en.json",
  "public/images/character/manifest.json",
])
  write(p, read(p));
for (const p of original) {
  write("public" + p.cover, "fixture");
  for (const l of ["id", "en"])
    write(
      `content/projects/${p.slug}/${l}.mdx`,
      readFileSync(`content/projects/${p.slug}/${l}.mdx`, "utf8"),
    );
}
for (const p of photos) write("public" + p.src, "fixture");
for (const p of read("public/images/character/manifest.json").poses)
  write("public/images/character/" + p.file, "fixture");
const run = () => {
  try {
    return {
      status: 0,
      output: execFileSync(
        process.execPath,
        [
          path.join(root, "node_modules/tsx/dist/cli.mjs"),
          path.join(root, "scripts/validate-content.ts"),
        ],
        { cwd: temp, encoding: "utf8", stdio: "pipe" },
      ),
    };
  } catch (e) {
    return { status: e.status, output: e.stderr?.toString() || "" };
  }
};
const valid = run();
assert.equal(valid.status, 0, valid.output);
write("content/projects.json", [...original, original[0]]);
assert.match(run().output, /Duplicate project slug/);
write(
  "content/projects.json",
  original.map((p, i) => (i ? p : { ...p, cover: "/images/missing.png" })),
);
assert.match(run().output, /Missing asset/);
write(
  "content/projects.json",
  original.map((p, i) => (i ? p : { ...p, title: { id: "Judul" } })),
);
assert.notEqual(run().status, 0);
write(
  "content/projects.json",
  original.map((p, i) => (i ? p : { ...p, categories: ["invalid"] })),
);
assert.notEqual(run().status, 0);
write(
  "content/projects.json",
  original.map((p, i) => (i ? p : { ...p, status: "published" })),
);
assert.match(run().output, /Sample cannot be published/);
write("content/projects.json", original);
write("content/projects/ruang/id.mdx", "<Invalid unclosed");
assert.match(run().output, /Invalid MDX/);
console.log(
  "7 content validation fixtures passed: valid, duplicate slug, missing asset, missing translation, invalid category, published sample, invalid MDX.",
);
