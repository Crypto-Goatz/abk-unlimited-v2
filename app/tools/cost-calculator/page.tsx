"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calculator, Info, Phone } from "lucide-react"

const projectTypes = [
  { id: "kitchen", name: "Kitchen Remodel", basePrice: 150, highPrice: 350 },
  { id: "bathroom", name: "Bathroom Remodel", basePrice: 200, highPrice: 450 },
  { id: "basement", name: "Basement Finishing", basePrice: 50, highPrice: 120 },
  { id: "deck", name: "Deck Building", basePrice: 35, highPrice: 100 },
  { id: "addition", name: "Home Addition", basePrice: 200, highPrice: 400 },
  { id: "flooring", name: "Flooring Installation", basePrice: 8, highPrice: 25 },
]

const finishLevels = [
  { id: "budget", name: "Budget-Friendly", multiplier: 0.7 },
  { id: "mid", name: "Mid-Range", multiplier: 1.0 },
  { id: "high", name: "High-End", multiplier: 1.5 },
  { id: "luxury", name: "Luxury", multiplier: 2.0 },
]

export default function CostCalculatorPage() {
  const [projectType, setProjectType] = useState("kitchen")
  const [squareFeet, setSquareFeet] = useState(200)
  const [finishLevel, setFinishLevel] = useState("mid")

  const project = projectTypes.find((p) => p.id === projectType)!
  const finish = finishLevels.find((f) => f.id === finishLevel)!

  const lowEstimate = Math.round(squareFeet * project.basePrice * finish.multiplier)
  const highEstimate = Math.round(squareFeet * project.highPrice * finish.multiplier)

  return (
    <>
      <Header siteName={process.env.NEXT_PUBLIC_SITE_NAME || "ABK Unlimited"} phone={process.env.NEXT_PUBLIC_SITE_PHONE} />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-16 bg-secondary">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <Link href="/tools" className="text-primary hover:underline text-sm font-medium mb-4 inline-block">
                ← Back to Tools
              </Link>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <span className="text-white/70">Free Tool</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Project Cost Calculator</h1>
              <p className="text-xl text-white/80">
                Get an instant estimate for your home remodeling project. Adjust the options below to see approximate
                costs based on Pittsburgh market rates.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Inputs */}
              <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-8">Project Details</h2>

                {/* Project Type */}
                <div className="mb-8">
                  <Label className="text-base font-semibold mb-4 block">What type of project?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {projectTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setProjectType(type.id)}
                        className={`p-4 rounded-xl text-left transition-all ${
                          projectType === type.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        <span className="font-medium">{type.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Square Feet */}
                <div className="mb-8">
                  <Label className="text-base font-semibold mb-4 block">Project Size (square feet)</Label>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="50"
                      max="2000"
                      step="10"
                      value={squareFeet}
                      onChange={(e) => setSquareFeet(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">50 sq ft</span>
                      <span className="text-2xl font-bold text-primary">{squareFeet} sq ft</span>
                      <span className="text-muted-foreground">2,000 sq ft</span>
                    </div>
                  </div>
                </div>

                {/* Finish Level */}
                <div className="mb-8">
                  <Label className="text-base font-semibold mb-4 block">Finish Level</Label>
                  <div className="space-y-2">
                    {finishLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setFinishLevel(level.id)}
                        className={`w-full p-4 rounded-xl text-left transition-all flex justify-between items-center ${
                          finishLevel === level.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        <span className="font-medium">{level.name}</span>
                        <span className="text-sm opacity-70">{level.multiplier}x base</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-8">
                <div className="bg-primary rounded-2xl p-8 text-white">
                  <h2 className="text-xl font-bold mb-6">Estimated Cost Range</h2>
                  <div className="text-center mb-6">
                    <p className="text-white/70 text-sm mb-2">Your {project.name} estimate:</p>
                    <p className="text-5xl font-bold">
                      ${lowEstimate.toLocaleString()} - ${highEstimate.toLocaleString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
                    <div className="text-center">
                      <p className="text-white/70 text-sm">Low per sq ft</p>
                      <p className="text-xl font-bold">${Math.round(project.basePrice * finish.multiplier)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/70 text-sm">High per sq ft</p>
                      <p className="text-xl font-bold">${Math.round(project.highPrice * finish.multiplier)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-2xl p-6">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground mb-2">This is an estimate only</p>
                      <p className="text-sm text-muted-foreground">
                        Actual costs vary based on site conditions, material selections, and project specifics. Contact
                        us for a detailed, accurate quote for your project.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-8 border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4">Get an Accurate Quote</h3>
                  <p className="text-muted-foreground mb-6">
                    For a detailed estimate tailored to your specific project, schedule a free consultation with our
                    team.
                  </p>
                  <div className="space-y-3">
                    <Link href="/free-estimate">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Get Free Estimate
                      </Button>
                    </Link>
                    <a href="tel:+14129441683">
                      <Button variant="outline" className="w-full bg-transparent">
                        <Phone className="h-4 w-4 mr-2" />
                        (412) 944-1683
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer siteName={process.env.NEXT_PUBLIC_SITE_NAME || "ABK Unlimited"} phone={process.env.NEXT_PUBLIC_SITE_PHONE} email={process.env.NEXT_PUBLIC_SITE_EMAIL} />
    </>
  )
}
