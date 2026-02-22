"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  Home,
  Layers,
  PenTool,
  Hammer,
  Calculator,
  Palette,
  Clock,
  Building2,
  HardHat,
} from "lucide-react"

const services = [
  {
    title: "Roofing",
    description: "Replacement & repair",
    icon: Home,
    href: "/services/roofing",
    image: "/custom-new-construction-home-exterior.jpg",
  },
  {
    title: "Remodelling",
    description: "Kitchen, bath & more",
    icon: Hammer,
    href: "/remodelling",
    image: "/modern-kitchen-remodel.png",
  },
  {
    title: "Basement Finishing",
    description: "Transform unused space",
    icon: Layers,
    href: "/services/basement-finishing",
    image: "/finished-basement-living-space.jpg",
  },
  {
    title: "Deck Building",
    description: "Custom outdoor living",
    icon: PenTool,
    href: "/services/deck-building",
    image: "/custom-composite-deck-outdoor-living.jpg",
  },
  {
    title: "Home Additions",
    description: "Expand your living space",
    icon: Building2,
    href: "/services/home-additions",
    image: "/home-addition-seamless-architecture.jpg",
  },
  {
    title: "Custom Homes",
    description: "Build your dream home",
    icon: HardHat,
    href: "/services/custom-homes",
    image: "/custom-home-construction-process.jpg",
  },
]

const freeTools = [
  {
    title: "Project Cost Calculator",
    description: "Estimate your remodeling costs instantly",
    icon: Calculator,
    href: "/tools/cost-calculator",
  },
  {
    title: "Design Inspiration Gallery",
    description: "Browse thousands of project ideas",
    icon: Palette,
    href: "/tools/design-gallery",
  },
  {
    title: "Project Timeline Estimator",
    description: "See how long your project will take",
    icon: Clock,
    href: "/tools/timeline-estimator",
  },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMouseEnter = (menu: string) => {
    setActiveDropdown(menu)
  }

  const handleMouseLeave = () => {
    setActiveDropdown(null)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/98 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/abk-logo.png"
            alt="ABK Unlimited"
            width={180}
            height={48}
            className={`h-10 w-auto transition-all duration-300 ${scrolled ? "" : "brightness-0 invert"}`}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          {/* Services Mega Menu */}
          <div className="relative" onMouseEnter={() => handleMouseEnter("services")} onMouseLeave={handleMouseLeave}>
            <button
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/80 hover:text-white"
              }`}
            >
              Services
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === "services" ? "rotate-180" : ""}`}
              />
            </button>

            {activeDropdown === "services" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                <div className="bg-card rounded-2xl shadow-2xl border border-border p-6 w-[700px] animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                    <div>
                      <h3 className="font-bold text-foreground">Our Services</h3>
                      <p className="text-sm text-muted-foreground">Complete home remodeling solutions</p>
                    </div>
                    <Link href="/services">
                      <Button variant="outline" size="sm">
                        View All Services
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {services.map((service) => (
                      <Link
                        key={service.title}
                        href={service.href}
                        className="group flex items-start gap-4 p-3 rounded-xl hover:bg-muted transition-colors"
                      >
                        <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <service.icon className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                              {service.title}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/portfolio"
            className={`text-sm font-medium transition-colors ${
              scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/80 hover:text-white"
            }`}
          >
            Portfolio
          </Link>

          <Link
            href="/testimonials"
            className={`text-sm font-medium transition-colors ${
              scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/80 hover:text-white"
            }`}
          >
            Testimonials
          </Link>

          {/* Tools Mega Menu */}
          <div className="relative" onMouseEnter={() => handleMouseEnter("tools")} onMouseLeave={handleMouseLeave}>
            <button
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/80 hover:text-white"
              }`}
            >
              Tools
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === "tools" ? "rotate-180" : ""}`}
              />
            </button>

            {activeDropdown === "tools" && (
              <div className="absolute top-full right-0 pt-4">
                <div className="bg-card rounded-2xl shadow-2xl border border-border p-6 w-[400px] animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="mb-4 pb-4 border-b border-border">
                    <h3 className="font-bold text-foreground">Tools & Resources</h3>
                    <p className="text-sm text-muted-foreground">Plan your project with our helpful tools</p>
                  </div>
                  <div className="space-y-1">
                    {freeTools.map((tool) => (
                      <Link
                        key={tool.title}
                        href={tool.href}
                        className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <tool.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors block">
                            {tool.title}
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/tools/visualizer"
            className={`text-sm font-medium transition-colors ${
              scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/80 hover:text-white"
            }`}
          >
            Visualizer
          </Link>
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <a
            href="tel:+14129441683"
            className={`flex items-center gap-2 text-sm font-semibold ${scrolled ? "text-primary" : "text-white"}`}
          >
            <Phone className="h-4 w-4" />
            (412) 944-1683
          </a>
          <Link href="/free-estimate">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
              Free Estimate
            </Button>
          </Link>
        </div>

        <button
          className={`lg:hidden ${scrolled ? "text-foreground" : "text-white"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="px-6 py-6 space-y-4">
            <div className="border-b border-border pb-4">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "mobile-services" ? null : "mobile-services")}
                className="flex items-center justify-between w-full text-foreground/80 hover:text-foreground font-medium py-2"
              >
                Services
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${activeDropdown === "mobile-services" ? "rotate-180" : ""}`}
                />
              </button>
              {activeDropdown === "mobile-services" && (
                <div className="mt-2 ml-4 space-y-2">
                  {services.map((service) => (
                    <Link
                      key={service.title}
                      href={service.href}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary py-1.5"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <service.icon className="h-4 w-4" />
                      {service.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/portfolio"
              className="block text-foreground/80 hover:text-foreground font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Portfolio
            </Link>

            <Link
              href="/testimonials"
              className="block text-foreground/80 hover:text-foreground font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </Link>

            <div className="border-b border-border pb-4">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "mobile-tools" ? null : "mobile-tools")}
                className="flex items-center justify-between w-full text-foreground/80 hover:text-foreground font-medium py-2"
              >
                Tools
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${activeDropdown === "mobile-tools" ? "rotate-180" : ""}`}
                />
              </button>
              {activeDropdown === "mobile-tools" && (
                <div className="mt-2 ml-4 space-y-2">
                  {freeTools.map((tool) => (
                    <Link
                      key={tool.title}
                      href={tool.href}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary py-1.5"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <tool.icon className="h-4 w-4" />
                      {tool.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/tools/visualizer"
              className="block text-foreground/80 hover:text-foreground font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Visualizer
            </Link>

            <div className="pt-4 border-t border-border space-y-3">
              <a href="tel:+14129441683" className="flex items-center gap-2 text-primary font-semibold">
                <Phone className="h-4 w-4" />
                (412) 944-1683
              </a>
              <Link href="/free-estimate">
                <Button className="w-full bg-primary text-primary-foreground">Free Estimate</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
