"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Award, Star, CheckCircle } from "lucide-react"

/* ── Phase data ─────────────────────────────────────────────── */

const phases = [
  {
    id: "dream",
    label: "Dream It",
    tagline: "Your vision, our blueprint",
    description:
      "Every great home starts as an idea. Share your vision — we'll draft the plans, pull the permits, and map every detail before a single nail is driven.",
    image: "/custom-new-construction-home-exterior.jpg",
    alt: "Custom new construction home exterior in Pittsburgh PA",
    services: ["Design Consultation", "3D Visualization", "Permits & Planning"],
  },
  {
    id: "build",
    label: "Build It",
    tagline: "Precision craftsmanship, every detail",
    description:
      "Licensed crews, premium materials, and relentless attention to detail. From foundation to finish, we build it right the first time.",
    image: "/home-addition-construction.jpg",
    alt: "Home addition under construction in Pittsburgh neighborhood",
    services: ["Kitchen & Bath", "Additions & Decks", "Roofing & Structure"],
  },
  {
    id: "live",
    label: "Live It",
    tagline: "Welcome home",
    description:
      "The moment you walk in and it takes your breath away. That's what we build for — homes you'll love for a lifetime.",
    image: "/modern-luxury-kitchen-remodel-with-white-cabinets-.jpg",
    alt: "Stunning luxury kitchen remodel with white cabinets and quartz countertops",
    services: ["Custom Homes", "Basement Finishing", "Commercial Buildouts"],
  },
]

/* ── Roadmap steps ──────────────────────────────────────────── */

const roadmapSteps = [
  { label: "Free Consultation", phase: 0, icon: "phone" },
  { label: "Design & Blueprint", phase: 0, icon: "pencil" },
  { label: "Permits & Approvals", phase: 1, icon: "file" },
  { label: "Construction", phase: 1, icon: "hammer" },
  { label: "Quality Inspection", phase: 2, icon: "search" },
  { label: "Welcome Home", phase: 2, icon: "home" },
]

/* ── Step icons (inline SVG paths) ──────────────────────────── */

function StepIcon({ type, className }: { type: string; className?: string }) {
  const c = className || "w-4 h-4"
  const paths: Record<string, string> = {
    phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
    pencil: "M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z",
    file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    hammer: "M15 12l-8.5 8.5a2.12 2.12 0 01-3-3L12 9 M17.64 15L22 10.64 M20.91 11.7l-1.25-1.25a.47.47 0 010-.67l4.34-4.34a.47.47 0 000-.67l-2.07-2.07a.47.47 0 00-.67 0L8.91 15.05",
    search: "M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.35-4.35 M11 8v6 M8 11h6",
    home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M9 22V12h6v10",
  }
  return (
    <svg
      className={c}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[type]?.split(" M").map((d, i) => (
        <path key={i} d={i === 0 ? d : `M${d}`} />
      ))}
    </svg>
  )
}

/* ── Animated Roadmap ───────────────────────────────────────── */

