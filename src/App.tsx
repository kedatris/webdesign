import { ContentStage } from "@/components/ContentStage"
import { Header } from "@/components/Header"
import { OnboardingStep } from "@/components/OnboardingStep"
import { VisualStage } from "@/components/VisualStage"

import styles from "./style.module.css"
import useView from "./useView"

export const App = () => {
  const {
    activeSlideIndex,
    currentSlideText,
    email,
    firstName,
    isGemReady,
    isGetStartedReady,
    isRefreshing,
    isStepThree,
    isStepTwo,
    onboardingSubStep,
    opinions,
    totalSlides,
    handleBackClick,
    handleConfirmationContinue,
    handleContinueClick,
    handleCtaClick,
    handleEmailChange,
    handleFirstNameChange,
    handleGetStartedClick,
    handleNameSubmit,
    handleRefreshClick,
  } = useView()

  const isGetStarted = activeSlideIndex === 2 && isGetStartedReady
  const canGoBack = isStepTwo || isStepThree

  return (
    <div className={styles.pageRoot}>
      {/* Ambient background glow vignette */}
      <div className={styles.ambientVignette} />

      {/* Mobile-first centered screen container */}
      <main className={styles.screenContainer}>
        {/* Top Header */}
        <Header
          canGoBack={canGoBack}
          isRefreshing={isRefreshing}
          onBackClick={handleBackClick}
          onRefreshClick={handleRefreshClick}
        />

        {/* Step 3: Isolated Onboarding Step Component */}
        {isStepThree ? (
          <OnboardingStep
            email={email}
            firstName={firstName}
            onConfirmationContinue={handleConfirmationContinue}
            onEmailChange={handleEmailChange}
            onFirstNameChange={handleFirstNameChange}
            onSubmit={handleNameSubmit}
            subStep={onboardingSubStep}
          />
        ) : (
          <>
            {/* Central Visual Stage */}
            <VisualStage
              isGemReady={isGemReady}
              isStepTwo={isStepTwo}
              opinions={opinions}
            />

            {/* Bottom Content & Action Stage */}
            <ContentStage
              activeSlideIndex={activeSlideIndex}
              currentSlideText={currentSlideText}
              isGetStarted={isGetStarted}
              isStepTwo={isStepTwo}
              totalSlides={totalSlides}
              onContinueClick={handleContinueClick}
              onCtaClick={handleCtaClick}
              onGetStartedClick={handleGetStartedClick}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default App
