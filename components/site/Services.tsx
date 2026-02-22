"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// ─── SVG Icons (unique per service) ──────────────────────────────────

function KitchenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="18" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y="22" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="33" cy="26" r="3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="34" x2="42" y2="34" stroke="currentColor" strokeWidth="1.5" />
      <rect x="18" y="36" width="4" height="4" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="26" y="36" width="4" height="4" rx="1" fill="currentColor" opacity="0.3" />
      <path d="M14 18V12C14 10.343 15.343 9 17 9H31C32.657 9 34 10.343 34 12V18" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="13" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

function BathroomIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 24H40V32C40 36.418 36.418 40 32 40H16C11.582 40 8 36.418 8 32V24Z" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="24" x2="8" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 10C8 8.343 9.343 7 11 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 7H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="24" cy="32" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <line x1="24" y1="40" x2="24" y2="44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="44" x2="28" y2="44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function BasementIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 20L24 8L42 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="8" y="20" width="32" height="8" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <rect x="8" y="28" width="32" height="14" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="32" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="28" y="32" width="8" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="28" x2="12" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <line x1="36" y1="28" x2="36" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    </svg>
  )
}

function DeckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="22" width="40" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="26" x2="8" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="26" x2="40" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="26" x2="24" y2="42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="4" y1="34" x2="44" y2="34" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="4" y1="38" x2="44" y2="38" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <rect x="6" y="8" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="38" y="8" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="10" x2="42" y2="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function AdditionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 22L16 12L28 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="6" y="22" width="20" height="18" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="12" y="30" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M28 26L36 20L44 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 2" />
      <rect x="30" y="26" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
      <line x1="28" y1="22" x2="28" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <circle cx="36" cy="33" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <line x1="34" y1="33" x2="38" y2="33" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="36" y1="31" x2="36" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  )
}

function FlooringIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 14L24 6L42 14V38L24 46L6 38V14Z" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="6" x2="24" y2="46" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="6" y1="14" x2="42" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <line x1="6" y1="26" x2="42" y2="26" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="6" y1="38" x2="42" y2="38" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <path d="M6 14L24 22L42 14" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path d="M6 26L24 34L42 26" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <rect x="16" y="16" width="6" height="6" rx="0.5" fill="currentColor" opacity="0.1" />
      <rect x="26" y="28" width="6" height="6" rx="0.5" fill="currentColor" opacity="0.1" />
    </svg>
  )
}

// ─── Service Data ────────────────────────────────────────────────────

const services = [
  {
    title: "Kitchen Remodeling",
    description: "Transform the heart of your home with custom cabinetry, premium countertops, and smart layouts that make cooking a joy.",
    image: "/modern-white-kitchen-renovation-with-island-and-pe.jpg",
    href: "/services/kitchen-remodeling",
    icon: KitchenIcon,
    gradient: "from-emerald-500/20 to-emerald-900/60",
  },
  {
    title: "Bathroom Renovation",
    description: "Create your personal spa retreat with walk-in showers, soaking tubs, and luxury finishes that elevate your daily routine.",
    image: "/luxury-master-bathroom-with-walk-in-shower-and-fre.jpg",
    href: "/services/bathroom-remodeling",
    icon: BathroomIcon,
    gradient: "from-sky-500/20 to-sky-900/60",
  },
  {
    title: "Basement Finishing",
    description: "Unlock hidden square footage. Home theaters, gyms, guest suites, or offices — we turn unused space into your favorite room.",
    image: "/finished-basement-theater-bar.png",
    href: "/services/basement-finishing",
    icon: BasementIcon,
    gradient: "from-amber-500/20 to-amber-900/60",
  },
  {
    title: "Custom Decks",
    description: "Extend your living space outdoors with composite or hardwood decks built to handle Pittsburgh's four seasons in style.",
    image: "/custom-composite-deck-with-outdoor-furniture-and-c.jpg",
    href: "/services/deck-building",
    icon: DeckIcon,
    gradient: "from-orange-500/20 to-orange-900/60",
  },
  {
    title: "Home Additions",
    description: "Need more room? Seamless additions that look like they were always there — sunrooms, second stories, and in-law suites.",
    image: "/modern-home-addition-sunroom-with-large-windows.jpg",
    href: "/services/home-additions",
    icon: AdditionIcon,
    gradient: "from-violet-500/20 to-violet-900/60",
  },
  {
    title: "Flooring Installation",
    description: "Hardwood, tile, stone, vinyl, or laminate — expert installation with meticulous attention to detail and flawless transitions.",
    image: "/hardwood-floor-installation-in-living-room.jpg",
    href: "/services/flooring-installation",
    icon: FlooringIcon,
    gradient: "from-rose-500/20 to-rose-900/60",
  },
]

// ─── Animated Card ───────────────────────────────────────────────────

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the animation based on index
          setTimeout(() => setIsVisible(true), index * 120)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-[0.97]"
      }`}
    >
      {/* Image with gradient overlay */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={service.image}
          alt={`${service.title} project in Pittsburgh by ABK Unlimited`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Gradient overlay that intensifies on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} transition-opacity duration-500 opacity-60 group-hover:opacity-80`} />

        {/* SVG Icon - floats in top-right */}
        <div className="absolute top-4 right-4 w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 transition-all duration-500 group-hover:bg-white/20 group-hover:scale-110 group-hover:rotate-3">
          <service.icon className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 transition-colors duration-300 group-hover:text-primary">
          {service.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {service.description}
        </p>
        <Link
          href={service.href}
          className="inline-flex items-center text-sm font-semibold text-primary transition-all duration-300 group-hover:gap-3 gap-1.5"
        >
          Get Started
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Bottom accent line that fills on hover */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-500 ease-out w-0 group-hover:w-full" />
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────

export function Services() {
  return (
    <section id="services" className="py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm font-semibold tracking-wider text-primary uppercase mb-4">
            Our Services
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
            Complete Home Remodeling Services
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            From kitchens to basements, we deliver exceptional craftsmanship across every project type.
          </p>
        </div>

        {/* 3-column, 2-row grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>

        <div className="mt-10 sm:mt-14 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
          >
            View All Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
