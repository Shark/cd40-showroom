import { build as esbuild } from "esbuild";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

await esbuild({
  entryPoints: ["dist/stack.js"],
  bundle: true,
  outfile: "dist/bundle.js",
  format: "esm",
  platform: "node",
  plugins: [
    polyfillNode({
      globals: {
        navigator: true,
      }
    }),
  ],
});
