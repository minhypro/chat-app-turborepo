import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/components/ui/button.tsx"],
  format: ["esm"],
  dts: true,
  minify: false,
  outDir: "dist",
});
