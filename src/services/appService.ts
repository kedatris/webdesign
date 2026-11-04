import { hc } from "hono/client"
import type { AppType } from "@/server"
import type { OpinionItem, TtsResponse } from "@/server/types"

export const client = hc<AppType>("/")

export interface AppService {
  generateSpeech: (text: string, voiceId?: string) => Promise<TtsResponse>
  getOpinions: () => Promise<OpinionItem[]>
  getRandomOpinions: () => Promise<OpinionItem[]>
}

export const appService: AppService = {
  generateSpeech: async (
    text: string,
    voiceId?: string
  ): Promise<TtsResponse> => {
    const res = await client.api.tts.$post({ json: { text, voiceId } })
    if (!res.ok) {
      throw new Error("Failed to generate speech")
    }
    return (await res.json()) as TtsResponse
  },
  getOpinions: async (): Promise<OpinionItem[]> => {
    const res = await client.api.opinions.$get()
    if (!res.ok) {
      throw new Error("Failed to fetch opinions")
    }
    const data = await res.json()
    return data.opinions
  },
  getRandomOpinions: async (): Promise<OpinionItem[]> => {
    const res = await client.api.opinions.random.$get()
    if (!res.ok) {
      throw new Error("Failed to fetch random opinions")
    }
    const data = await res.json()
    return data.opinions
  },
}
