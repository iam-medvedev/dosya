import { build, emptyDir } from "https://deno.land/x/dnt@0.26.0/mod.ts";

const newVersion = Deno.args[0];
if (!newVersion) {
  throw new Error("Version argument is not set.");
}

await emptyDir("./npm");

await build({
  entryPoints: [
    "./src/mod.ts",
    {
      kind: "bin",
      name: "dosya",
      path: "./src/cli.ts",
    },
  ],
  importMap: "./import_map.json",
  outDir: "./npm",
  shims: {
    deno: true,
  },
  declaration: true,
  test: false,
  packageManager: "yarn",
  package: {
    name: "dosya",
    version: newVersion.replace("v", ""),
    description: "Module for creating buffer for the requested file type.",
    author: "Ilya Medvedev <ilya@medvedev.im>",
    license: "WTFPL",
    homepage: "https://github.com/iam-medvedev/dosya#readme",
    repository: {
      type: "git",
      url: "git+https://github.com/iam-medvedev/dosya.git",
    },
    bugs: {
      url: "https://github.com/iam-medvedev/dosya/issues",
    },
  },
});

Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
