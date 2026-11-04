import { Button } from "@/components/ui/button"
import { DotPagination } from "@/components/ui/dot-pagination"
import {
  CTA_BUTTON_LABEL,
  HERO_HIGHLIGHT_WORD,
  HERO_TITLE_PREFIX,
  HERO_TITLE_SUFFIX,
  STEP_TWO_CONTINUE_LABEL,
  STEP_TWO_GET_STARTED_LABEL,
} from "@/constants"

import styles from "./style.module.css"
import type { ContentStageProps } from "./types"

export const ContentStage = ({
  activeSlideIndex,
  currentSlideText,
  isGetStarted,
  isStepTwo,
  totalSlides,
  onContinueClick,
  onCtaClick,
  onGetStartedClick,
}: ContentStageProps) => {
  return (
    <footer className={styles.bottomSection}>
      {!isStepTwo ? (
        <>
          <h2 className={`hero-heading ${styles.headlineText}`}>
            {HERO_TITLE_PREFIX}{" "}
            <span className={styles.highlightWord}>{HERO_HIGHLIGHT_WORD}</span>{" "}
            {HERO_TITLE_SUFFIX}
          </h2>

          <Button
            type="button"
            onClick={onCtaClick}
            className={`cta-button ${styles.ctaButton}`}
          >
            {CTA_BUTTON_LABEL}
          </Button>
        </>
      ) : (
        <div className={`statement-container ${styles.statementContainer}`}>
          {/* Animated Text Character Spans */}
          <p
            key={activeSlideIndex}
            className={`statement-text ${styles.statementText}`}
          >
            {currentSlideText.split("").map((char, index) => (
              <span
                key={index}
                className={`statement-char ${styles.statementChar}`}
              >
                {char}
              </span>
            ))}
          </p>

          {/* Dot Indicators */}
          <DotPagination
            activeIndex={activeSlideIndex}
            total={totalSlides}
            className="dot-pagination-anim"
          />

          {/* Action Button: transforms with smooth CSS transition from Continue to Get started */}
          <Button
            type="button"
            onClick={isGetStarted ? onGetStartedClick : onContinueClick}
            className={`action-button-anim ${styles.actionButton} ${
              isGetStarted
                ? styles.actionButtonGetStarted
                : styles.actionButtonContinue
            }`}
            aria-label={
              isGetStarted
                ? STEP_TWO_GET_STARTED_LABEL
                : STEP_TWO_CONTINUE_LABEL
            }
          >
            <span
              key={isGetStarted ? "get-started" : "continue"}
              className={styles.actionButtonLabel}
            >
              {isGetStarted
                ? STEP_TWO_GET_STARTED_LABEL
                : STEP_TWO_CONTINUE_LABEL}
            </span>
          </Button>
        </div>
      )}
    </footer>
  )
}

export default ContentStage
