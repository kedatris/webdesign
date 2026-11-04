import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

import type { OnboardingSubStep } from "@/components/OnboardingStep/types"
import type { OpinionItem, TtsResponse } from "@/server/types"
import { appService } from "@/services/appService"

import { DEFAULT_OPINIONS, STEP_TWO_SLIDES } from "./constants"
import type { UseViewReturn } from "./types"

const useView = (): UseViewReturn => {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0)
  const [email, setEmail] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [firstName, setFirstName] = useState<string>("")
  const [isGemReady, setIsGemReady] = useState<boolean>(false)
  const [isGetStartedReady, setIsGetStartedReady] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [isStepThree, setIsStepThree] = useState<boolean>(false)
  const [isStepTwo, setIsStepTwo] = useState<boolean>(false)
  const [onboardingSubStep, setOnboardingSubStep] =
    useState<OnboardingSubStep>("name")
  const [opinions, setOpinions] = useState<OpinionItem[]>(DEFAULT_OPINIONS)

  const animFrameRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const isInitialMount = useRef<boolean>(true)
  const isTransitioningRef = useRef<boolean>(false)
  const ttsCacheRef = useRef<Map<string, TtsResponse>>(new Map())
  const ttsTimelineRef = useRef<gsap.core.Timeline | null>(null)

  const currentSlideText =
    STEP_TWO_SLIDES[activeSlideIndex] ?? STEP_TWO_SLIDES[0]
  const totalSlides = STEP_TWO_SLIDES.length

  // Initial data load from Hono backend
  useEffect(() => {
    let isCancelled = false

    const loadInitialOpinions = async () => {
      try {
        const fetched = await appService.getOpinions()
        if (!isCancelled && fetched && fetched.length > 0) {
          setOpinions(fetched)
        }
      } catch (err) {
        if (!isCancelled) {
          const message =
            err instanceof Error ? err.message : "Using local data"
          setError(message)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadInitialOpinions()

    return () => {
      isCancelled = true
    }
  }, [])

  // Master GSAP animation: entrance timeline + organic random living glowing sides
  useEffect(() => {
    if (isLoading) {
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      })

      // Entrance timeline
      tl.fromTo(
        ".logo-header",
        { opacity: 0, y: -20 },
        { duration: 0.6, opacity: 1, y: 0 }
      )
        .fromTo(
          ".refresh-btn",
          { opacity: 0, rotation: -60, scale: 0.7 },
          { duration: 0.5, opacity: 1, rotation: 0, scale: 1 },
          "-=0.35"
        )
        .fromTo(
          ".gem-container",
          { opacity: 0, scale: 0.8 },
          {
            duration: 1.0,
            ease: "back.out(1.15)",
            onComplete: () => {
              setIsGemReady(true)
            },
            opacity: 1,
            scale: 1,
          },
          "-=0.3"
        )
        .fromTo(
          ".hero-heading",
          { opacity: 0, y: 22 },
          { duration: 0.7, opacity: 1, y: 0 },
          "-=0.4"
        )
        .fromTo(
          ".cta-button",
          { opacity: 0, scale: 0.94, y: 24 },
          {
            duration: 0.65,
            ease: "back.out(1.4)",
            opacity: 1,
            scale: 1,
            y: 0,
          },
          "-=0.45"
        )

      // Smooth, vivid, continuous random wander for glowing sides around SVG
      const animateRandomGlow = (
        selector: string,
        rangeX: number,
        rangeY: number,
        minDuration: number,
        maxDuration: number
      ) => {
        const move = () => {
          const el = document.querySelector(selector)
          if (!el) {
            return
          }

          const targetX = (Math.random() - 0.5) * rangeX * 2
          const targetY = (Math.random() - 0.5) * rangeY * 2
          const targetScale = 0.94 + Math.random() * 0.42
          const targetOpacity = 0.65 + Math.random() * 0.35
          const duration =
            minDuration + Math.random() * (maxDuration - minDuration)

          gsap.to(selector, {
            duration,
            ease: "sine.inOut",
            opacity: targetOpacity,
            scale: targetScale,
            x: targetX,
            y: targetY,
            onComplete: move,
          })
        }
        move()
      }

      // Staggered multi-layer random glowing lobes with larger, clearly noticeable motion
      animateRandomGlow(".glow-cyan", 32, 28, 2.6, 4.2)
      animateRandomGlow(".glow-purple", 36, 32, 3.0, 4.6)
      animateRandomGlow(".glow-blue", 28, 26, 2.8, 4.4)
      animateRandomGlow(".glow-violet", 30, 28, 3.2, 4.8)
      animateRandomGlow(".glow-core", 20, 20, 3.6, 5.2)

      // Living breath for the vector image itself
      gsap.to(".gem-vector-img", {
        duration: 3.4,
        ease: "sine.inOut",
        repeat: -1,
        rotation: 1.2,
        scale: 1.025,
        x: "+=3",
        y: "+=6",
        yoyo: true,
      })
    })

    return () => {
      ctx.revert()
    }
  }, [isLoading])

  const stopSpeech = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    if (ttsTimelineRef.current) {
      ttsTimelineRef.current.kill()
      ttsTimelineRef.current = null
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }
    gsap.to(
      [
        ".glow-cyan",
        ".glow-purple",
        ".glow-blue",
        ".glow-violet",
        ".glow-core",
        ".gem-vector-img",
      ],
      {
        clearProps: "transform,opacity",
        duration: 0.5,
        ease: "power2.out",
      }
    )
  }

  // GSAP animation & ElevenLabs synchronized TTS for Step 2 statement text
  useEffect(() => {
    if (!isStepTwo || isStepThree) {
      stopSpeech()
      return
    }

    stopSpeech()
    let isCancelled = false

    const ctx = gsap.context(() => {
      // 1. Initial state: muted color for all characters
      gsap.set(".statement-char", {
        color: "rgba(255, 255, 255, 0.25)",
        textShadow: "none",
      })

      // 2. Timeline for Step 2 presentation
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
      })

      // Back button appears smoothly on first entrance
      if (activeSlideIndex === 0) {
        tl.fromTo(
          ".back-button-anim",
          { opacity: 0, scale: 0.8 },
          { duration: 0.4, ease: "back.out(1.3)", opacity: 1, scale: 1 }
        )
      }

      // All text appears with fadeIn + slideUp in muted/disabled color
      tl.fromTo(
        ".statement-text",
        { opacity: 0, y: 22 },
        { duration: 0.55, ease: "power3.out", opacity: 1, y: 0 },
        activeSlideIndex === 0 ? "-=0.2" : 0
      )

      // Pagination dots and Continue button fade in smoothly on first entrance
      if (activeSlideIndex === 0) {
        tl.fromTo(
          [".dot-pagination-anim", ".continue-button-anim"],
          { opacity: 0, y: 16 },
          {
            duration: 0.5,
            ease: "power2.out",
            opacity: 1,
            stagger: 0.1,
            y: 0,
          },
          "-=0.3"
        )
      }
    })

    // Prefetch all Step 2 slides in background so transitions have zero latency
    STEP_TWO_SLIDES.forEach((slide) => {
      if (!ttsCacheRef.current.has(slide)) {
        void appService
          .generateSpeech(slide)
          .then((res) => {
            if (res) {
              ttsCacheRef.current.set(slide, res)
            }
          })
          .catch(() => {})
      }
    })

    // Synchronize ElevenLabs TTS with individual characters
    const playSynchronizedSpeech = async () => {
      try {
        let ttsData = ttsCacheRef.current.get(currentSlideText)
        if (!ttsData) {
          ttsData = await appService.generateSpeech(currentSlideText)
          if (ttsData) {
            ttsCacheRef.current.set(currentSlideText, ttsData)
          }
        }

        if (isCancelled || !ttsData) {
          return
        }

        const audio = new Audio(`data:audio/mp3;base64,${ttsData.audioBase64}`)
        currentAudioRef.current = audio

        // Real-time audio spectrum analysis to make orbs and gem move with ElevenLabs speech
        try {
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext
          if (AudioCtx) {
            if (!audioContextRef.current) {
              audioContextRef.current = new AudioCtx()
            }
            if (audioContextRef.current.state === "suspended") {
              void audioContextRef.current.resume()
            }

            const actx = audioContextRef.current
            const analyser = actx.createAnalyser()
            analyser.fftSize = 64
            analyser.smoothingTimeConstant = 0.72

            const source = actx.createMediaElementSource(audio)
            source.connect(analyser)
            analyser.connect(actx.destination)

            const dataArray = new Uint8Array(analyser.frequencyBinCount)

            const updateAudioReactivity = () => {
              if (
                !currentAudioRef.current ||
                currentAudioRef.current.paused ||
                currentAudioRef.current.ended
              ) {
                return
              }

              analyser.getByteFrequencyData(dataArray)

              let total = 0
              let bassTotal = 0
              let midTotal = 0
              const binCount = dataArray.length

              for (let i = 0; i < binCount; i++) {
                const val = dataArray[i]
                total += val
                if (i < binCount * 0.35) {
                  bassTotal += val
                } else if (i < binCount * 0.75) {
                  midTotal += val
                }
              }

              const volume = total / (binCount * 255)
              const bass = bassTotal / (binCount * 0.35 * 255)
              const mids = midTotal / (binCount * 0.4 * 255)

              const glowCyan = document.querySelector<HTMLElement>(".glow-cyan")
              const glowPurple =
                document.querySelector<HTMLElement>(".glow-purple")
              const glowBlue = document.querySelector<HTMLElement>(".glow-blue")
              const glowViolet =
                document.querySelector<HTMLElement>(".glow-violet")
              const glowCore = document.querySelector<HTMLElement>(".glow-core")
              const gemVector =
                document.querySelector<HTMLElement>(".gem-vector-img")

              if (glowCyan) {
                glowCyan.style.transform = `translate(${-14 - mids * 32}px, ${-10 + bass * 22}px) scale(${1 + volume * 0.55})`
                glowCyan.style.opacity = `${0.65 + volume * 0.35}`
              }
              if (glowPurple) {
                glowPurple.style.transform = `translate(${14 + mids * 36}px, ${-8 - bass * 20}px) scale(${1 + mids * 0.6})`
                glowPurple.style.opacity = `${0.65 + volume * 0.35}`
              }
              if (glowBlue) {
                glowBlue.style.transform = `translate(${-12 + bass * 26}px, ${10 + volume * 28}px) scale(${1 + bass * 0.5})`
                glowBlue.style.opacity = `${0.6 + volume * 0.4}`
              }
              if (glowViolet) {
                glowViolet.style.transform = `translate(${12 - mids * 24}px, ${10 + bass * 28}px) scale(${1 + volume * 0.5})`
                glowViolet.style.opacity = `${0.65 + volume * 0.35}`
              }
              if (glowCore) {
                glowCore.style.transform = `scale(${1 + volume * 0.65})`
                glowCore.style.opacity = `${0.6 + volume * 0.4}`
              }
              if (gemVector) {
                gemVector.style.transform = `translateY(${-bass * 10}px) scale(${1 + volume * 0.08})`
              }

              animFrameRef.current = requestAnimationFrame(
                updateAudioReactivity
              )
            }

            animFrameRef.current = requestAnimationFrame(updateAudioReactivity)
          }
        } catch {
          // Audio source fallback if already connected
        }

        // Real-time audio spectrum analysis to make orbs and gem move with ElevenLabs speech
        try {
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext
          if (AudioCtx) {
            if (!audioContextRef.current) {
              audioContextRef.current = new AudioCtx()
            }
            if (audioContextRef.current.state === "suspended") {
              void audioContextRef.current.resume()
            }

            const actx = audioContextRef.current
            const analyser = actx.createAnalyser()
            analyser.fftSize = 64
            analyser.smoothingTimeConstant = 0.72

            const source = actx.createMediaElementSource(audio)
            source.connect(analyser)
            analyser.connect(actx.destination)

            const dataArray = new Uint8Array(analyser.frequencyBinCount)

            const updateAudioReactivity = () => {
              if (
                !currentAudioRef.current ||
                currentAudioRef.current.paused ||
                currentAudioRef.current.ended
              ) {
                return
              }

              analyser.getByteFrequencyData(dataArray)

              let total = 0
              let bassTotal = 0
              let midTotal = 0
              const binCount = dataArray.length

              for (let i = 0; i < binCount; i++) {
                const val = dataArray[i]
                total += val
                if (i < binCount * 0.35) {
                  bassTotal += val
                } else if (i < binCount * 0.75) {
                  midTotal += val
                }
              }

              const volume = total / (binCount * 255)
              const bass = bassTotal / (binCount * 0.35 * 255)
              const mids = midTotal / (binCount * 0.4 * 255)

              const glowCyan = document.querySelector<HTMLElement>(".glow-cyan")
              const glowPurple =
                document.querySelector<HTMLElement>(".glow-purple")
              const glowBlue = document.querySelector<HTMLElement>(".glow-blue")
              const glowViolet =
                document.querySelector<HTMLElement>(".glow-violet")
              const glowCore = document.querySelector<HTMLElement>(".glow-core")
              const gemVector =
                document.querySelector<HTMLElement>(".gem-vector-img")

              if (glowCyan) {
                glowCyan.style.transform = `translate(${-14 - mids * 32}px, ${-10 + bass * 22}px) scale(${1 + volume * 0.55})`
                glowCyan.style.opacity = `${0.65 + volume * 0.35}`
              }
              if (glowPurple) {
                glowPurple.style.transform = `translate(${14 + mids * 36}px, ${-8 - bass * 20}px) scale(${1 + mids * 0.6})`
                glowPurple.style.opacity = `${0.65 + volume * 0.35}`
              }
              if (glowBlue) {
                glowBlue.style.transform = `translate(${-12 + bass * 26}px, ${10 + volume * 28}px) scale(${1 + bass * 0.5})`
                glowBlue.style.opacity = `${0.6 + volume * 0.4}`
              }
              if (glowViolet) {
                glowViolet.style.transform = `translate(${12 - mids * 24}px, ${10 + bass * 28}px) scale(${1 + volume * 0.5})`
                glowViolet.style.opacity = `${0.65 + volume * 0.35}`
              }
              if (glowCore) {
                glowCore.style.transform = `scale(${1 + volume * 0.65})`
                glowCore.style.opacity = `${0.6 + volume * 0.4}`
              }
              if (gemVector) {
                gemVector.style.transform = `translateY(${-bass * 10}px) scale(${1 + volume * 0.08})`
              }

              animFrameRef.current = requestAnimationFrame(
                updateAudioReactivity
              )
            }

            animFrameRef.current = requestAnimationFrame(updateAudioReactivity)
          }
        } catch {
          // Audio source fallback if already connected
        }

        const charElements =
          document.querySelectorAll<HTMLElement>(".statement-char")
        const syncTimeline = gsap.timeline({ paused: true })
        ttsTimelineRef.current = syncTimeline

        const alignment = ttsData.alignment
        const startTimes = alignment.characterStartTimesSeconds

        startTimes.forEach((time, index) => {
          const charEl = charElements[index]
          if (charEl) {
            syncTimeline.to(
              charEl,
              {
                color: "#ffffff",
                duration: 0.18,
                ease: "power1.out",
                textShadow: "0 0 14px rgba(255, 255, 255, 0.4)",
              },
              time
            )
          }
        })

        audio.ontimeupdate = () => {
          if (
            syncTimeline &&
            Math.abs(syncTimeline.time() - audio.currentTime) > 0.15
          ) {
            syncTimeline.time(audio.currentTime)
          }
        }

        audio.onended = () => {
          if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current)
            animFrameRef.current = null
          }
          gsap.to(
            [
              ".glow-cyan",
              ".glow-purple",
              ".glow-blue",
              ".glow-violet",
              ".glow-core",
              ".gem-vector-img",
            ],
            {
              clearProps: "transform,opacity",
              duration: 0.6,
              ease: "power2.out",
            }
          )
          gsap.to(".statement-char", {
            color: "#ffffff",
            duration: 0.15,
            textShadow: "0 0 14px rgba(255, 255, 255, 0.4)",
          })
          if (activeSlideIndex === 2) {
            setIsGetStartedReady(true)
            gsap.fromTo(
              ".get-started-button-anim",
              { opacity: 0.8, scale: 0.94 },
              { duration: 0.45, ease: "back.out(1.5)", opacity: 1, scale: 1 }
            )
          }
        }

        await audio.play()
        syncTimeline.play()
      } catch {
        // Fallback: standard character stagger if audio is blocked or fails
        if (!isCancelled) {
          gsap.to(".statement-char", {
            color: "#ffffff",
            duration: 0.22,
            ease: "power1.out",
            stagger: 0.022,
            textShadow: "0 0 14px rgba(255, 255, 255, 0.35)",
            onComplete: () => {
              if (activeSlideIndex === 2) {
                setIsGetStartedReady(true)
                gsap.fromTo(
                  ".get-started-button-anim",
                  { opacity: 0.8, scale: 0.94 },
                  {
                    duration: 0.45,
                    ease: "back.out(1.5)",
                    opacity: 1,
                    scale: 1,
                  }
                )
              }
            },
          })
        }
      }
    }

    void playSynchronizedSpeech()

    return () => {
      isCancelled = true
      stopSpeech()
      ctx.revert()
    }
  }, [activeSlideIndex, currentSlideText, isStepThree, isStepTwo])

  // GSAP animation for initial Step 3 entrance (Hexagon appears once, never rerendered on sub-steps)
  useEffect(() => {
    if (!isStepThree) {
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(
        ".step-three-visual-anim",
        { opacity: 0, scale: 0.7, y: -20 },
        { duration: 0.65, ease: "back.out(1.2)", opacity: 1, scale: 1, y: 0 }
      )
    })

    return () => {
      ctx.revert()
    }
  }, [isStepThree])

  // GSAP animation for prompt headlines and inputs on sub-step change
  useEffect(() => {
    if (!isStepThree) {
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(
        ".step-three-headline-anim",
        { opacity: 0, y: 18 },
        { duration: 0.5, ease: "power3.out", opacity: 1, y: 0 }
      ).fromTo(
        [".name-input-anim", ".confirmation-button-anim"],
        { opacity: 0, scale: 0.96, y: 20 },
        { duration: 0.5, ease: "back.out(1.3)", opacity: 1, scale: 1, y: 0 },
        "-=0.3"
      )
    })

    return () => {
      ctx.revert()
    }
  }, [isStepThree, onboardingSubStep])

  // Re-entrance animation for Step 1 when returning via Back button or Refresh
  useEffect(() => {
    if (isLoading) {
      return
    }

    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (!isStepTwo && !isStepThree) {
      gsap.fromTo(
        ".gem-container",
        { opacity: 0, scale: 0.88 },
        {
          duration: 0.6,
          ease: "back.out(1.15)",
          opacity: 1,
          scale: 1,
          onComplete: () => {
            setIsGemReady(true)
          },
        }
      )
      gsap.fromTo(
        [".hero-heading", ".cta-button"],
        { opacity: 0, y: 20 },
        { duration: 0.55, ease: "power2.out", opacity: 1, stagger: 0.12, y: 0 }
      )
    }
  }, [isLoading, isStepThree, isStepTwo])

  const handleCtaClick = () => {
    // Transition out step 1 elements
    gsap.to([".hero-heading", ".cta-button"], {
      duration: 0.35,
      ease: "power2.in",
      opacity: 0,
      y: 16,
      onComplete: () => {
        setActiveSlideIndex(0)
        setIsGetStartedReady(false)
        setIsStepTwo(true)
      },
    })
  }

  const handleBackClick = () => {
    stopSpeech()
    if (isTransitioningRef.current) {
      return
    }

    // If currently on Step 3:
    if (isStepThree) {
      // If currently on 'confirmation' sub-step, go back to 'email' sub-step
      if (onboardingSubStep === "confirmation") {
        gsap.to([".step-three-headline-anim", ".confirmation-button-anim"], {
          duration: 0.28,
          ease: "power2.in",
          opacity: 0,
          y: 14,
          onComplete: () => {
            setOnboardingSubStep("email")
          },
        })
        return
      }

      // If currently on 'email' sub-step, go back to 'name' sub-step
      if (onboardingSubStep === "email") {
        gsap.to([".step-three-headline-anim", ".name-input-anim"], {
          duration: 0.28,
          ease: "power2.in",
          opacity: 0,
          y: 14,
          onComplete: () => {
            setOnboardingSubStep("name")
          },
        })
        return
      }

      // If on 'name' sub-step, transition back to Step 2 (Slide 2)
      gsap.to([".step-three-visual-anim", ".name-input-anim"], {
        duration: 0.3,
        ease: "power2.in",
        opacity: 0,
        y: 16,
        onComplete: () => {
          setIsStepThree(false)
          setIsGetStartedReady(true)
        },
      })
      return
    }

    // If on Step 2 slide 1 or 2, navigate to previous slide
    if (activeSlideIndex > 0) {
      isTransitioningRef.current = true
      gsap.to(".statement-text", {
        duration: 0.28,
        ease: "power2.in",
        opacity: 0,
        y: 14,
        onComplete: () => {
          setActiveSlideIndex((prev) => prev - 1)
          setIsGetStartedReady(false)
          isTransitioningRef.current = false
        },
      })
      return
    }

    // On slide 0, transition back to step 1
    gsap.to([".statement-container", ".back-button-anim"], {
      duration: 0.35,
      ease: "power2.in",
      opacity: 0,
      y: 16,
      onComplete: () => {
        setIsStepTwo(false)
        setActiveSlideIndex(0)
        setIsGetStartedReady(false)
        setIsGemReady(false)
      },
    })
  }

  const handleContinueClick = () => {
    stopSpeech()
    if (isTransitioningRef.current) {
      return
    }

    if (isStepThree && onboardingSubStep === "confirmation") {
      handleConfirmationContinue()
      return
    }

    // If on slide 2 and Get Started is ready, proceed to Step 3
    if (activeSlideIndex === 2 && isGetStartedReady) {
      handleGetStartedClick()
      return
    }

    if (activeSlideIndex < STEP_TWO_SLIDES.length - 1) {
      isTransitioningRef.current = true

      // Animate current text out with smooth fade & slight slide up
      gsap.to(".statement-text", {
        duration: 0.28,
        ease: "power2.in",
        opacity: 0,
        y: -14,
        onComplete: () => {
          setActiveSlideIndex((prev) => prev + 1)
          setIsGetStartedReady(false)
          isTransitioningRef.current = false
        },
      })
    } else {
      // Last slide button bounce
      gsap.fromTo(
        ".action-button-anim",
        { scale: 0.96 },
        { duration: 0.35, ease: "back.out(2)", scale: 1 }
      )
    }
  }

  const handleGetStartedClick = () => {
    stopSpeech()
    setOnboardingSubStep("name")
    // Transition out Step 2 elements into Step 3
    gsap.to([".statement-container", ".gem-container"], {
      duration: 0.35,
      ease: "power2.in",
      opacity: 0,
      y: -16,
      onComplete: () => {
        setIsStepThree(true)
      },
    })
  }

  const handleConfirmationContinue = () => {
    stopSpeech()
    // 1. Smoothly fade out headline, subtitle, confirmation button, and top bar
    gsap.to(
      [
        ".step-three-headline-anim",
        ".confirmation-button-anim",
        ".logo-header",
      ],
      {
        duration: 0.35,
        ease: "power2.out",
        opacity: 0,
        pointerEvents: "none",
      }
    )

    // 2. Calculate center offset so the hexagon expands directly from screen center
    const hexStage = document.querySelector<HTMLElement>(
      ".step-three-visual-anim"
    )
    let moveX = 0
    let moveY = 0

    if (hexStage) {
      const rect = hexStage.getBoundingClientRect()
      moveX = window.innerWidth / 2 - (rect.left + rect.width / 2)
      moveY = window.innerHeight / 2 - (rect.top + rect.height / 2)
    }

    // 3. Determine target scale to cover the entire viewport comfortably
    const maxDim = Math.max(window.innerWidth, window.innerHeight)
    const targetScale = Math.max(85, Math.ceil(maxDim / 12))

    // 4. Animate the hexagon to scale up until it fills the screen
    gsap.to(".step-three-visual-anim", {
      duration: 1.0,
      ease: "power3.inOut",
      scale: targetScale,
      x: moveX,
      y: moveY,
      zIndex: 50,
      transformOrigin: "center center",
    })
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value)
  }

  const handleNameSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (onboardingSubStep === "name") {
      if (!firstName.trim()) {
        return
      }

      // Transition smoothly from 'name' sub-step to 'email' sub-step
      gsap.to([".step-three-headline-anim", ".name-input-anim"], {
        duration: 0.28,
        ease: "power2.in",
        opacity: 0,
        y: -14,
        onComplete: () => {
          setOnboardingSubStep("email")
        },
      })
      return
    }

    if (onboardingSubStep === "email") {
      if (!email.trim() || !email.includes("@")) {
        return
      }

      // Transition smoothly from 'email' sub-step to 'confirmation' sub-step
      gsap.to([".step-three-headline-anim", ".name-input-anim"], {
        duration: 0.28,
        ease: "power2.in",
        opacity: 0,
        y: -14,
        onComplete: () => {
          setOnboardingSubStep("confirmation")
        },
      })
    }
  }

  const handleRefreshClick = () => {
    stopSpeech()
    if (isRefreshing) {
      return
    }

    setIsRefreshing(true)

    // Spin refresh icon with GSAP
    gsap.to(".refresh-icon", {
      duration: 0.65,
      ease: "power2.inOut",
      rotation: "+=360",
    })

    const wasOnOtherStep = isStepTwo || isStepThree

    // Clear any full-screen scaling and transforms on elements
    gsap.set(
      [
        ".step-three-visual-anim",
        ".step-three-headline-anim",
        ".confirmation-button-anim",
        ".logo-header",
      ],
      {
        clearProps: "all",
      }
    )

    // Reset all step states and form inputs back to initial screen
    setIsStepTwo(false)
    setIsStepThree(false)
    setActiveSlideIndex(0)
    setOnboardingSubStep("name")
    setFirstName("")
    setEmail("")
    setIsGetStartedReady(false)
    setIsGemReady(false)

    // If already on Step 1, trigger the entrance animation directly
    if (!wasOnOtherStep) {
      gsap.fromTo(
        ".gem-container",
        { opacity: 0.4, scale: 0.88 },
        {
          duration: 0.65,
          ease: "back.out(1.15)",
          opacity: 1,
          scale: 1,
          onComplete: () => {
            setIsGemReady(true)
          },
        }
      )
      gsap.fromTo(
        [".hero-heading", ".cta-button"],
        { opacity: 0, y: 18 },
        { duration: 0.5, ease: "power2.out", opacity: 1, stagger: 0.1, y: 0 }
      )
    }

    // Fetch fresh opinions from Hono backend
    void (async () => {
      try {
        const fresh = await appService.getRandomOpinions()
        if (fresh && fresh.length > 0) {
          setOpinions(fresh)
        } else {
          setOpinions((prev) => [...prev].reverse())
        }
      } catch {
        setOpinions((prev) => [...prev].reverse())
      } finally {
        setIsRefreshing(false)
        if (wasOnOtherStep) {
          setTimeout(() => {
            setIsGemReady(true)
          }, 400)
        }
      }
    })()
  }

  return {
    // Data (primitive & object) — alphabetical
    activeSlideIndex,
    currentSlideText,
    email,
    error,
    firstName,
    isGemReady,
    isGetStartedReady,
    isLoading,
    isRefreshing,
    isStepThree,
    isStepTwo,
    onboardingSubStep,
    opinions,
    totalSlides,
    // Functions — alphabetical
    handleBackClick,
    handleConfirmationContinue,
    handleContinueClick,
    handleCtaClick,
    handleEmailChange,
    handleFirstNameChange,
    handleGetStartedClick,
    handleNameSubmit,
    handleRefreshClick,
  }
}

export default useView
