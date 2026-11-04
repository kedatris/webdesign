import type * as React from "react"

export type OnboardingSubStep = "confirmation" | "email" | "name"

export interface OnboardingStepProps {
  // Data (primitive & object) — alphabetical
  email: string
  firstName: string
  subStep: OnboardingSubStep
  // Functions — alphabetical
  onConfirmationContinue?: () => void
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e?: React.FormEvent) => void
}
