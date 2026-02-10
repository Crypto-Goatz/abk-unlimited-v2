import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { Calculator, Clock, Palette, ArrowRight, Wand2 } from "lucide-react"
import { getSiteConfig } from "@/config/site.config"

export const metadata: Metadata = {
  title: "Free Tools | ABK Unlimited Pittsburgh Home Remodeling",
  description:
    "Free home remodeling tools from ABK Unlimited. Project cost calculator, timeline estimator, and design inspiration gallery for Pittsburgh homeowners.",
}

const tools = [
  {
    title: "AI Home Visualizer",
    description: "Upload a photo of your room or home and see AI-powered design transformations instantly.",
    href: "/tools/visualizer",
    icon: Wand2,
    color: "bg-gradient-to-br from-primary to-accent",
    featured: true,
  },
  {
    title: "Project Cost Calculator",
    description: "Get instant estimates for your remodeling project based on room size, scope, and finish level.",
    href: "/tools/cost-calculator",
    icon: Calculator,
    color: "bg-primary",
  },
  {
    title: "Timeline Estimator",
    description: "See how long your renovation project will take from design to completion.",
    href: "/tools/timeline-estimator",
    icon: Clock,
    color: "bg-accent",
  },
  {
    title: "Design Gallery",
    description: "Browse thousands of design ideas and inspiration for your home remodeling project.",
    href: "/tools/design-gallery",
    icon: Palette,
    color: "bg-secondary",
  },
]

export default function ToolsPage() {
  const config = getSiteConfig();
  return (
    <>
      <Header siteName={config.name} phone={config.phone} />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-16 bg-secondary">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
                Free Tools
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Plan Your Project with Our Free Tools</h1>
              <p className="text-xl text-white/80">
                Use our free planning tools to estimate costs, understand timelines, and find design inspiration for
                your next home remodeling project.
              </p>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`group ${'featured' in tool && tool.featured ? 'md:col-span-2 lg:col-span-2' : ''}`}
                >
                  <div className={`bg-card rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-border h-full ${'featured' in tool && tool.featured ? 'ring-2 ring-primary/20' : ''}`}>
                    {'featured' in tool && tool.featured && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
                        NEW - AI Powered
                      </span>
                    )}
                    <div
                      className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <tool.icon className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {tool.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">{tool.description}</p>
                    <span className="text-primary font-medium flex items-center gap-2">
                      {'featured' in tool && tool.featured ? 'Try It Free' : 'Use Tool'} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer siteName={config.name} phone={config.phone} email={config.email} />
    </>
  )
}
