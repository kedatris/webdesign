import type * as React from "react"
import type { OnboardingSubStep } from "@/components/OnboardingStep/types"
import type { OpinionItem } from "@/server/types"

export interface UseViewReturn {
  // Data (primitive & object) — alphabetical
  activeSlideIndex: number
  currentSlideText: string
  email: string
  error: string | null
  firstName: string
  isGemReady: boolean
  isGetStartedReady: boolean
  isLoading: boolean
  isRefreshing: boolean
  isStepThree: boolean
  isStepTwo: boolean
  onboardingSubStep: OnboardingSubStep
  opinions: OpinionItem[]
  totalSlides: number
  // Functions — alphabetical
  handleBackClick: () => void
  handleConfirmationContinue: () => void
  handleContinueClick: () => void
  handleCtaClick: () => void
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleGetStartedClick: () => void
  handleNameSubmit: (e?: React.FormEvent) => void
  handleRefreshClick: () => void
}
