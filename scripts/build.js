const { build } = require("esbuild");

build({
  entryPoints: ["./src/content.js"],
  outdir: "./lib",
  platform: "browser",
  external: [],
  watch: false,
});
