import vectorSvg from "@/assets/Vector.svg"
import { FloatingOpinion } from "@/components/FloatingOpinion"

import styles from "./style.module.css"
import type { VisualStageProps } from "./types"

export const VisualStage = ({
  isGemReady,
  isStepTwo,
  opinions,
}: VisualStageProps) => {
  const compactGemClass = isStepTwo ? styles.gemCompact : ""
  const compactSectionClass = isStepTwo ? styles.visualSectionCompact : ""

  return (
    <section
      aria-label="Industry opinions visual map"
      className={`${styles.visualSection} ${compactSectionClass}`}
    >
      {/* Central Organic Vector Gem */}
      <div className={`gem-container ${styles.gemStage} ${compactGemClass}`}>
        {/* Organic light orbs drifting and breathing behind the SVG */}
        <div className={styles.glowWrapper}>
          <div className={`glow-core ${styles.glowCore}`} />
          <div className={`glow-cyan ${styles.glowCyan}`} />
          <div className={`glow-purple ${styles.glowPurple}`} />
          <div className={`glow-blue ${styles.glowBlue}`} />
          <div className={`glow-violet ${styles.glowViolet}`} />
        </div>

        <img
          src={vectorSvg}
          alt="Juicebox Vector Graphic"
          className={`gem-vector-img ${styles.vectorImage}`}
        />
      </div>

      {/* Floating Opinions: hidden when transitioned to Step 2, starts only after gem is fully appeared */}
      {!isStepTwo && (
        <FloatingOpinion isReady={isGemReady} opinions={opinions} />
      )}
    </section>
  )
}

export default VisualStage
