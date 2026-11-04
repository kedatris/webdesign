export interface ContentStageProps {
  activeSlideIndex: number
  currentSlideText: string
  isGetStarted: boolean
  isStepTwo: boolean
  totalSlides: number
  onContinueClick: () => void
  onCtaClick: () => void
  onGetStartedClick: () => void
}
