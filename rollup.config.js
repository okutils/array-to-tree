import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import nodeExternals from "rollup-plugin-node-externals";

const ENTRY_FILE = "src/index.ts";

const OUTPUT_DIRS = {
  cjs: "dist/cjs",
  dts: "dist/types",
  esm: "dist/esm",
};

const createDtsConfig = () => ({
  input: ENTRY_FILE,
  output: { dir: OUTPUT_DIRS.dts, format: "esm" },
  plugins: [dts()],
});

const createJsConfig = (format) => ({
  input: ENTRY_FILE,
  output: {
    dir: OUTPUT_DIRS[format],
    entryFileNames: "[name].js",
    format,
    sourcemap: true,
  },
  plugins: [
    nodeExternals(),
    typescript({
      compilerOptions: { outDir: OUTPUT_DIRS[format] },
      exclude: ["**/*.spec.ts", "**/*.test.ts"],
      tsconfig: "tsconfig.json",
    }),
    terser({
      format: { comments: /^!/ },
    }),
  ],
});

export default [
  createDtsConfig(),
  createJsConfig("esm"),
  createJsConfig("cjs"),
];
