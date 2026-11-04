import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import app from "./index"

app.use("*", serveStatic({ root: "./dist" }))
app.use("*", serveStatic({ path: "./dist/index.html" }))

const port = Number(process.env.PORT) || 3000

console.log(`Server is running at http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
