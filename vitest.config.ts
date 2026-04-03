import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "output/coverage",
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 60, // Calibrated to current baseline; raise incrementally as branch coverage improves
        statements: 80,
      },
    },
  },
});
