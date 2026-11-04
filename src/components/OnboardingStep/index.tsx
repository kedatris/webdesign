import { ArrowUp } from "lucide-react"

import hexagonSvg from "@/assets/Hexagon.svg"
import { Button } from "@/components/ui/button"

import {
  CONFIRMATION_BUTTON_LABEL,
  CONFIRMATION_SUBTITLE,
  EMAIL_INPUT_PLACEHOLDER,
  EMAIL_PROMPT_TEXT,
  NAME_INPUT_PLACEHOLDER,
  NAME_PROMPT_TEXT,
} from "./constants"
import styles from "./style.module.css"
import type { OnboardingStepProps } from "./types"

export const OnboardingStep = ({
  email,
  firstName,
  onConfirmationContinue,
  onEmailChange,
  onFirstNameChange,
  onSubmit,
  subStep,
}: OnboardingStepProps) => {
  const isEmailStep = subStep === "email"
  const isConfirmation = subStep === "confirmation"

  const currentValue = isEmailStep ? email : firstName
  const currentPlaceholder = isEmailStep
    ? EMAIL_INPUT_PLACEHOLDER
    : NAME_INPUT_PLACEHOLDER
  const currentPrompt = isEmailStep ? EMAIL_PROMPT_TEXT : NAME_PROMPT_TEXT
  const isValid = isEmailStep
    ? Boolean(email.trim() && email.includes("@"))
    : Boolean(firstName.trim())
  const handleChange = isEmailStep ? onEmailChange : onFirstNameChange

  const cleanName = firstName.trim()
  const confirmationTitle = cleanName
    ? `Thanks, ${cleanName}! Now, it’s time to get a reality check.`
    : "Thanks! Now, it’s time to get a reality check."

  return (
    <div className={styles.container}>
      {/* Central Visual & Headline Stage: The hexagon stays permanently mounted without rerendering */}
      <section
        aria-label="Onboarding prompt stage"
        className={styles.visualSection}
      >
        {/* Small solid purple hexagon icon — persistent & never remounted */}
        <div className={`step-three-visual-anim ${styles.miniHexagonStage}`}>
          <img src={hexagonSvg} alt="Hexagon" className={styles.miniHexagon} />
        </div>

        {/* Dynamic Prompt Headline & Subtitle per sub-step */}
        <div
          key={`prompt-${subStep}`}
          className={`step-three-headline-anim ${styles.promptContainer}`}
        >
          <h2 className={styles.headline}>
            {isConfirmation ? confirmationTitle : currentPrompt}
          </h2>

          {isConfirmation && (
            <p className={styles.subtitle}>{CONFIRMATION_SUBTITLE}</p>
          )}
        </div>
      </section>

      {/* Bottom Section: Form for input steps or White Continue button for confirmation */}
      <footer className={styles.bottomSection}>
        {isConfirmation ? (
          <Button
            type="button"
            onClick={onConfirmationContinue}
            className={`confirmation-button-anim ${styles.confirmationButton}`}
          >
            {CONFIRMATION_BUTTON_LABEL}
          </Button>
        ) : (
          <form
            key={`form-${subStep}`}
            onSubmit={onSubmit}
            className={`name-input-anim ${styles.inputForm}`}
          >
            <div className={styles.inputContainer}>
              {!currentValue && <span className={styles.cyanCursor}>|</span>}
              <input
                type={isEmailStep ? "email" : "text"}
                value={currentValue}
                onChange={handleChange}
                placeholder={currentPlaceholder}
                className={styles.inputField}
                autoFocus
                autoComplete={isEmailStep ? "email" : "given-name"}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!isValid}
                onClick={onSubmit}
                className={`name-submit-btn-anim ${styles.submitButton} ${
                  isValid ? styles.submitButtonActive : ""
                }`}
                aria-label={isEmailStep ? "Submit email" : "Submit first name"}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
      </footer>
    </div>
  )
}

export default OnboardingStep
