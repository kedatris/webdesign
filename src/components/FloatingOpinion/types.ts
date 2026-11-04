import type { OpinionItem } from "@/server/types"

export interface FloatingOpinionProps {
  id?: string
  index?: number
  isReady?: boolean
  opinions?: OpinionItem[]
  position?:
    "bottom-left" | "center-right" | "middle-left" | "top-left" | "top-right"
  text?: string
}
