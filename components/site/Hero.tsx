"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Award, Star, CheckCircle } from "lucide-react"

const phases = [
  {
    id: "dream",
    label: "Dream It",
    tagline: "Your vision, our blueprint",
    description: "Every great home starts as an idea. Tell us your dream — we'll draw the plans.",
    image: "/contractor-measuring-and-planning-home-renovation.jpg",
    alt: "Contractor planning a home renovation with blueprints",
    services: ["Design Consultation", "3D Visualization", "Permits & Planning"],
  },
  {
    id: "build",
    label: "Build It",
    tagline: "Precision craftsmanship, every detail",
    description: "Licensed crews, premium materials, and relentless attention to detail from foundation to finish.",
    image: "/construction-team-working-on-residential-project.jpg",
    alt: "Construction team working on residential remodeling project",
    services: ["Kitchen & Bath", "Additions & Decks", "Roofing & Structure"],
  },
  {
    id: "live",
    label: "Live It",
    tagline: "Welcome home",
    description: "The moment you walk in and it takes your breath away. That's what we build for.",
    image: "/modern-luxury-kitchen-remodel-with-white-cabinets-.jpg",
    alt: "Stunning modern luxury kitchen remodel with white cabinets",
    services: ["Custom Homes", "Basement Finishing", "Commercial Buildouts"],
  },
]

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

      {/* Overlay — gradient + blueprint grid pattern */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-secondary/95 via-secondary/85 to-secondary/50" />

      {/* Animated blueprint grid lines */}
      <div className="absolute inset-0 z-[2] opacity-[0.04] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blueprint" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueprint)" />
        </svg>
      </div>

      {/* Animated sketch lines that draw in — architectural feel */}
      <svg
        className="absolute inset-0 z-[3] w-full h-full pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* House outline sketch — draws on during "dream" phase */}
        <g
          className="transition-opacity duration-1000"
          style={{ opacity: activePhase === 0 ? 0.12 : activePhase === 1 ? 0.06 : 0.03 }}
        >
          {/* Roof line */}
          <path
            d="M 900 250 L 1050 150 L 1200 250"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="400"
            className="animate-sketch"
          />
          {/* House body */}
          <path
            d="M 920 250 L 920 450 L 1180 450 L 1180 250"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="600"
            className="animate-sketch-delayed"
          />
          {/* Door */}
          <path
            d="M 1020 450 L 1020 350 L 1080 350 L 1080 450"
            fill="none"
            stroke="white"
            strokeWidth="0.8"
            strokeDasharray="300"
            className="animate-sketch-slow"
          />
          {/* Windows */}
          <rect x="940" y="280" width="50" height="40" fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="200" className="animate-sketch-delayed" />
          <rect x="1110" y="280" width="50" height="40" fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="200" className="animate-sketch-slow" />
          {/* Dimension lines */}
          <line x1="900" y1="470" x2="1200" y2="470" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" className="animate-sketch-slow" opacity="0.5" />
          <line x1="880" y1="150" x2="880" y2="450" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" className="animate-sketch-slow" opacity="0.5" />
        </g>
      </svg>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Phase badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Award className="h-4 w-4 text-accent" />
            <span className="text-xs sm:text-sm font-medium text-white">Best of Houzz 2025 Winner</span>
          </div>

          {/* Phase tagline — animated */}
          <div
            className={`transition-all duration-500 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
          >
            <p className="text-accent font-semibold tracking-wide uppercase text-sm mb-3">
              {phase.label}
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {activePhase === 0 && (
                <>From Blueprint to <span className="text-accent">Beautiful</span></>
              )}
              {activePhase === 1 && (
                <>Built with <span className="text-accent">Precision</span> & Pride</>
              )}
              {activePhase === 2 && (
                <>Your Dream, <span className="text-accent">Delivered</span></>
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
                  className="inline-flex items-center gap-1.5 bg-white/8 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5 text-xs sm:text-sm text-white/90 transition-all duration-500"
                  style={{ transitionDelay: `${i * 100}ms` }}
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

          {/* Timeline phase selector */}
          <div className="mt-12 sm:mt-16 border-t border-white/15 pt-6 sm:pt-8">
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
                  {/* Progress bar for active phase */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-100 ease-linear rounded-full"
                      style={{
                        width: i === activePhase ? `${progress}%` : i < activePhase ? "100%" : "0%",
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-xs font-mono transition-colors ${
                        i === activePhase ? "text-accent" : "text-white/40"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`text-sm sm:text-base font-bold transition-colors ${
                        i === activePhase ? "text-white" : "text-white/50 group-hover:text-white/70"
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
      </div>

      {/* Stats + trust bar at bottom */}
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
                <p className="text-xs sm:text-sm font-medium text-foreground">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
