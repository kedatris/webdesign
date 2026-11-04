import { resolve } from "node:path"
import devServer from "@hono/vite-dev-server"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devServer({
      entry: "src/server/index.ts",
      exclude: [/^(?!\/api).*/],
      injectClientScript: false,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
})
