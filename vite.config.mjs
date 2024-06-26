import { defineConfig } from "vite";

/// <reference types="vitest" />
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: [
        ["lcov", { projectRoot: "./src" }], //
        ["json", { file: "coverage.json" }],
        "text",
      ],
      exclude: ["archive", "tests", "**/*.d.ts"],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
