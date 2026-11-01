import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 30000, // 30s timeout for mongodb-memory-server downloads
    hookTimeout: 30000,
    fileParallelism: false, // Run tests serially to avoid DB collisions
  },
});