function AnimatedRoadmap({ activePhase, progress }: { activePhase: number; progress: number }) {
  // Calculate which step is "active" based on phase + progress
  const phaseStepStart = activePhase * 2
  const subProgress = progress / 100
  const activeStep = phaseStepStart + (subProgress > 0.5 ? 1 : 0)
  const completedSteps = phaseStepStart + (subProgress > 0.5 ? 1 : 0)

  return (
    <div className="relative w-full max-w-xs mx-auto">
      {/* Glassmorphism container */}
      <div className="relative bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-semibold tracking-widest uppercase text-white/60">
            Your Project Journey
          </span>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connecting line — background */}
          <div className="absolute left-[15px] top-[20px] bottom-[20px] w-[2px] bg-white/10 rounded-full" />

          {/* Vertical connecting line — progress fill */}
          <div
            className="absolute left-[15px] top-[20px] w-[2px] bg-gradient-to-b from-accent to-accent/60 rounded-full transition-all duration-700 ease-out"
            style={{
              height: `${Math.min((completedSteps / (roadmapSteps.length - 1)) * 100, 100)}%`,
              maxHeight: "calc(100% - 40px)",
            }}
          />

          <div className="space-y-5 relative">
            {roadmapSteps.map((step, i) => {
              const isCompleted = i < completedSteps
              const isActive = i === activeStep
              const isPending = i > completedSteps

              return (
                <div key={step.label} className="flex items-center gap-3 group">
                  {/* Node */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`
                        w-[32px] h-[32px] rounded-full flex items-center justify-center
                        transition-all duration-500 border-2
                        ${isActive
                          ? "border-accent bg-accent/20 shadow-[0_0_16px_rgba(26,138,106,0.4)]"
                          : isCompleted
                            ? "border-accent/80 bg-accent/30"
                            : "border-white/15 bg-white/5"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-3.5 h-3.5 text-accent"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            d="M20 6L9 17l-5-5"
                            className="animate-check-draw"
                            strokeDasharray="24"
                            strokeDashoffset="0"
                          />
                        </svg>
                      ) : isActive ? (
                        <StepIcon
                          type={step.icon}
                          className="w-3.5 h-3.5 text-accent"
                        />
                      ) : (
                        <StepIcon
                          type={step.icon}
                          className="w-3.5 h-3.5 text-white/30"
                        />
                      )}
                    </div>

                    {/* Pulse ring on active */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full border-2 border-accent/40 animate-ping-slow" />
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className={`transition-all duration-500 ${
                      isPending ? "opacity-40" : "opacity-100"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium block leading-tight ${
                        isActive
                          ? "text-white"
                          : isCompleted
                            ? "text-white/80"
                            : "text-white/40"
                      }`}
                    >
                      {step.label}
                    </span>
                    {isActive && (
                      <span className="text-[11px] text-accent/80 mt-0.5 block">
                        In progress...
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[11px] text-white/40 mt-0.5 block">
                        Complete
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom stat */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-white/40 uppercase tracking-wider">Project Progress</p>
            <p className="text-lg font-bold text-white mt-0.5">
              {Math.round(((activePhase * 2 + (progress > 50 ? 2 : 1)) / roadmapSteps.length) * 100)}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-white/40 uppercase tracking-wider">Current Phase</p>
            <p className="text-sm font-semibold text-accent mt-0.5">
              {phases[activePhase].label}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Hero ──────────────────────────────────────────────── */

export function Hero() {
  const [activePhase, setActivePhase] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const advancePhase = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setActivePhase((prev) => (prev + 1) % phases.length)
      setProgress(0)
      setIsTransitioning(false)
    }, 600)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          advancePhase()
          return 0
        }
        return prev + 0.5
      })
    }, 40)
    return () => clearInterval(interval)
  }, [advancePhase])

  const handlePhaseClick = (index: number) => {
    if (index === activePhase) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActivePhase(index)
      setProgress(0)
      setIsTransitioning(false)
    }, 400)
  }

  const phase = phases[activePhase]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-secondary">
      {/* Background images — all preloaded, opacity-switched */}
      {phases.map((p, i) => (
        <div
          key={p.id}
          className="absolute inset-0 z-0 transition-opacity duration-1000"
          style={{ opacity: i === activePhase && !isTransitioning ? 1 : 0 }}
        >
          <Image
            src={p.image}
            alt={p.alt}
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-secondary/[0.97] via-secondary/90 to-secondary/60 lg:to-secondary/40" />

      {/* Subtle blueprint grid */}
      <div className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content — two-column on desktop */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid lg:grid-cols-[1fr_340px] gap-12 lg:gap-16 items-center">

          {/* Left — text content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Award className="h-4 w-4 text-accent" />
              <span className="text-xs sm:text-sm font-medium text-white">
                Best of Houzz 2025 Winner
              </span>
            </div>

            {/* Animated content per phase */}
            <div
              className={`transition-all duration-500 ${
                isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              }`}
            >
              <p className="text-accent font-semibold tracking-wide uppercase text-sm mb-3">
                {phase.label}
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                {activePhase === 0 && (
                  <>From Blueprint to{" "}<span className="text-accent">Beautiful</span></>
                )}
                {activePhase === 1 && (
                  <>Built with{" "}<span className="text-accent">Precision</span> & Pride</>
                )}
                {activePhase === 2 && (
                  <>Your Dream,{" "}<span className="text-accent">Delivered</span></>
                )}
              </h1>

              <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/80 max-w-xl">
                {phase.description}
              </p>

              {/* Service pills */}
              <div className="mt-5 flex flex-wrap gap-2">
                {phase.services.map((service, i) => (
                  <span
                    key={service}
                    className="inline-flex items-center gap-1.5 bg-white/[0.07] backdrop-blur-sm border border-white/[0.12] rounded-full px-3 py-1.5 text-xs sm:text-sm text-white/90"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <span className="w-1 h-1 rounded-full bg-accent" />
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/free-estimate">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg px-6 sm:px-8 text-base"
                >
                  Get Your Free Estimate
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 bg-transparent px-6 sm:px-8 text-base"
                >
                  View Our Work
                </Button>
              </Link>
            </div>

            {/* Phase timeline selector */}
            <div className="mt-10 sm:mt-14 border-t border-white/15 pt-6">
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {phases.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => handlePhaseClick(i)}
                    className={`group relative text-left p-3 sm:p-4 rounded-xl transition-all duration-300 ${
                      i === activePhase
                        ? "bg-white/10 backdrop-blur-sm"
                        : "hover:bg-white/5"
                    }`}
                  >
                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all duration-100 ease-linear rounded-full"
                        style={{
                          width:
                            i === activePhase
                              ? `${progress}%`
                              : i < activePhase
                                ? "100%"
                                : "0%",
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-mono transition-colors ${
                          i === activePhase ? "text-accent" : "text-white/40"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <span
                        className={`text-sm sm:text-base font-bold transition-colors ${
                          i === activePhase
                            ? "text-white"
                            : "text-white/50 group-hover:text-white/70"
                        }`}
                      >
                        {p.label}
                      </span>
                    </div>
                    <p
                      className={`text-xs transition-colors hidden sm:block ${
                        i === activePhase ? "text-white/70" : "text-white/30"
                      }`}
                    >
                      {p.tagline}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — animated roadmap (hidden on mobile) */}
          <div className="hidden lg:block">
            <AnimatedRoadmap activePhase={activePhase} progress={progress} />
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-12">
            {[
              { icon: Shield, label: "PA Licensed #PA163301" },
              { icon: CheckCircle, label: "Fully Insured" },
              { icon: Award, label: "Best of Houzz 2025" },
              { icon: Star, label: "5-Star Rated" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 sm:gap-2">
                <badge.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  {badge.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
