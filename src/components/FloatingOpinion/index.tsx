import { memo, useEffect, useMemo, useRef } from "react"
import gsap from "gsap"

import type { OpinionItem } from "@/server/types"

import styles from "./style.module.css"
import type { FloatingOpinionProps } from "./types"

const positionClassMap: Record<
  NonNullable<FloatingOpinionProps["position"]>,
  string
> = {
  "bottom-left": styles.positionBottomLeft,
  "center-right": styles.positionCenterRight,
  "middle-left": styles.positionMiddleLeft,
  "top-left": styles.positionTopLeft,
  "top-right": styles.positionTopRight,
}

export const FloatingOpinion = memo(
  ({
    id,
    index = 0,
    isReady = true,
    opinions,
    position = "middle-left",
    text,
  }: FloatingOpinionProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<(HTMLDivElement | null)[]>([])

    // Standardize opinions list whether array or single item is passed
    const opinionList: OpinionItem[] = useMemo(() => {
      if (opinions && opinions.length > 0) {
        return opinions
      }
      if (text) {
        return [
          {
            id: id ?? `op-${index}`,
            position,
            text,
          },
        ]
      }
      return []
    }, [id, index, opinions, position, text])

    // Sequence opinions with overlapping (beririsan) animation:
    // Before the current text fades out, the next text starts appearing from tiny text.
    // Triggered only after the central vector gem has fully appeared on screen (isReady).
    useEffect(() => {
      if (!isReady || opinionList.length === 0) {
        return
      }

      const ctx = gsap.context(() => {
        const masterTimeline = gsap.timeline({ repeat: -1 })

        opinionList.forEach((_, itemIndex) => {
          const element = itemRefs.current[itemIndex]
          if (!element) {
            return
          }

          // Subtle randomized drift angles and vectors
          const angle = Math.random() * Math.PI * 2
          const driftMagnitude = 14 + Math.random() * 8
          const driftX = Math.cos(angle) * driftMagnitude
          const driftY = Math.sin(angle) * driftMagnitude

          const itemTimeline = gsap.timeline()

          // 1. Start from tiny text (scale: 0.5) + fade in (opacity 0 -> 1) with subtle movement
          itemTimeline
            .fromTo(
              element,
              {
                filter: "blur(4px)",
                opacity: 0,
                scale: 0.5,
                x: -driftX * 0.4,
                y: -driftY * 0.4,
              },
              {
                duration: 1.2,
                ease: "power2.out",
                filter: "blur(0px)",
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
              }
            )
            // Subtle random floating drift while staying readable at normal size
            .to(element, {
              duration: 2.0,
              ease: "sine.inOut",
              x: driftX * 0.5,
              y: driftY * 0.5,
            })
            // 2. Medium text (scale: 1.35) + fade out (opacity 1 -> 0) with continued movement
            .to(element, {
              duration: 1.2,
              ease: "power2.in",
              filter: "blur(3px)",
              opacity: 0,
              scale: 1.35,
              x: driftX,
              y: driftY,
            })

          // Add to master timeline with 2.0s overlap:
          // The next text starts 2.0 seconds BEFORE the current text finishes fading out (beririsan)
          masterTimeline.add(itemTimeline, itemIndex === 0 ? 0 : "-=2.0")
        })
      }, containerRef)

      return () => {
        ctx.revert()
      }
    }, [isReady, opinionList])

    return (
      <div ref={containerRef} className={styles.opinionsContainer}>
        {opinionList.map((item, idx) => {
          const positionClass =
            positionClassMap[item.position] ?? styles.positionMiddleLeft

          return (
            <div
              key={item.id}
              ref={(el) => {
                itemRefs.current[idx] = el
              }}
              className={`floating-opinion-item ${styles.opinionWrapper} ${positionClass}`}
            >
              <p className={styles.opinionText}>{item.text}</p>
            </div>
          )
        })}
      </div>
    )
  }
)

FloatingOpinion.displayName = "FloatingOpinion"

export default FloatingOpinion
