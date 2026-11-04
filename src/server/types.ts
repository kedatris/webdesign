export interface HealthCheckData {
  status: "ok"
  timestamp: string
  uptimeSeconds: number
}

export interface OpinionItem {
  id: string
  position:
    "bottom-left" | "center-right" | "middle-left" | "top-left" | "top-right"
  text: string
}

export interface TtsAlignment {
  characterEndTimesSeconds: number[]
  characterStartTimesSeconds: number[]
  characters: string[]
}

export interface TtsResponse {
  alignment: TtsAlignment
  audioBase64: string
}
