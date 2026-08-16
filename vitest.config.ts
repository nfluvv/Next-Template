import { defineConfig } from "vitest/config"
import { config } from "dotenv"

config({ path: ".env.test" })

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
      "server-only": new URL("./vitest.server-only-stub.ts", import.meta.url)
        .pathname,
    },
  },
})
