"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { Button } from "@/components/ui/button"
import { Clock, Info, Phone, Calendar, Hammer } from "lucide-react"

const projectTypes = [
  {
    id: "kitchen-minor",
    name: "Kitchen - Minor Update",
    weeks: { min: 2, max: 4 },
    phases: ["Planning", "Demo", "Installation", "Finishing"],
  },
  {
    id: "kitchen-major",
    name: "Kitchen - Full Remodel",
    weeks: { min: 8, max: 14 },
    phases: ["Design", "Permits", "Demo", "Rough-In", "Cabinets", "Countertops", "Finishing"],
  },
  {
    id: "bathroom-minor",
    name: "Bathroom - Minor Update",
    weeks: { min: 1, max: 3 },
    phases: ["Planning", "Demo", "Installation", "Finishing"],
  },
  {
    id: "bathroom-major",
    name: "Bathroom - Full Remodel",
    weeks: { min: 4, max: 8 },
    phases: ["Design", "Permits", "Demo", "Plumbing", "Tile", "Fixtures", "Finishing"],
  },
  {
    id: "basement",
    name: "Basement Finishing",
    weeks: { min: 6, max: 12 },
    phases: ["Design", "Permits", "Framing", "Electrical", "HVAC", "Drywall", "Flooring", "Finishing"],
  },
  {
    id: "deck",
    name: "Deck Building",
    weeks: { min: 2, max: 6 },
    phases: ["Design", "Permits", "Foundation", "Framing", "Decking", "Railings", "Finishing"],
  },
  {
    id: "addition",
    name: "Home Addition",
    weeks: { min: 12, max: 24 },
    phases: ["Design", "Permits", "Foundation", "Framing", "Roofing", "Rough-In", "Insulation", "Drywall", "Finishing"],
  },
  {
    id: "flooring",
    name: "Flooring (whole house)",
    weeks: { min: 1, max: 3 },
    phases: ["Planning", "Prep", "Installation", "Finishing"],
  },
]

export default function TimelineEstimatorPage() {
  const [selectedProject, setSelectedProject] = useState("kitchen-major")

  const project = projectTypes.find((p) => p.id === selectedProject)!

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
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <span className="text-white/70">Free Tool</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Project Timeline Estimator</h1>
              <p className="text-xl text-white/80">
                See how long your renovation project will take from start to finish. Select your project type to view
                typical timelines and phases.
              </p>
            </div>
          </div>
        </section>

        {/* Estimator */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Selection */}
              <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-8">Select Your Project</h2>
                <div className="space-y-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedProject(type.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all flex justify-between items-center ${
                        selectedProject === type.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      <span className="font-medium">{type.name}</span>
                      <span className="text-sm opacity-70">
                        {type.weeks.min}-{type.weeks.max} weeks
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="space-y-8">
                <div className="bg-primary rounded-2xl p-8 text-white">
                  <h2 className="text-xl font-bold mb-6">Estimated Timeline</h2>
                  <div className="text-center mb-6">
                    <p className="text-white/70 text-sm mb-2">{project.name}</p>
                    <p className="text-5xl font-bold">
                      {project.weeks.min}-{project.weeks.max} weeks
                    </p>
                    <p className="text-white/70 mt-2">
                      ({Math.round(project.weeks.min * 0.25)}-{Math.round(project.weeks.max * 0.25)} months)
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/20">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm">Based on typical Pittsburgh project timelines</span>
                  </div>
                </div>

                {/* Project Phases */}
                <div className="bg-card rounded-2xl p-8 border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-6">Project Phases</h3>
                  <div className="space-y-4">
                    {project.phases.map((phase, index) => (
                      <div key={phase} className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-foreground">{phase}</span>
                        </div>
                        <Hammer className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted rounded-2xl p-6">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground mb-2">Factors that affect timeline</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Permit approval times</li>
                        <li>• Material lead times</li>
                        <li>• Project complexity</li>
                        <li>• Weather (for exterior work)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/free-estimate">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Get Detailed Project Timeline
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
        </section>
      </main>
      <Footer siteName={process.env.NEXT_PUBLIC_SITE_NAME || "ABK Unlimited"} phone={process.env.NEXT_PUBLIC_SITE_PHONE} email={process.env.NEXT_PUBLIC_SITE_EMAIL} />
    </>
  )
}
