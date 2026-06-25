import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      // Server/client boundary markers are no-ops in unit tests.
      "server-only": fileURLToPath(new URL("./test/empty-module.ts", import.meta.url)),
      "client-only": fileURLToPath(new URL("./test/empty-module.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
