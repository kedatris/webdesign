import { Hono } from "hono"
import { cors } from "hono/cors"
import type { HealthCheckData, OpinionItem, TtsResponse } from "./types"

const opinionSets: OpinionItem[][] = [
  [
    {
      id: "op-1",
      position: "top-left",
      text: "WA businesses feel confident about future growth",
    },
    {
      id: "op-2",
      position: "top-right",
      text: "AI cant replace creativity",
    },
    {
      id: "op-3",
      position: "middle-left",
      text: "Sales measure true success",
    },
    {
      id: "op-4",
      position: "center-right",
      text: "Human connection drives WA business",
    },
    {
      id: "op-5",
      position: "bottom-left",
      text: "The primary barrier to digital transformation is financial investment",
    },
  ],
  [
    {
      id: "op-6",
      position: "top-left",
      text: "Customer loyalty stems from transparent user experiences",
    },
    {
      id: "op-7",
      position: "top-right",
      text: "Autonomous agents empower lean creative studios",
    },
    {
      id: "op-8",
      position: "middle-left",
      text: "Product retention surpasses top-of-funnel acquisition",
    },
    {
      id: "op-9",
      position: "center-right",
      text: "Authentic empathy defines modern market leaders",
    },
    {
      id: "op-10",
      position: "bottom-left",
      text: "Agile organizational culture outweighs toolchain investments",
    },
  ],
]

const serverStartTime = Date.now()

const app = new Hono()

app.use("/api/*", cors())

export const routes = app
  .basePath("/api")
  .get("/health", (c) => {
    const healthData: HealthCheckData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
    }
    return c.json(healthData)
  })
  .get("/opinions", (c) => {
    return c.json({ opinions: opinionSets[0] })
  })
  .get("/opinions/random", (c) => {
    const randomSet =
      opinionSets[Math.floor(Math.random() * opinionSets.length)]
    return c.json({ opinions: randomSet })
  })
  .post("/tts", async (c) => {
    const body = await c.req.json<{ text: string; voiceId?: string }>()
    if (!body.text || !body.text.trim()) {
      return c.json({ error: "Text is required" }, 400)
    }

    const apiKey =
      process.env.ELEVENLABS_API_KEY;
    const voiceId = body.voiceId

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`,
        {
          body: JSON.stringify({
            model_id: "eleven_turbo_v2_5",
            text: body.text,
          }),
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
          },
          method: "POST",
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error("ElevenLabs API error:", response.status, errorText)
        return c.json(
          { details: errorText, error: "ElevenLabs API error" },
          502
        )
      }

      const data = (await response.json()) as {
        alignment: {
          character_end_times_seconds: number[]
          character_start_times_seconds: number[]
          characters: string[]
        }
        audio_base64: string
      }

      const ttsResult: TtsResponse = {
        alignment: {
          characterEndTimesSeconds: data.alignment.character_end_times_seconds,
          characterStartTimesSeconds:
            data.alignment.character_start_times_seconds,
          characters: data.alignment.characters,
        },
        audioBase64: data.audio_base64,
      }

      return c.json(ttsResult)
    } catch (err) {
      console.error("TTS generation error:", err)
      return c.json({ error: "Failed to generate speech" }, 500)
    }
  })

export type AppType = typeof routes
export default app
