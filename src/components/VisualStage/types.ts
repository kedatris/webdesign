import type { OpinionItem } from "@/server/types"

export interface VisualStageProps {
  isGemReady: boolean
  isStepTwo: boolean
  opinions: OpinionItem[]
}
